package com.raiseup.rquiz.socket;

import com.raiseup.rquiz.models.SocketMessage;
import org.springframework.stereotype.Controller;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;

@Controller
public class SocketController {
    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public SocketMessage greeting(SocketMessage message) throws Exception {
        Thread.sleep(1000); // simulated delay
        return new SocketMessage("Hello, " + message.getMessage() + "!");
    }
}
