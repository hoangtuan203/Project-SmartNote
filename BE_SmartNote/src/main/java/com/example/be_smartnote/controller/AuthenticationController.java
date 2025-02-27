package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.AuthenticationRequest;
import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.AuthenticationResponse;
import com.example.be_smartnote.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        var result = authenticationService.authenticate(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(1000)
                .message("success")
                .result(result)
                .build();
    }
}
