import { useState } from 'react';
import { Brain, BookOpen, Zap } from 'lucide-react';

interface LearningStyleSetupProps {
  onComplete: (style: string) => void;
  onBack: () => void;
}

const learningStyles = [
  {
    id: 'basic',
    icon: BookOpen,
    title: 'Visual',
    description: 'Estoy comenzando y quiero bases sólidas',
  },
  {
    id: 'intermediate',
    icon: Brain,
    title: 'Auditivo',
    description: 'Tengo conocimientos y busco practicar',
  },
  {
    id: 'advanced',
    icon: Zap,
    title: 'Práctico',
    description: 'Domino el tema y busco un reto mayor',
  },
];

export default function LearningStyleSetup({ onComplete, onBack }: LearningStyleSetupProps) {
  const [selectedStyle, setSelectedStyle] = useState('basic');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-slate-700">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 bg-blue-500/20 rounded-full mb-4">
              <span className="text-sm text-blue-400 font-medium">Paso 2 de 4</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">¿Cómo prefieres aprender?</h1>
            <p className="text-slate-400">
              Esto nos ayudará a personalizar tu experiencia
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {learningStyles.map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={`w-full p-6 rounded-2xl transition-all flex items-start gap-4 ${
                    selectedStyle === style.id
                      ? 'bg-blue-500 ring-4 ring-blue-400/50'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <div className={`p-3 rounded-xl ${
                    selectedStyle === style.id ? 'bg-white/20' : 'bg-slate-600'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-white mb-1">{style.title}</h3>
                    <p className="text-sm text-slate-300">{style.description}</p>
                  </div>
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
              onClick={() => onComplete(selectedStyle)}
              className="flex-1 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
