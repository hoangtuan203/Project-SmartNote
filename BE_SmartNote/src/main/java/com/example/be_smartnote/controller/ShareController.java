package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.ShareResponse;
import com.example.be_smartnote.service.ShareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/share")
public class ShareController {
    @Autowired
    private ShareService shareService;
    @GetMapping()
    public ApiResponse<List<ShareResponse>> getListRequestShare(){
        var result = shareService.getAllShares();
        return ApiResponse.<List<ShareResponse>>builder()
                .code(1000)
                .message("get list share success")
                .result(result)
                .build();
    }


    @GetMapping("/getListShareApprove")
    public ApiResponse<List<ShareResponse>> getShareByApprove(){
        var result = shareService.getShareWithApprove();
        return ApiResponse.<List<ShareResponse>>builder()
                .code(1000)
                .message("get list share success")
                .result(result)
                .build();
    }
}
