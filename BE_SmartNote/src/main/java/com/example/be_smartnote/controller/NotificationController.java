package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.dto.response.NotificationResponseWrapper;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public ApiResponse<NotificationResponseWrapper> getAllNotifications(@RequestParam(defaultValue = "1") int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<NotificationResponseWrapper>builder()
                .result(notificationService.getListNotification(pageable))
                .build();
    }
}
