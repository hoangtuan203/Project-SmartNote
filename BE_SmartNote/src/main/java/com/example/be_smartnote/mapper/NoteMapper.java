package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.request.NoteRequest;
import com.example.be_smartnote.dto.request.UserRequest;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.NoteImage;
import com.example.be_smartnote.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface NoteMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "id", target = "noteId")
    @Mapping(source = "images", target = "imageUrls", qualifiedByName = "mapImagesToUrls")
    NoteResponse toNoteResponse(Note note);

    @Mapping(source = "userId", target = "user.id")
    Note toNote(NoteRequest request);

    // Phương thức giúp chuyển danh sách NoteImage thành danh sách URL ảnh
    @Named("mapImagesToUrls")
    default List<String> mapImagesToUrls(List<NoteImage> images) {
        return images != null ? images.stream()
                .map(NoteImage::getImageUrl)
                .collect(Collectors.toList()) : null;
    }
}