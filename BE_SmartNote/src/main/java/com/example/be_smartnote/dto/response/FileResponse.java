package com.example.be_smartnote.dto.response;

import com.example.be_smartnote.entities.FileType;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileResponse {
    Long fileId;
    Long userId;
    Long noteId;
    String fileName;
    String fileUrl;
    Instant updatedAt;
    FileType fileType;
}
