import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { AnalysisResult } from '../types/analysis';

let ffmpeg: FFmpeg | null = null;

const loadFFmpeg = async (onProgress: (progress: number, status: string) => void) => {
  if (ffmpeg) return ffmpeg;

  onProgress(5, "Loading media processor...");
  ffmpeg = new FFmpeg();

  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';

  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  return ffmpeg;
};

// Simulate API delay for steps
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const dummyAIResponse = (): AnalysisResult => ({
  overall_score: 74,
  score_label: "Strong Potential",
  score_description: "Good pacing and strong hook, but the caption lacks a clear CTA and visual quality drops mid-video.",
  sub_scores: {
    hook: {
      score: 82,
      label: "Strong",
      findings: ["Face detected in first frame", "Good motion in first 1.5s"],
      fixes: ["Start audio slightly earlier to avoid initial silence"]
    },
    pacing: {
      score: 60,
      label: "Needs Work",
      findings: ["Estimated 6 cuts/min, slower than TikTok average"],
      fixes: ["Add a cut or zoom around the 4-second mark to retain attention"]
    },
    visual: {
      score: 78,
      label: "Good",
      findings: ["9:16 aspect ratio optimal", "Good lighting in hook"],
      fixes: ["Text contrast is low at 0:15 - add a dark stroke or background"]
    },
    caption: {
      score: 45,
      label: "Weak",
      findings: ["Too many generic hashtags", "No clear call-to-action"],
      fixes: ["Use 3-5 niche tags", "Add 'Save this for later'"]
    },
    audio: {
      score: 90,
      label: "Excellent",
      findings: ["No awkward silences", "Clear voice normalization"],
      fixes: ["Consider layering trending background audio at 10% volume"]
    },
    emotion: {
      score: 70,
      label: "Good",
      findings: ["High relatability detected"],
      fixes: ["Amplify the facial expression at the punchline"]
    },
    trend: {
      score: 55,
      label: "Average",
      findings: ["Topic is somewhat saturated"],
      fixes: ["Add a unique personal angle to stand out"]
    }
  },
  hook_type: "Curiosity Gap",
  emotional_category: "Relatable",
  platform_fit: "High",
  top_3_issues: [
    "Slow pacing mid-video",
    "Weak caption structure",
    "Slight audio delay at start"
  ],
  top_3_strengths: [
    "Excellent hook visuals",
    "Strong emotional relatability",
    "Perfect audio clarity"
  ],
  rewritten_caption: "Ever wondered why your retention drops at 3 seconds? 📉 Here's the fix.\n\nSave this for your next edit! 🎬\n#videoediting #contentcreator #hookstrategy",
  hook_alternatives: [
    "Stop scrolling if your videos are stuck at 200 views.",
    "The 3-second mistake killing your reach."
  ],
  best_thumbnail_frame_index: 3,
  thumbnail_notes: "Frame 3 has the highest brightness contrast and a clear, expressive facial expression.",
  estimated_watch_time_tier: "Medium",
  suppression_risk: "Low",
  content_category: "Education",
  competitor_content_angle: "Top performers use faster pacing and text hooks directly on screen in the first 2 seconds."
});

export const analyzeContent = async (
  file: File | null,
  url: string,
  _caption: string,
  platform: string,
  onProgress: (progress: number, status: string) => void
): Promise<AnalysisResult> => {

  if (file && file.type.startsWith('video')) {
    onProgress(10, "Initializing video processor...");
    const ff = await loadFFmpeg(onProgress);

    onProgress(20, "Extracting hook frames...");
    await ff.writeFile('input.mp4', await fetchFile(file));

    // Extract frames at 0s, 0.5s, 1s, 1.5s, 2s, 2.5s, 3s
    const times = [0, 0.5, 1, 1.5, 2, 2.5, 3];
    const frames: Uint8Array[] = [];

    for (let i = 0; i < times.length; i++) {
      onProgress(20 + Math.floor((i / times.length) * 20), `Extracting frame ${i+1}/${times.length}...`);
      const outName = `frame_${i}.jpg`;
      await ff.exec(['-ss', times[i].toString(), '-i', 'input.mp4', '-frames:v', '1', '-q:v', '2', outName]);
      const data = await ff.readFile(outName);
      frames.push(data as Uint8Array);
    }

    onProgress(45, "Extracting audio metadata...");
    await ff.exec(['-i', 'input.mp4', '-vn', '-acodec', 'copy', 'audio.aac']);
    // Fake extracting metadata from the written audio file
    await delay(1000);

    onProgress(60, "Uploading data to Vision API...");
    // Simulate API call overhead
    await delay(1500);

  } else if (file && file.type.startsWith('image')) {
    onProgress(30, "Analyzing image...");
    await delay(1000);
  } else if (url) {
    onProgress(30, `Fetching metadata for ${platform} URL...`);
    await delay(1500);
  }

  onProgress(75, "Evaluating AI suppression triggers...");
  await delay(1500);

  onProgress(90, "Compiling final suppression risk report...");
  await delay(1000);

  onProgress(100, "Done!");

  return dummyAIResponse();
};
