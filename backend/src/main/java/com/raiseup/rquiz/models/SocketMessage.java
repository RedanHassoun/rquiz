package com.raiseup.rquiz.models;

public class SocketMessage {
    private String message;
    public SocketMessage(String message){
        this.message = message;
    }

    public SocketMessage(){
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
