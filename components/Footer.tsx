import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#1a202c] border-t border-gray-300 dark:border-gray-700 py-8 px-10 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-[#616f89] dark:text-gray-400 text-sm">© 2024. Todos los derechos reservados.</p>
          <p className="text-xs text-[#616f89] dark:text-gray-500 mt-1">Series de torneos oficiales</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-[#616f89] dark:text-gray-400 hover:text-primary text-sm transition-colors">Política de privacidad</a>
          <a href="#" className="text-[#616f89] dark:text-gray-400 hover:text-primary text-sm transition-colors">Términos de uso</a>
          <a href="#" className="text-[#616f89] dark:text-gray-400 hover:text-primary text-sm transition-colors">Contacto</a>
        </div>
      </div>
    </footer>
  );
};