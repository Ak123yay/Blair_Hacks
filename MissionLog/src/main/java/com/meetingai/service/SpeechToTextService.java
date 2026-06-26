package com.meetingai.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class SpeechToTextService {
    
    private final String UPLOAD_DIR = "audio_uploads/";
    
    public SpeechToTextService() {
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }
    
    public String saveAudioFile(MultipartFile file) throws IOException {
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());
        return filePath.toString();
    }
    
    public String transcribeAudio(String audioFilePath) {
        // Simulated transcription for demo
        String fileName = new File(audioFilePath).getName();
        
        StringBuilder transcript = new StringBuilder();
        transcript.append("[John Smith] Good morning everyone. Let us start the meeting.\n");
        transcript.append("[Sarah Johnson] I have prepared the Q1 report.\n");
        transcript.append("[John Smith] Excellent. What is the timeline?\n");
        transcript.append("[Sarah Johnson] We need to launch by February 15th.\n");
        transcript.append("[John Smith] Sarah will lead the marketing campaign.\n");
        transcript.append("[Mike Williams] I will handle the technical implementation.\n");
        transcript.append("[Sarah Johnson] We decided to allocate $5000 for advertising.\n");
        transcript.append("[John Smith] The team agreed to review progress every Monday.\n");
        transcript.append("[John Smith] Meeting adjourned. Thank you everyone.\n");
        
        return transcript.toString();
    }
    
    public void deleteAudioFile(String filePath) {
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            System.err.println("Error deleting audio: " + e.getMessage());
        }
    }
}