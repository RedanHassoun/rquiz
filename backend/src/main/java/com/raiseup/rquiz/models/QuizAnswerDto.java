package com.raiseup.rquiz.models;

import javax.validation.constraints.NotNull;

public class QuizAnswerDto extends BaseDto{
    private String id;
    @NotNull(message = "Content cannot be null")
    private String content;
    private String quizId;
    private Boolean isCorrect;

    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    @Override
    public String toString() {
        return "QuizAnswerDto{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", quizId='" + quizId + '\'' +
                '}';
    }
}
