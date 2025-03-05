package com.example.be_smartnote.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TaskRequest {
    Long userId;
    String title;
    String description;
    LocalDateTime dueDate;
    String status;
    String priority;
}
