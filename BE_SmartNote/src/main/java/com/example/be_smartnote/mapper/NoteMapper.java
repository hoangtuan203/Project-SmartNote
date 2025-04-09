package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.request.NoteRequest;
import com.example.be_smartnote.dto.response.FileUrlResponse;
import com.example.be_smartnote.dto.response.ImageUrlResponse;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.NoteFile;
import com.example.be_smartnote.entities.NoteImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface NoteMapper {

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "id", target = "noteId")
    @Mapping(source = "images", target = "imageUrls", qualifiedByName = "mapImagesToUrls")
    @Mapping(source = "files", target = "fileUrls", qualifiedByName = "mapFilesToUrls")
    NoteResponse toNoteResponse(Note note);

    @Mapping(source = "userId", target = "user.id")
    Note toNote(NoteRequest request);

    // ✅ Map images to List<String> (just the URLs)
    @Named("mapImagesToUrls")
    default List<String> mapImagesToUrls(List<NoteImage> images) {
        return images != null ? images.stream()
                .map(NoteImage::getImageUrl)
                .collect(Collectors.toList()) : Collections.emptyList();
    }

    // ✅ Map files to List<String> (just the URLs)
    @Named("mapFilesToUrls")
    default List<String> mapFilesToUrls(List<NoteFile> files) {
        return files != null ? files.stream()
                .map(NoteFile::getFileUrl)
                .collect(Collectors.toList()) : Collections.emptyList();
    }
}

