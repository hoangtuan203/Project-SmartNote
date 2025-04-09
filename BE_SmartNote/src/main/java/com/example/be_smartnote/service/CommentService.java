package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.CommentRequest;
import com.example.be_smartnote.dto.response.CommentResponse;
import com.example.be_smartnote.entities.Comment;
import com.example.be_smartnote.entities.Note;
import com.example.be_smartnote.entities.Task;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.exception.AppException;
import com.example.be_smartnote.exception.ErrorCode;
import com.example.be_smartnote.mapper.CommentMapper;
import com.example.be_smartnote.repository.CommentRepository;
import com.example.be_smartnote.repository.NoteRepository;
import com.example.be_smartnote.repository.TaskRepository;
import com.example.be_smartnote.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final NoteRepository noteRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final CommentMapper commentMapper;

    public CommentService(CommentRepository commentRepository, CommentMapper commentMapper, UserRepository userRepository, NoteRepository noteRepository) {
        this.commentRepository = commentRepository;
        this.commentMapper = commentMapper;
        this.noteRepository = noteRepository;
        this.userRepository = userRepository;
    }

    public List<CommentResponse> getListCommentByLimit(int quantity, Long userId) {
        Pageable pageable = PageRequest.of(0, quantity, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Comment> comments = commentRepository.getListCommentByLimit(userId, pageable);

        return comments.stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }


    public CommentResponse saveComment(CommentRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Note note = noteRepository.findById(request.getNoteId())
                .orElseThrow(() -> new AppException(ErrorCode.NOTE_NOT_EXITS));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setNote(note);
        comment.setContent(request.getContent());
        comment.setCreatedAt(Instant.now());
        commentRepository.save(comment);

        return commentMapper.toCommentResponse(comment);
    }

    //delete comment
    public boolean deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COMMENT_NOT_EXITS));
        commentRepository.deleteById(id);
        return true;
    }

    public CommentResponse updateComment(CommentRequest request, Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setContent(request.getContent());
        comment.setCreatedAt(Instant.now()); // nếu bạn có field updatedAt
        commentRepository.save(comment);

        return commentMapper.toCommentResponse(comment);
    }

}
