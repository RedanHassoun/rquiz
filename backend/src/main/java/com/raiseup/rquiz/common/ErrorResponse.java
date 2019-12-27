package com.raiseup.rquiz.common;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ErrorResponse {
    private String message;
    private int status;
    private String timestamp;

    public ErrorResponse(String message, int status, String timestamp){
        this.message = message;
        this.status = status;
        this.timestamp = timestamp;
    }

    public static class Builder {
        private String message;
        private int status;
        private String timestamp;

        public Builder(int status){
            this.status = status;
        }

        public Builder setMessage(String message) {
            this.message = message;
            return this;
        }

        public Builder setStatus(int status) {
            this.status = status;
            return this;
        }

        public Builder setTimeStamp(String timestamp) {
            this.timestamp = timestamp;
            return this;
        }

        public ErrorResponse build() {
            return new ErrorResponse(message, status, timestamp);
        }
    }
}
