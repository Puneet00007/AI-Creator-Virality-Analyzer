export interface SubScore {
  score: number;
  label: string;
  findings: string[];
  fixes: string[];
}

export interface AnalysisResult {
  overall_score: number;
  score_label: string;
  score_description: string;
  sub_scores: {
    hook: SubScore;
    pacing: SubScore;
    visual: SubScore;
    caption: SubScore;
    audio: SubScore;
    emotion: SubScore;
    trend: SubScore;
  };
  hook_type: string;
  emotional_category: string;
  platform_fit: string;
  top_3_issues: string[];
  top_3_strengths: string[];
  rewritten_caption: string;
  hook_alternatives: string[];
  best_thumbnail_frame_index: number;
  thumbnail_notes: string;
  estimated_watch_time_tier: string;
  suppression_risk: string;
  content_category: string;
  competitor_content_angle: string;
}
