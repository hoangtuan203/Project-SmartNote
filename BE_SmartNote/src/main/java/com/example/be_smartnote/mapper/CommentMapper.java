package com.example.be_smartnote.mapper;
import com.example.be_smartnote.dto.request.CommentRequest;
import com.example.be_smartnote.dto.response.CommentResponse;
import com.example.be_smartnote.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(source = "id", target = "commentId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "username")
    @Mapping(source = "note.id", target = "noteId")
    @Mapping(source = "createdAt", target = "createdAt")
    CommentResponse toCommentResponse(Comment comment);
    @Mapping(source = "userId", target = "user.id")
    @Mapping(source = "noteId", target = "note.id")
    Comment toComment(CommentRequest request);
}
