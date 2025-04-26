package com.example.be_smartnote.mapper;

import com.example.be_smartnote.dto.response.CalendarEventResponse;
import com.example.be_smartnote.dto.response.CommentResponse;
import com.example.be_smartnote.entities.CalendarEvent;
import com.example.be_smartnote.entities.Comment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CalendarEventMapper {
    @Mapping(source = "id", target = "eventId")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "title", target = "title")
    @Mapping(source = "description", target = "description")
    @Mapping(source = "startTime", target = "start_time")
    @Mapping(source = "endTime", target = "end_time")
    @Mapping(source = "location", target = "location")
    @Mapping(source = "createdAt", target = "createdAt")
    CalendarEventResponse toCalendarEventResponse(CalendarEvent event);
}
