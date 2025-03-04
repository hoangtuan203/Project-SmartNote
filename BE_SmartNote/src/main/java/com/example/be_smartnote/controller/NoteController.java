package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.NoteResponse;
import com.example.be_smartnote.dto.response.NoteResponseWrapper;
import com.example.be_smartnote.dto.response.UserResponse;
import com.example.be_smartnote.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/note")
public class NoteController {

    @Autowired
    private NoteService noteService;

    @GetMapping
    public ApiResponse<NoteResponseWrapper> getAllNotes(@RequestParam(defaultValue = "1") int page, @RequestParam int size) {
        Pageable pageable = PageRequest.of(page-1, size);
        return ApiResponse.<NoteResponseWrapper>builder()
                .result(noteService.getListNotes(pageable))
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<NoteResponse> getNoteById(@PathVariable Long id) {
        var result = noteService.getNoteById(id);
        return new ApiResponse<>(1000, "success", result);
    }

}
