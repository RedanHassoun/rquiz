package com.raiseup.rquiz.services;

import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.models.QuizAssignmentRequest;

public interface QuizAssignmentService {
    void assignToUser(QuizAssignmentRequest quizAssignmentRequest) throws AppException;
}
