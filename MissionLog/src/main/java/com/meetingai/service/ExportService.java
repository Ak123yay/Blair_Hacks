package com.meetingai.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;
import com.meetingai.model.Meeting;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.PrintWriter;

@Service
public class ExportService {
    
    private final String EXPORT_DIR = "exports/";
    
    public ExportService() {
        new java.io.File(EXPORT_DIR).mkdirs();
    }
    
    public String exportToPDF(Meeting meeting, String filePath) throws Exception {
        String pdfPath = EXPORT_DIR + filePath + ".pdf";
        
        PdfWriter writer = new PdfWriter(pdfPath);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);
        
        // Title
        Paragraph title = new Paragraph("MEETING MINUTES")
            .setTextAlignment(TextAlignment.CENTER)
            .setFontSize(20);
        document.add(title);
        
        document.add(new Paragraph(" "));
        
        // Meeting details
        document.add(new Paragraph("Meeting Title: " + meeting.getTitle()));
        document.add(new Paragraph("Date: " + meeting.getDate()));
        document.add(new Paragraph("Duration: " + meeting.getDuration()));
        document.add(new Paragraph("Attendees: " + meeting.getAttendeeList()));
        document.add(new Paragraph(" "));
        
        // Summary
        document.add(new Paragraph("EXECUTIVE SUMMARY").setBold());
        document.add(new Paragraph(meeting.getSummary()));
        document.add(new Paragraph(" "));
        
        // Key Points
        document.add(new Paragraph("KEY POINTS").setBold());
        document.add(new Paragraph(meeting.getKeyPoints()));
        document.add(new Paragraph(" "));
        
        // Decisions
        document.add(new Paragraph("DECISIONS MADE").setBold());
        document.add(new Paragraph(meeting.getDecisions()));
        document.add(new Paragraph(" "));
        
        // Action Items
        document.add(new Paragraph("ACTION ITEMS").setBold());
        document.add(new Paragraph(meeting.getActionItems()));
        document.add(new Paragraph(" "));
        
        // Speaker Notes
        document.add(new Paragraph("SPEAKER BREAKDOWN").setBold());
        document.add(new Paragraph(meeting.getSpeakerNotes()));
        
        document.close();
        pdfDoc.close();
        
        return pdfPath;
    }
    
    public String exportToDOCX(Meeting meeting, String filePath) throws Exception {
        String docxPath = EXPORT_DIR + filePath + ".docx";
        
        XWPFDocument document = new XWPFDocument();
        
        // Title
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setText("MEETING MINUTES");
        titleRun.setBold(true);
        titleRun.setFontSize(20);
        
        document.createParagraph();
        
        // Meeting details
        addParagraph(document, "Meeting Title: " + meeting.getTitle());
        addParagraph(document, "Date: " + meeting.getDate());
        addParagraph(document, "Duration: " + meeting.getDuration());
        addParagraph(document, "Attendees: " + meeting.getAttendeeList());
        
        document.createParagraph();
        
        // Summary
        addHeading(document, "EXECUTIVE SUMMARY", 14);
        addParagraph(document, meeting.getSummary());
        
        // Key Points
        addHeading(document, "KEY POINTS", 14);
        addParagraph(document, meeting.getKeyPoints());
        
        // Decisions
        addHeading(document, "DECISIONS MADE", 14);
        addParagraph(document, meeting.getDecisions());
        
        // Action Items
        addHeading(document, "ACTION ITEMS", 14);
        addParagraph(document, meeting.getActionItems());
        
        // Save
        try (FileOutputStream out = new FileOutputStream(docxPath)) {
            document.write(out);
        }
        document.close();
        
        return docxPath;
    }
    
    public String exportToTXT(Meeting meeting, String filePath) throws Exception {
        String txtPath = EXPORT_DIR + filePath + ".txt";
        
        try (PrintWriter writer = new PrintWriter(new FileWriter(txtPath))) {
            writer.println("=".repeat(60));
            writer.println("MEETING MINUTES");
            writer.println("=".repeat(60));
            writer.println();
            writer.println("Meeting Title: " + meeting.getTitle());
            writer.println("Date: " + meeting.getDate());
            writer.println("Duration: " + meeting.getDuration());
            writer.println("Attendees: " + meeting.getAttendeeList());
            writer.println();
            writer.println("EXECUTIVE SUMMARY");
            writer.println("-".repeat(30));
            writer.println(meeting.getSummary());
            writer.println();
            writer.println("KEY POINTS");
            writer.println("-".repeat(30));
            writer.println(meeting.getKeyPoints());
            writer.println();
            writer.println("DECISIONS MADE");
            writer.println("-".repeat(30));
            writer.println(meeting.getDecisions());
            writer.println();
            writer.println("ACTION ITEMS");
            writer.println("-".repeat(30));
            writer.println(meeting.getActionItems());
            writer.println();
            writer.println("=".repeat(60));
            writer.println("Generated by AI Meeting Minutes Generator");
        }
        
        return txtPath;
    }
    
    private void addParagraph(XWPFDocument document, String text) {
        XWPFParagraph para = document.createParagraph();
        XWPFRun run = para.createRun();
        run.setText(text);
    }
    
    private void addHeading(XWPFDocument document, String text, int fontSize) {
        XWPFParagraph para = document.createParagraph();
        XWPFRun run = para.createRun();
        run.setText(text);
        run.setBold(true);
        run.setFontSize(fontSize);
        document.createParagraph();
    }
}