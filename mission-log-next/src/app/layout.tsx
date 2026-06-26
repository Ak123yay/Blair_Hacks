import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MissionLog — AI Meeting Notes for Tech Teams",
  description:
    "Turn messy meeting transcripts into organized documentation for robotics, hackathons, startups, research labs, freelance work, and enterprise teams. AI-powered engineering notebooks, task tracking, and stakeholder summaries.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="paper-bg" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1, padding: "40px 24px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>
            {children}
          </main>
          <footer style={{ borderTop: "1px solid var(--rule-2)", padding: "24px", textAlign: "center", fontSize: 11.5, color: "var(--ink-4)", fontFamily: "var(--mono)" }}>
            MissionLog — AI Engineering Notebook for Robotics & Hackathon Teams
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}