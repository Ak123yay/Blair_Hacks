package com.meetingai.model;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "speakers")
public class Speaker {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String role;
    private String email;
    private Double speakingPercentage;
    private Integer totalUtterances;
    
    @Column(columnDefinition = "LONGTEXT")
    private String contributions;
    
    @ElementCollection
    private List<String> keyPhrases = new ArrayList<>();
    
    @ManyToOne
    private Meeting meeting;
    
    public Speaker() {}
    
    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getRole() { return role; }
    public String getEmail() { return email; }
    public Double getSpeakingPercentage() { return speakingPercentage; }
    public Integer getTotalUtterances() { return totalUtterances; }
    public String getContributions() { return contributions; }
    public List<String> getKeyPhrases() { return keyPhrases; }
    public Meeting getMeeting() { return meeting; }
    
    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setRole(String role) { this.role = role; }
    public void setEmail(String email) { this.email = email; }
    public void setSpeakingPercentage(Double speakingPercentage) { this.speakingPercentage = speakingPercentage; }
    public void setTotalUtterances(Integer totalUtterances) { this.totalUtterances = totalUtterances; }
    public void setContributions(String contributions) { this.contributions = contributions; }
    public void setKeyPhrases(List<String> keyPhrases) { this.keyPhrases = keyPhrases; }
    public void setMeeting(Meeting meeting) { this.meeting = meeting; }
}