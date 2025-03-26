package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.request.Message;
import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.dto.response.NotificationResponseWrapper;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.service.NotificationProducer;
import com.example.be_smartnote.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationProducer notificationProducer;
    @GetMapping
    public ApiResponse<NotificationResponseWrapper> getAllNotifications(@RequestParam(defaultValue = "1") int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<NotificationResponseWrapper>builder()
                .result(notificationService.getListNotification(pageable))
                .build();
    }
    @PostMapping("/send")
    public String sendNotification(@RequestParam String message) {
        notificationProducer.sendMessage("notification-topic", message);
        return "Thông báo đã được gửi!";
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message broadcastMessage(Message message) {
        return new Message("Server response: " + message.getContent());
    }
}
