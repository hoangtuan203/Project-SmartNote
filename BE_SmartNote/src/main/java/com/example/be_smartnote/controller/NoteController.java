package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.request.NoteRequest;
import com.example.be_smartnote.dto.response.NoteImageResponse;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.NoteResponseWrapper;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.service.NoteService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/note")
public class NoteController {

    @Autowired
    private NoteService noteService;
    @Autowired
    private ObjectMapper objectMapper;
    @GetMapping
    public ApiResponse<NoteResponseWrapper> getAllNotesByPageable(@RequestParam(defaultValue = "1") int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return ApiResponse.<NoteResponseWrapper>builder()
                .result(noteService.getListNotesByPageable(pageable))
                .build();
    }

    @GetMapping("/getAll")
    public ApiResponse<List<NoteResponse>> getAllNotes() {
        var result = noteService.getAllList();
        return ApiResponse.<List<NoteResponse>>builder()
                .message("success")
                .code(1000)
                .result(result)
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<NoteResponse> getNoteById(@PathVariable Long id) {
        var result = noteService.getNoteById(id);
        return new ApiResponse<>(1000, "success", result);
    }


    @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<NoteResponse> saveNote(
            @RequestParam("note") String noteJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws JsonProcessingException {

        NoteRequest noteRequest = objectMapper.readValue(noteJson, NoteRequest.class);
        var result = noteService.saveNote(noteRequest, images);

        return new ApiResponse<>(1000, "success create note", result);
    }
    @PutMapping(value = "/update/{noteId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<NoteResponse> updateNote(
            @PathVariable Long noteId,
            @RequestParam("note") String noteJson,
            @RequestPart("images") List<MultipartFile> images) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Hỗ trợ Java 8 Date/Time API
        NoteRequest noteRequest = objectMapper.readValue(noteJson, NoteRequest.class);


        var result = noteService.updateNote(noteId, noteRequest, images);
        return new ApiResponse<>(1000, "update note success", result);
    }

    //note image get images

    @GetMapping("/getImages")
    public ApiResponse<List<NoteImageResponse>> getListImages(@RequestParam Long noteId) {
        var result = noteService.getListImagesWithNote(noteId);
        return ApiResponse.<List<NoteImageResponse>>builder()
                .result(result)
                .message("success")
                .code(1000)
                .build();
    }

    @DeleteMapping("/deleteImage/{imageId}")
    public ApiResponse<Boolean> deleteImage(@PathVariable Long imageId) {
        var result = noteService.deleteImageWithNote(imageId);
        return ApiResponse.<Boolean>builder()
                .code(1000)
                .message("delete success")
                .result(result)
                .build();
    }


}
