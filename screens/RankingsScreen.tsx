import React, { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { LEAGUES_RANKING, getRankingsByLeague, type LeagueNum, type RankingRow } from '../src/lib/mockData';
import { LeagueBadge } from '../components/LeagueBadge';

/** Bandera de nacionalidad: imagen (Argentina = arg.png) o emoji. */
function getFlagImageUrl(filename: string): string {
  try {
    return new URL(`../img/${filename}`, import.meta.url).href;
  } catch {
    return '';
  }
}
const FLAG_IMAGE_BY_NATIONALITY: Record<string, string> = {
  Argentina: 'arg.png',
};
const FLAG_EMOJI_BY_NATIONALITY: Record<string, string> = {
  Uruguay: '🇺🇾',
  Chile: '🇨🇱',
  Paraguay: '🇵🇾',
  Brasil: '🇧🇷',
  España: '🇪🇸',
};
function getFlagDisplay(nationality: string | undefined): { image?: string; emoji?: string } {
  if (!nationality) return { emoji: '🏳️' };
  const image = FLAG_IMAGE_BY_NATIONALITY[nationality];
  if (image) return { image };
  return { emoji: FLAG_EMOJI_BY_NATIONALITY[nationality] ?? '🏳️' };
}

interface RankingsScreenProps {
  setScreen: (screen: string) => void;
  setSelectedPlayerId?: (id: string | null) => void;
}

export const RankingsScreen: React.FC<RankingsScreenProps> = ({ setScreen, setSelectedPlayerId }) => {
  const [leagueFilter, setLeagueFilter] = useState<LeagueNum | 'all'>('all');

  const rows = useMemo(() => getRankingsByLeague(leagueFilter), [leagueFilter]);

  const handleRowClick = (row: RankingRow) => {
    setSelectedPlayerId?.(row.playerId);
    setScreen('profile');
  };

  return (
    <div className="px-4 md:px-10 lg:px-40 flex justify-center py-8 flex-grow">
      <div className="w-full max-w-[1024px] flex flex-col gap-8">
        <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black leading-tight tracking-[-0.033em] text-[#111318] dark:text-white">Rankings</h1>
              <p className="text-[#616f89] dark:text-[#9ca3af] text-base font-normal">Ranking global por puntos. Filtrá por liga para ver solo esa liga.</p>
            </div>
            <div className="border-b border-gray-300 dark:border-gray-700">
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-px">
                {(['all', ...LEAGUES_RANKING] as const).map((tab) => {
                  const label = tab === 'all' ? 'Todos' : `Liga ${tab}`;
                  const isActive = leagueFilter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setLeagueFilter(tab)}
                      className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-2 whitespace-nowrap transition-colors ${isActive ? 'border-b-primary text-[#111318] dark:text-white' : 'border-b-transparent text-[#616f89] dark:text-[#9ca3af] hover:text-primary'}`}
                    >
                      <p className="text-sm font-bold leading-normal">{label}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-300 dark:border-gray-700">
                    <th className="px-4 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider w-16 text-center">#</th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider w-20 text-center">Cambio</th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider w-20"></th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider w-14 text-center">Bandera</th>
                    <th className="px-4 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider min-w-[160px]">Jugador</th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider text-center w-16">Edad</th>
                    <th className="px-4 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider text-right">Puntos</th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider text-center w-24">Cambio pts</th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider text-center w-24">Torneos</th>
                    <th className="px-3 py-4 text-xs font-bold text-[#616f89] dark:text-[#9ca3af] uppercase tracking-wider hidden lg:table-cell text-center">Liga</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {rows.map((row, index) => {
                    const initial = row.player.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                    const rankChange = row.rankingChange ?? 0;
                    const pointsChange = row.pointsChange ?? 0;
                    const leagueNum = row.leagueNum ?? 1;
                    const isEven = index % 2 === 0;
                    return (
                      <tr
                        key={row.playerId}
                        onClick={() => handleRowClick(row)}
                        className={`group transition-colors cursor-pointer ${isEven ? 'bg-white dark:bg-gray-900' : 'bg-gray-50 dark:bg-gray-800/50'} hover:bg-gray-100 dark:hover:bg-gray-800`}
                      >
                        <td className="px-4 py-4 text-center align-middle">
                          {row.position <= 3 ? (
                            <div className={`inline-flex items-center justify-center size-10 rounded-full font-bold text-base ${
                              row.position === 1 ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                              row.position === 2 ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
                            }`}>
                              {row.position}
                            </div>
                          ) : (
                            <span className="text-[#616f89] dark:text-[#9ca3af] font-medium text-base">{row.position}</span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center align-middle">
                          {rankChange > 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-green-600 dark:text-green-400 font-medium text-sm">
                              <ChevronUp className="w-5 h-5 shrink-0" aria-hidden />
                              {rankChange}
                            </span>
                          ) : rankChange < 0 ? (
                            <span className="inline-flex items-center gap-0.5 text-red-500 dark:text-red-400 font-medium text-sm">
                              <ChevronDown className="w-5 h-5 shrink-0" aria-hidden />
                              {rankChange}
                            </span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          {row.player.profileImage ? (
                            <img
                              src={getFlagImageUrl(row.player.profileImage)}
                              alt=""
                              className="size-14 sm:size-16 rounded-full object-cover object-top shrink-0 ring-2 ring-gray-200 dark:ring-gray-600"
                            />
                          ) : (
                            <div className="relative size-14 sm:size-16 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0 ring-2 ring-gray-200 dark:ring-gray-600">
                              {initial}
                            </div>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center align-middle" title={row.player.nationality}>
                          {(() => {
                            const flag = getFlagDisplay(row.player.nationality);
                            return flag.image ? (
                              <img
                                src={getFlagImageUrl(flag.image)}
                                alt={row.player.nationality ?? 'Bandera'}
                                className="w-8 h-6 object-cover rounded border border-gray-200 dark:border-gray-600 inline-block"
                              />
                            ) : (
                              <span className="text-xl">{flag.emoji}</span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-4 align-middle">
                          <p className="font-bold text-[#111318] dark:text-white text-base">{row.player.name}</p>
                        </td>
                        <td className="px-3 py-4 text-center align-middle text-[#616f89] dark:text-[#9ca3af] text-base">
                          {row.age != null ? row.age : '—'}
                        </td>
                        <td className="px-4 py-4 text-right align-middle">
                          <span className="font-bold text-[#111318] dark:text-white text-base">{row.points.toLocaleString('es-AR')}</span>
                        </td>
                        <td className="px-3 py-4 text-center align-middle">
                          {pointsChange > 0 ? (
                            <span className="font-medium text-sm text-green-600 dark:text-green-400">+{pointsChange}</span>
                          ) : pointsChange < 0 ? (
                            <span className="font-medium text-sm text-red-500 dark:text-red-400">{pointsChange}</span>
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-3 py-4 text-center align-middle text-[#616f89] dark:text-[#9ca3af] text-base">
                          {row.tournamentsPlayed ?? row.matchesPlayed}
                        </td>
                        <td className="px-3 py-4 hidden lg:table-cell align-middle">
                          <div className="flex justify-center">
                            <LeagueBadge league={leagueNum} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
              <p className="text-sm text-[#616f89] dark:text-[#9ca3af]">
                Mostrando <span className="font-medium text-[#111318] dark:text-white">1-{rows.length}</span> de <span className="font-medium text-[#111318] dark:text-white">{rows.length}</span> jugadores
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
