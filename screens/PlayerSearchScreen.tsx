import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { searchPlayersWithPosition, categoryToLeague } from '../src/lib/mockData';
import { LeagueBadge } from '../components/LeagueBadge';

interface PlayerSearchScreenProps {
  setScreen: (screen: string) => void;
  setSelectedPlayerId: (id: string | null) => void;
}

export const PlayerSearchScreen: React.FC<PlayerSearchScreenProps> = ({ setScreen, setSelectedPlayerId }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => searchPlayersWithPosition(query), [query]);

  const handlePlayerClick = (playerId: string) => {
    setSelectedPlayerId(playerId);
    setScreen('profile');
  };

  return (
    <main className="flex-1 w-full max-w-[800px] mx-auto px-4 md:px-10 py-8">
      <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8">
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Buscar jugador</h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base mt-1">Introduce el nombre para ver categoría, posición y puntos.</p>
          </div>
          <div className="relative flex items-center h-12 w-full rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 overflow-hidden shadow-sm transition-all">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-[#616f89]">
            <Search className="w-6 h-6" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-full bg-transparent border-none text-[#111318] dark:text-white placeholder:text-[#616f89] pl-12 pr-4 text-base outline-none"
            placeholder="Escribe el nombre del jugador..."
          />
        </div>
        <div className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-[#616f89] dark:text-gray-400 text-sm">
              Escribe al menos un carácter para buscar.
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-[#616f89] dark:text-gray-400 text-sm">
              No se encontraron jugadores con &quot;{query}&quot;.
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {results.map((player) => (
                <li
                  key={player.id}
                  onClick={() => handlePlayerClick(player.id)}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer odd:bg-white even:bg-gray-50/50 dark:odd:bg-gray-900 dark:even:bg-gray-800/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                      {player.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-[#111318] dark:text-white">{player.name}</p>
                      <LeagueBadge league={categoryToLeague(player.category)} className="mt-1" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">Pos. {player.position}</p>
                    <p className="text-xs text-[#616f89] dark:text-gray-400">{player.points} pts</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </section>
    </main>
  );
};
