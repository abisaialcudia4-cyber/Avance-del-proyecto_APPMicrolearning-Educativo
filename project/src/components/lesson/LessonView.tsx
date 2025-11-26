import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Lesson, Subject, QuizQuestion } from '../../lib/supabase';
import { ArrowLeft, CheckCircle, X } from 'lucide-react';
import Quiz from './Quiz';

interface LessonViewProps {
  lessonId: string;
  onComplete: () => void;
  onBack: () => void;
}

interface LessonWithSubject extends Lesson {
  subjects: Subject;
}

export default function LessonView({ lessonId, onComplete, onBack }: LessonViewProps) {
  const { user } = useAuth();
  const [lesson, setLesson] = useState<LessonWithSubject | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  async function loadLesson() {
    const [lessonResult, questionsResult] = await Promise.all([
      supabase.from('lessons').select('*, subjects(*)').eq('id', lessonId).single(),
      supabase.from('quiz_questions').select('*').eq('lesson_id', lessonId),
    ]);

    if (lessonResult.data) {
      setLesson(lessonResult.data);
    }

    if (questionsResult.data) {
      setQuizQuestions(questionsResult.data);
    }

    setLoading(false);
  }

  async function handleQuizComplete(score: number) {
    if (!user) return;

    const { data: existingProgress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lessonId)
      .maybeSingle();

    const progressData = {
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      score,
      time_spent_minutes: lesson?.duration_minutes || 0,
      completed_at: new Date().toISOString(),
    };

    if (existingProgress) {
      await supabase
        .from('user_progress')
        .update(progressData)
        .eq('id', existingProgress.id);
    } else {
      await supabase.from('user_progress').insert(progressData);
    }

    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (stats) {
      const points = Math.round((score / 100) * 20);
      const today = new Date().toISOString().split('T')[0];
      const lastActivityDate = stats.last_activity_date;

      let newStreak = stats.current_streak_days;
      if (lastActivityDate) {
        const lastDate = new Date(lastActivityDate);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      await supabase
        .from('user_stats')
        .update({
          total_lessons_completed: stats.total_lessons_completed + 1,
          current_streak_days: newStreak,
          longest_streak_days: Math.max(stats.longest_streak_days, newStreak),
          total_points: stats.total_points + points,
          total_time_minutes: stats.total_time_minutes + (lesson?.duration_minutes || 0),
          last_activity_date: today,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
    }

    onComplete();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Lección no encontrada</h2>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (showQuiz) {
    return (
      <Quiz
        questions={quizQuestions}
        lessonTitle={lesson.title}
        onComplete={handleQuizComplete}
        onBack={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Volver</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700">
          <div className="mb-6">
            <div className="inline-block px-4 py-1 rounded-full mb-4"
              style={{ backgroundColor: `${lesson.subjects.color}20` }}>
              <span className="text-sm font-medium" style={{ color: lesson.subjects.color }}>
                {lesson.subjects.name}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{lesson.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>{lesson.duration_minutes} minutos</span>
              <span>•</span>
              <span className="capitalize">{lesson.difficulty_level}</span>
            </div>
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <div className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>

          {lesson.video_url && (
            <div className="mb-8 rounded-xl overflow-hidden">
              <div className="aspect-video bg-slate-900 flex items-center justify-center">
                <span className="text-slate-500">Video placeholder</span>
              </div>
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-2">¿Listo para el mini-quiz?</h3>
            <p className="text-slate-400 mb-4">
              Pon a prueba lo que aprendiste con {quizQuestions.length} preguntas rápidas
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuiz(true)}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Comenzar Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
