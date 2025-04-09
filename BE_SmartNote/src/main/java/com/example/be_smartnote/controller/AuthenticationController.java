package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.AuthenticationRequest;
import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.request.RefreshRequest;
import com.example.be_smartnote.dto.response.AuthenticationResponse;
import com.example.be_smartnote.dto.response.RefreshResponse;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.repository.UserRepository;
import com.example.be_smartnote.service.AuthenticationService;
import com.example.be_smartnote.service.RecaptchaService;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jwt.SignedJWT;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController()
@RequestMapping("/api/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private RecaptchaService recaptchaService;

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


    //verify-captcha
    @PostMapping("/verify-captcha")
    public ResponseEntity<String> verifyCaptcha(@RequestParam("token") String token) {
        boolean isValid = recaptchaService.validateCaptcha(token);

        if (isValid) {
            return ResponseEntity.ok("Captcha verification passed.");
        } else {
            return ResponseEntity.badRequest().body("Captcha verification failed.");
        }
    }

    //refresh token
    @PostMapping("/refresh-token")
    public ApiResponse<RefreshResponse> refreshToken(@RequestBody RefreshRequest request) {
        try {
            RefreshResponse response = authenticationService.refreshToken(request);

            return ApiResponse.<RefreshResponse>builder()
                    .result(response)
                    .code(HttpStatus.OK.value())
                    .message("Token refreshed successfully")
                    .build();
        } catch (AppException e) {
            log.error("Error during token refresh: {}", e.getMessage());
            return ApiResponse.<RefreshResponse>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message(e.getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error during token refresh", e);
            return ApiResponse.<RefreshResponse>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("An unexpected error occurred")
                    .build();
        }
    }

    //decode token
    @PostMapping("/decode-token")
    public ApiResponse<Map<String, Object>> decodeToken(
            @RequestHeader("Authorization") String authorizationHeader) {
        try {
            String token = authorizationHeader.replace("Bearer ", "");

            var decodedToken = authenticationService.decodeToken(token);
            return ApiResponse.<Map<String, Object>>builder()
                    .result(decodedToken)
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Map<String, Object>>builder()
                    .message("Invalid token: " + e.getMessage())
                    .build();
        }
    }

    // verify token
    @PostMapping("/verify-token")
    public ResponseEntity<String> verifyToken(@RequestHeader("Authorization") String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }

            SignedJWT signedJWT = authenticationService.verifyToken(token, false); // false = không phải refresh token

            if (signedJWT != null) {
                return ResponseEntity.ok("Token is valid");
            } else {
                return ResponseEntity.status(401).body("Token is invalid or expired");
            }
        } catch (JOSEException | ParseException e) {
            return ResponseEntity.status(401).body("Invalid token: " + e.getMessage());
        }
    }


}
