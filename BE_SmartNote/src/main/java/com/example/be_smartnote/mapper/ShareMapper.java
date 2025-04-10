package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.request.TaskRequest;
import com.example.be_smartnote.dto.response.ShareResponse;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.entities.Share;
import com.example.be_smartnote.entities.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ShareMapper {
    @Mapping(source = "id", target = "shareId")
    @Mapping(source = "inviteToken.email", target = "ghostName")
    @Mapping(source = "inviteToken.status", target = "status")
    @Mapping(expression = "java(share.getTask() != null ? share.getTask().getId() : share.getNote().getId())", target = "entityId")
    @Mapping(expression = "java(share.getTask() != null ? share.getTask().getTitle() : share.getNote().getTitle())", target = "title")
    @Mapping(source = "inviteToken.createdAt", target = "requestTime")
    @Mapping(source = "permission", target = "permission")
    @Mapping(source = "inviteToken.token", target = "tokenShare")
    @Mapping(expression = "java(share.getTask() != null ? \"TASK\" : \"NOTE\")", target = "type")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "note.id", target = "noteId")
    @Mapping(source = "user.email", target = "email")
    ShareResponse toShareResponse(Share share);
}
