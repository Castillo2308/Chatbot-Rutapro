import { useState } from 'react';
import { Trophy, Star, Flame, Lock, CheckCircle2, ArrowRight, Timer, Zap, Target, Brain } from 'lucide-react';
import logo from '@/imports/logo.png';

interface DragItem {
  id: string;
  text: string;
  correctZone: string;
}

type ActivityType = 'levels' | 'drag-drop' | 'scenario' | 'memory' | 'simulator';

export function GamifiedLearning() {
  const [points, setPoints] = useState(850);
  const [streak, setStreak] = useState(5);
  const [currentLevel, setCurrentLevel] = useState(3);
  const [currentActivity, setCurrentActivity] = useState<ActivityType>('levels');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  // Memory game state
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Scenario state
  const [scenarioStep, setScenarioStep] = useState(0);
  const [scenarioScore, setScenarioScore] = useState(0);

  // Simulator state
  const [simulatorSpeed, setSimulatorSpeed] = useState(0);
  const [simulatorDistance, setSimulatorDistance] = useState(50);
  const [simulatorLights, setSimulatorLights] = useState(false);

  const levels = [
    { id: 1, name: 'Fundamentos', locked: false, completed: true, stars: 3, color: 'from-green-500 to-emerald-600' },
    { id: 2, name: 'Señales Básicas', locked: false, completed: true, stars: 3, color: 'from-blue-500 to-cyan-600' },
    { id: 3, name: 'Rotondas', locked: false, completed: false, stars: 0, color: 'from-purple-500 to-pink-600' },
    { id: 4, name: 'Estacionamiento', locked: false, completed: false, stars: 0, color: 'from-orange-500 to-red-600' },
    { id: 5, name: 'Conducción Nocturna', locked: true, completed: false, stars: 0, color: 'from-slate-400 to-slate-500' },
    { id: 6, name: 'Autopista', locked: true, completed: false, stars: 0, color: 'from-indigo-500 to-purple-600' },
  ];

  const dragItems: DragItem[] = [
    { id: '1', text: '🪞 Revisar espejos', correctZone: 'antes' },
    { id: '2', text: '💺 Ajustar asiento', correctZone: 'antes' },
    { id: '3', text: '🔄 Señalizar giro', correctZone: 'durante' },
    { id: '4', text: '👁️ Verificar punto ciego', correctZone: 'durante' },
    { id: '5', text: '🔒 Apagar motor', correctZone: 'despues' },
    { id: '6', text: '🔑 Quitar llave', correctZone: 'despues' },
  ];

  const memoryCards = [
    { id: 1, emoji: '🛑', name: 'Alto' },
    { id: 2, emoji: '🛑', name: 'Alto' },
    { id: 3, emoji: '⚠️', name: 'Precaución' },
    { id: 4, emoji: '⚠️', name: 'Precaución' },
    { id: 5, emoji: '🚸', name: 'Escuela' },
    { id: 6, emoji: '🚸', name: 'Escuela' },
    { id: 7, emoji: '⛽', name: 'Gasolina' },
    { id: 8, emoji: '⛽', name: 'Gasolina' },
    { id: 9, emoji: '🅿️', name: 'Parking' },
    { id: 10, emoji: '🅿️', name: 'Parking' },
    { id: 11, emoji: '🚧', name: 'Obras' },
    { id: 12, emoji: '🚧', name: 'Obras' },
  ];

  const scenarioSteps = [
    {
      situation: 'Te aproximas a una intersección y la luz está en verde 🟢',
      question: '¿Qué haces?',
      options: [
        { text: 'Acelerar para pasar rápido', correct: false, feedback: 'Nunca debes acelerar sin precaución' },
        { text: 'Mantener velocidad y verificar ambos lados', correct: true, feedback: '¡Correcto! Siempre verifica aunque tengas luz verde' },
        { text: 'Frenar completamente', correct: false, feedback: 'No es necesario frenar si la luz está verde' },
      ],
    },
    {
      situation: 'Un peatón cruza la calle fuera del paso de cebra 🚶',
      question: '¿Cuál es tu acción?',
      options: [
        { text: 'Tocar el claxon y seguir', correct: false, feedback: 'Los peatones siempre tienen prioridad' },
        { text: 'Reducir velocidad y ceder el paso', correct: true, feedback: '¡Excelente! La seguridad del peatón es primero' },
        { text: 'Acelerar para pasar antes', correct: false, feedback: 'Esto es muy peligroso' },
      ],
    },
    {
      situation: 'Comienza a llover mientras conduces 🌧️',
      question: '¿Qué debes hacer?',
      options: [
        { text: 'Mantener la misma velocidad', correct: false, feedback: 'Debes ajustar tu conducción al clima' },
        { text: 'Reducir velocidad y encender luces', correct: true, feedback: '¡Perfecto! Seguridad ante todo' },
        { text: 'Acelerar para llegar rápido', correct: false, feedback: 'Esto aumenta el riesgo de accidente' },
      ],
    },
  ];

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDrop = (zone: string) => {
    if (!draggedItem) return;

    const item = dragItems.find(i => i.id === draggedItem);
    if (item && item.correctZone === zone && !completedItems.includes(draggedItem)) {
      setCompletedItems([...completedItems, draggedItem]);
      setPoints(points + 50);
    }
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCardClick = (index: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedPairs.includes(index)) return;

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(memoryMoves + 1);
      const [first, second] = newFlipped;
      if (memoryCards[first].emoji === memoryCards[second].emoji) {
        setMatchedPairs([...matchedPairs, first, second]);
        setPoints(points + 100);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const handleScenarioAnswer = (optionIndex: number) => {
    const currentStep = scenarioSteps[scenarioStep];
    if (currentStep.options[optionIndex].correct) {
      setScenarioScore(scenarioScore + 1);
      setPoints(points + 150);
    }

    if (scenarioStep < scenarioSteps.length - 1) {
      setTimeout(() => setScenarioStep(scenarioStep + 1), 2000);
    } else {
      setTimeout(() => {
        alert(`¡Completado! ${scenarioScore + (currentStep.options[optionIndex].correct ? 1 : 0)}/${scenarioSteps.length} correctas`);
        setScenarioStep(0);
        setScenarioScore(0);
      }, 2000);
    }
  };

  const dailyChallenge = {
    title: '🎯 Reto Diario',
    description: 'Completa 3 escenarios de rotonda',
    progress: 1,
    total: 3,
    reward: 200,
  };

  const activities = [
    { id: 'levels' as ActivityType, name: 'Niveles', icon: '🎮', color: 'from-purple-500 to-pink-600' },
    { id: 'drag-drop' as ActivityType, name: 'Ordenar Acciones', icon: '🎯', color: 'from-blue-500 to-cyan-600' },
    { id: 'scenario' as ActivityType, name: 'Escenarios', icon: '🎬', color: 'from-green-500 to-emerald-600' },
    { id: 'memory' as ActivityType, name: 'Memoria de Señales', icon: '🧠', color: 'from-orange-500 to-red-600' },
    { id: 'simulator' as ActivityType, name: 'Simulador', icon: '🚗', color: 'from-indigo-500 to-purple-600' },
  ];

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 pb-6">
      <div className="max-w-4xl mx-auto p-6">
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
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-3xl p-6 text-white mb-6 shadow-2xl animate-fade-in">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            🎮 Aprendizaje Gamificado
          </h1>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Star className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{points}</div>
              <div className="text-sm opacity-90">Puntos</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Flame className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">{streak}</div>
              <div className="text-sm opacity-90">Días</div>
            </div>
            <div className="bg-white/20 rounded-2xl p-4 text-center backdrop-blur-sm">
              <Trophy className="w-8 h-8 mx-auto mb-2" />
              <div className="text-3xl font-bold">Nivel {currentLevel}</div>
              <div className="text-sm opacity-90">Actual</div>
            </div>
          </div>
        </div>

        {/* Daily Challenge */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-6 text-white mb-6 shadow-2xl animate-fade-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{dailyChallenge.title}</h3>
              <p className="opacity-90">{dailyChallenge.description}</p>
            </div>
            <div className="bg-white/20 rounded-2xl px-4 py-2 font-bold backdrop-blur-sm">
              +{dailyChallenge.reward} pts
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
            <div
              className="bg-white h-full rounded-full transition-all"
              style={{ width: `${(dailyChallenge.progress / dailyChallenge.total) * 100}%` }}
            />
          </div>
          <p className="text-sm mt-2 opacity-90">
            {dailyChallenge.progress} de {dailyChallenge.total} completados
          </p>
        </div>

        {/* Activity Selection */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6 animate-fade-in">
          {activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => setCurrentActivity(activity.id)}
              className={`p-4 rounded-2xl transition-all ${
                currentActivity === activity.id
                  ? `bg-gradient-to-br ${activity.color} text-white shadow-2xl scale-105`
                  : 'bg-white text-slate-700 hover:shadow-lg hover:scale-105'
              }`}
            >
              <div className="text-3xl mb-2">{activity.icon}</div>
              <div className="text-xs font-semibold">{activity.name}</div>
            </button>
          ))}
        </div>

        {/* Activity Content */}
        {currentActivity === 'levels' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-500" />
              Niveles de Aprendizaje
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {levels.map((level) => (
                <button
                  key={level.id}
                  disabled={level.locked}
                  className={`group p-6 rounded-2xl transition-all ${
                    level.locked
                      ? 'bg-slate-100 cursor-not-allowed'
                      : level.completed
                      ? 'bg-gradient-to-br from-green-100 to-emerald-100 hover:shadow-xl hover:scale-105'
                      : `bg-gradient-to-br ${level.color} text-white hover:shadow-2xl hover:scale-105`
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-lg ${
                          level.locked
                            ? 'bg-slate-300'
                            : level.completed
                            ? 'bg-green-500'
                            : 'bg-white/20 backdrop-blur-sm'
                        }`}
                      >
                        {level.locked ? (
                          <Lock className="w-6 h-6 text-white" />
                        ) : level.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-white" />
                        ) : (
                          <span className={level.completed ? 'text-white' : ''}>{level.id}</span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className={`font-bold text-lg ${level.completed ? 'text-slate-800' : ''}`}>
                          {level.name}
                        </div>
                        {!level.locked && (
                          <div className="flex gap-1 mt-1">
                            {[...Array(3)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < level.stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    {!level.locked && !level.completed && (
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentActivity === 'drag-drop' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Target className="w-7 h-7 text-blue-600" />
              Orden de Acciones al Conducir
            </h2>
            <p className="text-slate-600 mb-6">Arrastra cada acción a la categoría correcta</p>

            {/* Drop Zones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { zone: 'antes', title: '1️⃣ Antes de Conducir', color: 'blue' },
                { zone: 'durante', title: '2️⃣ Durante la Conducción', color: 'purple' },
                { zone: 'despues', title: '3️⃣ Después de Conducir', color: 'green' }
              ].map(({ zone, title, color }) => (
                <div
                  key={zone}
                  onDrop={() => handleDrop(zone)}
                  onDragOver={handleDragOver}
                  className={`border-2 border-dashed rounded-2xl p-5 min-h-48 transition-all ${
                    draggedItem
                      ? `border-${color}-400 bg-${color}-50 scale-105`
                      : `border-slate-300 bg-slate-50`
                  }`}
                >
                  <h3 className="font-bold text-slate-700 mb-4">{title}</h3>
                  <div className="space-y-2">
                    {dragItems
                      .filter(item => item.correctZone === zone && completedItems.includes(item.id))
                      .map(item => (
                        <div key={item.id} className="bg-green-100 border-2 border-green-400 rounded-xl p-3 text-sm font-semibold shadow-md">
                          ✓ {item.text}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Draggable Items */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-orange-500" />
                Acciones disponibles:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {dragItems
                  .filter(item => !completedItems.includes(item.id))
                  .map(item => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(item.id)}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-2 border-blue-300 rounded-xl p-4 cursor-move hover:shadow-xl hover:scale-105 transition-all font-semibold"
                    >
                      {item.text}
                    </div>
                  ))}
              </div>
            </div>

            {completedItems.length === dragItems.length && (
              <div className="mt-6 bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400 rounded-2xl p-6 text-center shadow-lg animate-fade-in">
                <p className="text-2xl font-bold text-green-700 mb-2">¡Excelente trabajo! 🎉</p>
                <p className="text-green-600">+300 puntos ganados</p>
              </div>
            )}
          </div>
        )}

        {currentActivity === 'scenario' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-3xl">🎬</span>
              Escenarios de Conducción
            </h2>
            <p className="text-slate-600 mb-6">Toma la mejor decisión en cada situación</p>

            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">
                Escenario {scenarioStep + 1} de {scenarioSteps.length}
              </span>
              <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold">
                {scenarioScore} correctas
              </span>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
              <p className="text-lg font-semibold text-slate-800 mb-4">
                {scenarioSteps[scenarioStep].situation}
              </p>
              <p className="text-slate-700 font-bold">{scenarioSteps[scenarioStep].question}</p>
            </div>

            <div className="space-y-3">
              {scenarioSteps[scenarioStep].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleScenarioAnswer(index)}
                  className="w-full p-5 rounded-2xl border-2 border-slate-300 hover:border-purple-400 hover:bg-purple-50 transition-all text-left hover:scale-102 hover:shadow-lg group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold shadow-lg">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-semibold text-slate-800 flex-1">{option.text}</span>
                    <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentActivity === 'memory' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Brain className="w-7 h-7 text-purple-600" />
              Memoria de Señales de Tránsito
            </h2>
            <p className="text-slate-600 mb-4">Encuentra todos los pares de señales</p>

            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">
                Movimientos: {memoryMoves}
              </span>
              <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-bold">
                {matchedPairs.length / 2} / {memoryCards.length / 2} pares
              </span>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {memoryCards.map((card, index) => (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  disabled={matchedPairs.includes(index)}
                  className={`aspect-square rounded-2xl text-4xl font-bold transition-all ${
                    flippedCards.includes(index) || matchedPairs.includes(index)
                      ? matchedPairs.includes(index)
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 scale-95'
                        : 'bg-gradient-to-br from-blue-400 to-purple-500'
                      : 'bg-gradient-to-br from-slate-300 to-slate-400 hover:scale-105 hover:shadow-lg'
                  } text-white shadow-lg`}
                >
                  {flippedCards.includes(index) || matchedPairs.includes(index) ? card.emoji : '?'}
                </button>
              ))}
            </div>

            {matchedPairs.length === memoryCards.length && (
              <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-400 rounded-2xl p-6 text-center shadow-lg animate-fade-in">
                <p className="text-2xl font-bold text-purple-700 mb-2">¡Completado! 🎉</p>
                <p className="text-purple-600">En {memoryMoves} movimientos - +{matchedPairs.length * 50} puntos</p>
              </div>
            )}
          </div>
        )}

        {currentActivity === 'simulator' && (
          <div className="bg-white rounded-3xl p-6 shadow-2xl animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span className="text-3xl">🚗</span>
              Simulador de Conducción
            </h2>
            <p className="text-slate-600 mb-6">Practica tus habilidades en un entorno virtual</p>

            {/* Road Simulation */}
            <div className="bg-gradient-to-b from-sky-200 to-green-200 rounded-2xl p-8 mb-6 relative overflow-hidden" style={{ height: '300px' }}>
              {/* Road */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-slate-700">
                {/* Lane markers */}
                <div className="absolute top-1/2 left-0 right-0 h-2 border-t-4 border-dashed border-yellow-300"></div>
              </div>

              {/* Car */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-6xl transform transition-transform" style={{ transform: `translateX(-50%) translateX(${(simulatorSpeed - 50) * 2}px)` }}>
                🚗
              </div>

              {/* Other vehicles */}
              <div className="absolute bottom-24 text-4xl animate-pulse" style={{ right: `${simulatorDistance}%` }}>
                🚙
              </div>

              {/* Lights indicator */}
              {simulatorLights && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  💡 Luces encendidas
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Timer className="w-4 h-4" />
                  Velocidad: {simulatorSpeed} km/h
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={simulatorSpeed}
                  onChange={(e) => setSimulatorSpeed(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Distancia al vehículo delantero: {simulatorDistance}m
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={simulatorDistance}
                  onChange={(e) => setSimulatorDistance(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer"
                />
              </div>

              <button
                onClick={() => setSimulatorLights(!simulatorLights)}
                className={`w-full py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  simulatorLights
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {simulatorLights ? '💡 Apagar Luces' : '🔦 Encender Luces'}
              </button>

              {/* Safety warnings */}
              <div className="space-y-2">
                {simulatorSpeed > 60 && simulatorDistance < 30 && (
                  <div className="bg-red-100 border-2 border-red-400 rounded-xl p-4 text-red-700 font-semibold animate-fade-in">
                    ⚠️ ¡PELIGRO! Velocidad muy alta y distancia insegura
                  </div>
                )}
                {simulatorSpeed > 0 && !simulatorLights && (
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-xl p-4 text-yellow-700 font-semibold animate-fade-in">
                    💡 Considera encender las luces para mejor visibilidad
                  </div>
                )}
                {simulatorSpeed <= 60 && simulatorDistance >= 30 && simulatorSpeed > 0 && (
                  <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 text-green-700 font-semibold animate-fade-in">
                    ✅ ¡Excelente! Conducción segura
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
