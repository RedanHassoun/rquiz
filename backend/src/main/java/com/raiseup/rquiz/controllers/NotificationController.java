package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.common.DtoMapper;
import com.raiseup.rquiz.exceptions.IllegalOperationException;
import com.raiseup.rquiz.models.AppNotificationMessage;
import com.raiseup.rquiz.models.db.UserNotification;
import com.raiseup.rquiz.services.UserNotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
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
        this.logger.trace(String.format("Received socket message: %s on topic: 'quiz-list-update'",
                message.getContent()));
        return message;
    }

    @MessageMapping("/quiz-answers-update")
    @SendTo("/topic/quiz-answers-update")
    public AppNotificationMessage quizAnswersUpdate(AppNotificationMessage message) throws Exception {
        this.logger.trace(String.format("Received socket message: %s on topic: 'quiz-answers-update'",
                message.getContent()));
        // TODO: improve notification system
        AppNotificationMessage notificationFromDB = this.saveUserNotification(message);
        message.setId(notificationFromDB.getId());
        return message;
    }

    @MessageMapping("/quiz-deleted-update")
    @SendTo("/topic/quiz-deleted-update")
    public AppNotificationMessage quizDeletedUpdate(AppNotificationMessage message) {
        this.logger.trace(String.format("Received socket message: %s on topic: 'quiz-deleted-update'",
                message.getContent()));
        return message;
    }

    @MessageMapping("/quiz-assigned-to-user")
    @SendTo("/topic/quiz-assigned-to-user")
    public AppNotificationMessage quizAssignedToUser(AppNotificationMessage message) throws Exception {
        this.logger.trace(String.format("Received socket message: %s on topic: 'quiz-assigned-to-user'",
                message.getContent()));
        // TODO: improve notification system
        AppNotificationMessage notificationFromDB = this.saveUserNotification(message);
        message.setId(notificationFromDB.getId());
        return message;
    }

    @MessageMapping("/user-update")
    @SendTo("/topic/user-update")
    public AppNotificationMessage userUpdate(AppNotificationMessage message) {
        this.logger.trace(String.format("Received socket message: %s on topic: 'user-update'",
                message.getContent()));
        return message;
    }

    private AppNotificationMessage saveUserNotification(AppNotificationMessage message) throws Exception {
        if (message == null) {
            throw new IllegalOperationException("Cannot save user notification because it is not defined");
        }

        this.logger.trace(String.format("Saving user notification: %s", message.toString()));

        UserNotification userNotificationEntity =  this.dtoMapper.convertUserNotificationDtoToEntity(message);
        Optional<UserNotification> userNotificationOptional= this.userNotificationService.save(userNotificationEntity);

        if(!userNotificationOptional.isPresent()) {
            throw new Exception(
                    String.format(
                            "Something went wrong while saving the user notification: %s", message.toString()));
        }

        this.logger.trace(String.format("Notification was saved to DB. id: %s", userNotificationOptional.get().getId()));

        return this.dtoMapper.convertUserNotificationToDto(userNotificationOptional.get());
    }

    @GetMapping("/api/v1/notifications/all")
    public List<AppNotificationMessage> getNotifications(
            @RequestParam(required = false) String targetUserId,
            @RequestParam(required = false) Boolean seen) throws Exception {

        List<AppNotificationMessage> notifications;

        if (targetUserId != null) {
            notifications = this.userNotificationService.readAllForUser(targetUserId, seen)
                    .stream()
                    .map(notification -> this.dtoMapper.convertUserNotificationToDto(notification))
                    .collect(Collectors.toList());
            this.logger.debug(String.format("Returning %d notifications for user %s", notifications.size(), targetUserId));
        } else {
            notifications = this.userNotificationService.readAll()
                    .stream()
                    .map(notification -> this.dtoMapper.convertUserNotificationToDto(notification))
                    .collect(Collectors.toList());
            this.logger.debug(String.format("Returning all notifications. Number: %d", notifications.size()));
        }

        return notifications;
    }

    @PutMapping("/api/v1/notifications/{notificationId}")
    public AppNotificationMessage updateUserDetails(@PathVariable("notificationId") String notificationId,
                                  @RequestBody AppNotificationMessage appNotificationMessage) throws Exception {
        try{
            if (appNotificationMessage == null || appNotificationMessage.getId() == null) {
                throw new IllegalOperationException(
                        String.format("Cannot update notification %s, the notification should be defined and have an id",
                                notificationId));
            }

            UserNotification userNotification = this.dtoMapper.convertUserNotificationDtoToEntity(appNotificationMessage);
            return this.dtoMapper.convertUserNotificationToDto(
                    this.userNotificationService.update(userNotification).get());
        } catch (Exception ex){
            this.logger.error(String.format("Cannot update notification %s", notificationId), ex);
            throw ex;
        }
    }

}
