package com.example.be_smartnote.controller;

import com.example.be_smartnote.entities.Message;
import com.example.be_smartnote.service.MessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    @Autowired
    private MessageService messageService;

    @MessageMapping("/chat")
    @SendTo("/topic/messages")
    public Message sendMessage(Message message) {
        return messageService.save(message);
    }

    @GetMapping
    public List<Message> getMessages(
            @RequestParam String sender,
            @RequestParam String receiver
    ) {
        return messageService.getChat(sender, receiver);
    }

}


