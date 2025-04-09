package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.request.CommentRequest;
import com.example.be_smartnote.dto.response.CommentResponse;
import com.example.be_smartnote.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/save")
    public ApiResponse<CommentResponse> saveComment(@RequestBody CommentRequest request) {
        var result = commentService.saveComment(request);
        return ApiResponse.<CommentResponse>builder()
                .message("save comment successful")
                .code(1000)
                .result(result)
                .build();
    }

    @GetMapping("/list")
    public ApiResponse<List<CommentResponse>> getListCommentByLimit(@RequestParam int quantity, Long userId) {
        var result = commentService.getListCommentByLimit(quantity, userId);
        return ApiResponse.<List<CommentResponse>>builder()
                .message("Get list of comments successful")
                .code(1000)
                .result(result)
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Boolean> deleteComment(@PathVariable Long id) {
        boolean result = commentService.deleteComment(id);
        return ApiResponse.<Boolean>builder()
                .message("delete comment successful")
                .code(1000)
                .result(result)
                .build();

    }

    @PutMapping("/update")
    public ApiResponse<CommentResponse> updateComment(@RequestBody CommentRequest request,
                                                      @RequestParam Long commentId) {
        var result = commentService.updateComment(request, commentId);
        return ApiResponse.<CommentResponse>builder()
                .message("Update comment successful")
                .code(1000)
                .result(result)
                .build();
    }

}
