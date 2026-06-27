"use client";

import { useState, useRef } from "react";
import { Ic } from "@/components/icons/Ic";

interface AudioUploaderProps {
  onTranscriptReady: (transcript: string, fileName: string) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

export default function AudioUploader({ onTranscriptReady, onError, disabled }: AudioUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    const validTypes = [
      "audio/mp4",
      "audio/mpeg", 
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "video/mp4",
      "video/webm",
    ];

    if (!validTypes.includes(file.type)) {
      onError?.("Invalid file type. Please upload MP3, WAV, MP4, WebM, or OGG.");
      return;
    }

    const maxSize = 25 * 1024 * 1024; // 25MB
    if (file.size > maxSize) {
      onError?.("File size exceeds 25MB limit.");
      return;
    }

    setSelectedFile(file);
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("audio", file);

      // Simulate progress (since we can't track actual upload progress easily)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 85));
      }, 300);

      console.log("Uploading file for transcription:", file.name);
      
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(95);

      console.log("Transcription response status:", response.status);

      if (!response.ok) {
        let errorMessage = "Transcription failed";
        try {
          const data = await response.json();
          console.error("Transcription error details:", data);
          errorMessage = data.error || `Server error: ${response.status}`;
        } catch {
          const text = await response.text();
          console.error("Transcription error (non-JSON):", text);
          errorMessage = text || `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Transcription result:", result);
      
      // Add a small delay to show completion
      await new Promise((resolve) => setTimeout(resolve, 300));
      setUploadProgress(100);
      
      onTranscriptReady(result.transcript, file.name);
      setSelectedFile(null);
    } catch (error: unknown) {
      console.error("Upload error:", error);
      const message = error instanceof Error ? error.message : "Failed to transcribe audio";
      onError?.(message);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (disabled || isUploading) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div>
      <div
        className={`card ${isUploading ? "shimmer" : ""}`}
        style={{
          padding: 32,
          textAlign: "center",
          cursor: disabled || isUploading ? "not-allowed" : "pointer",
          opacity: disabled || isUploading ? 0.6 : 1,
          border: selectedFile ? "2px solid var(--accent)" : "1px solid var(--rule)",
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*,video/*"
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          style={{ display: "none" }}
        />

        {isUploading ? (
          <div style={{ padding: "40px 20px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Ic name="refresh" size={28} color="var(--accent-ink)" className="animate-spin" />
            </div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: "0 0 8px" }}>
              Transcribing audio...
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "0 0 20px" }}>
              This may take a minute depending on file length
            </p>
            <div className="agent-progress-bar" style={{ maxWidth: 300, margin: "0 auto", height: 3 }}>
              <div 
                className="agent-progress-bar-fill" 
                style={{ width: `${uploadProgress}%` }} 
              />
            </div>
            <div className="mono" style={{ marginTop: 12, fontSize: 10 }}>
              {uploadProgress < 30 && "Uploading..."}
              {uploadProgress >= 30 && uploadProgress < 70 && "Processing audio..."}
              {uploadProgress >= 70 && "Generating transcript..."}
            </div>
          </div>
        ) : selectedFile ? (
          <div style={{ padding: "40px 20px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Ic name="check" size={28} color="var(--leaf)" />
            </div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: "0 0 8px" }}>
              Ready to use
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-3)", margin: 0 }}>
              {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        ) : (
          <div style={{ padding: "40px 20px" }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--accent-soft)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <Ic name="upload" size={28} color="var(--accent-ink)" />
            </div>
            <h3 className="serif" style={{ fontSize: 20, fontWeight: 500, margin: "0 0 8px" }}>
              Drop audio/video file here
            </h3>
            <p style={{ fontSize: 13, color: "var(--ink-3)", margin: "0 0 16px" }}>
              or click to browse
            </p>
            <div className="mono" style={{ fontSize: 10, color: "var(--ink-4)" }}>
              MP3, WAV, MP4, WebM, OGG - max 25MB
            </div>
          </div>
        )}
      </div>

      {!isUploading && !selectedFile && (
        <div style={{ marginTop: 16, fontSize: 12, color: "var(--ink-4)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <Ic name="info" size={12} className="inline" />
          <span>AI will transcribe your recording and extract the meeting content</span>
        </div>
      )}
    </div>
  );
}
