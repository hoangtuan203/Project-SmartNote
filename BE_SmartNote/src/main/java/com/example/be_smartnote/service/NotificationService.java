package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.dto.response.NotificationResponseWrapper;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.entities.Notification;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.mapper.NotificationMapper;
import com.example.be_smartnote.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
public class NotificationService {
    private final NotificationMapper notificationMapper;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationProducer notificationProducer;
    public NotificationService(SimpMessagingTemplate messagingTemplate, NotificationMapper notificationMapper, NotificationRepository notificationRepository,
                               NotificationProducer notificationProducer) {
        this.messagingTemplate = messagingTemplate;
        this.notificationMapper = notificationMapper;
        this.notificationRepository = notificationRepository;
        this.notificationProducer = notificationProducer;
    }

    public void sendTaskNotification(Task task) {
        String message = "Còn 1 tiếng nữa là đến hạn task: " + task.getTitle();

        // Tạo thông báo mới
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(task.getUser()); // Gán user cho thông báo

        // Lưu vào database
        notificationRepository.save(notification);

        // Gửi thông báo qua Kafka
        notificationProducer.sendMessage("notification-topic", message);

        // Gửi thông báo qua WebSocket (nếu có)
        messagingTemplate.convertAndSend("/api/notifications", notificationMapper.toNotificationResponse(notification));

        System.out.println("📢 Gửi thông báo: " + message);
    }

    public NotificationResponseWrapper getListNotification(Pageable pageable){
        Page<Notification> notifications = notificationRepository.findAllByPageable(pageable);
        Page<NotificationResponse> notificationResponses = notifications.map(notificationMapper::toNotificationResponse);
        return new NotificationResponseWrapper(
                notificationResponses.getTotalPages(),
                notificationResponses.getTotalElements(),
                notificationResponses.getContent()
        );
    }
}
