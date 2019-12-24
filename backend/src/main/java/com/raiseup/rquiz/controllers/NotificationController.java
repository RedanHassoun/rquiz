package com.raiseup.rquiz.controllers;

import com.raiseup.rquiz.models.AppNotificationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class NotificationController {

    private Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @MessageMapping("/quiz-list-update")
    @SendTo("/topic/quiz-list-update")
    public AppNotificationMessage quizListUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'quiz-list-update'",
                message.content));
        return message;
    }

    @MessageMapping("/quiz-answers-update")
    @SendTo("/topic/quiz-answers-update")
    public AppNotificationMessage quizAnswersUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'quiz-answers-update'",
                message.content));
        return message;
    }

    @MessageMapping("/quiz-deleted-update")
    @SendTo("/topic/quiz-deleted-update")
    public AppNotificationMessage quizDeletedUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'quiz-deleted-update'",
                message.content));
        return message;
    }

    @MessageMapping("/user-update")
    @SendTo("/topic/user-update")
    public AppNotificationMessage userUpdate(AppNotificationMessage message) {
        this.logger.debug(String.format("Received socket message: %s on topic: 'user-update'",
                message.content));
        return message;
    }
}
