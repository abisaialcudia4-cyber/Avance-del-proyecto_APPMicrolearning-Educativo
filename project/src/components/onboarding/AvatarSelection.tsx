import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface AvatarSelectionProps {
  onComplete: () => void;
}

const avatars = [
  { id: 'avatar1', emoji: '🦊', name: 'Zorro' },
  { id: 'avatar2', emoji: '🦁', name: 'León' },
  { id: 'avatar3', emoji: '🐨', name: 'Koala' },
  { id: 'avatar4', emoji: '🐼', name: 'Panda' },
  { id: 'avatar5', emoji: '🐯', name: 'Tigre' },
  { id: 'avatar6', emoji: '🐸', name: 'Rana' },
  { id: 'avatar7', emoji: '🦉', name: 'Búho' },
  { id: 'avatar8', emoji: '🦄', name: 'Unicornio' },
  { id: 'avatar9', emoji: '🐙', name: 'Pulpo' },
];

export default function AvatarSelection({ onComplete }: AvatarSelectionProps) {
  const { user } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!user) return;

    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ avatar: selectedAvatar })
      .eq('id', user.id);

    if (error) {
      console.error('Error updating avatar:', error);
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
              <span className="text-sm text-blue-400 font-medium">Paso 1 de 4</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Elige tu avatar</h1>
            <p className="text-slate-400">
              Selecciona el personaje que te representará
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {avatars.map((avatar) => (
              <button
                key={avatar.id}
                onClick={() => setSelectedAvatar(avatar.id)}
                className={`p-6 rounded-2xl transition-all ${
                  selectedAvatar === avatar.id
                    ? 'bg-blue-500 ring-4 ring-blue-400/50 scale-105'
                    : 'bg-slate-700/50 hover:bg-slate-700'
                }`}
              >
                <div className="text-5xl mb-2">{avatar.emoji}</div>
                <div className="text-sm text-white font-medium">{avatar.name}</div>
              </button>
            ))}
          </div>

          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  );
}
