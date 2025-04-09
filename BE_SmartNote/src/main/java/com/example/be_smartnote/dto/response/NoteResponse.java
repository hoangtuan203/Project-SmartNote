package com.example.be_smartnote.dto.response;

import com.example.be_smartnote.entities.FileType;
import com.fasterxml.jackson.annotation.JsonFormat;
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
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime createdAt; // Đặt tên trùng với Note entity
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    LocalDateTime updatedAt;
    List<String> imageUrls; // Danh sách URL của ảnh
    List<String> fileUrls;


}
