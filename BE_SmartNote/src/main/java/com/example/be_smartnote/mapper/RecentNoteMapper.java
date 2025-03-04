package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.response.RecentNoteResponse;
import com.example.be_smartnote.entities.RecentNote;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RecentNoteMapper {

    @Mapping(source = "id", target = "id")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "note.id", target = "noteId")
    RecentNoteResponse toRecentNoteResponse(RecentNote recentNote);

}
