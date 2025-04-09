package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.MessagePayload;
import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.dto.response.NotificationResponseWrapper;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.entities.Notification;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.mapper.NotificationMapper;
import com.example.be_smartnote.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;

@Service
public class NotificationService {
    private final NotificationMapper notificationMapper;
    private final NotificationRepository notificationRepository;
    private final NotificationProducer notificationProducer;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    private JavaMailSender javaMailSender;
    public NotificationService(SimpMessagingTemplate messagingTemplate, NotificationMapper notificationMapper, NotificationRepository notificationRepository,
                               NotificationProducer notificationProducer, NotificationWebSocketHandler webSocketHandler) {
        this.notificationMapper = notificationMapper;
        this.notificationRepository = notificationRepository;
        this.notificationProducer = notificationProducer;
        this.messagingTemplate = messagingTemplate;
    }


    public void sendTaskNotification(Task task) {
        String message = "Còn 1 tiếng nữa là đến hạn task: " + task.getTitle();
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setIsRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setUser(task.getUser());

        notificationRepository.save(notification);
        notificationProducer.sendMessage("notification-topic", message);

        messagingTemplate.convertAndSend("/topic/notifications", new MessagePayload(message));

        sendGmailNotification(task.getUser().getEmail(), message);
    }

    private void sendGmailNotification(String recipientEmail, String message){
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(recipientEmail);
        mailMessage.setSubject("Thông báo mới từ hệ thống Smart Note !");
        mailMessage.setText(message);

        //send gmail
        javaMailSender.send(mailMessage);

    }
    public NotificationResponseWrapper getListNotification(Pageable pageable, Long userId){
        Page<Notification> notifications = notificationRepository.findAllByPageable(pageable, userId);
        Page<NotificationResponse> notificationResponses = notifications.map(notificationMapper::toNotificationResponse);
        return new NotificationResponseWrapper(
                notificationResponses.getTotalPages(),
                notificationResponses.getTotalElements(),
                notificationResponses.getContent()
        );
    }

    public boolean notificationDelete(Long id) {
        var notificationDelete = notificationRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.NOTIFICATION_NOT_EXITS));
        notificationRepository.deleteById(id);
        return true;
    }
}
