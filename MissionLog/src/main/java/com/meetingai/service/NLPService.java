package com.meetingai.service;

import com.meetingai.model.ActionItem;
import com.meetingai.model.Decision;
import com.meetingai.model.Speaker;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class NLPService {
    
    public Map<String, Object> analyzeTranscript(String transcript) {
        Map<String, Object> result = new HashMap<>();
        
        String summary = extractSummary(transcript);
        result.put("summary", summary);
        
        String keyPoints = extractKeyPoints(transcript);
        result.put("keyPoints", keyPoints);
        
        String decisions = extractDecisions(transcript);
        result.put("decisions", decisions);
        
        String actionItems = extractActionItems(transcript);
        result.put("actionItems", actionItems);
        
        String speakerNotes = extractSpeakerNotes(transcript);
        result.put("speakerNotes", speakerNotes);
        
        String fullMinutes = generateFullMinutes(transcript, summary, keyPoints, decisions, actionItems);
        result.put("fullMinutes", fullMinutes);
        
        String attendees = extractAttendees(transcript);
        result.put("attendees", attendees);
        
        String duration = extractDuration(transcript);
        result.put("duration", duration);
        
        String tags = extractTags(transcript);
        result.put("tags", tags);
        
        List<ActionItem> actionItemsList = extractActionItemsList(transcript);
        result.put("actionItemsList", actionItemsList);
        
        List<Decision> decisionsList = extractDecisionsList(transcript);
        result.put("decisionsList", decisionsList);
        
        List<Speaker> speakers = extractSpeakers(transcript);
        result.put("speakers", speakers);
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSpeakers", speakers.size());
        stats.put("totalWords", transcript.split("\\s+").length);
        result.put("statistics", stats);
        
        return result;
    }
    
    private String extractSummary(String transcript) {
        String[] sentences = transcript.split("[.!?]");
        StringBuilder summary = new StringBuilder();
        
        int count = 0;
        for (String sentence : sentences) {
            if (sentence.trim().length() > 20 && count < 5) {
                summary.append("- ").append(sentence.trim()).append(".\n");
                count++;
            }
        }
        
        if (summary.length() == 0) {
            summary.append("No clear summary could be extracted.");
        }
        
        return summary.toString();
    }
    
    private String extractKeyPoints(String transcript) {
        String[] sentences = transcript.split("[.!?]");
        StringBuilder keyPoints = new StringBuilder();
        int count = 1;
        
        for (String sentence : sentences) {
            if (sentence.toLowerCase().contains("important") || 
                sentence.toLowerCase().contains("key") ||
                sentence.toLowerCase().contains("critical")) {
                if (count <= 8) {
                    keyPoints.append(count).append(". ").append(sentence.trim()).append(".\n");
                    count++;
                }
            }
        }
        
        if (keyPoints.length() == 0) {
            for (int i = 0; i < Math.min(5, sentences.length); i++) {
                if (sentences[i].trim().length() > 20) {
                    keyPoints.append(i+1).append(". ").append(sentences[i].trim()).append(".\n");
                }
            }
        }
        
        return keyPoints.toString();
    }
    
    private String extractDecisions(String transcript) {
        String[] sentences = transcript.split("[.!?]");
        StringBuilder decisions = new StringBuilder();
        int count = 1;
        
        String[] keywords = {"decided", "agreed", "concluded", "resolved", "determined", "approved"};
        
        for (String sentence : sentences) {
            String lower = sentence.toLowerCase();
            for (String keyword : keywords) {
                if (lower.contains(keyword)) {
                    decisions.append(count).append(". ").append(sentence.trim()).append(".\n");
                    count++;
                    break;
                }
            }
        }
        
        if (decisions.length() == 0) {
            decisions.append("No major decisions recorded.");
        }
        
        return decisions.toString();
    }
    
    private String extractActionItems(String transcript) {
        String[] sentences = transcript.split("[.!?]");
        StringBuilder actions = new StringBuilder();
        int count = 1;
        
        String[] keywords = {"will", "need to", "must", "should", "has to", "responsible for"};
        
        for (String sentence : sentences) {
            String lower = sentence.toLowerCase();
            for (String keyword : keywords) {
                if (lower.contains(keyword)) {
                    actions.append(count).append(". ").append(sentence.trim()).append(".\n");
                    count++;
                    break;
                }
            }
        }
        
        if (actions.length() == 0) {
            actions.append("No action items identified.");
        }
        
        return actions.toString();
    }
    
    private List<ActionItem> extractActionItemsList(String transcript) {
        List<ActionItem> items = new ArrayList<>();
        String[] sentences = transcript.split("[.!?]");
        
        Pattern personPattern = Pattern.compile("([A-Z][a-z]+(?: [A-Z][a-z]+)?)");
        
        for (String sentence : sentences) {
            if (sentence.toLowerCase().contains("will") || sentence.toLowerCase().contains("need to")) {
                ActionItem item = new ActionItem();
                item.setDescription(sentence.trim());
                
                Matcher matcher = personPattern.matcher(sentence);
                if (matcher.find()) {
                    item.setAssignee(matcher.group(1));
                } else {
                    item.setAssignee("Unassigned");
                }
                
                item.setDueDate("Not specified");
                item.setPriority("MEDIUM");
                item.setStatus("PENDING");
                item.setTimestamp(new Date().toString());
                items.add(item);
            }
        }
        
        return items;
    }
    
    private List<Decision> extractDecisionsList(String transcript) {
        List<Decision> decisions = new ArrayList<>();
        String[] sentences = transcript.split("[.!?]");
        
        for (String sentence : sentences) {
            if (sentence.toLowerCase().contains("decided") || sentence.toLowerCase().contains("agreed")) {
                Decision decision = new Decision();
                decision.setDescription(sentence.trim());
                decision.setMadeBy("Team");
                decision.setTimestamp(new Date().toString());
                decision.setImpact("To be determined");
                decision.setStatus("ACTIVE");
                decisions.add(decision);
            }
        }
        
        return decisions;
    }
    
    private List<Speaker> extractSpeakers(String transcript) {
        List<Speaker> speakers = new ArrayList<>();
        Pattern speakerPattern = Pattern.compile("\\[([^\\]]+)\\]");
        Matcher matcher = speakerPattern.matcher(transcript);
        
        Map<String, Integer> speakerCount = new HashMap<>();
        
        while (matcher.find()) {
            String speaker = matcher.group(1);
            speakerCount.put(speaker, speakerCount.getOrDefault(speaker, 0) + 1);
        }
        
        int total = speakerCount.values().stream().mapToInt(Integer::intValue).sum();
        
        for (Map.Entry<String, Integer> entry : speakerCount.entrySet()) {
            Speaker speaker = new Speaker();
            speaker.setName(entry.getKey());
            speaker.setTotalUtterances(entry.getValue());
            double percentage = total > 0 ? (entry.getValue() * 100.0) / total : 0;
            speaker.setSpeakingPercentage(Math.round(percentage * 10) / 10.0);
            speakers.add(speaker);
        }
        
        return speakers;
    }
    
    private String extractSpeakerNotes(String transcript) {
        StringBuilder notes = new StringBuilder();
        List<Speaker> speakers = extractSpeakers(transcript);
        
        for (Speaker speaker : speakers) {
            notes.append("- ").append(speaker.getName()).append(": ");
            notes.append(speaker.getSpeakingPercentage()).append("% of speaking time\n");
        }
        
        return notes.toString();
    }
    
    private String extractAttendees(String transcript) {
        Set<String> attendees = new HashSet<>();
        Pattern namePattern = Pattern.compile("\\[([A-Z][a-z]+(?: [A-Z][a-z]+)?)\\]");
        Matcher matcher = namePattern.matcher(transcript);
        
        while (matcher.find()) {
            attendees.add(matcher.group(1));
        }
        
        if (attendees.isEmpty()) {
            return "Not specified";
        }
        
        return String.join(", ", attendees);
    }
    
    private String extractDuration(String transcript) {
        Pattern timePattern = Pattern.compile("(\\d{1,2}:\\d{2})");
        Matcher matcher = timePattern.matcher(transcript);
        
        List<String> times = new ArrayList<>();
        while (matcher.find()) {
            times.add(matcher.group(1));
        }
        
        if (times.size() >= 2) {
            return "From " + times.get(0) + " to " + times.get(1);
        }
        
        return "Duration not specified";
    }
    
    private String extractTags(String transcript) {
        Set<String> tags = new HashSet<>();
        String[] commonTags = {"meeting", "planning", "review", "update", "decision", "action"};
        
        for (String tag : commonTags) {
            if (transcript.toLowerCase().contains(tag)) {
                tags.add(tag);
            }
        }
        
        return String.join(", ", tags);
    }
    
    private String generateFullMinutes(String transcript, String summary, String keyPoints, 
                                        String decisions, String actionItems) {
        StringBuilder minutes = new StringBuilder();
        
        minutes.append("=".repeat(60)).append("\n");
        minutes.append("MEETING MINUTES\n");
        minutes.append("=".repeat(60)).append("\n\n");
        
        minutes.append("Date: ").append(java.time.LocalDate.now()).append("\n");
        minutes.append("Time: ").append(java.time.LocalTime.now()).append("\n\n");
        
        minutes.append("SUMMARY:\n");
        minutes.append("-".repeat(30)).append("\n");
        minutes.append(summary).append("\n\n");
        
        minutes.append("KEY POINTS:\n");
        minutes.append("-".repeat(30)).append("\n");
        minutes.append(keyPoints).append("\n\n");
        
        minutes.append("DECISIONS:\n");
        minutes.append("-".repeat(30)).append("\n");
        minutes.append(decisions).append("\n\n");
        
        minutes.append("ACTION ITEMS:\n");
        minutes.append("-".repeat(30)).append("\n");
        minutes.append(actionItems).append("\n\n");
        
        minutes.append("FULL TRANSCRIPT:\n");
        minutes.append("-".repeat(30)).append("\n");
        minutes.append(transcript).append("\n\n");
        
        minutes.append("=".repeat(60)).append("\n");
        minutes.append("Generated by AI Meeting Minutes Generator\n");
        
        return minutes.toString();
    }
}