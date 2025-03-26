package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.UserRequest;
import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.TaskResponseWrapper;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.dto.response.UserResponseWrapper;
import com.example.be_smartnote.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ApiResponse<UserResponseWrapper> getAllUser(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<UserResponseWrapper>builder()
                .result(userService.getAllUser(pageable))
                .build();
    }
    @PostMapping("/createUser")
    public ApiResponse<UserResponse> createUser(@RequestBody UserRequest request) {
        var result = userService.createUser(request);
        return new ApiResponse<>(1000, "success", result);
    }

    @GetMapping("/getUserById")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        var result = userService.getUserById(id);

        return new ApiResponse<>(1000, "success", result);
    }


}
