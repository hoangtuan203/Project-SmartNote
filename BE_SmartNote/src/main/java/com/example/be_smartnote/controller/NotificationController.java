package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.request.Message;
import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.dto.response.NotificationResponseWrapper;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.repository.TaskRepository;
import com.example.be_smartnote.service.NotificationProducer;
import com.example.be_smartnote.service.NotificationService;
import com.example.be_smartnote.service.TaskService;
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

    @Autowired
    private TaskService taskService;
    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public ApiResponse<NotificationResponseWrapper> getAllNotifications(@RequestParam(defaultValue = "1") int page, @RequestParam int size, @RequestParam Long userId) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<NotificationResponseWrapper>builder()
                .result(notificationService.getListNotification(pageable, userId))
                .build();
    }
    @PostMapping("/send")
    public String sendNotification(@RequestParam String message) {
        notificationProducer.sendMessage("notification-topic", message);
        return "Thông báo đã được gửi!";
    }

    @PostMapping("/check-and-send")
    public ApiResponse<String> checkAndSendTaskNotifications() {
        List<com.example.be_smartnote.entities.Task> tasks = taskService.checkTasksForNotification();

        int notifiedCount = 0;
        for (com.example.be_smartnote.entities.Task task : tasks) {
            notificationService.sendTaskNotification(task);
            task.setIsNotified(1); // đánh dấu đã thông báo
            taskRepository.save(task);   // lưu lại trạng thái mới
            notifiedCount++;
        }

        return new ApiResponse<>(1000, "Gửi thông báo thành công", "Đã gửi " + notifiedCount + " thông báo.");
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/messages")
    public Message broadcastMessage(Message message) {
        return new Message("Server response: " + message.getContent());
    }

    @DeleteMapping("/delete/{notificationId}")
    public ApiResponse<Boolean> deleteNotification(@PathVariable Long notificationId){
        var result = notificationService.notificationDelete(notificationId);
        return new  ApiResponse<>(1000, "Delete Success !", result);
    }
}
