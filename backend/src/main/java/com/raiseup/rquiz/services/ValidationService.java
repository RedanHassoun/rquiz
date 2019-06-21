package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.BaseModel;
import com.raiseup.rquiz.models.Quiz;

import java.util.List;
import java.util.Optional;

public interface ValidationService {
    Optional<List<String>> validateObject(BaseModel beanObject);
    Optional<List<String>> validateQuiz(Quiz quizObject);
    String buildValidationMessage(List<String> validations);
}
