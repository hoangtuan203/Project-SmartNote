package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.AuthenticationRequest;
import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.AuthenticationResponse;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.repository.UserRepository;
import com.example.be_smartnote.service.AuthenticationService;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
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
    //login google
    @PostMapping("/oauth2/callback/google")
    public ResponseEntity<?> handleGoogleCallback(@RequestBody Map<String, String> body) {

        return authenticationService.authenticateWithGoogle(body.get("code"));
    }

    //login facebook
    @PostMapping("/oauth2/callback/facebook")
    public ResponseEntity<?> handleFacebookCallback(@RequestBody Map<String, String> body) {
        return authenticationService.authenticateWithFacebook(body.get("code"));
    }

}
