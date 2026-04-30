import { useState } from 'react';
import { CheckCircle2, XCircle, Award, X, Info } from 'lucide-react';
import logo from '@/imports/logo.png';

interface TrafficSign {
  id: string;
  type: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  importance: string;
  whenToUse: string;
}

export function SignRecognition() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [signDetailModal, setSignDetailModal] = useState<TrafficSign | null>(null);

  const signs: TrafficSign[] = [
    {
      id: '1',
      type: 'preventiva',
      name: 'Curva Peligrosa',
      emoji: '↪️',
      color: 'bg-yellow-400',
      description: 'Advierte sobre una curva cerrada próxima en el camino.',
      importance: 'Reducir la velocidad antes de entrar a la curva para mantener el control del vehículo.',
      whenToUse: 'Aparece antes de curvas pronunciadas en carreteras.'
    },
    {
      id: '2',
      type: 'reglamentaria',
      name: 'Alto Total',
      emoji: '🛑',
      color: 'bg-red-500',
      description: 'Obliga a detener completamente el vehículo.',
      importance: 'Debes detenerte totalmente, verificar el tráfico en ambas direcciones antes de continuar.',
      whenToUse: 'En intersecciones donde es necesario ceder el paso absoluto.'
    },
    {
      id: '3',
      type: 'informativa',
      name: 'Hospital',
      emoji: '🏥',
      color: 'bg-blue-500',
      description: 'Indica la ubicación de un centro médico u hospital cercano.',
      importance: 'Reducir el ruido y velocidad. Estar atento a ambulancias.',
      whenToUse: 'Cerca de zonas hospitalarias.'
    },
    {
      id: '4',
      type: 'preventiva',
      name: 'Zona Escolar',
      emoji: '🚸',
      color: 'bg-yellow-400',
      description: 'Advierte sobre presencia de niños cruzando la vía.',
      importance: 'Reducir velocidad significativamente y estar muy atento a peatones jóvenes.',
      whenToUse: 'Cerca de escuelas y zonas donde juegan niños.'
    },
    {
      id: '5',
      type: 'reglamentaria',
      name: 'Prohibido Girar',
      emoji: '🚫',
      color: 'bg-red-500',
      description: 'Prohíbe realizar giros en esa dirección.',
      importance: 'No se puede girar en la dirección indicada, bajo multa.',
      whenToUse: 'En intersecciones donde el giro representa peligro.'
    },
    {
      id: '6',
      type: 'informativa',
      name: 'Gasolinera',
      emoji: '⛽',
      color: 'bg-blue-500',
      description: 'Indica la ubicación de una estación de servicio.',
      importance: 'Información útil para planificar abastecimiento de combustible.',
      whenToUse: 'Cerca de gasolineras y estaciones de servicio.'
    },
    {
      id: '7',
      type: 'reglamentaria',
      name: 'Ceda el Paso',
      emoji: '🔻',
      color: 'bg-red-500',
      description: 'Indica que debes ceder el paso a otros vehículos.',
      importance: 'Debes reducir velocidad y ceder prioridad al tráfico cruzado.',
      whenToUse: 'En intersecciones donde otros tienen prioridad.'
    },
    {
      id: '8',
      type: 'preventiva',
      name: 'Obras en la Vía',
      emoji: '🚧',
      color: 'bg-yellow-400',
      description: 'Advierte sobre trabajos de construcción en el camino.',
      importance: 'Reducir velocidad y estar atento a trabajadores y equipos.',
      whenToUse: 'En zonas de construcción o reparación de vías.'
    },
    {
      id: '9',
      type: 'preventiva',
      name: 'Cruce de Animales',
      emoji: '🦌',
      color: 'bg-yellow-400',
      description: 'Advierte sobre posible cruce de animales salvajes.',
      importance: 'Reducir velocidad y estar muy atento, especialmente al amanecer y atardecer.',
      whenToUse: 'En zonas rurales o cercanas a bosques.'
    },
    {
      id: '10',
      type: 'informativa',
      name: 'Estacionamiento',
      emoji: '🅿️',
      color: 'bg-blue-500',
      description: 'Indica zona permitida para estacionar vehículos.',
      importance: 'Puedes estacionar tu vehículo de forma segura.',
      whenToUse: 'En áreas designadas para estacionamiento.'
    },
  ];

  const [currentSign] = useState<TrafficSign>(
    signs[Math.floor(Math.random() * signs.length)]
  );

  const options = [
    { id: 'preventiva', label: 'Preventiva', description: 'Advierte sobre peligros', color: 'yellow', gradient: 'from-yellow-400 to-orange-400' },
    { id: 'reglamentaria', label: 'Reglamentaria', description: 'Indica prohibiciones u obligaciones', color: 'red', gradient: 'from-red-500 to-pink-500' },
    { id: 'informativa', label: 'Informativa', description: 'Proporciona información útil', color: 'blue', gradient: 'from-blue-500 to-cyan-500' },
  ];

  const handleSelectOption = (optionId: string) => {
    setSelectedSign(optionId);
    const correct = optionId === currentSign.type;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setCorrectAnswers(correctAnswers + 1);
    }

    setTimeout(() => {
      setShowResult(false);
      setSelectedSign(null);
    }, 2000);
  };

  const handleSignClick = (sign: TrafficSign) => {
    setSignDetailModal(sign);
  };

  const getSignsByCategory = (category: string) => {
    return signs.filter(sign => sign.type === category);
  };

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pb-6">
      <div className="max-w-4xl mx-auto p-6">
        {/* Logo Header */}
        <div className="flex justify-center mb-6 animate-fade-in">
          <div className="bg-gradient-to-br from-blue-500 to-purple-500 p-3 rounded-3xl shadow-2xl">
            <img 
              src={logo} 
              alt="RutaPro" 
              className="h-16 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white mb-6 shadow-2xl animate-fade-in">
          <h1 className="text-3xl font-bold mb-2">🚦 Reconocimiento de Señales</h1>
          <p className="opacity-90 text-lg">Aprende a identificar las señales de tránsito</p>
          <div className="mt-4 bg-white/20 rounded-2xl p-4 inline-block backdrop-blur-sm">
            <Award className="w-6 h-6 inline mr-2" />
            <span className="text-2xl font-bold">{correctAnswers}</span>
            <span className="ml-2 opacity-90">respuestas correctas</span>
          </div>
        </div>

        {/* Practice Activity */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl mb-6 border border-purple-100 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">🎯 Práctica de Identificación</h2>

          {/* Current Sign */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-3xl p-8 mb-6 text-center border-2 border-purple-200">
            <p className="text-sm font-semibold text-slate-600 mb-4">¿Qué tipo de señal es esta?</p>
            <div className={`inline-flex items-center justify-center w-36 h-36 ${currentSign.color} rounded-3xl text-7xl shadow-2xl mb-4 hover:scale-110 transition-all`}>
              {currentSign.emoji}
            </div>
            <p className="text-2xl font-bold text-slate-800">{currentSign.name}</p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => !showResult && handleSelectOption(option.id)}
                disabled={showResult}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  showResult && selectedSign === option.id
                    ? isCorrect
                      ? 'border-green-500 bg-green-50 shadow-xl scale-105'
                      : 'border-red-500 bg-red-50 shadow-xl'
                    : selectedSign === option.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50'
                } ${showResult ? 'cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}`}
              >
                <div className="flex flex-col items-center gap-3">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${option.gradient} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                    {option.label[0]}
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{option.label}</h3>
                  <p className="text-xs text-slate-600">{option.description}</p>
                  {showResult && selectedSign === option.id && (
                    <div className="mt-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-10 h-10 text-green-600" />
                      ) : (
                        <XCircle className="w-10 h-10 text-red-600" />
                      )}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {showResult && (
            <div className={`mt-6 p-5 rounded-2xl text-center shadow-lg ${isCorrect ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400' : 'bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400'}`}>
              <p className={`text-xl font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '✅ ¡Correcto! +50 puntos 🎉' : '❌ Incorrecto. ¡Sigue practicando! 💪'}
              </p>
            </div>
          )}
        </div>

        {/* Reference Guide */}
        <div className="bg-white rounded-3xl p-6 shadow-2xl border border-blue-100 animate-fade-in">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">📚 Guía Interactiva de Señales</h2>
          <p className="text-slate-600 mb-6">Pulsa cualquier señal para ver información detallada</p>

          <div className="space-y-6">
            {['preventiva', 'reglamentaria', 'informativa'].map((category) => {
              const categoryData = options.find(o => o.id === category)!;
              return (
                <div key={category}>
                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryData.gradient} flex items-center justify-center text-white shadow-lg`}>
                      {categoryData.label[0]}
                    </div>
                    <span className={
                      category === 'preventiva' ? 'text-yellow-600' :
                      category === 'reglamentaria' ? 'text-red-600' : 'text-blue-600'
                    }>{categoryData.label}</span>
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {getSignsByCategory(category).map((sign) => (
                      <button
                        key={sign.id}
                        onClick={() => handleSignClick(sign)}
                        className={`group p-4 rounded-2xl border-2 transition-all hover:scale-110 hover:shadow-2xl ${
                          category === 'preventiva' ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 hover:border-yellow-500' :
                          category === 'reglamentaria' ? 'border-red-300 bg-gradient-to-br from-red-50 to-pink-50 hover:border-red-500' :
                          'border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 hover:border-blue-500'
                        } text-center relative`}
                      >
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Info className="w-4 h-4 text-slate-600" />
                        </div>
                        <div className="text-4xl mb-2">{sign.emoji}</div>
                        <p className="text-xs font-semibold text-slate-700">{sign.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sign Detail Modal */}
      {signDetailModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative">
            <button
              onClick={() => setSignDetailModal(null)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className={`inline-flex items-center justify-center w-28 h-28 ${signDetailModal.color} rounded-3xl text-6xl shadow-2xl mb-4`}>
                {signDetailModal.emoji}
              </div>
              <h3 className="text-3xl font-bold text-slate-800 mb-2">{signDetailModal.name}</h3>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                signDetailModal.type === 'preventiva' ? 'bg-yellow-100 text-yellow-700' :
                signDetailModal.type === 'reglamentaria' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {signDetailModal.type.charAt(0).toUpperCase() + signDetailModal.type.slice(1)}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4">
                <h4 className="font-bold text-slate-700 mb-2">📋 Descripción:</h4>
                <p className="text-slate-600">{signDetailModal.description}</p>
              </div>

              <div className="bg-orange-50 rounded-2xl p-4 border-2 border-orange-200">
                <h4 className="font-bold text-orange-700 mb-2">⚠️ Importancia:</h4>
                <p className="text-slate-700">{signDetailModal.importance}</p>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4">
                <h4 className="font-bold text-blue-700 mb-2">📍 Cuándo la verás:</h4>
                <p className="text-slate-600">{signDetailModal.whenToUse}</p>
              </div>
            </div>

            <button
              onClick={() => setSignDetailModal(null)}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
