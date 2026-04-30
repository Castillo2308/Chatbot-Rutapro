import { Outlet, Link, useLocation } from 'react-router';
import { Home, BookOpen, MessageCircle, Map, Brain } from 'lucide-react';
import logo from '@/imports/logo.png';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Inicio' },
    { path: '/learning', icon: BookOpen, label: 'Aprender' },
    { path: '/chatbot', icon: MessageCircle, label: 'RutaPro' },
    { path: '/signs', icon: Map, label: 'Señales' },
    { path: '/quiz', icon: Brain, label: 'Quiz' },
  ];

  return (
    <div className="size-full bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Top Header with Logo */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/50 px-4 py-3 shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <img 
            src={logo} 
            alt="RutaPro Logo" 
            className="h-14 object-contain drop-shadow-lg hover:scale-105 transition-transform"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-20">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg border-t border-slate-200/50 px-2 py-3 fixed bottom-0 left-0 right-0 shadow-2xl">
        <div className="max-w-md mx-auto flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1.5 py-2 px-4 rounded-2xl transition-all ${
                  isActive
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg scale-110'
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100 hover:scale-105'
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
