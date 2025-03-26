package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.request.NoteRequest;
import com.example.be_smartnote.dto.response.NoteImageResponse;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.NoteImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NoteImageMapper {
    @Mapping(source = "note.id", target = "noteId")
    @Mapping(source = "id", target = "imageId")
    NoteImageResponse toNoteImageResponse(NoteImage note);

}
