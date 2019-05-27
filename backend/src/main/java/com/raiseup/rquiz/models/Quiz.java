package com.raiseup.rquiz.models;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.Column;
import java.util.Objects;

@Entity
@Table(name = "quizzes")
public class Quiz {
    @Id
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    @Column(nullable = false)
    private boolean isPublic;
    private String assignedUsers;
    @Column(nullable = false)
    private String creatorId;

    public String getId() {
        return id;
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

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean aPublic) {
        isPublic = aPublic;
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
