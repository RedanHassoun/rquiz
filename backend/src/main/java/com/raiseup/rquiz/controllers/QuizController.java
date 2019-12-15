package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.exceptions.*;
import com.raiseup.rquiz.models.QuizAnswerDto;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.UserAnswerDto;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.models.db.UserAnswer;
import com.raiseup.rquiz.services.UserAnswerService;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.ValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;
import org.apache.commons.lang.exception.ExceptionUtils;


@RestController
@RequestMapping("/api/v1/quiz")
@CrossOrigin
public class QuizController {
    private QuizService quizService;
    private UserAnswerService userAnswerService;
    private ValidationService validationService;
    private DtoMapper dtoMapper;

    private Logger logger = LoggerFactory.getLogger(QuizController.class);

    public QuizController(QuizService quizService,
                          UserAnswerService userAnswerService,
                          ValidationService validationService,
                          DtoMapper dtoMapper) {
        this.quizService = quizService;
        this.userAnswerService = userAnswerService;
        this.validationService = validationService;
        this.dtoMapper = dtoMapper;
    }

    @PostMapping(path = "",
                consumes = "application/json",
                produces = "application/json")
    public ResponseEntity<QuizDto> createQuiz(@RequestBody QuizDto quizDto) {
        Quiz quiz = this.dtoMapper.convertQuizDtoToEntity(quizDto);
        this.logger.debug("Creating quiz: " + quiz.toString());
        try{
            Optional<List<String>> validations = this.validationService.validateQuiz(quiz);

            if(validations.isPresent()){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        this.validationService.buildValidationMessage(validations.get()));
            }

            Quiz quizFromDB = this.quizService.create(quiz);
            QuizDto quizToReturn = this.dtoMapper.convertQuizToDto(quizFromDB);
            return new ResponseEntity<>(quizToReturn, HttpStatus.CREATED);
        } catch (IllegalOperationException ex ) {
            logger.error("Cannot create quiz. ", ex);
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    ex.getMessage());
        } catch (ResponseStatusException ex){
            logger.error("Cannot create quiz. ", ex);
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot create quiz. ", ex);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot create quiz object", ex);
        }
    }

    @GetMapping("/all")
    public List<QuizDto> getQuizList(@RequestParam(required = false) Boolean isPublic,
                                     @RequestParam(required = false) Integer page,
                                     @RequestParam(required = false) Integer size){
        try{
            this.logger.debug(String.format("Getting all quiz list. page: %d size: %d", page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "In order to use pagination you must provide both page and size");
            }

            return this.quizService.readAll(isPublic, size, page)
                    .stream()
                    .map(quiz -> this.dtoMapper.convertQuizToDto(quiz))
                    .collect(Collectors.toList());
        } catch (ResponseStatusException ex){
            logger.error("Cannot fetch quiz list." + ExceptionUtils.getStackTrace(ex));
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot fetch quiz list." + ExceptionUtils.getStackTrace(ex));
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch quiz list", ex);
        }
    }

    @GetMapping(path = "{id}",
            produces = "application/json")
    public Quiz findQuiz(@PathVariable("id") String quizId) {
        this.logger.debug(String.format("Reading quiz: %s", quizId));

        try{
            Optional<String> validation = this.validationService.validateString(quizId, "Quiz id");

            if(validation.isPresent()){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        validation.get());
            }

            Optional<Quiz> quizOptional = this.quizService.read(quizId);

            if(!quizOptional.isPresent()){
                logger.error(String.format("Quiz %s not found", quizId));
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Quiz not found");
            }

            return quizOptional.get();
        } catch (ResponseStatusException ex){
            logger.error("Cannot get quiz. " + ExceptionUtils.getStackTrace(ex));
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot get quiz. " + ExceptionUtils.getStackTrace(ex));
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot get quiz object", ex);
        }
    }

    @DeleteMapping(path = "{id}",
            produces = "application/json")
    public ResponseEntity deleteQuiz(@PathVariable("id") String quizId) {
        this.logger.debug(String.format("Deleting quiz: %s", quizId));

        try{
            Optional<String> validation = this.validationService.validateString(quizId, "Quiz id");

            if(validation.isPresent()){
                throw new IllegalOperationException(validation.get());
            }

            this.quizService.delete(quizId);
            this.logger.info(String.format("Quiz %s has been deleted", quizId));

            return new ResponseEntity(HttpStatus.OK);
        } catch (IllegalOperationException | QuizNotFoundException ex){
            this.logger.error(String.format("Cannot delete quiz. error: %s",
                    ExceptionUtils.getStackTrace(ex)));

            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (Exception ex){
            this.logger.error(String.format("Cannot delete quiz. error: %s",
                    ExceptionUtils.getStackTrace(ex)));

            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot get quiz object", ex);
        }
    }

    @PostMapping(path = "/{id}/answer",
            consumes = "application/json",
            produces = "application/json")
    public QuizDto solve(@RequestHeader("Authorization") String authorization,
                         @PathVariable("id") String quizId,
                         @RequestBody QuizAnswerDto quizAnswerDto){
        try {
            QuizAnswer quizAnswer = this.dtoMapper.convertQuizAnswerDtoToEntity(quizAnswerDto);
            Optional<List<String>> validations = this.validationService.validateUserAnswer(quizAnswer, quizId);
            if(validations.isPresent()){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        this.validationService.buildValidationMessage(validations.get()));
            }

            String userId = AppUtils.getUserIdFromAuthorizationHeader(authorization);
            this.userAnswerService.create(quizId, userId, quizAnswer);
            Optional<Quiz> quizOptional = this.quizService.read(quizId);

            return this.dtoMapper.convertQuizToDto(quizOptional.get());
        }catch (QuizNotFoundException | UserNotFoundException ex){
            final String errorMsg = String.format("Quiz %s was not found", quizId);
            this.logger.error(errorMsg);
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    ex.getMessage());
        } catch (AnswerAlreadyExistException | IllegalOperationException ex){
            final String errorMsg = String.format("Cannot add quiz answer, error: %s", ex.getMessage());
            this.logger.error(errorMsg);
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    errorMsg);
        } catch (Exception ex){
            final String errorMsg =
                    String.format("Cannot add answer for quiz %s. error: %s",
                                    quizId, ExceptionUtils.getStackTrace(ex));
            logger.error(errorMsg);
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, errorMsg, ex);
        }
    }


    @GetMapping(path = "/{id}/user-answer",
            consumes = "application/json",
            produces = "application/json")
    public List<UserAnswerDto> getQuizUserAnswers(@PathVariable("id") String quizId){
        try{
            List<UserAnswer> userAnswers = this.userAnswerService.getUserAnswersForQuiz(quizId);

            return userAnswers.stream()
                    .map(userAnswer -> this.dtoMapper.convertUserAnswerToDto(userAnswer))
                    .collect(Collectors.toList());
        } catch (ResponseStatusException ex){
            logger.error("Cannot fetch quiz list." + ExceptionUtils.getStackTrace(ex));
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot fetch quiz list." + ExceptionUtils.getStackTrace(ex));
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot fetch quiz list", ex);
        }
    }
}
