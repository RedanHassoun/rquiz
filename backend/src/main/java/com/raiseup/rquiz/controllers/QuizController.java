package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.services.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/quiz")
@CrossOrigin
public class QuizController {
    private QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/all")
    public List<Quiz> getQuizList(){
        try{
            return new ArrayList<>(this.quizService.readAll());
        }catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cant fetch quiz list", ex);
        }
    }
}
