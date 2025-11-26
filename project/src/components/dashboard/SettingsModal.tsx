import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, Settings } from '../../lib/supabase';
import { X, Sun, Moon, Bell, Clock, User } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

const avatars = [
  { id: 'avatar1', emoji: '🦊' },
  { id: 'avatar2', emoji: '🦁' },
  { id: 'avatar3', emoji: '🐨' },
  { id: 'avatar4', emoji: '🐼' },
  { id: 'avatar5', emoji: '🐯' },
  { id: 'avatar6', emoji: '🐸' },
  { id: 'avatar7', emoji: '🦉' },
  { id: 'avatar8', emoji: '🦄' },
  { id: 'avatar9', emoji: '🐙' },
];

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, profile } = useAuth();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(profile?.avatar || 'avatar1');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  async function loadSettings() {
    if (!user) return;

    const { data } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setSettings(data);
    }

    setLoading(false);
  }

  async function handleSave() {
    if (!user || !settings) return;

    setSaving(true);

    await Promise.all([
      supabase.from('profiles').update({ avatar: selectedAvatar }).eq('id', user.id),
      supabase.from('settings').update(settings).eq('user_id', user.id),
    ]);

    setSaving(false);
    onClose();
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-slate-800 rounded-2xl p-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Configuración</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-slate-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Avatar
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-4 rounded-xl transition-all ${
                    selectedAvatar === avatar.id
                      ? 'bg-blue-500 ring-4 ring-blue-400/50 scale-110'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <div className="text-3xl">{avatar.emoji}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sun className="w-5 h-5" />
              Apariencia
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSettings({ ...settings!, theme: 'dark' })}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  settings?.theme === 'dark'
                    ? 'bg-blue-500 ring-2 ring-blue-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Moon className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Oscuro</span>
              </button>
              <button
                onClick={() => setSettings({ ...settings!, theme: 'light' })}
                className={`p-4 rounded-xl flex items-center gap-3 ${
                  settings?.theme === 'light'
                    ? 'bg-blue-500 ring-2 ring-blue-400'
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <Sun className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Claro</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <span className="text-white">Notificaciones activas</span>
                <input
                  type="checkbox"
                  checked={settings?.notifications_enabled}
                  onChange={(e) =>
                    setSettings({ ...settings!, notifications_enabled: e.target.checked })
                  }
                  className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                <span className="text-white">Recordatorios de estudio</span>
                <input
                  type="checkbox"
                  checked={settings?.study_reminders}
                  onChange={(e) =>
                    setSettings({ ...settings!, study_reminders: e.target.checked })
                  }
                  className="w-5 h-5 rounded bg-slate-600 border-slate-500 text-blue-500 focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
