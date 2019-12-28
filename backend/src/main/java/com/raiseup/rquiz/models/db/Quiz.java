package com.raiseup.rquiz.models.db;

import com.raiseup.rquiz.common.AppConstants.*;
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

    @ManyToMany
    @JoinTable(
            name = DBConsts.TABLE_USER_QUIZ_ASSIGNMENT,
            joinColumns = @JoinColumn(name = DBConsts.QUIZ_ID),
            inverseJoinColumns = @JoinColumn(name = DBConsts.USER_ID))
    private Set<User> assignedUsers;

    @ManyToOne
    @JoinColumn(name=DBConsts.QUIZ_CREATOR_FIELD, nullable=false)
    private User creator;

    @OneToMany(mappedBy = DBConsts.QUIZ_FIELD,
               cascade = CascadeType.ALL)
    private Set<QuizAnswer> answers = new HashSet<>();

    @Transient
    private Integer numberOfCorrectAnswers;

    @Transient
    private Integer totalNumberOfAnswers;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public User getCreator() {
        return creator;
    }

    public void setCreator(User creator) {
        this.creator = creator;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean aPublic) {
        isPublic = aPublic;
    }

    public Set<QuizAnswer> getAnswers() {
        return answers;
    }

    public void addQuizAnswer(QuizAnswer quizAnswer) {
        quizAnswer.setQuiz(this);
        this.answers.add(quizAnswer);
    }

    public Integer getNumberOfCorrectAnswers() {
        return numberOfCorrectAnswers;
    }

    public void setNumberOfCorrectAnswers(Integer numberOfCorrectAnswers) {
        this.numberOfCorrectAnswers = numberOfCorrectAnswers;
    }

    public Integer getTotalNumberOfAnswers() {
        return totalNumberOfAnswers;
    }

    public void setTotalNumberOfAnswers(Integer totalNumberOfAnswers) {
        this.totalNumberOfAnswers = totalNumberOfAnswers;
    }

    public Set<User> getAssignedUsers() {
        return assignedUsers;
    }

    public void setAssignedUsers(Set<User> assignedUsers) {
        this.assignedUsers = assignedUsers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Quiz quiz = (Quiz) o;
        return Objects.equals(id, quiz.id) &&
                Objects.equals(this.creator.getId(), quiz.getCreator().getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id, this.creator.getId());
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
                this.id,this.title,this.creator.getId(), String.join(",", answers));
    }
}
