import { useState } from 'react';
import { Target, Calendar, Sparkles, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface GoalsSetupProps {
  knowledgeLevel: string;
  selectedSubjects: string[];
  onComplete: () => void;
  onBack: () => void;
}

const goals = [
  {
    id: 'exam',
    icon: Target,
    title: 'Preparar examen',
    description: 'Enfoque intensivo en temas específicos',
  },
  {
    id: 'daily_review',
    icon: Calendar,
    title: 'Repaso diario',
    description: 'Reforzar conocimientos cada día',
  },
  {
    id: 'general_learning',
    icon: Sparkles,
    title: 'Aprendizaje general',
    description: 'Explorar y aprender sin presión',
  },
];

const timeOptions = [
  { value: 5, label: '5 min/día' },
  { value: 10, label: '10 min/día' },
  { value: 15, label: '15 min/día' },
  { value: 20, label: '20 min/día' },
  { value: 30, label: '30 min/día' },
];

export default function GoalsSetup({
  knowledgeLevel,
  selectedSubjects,
  onComplete,
  onBack,
}: GoalsSetupProps) {
  const { user } = useAuth();
  const [selectedGoal, setSelectedGoal] = useState('general_learning');
  const [dailyMinutes, setDailyMinutes] = useState(15);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from('learning_preferences').insert({
      user_id: user.id,
      knowledge_level: knowledgeLevel,
      study_goal: selectedGoal,
      daily_minutes: dailyMinutes,
      subjects: selectedSubjects,
    });

    if (error) {
      console.error('Error saving preferences:', error);
    } else {
      onComplete();
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 bg-blue-500/20 rounded-full mb-4">
              <span className="text-sm text-blue-400 font-medium">Paso 4 de 4</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Personaliza tu experiencia</h1>
            <p className="text-slate-400">Define tu objetivo y tiempo de estudio</p>
          </div>

          <div className="space-y-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-5 h-5" />
                ¿Cuál es tu objetivo?
              </h3>
              <div className="space-y-3">
                {goals.map((goal) => {
                  const Icon = goal.icon;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setSelectedGoal(goal.id)}
                      className={`w-full p-4 rounded-xl transition-all flex items-center gap-4 ${
                        selectedGoal === goal.id
                          ? 'bg-blue-500 ring-2 ring-blue-400'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`p-2 rounded-lg ${
                          selectedGoal === goal.id ? 'bg-white/20' : 'bg-slate-600'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h4 className="font-semibold text-white">{goal.title}</h4>
                        <p className="text-sm text-slate-300">{goal.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Tiempo de estudio diario
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {timeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setDailyMinutes(option.value)}
                    className={`py-3 px-2 rounded-xl font-medium transition-all ${
                      dailyMinutes === option.value
                        ? 'bg-blue-500 text-white ring-2 ring-blue-400'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
            >
              Atrás
            </button>
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : 'Confirmar y Finalizar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
