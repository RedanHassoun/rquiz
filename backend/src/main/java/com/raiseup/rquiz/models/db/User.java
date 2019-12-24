package com.raiseup.rquiz.models.db;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.raiseup.rquiz.common.AppConstants.*;
import org.hibernate.validator.constraints.Length;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = DBConsts.USERS_TABLE_NAME)
@Access(AccessType.FIELD)
public class User extends BaseModel{
    @Id
    @Column(name=DBConsts.USER_ID)
    private String id;

    @Column(unique=true)
    @NotNull(message = "Username cannot be null")
    @Length(min = 3)
    private String username;

    @Column(unique=true)
    @Email(message = "The given string is not a well-formed email address")
    @NotNull(message = "Email cannot be null")
    private String email;

    @NotNull(message = "Password cannot be null")
    @Length(min = 3)
    private String password;
    private String imageUrl;
    private String about;

    @OneToMany(mappedBy = "user",
               cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<UserAnswer> userAnswers = new HashSet<>();

    @ManyToMany(mappedBy = "assignedUsers")
    @JsonIgnore
    private Set<Quiz> assignedQuizList = new HashSet<>();

    @OneToMany(mappedBy = "creator")
    @JsonIgnore
    private Set<Quiz> ownedQuizList = new HashSet<>();

    public Set<UserAnswer> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(Set<UserAnswer> userAnswers) {
        this.userAnswers = userAnswers;
    }

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Set<Quiz> getAssignedQuizList() {
        return assignedQuizList;
    }

    public void setAssignedQuizList(Set<Quiz> assignedQuizList) {
        this.assignedQuizList = assignedQuizList;
    }

    public String getAbout() {
        return about;
    }

    public void setAbout(String about) {
        this.about = about;
    }

    @Override
    public String toString(){
        return String.format("[ username: %s , email: %s]",
                this.username,
                this.email);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User that = (User) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(username, that.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username);
    }
}
