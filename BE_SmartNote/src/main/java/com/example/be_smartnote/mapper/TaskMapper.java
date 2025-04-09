package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.request.TaskRequest;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.entities.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    @Mapping(source = "id", target = "taskId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "user.fullName", target = "username")
    @Mapping(source = "createdAt", target = "createAt")
    @Mapping(source = "assignee", target = "assignee")
    TaskResponse toTaskResponse(Task task);
    Task toUser(TaskRequest request);
}
