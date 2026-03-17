import React, { useMemo } from 'react';
import { Trophy, Medal, TrendingDown, Percent, Activity, TrendingUp, ArrowDown } from 'lucide-react';
import {
  getPlayerWithDisplay,
  getTournamentHistoryForPlayer,
  getRecentMatchesForPlayer,
  getPlayerById,
  formatTournamentDate,
  getPlayerRankingHistory,
  getPlayerPromotionHistory,
  categoryToLeague,
} from '../src/lib/mockData';
import { getLeagueColor } from '../src/lib/leagueColors';
import { LeagueBadge } from '../components/LeagueBadge';

function getProfileImageUrl(filename: string): string {
  try {
    return new URL(`../img/${filename}`, import.meta.url).href;
  } catch {
    return '';
  }
}

/** Bandera de nacionalidad: imagen si existe (Argentina = arg.png), sino emoji. */
const FLAG_IMAGE_BY_NATIONALITY: Record<string, string> = {
  Argentina: 'arg.png',
};
const FALLBACK_FLAG_EMOJI: Record<string, string> = {
  Uruguay: '🇺🇾',
  Chile: '🇨🇱',
  Paraguay: '🇵🇾',
};
function getNationalityFlag(nationality?: string): { image?: string; emoji?: string } {
  if (!nationality) return {};
  const image = FLAG_IMAGE_BY_NATIONALITY[nationality];
  if (image) return { image };
  return { emoji: FALLBACK_FLAG_EMOJI[nationality] ?? '' };
}

