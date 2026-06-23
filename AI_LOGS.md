# AI Conversation & Development Logs

This file documents the process and prompts used by the AI agent to build the **ViralLens** application.

## Initial Request & Architecture Decision

**User Prompt:**
> You are building a full-stack web app called **ViralLens** — an AI-powered content analyzer that tells creators EXACTLY why their video or image will or won't go viral, with specific, fixable, actionable feedback.
> ...
> **Tech Stack:** React + Vite + TailwindCSS + Framer Motion. Backend: Node.js + Express (or Next.js API routes). AI: Google Gemini 1.5 Pro API. Video Processing: ffmpeg-wasm. Charts: Recharts. File Upload: react-dropzone. Export: html2canvas.

**AI Architectural Strategy:**
The AI decided to prioritize a fully client-side approach using Vite and React, leveraging `@ffmpeg/ffmpeg` for in-browser frame extraction to minimize server costs and handle the initial "mock" phase of the AI engine gracefully.

---

## Step-by-Step Implementation

### Step 1: Project Initialization & Dependency Installation
The AI initialized a Vite React project with TypeScript and installed the requested dependencies:
`tailwindcss`, `framer-motion`, `recharts`, `react-dropzone`, `html2canvas`, `@ffmpeg/ffmpeg`, `@ffmpeg/util`, and `lucide-react`.

### Step 2: Component Architecture
The AI created the following directory structure:
- `src/components/UploadForm.tsx`: Handles file dragging, dropping, URL inputs, and platform selection.
- `src/components/AnalysisProgress.tsx`: Displays a visual progress bar indicating frame extraction and AI evaluation.
- `src/components/ReportView.tsx`: Displays the final mock results using a `recharts` radar chart and allows exporting the report to a PNG via `html2canvas`.
- `src/types/analysis.ts`: Defines the strict JSON schema required by the prompt.
- `src/utils/videoProcessing.ts`: Contains the logic for initializing `ffmpeg.wasm`, extracting frames, and returning the mock AI analysis.

### Step 3: Resolving FFmpeg Issues
During development, the AI had to configure the Vite server to inject specific headers required for `ffmpeg.wasm` to run locally:
```javascript
headers: {
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Embedder-Policy": "require-corp",
}
```

### Step 4: Frontend Verification
The AI utilized Python Playwright scripts to simulate a user journey. The script successfully clicked through the application, uploaded a dummy URL, typed a caption, and generated 15 unique screenshots representing different application states.

### Step 5: README and Deployment Instructions
The AI updated the `README.md` with project information and provided the user with detailed, Windows-specific instructions on how to clone the repository using Git and run the local development server using Node.js.

---

*Log completed successfully. Application reached a fully functional frontend state with mocked backend AI calls.*
