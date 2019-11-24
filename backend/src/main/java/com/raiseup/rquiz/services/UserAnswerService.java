package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.models.db.QuizAnswer;
import com.raiseup.rquiz.models.db.UserAnswer;
import java.util.List;
import java.util.Optional;

public interface UserAnswerService {
    UserAnswer create(String quizId, String userId, QuizAnswer quizAnswer) throws AppException;
    List<UserAnswer> getUserAnswersForQuiz(String quizId);
    Optional<Integer> getCorrectCount(List<UserAnswer> userAnswers);
}
