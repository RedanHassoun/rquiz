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
        this.logger.debug(String.format("Received message: %s on 'quiz-list-update' socket topic",
                message.content));
        return message;
    }

}
