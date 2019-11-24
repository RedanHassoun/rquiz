package com.raiseup.rquiz.models.db;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.raiseup.rquiz.common.AppConstants.*;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = DBConsts.QUIZ_ANSWER_TABLE_NAME)
@Access(AccessType.FIELD)
public class QuizAnswer extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name=DBConsts.QUIZ_ANSWER_ID)
    private String id;

    @NotNull(message = "Content cannot be null")
    @Column(nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private Quiz quiz;

    @NotNull(message = "is-correct cannot be null")
    @Column(nullable = false)
    private Boolean isCorrect;

    @OneToMany(mappedBy = "quizAnswer",
               cascade = CascadeType.ALL)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Quiz getQuiz() { return quiz; }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
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

    public void setIsCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public Set<UserAnswer> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(Set<UserAnswer> userAnswers) {
        this.userAnswers = userAnswers;
    }
}