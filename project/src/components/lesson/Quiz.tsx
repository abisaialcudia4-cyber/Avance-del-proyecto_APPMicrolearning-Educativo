import { useState } from 'react';
import { QuizQuestion } from '../../lib/supabase';
import { ArrowLeft, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface QuizProps {
  questions: QuizQuestion[];
  lessonTitle: string;
  onComplete: (score: number) => void;
  onBack: () => void;
}

export default function Quiz({ questions, lessonTitle, onComplete, onBack }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question?.correct_answer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  function handleAnswerSelect(index: number) {
    if (showExplanation) return;
    setSelectedAnswer(index);
  }

  function handleConfirm() {
    if (selectedAnswer === null) return;
    setShowExplanation(true);
    setAnswers([...answers, isCorrect]);
  }

  function handleNext() {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const correctAnswers = answers.filter((a) => a).length + (isCorrect ? 1 : 0);
      const score = Math.round((correctAnswers / questions.length) * 100);
      setIsComplete(true);
    }
  }

  const correctAnswers = answers.filter((a) => a).length + (showExplanation && isCorrect ? 1 : 0);
  const finalScore = Math.round((correctAnswers / questions.length) * 100);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">¡Quiz Completado!</h1>
            <p className="text-slate-400 mb-8">{lessonTitle}</p>

            <div className="bg-slate-700/50 rounded-2xl p-8 mb-8">
              <div className="text-6xl font-bold text-white mb-2">{finalScore}%</div>
              <p className="text-slate-400">
                {correctAnswers} de {questions.length} respuestas correctas
              </p>
            </div>

            <div className="space-y-3">
              {finalScore === 100 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                  <p className="text-green-400 font-semibold">
                    ¡Perfecto! Dominaste esta lección completamente
                  </p>
                </div>
              )}

              {finalScore >= 70 && finalScore < 100 && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-blue-400 font-semibold">
                    ¡Muy bien! Sigue así para mejorar aún más
                  </p>
                </div>
              )}

              {finalScore < 70 && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-yellow-400 font-semibold">
                    Buen intento. Te recomendamos repasar la lección
                  </p>
                </div>
              )}

              <button
                onClick={() => onComplete(finalScore)}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Salir del quiz</span>
        </button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">
                Pregunta {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-sm text-slate-400">
                {correctAnswers} correctas
              </span>
            </div>

            <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <h2 className="text-2xl font-bold text-white mb-8">{question.question_text}</h2>
          </div>

          <div className="space-y-3 mb-8">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const showCorrect = showExplanation && index === question.correct_answer;
              const showWrong = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${
                    showCorrect
                      ? 'bg-green-500 ring-2 ring-green-400'
                      : showWrong
                      ? 'bg-red-500 ring-2 ring-red-400'
                      : isSelected
                      ? 'bg-blue-500 ring-2 ring-blue-400'
                      : 'bg-slate-700/50 hover:bg-slate-700'
                  } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <span className="text-white font-medium">{option}</span>
                  {showCorrect && <CheckCircle className="w-6 h-6 text-white" />}
                  {showWrong && <XCircle className="w-6 h-6 text-white" />}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div
              className={`rounded-xl p-4 mb-6 ${
                isCorrect
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}
            >
              <p className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </p>
              <p className="text-slate-300">{question.explanation}</p>
            </div>
          )}

          <div className="flex gap-3">
            {!showExplanation ? (
              <button
                onClick={handleConfirm}
                disabled={selectedAnswer === null}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar respuesta
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
              >
                {currentQuestion < questions.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
