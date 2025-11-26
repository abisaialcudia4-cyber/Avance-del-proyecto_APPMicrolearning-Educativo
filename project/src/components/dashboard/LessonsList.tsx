import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Lesson, Subject, LearningPreferences } from '../../lib/supabase';
import { Calculator, FlaskConical, Landmark, Languages, Cpu, Palette, Play, CheckCircle } from 'lucide-react';

interface LessonsListProps {
  onStartLesson: (lessonId: string) => void;
}

const iconMap: Record<string, typeof Calculator> = {
  calculator: Calculator,
  'flask-conical': FlaskConical,
  landmark: Landmark,
  languages: Languages,
  cpu: Cpu,
  palette: Palette,
};

interface LessonWithSubject extends Lesson {
  subject: Subject;
  completed: boolean;
}

export default function LessonsList({ onStartLesson }: LessonsListProps) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<LessonWithSubject[]>([]);
  const [preferences, setPreferences] = useState<LearningPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadLessons();
    }
  }, [user]);

  async function loadLessons() {
    if (!user) return;

    const [prefsResult, lessonsResult, progressResult] = await Promise.all([
      supabase.from('learning_preferences').select('*').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('lessons')
        .select('*, subjects(*)')
        .order('order_index')
        .limit(10),
      supabase.from('user_progress').select('lesson_id, completed').eq('user_id', user.id),
    ]);

    if (prefsResult.data) {
      setPreferences(prefsResult.data);
    }

    if (lessonsResult.data) {
      const completedLessons = new Set(
        progressResult.data?.filter((p) => p.completed).map((p) => p.lesson_id) || []
      );

      const lessonsWithCompletion = lessonsResult.data.map((lesson) => ({
        ...lesson,
        subject: lesson.subjects,
        completed: completedLessons.has(lesson.id),
      }));

      const filteredLessons = prefsResult.data?.subjects?.length
        ? lessonsWithCompletion.filter((l) =>
            prefsResult.data?.subjects.includes(l.subject_id)
          )
        : lessonsWithCompletion;

      setLessons(filteredLessons);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-6">Lecciones Recomendadas</h2>

      <div className="space-y-4">
        {lessons.map((lesson) => {
          const Icon = iconMap[lesson.subject?.icon] || Calculator;
          return (
            <div
              key={lesson.id}
              className="bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${lesson.subject?.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: lesson.subject?.color }} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-white">{lesson.title}</h3>
                      {lesson.completed && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mb-2 line-clamp-1">
                      {lesson.content}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>{lesson.subject?.name}</span>
                      <span>•</span>
                      <span>{lesson.duration_minutes} min</span>
                      <span>•</span>
                      <span className="capitalize">{lesson.difficulty_level}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onStartLesson(lesson.id)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-xl flex items-center gap-2 transition-colors group-hover:scale-105"
                >
                  <Play className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">
                    {lesson.completed ? 'Repasar' : 'Empezar'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
