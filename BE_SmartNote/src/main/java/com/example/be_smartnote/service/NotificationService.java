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

@Service
public class NotificationService {
    private final NotificationMapper notificationMapper;
    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;
    public NotificationService(SimpMessagingTemplate messagingTemplate, NotificationMapper notificationMapper, NotificationRepository notificationRepository) {
        this.messagingTemplate = messagingTemplate;
        this.notificationMapper = notificationMapper;
        this.notificationRepository = notificationRepository;
    }

    public void sendTaskNotification(String message) {
        messagingTemplate.convertAndSend("/api/notifications", message);
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
