package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AnswerAlreadyExistException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.QuizAnswer;
import com.raiseup.rquiz.models.UserAnswer;
import java.util.List;
import java.util.Optional;

public interface UserAnswerService {
    UserAnswer create(String quizId, String userId, QuizAnswer quizAnswer)
            throws QuizNotFoundException, UserNotFoundException, AnswerAlreadyExistException;
    List<UserAnswer> getUserAnswersForQuiz(String quizId);
    Optional<Integer> getCorrectCount(List<UserAnswer> userAnswers);
}
