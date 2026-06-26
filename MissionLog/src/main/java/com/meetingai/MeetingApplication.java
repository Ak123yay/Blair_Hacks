package com.meetingai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MeetingApplication {
    public static void main(String[] args) {
        SpringApplication.run(MeetingApplication.class, args);
        System.out.println("\n========================================");
        System.out.println("AI MEETING MINUTES GENERATOR");
        System.out.println("========================================");
        System.out.println("Application started successfully!");
        System.out.println("Access the web interface at: http://localhost:8080");
        System.out.println("\nFEATURES AVAILABLE:");
        System.out.println("  - Live Microphone Recording");
        System.out.println("  - Audio File Upload (MP3, WAV, M4A)");
        System.out.println("  - Speech to Text Conversion");
        System.out.println("  - Automatic Summary Generation");
        System.out.println("  - Action Item Extraction");
        System.out.println("  - Decision Detection");
        System.out.println("  - Speaker Identification");
        System.out.println("  - Export to PDF, DOC, TXT");
        System.out.println("  - Email Minutes");
        System.out.println("========================================\n");
    }
}