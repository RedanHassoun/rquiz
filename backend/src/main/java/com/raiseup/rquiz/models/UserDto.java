package com.raiseup.rquiz.models;

import java.util.Date;

public class UserDto {
    private String id;
    private String username;
    private String email;
    private String imageUrl;
    private String about;
    private Date createdAt;
    private Long totalNumberOfAnswers;
    private Long totalNumberOfCorrectAnswers;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public Long getTotalNumberOfAnswers() {
        return totalNumberOfAnswers;
    }

    public void setTotalNumberOfAnswers(Long totalNumberOfAnswers) {
        this.totalNumberOfAnswers = totalNumberOfAnswers;
    }

    public Long getTotalNumberOfCorrectAnswers() {
        return totalNumberOfCorrectAnswers;
    }

    public void setTotalNumberOfCorrectAnswers(Long totalNumberOfCorrectAnswers) {
        this.totalNumberOfCorrectAnswers = totalNumberOfCorrectAnswers;
    }

    @Override
    public String toString() {
        return "UserDto{" +
                "id='" + id + '\'' +
                ", username='" + username + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
