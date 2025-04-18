package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.RecentNoteResponse;
import com.example.be_smartnote.service.RecentNoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recent-note")
public class RecentNoteController {

    @Autowired
    private RecentNoteService recentNoteService;

    @GetMapping("/getListByQuantity")
    public ApiResponse<List<RecentNoteResponse>> getListRecentNote(@RequestParam(defaultValue = "10") int quantity, @RequestParam(name = "userId") Long userId) {
        List<RecentNoteResponse> result = recentNoteService.getListRecentNote(quantity, userId);

        return ApiResponse.<List<RecentNoteResponse>>builder()
                .code(1000)
                .message("success")
                .result(result)
                .build();
    }

    @PostMapping("/save")
    public ApiResponse<List<RecentNoteResponse>> saveRecentNote(@RequestParam Long userId, @RequestParam Long noteId) {
        List<RecentNoteResponse> result = recentNoteService.saveOrUpdateRecentNote(userId, noteId);
        return ApiResponse.<List<RecentNoteResponse>>builder()
                .code(1000)
                .message("save recent note success")
                .result(result)
                .build();
    }
}
