package com.raiseup.rquiz.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.raiseup.rquiz.common.AppConstants.*;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;

@Entity
@Table(name = DBConsts.USER_ANSWER_TABLE_NAME)
@Access(AccessType.FIELD)
public class UserAnswer extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private Quiz quiz;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private ApplicationUser applicationUser;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
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

    public ApplicationUser getApplicationUser() {
        return applicationUser;
    }

    public void setApplicationUser(ApplicationUser applicationUser) {
        this.applicationUser = applicationUser;
    }

    public QuizAnswer getQuizAnswer() {
        return quizAnswer;
    }

    public void setQuizAnswer(QuizAnswer quizAnswer) {
        this.quizAnswer = quizAnswer;
    }
}
