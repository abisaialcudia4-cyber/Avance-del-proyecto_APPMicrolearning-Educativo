import { useState, useEffect } from 'react';
import { supabase, Subject } from '../../lib/supabase';
import { Calculator, FlaskConical, Landmark, Languages, Cpu, Palette } from 'lucide-react';

interface SubjectSelectionProps {
  onComplete: (subjects: string[]) => void;
  onBack: () => void;
}

const iconMap: Record<string, typeof Calculator> = {
  calculator: Calculator,
  'flask-conical': FlaskConical,
  landmark: Landmark,
  languages: Languages,
  cpu: Cpu,
  palette: Palette,
};

export default function SubjectSelection({ onComplete, onBack }: SubjectSelectionProps) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubjects();
  }, []);

  async function loadSubjects() {
    const { data } = await supabase.from('subjects').select('*').order('name');
    if (data) {
      setSubjects(data);
    }
    setLoading(false);
  }

  function toggleSubject(subjectId: string) {
    if (selectedSubjects.includes(subjectId)) {
      setSelectedSubjects(selectedSubjects.filter((id) => id !== subjectId));
    } else {
      setSelectedSubjects([...selectedSubjects, subjectId]);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 bg-blue-500/20 rounded-full mb-4">
              <span className="text-sm text-blue-400 font-medium">Paso 3 de 4</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Elige tus temas preferidos</h1>
            <p className="text-slate-400">Selecciona al menos uno para continuar</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {subjects.map((subject) => {
                  const Icon = iconMap[subject.icon] || Calculator;
                  const isSelected = selectedSubjects.includes(subject.id);
                  return (
                    <button
                      key={subject.id}
                      onClick={() => toggleSubject(subject.id)}
                      className={`p-6 rounded-2xl transition-all ${
                        isSelected
                          ? 'bg-blue-500 ring-4 ring-blue-400/50 scale-105'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                          isSelected ? 'bg-white/20' : 'bg-slate-600'
                        }`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{subject.name}</h3>
                      <p className="text-xs text-slate-300">{subject.description}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={onBack}
                  className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={() => onComplete(selectedSubjects)}
                  disabled={selectedSubjects.length === 0}
                  className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
