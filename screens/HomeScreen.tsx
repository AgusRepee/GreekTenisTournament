import React, { useMemo, useState } from 'react';
import { MessageCircle, Calendar, CalendarCheck, Trophy, Star, Flame, Circle } from 'lucide-react';
import {
  getTournamentsByStatus,
  getUpcomingTournamentsForHome,
  featuredMatches,
  upcomingImportantMatches,
  getRankings,
  CATEGORIES,
  isTournamentCurrent,
  type Tournament,
} from '../src/lib/mockData';
import type { LeagueNum } from '../src/lib/mockData';
import { whatsAppUrl, whatsAppMessages } from '../src/lib/whatsapp';
import { UpcomingTournamentModal } from '../components/UpcomingTournamentModal';

const allUpcomingMatchesForHome = [...featuredMatches, ...upcomingImportantMatches];

/** Icon + color by match type for Partidos importantes */
function getMatchTypeIcon(label: string): { Icon: React.ComponentType<{ className?: string; size?: number }>; iconClass: string } {
  const lower = label.toLowerCase();
  if (lower.includes('final') && !lower.includes('cuartos')) return { Icon: Trophy, iconClass: 'text-yellow-400' };
  if (lower.includes('semifinal')) return { Icon: Star, iconClass: 'text-blue-400' };
  if (lower.includes('cuartos')) return { Icon: Circle, iconClass: 'text-green-400' };
  if (lower.includes('destacado')) return { Icon: Flame, iconClass: 'text-orange-400' };
  return { Icon: Circle, iconClass: 'text-gray-400' };
}

function isFinalMatch(label: string): boolean {
  const lower = label.toLowerCase();
  return lower.includes('final') && !lower.includes('cuartos');
}

function isDestacadoMatch(label: string): boolean {
  return label.toLowerCase().includes('partido destacado') || label.toLowerCase().includes('destacado del fin');
}

/** Map category string to league number for badge */
function categoryToLeagueNum(category: string): LeagueNum {
  const map: Record<string, LeagueNum> = {
    Primera: 1, Segunda: 2, Tercera: 3, Cuarta: 4, 'Quinta A': 5, 'Quinta B': 5,
  };
  return map[category] ?? 1;
}

/** Compact league badge: rounded-md px-2 py-1 text-xs font-semibold + league colors */
const LEAGUE_BADGE_CLASSES: Record<LeagueNum, string> = {
  1: 'rounded-md px-2 py-1 text-xs font-semibold bg-red-50 text-red-600 border border-red-500 dark:bg-red-900/30 dark:text-red-300 dark:border-red-500',
  2: 'rounded-md px-2 py-1 text-xs font-semibold bg-orange-50 text-orange-600 border border-orange-400 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-400',
  3: 'rounded-md px-2 py-1 text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-400 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-400',
  4: 'rounded-md px-2 py-1 text-xs font-semibold bg-green-50 text-green-600 border border-green-400 dark:bg-green-900/30 dark:text-green-300 dark:border-green-400',
  5: 'rounded-md px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-400 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500',
};

/** Base tournament name for display (e.g. "Novak Djokovic - Liga 1" → "Novak Djokovic") */
function getCurrentTournamentDisplayName(name: string): string {
  const match = name.match(/^(.+?)\s*-\s*Liga\s*\d+$/i);
  return match ? match[1].trim() : name;
}

const heroBgUrl = (() => {
  try {
    return new URL('../img/fondo.png', import.meta.url).href;
  } catch {
    return '';
  }
})();

const pelotaImg = (() => {
  try {
    return new URL('../img/pelota.png', import.meta.url).href;
  } catch {
    return '';
  }
})();

interface HomeScreenProps {
  setScreen: (screen: string) => void;
  setSelectedTournamentId?: (id: string | null) => void;
}

const LEAGUES_LIST = [1, 2, 3, 4, 5] as const;

