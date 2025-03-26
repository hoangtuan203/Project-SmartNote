package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.entities.Notification;
import com.example.be_smartnote.mapper.NotificationMapper;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationConsumer {

    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationMapper notificationMapper;

    public NotificationConsumer(SimpMessagingTemplate messagingTemplate, NotificationMapper notificationMapper) {
        this.messagingTemplate = messagingTemplate;
        this.notificationMapper = notificationMapper;
    }

    // Lắng nghe thông báo từ Kafka
    @KafkaListener(topics = "notification-topic", groupId = "notification-group")
    public void consume(String message) {
        System.out.println("📥 Nhận thông báo từ Kafka: " + message);

        // Chuyển đổi message thành NotificationResponse
        Notification notification = new Notification();
        notification.setMessage(message);

        NotificationResponse response = notificationMapper.toNotificationResponse(notification);

        // Gửi thông báo qua WebSocket tới các client đang subscribe /topic/notifications
        messagingTemplate.convertAndSend("/topic/notifications", response);
    }
}
