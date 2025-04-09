package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.request.TaskRequest;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/task")
public class TaskController {
    @Autowired
    private  TaskService taskService;
    @GetMapping
    public ApiResponse<TaskResponseWrapper> getAllTask(@RequestParam(defaultValue = "1") int page, @RequestParam int size, @RequestParam Long userId) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<TaskResponseWrapper>builder()
                .result(taskService.getAllTaskPageable(pageable, userId))
                .build();
    }


    @GetMapping("/getAll")
    public ApiResponse<TaskResponseWrapper> getAllTask() {
        return ApiResponse.<TaskResponseWrapper>builder()
                .result(taskService.getAllTask())
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
    @PostMapping("/create")
    public ApiResponse<TaskResponse> creatTask(@RequestBody TaskRequest request) {
        var result = taskService.createTask(request);
        return new ApiResponse<>(1000, "success", result);
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Boolean> deleteTask(@PathVariable Long id){
        var result = taskService.deleteTask(id);
        return new ApiResponse<>(1000, "success", result);
    }
}
