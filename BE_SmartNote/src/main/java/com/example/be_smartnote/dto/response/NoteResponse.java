package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

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
    List<String> imageUrls; // Danh sách URL của ảnh

}
