package com.raiseup.rquiz.models.db;

import com.raiseup.rquiz.common.AppConstants;
import org.hibernate.annotations.GenericGenerator;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = AppConstants.DBConsts.USER_NOTIFICATION_TABLE_NAME)
@Access(AccessType.FIELD)
public class UserNotification extends BaseModel {
    @Id
    @GeneratedValue(generator = "UUID")
    @GenericGenerator(
            name = "UUID",
            strategy = "org.hibernate.id.UUIDGenerator")
    private String id;

    // TODO: Improve the user notifications infrastructure and avoid saving the whole object as content
    @Column(nullable = false, length = 4096)
    @NotNull(message = "Notification content cannot be null")
    private String content;

    @Column(nullable = false)
    @NotNull(message = "Notification topic cannot be null")
    private String topic;

    @Column(columnDefinition = "boolean default false")
    private Boolean seen = false;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    @NotNull(message = "Notification time cannot be null")
    private Date time;

    @ManyToOne
    @JoinColumn(nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn
    private User targetUser;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public Boolean getSeen() {
        return seen;
    }

    public void setSeen(Boolean seen) {
        this.seen = seen;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(User targetUser) {
        this.targetUser = targetUser;
    }
}
