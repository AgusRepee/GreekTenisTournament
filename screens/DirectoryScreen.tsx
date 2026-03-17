import React, { useMemo, useState } from 'react';
import { Flame, Calendar, CalendarCheck } from 'lucide-react';
import {
  getTournamentsByStatus,
  getTournamentsByLeague,
  LEAGUES,
  categoryToLeague,
  isTournamentCurrent,
  type LeagueNum,
  type Tournament,
} from '../src/lib/mockData';
import { getLeagueColor } from '../src/lib/leagueColors';
import { LeagueBadge } from '../components/LeagueBadge';
import { UpcomingTournamentModal } from '../components/UpcomingTournamentModal';

const pelotaImg = (() => {
  try {
    return new URL('../img/pelota.png', import.meta.url).href;
  } catch {
    return '';
  }
})();

interface DirectoryScreenProps {
  setScreen: (screen: string) => void;
  setSelectedTournamentId?: (id: string | null) => void;
}


const LEAGUES_LIST: LeagueNum[] = [1, 2, 3, 4, 5];

interface TournamentCardProps {
  key?: React.Key;
  tournament: Tournament;
  onVerTorneo: (t: Tournament) => void;
  /** When provided, upcoming card shows "Inscribirse" that opens this (modal). */
  onInscribirse?: (t: Tournament) => void;
}

