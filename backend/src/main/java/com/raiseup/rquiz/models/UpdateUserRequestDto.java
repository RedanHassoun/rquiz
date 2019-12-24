package com.raiseup.rquiz.models;

import javax.validation.constraints.NotNull;

public class UpdateUserRequestDto {
    @NotNull(message = "User id cannot be null")
    private String id;
    private String imageUrl;
    private String about;
    private String password;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