interface ProfileScreenProps {
  selectedPlayerId?: string | null;
  setScreen?: (screen: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ selectedPlayerId }) => {
  const displayPlayer = useMemo(() => {
    if (selectedPlayerId) {
      const p = getPlayerWithDisplay(selectedPlayerId);
      if (p) return p;
    }
    return getPlayerWithDisplay('p-0')!;
  }, [selectedPlayerId]);

  const { stats: playerStats } = displayPlayer;
  const age = displayPlayer.birthDate
    ? new Date().getFullYear() - new Date(displayPlayer.birthDate).getFullYear()
    : null;
  const winPct = playerStats.matchesPlayed > 0
    ? Math.round((playerStats.wins / playerStats.matchesPlayed) * 100)
    : 0;

  const tournamentHistory = useMemo(() => getTournamentHistoryForPlayer(displayPlayer.id), [displayPlayer.id]);
  const rankingHistory = useMemo(() => getPlayerRankingHistory(displayPlayer.id), [displayPlayer.id]);
  const tournamentsWon = useMemo(() => tournamentHistory.filter(h => h.result === 'Campeón'), [tournamentHistory]);
  const promotionHistory = useMemo(() => getPlayerPromotionHistory(displayPlayer.id), [displayPlayer.id]);
  const leagueNum = categoryToLeague(displayPlayer.category);
  const leagueColor = getLeagueColor(leagueNum);
  const nationalityFlag = getNationalityFlag(displayPlayer.nationality);
  const recentMatchesRaw = useMemo(() => getRecentMatchesForPlayer(displayPlayer.id), [displayPlayer.id]);

  const recentMatches = useMemo(() => recentMatchesRaw.slice(0, 5).map(m => {
    const oppId = m.playerA === displayPlayer.id ? m.playerB : m.playerA;
    const opp = getPlayerById(oppId);
    const isWin = m.winnerId === displayPlayer.id;
    return {
      opp: opp?.name ?? '—',
      score: m.score,
      res: isWin ? 'Victoria' : 'Derrota',
      color: isWin ? 'green' : 'red' as const,
      phase: m.round ?? '—',
    };
  }), [recentMatchesRaw, displayPlayer.id]);

  const profilePhotoUrl = displayPlayer.profileImage ? getProfileImageUrl(displayPlayer.profileImage) : '';
  const initial = displayPlayer.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  const stats = [
    { label: 'Partidos jugados', val: String(playerStats.matchesPlayed), Icon: Activity, color: 'blue' },
    { label: 'Victorias', val: String(playerStats.wins), Icon: Trophy, color: 'green' },
    { label: 'Derrotas', val: String(playerStats.losses), Icon: TrendingDown, color: 'red' },
    { label: '% victorias', val: `${winPct}%`, Icon: Percent, color: 'purple' },
  ];

  return (
    <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Cabecera: foto, nombre, ranking (diseño anterior) */}
      <section className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition">
          <div className={`h-1 rounded-t-xl shrink-0 ${leagueColor.topBar}`} aria-hidden />
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative p-6">
            <div className="relative">
              <div className="size-28 md:size-36 rounded-full overflow-hidden ring-4 ring-primary/20 bg-primary/10 flex items-center justify-center text-primary text-4xl font-black">
                {profilePhotoUrl ? (
                  <img
                    src={profilePhotoUrl}
                    alt={displayPlayer.name}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  displayPlayer.initial || initial
                )}
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-[#111318] dark:text-white flex items-center justify-center md:justify-start gap-2 flex-wrap">
                {displayPlayer.name}
                {displayPlayer.nationality && (
                  nationalityFlag.image ? (
                    <img
                      src={getProfileImageUrl(nationalityFlag.image)}
                      alt={displayPlayer.nationality}
                      className="w-8 h-6 object-cover rounded shrink-0 border border-gray-200 dark:border-gray-600"
                      title={displayPlayer.nationality}
                    />
                  ) : nationalityFlag.emoji ? (
                    <span className="text-3xl" role="img" aria-label={displayPlayer.nationality}>{nationalityFlag.emoji}</span>
                  ) : null
                )}
                <LeagueBadge league={leagueNum} className="shrink-0" />
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-lg mt-1">
                Posición <span className="text-[#111318] dark:text-white font-semibold">#{displayPlayer.position}</span>
              </p>
              <p className="text-sm text-[#616f89] dark:text-gray-400 mt-2">{displayPlayer.points} puntos</p>
              <p className="text-sm text-[#616f89] dark:text-gray-400">Mejor posición: <span className="font-semibold text-[#111318] dark:text-white">#{rankingHistory.best}</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Recuadros: mismo estilo en ambos */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mb-3">Ranking actual</h3>
          <p className="text-2xl font-bold text-primary">#{displayPlayer.position}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mb-3">Ranking máximo</h3>
          <p className="text-2xl font-bold text-primary">#{rankingHistory.best}</p>
          {rankingHistory.bestAt && (
            <p className="text-sm text-[#616f89] dark:text-gray-400 mt-1">Fecha: {rankingHistory.bestAt}</p>
          )}
        </div>
      </section>

      <div className="space-y-6">
        <section className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">Información básica</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <dt className="text-[#616f89] dark:text-gray-400">Nombre</dt>
            <dd className="font-medium text-[#111318] dark:text-white">{displayPlayer.name}</dd>
            <dt className="text-[#616f89] dark:text-gray-400">Ranking actual</dt>
            <dd className="font-medium text-[#111318] dark:text-white">#{displayPlayer.position} · {displayPlayer.points} puntos</dd>
            {displayPlayer.birthDate && (
              <>
                <dt className="text-[#616f89] dark:text-gray-400">Fecha de nacimiento</dt>
                <dd className="font-medium text-[#111318] dark:text-white">
                  {new Date(displayPlayer.birthDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                </dd>
              </>
            )}
            {age != null && (
              <>
                <dt className="text-[#616f89] dark:text-gray-400">Edad</dt>
                <dd className="font-medium text-[#111318] dark:text-white">{age} años</dd>
              </>
            )}
            {displayPlayer.nationality && (
              <>
                <dt className="text-[#616f89] dark:text-gray-400">Nacionalidad</dt>
                <dd className="font-medium text-[#111318] dark:text-white">{displayPlayer.nationality}</dd>
              </>
            )}
            {displayPlayer.playingHand && (
              <>
                <dt className="text-[#616f89] dark:text-gray-400">Mano de juego</dt>
                <dd className="font-medium text-[#111318] dark:text-white">{displayPlayer.playingHand}</dd>
              </>
            )}
          </dl>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.Icon;
            return (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 p-5 hover:shadow-md transition-colors">
                <p className="text-[#616f89] dark:text-gray-400 font-medium text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-[#111318] dark:text-white mt-1">{stat.val}</p>
                <div className="mt-2 p-2 bg-primary/10 rounded-lg w-fit">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            );
          })}
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">Últimos 5 partidos</h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Fase</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Partido</th>
                      <th className="px-4 py-3 text-xs font-semibold text-[#616f89] uppercase tracking-wider">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {recentMatches.length === 0 ? (
                      <tr><td colSpan={3} className="px-4 py-6 text-center text-[#616f89] dark:text-gray-400 text-sm">Sin partidos recientes</td></tr>
                    ) : (
                      recentMatches.map((m, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <td className="px-4 py-3 text-sm text-[#616f89] dark:text-gray-400">{m.phase}</td>
                          <td className="px-4 py-3 text-sm font-medium text-[#111318] dark:text-white">VS {m.opp}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${m.color === 'green' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}`}>
                              {m.res}
                            </span>
                            {m.score ? <span className="ml-2 text-xs text-[#616f89] dark:text-gray-400">{m.score}</span> : null}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">Torneos ganados</h2>
              <div className="space-y-3">
                {tournamentsWon.length === 0 ? (
                  <p className="p-4 text-center text-[#616f89] dark:text-gray-400 text-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">Sin títulos aún</p>
                ) : (
                  tournamentsWon.map((h, i) => {
                    const tLeague = h.tournament.league ?? categoryToLeague(h.tournament.category);
                    const tColor = getLeagueColor(tLeague);
                    return (
                      <div key={i} className="flex items-center rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
                        <div className={`w-1 min-h-[60px] shrink-0 ${tColor.topBar}`} aria-hidden />
                        <div className="flex items-center gap-3 p-4 flex-1">
                          <div className="size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Trophy className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#111318] dark:text-white truncate">{h.tournament.name}</p>
                            <p className="text-xs text-[#616f89] truncate">{formatTournamentDate(h.tournament)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">Historial de torneos</h2>
              <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden max-h-[280px] overflow-y-auto">
                {tournamentHistory.length === 0 ? (
                  <p className="p-4 text-center text-[#616f89] dark:text-gray-400 text-sm">Sin historial</p>
                ) : (
                  tournamentHistory.map((h, i) => {
                    const tLeague = h.tournament.league ?? categoryToLeague(h.tournament.category);
                    const tColor = getLeagueColor(tLeague);
                    return (
                      <div key={i} className={`flex items-center gap-3 p-3 border-l-4 ${tColor.border} hover:bg-gray-50 dark:hover:bg-gray-800/50`}>
                        <Medal className="w-5 h-5 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#111318] dark:text-white truncate">{h.tournament.name}</p>
                          <p className="text-xs text-[#616f89] truncate">{formatTournamentDate(h.tournament)}</p>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded shrink-0 ${h.result === 'Campeón' ? 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : 'text-[#111318] dark:text-white bg-gray-100 dark:bg-gray-700'}`}>
                          {h.result}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {promotionHistory.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-[#111318] dark:text-white border-b border-gray-300 dark:border-gray-700 pb-3 mb-4">Ascensos y descensos</h2>
                <div className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden">
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {promotionHistory.map((entry, i) => (
                      <li key={i} className={`flex items-center gap-3 p-4 ${entry.type === 'promotion' ? 'text-green-700 dark:text-green-400 bg-green-50/50 dark:bg-green-900/20' : 'text-red-700 dark:text-red-400 bg-red-50/50 dark:bg-red-900/20'}`}>
                        {entry.type === 'promotion' ? <TrendingUp className="w-5 h-5 shrink-0" /> : <ArrowDown className="w-5 h-5 shrink-0" />}
                        <div>
                          <p className="font-medium">{entry.type === 'promotion' ? 'Subió de liga' : 'Bajó de liga'}</p>
                          <p className="text-sm opacity-90">{entry.year} → Liga {entry.toLeague}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
