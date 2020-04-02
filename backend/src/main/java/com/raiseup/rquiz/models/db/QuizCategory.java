package com.raiseup.rquiz.models.db;

import com.raiseup.rquiz.common.AppConstants;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Access(AccessType.FIELD)
@Table(name = AppConstants.DBConsts.QUIZ_CATEGORY_TABLE_NAME)
public class QuizCategory extends BaseModel{
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name=AppConstants.DBConsts.COLUMN_NAME_ID)
    private String id;

    @NotNull(message = "Category name cannot be null")
    @Size(max = 1024)
    private String name;
}
