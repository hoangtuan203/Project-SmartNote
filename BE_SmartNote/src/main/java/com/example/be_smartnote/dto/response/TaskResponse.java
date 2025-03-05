package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskResponse {
    Long taskId;
    Long userId;
    String username;
    String title;
    String description;
    Instant dueDate;
    String status;
    String priority;
    Instant createAt;
}
