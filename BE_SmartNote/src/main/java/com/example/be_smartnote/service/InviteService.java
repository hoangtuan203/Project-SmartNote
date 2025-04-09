package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.ApiResponse;
import com.example.be_smartnote.dto.response.InviteLinkResponse;
import com.example.be_smartnote.entities.*;
import com.example.be_smartnote.repository.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class InviteService {
    private final InviteTokenRepository inviteTokenRepository;
    private final JavaMailSender mailSender;
    private final UserService userService;
    private final NoteRepository noteRepository;
    private final TaskRepository taskRepository;

    public InviteService(JavaMailSender mailSender, InviteTokenRepository inviteTokenRepository,
                         UserService userService, NoteRepository noteRepository, TaskRepository taskRepository,
                         UserRepository userRepository,
                         ShareRepository shareRepository) {
        this.mailSender = mailSender;
        this.inviteTokenRepository = inviteTokenRepository;
        this.userService = userService;
        this.noteRepository = noteRepository;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.shareRepository = shareRepository;
    }

    private final String FRONTEND_URL = "http://localhost:5173"; // Link React
    private final UserRepository userRepository;
    private final ShareRepository shareRepository;

    // Gửi email mời với role (không liên kết note/task)
    public void sendInvitation(String email, Role role, Long noteId, Long taskId, Long userId) {
        // Ensure that either noteId or taskId is provided, but not both.
        if (noteId != null && taskId != null) {
            throw new IllegalArgumentException("Invitation can only be associated with either a note or a task, not both.");
        }

        // Generate a unique token for the invitation
        String token = UUID.randomUUID().toString();
        InviteToken inviteToken = new InviteToken();

        inviteToken.setEmail(email);
        inviteToken.setRole(role);
        inviteToken.setToken(token);
        inviteToken.setExpiryDate(LocalDateTime.now().plusDays(7)); // Token expires after 7 days
        inviteToken.setStatus(InviteStatus.PENDING);

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            inviteToken.setUser(user);
        }
        // Associate the invitation with a note or task, if provided
        if (noteId != null) {
            Note note = noteRepository.findById(noteId)
                    .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
            inviteToken.setNote(note);
            inviteToken.setTask(null);  // Set task to null if a note is provided
        } else if (taskId != null) {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));
            inviteToken.setTask(task);
            inviteToken.setNote(null);  // Set note to null if a task is provided
        }

        // Save the invitation token in the repository
        inviteTokenRepository.save(inviteToken);

        // Construct the invitation link
        String link = FRONTEND_URL + "/join?token=" + token;
        String message = "Bạn đã được mời vào hệ thống. Nhấp vào đây để tham gia: " + link;

        // Send the invitation email
        SimpleMailMessage emailMessage = new SimpleMailMessage();
        emailMessage.setTo(email);
        emailMessage.setSubject("Lời mời tham gia hệ thống");
        emailMessage.setText(message);
        mailSender.send(emailMessage);
    }


    // Chấp nhận lời mời
    public String acceptInvitation(String token) {
        Optional<InviteToken> inviteOpt = inviteTokenRepository.findByToken(token);

        if (inviteOpt.isEmpty()) {
            return "Lời mời không hợp lệ.";
        }

        InviteToken inviteToken = inviteOpt.get();

        // Nếu lời mời đã được chấp nhận trước đó
        if (inviteToken.getStatus() == InviteStatus.ACCEPTED) {
            return "Lời mời này đã được chấp nhận trước đó.";
        }

        // Nếu lời mời đã hết hạn
        if (inviteToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            if (inviteToken.getStatus() != InviteStatus.EXPIRED) {
                inviteToken.setStatus(InviteStatus.EXPIRED);
                inviteTokenRepository.save(inviteToken);
            }
            return "Lời mời đã hết hạn.";
        }

        // Chấp nhận lời mời
        inviteToken.setAcceptedAt(LocalDateTime.now());
        inviteToken.setStatus(InviteStatus.ACCEPTED);
        inviteTokenRepository.save(inviteToken);

        return "Bạn đã chấp nhận lời mời! Quyền của bạn là: " + inviteToken.getRole();
    }

    // Tạo link mời với noteId hoặc taskId
    public InviteLinkResponse generateInviteLink(Role role, Long noteId, Long taskId, Long userId) {
        if (noteId != null && taskId != null) {
            throw new IllegalArgumentException("Invite link can only be associated with either a note or a task, not both.");
        }

        String tokenValue = UUID.randomUUID().toString();
        InviteToken inviteToken = new InviteToken();
        inviteToken.setToken(tokenValue);
        inviteToken.setRole(role);
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(7);
        inviteToken.setExpiryDate(expiryDate);
        inviteToken.setStatus(InviteStatus.PENDING);
        Long responseNoteId = null;
        Long responseTaskId = null;


        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
            inviteToken.setUser(user);
        }

        if (noteId != null) {
            Note note = noteRepository.findById(noteId)
                    .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + noteId));
            inviteToken.setNote(note);
            inviteToken.setTask(null);
            responseNoteId = noteId;
        } else if (taskId != null) {
            Task task = taskRepository.findById(taskId)
                    .orElseThrow(() -> new IllegalArgumentException("Task not found with id: " + taskId));
            inviteToken.setTask(task);
            inviteToken.setNote(null);
            responseTaskId = taskId;
        }

        inviteTokenRepository.save(inviteToken);
        String inviteLink = FRONTEND_URL + "/join?token=" + tokenValue;

        return new InviteLinkResponse(inviteLink, InviteStatus.PENDING, expiryDate, responseNoteId, responseTaskId);
    }

    // Kiểm tra trạng thái của link mời
    public ResponseEntity<ApiResponse<InviteLinkResponse>> checkInvite(String token) {
        Optional<InviteToken> inviteTokenOpt = inviteTokenRepository.findByToken(token);
        if (inviteTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<InviteLinkResponse>builder()
                    .code(400)
                    .message("Invalid or expired invite link")
                    .build());
        }

        InviteToken inviteToken = inviteTokenOpt.get();
        Long noteId = (inviteToken.getNote() != null) ? inviteToken.getNote().getId() : null;
        Long taskId = (inviteToken.getTask() != null) ? inviteToken.getTask().getId() : null;

        InviteLinkResponse response = new InviteLinkResponse(
                FRONTEND_URL + "/join?token=" + token,
                inviteToken.getStatus(),
                inviteToken.getExpiryDate(),
                noteId,
                taskId
        );

        return ResponseEntity.ok(ApiResponse.<InviteLinkResponse>builder()
                .code(1000)
                .message("Valid invite link")
                .result(response)
                .build());
    }

    // Người dùng yêu cầu quyền truy cập
    public ResponseEntity<ApiResponse<String>> requestAccess(String token, String email) {
        log.info("Email request: {}", email);

        // Tìm InviteToken theo token
        Optional<InviteToken> inviteTokenOpt = inviteTokenRepository.findByToken(token);
        if (inviteTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .message("Invalid invite token")
                    .build());
        }

        InviteToken inviteToken = inviteTokenOpt.get();

        // Kiểm tra xem InviteToken đã được sử dụng hoặc hết hạn chưa
        if (inviteToken.getStatus() == InviteStatus.ACCEPTED ||
                inviteToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .message("Invite token is already used or expired")
                    .build());
        }

        // Nếu email từ request không null, gán nó vào InviteToken
        if (email != null && !email.isBlank()) {
            inviteToken.setEmail(email);
            inviteTokenRepository.save(inviteToken); // Lưu lại thay đổi vào database
        }

        // Lấy email từ InviteToken (đã được cập nhật)
        String userEmail = inviteToken.getEmail();
        if (userEmail == null || userEmail.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .message("Email is required for accessing invite")
                    .build());
        }

        // Tìm User theo email
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found: " + userEmail));

        // Tạo bản ghi Share
        Share share = new Share();
        share.setNote(inviteToken.getNote());
        share.setTask(inviteToken.getTask());
        share.setUser(currentUser);
        share.setPermission(inviteToken.getRole()); // Ánh xạ Role từ InviteToken
        share.setInviteToken(inviteToken);
        share.setCreatedAt(Instant.now());

        // Lưu vào bảng Share
        shareRepository.save(share);

        // Cập nhật trạng thái InviteToken thành PENDING
        inviteToken.setStatus(InviteStatus.PENDING);
        inviteTokenRepository.save(inviteToken);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(1000)
                .message("Request sent, waiting for approval")
                .build());
    }

    // Admin chấp nhận hoặc từ chối yêu cầu
    public ResponseEntity<ApiResponse<String>> approveAccess(String token, boolean approve) {
        Optional<InviteToken> inviteTokenOpt = inviteTokenRepository.findByToken(token);
        if (inviteTokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                    .code(400)
                    .message("Invalid invite token")
                    .build());
        }

        InviteToken tokenEntity = inviteTokenOpt.get();
        tokenEntity.setAcceptedAt(LocalDateTime.now());
        tokenEntity.setStatus(approve ? InviteStatus.ACCEPTED : InviteStatus.EXPIRED);
        inviteTokenRepository.save(tokenEntity);

        return ResponseEntity.ok(ApiResponse.<String>builder()
                .code(1000)
                .message(approve ? "Access approved" : "Access denied")
                .build());
    }
}