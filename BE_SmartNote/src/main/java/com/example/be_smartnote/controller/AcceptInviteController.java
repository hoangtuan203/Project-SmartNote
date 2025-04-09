package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.InviteLinkResponse;
import com.example.be_smartnote.entities.Role;
import com.example.be_smartnote.repository.InviteTokenRepository;
import com.example.be_smartnote.service.InviteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invite")
public class AcceptInviteController {
    @Autowired
    private InviteService inviteService;

    private final InviteTokenRepository inviteTokenRepository;

    public AcceptInviteController(InviteTokenRepository inviteTokenRepository) {
        this.inviteTokenRepository = inviteTokenRepository;
    }

    @PostMapping("/send")
    public String sendInvitation(@RequestParam String email, @RequestParam Role role,
                                 @RequestParam(required = false) Long noteId,
                                 @RequestParam(required = false) Long taskId,
                                 @RequestParam(required = false) Long userId) {
        inviteService.sendInvitation(email, role, noteId, taskId, userId);
        return "Lời mời đã được gửi đến " + email;
    }


    @PostMapping("/accept")
    public String acceptInvitation(@RequestParam String token) {
        return inviteService.acceptInvitation(token);
    }

    @PostMapping("/generate-invite-link")
    public ApiResponse<InviteLinkResponse> generateInviteLink(
            @RequestParam Role role,
            @RequestParam(required = false) Long noteId,
            @RequestParam(required = false) Long taskId,
            @RequestParam(required = false) Long userId
    ) {
        InviteLinkResponse result = inviteService.generateInviteLink(role, noteId, taskId, userId);

        return ApiResponse.<InviteLinkResponse>builder()
                .code(1000)
                .message("create link success")
                .result(result)
                .build();
    }

    @GetMapping("/check-invite")
    public ResponseEntity<ApiResponse<InviteLinkResponse>> checkInvite(@RequestParam String token) {
        return inviteService.checkInvite(token);
    }

    @PostMapping("/request-access")
    public ResponseEntity<ApiResponse<String>> requestAccess(@RequestParam String token, @RequestParam String email) {
        return inviteService.requestAccess(token, email);
    }

    @PostMapping("/approve")
    public ResponseEntity<ApiResponse<String>> approveAccess(@RequestParam String token, @RequestParam boolean approve) {
        return inviteService.approveAccess(token, approve);
    }

}
