package com.raiseup.rquiz.models.db;

import com.raiseup.rquiz.common.AppConstants.*;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Objects;

@Entity
@Table(name = DBConsts.USER_ANSWER_TABLE_NAME)
@Access(AccessType.FIELD)
public class UserAnswer extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name="id")
    private String id;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private Quiz quiz;

    @ManyToOne
    @JoinColumn
    private User user;

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public QuizAnswer getQuizAnswer() {
        return quizAnswer;
    }

    public void setQuizAnswer(QuizAnswer quizAnswer) {
        this.quizAnswer = quizAnswer;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserAnswer that = (UserAnswer) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getQuiz(), that.getQuiz());
    }

    @Override
    public int hashCode() {

        return Objects.hash(getId(), getQuiz());
    }
}
