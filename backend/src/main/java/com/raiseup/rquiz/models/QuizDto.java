package com.raiseup.rquiz.models;

import java.util.HashSet;
import java.util.Set;

public class QuizDto extends BaseDto {
    private String id;
    private String title;
    private String description;
    private String imageUrl;
    private Boolean isPublic;
    private UserDto creator;
    private Integer numberOfCorrectAnswers;
    private Integer totalNumberOfAnswers;
    private Set<QuizAnswerDto> answers = new HashSet<>();
    private Set<UserDto> assignedUsers = new HashSet<>();

    public UserDto getCreator() {
        return creator;
    }

    public void setCreator(UserDto creator) {
        this.creator = creator;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Set<QuizAnswerDto> getAnswers() {
        return answers;
    }

    public void setAnswers(Set<QuizAnswerDto> answers) {
        this.answers = answers;
    }

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

    public Set<UserDto> getAssignedUsers() {
        return assignedUsers;
    }

    public void setAssignedUsers(Set<UserDto> assignedUsers) {
        this.assignedUsers = assignedUsers;
    }

    @Override
    public String toString() {
        String quizCreator = creator != null ? creator.toString() : "";
        return "QuizDto{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", isPublic=" + isPublic +
                ", creator=" + quizCreator +
                '}';
    }
}
