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

    public NotificationConsumer(SimpMessagingTemplate messagingTemplate,
                                NotificationMapper notificationMapper) {
        this.messagingTemplate = messagingTemplate;
        this.notificationMapper = notificationMapper;
    }

    @KafkaListener(topics = "notification-topic", groupId = "notification-group")
    public void consume(String message) {
        System.out.println("📥 Nhận thông báo từ Kafka: " + message);

        // Giả lập tạo đối tượng Notification từ message (nếu có hệ thống parser riêng thì dùng)
        Notification notification = new Notification();
        notification.setMessage(message);

        NotificationResponse response = notificationMapper.toNotificationResponse(notification);

        // Gửi message tới tất cả các client đang subscribe topic /topic/notifications
        messagingTemplate.convertAndSend("/topic/notifications", response);
    }
}
