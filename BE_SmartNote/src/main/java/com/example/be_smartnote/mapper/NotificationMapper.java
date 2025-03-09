package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.response.NotificationResponse;
import com.example.be_smartnote.dto.response.TaskResponse;
import com.example.be_smartnote.entities.Notification;
import com.example.be_smartnote.entities.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(source = "id", target = "notificationId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "createdAt", target = "createdAt")
    NotificationResponse toNotificationResponse(Notification notification);
}
