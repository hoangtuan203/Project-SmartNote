package com.example.be_smartnote.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NoteImageResponse {
    Long imageId;
    String imageUrl;
    Long noteId;
}
