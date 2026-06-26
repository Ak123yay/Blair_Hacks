package com.meetingai.service;

import com.meetingai.model.Meeting;
import com.meetingai.model.ActionItem;
import com.meetingai.model.Decision;
import com.meetingai.model.Speaker;
import com.meetingai.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MinutesGeneratorService {
    
    @Autowired
    private MeetingRepository meetingRepository;
    
    @Autowired
    private NLPService nlpService;
    
    public Meeting generateCompleteMinutes(Meeting meeting) {
        Map<String, Object> analysis = nlpService.analyzeTranscript(meeting.getTranscript());
        
        meeting.setSummary((String) analysis.get("summary"));
        meeting.setKeyPoints((String) analysis.get("keyPoints"));
        meeting.setDecisions((String) analysis.get("decisions"));
        meeting.setActionItems((String) analysis.get("actionItems"));
        meeting.setSpeakerNotes((String) analysis.get("speakerNotes"));
        meeting.setFullMinutes((String) analysis.get("fullMinutes"));
        meeting.setAttendeeList((String) analysis.get("attendees"));
        meeting.setTags((String) analysis.get("tags"));
        meeting.setDuration((String) analysis.get("duration"));
        
        Map<String, Object> stats = (Map<String, Object>) analysis.get("statistics");
        meeting.setAttendeeCount((Integer) stats.get("totalSpeakers"));
        
        meeting.setUpdatedAt(LocalDateTime.now());
        meeting.setStatus("COMPLETED");
        
        return meetingRepository.save(meeting);
    }
    
    public Meeting createMeetingFromTranscript(String title, String date, String transcript) {
        Meeting meeting = new Meeting(title, date);
        meeting.setTranscript(transcript);
        meeting.setMeetingType("AI Generated");
        meeting.setOrganizer("System");
        
        return generateCompleteMinutes(meeting);
    }
    
    public Optional<Meeting> getMeeting(Long id) {
        return meetingRepository.findById(id);
    }
    
    public List<Meeting> getAllMeetings() {
        return meetingRepository.findAll();
    }
    
    public void deleteMeeting(Long id) {
        meetingRepository.deleteById(id);
    }
}