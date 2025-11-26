import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PasswordReset from './components/auth/PasswordReset';
import AvatarSelection from './components/onboarding/AvatarSelection';
import LearningStyleSetup from './components/onboarding/LearningStyleSetup';
import SubjectSelection from './components/onboarding/SubjectSelection';
import GoalsSetup from './components/onboarding/GoalsSetup';
import Dashboard from './components/dashboard/Dashboard';
import LessonView from './components/lesson/LessonView';

type AuthMode = 'login' | 'register' | 'reset';
type OnboardingStep = 'avatar' | 'style' | 'subjects' | 'goals' | 'complete';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('avatar');
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [knowledgeLevel, setKnowledgeLevel] = useState('basic');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkOnboardingStatus();
    } else {
      setCheckingOnboarding(false);
    }
  }, [user]);

  async function checkOnboardingStatus() {
    if (!user) return;

    const { data } = await supabase
      .from('learning_preferences')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    setHasCompletedOnboarding(!!data);
    setCheckingOnboarding(false);
  }

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    if (authMode === 'register') {
      return <Register onToggleMode={setAuthMode} />;
    }
    if (authMode === 'reset') {
      return <PasswordReset onToggleMode={setAuthMode} />;
    }
    return <Login onToggleMode={setAuthMode} />;
  }

  if (currentLessonId) {
    return (
      <LessonView
        lessonId={currentLessonId}
        onComplete={() => setCurrentLessonId(null)}
        onBack={() => setCurrentLessonId(null)}
      />
    );
  }

  if (!hasCompletedOnboarding) {
    if (onboardingStep === 'avatar') {
      return <AvatarSelection onComplete={() => setOnboardingStep('style')} />;
    }

    if (onboardingStep === 'style') {
      return (
        <LearningStyleSetup
          onComplete={(style) => {
            setKnowledgeLevel(style);
            setOnboardingStep('subjects');
          }}
          onBack={() => setOnboardingStep('avatar')}
        />
      );
    }

    if (onboardingStep === 'subjects') {
      return (
        <SubjectSelection
          onComplete={(subjects) => {
            setSelectedSubjects(subjects);
            setOnboardingStep('goals');
          }}
          onBack={() => setOnboardingStep('style')}
        />
      );
    }

    if (onboardingStep === 'goals') {
      return (
        <GoalsSetup
          knowledgeLevel={knowledgeLevel}
          selectedSubjects={selectedSubjects}
          onComplete={() => setHasCompletedOnboarding(true)}
          onBack={() => setOnboardingStep('subjects')}
        />
      );
    }
  }

  return <Dashboard onStartLesson={setCurrentLessonId} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
