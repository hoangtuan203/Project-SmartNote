package com.example.be_smartnote.controller;

import com.example.be_smartnote.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {
    @Autowired
    private AIService aiService;
    @PostMapping("/summarize")
    public ResponseEntity<Map<String, String>> summarize(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        String summary = aiService.summarize(content);
        return ResponseEntity.ok(Collections.singletonMap("summary", summary));
    }

    @PostMapping("/suggest")
    public ResponseEntity<Map<String, Object>> suggest(@RequestBody Map<String, String> request) {
        String content = request.get("content");
        List<String> suggestions = aiService.suggest(content);
        return ResponseEntity.ok(Collections.singletonMap("suggestions", suggestions));
    }

}
