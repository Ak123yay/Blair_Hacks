package com.meetingai.controller;

import com.meetingai.model.Meeting;
import com.meetingai.service.MinutesGeneratorService;
import com.meetingai.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meetings")
@CrossOrigin(origins = "*")
public class MeetingController {
    
    @Autowired
    private MinutesGeneratorService minutesService;
    
    @Autowired
    private ExportService exportService;
    
    @PostMapping
    public ResponseEntity<Meeting> createMeeting(@RequestBody Meeting meeting) {
        Meeting saved = minutesService.createMeetingFromTranscript(
            meeting.getTitle(), 
            meeting.getDate(), 
            meeting.getTranscript()
        );
        return ResponseEntity.ok(saved);
    }
    
    @PostMapping("/generate")
    public ResponseEntity<Meeting> generateMinutes(@RequestBody Meeting meeting) {
        Meeting processed = minutesService.createMeetingFromTranscript(
            meeting.getTitle(),
            meeting.getDate(),
            meeting.getTranscript()
        );
        return ResponseEntity.ok(processed);
    }
    
    @GetMapping
    public ResponseEntity<List<Meeting>> getAllMeetings() {
        return ResponseEntity.ok(minutesService.getAllMeetings());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Meeting> getMeeting(@PathVariable Long id) {
        return minutesService.getMeeting(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Boolean>> deleteMeeting(@PathVariable Long id) {
        minutesService.deleteMeeting(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("deleted", true);
        return ResponseEntity.ok(response);
    }
}