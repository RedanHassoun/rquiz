package com.raiseup.rquiz.models;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
public class QuizAssignmentRequest {
    private String quizId;
    private String userId;
    private String assignerId;
}
