package com.example.be_smartnote.service;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class NotificationProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    // Tên topic mặc định
    private static final String DEFAULT_TOPIC = "notification-topic";

    public NotificationProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    // Phương thức gửi thông báo đến Kafka
    public void sendMessage(String topic, String message) {
        kafkaTemplate.send(topic, message);
        System.out.println("📤 Gửi thông báo qua Kafka: " + message);
    }
}
