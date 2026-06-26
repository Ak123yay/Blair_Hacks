package com.meetingai.model;

import javax.persistence.*;

@Entity
@Table(name = "action_items")
public class ActionItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String description;
    private String assignee;
    private String dueDate;
    private String priority;
    private String status;
    private String timestamp;
    
    @ManyToOne
    private Meeting meeting;
    
    public ActionItem() {
        this.status = "PENDING";
        this.priority = "MEDIUM";
    }
    
    // Getters
    public Long getId() { return id; }
    public String getDescription() { return description; }
    public String getAssignee() { return assignee; }
    public String getDueDate() { return dueDate; }
    public String getPriority() { return priority; }
    public String getStatus() { return status; }
    public String getTimestamp() { return timestamp; }
    public Meeting getMeeting() { return meeting; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setDescription(String description) { this.description = description; }
    public void setAssignee(String assignee) { this.assignee = assignee; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public void setPriority(String priority) { this.priority = priority; }
    public void setStatus(String status) { this.status = status; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
    public void setMeeting(Meeting meeting) { this.meeting = meeting; }
}