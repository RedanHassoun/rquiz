package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.ValidationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;

@RestController
@RequestMapping("/quiz")
@CrossOrigin
public class QuizController {
    private QuizService quizService;
    private ValidationService validationService;
    private Logger logger = LoggerFactory.getLogger(QuizController.class);

    public QuizController(QuizService quizService,
                          ValidationService validationService) {
        this.quizService = quizService;
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

            if(page == null && size == null){
                Collection<Quiz> res = this.quizService.readAll(isPublic);
                return new ArrayList<>(res);
            }

            if(page == null || size == null){
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "In order to use pagination you must provide both page and size");
            }

            return new ArrayList<>(this.quizService.readAll(isPublic, size, page));

        } catch (ResponseStatusException ex){
            logger.error("Cannot fetch quiz list." + ex.toString());
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot fetch quiz list." + ex.toString());
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
            logger.error("Cannot get quiz. " + ex.toString());
            throw ex;
        } catch (Exception ex){
            logger.error("Cannot get quiz. " + ex.toString());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot get quiz object", ex);
        }

    }
}
