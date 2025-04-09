package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.response.CommentResponse;
import com.example.be_smartnote.dto.response.FileResponse;
import com.example.be_smartnote.entities.Comment;
import com.example.be_smartnote.entities.NoteFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FileMapper {
    @Mapping(source = "id", target = "fileId")
    @Mapping(source = "note.id", target = "noteId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "uploadedAt", target = "updatedAt")
    @Mapping(source = "fileType", target = "fileType")
    FileResponse toNoteFileResponse(NoteFile noteFile);
}
