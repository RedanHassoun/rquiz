package com.raiseup.rquiz.models;

import com.raiseup.rquiz.common.AppConstants.*;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "quiz")
public class Quiz extends BaseModel{

    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Id
    @Column(name=ColumnNames.QUIZ_ID)
    private String id;

    @NotNull(message = "Title cannot be null")
    @Size(max = 256)
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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "quiz_id", referencedColumnName = "quiz_id")
    private Set<QuizAnswer> answers = new HashSet<>();

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = ColumnNames.QUIZ_ID, referencedColumnName = ColumnNames.QUIZ_ID)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    public String getId() {
        return id;
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

    public void setAnswers(Set<QuizAnswer> answers) {
        this.answers = answers;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getAssignedUsers() {
        return assignedUsers;
    }

    public void setAssignedUsers(String assignedUsers) {
        this.assignedUsers = assignedUsers;
    }

    public String getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(String creatorId) {
        this.creatorId = creatorId;
    }

    public Set<UserAnswer> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(Set<UserAnswer> userAnswers) {
        this.userAnswers = userAnswers;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Quiz quiz = (Quiz) o;
        return Objects.equals(id, quiz.id) &&
                Objects.equals(creatorId, quiz.creatorId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, creatorId);
    }

    @Override
    public String toString(){
        return String.format("[ quiz id: %s , title: %s, creator id: %s]",
                this.id,this.title,this.creatorId);
    }
}
