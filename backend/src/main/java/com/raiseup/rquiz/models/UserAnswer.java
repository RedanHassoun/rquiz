package com.raiseup.rquiz.models;

import com.raiseup.rquiz.common.AppConstants.*;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name = "quiz_user_answer")
public class UserAnswer extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @JoinColumn(name = ColumnNames.QUIZ_ID, nullable = false)
    private Quiz quiz;

    @JoinColumn(name = ColumnNames.USER_ID, nullable = false)
    private ApplicationUser user;

    @JoinColumn(name = ColumnNames.QUIZ_ANSWER_ID, nullable = false)
    private QuizAnswer quizAnswer;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public ApplicationUser getUser() {
        return user;
    }

    public void setUser(ApplicationUser user) {
        this.user = user;
    }

    public QuizAnswer getQuizAnswer() {
        return quizAnswer;
    }

    public void setQuizAnswer(QuizAnswer quizAnswer) {
        this.quizAnswer = quizAnswer;
    }
}
