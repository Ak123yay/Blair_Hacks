package com.meetingai.model;

import javax.persistence.*;

@Entity
@Table(name = "decisions")
public class Decision {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;
    private String madeBy;
    private String timestamp;
    private String impact;
    private String status;
    
    @ManyToOne
    private Meeting meeting;
    
    public Decision() {}
    
    // Getters
    public Long getId() { return id; }
    public String getDescription() { return description; }
    public String getMadeBy() { return madeBy; }
    public String getTimestamp() { return timestamp; }
    public String getImpact() { return impact; }
    public String getStatus() { return status; }
    public Meeting getMeeting() { return meeting; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setDescription(String description) { this.description = description; }
    public void setMadeBy(String madeBy) { this.madeBy = madeBy; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public void setImpact(String impact) { this.impact = impact; }
    public void setStatus(String status) { this.status = status; }
    public void setMeeting(Meeting meeting) { this.meeting = meeting; }
}