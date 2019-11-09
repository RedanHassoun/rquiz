package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.AppUtils;
import com.raiseup.rquiz.exceptions.AnswerAlreadyExistException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.models.QuizAnswer;
import com.raiseup.rquiz.models.UserAnswer;
import com.raiseup.rquiz.services.UserAnswerService;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.ValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import org.apache.commons.lang.exception.ExceptionUtils;


@RestController
@RequestMapping("/api/v1/quiz")
@CrossOrigin
public class QuizController {
    private QuizService quizService;
    private UserAnswerService userAnswerService;
    private ValidationService validationService;
    private Logger logger = LoggerFactory.getLogger(QuizController.class);

    public QuizController(QuizService quizService,
                          UserAnswerService userAnswerService,
                          ValidationService validationService) {
        this.quizService = quizService;
        this.userAnswerService = userAnswerService;
        this.validationService = validationService;
    }

    @PostMapping(path = "",
                consumes = "application/json",
                produces = "application/json")
    public Quiz createQuiz(@RequestBody Quiz quiz) {
        this.logger.debug("Creating quiz: " + quiz.toString());
        try{
            Optional<List<String>> validations = this.validationService.validateQuiz(quiz);

            if(validations.isPresent()){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        this.validationService.buildValidationMessage(validations.get()));
            }

            // TODO : return status 201
            return this.quizService.create(quiz);
        } catch (ResponseStatusException ex){
            logger.error("Cannot create quiz. " + ex.toString());
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot create quiz. " + ex.toString());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot create quiz object", ex);
        }
    }

    @GetMapping("/all")
    public List<Quiz> getQuizList(@RequestParam(required = false) Boolean isPublic,
                                  @RequestParam(required = false) Integer page,
                                  @RequestParam(required = false) Integer size){
        try{
            this.logger.debug(String.format("Getting all quiz list. page: %d size: %d", page, size));

            if(!AppUtils.isPaginationParamsValid(page, size)){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "In order to use pagination you must provide both page and size");
            }

            return new ArrayList<>(this.quizService.readAll(isPublic, size, page));

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

    @PostMapping(path = "/{id}/answer",
            consumes = "application/json",
            produces = "application/json")
    public UserAnswer solve(@RequestHeader("Authorization") String authorization,
                            @PathVariable("id") String quizId,
                            @RequestBody QuizAnswer quizAnswer){
        try {
            Optional<List<String>> validations = this.validationService.validateUserAnswer(quizAnswer, quizId);
            if(validations.isPresent()){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        this.validationService.buildValidationMessage(validations.get()));
            }

            // TODO: need to check if the answer exists on the quiz
            String userId = AppUtils.getUserIdFromAuthorizationHeader(authorization);
            return this.userAnswerService.create(quizId, userId, quizAnswer);
        }catch (QuizNotFoundException | UserNotFoundException ex){
            final String errorMsg = String.format("Quiz %s was not found", quizId);
            this.logger.error(errorMsg);
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    ex.getMessage());
        } catch (AnswerAlreadyExistException ex){
            final String errorMsg = "Quiz already answered.";
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
    public List<UserAnswer> getQuizUserAnswers(@PathVariable("id") String quizId){
        try{
            return this.userAnswerService.getUserAnswersForQuiz(quizId);

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
