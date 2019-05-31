package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.services.QuizService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/quiz")
@CrossOrigin
public class QuizController {
    private QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @GetMapping("/all")
    public List<Quiz> getQuizList(@RequestParam(required = false) Boolean isPublic){
        try{
            List<Quiz> result = this.quizService.readAll().stream()
                    .filter(q -> (isPublic == null) ||  (isPublic && q.isPublic()) || (!isPublic && !q.isPublic()))
                    .collect(Collectors.toList());
            return result;
        }catch (Exception ex){
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR, "Cant fetch quiz list", ex);
        }
    }
}
