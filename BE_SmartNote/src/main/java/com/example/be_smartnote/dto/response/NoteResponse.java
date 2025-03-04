package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NoteResponse {
    Long noteId;   // Đảm bảo id là Long
    Long userId;   // userId cũng phải là Long, không phải String
    String title;
    String content;
    Boolean isPinned; // Đúng kiểu dữ liệu Boolean
    String color;
    Instant createdAt; // Đặt tên trùng với Note entity
}
