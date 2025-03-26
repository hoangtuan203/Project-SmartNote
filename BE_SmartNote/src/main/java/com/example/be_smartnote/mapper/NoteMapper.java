package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.request.NoteRequest;
import com.example.be_smartnote.dto.request.UserRequest;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NoteMapper {
//    Note toUser(UserRequest request);
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "id", target = "noteId")
    @Mapping(source = "createdAt", target = "createdAt")
    NoteResponse toNoteResponse(Note note);
    @Mapping(source = "userId", target = "user.id")
    Note toNote(NoteRequest request);
}
