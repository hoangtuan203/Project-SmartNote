package com.example.be_smartnote.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {
    private final RestTemplate restTemplate;
    private final String OPENAI_API_KEY = "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";
    private final String OPENAI_URL = "https://openrouter.ai/api/v1/chat/completions";

    public AIService(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    public String summarize(String content) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + OPENAI_API_KEY); // <-- tự tay set Bearer, đừng xài setBearerAuth
        headers.set("HTTP-Referer", "http://localhost:5173/");     // <-- bắt buộc phải có Referer
        headers.set("User-Agent", "be-smartnote");                 // <-- và User-Agent

        Map<String, Object> body = new HashMap<>();
        body.put("model", "openai/gpt-3.5-turbo");
        body.put("messages", List.of(
                Map.of("role", "system", "content", "Bạn là một trợ lý hữu ích. Hãy tóm tắt ghi chú và trả lời cùng ngôn ngữ với người dùng."),
                Map.of("role", "user", "content", "Hãy tóm tắt ghi chú sau đây: " + content)
        ));


        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");

        return (String) message.get("content");
    }
    public List<String> suggest(String content) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_API_KEY.replace("Bearer", ""));

        Map<String, Object> body = new HashMap<>();
        body.put("model", "openai/gpt-3.5-turbo"); // nhớ giữ đúng openrouter model
        body.put("messages", List.of(
                Map.of("role", "system", "content", "You are an assistant helping users improve and expand their notes. "
                        + "Based on the user's language, reply in the same language. "
                        + "For the given note, suggest 3 ideas to develop or extend the content. Reply in JSON array format."),
                Map.of("role", "user", "content", "Suggest 3 ideas to expand this note: " + content)
        ));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.postForEntity(OPENAI_URL, request, Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        String suggestionsJson = (String) message.get("content");

        try {
            ObjectMapper mapper = new ObjectMapper();
            return mapper.readValue(suggestionsJson, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return List.of("Could not parse suggestions.");
        }
    }


}
