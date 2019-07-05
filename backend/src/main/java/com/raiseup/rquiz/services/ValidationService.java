package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseModel;
import com.raiseup.rquiz.models.Quiz;
import com.raiseup.rquiz.models.QuizAnswer;
import com.raiseup.rquiz.models.UserAnswer;

import java.util.List;
import java.util.Optional;

public interface ValidationService {
    Optional<List<String>> validateObject(BaseModel beanObject);
    Optional<List<String>> validateQuiz(Quiz quizObject);
    Optional<List<String>> validateUserAnswer(QuizAnswer quizAnswer, String quizId);
    Optional<String> validateString(String toValidate, String name);
    String buildValidationMessage(List<String> validations);
}
