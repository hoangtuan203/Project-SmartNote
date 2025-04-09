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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
@Slf4j
@RestController
@RequestMapping("/api/note")
public class NoteController {

    @Autowired
    private NoteService noteService;
    @Autowired
    private ObjectMapper objectMapper;
    @GetMapping
    public ApiResponse<NoteResponseWrapper> getAllNotesByPageable(@RequestParam(defaultValue = "1") int page, @RequestParam int size, @RequestParam Long userId) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return ApiResponse.<NoteResponseWrapper>builder()
                .result(noteService.getListNotesByPageable(pageable, userId))
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
            @RequestPart(value = "images", required = false) List<MultipartFile> images) throws IOException {

        // Nếu images là null, gán nó thành danh sách rỗng
        if (images == null) {
            images = new ArrayList<>();
        }

        // Chuyển đổi từ noteJson sang NoteRequest
        NoteRequest noteRequest = convertToNoteRequest(noteJson);
        log.info("note request : {}", noteRequest.getImageUrls());
        // Cập nhật ghi chú và xử lý hình ảnh
        var result = noteService.updateNote(noteId, noteRequest, images);

        return new ApiResponse<>(1000, "Update note success", result);
    }


    private NoteRequest convertToNoteRequest(String noteJson) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Hỗ trợ Java 8 Date/Time API
        return objectMapper.readValue(noteJson, NoteRequest.class);
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

    @DeleteMapping("/deleteImage/{id}")
    public ApiResponse<Boolean> deleteImage(@PathVariable Long id) {
        var result = noteService.deleteImageWithNote(id);
        return ApiResponse.<Boolean>builder()
                .code(1000)
                .message("delete success")
                .result(result)
                .build();
    }


}
