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
    public ApiResponse<CommentResponse> saveComment(@RequestBody CommentRequest request){
        var result = commentService.saveComment(request);
        return ApiResponse.<CommentResponse>builder()
                .message("save comment successful")
                .code(1000)
                .result(result)
                .build();
    }

    @GetMapping("/list")
    public ApiResponse<List<CommentResponse>> getListCommentByLimit(@RequestParam int quantity) {
        var result = commentService.getListCommentByLimit(quantity);
        return ApiResponse.<List<CommentResponse>>builder()
                .message("Get list of comments successful")
                .code(1000)
                .result(result)
                .build();
    }

    @DeleteMapping("/delete/{id}")
    public ApiResponse<Boolean> deleteComment(@PathVariable Long id){
        boolean result = commentService.deleteComment(id);
        return ApiResponse.<Boolean>builder()
                .message("delete comment successful")
                .code(1000)
                .result(result)
                .build();

    }
}
