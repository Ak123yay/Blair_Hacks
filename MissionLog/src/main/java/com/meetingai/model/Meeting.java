package com.meetingai.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "meetings")
public class Meeting {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String date;
    
    @Column(columnDefinition = "LONGTEXT")
    private String transcript;
    
    @Column(columnDefinition = "LONGTEXT")
    private String summary;
    
    @Column(columnDefinition = "LONGTEXT")
    private String keyPoints;
    
    @Column(columnDefinition = "LONGTEXT")
    private String decisions;
    
    @Column(columnDefinition = "LONGTEXT")
    private String actionItems;
    
    @Column(columnDefinition = "LONGTEXT")
    private String speakerNotes;
    
    @Column(columnDefinition = "LONGTEXT")
    private String fullMinutes;
    
    private String attendeeList;
    private Integer attendeeCount;
    private String organizer;
    private String tags;
    private String status;
    private String duration;
    private String meetingType;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Meeting() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = "DRAFT";
    }
    
    public Meeting(String title, String date) {
        this();
        this.title = title;
        this.date = date;
    }
    
    // Getters
    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDate() { return date; }
    public String getTranscript() { return transcript; }
    public String getSummary() { return summary; }
    public String getKeyPoints() { return keyPoints; }
    public String getDecisions() { return decisions; }
    public String getActionItems() { return actionItems; }
    public String getSpeakerNotes() { return speakerNotes; }
    public String getFullMinutes() { return fullMinutes; }
    public String getAttendeeList() { return attendeeList; }
    public Integer getAttendeeCount() { return attendeeCount; }
    public String getOrganizer() { return organizer; }
    public String getTags() { return tags; }
    public String getStatus() { return status; }
    public String getDuration() { return duration; }
    public String getMeetingType() { return meetingType; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    
    // Setters
    public void setMinutes(String minutes) { this.fullMinutes = minutes; }
    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDate(String date) { this.date = date; }
    public void setTranscript(String transcript) { this.transcript = transcript; }
    public void setSummary(String summary) { this.summary = summary; }
    public void setKeyPoints(String keyPoints) { this.keyPoints = keyPoints; }
    public void setDecisions(String decisions) { this.decisions = decisions; }
    public void setActionItems(String actionItems) { this.actionItems = actionItems; }
    public void setSpeakerNotes(String speakerNotes) { this.speakerNotes = speakerNotes; }
    public void setFullMinutes(String fullMinutes) { this.fullMinutes = fullMinutes; }
    public void setAttendeeList(String attendeeList) { this.attendeeList = attendeeList; }
    public void setAttendeeCount(Integer attendeeCount) { this.attendeeCount = attendeeCount; }
    public void setOrganizer(String organizer) { this.organizer = organizer; }
    public void setTags(String tags) { this.tags = tags; }
    public void setStatus(String status) { this.status = status; }
    public void setDuration(String duration) { this.duration = duration; }
    public void setMeetingType(String meetingType) { this.meetingType = meetingType; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}