package com.meetingai.controller;

import com.meetingai.service.SpeechToTextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/audio")
@CrossOrigin(origins = "*")
public class AudioController {
    
    @Autowired
    private SpeechToTextService speechService;
    
    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadAudio(@RequestParam("file") MultipartFile file) {
        Map<String, String> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("error", "Please select an audio file");
                return ResponseEntity.badRequest().body(response);
            }
            
            String filePath = speechService.saveAudioFile(file);
            String transcript = speechService.transcribeAudio(filePath);
            speechService.deleteAudioFile(filePath);
            
            response.put("transcript", transcript);
            response.put("message", "Audio processed successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("error", "Error processing audio: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
    
    @PostMapping("/transcribe-demo")
    public ResponseEntity<Map<String, String>> transcribeDemo() {
        Map<String, String> response = new HashMap<>();
        
        String demoTranscript = "[John Smith] Good morning everyone. Let us start the meeting.\n" +
                               "[Sarah Johnson] I have prepared the Q1 report.\n" +
                               "[John Smith] Excellent. Sarah will lead the marketing campaign.\n" +
                               "[Mike Williams] I will handle the technical implementation.\n" +
                               "[Sarah Johnson] We decided to allocate $5000 for advertising.\n" +
                               "[John Smith] The team agreed to review progress every Monday.\n" +
                               "[John Smith] Meeting adjourned. Thank you everyone.";
        
        response.put("transcript", demoTranscript);
        response.put("message", "Demo transcript generated");
        
        return ResponseEntity.ok(response);
    }
}