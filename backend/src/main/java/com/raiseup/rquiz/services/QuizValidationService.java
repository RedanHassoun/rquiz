package com.raiseup.rquiz.services;

import com.raiseup.rquiz.models.QuizAnswerDto;
import com.raiseup.rquiz.models.QuizDto;
import java.util.List;
import java.util.Optional;

public interface QuizValidationService extends ValidationService {
    Optional<List<String>> validateQuiz(QuizDto quizObject);
    Optional<List<String>> validateUserAnswer(QuizAnswerDto quizAnswer, String quizId);
}
