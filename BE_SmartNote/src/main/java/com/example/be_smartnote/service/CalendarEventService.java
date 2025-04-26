package com.example.be_smartnote.service;

import com.example.be_smartnote.dto.request.CalendarEventRequest;
import com.example.be_smartnote.dto.response.CalendarEventResponse;
import com.example.be_smartnote.entities.CalendarEvent;
import com.example.be_smartnote.entities.User;
import com.example.be_smartnote.mapper.CalendarEventMapper;
import com.example.be_smartnote.repository.CalendarEventRepository;
import com.example.be_smartnote.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final UserRepository userRepository;
    private final CalendarEventMapper calendarEventMapper;

    public CalendarEventService(
            CalendarEventRepository calendarEventRepository,
            UserRepository userRepository,
            CalendarEventMapper calendarEventMapper
    ) {
        this.calendarEventRepository = calendarEventRepository;
        this.userRepository = userRepository;
        this.calendarEventMapper = calendarEventMapper;
    }

    public CalendarEventResponse createEvent(CalendarEventRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CalendarEvent event = new CalendarEvent();
        event.setUser(user);
        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setStartTime(request.getStartTime());
        event.setEndTime(request.getEndTime());
        event.setLocation(request.getLocation());
        event.setColor(request.getColor());
        event.setCreatedAt(LocalDateTime.now());
        event.setUpdatedAt(LocalDateTime.now());

        CalendarEvent savedEvent = calendarEventRepository.save(event);
        return calendarEventMapper.toCalendarEventResponse(savedEvent);
    }

    public List<CalendarEventResponse> getEventsByUser(Long userId) {
        List<CalendarEvent> events = calendarEventRepository.findByUserId(userId);
        return events.stream()
                .map(calendarEventMapper::toCalendarEventResponse)
                .collect(Collectors.toList());
    }
}
