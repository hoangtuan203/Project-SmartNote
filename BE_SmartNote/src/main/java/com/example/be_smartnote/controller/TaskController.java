package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.NoteResponseWrapper;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private  TaskService taskService;
    @GetMapping
    public ApiResponse<TaskResponseWrapper> getAllTask(@RequestParam(defaultValue = "1") int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<TaskResponseWrapper>builder()
                .result(taskService.getAllTask(pageable))
                .build();
    }

    @GetMapping("/upcoming")
    public ApiResponse<List<Task>> getUpcomingTasks() {
        List<Task> result =  taskService.checkTasksForNotification();
        return ApiResponse.<List<Task>>builder()
                .code(1000)
                .message("success")
                .result(result)
                .build();
    }
}
