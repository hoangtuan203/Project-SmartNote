package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.response.CompletionRatioResponse;
import com.example.be_smartnote.dto.response.OverdueTaskResponse;
import com.example.be_smartnote.dto.response.TaskByDateResponse;
import com.example.be_smartnote.dto.response.TaskByPriorityResponse;
import com.example.be_smartnote.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/statistical")
public class StatisticalController {
    @Autowired
    TaskService taskService;
    @GetMapping("/by-day")
    public ResponseEntity<List<TaskByDateResponse>> getTasksByDay(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(taskService.getTasksByDay(userId));
    }

    // Tỷ lệ hoàn thành
    @GetMapping("/completion-ratio")
    public ResponseEntity<List<CompletionRatioResponse>> getCompletionRatio(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(taskService.getCompletionRatio(userId));
    }

    // Thống kê theo độ ưu tiên
    @GetMapping("/by-priority")
    public ResponseEntity<List<TaskByPriorityResponse>> getTasksByPriority(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(taskService.getTasksByPriority(userId));
    }

    // Task quá hạn
    @GetMapping("/overdue")
    public ResponseEntity<List<OverdueTaskResponse>> getOverdueTasks(@RequestParam("userId") Long userId) {
        return ResponseEntity.ok(taskService.getOverdueTasks(userId));
    }

}