export const HomeScreen: React.FC<HomeScreenProps> = ({ setScreen, setSelectedTournamentId }) => {
  const [inscriptionModalTournament, setInscriptionModalTournament] = useState<Tournament | null>(null);

  const currentTournament = useMemo(() => {
    const upcoming = getTournamentsByStatus('upcoming');
    return upcoming.filter(isTournamentCurrent)[0] ?? null;
  }, []);

  const handleModalVerInfo = (tournamentId: string) => {
    setSelectedTournamentId?.(tournamentId);
    setScreen('tournament_detail');
  };

  return (
    <div className="layout-container flex grow flex-col">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 lg:px-20 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-10">
            {/* Current tournament hero */}
            <section className="rounded-xl overflow-hidden shadow-sm transition duration-200">
              <div
                className="flex min-h-[380px] md:min-h-[460px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl overflow-hidden shadow-lg relative"
                style={{
                  backgroundImage: heroBgUrl
                    ? `linear-gradient(to bottom, rgba(13, 59, 138, 0.5) 0%, rgba(0, 0, 0, 0.8) 100%), url("${heroBgUrl}")`
                    : 'linear-gradient(135deg, #0d3b8a 0%, #1a4a9e 60%, #0d3b8a 100%)',
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 pb-10 md:pb-12">
                  <div className="relative z-10 flex flex-col gap-3 max-w-2xl">
                    {currentTournament ? (
                      <>
                        <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500 text-white text-sm font-semibold shadow-md">
                          En curso
                        </span>
                        <h1 className="text-white text-3xl md:text-5xl font-black leading-tight tracking-tight drop-shadow-sm">
                          Torneo en curso: {getCurrentTournamentDisplayName(currentTournament.name)}
                        </h1>
                        <p className="text-gray-200 text-base md:text-lg leading-relaxed">
                          El torneo se está disputando en distintas ligas.
                          <br />
                          Consultá tu liga para ver partidos y resultados.
                        </p>
                        <button
                          onClick={() => setScreen('directory')}
                          className="mt-2 w-fit flex items-center justify-center rounded-lg h-12 px-6 bg-white text-primary hover:bg-gray-100 font-bold text-base transition-colors shadow-lg"
                        >
                          Ver torneos
                        </button>
                      </>
                    ) : (
                      <>
                        <h1 className="text-white text-3xl md:text-5xl font-black leading-tight">
                          Torneos del club
                        </h1>
                        <p className="text-gray-200 text-base">Consultá el calendario de torneos.</p>
                        <button
                          onClick={() => setScreen('directory')}
                          className="mt-2 w-fit flex items-center justify-center rounded-lg h-12 px-6 bg-white text-primary hover:bg-gray-100 font-bold text-base transition-colors shadow-lg"
                        >
                          Ver torneos
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Próximos torneos — abiertos a todas las ligas */}
            <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 mb-10">
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-6">Próximos torneos</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {getUpcomingTournamentsForHome().map((t) => (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-5 shadow-sm hover:shadow-md transition flex flex-col space-y-3"
                  >
                    <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      Todas las categorías
                    </span>
                    <h3 className="text-[#111318] dark:text-white font-bold text-lg leading-tight">{t.name}</h3>
                    <p className="text-sm text-[#616f89] dark:text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4 shrink-0" />
                      Inicio: {new Date(t.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-sm text-[#616f89] dark:text-gray-400 flex items-center gap-1">
                      <CalendarCheck className="w-4 h-4 shrink-0" />
                      Fin: {new Date(t.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <div>
                      <p className="text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mb-1.5">Categorías</p>
                      <div className="flex flex-wrap gap-1.5">
                        {LEAGUES_LIST.map((n) => (
                          <span key={n} className="inline-flex px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                            Liga {n}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-auto pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTournamentId?.(t.id);
                          setScreen('tournament_detail');
                        }}
                        className="flex-1 flex items-center justify-center rounded-lg h-10 border-2 border-gray-300 dark:border-gray-600 text-[#111318] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        Ver torneo
                      </button>
                      <button
                        type="button"
                        onClick={() => setInscriptionModalTournament(t)}
                        className="flex-1 flex items-center justify-center rounded-lg h-10 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors"
                      >
                        Inscribirse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar: Rankings + Clases */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6">
              {/* Rankings por categoría */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-sm border border-gray-300 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#111318] dark:text-white text-lg font-bold">Rankings</h3>
                <button onClick={() => setScreen('rankings')} className="text-primary text-sm font-bold hover:underline">
                  Ver todos
                </button>
              </div>
              <div className="space-y-4">
                {CATEGORIES.slice(0, 3).map((cat) => {
                  const rows = getRankings(cat).slice(0, 2);
                  return (
                    <div key={cat}>
                      <p className="text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase mb-1">{cat}</p>
                      {rows.map((r) => (
                        <div
                          key={r.playerId}
                          className="flex items-center justify-between py-1.5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded px-1 -mx-1"
                          onClick={() => setScreen('rankings')}
                        >
                          <span className="text-sm font-medium text-[#111318] dark:text-white">{r.player.name}</span>
                          <span className="text-xs font-bold text-[#616f89] dark:text-gray-400">{r.points} pts</span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
            </section>

            {/* ¿Querés clases? */}
            <div
              className="bg-gradient-to-br from-primary to-primary-hover rounded-2xl p-8 text-center text-white shadow-lg border border-gray-300 dark:border-gray-700 flex flex-col gap-4"
            >
              <div className="flex justify-center">
                {pelotaImg && (
                  <img src={pelotaImg} alt="" className="w-12 h-12 object-contain" width={48} height={48} aria-hidden />
                )}
              </div>
              <h3 className="text-xl font-bold leading-tight">¿Querés clases?</h3>
              <p className="text-sm text-blue-100 leading-relaxed">
                Sumate a las clases de tenis del club. Contactanos por WhatsApp y reservá tu lugar.
              </p>
              <a
                href={whatsAppUrl(whatsAppMessages.tennisClasses())}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-lg h-12 bg-white/20 hover:bg-white/30 text-white text-base font-bold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Contactar
              </a>
            </div>
          </div>
        </div>

        {/* Partidos importantes — estilo ATP/ESPN */}
        <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 mt-10">
          <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-6">Partidos importantes</h2>
          <h3 className="text-[#111318] dark:text-white text-lg font-semibold mb-4">Próximos partidos</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allUpcomingMatchesForHome.map((m) => {
              const { Icon, iconClass } = getMatchTypeIcon(m.label);
              const isFinal = isFinalMatch(m.label);
              const isDestacado = isDestacadoMatch(m.label);
              const leagueNum = categoryToLeagueNum(m.category);
              const dateDisplay = m.date ?? m.dateTime;
              const timeDisplay = m.time ? ` · ${m.time}` : '';
              return (
                <div
                  key={m.id}
                  className={`rounded-xl border p-4 shadow-sm flex flex-col gap-2 transition-all hover:shadow-lg hover:border-blue-500 ${
                    isFinal
                      ? 'border-2 border-yellow-400 bg-gradient-to-r from-amber-50 to-yellow-100/80 dark:from-slate-900 dark:to-yellow-900/20'
                      : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-700'
                  }`}
                >
                  {/* TOP ROW: icon + title + league badge (+ destacado badge) */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-2 shrink-0 ${iconClass}`}>
                      <Icon className="w-5 h-5" aria-hidden />
                    </span>
                    <span className="text-[#111318] dark:text-white font-bold text-base leading-tight min-w-0">
                      {m.label}
                    </span>
                    <span className={`shrink-0 ${LEAGUE_BADGE_CLASSES[leagueNum]}`}>
                      Liga {leagueNum}
                    </span>
                    {isDestacado && (
                      <span className="rounded-md px-2 py-1 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-400/40 shrink-0">
                        DESTACADO
                      </span>
                    )}
                  </div>
                  {/* SECOND ROW: players */}
                  <p className="text-sm text-[#616f89] dark:text-gray-400 font-medium">
                    {m.playerA} vs {m.playerB}
                  </p>
                  {/* THIRD ROW: date + time */}
                  <div className="mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-[#616f89] dark:text-gray-400">
                      {dateDisplay}{timeDisplay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <UpcomingTournamentModal
        tournament={inscriptionModalTournament ? { id: inscriptionModalTournament.id, name: inscriptionModalTournament.name, slotsTotal: inscriptionModalTournament.slotsTotal, slotsTaken: inscriptionModalTournament.slotsTaken } : null}
        onClose={() => setInscriptionModalTournament(null)}
        onVerInfo={handleModalVerInfo}
      />
    </div>
  );
};