function TournamentCard({ tournament, onVerTorneo, onInscribirse }: TournamentCardProps) {
  const leagueNum = tournament.league ?? categoryToLeague(tournament.category);
  const leagueColor = getLeagueColor(leagueNum);
  const isCurrent = isTournamentCurrent(tournament);
  const isUpcoming = !isCurrent;

  if (isUpcoming) {
    return (
      <div className="flex flex-col rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
        <div className="p-5 flex flex-col flex-1 gap-3 space-y-3">
          <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            Todas las categorías
          </span>
          <h3 className="text-[#111318] dark:text-white text-lg font-bold leading-tight">
            {tournament.name}
          </h3>
          <p className="text-sm text-[#616f89] dark:text-gray-400 flex items-center gap-1">
            <Calendar className="w-4 h-4 shrink-0" />
            Inicio: {new Date(tournament.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <p className="text-sm text-[#616f89] dark:text-gray-400 flex items-center gap-1">
            <CalendarCheck className="w-4 h-4 shrink-0" />
            Fin: {new Date(tournament.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
          <div>
            <p className="text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mb-2">Categorías</p>
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
              type="button"
              onClick={() => onVerTorneo(tournament)}
              className="flex-1 flex items-center justify-center rounded-xl py-3 px-4 border-2 border-gray-300 dark:border-gray-600 text-[#111318] dark:text-white text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Ver torneo
            </button>
            {onInscribirse && (
              <button
                type="button"
                onClick={() => onInscribirse(tournament)}
                className="flex-1 flex items-center justify-center rounded-xl py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors shadow-md"
              >
                Inscribirse
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-900">
      <div className={`h-1 rounded-t-xl shrink-0 ${leagueColor.topBar}`} aria-hidden />
      <div className="p-5 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-2">
          <LeagueBadge league={leagueNum} />
          <div className="flex items-center gap-1.5">
            {pelotaImg && (
              <img src={pelotaImg} alt="" className="w-5 h-5 object-contain shrink-0" width={20} height={20} aria-hidden />
            )}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-500 text-white shadow-sm">
              <Flame className="w-4 h-4" />
              En curso
            </span>
          </div>
        </div>
        <h3 className="text-[#111318] dark:text-white text-lg font-bold leading-tight mt-1">
          {tournament.name}
        </h3>
        <p className="text-sm text-[#616f89] dark:text-gray-400 flex items-center gap-1">
          <Calendar className="w-4 h-4 shrink-0" />
          Inicio: {new Date(tournament.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <p className="text-sm text-[#616f89] dark:text-gray-400 flex items-center gap-1">
          <CalendarCheck className="w-4 h-4 shrink-0" />
          Fin: {new Date(tournament.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
        <div className="mt-auto pt-4">
          <button
            type="button"
            onClick={() => onVerTorneo(tournament)}
            className="w-full flex items-center justify-center rounded-xl py-3 px-4 bg-primary hover:bg-primary-hover text-white text-sm font-bold transition-colors shadow-md hover:shadow-lg"
          >
            Ver torneo
          </button>
        </div>
      </div>
    </div>
  );
}

export const DirectoryScreen: React.FC<DirectoryScreenProps> = ({ setScreen, setSelectedTournamentId }) => {
  const [selectedLeague, setSelectedLeague] = useState<LeagueNum | 'all'>('all');
  const [modalTournament, setModalTournament] = useState<Tournament | null>(null);

  const leagueTournaments = useMemo(() => {
    if (selectedLeague === 'all') {
      return getTournamentsByStatus('upcoming');
    }
    return getTournamentsByLeague(selectedLeague, 'upcoming');
  }, [selectedLeague]);

  const currentTournaments = useMemo(
    () => leagueTournaments.filter(isTournamentCurrent),
    [leagueTournaments]
  );

  /** Upcoming tournaments are general (all leagues); always show all. */
  const upcomingTournaments = useMemo(
    () => getTournamentsByStatus('upcoming').filter((t) => !isTournamentCurrent(t)),
    []
  );

  const handleVerTorneo = (t: Tournament) => {
    setSelectedTournamentId?.(t.id);
    setScreen('tournament_detail');
  };

  const handleInscribirse = (t: Tournament) => {
    setModalTournament(t);
  };

  const handleModalVerInfo = (tournamentId: string) => {
    setSelectedTournamentId?.(tournamentId);
    setScreen('tournament_detail');
  };

  const leagueTitle =
    selectedLeague === 'all'
      ? 'Torneos'
      : `Torneos - Liga ${selectedLeague}`;

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
      {/* League selector */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <span className="text-sm font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mr-1">
          Liga:
        </span>
        <button
          type="button"
          onClick={() => setSelectedLeague('all')}
          className={`px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-md ${
            selectedLeague === 'all'
              ? 'bg-primary text-white border-2 border-primary shadow-primary/25'
              : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-[#111318] dark:text-white hover:border-primary hover:shadow-lg'
          }`}
        >
          Todas
        </button>
        {LEAGUES.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setSelectedLeague(num)}
            className={`px-6 py-3 rounded-xl text-base font-semibold transition-all shadow-md ${
              selectedLeague === num
                ? 'bg-primary text-white border-2 border-primary shadow-primary/25'
                : 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-[#111318] dark:text-white hover:border-primary hover:shadow-lg'
            }`}
          >
            Liga {num}
          </button>
        ))}
      </div>

      {/* Page header: title + subtitle (no logo) */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-[#111318] dark:text-white tracking-tight">
          Torneos
        </h1>
        <p className="text-[#616f89] dark:text-gray-400 text-base">Greek Tennis Series</p>
      </div>

      {/* Section 1: Torneos actuales */}
      <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-6">
          Torneos actuales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {currentTournaments.length === 0 ? (
            <p className="col-span-full text-[#616f89] dark:text-gray-400 text-sm py-4">
              No hay torneos en curso para esta liga.
            </p>
          ) : (
            currentTournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} onVerTorneo={handleVerTorneo} />
            ))
          )}
        </div>
      </section>

      {/* Section 2: Próximos torneos */}
      <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-6">
          Próximos torneos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {upcomingTournaments.length === 0 ? (
            <p className="col-span-full text-[#616f89] dark:text-gray-400 text-sm py-4">
              No hay próximos torneos.
            </p>
          ) : (
            upcomingTournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} onVerTorneo={handleVerTorneo} onInscribirse={handleInscribirse} />
            ))
          )}
        </div>
      </section>

      <UpcomingTournamentModal
        tournament={modalTournament}
        onClose={() => setModalTournament(null)}
        onVerInfo={handleModalVerInfo}
      />
    </main>
  );
};
