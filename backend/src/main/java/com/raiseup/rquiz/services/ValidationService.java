package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseDto;
import com.raiseup.rquiz.models.QuizAnswerDto;
import com.raiseup.rquiz.models.QuizDto;
import com.raiseup.rquiz.models.db.BaseModel;
import com.raiseup.rquiz.models.db.Quiz;
import com.raiseup.rquiz.models.db.QuizAnswer;

import java.util.List;
import java.util.Optional;

public interface ValidationService {
    Optional<List<String>> validateObject(BaseDto beanObject);
    Optional<List<String>> validateQuiz(QuizDto quizObject);
    Optional<List<String>> validateUserAnswer(QuizAnswerDto quizAnswer, String quizId);
    Optional<String> validateString(String toValidate, String name);
    String buildValidationMessage(List<String> validations);
}
