# 👁️ ViralLens

**ViralLens** is an AI-powered content analyzer that tells creators EXACTLY why their video or image will or won't go viral. It provides specific, fixable, and actionable feedback instead of vague scores. Every number has a "WHY" and a "FIX."

## ✨ Features

- **Honest Virality Scoring:** A 0–100 score framed around "Suppression Risk" — a checklist of what kills videos algorithmically.
- **Client-Side Video Processing:** Extracts frames using `ffmpeg.wasm` directly in the browser, keeping user content secure and avoiding expensive server bandwidth.
- **Detailed Sub-scores:**
  - 🎣 Hook Strength (30%)
  - ⏱️ Pacing (15%)
  - 🖼️ Visual Quality (15%)
  - ✍️ Caption & Hashtag (15%)
  - 🎵 Audio/Music (10%)
  - 🎭 Emotional Trigger (10%)
  - 📈 Trend Alignment (5%)
- **Rich Visuals:** Beautiful radar charts using `recharts`.
- **Exportable Reports:** Export the AI analysis as a PNG using `html2canvas`.
- **Multi-Platform Support:** Tailored advice for TikTok, Instagram Reels, YouTube Shorts, LinkedIn, and Twitter/X.

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Video Processing:** `@ffmpeg/ffmpeg` (WebAssembly)
- **Data Visualization:** `recharts`
- **Exporting:** `html2canvas`
- **Icons:** `lucide-react`

## 🚀 Running Locally

1. **Install Dependencies**
   `npm install`

2. **Start the Development Server**
   `npm run build` then `npm run preview`

3. **Build for Production**
   `npm run build`

## 🧠 Architecture Overview

All video analysis runs primarily client-side:
1. User uploads a video.
2. `ffmpeg.wasm` extracts frames (e.g., at 0s, 0.5s, 1s, etc.) and audio metadata.
3. The extracted data is sent to the backend/AI service (simulated in this implementation).
4. The AI returns a structured JSON analysis.
5. The frontend renders the full, interactive report card.

## 📝 License
MIT License
