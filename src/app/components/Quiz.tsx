import { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, RotateCcw, Brain, Target, Zap } from 'lucide-react';
import logo from '@/imports/logo.png';

type QuestionType = 'multiple-choice' | 'true-false' | 'scenario';

interface BaseQuestion {
  id: number;
  type: QuestionType;
  question: string;
  explanation: string;
  points: number;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: string[];
  correctAnswer: number;
}

interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

interface ScenarioQuestion extends BaseQuestion {
  type: 'scenario';
  scenario: string;
  options: string[];
  correctAnswer: number;
}

type Question = MultipleChoiceQuestion | TrueFalseQuestion | ScenarioQuestion;

export function Quiz() {
  const [quizMode, setQuizMode] = useState<'select' | 'playing'>('select');
  const [selectedQuizType, setSelectedQuizType] = useState<'mixed' | 'beginner' | 'advanced' | 'scenarios'>('mixed');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | boolean | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const allQuestions: Question[] = [
    // Multiple Choice Questions
    {
      id: 1,
      type: 'multiple-choice',
      question: '¿Cuál es la distancia mínima que debes mantener con el vehículo de adelante?',
      options: ['1 metro', '2 segundos de distancia', '5 metros', '1 segundo de distancia'],
      correctAnswer: 1,
      explanation: 'La regla de los 2 segundos te da tiempo suficiente para reaccionar ante cualquier imprevisto.',
      points: 100,
    },
    {
      id: 2,
      type: 'multiple-choice',
      question: '¿Qué debes hacer al ver una señal de ALTO?',
      options: [
        'Reducir la velocidad',
        'Detenerte completamente',
        'Mirar a ambos lados y continuar',
        'Solo frenar si vienen vehículos',
      ],
      correctAnswer: 1,
      explanation: 'SIEMPRE debes detenerte completamente en una señal de ALTO, sin importar si hay o no tráfico.',
      points: 100,
    },
    {
      id: 3,
      type: 'multiple-choice',
      question: '¿En qué situación NO debes adelantar a otro vehículo?',
      options: [
        'En una curva o pendiente',
        'En autopista',
        'En zona urbana',
        'Durante el día',
      ],
      correctAnswer: 0,
      explanation: 'Adelantar en curvas o pendientes es extremadamente peligroso porque no puedes ver el tráfico que viene.',
      points: 100,
    },

    // True/False Questions
    {
      id: 4,
      type: 'true-false',
      question: 'Es obligatorio usar el cinturón de seguridad solo en autopistas.',
      correctAnswer: false,
      explanation: 'El cinturón de seguridad es obligatorio en TODOS los tipos de vías y para todos los ocupantes del vehículo.',
      points: 50,
    },
    {
      id: 5,
      type: 'true-false',
      question: 'Puedes usar el celular con manos libres mientras conduces.',
      correctAnswer: true,
      explanation: 'El uso de dispositivos manos libres está permitido, pero es recomendable minimizar las distracciones.',
      points: 50,
    },
    {
      id: 6,
      type: 'true-false',
      question: 'Las luces intermitentes deben activarse antes de cambiar de carril.',
      correctAnswer: true,
      explanation: 'Debes señalizar SIEMPRE tus intenciones con suficiente anticipación para que otros conductores puedan reaccionar.',
      points: 50,
    },

    // Scenario Questions
    {
      id: 7,
      type: 'scenario',
      scenario: 'Estás conduciendo en una carretera de dos carriles y empieza a llover fuertemente. La visibilidad se reduce y el pavimento está mojado.',
      question: '¿Cuál es la acción más segura?',
      options: [
        'Mantener la misma velocidad para llegar rápido',
        'Reducir velocidad, aumentar distancia y encender luces',
        'Acelerar para salir rápido de la zona de lluvia',
        'Detenerse en el carril hasta que pare de llover',
      ],
      correctAnswer: 1,
      explanation: 'En condiciones de lluvia debes reducir la velocidad, aumentar la distancia de seguridad y mantener las luces encendidas para mayor visibilidad.',
      points: 150,
    },
    {
      id: 8,
      type: 'scenario',
      scenario: 'Llegas a una intersección con semáforo en amarillo y estás a 10 metros de la línea de alto.',
      question: '¿Qué debes hacer?',
      options: [
        'Acelerar para pasar antes del rojo',
        'Frenar bruscamente',
        'Continuar con precaución si es seguro',
        'Detenerte gradualmente si puedes hacerlo con seguridad',
      ],
      correctAnswer: 3,
      explanation: 'El amarillo indica precaución. Si puedes detenerte con seguridad, debes hacerlo. Solo continúa si ya estás muy cerca y frenar sería peligroso.',
      points: 150,
    },
    {
      id: 9,
      type: 'scenario',
      scenario: 'Estás en una rotonda con dos carriles. Necesitas tomar la tercera salida.',
      question: '¿Qué carril debes tomar?',
      options: [
        'Carril interior (izquierdo)',
        'Carril exterior (derecho)',
        'Cualquiera de los dos',
        'Cambiar de carril dentro de la rotonda',
      ],
      correctAnswer: 0,
      explanation: 'Para salidas lejanas (más de la segunda), debes usar el carril interior y señalizar al cambiar al exterior para salir.',
      points: 150,
    },
    {
      id: 10,
      type: 'scenario',
      scenario: 'Un vehículo de emergencia con sirenas se aproxima por detrás mientras conduces en una calle de un solo carril.',
      question: '¿Qué debes hacer?',
      options: [
        'Continuar a la misma velocidad',
        'Detenerte inmediatamente en el carril',
        'Orillarte a la derecha y detenerte si es seguro',
        'Acelerar para darle espacio',
      ],
      correctAnswer: 2,
      explanation: 'Debes orillarte a la derecha y detenerte de manera segura para permitir el paso del vehículo de emergencia.',
      points: 150,
    },
  ];

  const getQuestionsByType = () => {
    switch (selectedQuizType) {
      case 'beginner':
        return allQuestions.filter(q => q.type === 'true-false' || (q.type === 'multiple-choice' && q.id <= 3));
      case 'advanced':
        return allQuestions.filter(q => q.type === 'multiple-choice');
      case 'scenarios':
        return allQuestions.filter(q => q.type === 'scenario');
      default:
        return allQuestions;
    }
  };

  const [questions, setQuestions] = useState<Question[]>([]);

  const startQuiz = (type: typeof selectedQuizType) => {
    setSelectedQuizType(type);
    const filteredQuestions = type === 'mixed' ? allQuestions :
      type === 'beginner' ? allQuestions.filter(q => q.type === 'true-false' || (q.type === 'multiple-choice' && q.id <= 3)) :
      type === 'advanced' ? allQuestions.filter(q => q.type === 'multiple-choice') :
      allQuestions.filter(q => q.type === 'scenario');

    setQuestions(filteredQuestions);
    setQuizMode('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTotalPoints(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
  };

  const handleSelectAnswer = (answer: number | boolean) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    setShowResult(true);
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setTotalPoints(totalPoints + question.points);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setQuizMode('select');
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setTotalPoints(0);
    setQuizCompleted(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage === 100) return '¡Perfecto! Eres un experto 🏆';
    if (percentage >= 80) return '¡Excelente trabajo! 🌟';
    if (percentage >= 60) return '¡Bien hecho! Sigue practicando 👍';
    return 'Necesitas repasar más. ¡No te rindas! 💪';
  };

  if (quizMode === 'select') {
    return (
      <div className="h-full overflow-auto bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-6">
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8 animate-fade-in">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              Quiz de Práctica
            </h1>
            <p className="text-lg text-slate-600">Elige el tipo de quiz que prefieres</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mixed Quiz */}
            <button
              onClick={() => startQuiz('mixed')}
              className="group bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95"
            >
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Brain className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Quiz Completo</h3>
              <p className="text-sm opacity-90 mb-4">Todos los tipos de preguntas mezcladas</p>
              <div className="bg-white/20 rounded-xl px-4 py-2 inline-block">
                <span className="font-semibold">{allQuestions.length} preguntas</span>
              </div>
            </button>

            {/* Beginner Quiz */}
            <button
              onClick={() => startQuiz('beginner')}
              className="group bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95"
            >
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Target className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Nivel Principiante</h3>
              <p className="text-sm opacity-90 mb-4">Preguntas básicas de verdadero/falso</p>
              <div className="bg-white/20 rounded-xl px-4 py-2 inline-block">
                <span className="font-semibold">6 preguntas</span>
              </div>
            </button>

            {/* Advanced Quiz */}
            <button
              onClick={() => startQuiz('advanced')}
              className="group bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95"
            >
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Zap className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Nivel Avanzado</h3>
              <p className="text-sm opacity-90 mb-4">Selección múltiple con opciones complejas</p>
              <div className="bg-white/20 rounded-xl px-4 py-2 inline-block">
                <span className="font-semibold">3 preguntas</span>
              </div>
            </button>

            {/* Scenarios Quiz */}
            <button
              onClick={() => startQuiz('scenarios')}
              className="group bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-105 active:scale-95"
            >
              <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                <Trophy className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Escenarios Reales</h3>
              <p className="text-sm opacity-90 mb-4">Situaciones de conducción del mundo real</p>
              <div className="bg-white/20 rounded-xl px-4 py-2 inline-block">
                <span className="font-semibold">4 preguntas</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);
    const percentage = (score / questions.length) * 100;

    return (
      <div className="h-full overflow-auto bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
        <div className="max-w-2xl mx-auto p-6">
          <div className="bg-white rounded-3xl p-8 shadow-2xl text-center animate-fade-in">
            <div className="text-7xl mb-6">
              {percentage === 100 ? '🏆' : percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}
            </div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">¡Quiz Completado!</h2>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-8 text-white mb-6 shadow-xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm opacity-90 mb-2">Correctas</p>
                  <p className="text-5xl font-bold">{score}/{questions.length}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90 mb-2">Puntos</p>
                  <p className="text-5xl font-bold">{totalPoints}</p>
                </div>
              </div>
              <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="mt-2 text-sm opacity-90">{percentage.toFixed(0)}% de precisión</p>
            </div>

            <p className="text-2xl text-slate-700 mb-8 font-semibold">{getScoreMessage()}</p>

            <div className="space-y-3">
              <button
                onClick={handleRestart}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Elegir Otro Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-purple-50 to-pink-50 pb-6">
      <div className="max-w-2xl mx-auto p-6">
        {/* Logo Header */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-3xl shadow-2xl">
            <img 
              src={logo} 
              alt="RutaPro" 
              className="h-16 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-6 text-white mb-6 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {question.type === 'scenario' ? '🎬' : question.type === 'true-false' ? '✓✗' : '📝'}
              <span className="capitalize">{
                question.type === 'scenario' ? 'Escenario' :
                question.type === 'true-false' ? 'V/F' : 'Múltiple'
              }</span>
            </h1>
            <div className="bg-white/20 rounded-2xl px-5 py-2 backdrop-blur-sm">
              <Trophy className="w-5 h-5 inline mr-2" />
              <span className="font-bold text-xl">{totalPoints}</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm opacity-90 mb-2">
            <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
            <span>+{question.points} pts</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-6 border border-purple-100 animate-fade-in">
          {question.type === 'scenario' && (
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-5 mb-6 border-2 border-orange-200">
              <h3 className="font-bold text-orange-700 mb-2 flex items-center gap-2">
                <span className="text-2xl">📍</span>
                Situación:
              </h3>
              <p className="text-slate-700 leading-relaxed">{question.scenario}</p>
            </div>
          )}

          <h2 className="text-2xl font-bold text-slate-800 mb-6">
            {question.question}
          </h2>

          {question.type === 'true-false' ? (
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: true, label: 'Verdadero', emoji: '✅', gradient: 'from-green-500 to-emerald-500' },
                { value: false, label: 'Falso', emoji: '❌', gradient: 'from-red-500 to-pink-500' }
              ].map((option) => {
                const isSelected = selectedAnswer === option.value;
                const isCorrect = option.value === question.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={option.label}
                    onClick={() => handleSelectAnswer(option.value)}
                    disabled={showResult}
                    className={`p-6 rounded-2xl border-2 text-left transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50 scale-105'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50'
                    } ${showResult ? 'cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-4xl shadow-lg`}>
                        {option.emoji}
                      </div>
                      <span className="text-xl font-bold text-slate-800">{option.label}</span>
                      {showCorrect && <CheckCircle2 className="w-10 h-10 text-green-600" />}
                      {showWrong && <XCircle className="w-10 h-10 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showWrong = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${
                      showCorrect
                        ? 'border-green-500 bg-green-50 scale-102'
                        : showWrong
                        ? 'border-red-500 bg-red-50'
                        : isSelected
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50'
                    } ${showResult ? 'cursor-not-allowed' : 'hover:scale-102 hover:shadow-lg'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                          showCorrect ? 'bg-green-500' :
                          showWrong ? 'bg-red-500' :
                          isSelected ? 'bg-purple-500' : 'bg-slate-400'
                        }`}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-slate-800 font-medium">{option}</span>
                      </div>
                      {showCorrect && <CheckCircle2 className="w-7 h-7 text-green-600" />}
                      {showWrong && <XCircle className="w-7 h-7 text-red-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {showResult && (
            <div className={`mt-6 p-5 rounded-2xl shadow-lg ${
              selectedAnswer === question.correctAnswer
                ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400'
                : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-400'
            }`}>
              <p className={`font-bold mb-3 text-lg ${
                selectedAnswer === question.correctAnswer ? 'text-green-700' : 'text-blue-700'
              }`}>
                {selectedAnswer === question.correctAnswer
                  ? `✅ ¡Correcto! +${question.points} puntos 🎉`
                  : 'ℹ️ Explicación:'}
              </p>
              <p className="text-slate-700 leading-relaxed">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          {!showResult ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              Confirmar Respuesta
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-2xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              {currentQuestion < questions.length - 1 ? 'Siguiente Pregunta →' : 'Ver Resultados 🏆'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
