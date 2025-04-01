package com.example.be_smartnote.dto.response;

import com.example.be_smartnote.entities.InviteStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class InviteLinkResponse {
    private String inviteLink;
    private InviteStatus status;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime expiryDate;
    private Long noteId;
    private Long taskId;
}