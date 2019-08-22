package com.raiseup.rquiz.models;

import com.raiseup.rquiz.common.AppConstants.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.LazyInitializationException;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Access(AccessType.FIELD)
@Table(name = DBConsts.QUIZ_TABLE_NAME)
@Getter
@Setter
public class Quiz extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name=DBConsts.QUIZ_ID)
    private String id;

    @NotNull(message = "Title cannot be null")
    @Size(max = 512)
    private String title;

    @Lob
    private String description;

    private String imageUrl;

    @Column(nullable = false)
    @NotNull(message = "public property cannot be null")
    private Boolean isPublic;

    private String assignedUsers;

    @Column(nullable = false)
    @NotNull(message = "Creator id cannot be null")
    private String creatorId;

    @OneToMany(mappedBy = "quiz",
               cascade = CascadeType.ALL)
    private Set<QuizAnswer> answers = new HashSet<>();

    @OneToMany(mappedBy = "quiz",
               cascade = CascadeType.ALL)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    public void addQuizAnswer(QuizAnswer quizAnswer) {
        quizAnswer.setQuiz(this);
        this.answers.add(quizAnswer);
    }

    @Override
    public String toString(){
        List<String> answers;
        try {
            answers = Arrays.stream(this.answers.toArray())
                    .map(item -> ((QuizAnswer)item).getContent())
                    .collect(Collectors.toList());
        }
        catch(LazyInitializationException ex){
            answers = new ArrayList<>();
        }
        return String.format("[ quiz id: %s , title: %s, creator id: %s, answers: %s]",
                this.id,this.title,this.creatorId, String.join(",", answers));
    }
}
