package com.meetingai.controller;

import com.meetingai.model.Meeting;
import com.meetingai.service.MinutesGeneratorService;
import com.meetingai.service.ExportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.File;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {
    
    @Autowired
    private MinutesGeneratorService minutesService;
    
    @Autowired
    private ExportService exportService;
    
    @GetMapping("/pdf/{id}")
    public ResponseEntity<FileSystemResource> exportToPDF(@PathVariable Long id) {
        try {
            Meeting meeting = minutesService.getMeeting(id).orElse(null);
            if (meeting == null) {
                return ResponseEntity.notFound().build();
            }
            
            String fileName = meeting.getTitle().replaceAll(" ", "_");
            String filePath = exportService.exportToPDF(meeting, fileName);
            
            File file = new File(filePath);
            FileSystemResource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/docx/{id}")
    public ResponseEntity<FileSystemResource> exportToDOCX(@PathVariable Long id) {
        try {
            Meeting meeting = minutesService.getMeeting(id).orElse(null);
            if (meeting == null) {
                return ResponseEntity.notFound().build();
            }
            
            String fileName = meeting.getTitle().replaceAll(" ", "_");
            String filePath = exportService.exportToDOCX(meeting, fileName);
            
            File file = new File(filePath);
            FileSystemResource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + ".docx\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/txt/{id}")
    public ResponseEntity<FileSystemResource> exportToTXT(@PathVariable Long id) {
        try {
            Meeting meeting = minutesService.getMeeting(id).orElse(null);
            if (meeting == null) {
                return ResponseEntity.notFound().build();
            }
            
            String fileName = meeting.getTitle().replaceAll(" ", "_");
            String filePath = exportService.exportToTXT(meeting, fileName);
            
            File file = new File(filePath);
            FileSystemResource resource = new FileSystemResource(file);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + ".txt\"")
                .contentType(MediaType.TEXT_PLAIN)
                .body(resource);
                
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}