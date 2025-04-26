package com.example.be_smartnote.controller;

import com.example.be_smartnote.dto.request.CalendarEventRequest;
import com.example.be_smartnote.dto.response.CalendarEventResponse;
import com.example.be_smartnote.entities.CalendarEvent;
import com.example.be_smartnote.service.CalendarEventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/calendar-events")
public class CalendarEventController {

    @Autowired
    private CalendarEventService calendarEventService;

    @PostMapping
    public ResponseEntity<CalendarEventResponse> createEvent(@RequestBody CalendarEventRequest request) {
        CalendarEventResponse response = calendarEventService.createEvent(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CalendarEventResponse>> getEventsByUser(@PathVariable Long userId) {
        List<CalendarEventResponse> events = calendarEventService.getEventsByUser(userId);
        return ResponseEntity.ok(events);
    }
}