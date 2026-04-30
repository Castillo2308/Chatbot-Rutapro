import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import logo from '@/imports/logo.png';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '👋 ¡Hola! Soy RutaPro, y te voy a ayudar a aprender a manejar de forma fácil y segura. 🚗🏁',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    { text: 'Cómo iniciar', icon: '🚀', gradient: 'from-blue-400 to-cyan-400' },
    { text: 'Reglas de tránsito', icon: '🚦', gradient: 'from-green-400 to-emerald-400' },
    { text: 'Consejos de manejo', icon: '💡', gradient: 'from-purple-400 to-pink-400' },
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const handleQuickAction = (action: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: action,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(action),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1500);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes('cómo iniciar') || lowerInput.includes('como iniciar')) {
      return 'Para comenzar a aprender a manejar, te recomiendo:\n\n1️⃣ Familiarizarte con los controles del vehículo\n2️⃣ Ajustar el asiento y espejos correctamente\n3️⃣ Aprender las señales de tránsito básicas\n4️⃣ Practicar en un lugar seguro y tranquilo\n\n¿Te gustaría saber más sobre alguno de estos puntos? 😊';
    }

    if (lowerInput.includes('reglas') || lowerInput.includes('tránsito')) {
      return 'Las reglas de tránsito son fundamentales para conducir de manera segura:\n\n🔴 Respetar los límites de velocidad\n🛑 Detenerse completamente en señales de ALTO\n🤝 Ceder el paso cuando corresponde\n🔒 Usar cinturón de seguridad siempre\n📵 No usar el celular mientras manejas\n\n¿Querés que te explique alguna regla en particular?';
    }

    if (lowerInput.includes('consejos') || lowerInput.includes('manejo')) {
      return 'Algunos consejos útiles para conducir:\n\n✅ Mantené ambas manos en el volante\n👀 Mirá siempre hacia adelante y usa los espejos\n📏 Mantené distancia de seguridad\n🧠 Anticipate a las acciones de otros conductores\n💪 Practicá con paciencia y sin presión\n\n¡Recordá que la práctica hace al maestro! 🌟';
    }

    return 'Entiendo tu pregunta. Como asistente de aprendizaje de manejo, puedo ayudarte con:\n\n🚀 Cómo iniciar tu práctica\n🚦 Reglas de tránsito\n💡 Consejos de manejo seguro\n🚸 Señales de tránsito\n📝 Preparación para el examen\n\n¿Sobre qué te gustaría aprender hoy?';
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e40af] to-[#3b82f6] text-white px-4 py-3 shadow-xl">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img
              src={logo}
              alt="RutaPro"
              className="h-10 object-contain drop-shadow-lg"
            />
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                {message.sender === 'bot' && (
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-xl">🚗</span>
                  </div>
                )}
                <div className="flex flex-col">
                  {message.sender === 'bot' && (
                    <div className="text-xs font-medium text-slate-600 mb-1.5 px-1">
                      <span className="text-blue-600">RutaPro</span> · {message.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                  <div
                    className={`px-5 py-3.5 rounded-2xl whitespace-pre-line shadow-md ${
                      message.sender === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md'
                        : 'bg-white text-slate-800 rounded-bl-md border border-slate-100'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-3 max-w-[85%]">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <span className="text-xl">🚗</span>
                </div>
                <div className="bg-white px-5 py-3.5 rounded-2xl rounded-bl-md shadow-md border border-slate-100">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.length === 1 && !isTyping && (
            <div className="grid grid-cols-1 gap-3 max-w-md animate-fade-in">
              {quickActions.map((action) => (
                <button
                  key={action.text}
                  onClick={() => handleQuickAction(action.text)}
                  className={`group px-5 py-4 rounded-2xl bg-gradient-to-r ${action.gradient} text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 px-4 py-4 shadow-2xl">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end gap-3 bg-slate-100 rounded-3xl px-5 py-3 shadow-inner">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribí tu mensaje..."
              className="flex-1 bg-transparent border-none outline-none resize-none py-1 max-h-32 text-slate-800 placeholder:text-slate-400"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-full hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all hover:scale-110 active:scale-95"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center mt-3 text-xs text-slate-500 flex items-center justify-center gap-2">
            Powered by
            <img
              src={logo}
              alt="RutaPro"
              className="h-4 object-contain inline drop-shadow"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
