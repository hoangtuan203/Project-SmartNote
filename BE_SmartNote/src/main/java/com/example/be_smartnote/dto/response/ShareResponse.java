package com.example.be_smartnote.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShareResponse {
    Long shareId;
    Long entityId; // ID của Note hoặc Task
    String title;
    String type; // "NOTE" hoặc "TASK"
    String status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime requestTime;
    String ghostName;
    String permission;
    String tokenShare;
    Long userId;
    Long noteId;
    Long taskId;
}
