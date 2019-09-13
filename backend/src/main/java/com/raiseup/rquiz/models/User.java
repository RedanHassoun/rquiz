package com.raiseup.rquiz.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.raiseup.rquiz.common.AppConstants.*;
import javax.persistence.*;
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
    private String username;
    @NotNull(message = "Password cannot be null")
    private String password;
    private String imageUrl;

    @OneToMany(mappedBy = "user",
               cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<UserAnswer> userAnswers = new HashSet<>();

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

    @Override
    public String toString(){
        return String.format("[ username: %s , password: %s]",
                this.username,
                this.password);
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
