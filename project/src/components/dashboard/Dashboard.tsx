import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, UserStats, DailyChallenge } from '../../lib/supabase';
import { Flame, Trophy, Clock, BookOpen, Target, Settings, LogOut } from 'lucide-react';
import LessonsList from './LessonsList';
import SettingsModal from './SettingsModal';

interface DashboardProps {
  onStartLesson: (lessonId: string) => void;
}

const motivationalPhrases = [
  '¡Cada pequeño paso cuenta!',
  '¡Sigue así, vas genial!',
  '¡El conocimiento es poder!',
  '¡Hoy es un gran día para aprender!',
  '¡Tu esfuerzo vale la pena!',
  '¡Nunca dejes de crecer!',
];

export default function Dashboard({ onStartLesson }: DashboardProps) {
  const { user, profile, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [motivationalPhrase] = useState(
    motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]
  );

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  async function loadDashboardData() {
    if (!user) return;

    const [statsResult, challengesResult] = await Promise.all([
      supabase.from('user_stats').select('*').eq('user_id', user.id).maybeSingle(),
      supabase
        .from('daily_challenges')
        .select('*')
        .eq('challenge_type', 'daily')
        .gte('active_until', new Date().toISOString())
        .limit(3),
    ]);

    if (statsResult.data) {
      setStats(statsResult.data);
    }

    if (challengesResult.data) {
      setChallenges(challengesResult.data);
    }

    setLoading(false);
  }

  const getAvatarEmoji = (avatarId: string) => {
    const avatars: Record<string, string> = {
      avatar1: '🦊',
      avatar2: '🦁',
      avatar3: '🐨',
      avatar4: '🐼',
      avatar5: '🐯',
      avatar6: '🐸',
      avatar7: '🦉',
      avatar8: '🦄',
      avatar9: '🐙',
    };
    return avatars[avatarId] || '🦊';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
              {profile && getAvatarEmoji(profile.avatar)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                ¡Hola, {profile?.full_name || 'Estudiante'}!
              </h1>
              <p className="text-slate-400">{motivationalPhrase}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Settings className="w-5 h-5 text-slate-300" />
            </button>
            <button
              onClick={signOut}
              className="p-3 bg-slate-800/50 hover:bg-slate-700 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5 text-slate-300" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-slate-400 text-sm">Racha</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.current_streak_days || 0}</p>
            <p className="text-xs text-slate-400 mt-1">días consecutivos</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-slate-400 text-sm">Lecciones</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {stats?.total_lessons_completed || 0}
            </p>
            <p className="text-xs text-slate-400 mt-1">completadas</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Trophy className="w-5 h-5 text-yellow-400" />
              </div>
              <span className="text-slate-400 text-sm">Puntos</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.total_points || 0}</p>
            <p className="text-xs text-slate-400 mt-1">acumulados</p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-slate-400 text-sm">Tiempo</span>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.total_time_minutes || 0}</p>
            <p className="text-xs text-slate-400 mt-1">minutos totales</p>
          </div>
        </div>

        {challenges.length > 0 && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 mb-8">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              Retos de Hoy
            </h2>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl"
                >
                  <div>
                    <h3 className="font-semibold text-white">{challenge.title}</h3>
                    <p className="text-sm text-slate-400">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">+{challenge.points}</span>
                    <Trophy className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <LessonsList onStartLesson={onStartLesson} />
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
