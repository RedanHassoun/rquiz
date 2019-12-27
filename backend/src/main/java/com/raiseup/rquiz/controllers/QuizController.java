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
    public ResponseEntity<QuizDto> createQuiz(@RequestBody QuizDto quizDto) throws Exception {
        Quiz quiz = this.dtoMapper.convertQuizDtoToEntity(quizDto);
        this.logger.debug("Creating quiz: " + quiz.toString());
        try{
            Optional<List<String>> validations = this.validationService.validateQuiz(quiz);

            if(validations.isPresent()){
                throw new IllegalOperationException(
                        this.validationService.buildValidationMessage(validations.get()));
            }

            Quiz quizFromDB = this.quizService.create(quiz);
            QuizDto quizToReturn = this.dtoMapper.convertQuizToDto(quizFromDB);
            return new ResponseEntity<>(quizToReturn, HttpStatus.CREATED);
        } catch (Exception ex){
            this.logger.error(String.format("Cannot create quiz: %s",
                    quizDto != null ? quizDto.toString() : ""), ex);
            throw ex;
        }
    }

    @GetMapping("/all")
    public List<QuizDto> getQuizList(@RequestParam(required = false) Boolean isPublic,
                                     @RequestParam(required = false) Integer page,
                                     @RequestParam(required = false) Integer size) throws Exception {
        try{
            this.logger.debug(String.format("Getting all quiz list. page: %d size: %d", page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)) {
                throw new IllegalOperationException(
                        "In order to use pagination you must provide both page and size");
            }

            return this.quizService.readAll(isPublic, size, page)
                    .stream()
                    .map(quiz -> this.dtoMapper.convertQuizToDto(quiz))
                    .collect(Collectors.toList());
        } catch (Exception ex){
            this.logger.error(String.format("Cannot fetch quiz list. isPublic=%b, page=%d, size=%d",
                                isPublic, page, size), ex);
            throw ex;
        }
    }

    @GetMapping(path = "{id}",
            produces = "application/json")
    public QuizDto findQuiz(@PathVariable("id") String quizId) throws Exception {
        try {
            this.logger.debug(String.format("Reading quiz: %s", quizId));
            Optional<String> validation = this.validationService.validateString(quizId, "Quiz id");

            if(validation.isPresent()){
                throw new IllegalOperationException(validation.get());
            }

            Optional<Quiz> quizOptional = this.quizService.read(quizId);

            if(!quizOptional.isPresent()){
                logger.error(String.format("Quiz %s not found", quizId));
                throw new QuizNotFoundException(String.format("Quiz %s not found", quizId));
            }

            return this.dtoMapper.convertQuizToDto(quizOptional.get());
        }catch (Exception ex) {
            this.logger.error(String.format("Cannot get quiz %s", quizId), ex);
            throw ex;
        }
    }

    @DeleteMapping(path = "{id}",
            produces = "application/json")
    public ResponseEntity deleteQuiz(@PathVariable("id") String quizId) throws Exception {
        this.logger.debug(String.format("Deleting quiz: %s", quizId));

        try{
            Optional<String> validation = this.validationService.validateString(quizId, "Quiz id");

            if(validation.isPresent()){
                throw new IllegalOperationException(validation.get());
            }

            this.quizService.delete(quizId);
            this.logger.info(String.format("Quiz %s has been deleted", quizId));

            return new ResponseEntity(HttpStatus.OK);
        } catch (Exception ex){
            this.logger.error(String.format("Cannot delete quiz %s", quizId), ex);
            throw ex;
        }
    }

    @PostMapping(path = "/{id}/answer",
            consumes = "application/json",
            produces = "application/json")
    public QuizDto solve(@RequestHeader("Authorization") String authorization,
                         @PathVariable("id") String quizId,
                         @RequestBody QuizAnswerDto quizAnswerDto) throws Exception {
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
        } catch (Exception ex){
            String quizAnswerToAdd = quizAnswerDto != null ? quizAnswerDto.toString() : "";
            this.logger.error(String.format("Cannot add answer %s for quiz %s",
                                quizAnswerToAdd, quizId), ex);
            throw ex;
        }
    }


    @GetMapping(path = "/{id}/user-answer",
            consumes = "application/json",
            produces = "application/json")
    public List<UserAnswerDto> getQuizUserAnswers(@PathVariable("id") String quizId) throws Exception {
        try{
            List<UserAnswer> userAnswers = this.userAnswerService.getUserAnswersForQuiz(quizId);

            return userAnswers.stream()
                    .map(userAnswer -> this.dtoMapper.convertUserAnswerToDto(userAnswer))
                    .collect(Collectors.toList());
        } catch (Exception ex){
            this.logger.error(String.format("Cannot get user answers for quiz %s", quizId), ex);
            throw ex;
        }
    }
}
