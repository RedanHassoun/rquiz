package com.raiseup.rquiz.models;

import com.raiseup.rquiz.common.AppConstants.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = DBConsts.USERS_TABLE_NAME)
@Access(AccessType.FIELD)
@Getter
@Setter
@EqualsAndHashCode
public class ApplicationUser extends BaseModel{
    @Id
    @Column(name=DBConsts.USER_ID)
    private String id;
    @Column(unique=true)
    @NotNull(message = "Username cannot be null")
    private String username;
    @NotNull(message = "Password cannot be null")
    private String password;
    private String imageUrl;

    @OneToMany(mappedBy = "applicationUser",
               cascade = CascadeType.ALL)
    private Set<UserAnswer> userAnswers = new HashSet<>();

    @Override
    public String toString(){
        return String.format("[ username: %s , password: %s]",
                this.username,
                this.password);
    }
}
