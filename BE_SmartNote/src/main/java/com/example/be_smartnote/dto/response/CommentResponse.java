package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentResponse {
    Long commentId;
    Long userId;
    Long noteId;
    String content;
    Instant createdAt;

}
