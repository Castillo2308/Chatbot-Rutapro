import logo from '@/imports/logo.png';
import { useNavigate } from "react-router";
import { BookOpen, MessageCircle, AlertTriangle, Trophy, Target, TrendingUp, Star, Award, Flame, Zap } from "lucide-react";

export function Home() {
  const navigate = useNavigate();

  const userProgress = {
    totalPoints: 1250,
    level: 5,
    completedLessons: 12,
    totalLessons: 24,
    streak: 7,
  };

  const masteredTopics = [
    { name: "Señales de tránsito básicas", score: 95 },
    { name: "Normas de velocidad", score: 92 },
    { name: "Estacionamiento", score: 88 },
  ];

  const topicsToImprove = [
    { name: "Giros y rotondas", score: 65 },
    { name: "Conducción nocturna", score: 58 },
  ];

  const recommendations = [
    "Practica más sobre giros en rotondas",
    "Completa el módulo de conducción nocturna",
    "Repasa las señales preventivas",
  ];

  return (
    <div className="size-full overflow-auto bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="min-h-full p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-green-500 p-3 rounded-3xl shadow-2xl hover:shadow-3xl transition-all hover:scale-110">
              <img 
                src={logo} 
                alt="RutaPro" 
                className="h-24 object-contain drop-shadow-xl"
              />
            </div>
          </div>
          <p className="text-lg text-gray-600 font-medium">¡Bienvenido de nuevo, Conductor! 👋</p>
        </div>

        {/* Progress Dashboard */}
        <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl shadow-xl p-6 mb-6 border border-blue-100 animate-fade-in">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Tu Progreso
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Star className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-3xl font-bold text-white">{userProgress.totalPoints}</div>
              <div className="text-sm text-white/90 font-medium">Puntos</div>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Zap className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-3xl font-bold text-white">Nivel {userProgress.level}</div>
              <div className="text-sm text-white/90 font-medium">Actual</div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-3xl font-bold text-white">{userProgress.completedLessons}/{userProgress.totalLessons}</div>
              <div className="text-sm text-white/90 font-medium">Lecciones</div>
            </div>
            <div className="bg-gradient-to-br from-red-400 to-pink-600 rounded-2xl p-5 text-center shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Flame className="w-8 h-8 mx-auto mb-2 text-white" />
              <div className="text-3xl font-bold text-white">{userProgress.streak} días</div>
              <div className="text-sm text-white/90 font-medium">Racha</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-gradient-to-r from-gray-200 to-gray-100 rounded-full h-5 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 h-full transition-all duration-500 shadow-lg relative"
              style={{ width: `${(userProgress.completedLessons / userProgress.totalLessons) * 100}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-700 mt-3 text-center">
            {Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)}% completado - ¡Sigue así! 💪
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 animate-fade-in">
          <button
            onClick={() => navigate("/learning")}
            className="group bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <BookOpen className="w-10 h-10" />
              </div>
              <div className="text-left flex-1">
                <div className="text-xl font-bold mb-1">Aprendizaje Gamificado</div>
                <div className="text-sm opacity-90">Aprende jugando y divirtiéndote 🎮</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/chatbot")}
            className="group bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 text-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <MessageCircle className="w-10 h-10" />
              </div>
              <div className="text-left flex-1">
                <div className="text-xl font-bold mb-1">Hablar con RutaPro</div>
                <div className="text-sm opacity-90">Pregunta lo que necesites 💬</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/signs")}
            className="group bg-gradient-to-br from-purple-500 via-violet-600 to-fuchsia-600 text-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="text-left flex-1">
                <div className="text-xl font-bold mb-1">Reconocer Señales</div>
                <div className="text-sm opacity-90">Practica señales de tránsito 🚦</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => navigate("/quiz")}
            className="group bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600 text-white rounded-3xl p-7 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-all"></div>
            <div className="relative flex items-center gap-5">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Trophy className="w-10 h-10" />
              </div>
              <div className="text-left flex-1">
                <div className="text-xl font-bold mb-1">Quiz de Práctica</div>
                <div className="text-sm opacity-90">Pon a prueba tus conocimientos 📝</div>
              </div>
            </div>
          </button>
        </div>

        {/* Topics Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fade-in">
          {/* Mastered Topics */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-green-700 mb-5 flex items-center gap-2">
              <div className="bg-green-500 p-2 rounded-xl">
                <Star className="w-5 h-5 text-white" />
              </div>
              Temas Dominados
            </h3>
            <div className="space-y-4">
              {masteredTopics.map((topic, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{topic.name}</span>
                    <span className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">{topic.score}%</span>
                  </div>
                  <div className="bg-green-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${topic.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topics to Improve */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl shadow-xl p-6 border border-orange-200">
            <h3 className="text-xl font-bold text-orange-700 mb-5 flex items-center gap-2">
              <div className="bg-orange-500 p-2 rounded-xl">
                <Target className="w-5 h-5 text-white" />
              </div>
              Temas por Mejorar
            </h3>
            <div className="space-y-4">
              {topicsToImprove.map((topic, index) => (
                <div key={index} className="bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-gray-800">{topic.name}</span>
                    <span className="text-sm font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">{topic.score}%</span>
                  </div>
                  <div className="bg-orange-100 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${topic.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Personalized Recommendations */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-xl p-6 border border-blue-200 animate-fade-in">
          <h3 className="text-xl font-bold text-blue-700 mb-5 flex items-center gap-2">
            <div className="bg-blue-500 p-2 rounded-xl">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            Recomendaciones Personalizadas
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-4 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-102">
                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 p-2 rounded-xl flex-shrink-0">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-800 flex-1">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge Banner */}
        <div className="mt-6 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-8 text-white text-center shadow-2xl relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
          <div className="relative">
            <div className="text-5xl mb-3">🎯</div>
            <h3 className="text-2xl font-bold mb-2">¡Reto Diario Disponible!</h3>
            <p className="mb-5 opacity-90 text-lg">Completa el desafío de hoy y gana <span className="font-bold">100 puntos extra</span></p>
            <button
              onClick={() => navigate("/learning")}
              className="bg-white text-purple-600 px-8 py-3 rounded-2xl font-bold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Comenzar Reto 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
