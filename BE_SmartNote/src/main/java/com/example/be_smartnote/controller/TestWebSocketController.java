package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.MessagePayload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/notify")
    public ResponseEntity<String> sendTestMessage(@RequestParam String message) {
        messagingTemplate.convertAndSend("/topic/notifications", new MessagePayload(message));
        return ResponseEntity.ok("Sent: " + message);
    }
}
