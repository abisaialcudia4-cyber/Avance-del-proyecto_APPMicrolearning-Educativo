import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  full_name: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

export interface LearningPreferences {
  id: string;
  user_id: string;
  knowledge_level: 'basic' | 'intermediate' | 'advanced';
  study_goal: 'exam' | 'daily_review' | 'general_learning';
  daily_minutes: number;
  subjects: string[];
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Lesson {
  id: string;
  subject_id: string;
  title: string;
  content: string;
  duration_minutes: number;
  difficulty_level: string;
  video_url?: string;
  order_index: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  lesson_id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  score: number;
  time_spent_minutes: number;
  completed_at?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  created_at: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'daily' | 'weekly';
  requirement: Record<string, unknown>;
  points: number;
  active_from: string;
  active_until: string;
  created_at: string;
}

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_id: string;
  completed: boolean;
  progress: number;
  completed_at?: string;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  total_lessons_completed: number;
  current_streak_days: number;
  longest_streak_days: number;
  total_points: number;
  total_time_minutes: number;
  level: number;
  last_activity_date?: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark';
  notifications_enabled: boolean;
  daily_reminder_time: string;
  study_reminders: boolean;
  created_at: string;
  updated_at: string;
}
