/*
  # Microlearning Platform Database Schema

  ## Overview
  Complete database schema for an educational microlearning platform with personalized learning paths, 
  progress tracking, achievements, and gamification features.

  ## New Tables

  ### 1. profiles
  Extended user profile information
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text)
  - `avatar` (text) - Avatar identifier
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. learning_preferences
  User learning configuration and personalization
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `knowledge_level` (text) - basic, intermediate, advanced
  - `study_goal` (text) - exam, daily_review, general_learning
  - `daily_minutes` (integer) - Daily study time goal
  - `subjects` (jsonb) - Array of selected subjects/topics
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. subjects
  Available subjects and topics
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `icon` (text)
  - `color` (text)
  - `created_at` (timestamptz)

  ### 4. lessons
  Microlearning lesson content
  - `id` (uuid, primary key)
  - `subject_id` (uuid, references subjects)
  - `title` (text)
  - `content` (text)
  - `duration_minutes` (integer) - 1-3 minutes
  - `difficulty_level` (text)
  - `video_url` (text, optional)
  - `order_index` (integer)
  - `created_at` (timestamptz)

  ### 5. quiz_questions
  Questions for mini-quizzes
  - `id` (uuid, primary key)
  - `lesson_id` (uuid, references lessons)
  - `question_text` (text)
  - `options` (jsonb) - Array of answer options
  - `correct_answer` (integer) - Index of correct option
  - `explanation` (text)
  - `created_at` (timestamptz)

  ### 6. user_progress
  Track user progress through lessons
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `lesson_id` (uuid, references lessons)
  - `completed` (boolean)
  - `score` (integer) - Quiz score percentage
  - `time_spent_minutes` (integer)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 7. achievements
  Available achievements and badges
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `icon` (text)
  - `requirement_type` (text) - streak, lessons_completed, score, etc.
  - `requirement_value` (integer)
  - `created_at` (timestamptz)

  ### 8. user_achievements
  Track unlocked achievements per user
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `achievement_id` (uuid, references achievements)
  - `unlocked_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 9. daily_challenges
  Daily and weekly challenges
  - `id` (uuid, primary key)
  - `title` (text)
  - `description` (text)
  - `challenge_type` (text) - daily, weekly
  - `requirement` (jsonb)
  - `points` (integer)
  - `active_from` (date)
  - `active_until` (date)
  - `created_at` (timestamptz)

  ### 10. user_challenges
  Track user challenge completion
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `challenge_id` (uuid, references daily_challenges)
  - `completed` (boolean)
  - `progress` (integer)
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ### 11. user_stats
  Aggregated user statistics
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `total_lessons_completed` (integer)
  - `current_streak_days` (integer)
  - `longest_streak_days` (integer)
  - `total_points` (integer)
  - `total_time_minutes` (integer)
  - `level` (integer)
  - `last_activity_date` (date)
  - `updated_at` (timestamptz)

  ### 12. settings
  User app settings and preferences
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `theme` (text) - light, dark
  - `notifications_enabled` (boolean)
  - `daily_reminder_time` (time)
  - `study_reminders` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Public read access for subjects, lessons, achievements, and challenges
  - Authenticated users can read quiz questions only for lessons they access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  avatar text NOT NULL DEFAULT 'avatar1',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create learning_preferences table
CREATE TABLE IF NOT EXISTS learning_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  knowledge_level text NOT NULL DEFAULT 'basic',
  study_goal text NOT NULL DEFAULT 'general_learning',
  daily_minutes integer NOT NULL DEFAULT 15,
  subjects jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE learning_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own learning preferences"
  ON learning_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own learning preferences"
  ON learning_preferences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own learning preferences"
  ON learning_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'book',
  color text NOT NULL DEFAULT '#3b82f6',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view subjects"
  ON subjects FOR SELECT
  TO authenticated
  USING (true);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 2,
  difficulty_level text NOT NULL DEFAULT 'basic',
  video_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- Create quiz_questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer integer NOT NULL,
  explanation text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions"
  ON quiz_questions FOR SELECT
  TO authenticated
  USING (true);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer DEFAULT 0,
  time_spent_minutes integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL DEFAULT 'trophy',
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id uuid NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  challenge_type text NOT NULL DEFAULT 'daily',
  requirement jsonb NOT NULL DEFAULT '{}'::jsonb,
  points integer NOT NULL DEFAULT 10,
  active_from date NOT NULL,
  active_until date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active challenges"
  ON daily_challenges FOR SELECT
  TO authenticated
  USING (true);

-- Create user_challenges table
CREATE TABLE IF NOT EXISTS user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES daily_challenges(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  progress integer DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, challenge_id)
);

ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own challenges"
  ON user_challenges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own challenges"
  ON user_challenges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own challenges"
  ON user_challenges FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  total_lessons_completed integer DEFAULT 0,
  current_streak_days integer DEFAULT 0,
  longest_streak_days integer DEFAULT 0,
  total_points integer DEFAULT 0,
  total_time_minutes integer DEFAULT 0,
  level integer DEFAULT 1,
  last_activity_date date,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create settings table
CREATE TABLE IF NOT EXISTS settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  theme text NOT NULL DEFAULT 'dark',
  notifications_enabled boolean DEFAULT true,
  daily_reminder_time time DEFAULT '09:00:00',
  study_reminders boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);