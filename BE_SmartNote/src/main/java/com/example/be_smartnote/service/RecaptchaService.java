package com.example.be_smartnote.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
@Slf4j
@Service
public class RecaptchaService {
    @Value("${recaptcha.secret-key}")
    private String secretKey;

    @Value("${recaptcha.verify-url}")
    private String verifyUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    public boolean validateCaptcha(String token) {
        String url = String.format("%s?secret=%s&response=%s", verifyUrl, secretKey, token);
        log.info("url : {}", url);
        ResponseEntity<Map> response = restTemplate.postForEntity(url, null, Map.class);
        log.info("response :{}", response.getBody());
        if (response.getBody() != null) {
            return Boolean.TRUE.equals(response.getBody().get("success"));
        }

        return false;
    }
}
