package com.raiseup.rquiz.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.raiseup.rquiz.common.AppConstants.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;

@Entity
@Table(name = DBConsts.USER_ANSWER_TABLE_NAME)
@Access(AccessType.FIELD)
@Getter
@Setter
@EqualsAndHashCode
public class UserAnswer extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private Quiz quiz;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private ApplicationUser applicationUser;

    @ManyToOne
    @JoinColumn
    @JsonIgnore
    private QuizAnswer quizAnswer;
}
