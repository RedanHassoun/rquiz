package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.exceptions.AppException;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.models.AppNotificationMessage;
import com.raiseup.rquiz.models.db.UserNotification;
import com.raiseup.rquiz.services.UserNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class NotificationController {

    private Logger logger = LoggerFactory.getLogger(NotificationController.class);

    private UserNotificationService userNotificationService;
    private DtoMapper dtoMapper;

    public NotificationController(UserNotificationService userNotificationService,
                                  DtoMapper dtoMapper){
        this.userNotificationService = userNotificationService;
        this.dtoMapper = dtoMapper;
    }

    @MessageMapping("/quiz-list-update")
    @SendTo("/topic/quiz-list-update")
    public AppNotificationMessage quizListUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'quiz-list-update'",
                message.getContent()));
        return message;
    }

    @MessageMapping("/quiz-answers-update")
    @SendTo("/topic/quiz-answers-update")
    public AppNotificationMessage quizAnswersUpdate(AppNotificationMessage message) throws Exception {
        this.logger.debug(String.format("Received socket message: %s on topic: 'quiz-answers-update'",
                message.getContent()));
        return this.saveUserNotification(message);
    }

    @MessageMapping("/quiz-deleted-update")
    @SendTo("/topic/quiz-deleted-update")
    public AppNotificationMessage quizDeletedUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'quiz-deleted-update'",
                message.getContent()));
        return message;
    }

    @MessageMapping("/user-update")
    @SendTo("/topic/user-update")
    public AppNotificationMessage userUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'user-update'",
                message.getContent()));
        return message;
    }

    private AppNotificationMessage saveUserNotification(AppNotificationMessage message) throws Exception {
        if (message == null) {
            throw new IllegalOperationException("Cannot save user notification because it is not defined");
        }

        this.logger.debug(String.format("Saving user notification: %s", message.toString()));

        UserNotification userNotificationEntity =  this.dtoMapper.convertUserNotificationDtoToEntity(message);
        Optional<UserNotification> userNotificationOptional= this.userNotificationService.save(userNotificationEntity);

        if(!userNotificationOptional.isPresent()) {
            throw new Exception(
                    String.format(
                            "Something went wrong while saving the user notification: %s", message.toString()));
        }

        this.logger.debug(String.format("Notification was saved to DB. id: %s", userNotificationOptional.get().getId()));

        return this.dtoMapper.convertUserNotificationToDto(userNotificationOptional.get());
    }
}
