import React from 'react';
import { MessageCircle } from 'lucide-react';
import { whatsAppUrl } from '../src/lib/whatsapp';

const SEDES = ['Carapachay'];

const SOCIAL_LINKS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, href: whatsAppUrl('Hola, quisiera más información.') },
];

interface FooterProps {
  setScreen?: (screen: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setScreen }) => {
  const handleNav = (screen: string) => {
    setScreen?.(screen);
  };

  return (
    <footer className="bg-white dark:bg-[#1a202c] border-t border-gray-300 dark:border-gray-700 mt-auto">
      {/* 4 columns */}
      <div className="max-w-[1440px] mx-auto py-10 px-4 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 text-center md:text-left">
          {/* 1. Brand */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h3 className="text-lg font-bold text-[#111318] dark:text-white">Greek Tennis</h3>
            <p className="text-sm text-[#616f89] dark:text-gray-400 leading-relaxed max-w-[260px] text-center md:text-left">
              Circuito amateur de tenis con torneos, rankings y estadísticas
            </p>
          </div>

          {/* 2. Sedes */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider">Sedes</h3>
            <ul className="space-y-1 text-sm text-[#616f89] dark:text-gray-400">
              {SEDES.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>

          {/* 3. Navigation */}
          <div className="flex flex-col gap-3 items-center md:items-start">
            <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider">Navegación</h3>
            <nav className="flex flex-col gap-2 items-center md:items-start">
              {setScreen ? (
                <>
                  <button type="button" onClick={() => handleNav('directory')} className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors">Torneos</button>
                  <button type="button" onClick={() => handleNav('rankings')} className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors">Ranking</button>
                  <button type="button" onClick={() => handleNav('players')} className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors">Jugadores</button>
                </>
              ) : (
                <>
                  <a href="#" className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors">Torneos</a>
                  <a href="#" className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors">Ranking</a>
                  <a href="#" className="text-sm text-[#616f89] dark:text-gray-400 hover:text-primary transition-colors">Jugadores</a>
                </>
              )}
            </nav>
          </div>

          {/* 4. Social */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider">Redes</h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {SOCIAL_LINKS.map(({ id, label, icon: Icon, href }) => (
                <a
                  key={id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center size-10 rounded-full bg-gray-200 dark:bg-gray-700 text-[#616f89] dark:text-gray-400 hover:bg-primary hover:text-white dark:hover:bg-primary transition-colors"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-300 dark:border-gray-700 py-4 px-4 md:px-8 lg:px-10">
        <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-center sm:text-left">
          <p className="text-xs text-[#616f89] dark:text-gray-500">
            © 2026 Greek Tennis – Todos los derechos reservados
          </p>
          <p className="text-xs text-[#616f89] dark:text-gray-500">
            Desarrollado por Agustin Repecka
          </p>
        </div>
      </div>
    </footer>
  );
};
