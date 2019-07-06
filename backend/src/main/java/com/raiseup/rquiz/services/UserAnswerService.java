package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AnswerAlreadyExistException;
import com.raiseup.rquiz.exceptions.QuizNotFoundException;
import com.raiseup.rquiz.exceptions.UserNotFoundException;
import com.raiseup.rquiz.models.QuizAnswer;
import com.raiseup.rquiz.models.UserAnswer;

public interface UserAnswerService {
    public UserAnswer create(String quizId, String userId, QuizAnswer quizAnswer)
            throws QuizNotFoundException, UserNotFoundException, AnswerAlreadyExistException;
}
