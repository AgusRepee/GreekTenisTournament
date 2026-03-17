import React, { useState } from 'react';
import { Search, Circle } from 'lucide-react';

interface NavbarProps {
  currentScreen: string;
  setScreen: (screen: string) => void;
}

const logoImg = (() => {
  try {
    return new URL('../img/logo.png', import.meta.url).href;
  } catch {
    return '';
  }
})();

/** Hamburger icon (three lines) */
function HamburgerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

/** Close (X) icon */
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export const Navbar: React.FC<NavbarProps> = ({ currentScreen, setScreen }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Inicio' },
    { id: 'directory', label: 'Torneos' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'players', label: 'Jugadores' },
  ];

  const handleNavClick = (screenId: string) => {
    setScreen(screenId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="relative bg-white dark:bg-[#1a202c] border-b border-gray-300 dark:border-gray-700 px-4 md:px-10 py-3 sticky top-0 z-50 shadow-sm">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button
            onClick={() => setScreen('home')}
            className="flex items-center gap-3 text-[#111318] dark:text-white hover:opacity-90 transition-opacity"
          >
            {logoImg ? (
              <img src={logoImg} alt="GREEK TENNIS" className="h-9 w-auto max-w-[140px] object-contain" />
            ) : (
              <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg text-primary">
                <Circle className="w-6 h-6 fill-primary" aria-hidden />
              </div>
            )}
            <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-primary hidden sm:block">GREEK TENNIS</h2>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-9">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setScreen(link.id)}
                className={`text-sm font-medium transition-colors ${
                  currentScreen === link.id
                    ? 'text-primary'
                    : 'text-[#616f89] dark:text-gray-400 hover:text-primary'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop: search + Buscar jugador */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <div className="hidden lg:flex w-64 items-center">
            <label className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#616f89]">
                <Search className="w-5 h-5" />
              </span>
              <input
                className="w-full bg-[#f0f2f4] dark:bg-gray-800 border-none rounded-lg py-2 pl-10 pr-4 text-sm text-[#111318] dark:text-white placeholder:text-[#616f89] focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-700 transition-all outline-none"
                placeholder="Buscar jugador..."
                type="text"
              />
            </label>
          </div>
          <button
            onClick={() => setScreen('players')}
            className="flex items-center justify-center rounded-lg h-9 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors"
          >
            Buscar jugador
          </button>
        </div>

        {/* Mobile: hamburger button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg text-[#111318] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? (
            <CloseIcon className="w-6 h-6" />
          ) : (
            <HamburgerIcon className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden absolute left-0 right-0 top-full mt-0 mx-4 rounded-b-lg border border-t-0 border-[#e5e7eb] dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg transition duration-200"
          role="dialog"
          aria-label="Menú de navegación"
        >
          <nav className="flex flex-col space-y-1 p-4">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  currentScreen === link.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#111318] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="border-t border-[#e5e7eb] dark:border-gray-700 pt-3 mt-2">
              <button
                onClick={() => handleNavClick('players')}
                className="w-full flex items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors"
              >
                Buscar jugador
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};