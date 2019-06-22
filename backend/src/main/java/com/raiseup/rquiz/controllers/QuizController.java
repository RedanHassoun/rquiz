package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.services.QuizService;
import com.raiseup.rquiz.services.ValidationService;
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

    public QuizController(QuizService quizService,
                          ValidationService validationService) {
        this.quizService = quizService;
        this.validationService = validationService;
    }

    @PostMapping(path = "",
                consumes = "application/json",
                produces = "application/json")
    public Quiz createQuiz(@RequestBody Quiz quiz) {
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
            throw ex;
        } catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cannot create quiz object", ex);
        }

    }

    @GetMapping("/all")
    public List<Quiz> getQuizList(@RequestParam(required = false) Boolean isPublic,
                                  @RequestParam(required = false) Integer page,
                                  @RequestParam(required = false) Integer size){
        try{
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
            throw ex;
        } catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cant fetch quiz list", ex);
        }
    }
}
