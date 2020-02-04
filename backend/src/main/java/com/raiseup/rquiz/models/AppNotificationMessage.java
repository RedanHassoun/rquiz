package com.raiseup.rquiz.models;

import java.util.Date;

public class AppNotificationMessage {
    private String id;
    private String content;
    private String topic;
    private String userId;
    private String username;
    private String[] targetUserIds;
    private Boolean seen = false;
    private Date time;
    private String humanReadableContent;

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

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String[] getTargetUserIds() {
        return targetUserIds;
    }

    public void setTargetUserIds(String[] targetUserIds) {
        this.targetUserIds = targetUserIds;
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

    public String getHumanReadableContent() {
        return humanReadableContent;
    }

    public void setHumanReadableContent(String humanReadableContent) {
        this.humanReadableContent = humanReadableContent;
    }

    @Override
    public String toString() {
        return String.format("[ id: %s, topic: %s, content: %s]", this.id, this.topic, this.content);
    }
}
