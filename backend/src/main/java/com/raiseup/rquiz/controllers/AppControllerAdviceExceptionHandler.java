package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.ErrorResponse;
import com.raiseup.rquiz.exceptions.*;
import org.slf4j.Logger;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import java.text.SimpleDateFormat;
import java.util.Date;

@ControllerAdvice
public class AppControllerAdviceExceptionHandler extends ResponseEntityExceptionHandler {
    private static String ERROR_DATE_FORMAT = "dd-MM-yyyy hh:mm:ss";
    private Logger logger;

    public AppControllerAdviceExceptionHandler(Logger logger) {
        this.logger = logger;
    }

    @ExceptionHandler(value = { IllegalOperationException.class })
    protected ResponseEntity<Object> handleIllegalOperation(
            IllegalOperationException ex, WebRequest request) {
        this.logger.error("BAD REQUEST", ex);
        String currentTimeStamp = new SimpleDateFormat(ERROR_DATE_FORMAT).format(new Date());
        ErrorResponse errorResponse = new ErrorResponse.Builder(HttpStatus.BAD_REQUEST.value())
                .setMessage(ex.getMessage())
                .setTimeStamp(currentTimeStamp)
                .build();
        return handleExceptionInternal(ex, errorResponse,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }

    @ExceptionHandler(value = { AnswerNotFoundException.class,
                                QuizNotFoundException.class,
                                UserNotFoundException.class })
    protected ResponseEntity<Object> handleNotFound(AppException ex, WebRequest request) {
        this.logger.error("NOT FOUND", ex);
        String currentTimeStamp = new SimpleDateFormat(ERROR_DATE_FORMAT).format(new Date());
        ErrorResponse errorResponse = new ErrorResponse.Builder(HttpStatus.NOT_FOUND.value())
                .setMessage(ex.getMessage())
                .setTimeStamp(currentTimeStamp)
                .build();
        return handleExceptionInternal(ex, errorResponse,
                new HttpHeaders(), HttpStatus.NOT_FOUND, request);
    }

    @ExceptionHandler(value = { AnswerAlreadyExistException.class, UserAlreadyExistException.class })
    protected ResponseEntity<Object> handleAlreadyExist(AppException ex, WebRequest request) {
        this.logger.error("BAD REQUEST", ex);
        String currentTimeStamp = new SimpleDateFormat(ERROR_DATE_FORMAT).format(new Date());
        ErrorResponse errorResponse = new ErrorResponse.Builder(HttpStatus.BAD_REQUEST.value())
                .setMessage(ex.getMessage())
                .setTimeStamp(currentTimeStamp)
                .build();

        return handleExceptionInternal(ex, errorResponse,
                new HttpHeaders(), HttpStatus.BAD_REQUEST, request);
    }
}
