import React, { useState } from 'react';
import { Calendar, MapPin, AlertTriangle, Trophy, Users, GitBranch, Award, FileText } from 'lucide-react';
import {
  getTournamentById,
  formatTournamentDate,
  getGroupTablesWithSetStats,
  getUpcomingMatchesForTournament,
  getTournamentRanking,
  getPlayerById,
  getPlayerWithDisplay,
  DEFAULT_TOURNAMENT_RULES,
  BALL_RULE_TEXT,
  LATE_ARRIVAL_RULE_TITLE,
  LATE_ARRIVAL_RULE_TEXT,
  getLiga3GroupStageResults,
  getLiga3Calendar,
  LIGA3_STATUS,
  getGroupStageFixtures,
  getLiga3Preclasificacion,
  LIGA3_PLAYOFF_RULES,
  LIGA3_CLASSIFICATION_RULES,
  getBracketMatchesForLibrary,
} from '../src/lib/mockData';
import { TournamentBracket } from '../src/components/TournamentBracket';

interface BracketErrorBoundaryProps {
  children: React.ReactNode;
  tournamentId: string;
}

/** Evita que un error en el cuadro rompa toda la pantalla */
class BracketErrorBoundary extends React.Component<BracketErrorBoundaryProps, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render(): React.ReactNode {
    const props = (this as React.Component<BracketErrorBoundaryProps, { hasError: boolean }>).props;
    const { children } = props;
    if (this.state.hasError) {
      return (
        <div className="rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 p-6 text-center text-[#616f89] dark:text-gray-400 text-sm">
          No se pudo cargar el cuadro de eliminación. El resto del torneo se muestra correctamente.
        </div>
      );
    }
    return children;
  }
}

function getCoverImageUrl(filename: string): string {
  try {
    return new URL(`../img/${filename}`, import.meta.url).href;
  } catch {
    return '';
  }
}

const pelotaImgUrl = getCoverImageUrl('pelota.png');

type SectionId = 'resumen' | 'fase-grupos' | 'eliminacion' | 'resultados' | 'reglamento';

const SECTIONS: { id: SectionId; label: string; icon: React.ReactNode }[] = [
  { id: 'resumen', label: 'Resumen', icon: <Trophy className="w-4 h-4" /> },
  { id: 'fase-grupos', label: 'Fase de grupos', icon: <Users className="w-4 h-4" /> },
  { id: 'eliminacion', label: 'Eliminación', icon: <GitBranch className="w-4 h-4" /> },
  { id: 'resultados', label: 'Resultados', icon: <Award className="w-4 h-4" /> },
  { id: 'reglamento', label: 'Reglamento', icon: <FileText className="w-4 h-4" /> },
];

/** Puntos máximos por fase (para Resumen y Reglamento). Liga 3: eliminación; otros: DEFAULT. */
const PHASE_POINTS_DISPLAY = [
  { phase: 'Campeón', points: 500 },
  { phase: 'Finalista', points: 350 },
  { phase: 'Semifinal', points: 200 },
  { phase: 'Cuartos de final', points: 100 },
  { phase: 'Participación', points: 20 },
];

const CALENDAR_STRUCTURE = [
  { week: 'Semana 1', phase: 'Fecha 1' },
  { week: 'Semana 2', phase: 'Fecha 2' },
  { week: 'Semana 3', phase: 'Fecha 3' },
  { week: 'Semana 4', phase: 'Fecha 4' },
  { week: 'Semana 5', phase: 'Fecha 5' },
  { week: 'Semana 6', phase: 'Eliminación' },
  { week: 'Semana 7', phase: 'Final' },
];

interface TournamentDetailScreenProps {
  tournamentId: string | null;
  setScreen: (screen: string) => void;
}

type ResultadosFilter = 'todos' | 'fase-grupos' | 'eliminacion';

type EliminationRoundTab = '1' | '2' | '3';

export const TournamentDetailScreen: React.FC<TournamentDetailScreenProps> = ({ tournamentId, setScreen }) => {
  const [section, setSection] = useState<SectionId>('resumen');
  const [resultadosFilter, setResultadosFilter] = useState<ResultadosFilter>('todos');
  const [eliminationRoundTab, setEliminationRoundTab] = useState<EliminationRoundTab>('1');
  const tournament = tournamentId ? getTournamentById(tournamentId) : getTournamentById('t-novak');
  const groupTables = tournament ? getGroupTablesWithSetStats(tournament.id) : [];
  const groupFixtures = tournament ? getGroupStageFixtures(tournament.id) : [];
  const upcoming = tournament ? getUpcomingMatchesForTournament(tournament.id) : [];
  const isLiga3 = tournament?.id === 't-novak-l3';
  const ranking = tournament ? getTournamentRanking(tournament.id) : [];
  const coverUrl = tournament?.coverImage ? getCoverImageUrl(tournament.coverImage) : '';
  const top5Ranking = ranking.slice(0, 5);

  if (!tournament) {
    return (
      <div className="flex flex-1 items-center justify-center py-20 px-4">
        <div className="text-center">
          <p className="text-[#616f89] dark:text-gray-400 mb-4">No se encontró el torneo.</p>
          <button onClick={() => setScreen('directory')} className="text-primary font-bold hover:underline">
            Volver a torneos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* 1) Hero — tournament cover image and name */}
      <section className="relative w-full min-h-[280px] md:min-h-[340px] flex flex-col justify-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: coverUrl
              ? `linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.85) 100%), url("${coverUrl}")`
              : 'linear-gradient(135deg, #0d3b8a 0%, #1a4a9e 100%)',
          }}
        />
        <div className="relative z-10 px-4 md:px-8 pb-8 pt-24">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block rounded-full bg-primary/90 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 mb-2">
              {tournament.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight drop-shadow-lg">
              {tournament.name}
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto w-full px-4 md:px-6 py-6 flex flex-col gap-6 bg-gray-100 dark:bg-gray-900 min-h-full">
        {/* Section navigation — horizontally scrollable on mobile */}
        <nav
          className="flex flex-wrap gap-1 overflow-visible pb-2 -mx-1 md:flex-wrap"
          aria-label="Secciones del torneo"
        >
          {SECTIONS.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`flex items-center gap-2 shrink-0 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap snap-center ${
                section === id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-[#616f89] dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        {/* Resumen */}
        {section === 'resumen' && (
          <>
            {isLiga3 && (
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-2">Estado del torneo</h2>
                <p className="text-lg font-semibold text-primary">{LIGA3_STATUS}</p>
              </section>
            )}

            {upcoming.length > 0 && (
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-4">Próximo partido</h2>
                {(() => {
                  const m = upcoming[0];
                  return (
                    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 shadow-sm">
                      <p className="text-xs font-semibold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mb-1">
                        {m.date} – {m.time}
                      </p>
                      {m.group && <p className="text-xs font-medium text-primary mb-2">{m.group}</p>}
                      <p className="text-sm font-medium text-[#111318] dark:text-white">
                        {m.ballsByPlayerA ? (
                          <><span className="text-primary font-semibold">{m.playerA}</span>
                            {pelotaImgUrl && <img src={pelotaImgUrl} alt="" className="inline-block w-4 h-4 ml-0.5 align-middle object-contain" width={16} height={16} aria-hidden />}
                            {' vs '}{m.playerB}</>
                        ) : (
                          <>{m.playerA} vs <span className="text-primary font-semibold">{m.playerB}</span>{pelotaImgUrl && <img src={pelotaImgUrl} alt="" className="inline-block w-4 h-4 ml-0.5 align-middle object-contain" width={16} height={16} aria-hidden />}</>
                        )}
                      </p>
                    </div>
                  );
                })()}
              </section>
            )}

            <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm">
              <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-3">Puntos máximos del torneo</h2>
              <p className="text-sm text-[#616f89] dark:text-gray-400 mb-4">Puntos por fase (eliminación).</p>
              <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden max-w-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800/50">
                    <tr>
                      <th className="px-3 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Fase</th>
                      <th className="px-3 py-2 text-right font-bold text-[#616f89] dark:text-gray-400">Puntos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                    {PHASE_POINTS_DISPLAY.map((row, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 text-[#111318] dark:text-white">{row.phase}</td>
                        <td className="px-3 py-2 text-right font-bold text-primary">{row.points} pts</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-white dark:bg-gray-900 rounded-xl overflow-visible border border-gray-300 dark:border-gray-700 shadow-sm max-md:overflow-visible">
              <h2 className="text-xl font-bold text-[#111318] dark:text-white p-6 pb-0">Top 5</h2>
              <div className="overflow-x-auto max-md:overflow-visible p-6">
                {isLiga3 ? (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-700">
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400 w-12">#</th>
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400">Jugador</th>
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400 text-center">PJ</th>
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400 text-right">Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                      {top5Ranking.map((row) => (
                        <tr key={row.playerId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="py-3 font-medium text-[#616f89] dark:text-gray-400">{row.position}</td>
                          <td className="py-3 font-medium text-[#111318] dark:text-white">{row.player.name}</td>
                          <td className="py-3 text-center text-[#616f89] dark:text-gray-400">{row.matchesPlayed}</td>
                          <td className="py-3 text-right font-bold text-primary">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-700">
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400 w-12">#</th>
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400">Jugador</th>
                        <th className="pb-3 font-bold text-[#616f89] dark:text-gray-400 text-right">Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                      {top5Ranking.map((row) => (
                        <tr key={row.playerId} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                          <td className="py-3 font-medium text-[#616f89] dark:text-gray-400">{row.position}</td>
                          <td className="py-3 font-medium text-[#111318] dark:text-white">{row.player.name}</td>
                          <td className="py-3 text-right font-bold text-primary">{row.points}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setSection('eliminacion')}
                  className="rounded-lg bg-primary text-white font-bold px-5 py-2.5 hover:bg-primary/90 transition-colors"
                >
                  Ver cuadro de eliminación
                </button>
              </div>
            </section>
          </>
        )}

        {/* Fase de grupos: tablas + fechas en 3 columnas (una por grupo) */}
        {section === 'fase-grupos' && (
          <>
            <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm overflow-visible">
              <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-4">Fase de grupos</h2>
              {/* Mobile: misma estética que desktop (círculos, colores, filas) con menos columnas */}
              <div className="md:hidden flex flex-col gap-6 overflow-visible">
                {groupTables.map((group) => (
                  <div key={group.name} className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700">
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5 border-b border-gray-300 dark:border-gray-700">
                      <h3 className="font-bold text-[#111318] dark:text-white text-sm">{group.name}</h3>
                    </div>
                    {/* Fila de encabezado como en desktop */}
                    <div className="grid grid-cols-[auto_1fr_auto] gap-2 px-3 py-2 border-b border-gray-300 dark:border-gray-700 bg-gray-50/80 dark:bg-gray-800/80 text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider">
                      <span className="w-8 text-center">Pos</span>
                      <span>Jugador</span>
                      <span className="text-right tabular-nums w-20">PG · PP · ±</span>
                    </div>
                    <div className="divide-y divide-[#f0f2f4] dark:divide-gray-700 overflow-visible">
                      {group.rows.map((row) => {
                        const setDiff = (row.setsWon ?? 0) - (row.setsLost ?? 0);
                        const playerLabel = getPlayerById(row.playerId)?.name ?? '—';
                        const seed = isLiga3 ? getLiga3Preclasificacion(row.playerId) : getPlayerWithDisplay(row.playerId)?.position;
                        const playerWithRanking = seed != null ? `${playerLabel} (${seed})` : playerLabel;
                        const isQualified = isLiga3 && row.position <= 3;
                        const posCircleClass =
                          row.position <= 2
                            ? 'bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 ring-2 ring-green-500/60 dark:ring-green-400/50'
                            : row.position <= 4
                              ? 'bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/60 dark:ring-blue-400/50'
                              : 'bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300 ring-2 ring-red-500/60 dark:ring-red-400/50';
                        return (
                          <div
                            key={row.playerId}
                            className={`grid grid-cols-[auto_1fr_auto] gap-2 items-center px-3 py-2.5 min-w-0 ${
                              isQualified ? 'bg-slate-50/80 dark:bg-slate-800/50' : 'bg-white dark:bg-gray-900'
                            }`}
                          >
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-sm shrink-0 ${posCircleClass}`}>
                              {row.position}
                            </span>
                            <span className="font-medium text-[#111318] dark:text-white text-sm truncate min-w-0">
                              {playerWithRanking}
                            </span>
                            <div className="flex items-center justify-end gap-1.5 text-sm tabular-nums shrink-0 w-20">
                              <span className="text-green-600 dark:text-green-400 font-medium">{row.PG ?? '—'}</span>
                              <span className="text-[#616f89] dark:text-gray-500">·</span>
                              <span className="text-red-600 dark:text-red-400 font-medium">{row.PP ?? '—'}</span>
                              <span className="text-[#616f89] dark:text-gray-500">·</span>
                              <span className={`font-medium ${setDiff >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {setDiff >= 0 ? '+' : ''}{setDiff}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Desktop: table unchanged */}
              <div className="hidden md:flex flex-col gap-8">
                {groupTables.map((group) => (
                  <div key={group.name} className="overflow-hidden rounded-lg border border-gray-300 dark:border-gray-700 pr-4">
                    <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-b border-gray-300 dark:border-gray-700">
                      <h3 className="font-bold text-[#111318] dark:text-white">{group.name}</h3>
                    </div>
                    <table className="w-full text-sm table-fixed min-w-0">
                      <colgroup>
                        <col className="w-14" />
                        <col style={{ minWidth: 0 }} />
                        {isLiga3 && <col className="w-12" />}
                        <col className="w-14" />
                        <col className="w-14" />
                        <col className="w-14" />
                        <col className="w-16" />
                        <col className="w-16" />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-gray-300 dark:border-gray-700">
                          <th className="px-3 py-2.5 text-center font-bold text-[#616f89] dark:text-gray-400">Pos</th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#616f89] dark:text-gray-400">Jugador</th>
                          {isLiga3 && <th className="px-3 py-2.5 text-center font-bold text-[#616f89] dark:text-gray-400">+/-</th>}
                          <th className="px-3 py-2.5 text-center font-bold text-[#616f89] dark:text-gray-400">PJ</th>
                          <th className="px-3 py-2.5 text-center font-bold text-[#616f89] dark:text-gray-400">PG</th>
                          <th className="px-3 py-2.5 text-center font-bold text-[#616f89] dark:text-gray-400">PP</th>
                          <th className="px-3 py-2.5 pr-5 text-center font-bold text-[#616f89] dark:text-gray-400 whitespace-nowrap">Sets +</th>
                          <th className="px-3 py-2.5 pr-5 text-center font-bold text-[#616f89] dark:text-gray-400 whitespace-nowrap">Sets −</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                        {group.rows.map((row) => {
                          const p = getPlayerById(row.playerId);
                          const withDisplay = getPlayerWithDisplay(row.playerId);
                          const rankPos = withDisplay?.position;
                          const playerLabel = p?.name ?? '—';
                          const precla = isLiga3 ? getLiga3Preclasificacion(row.playerId) : undefined;
                          const playerWithRanking = isLiga3
                            ? (precla != null ? `${playerLabel} (${precla})` : playerLabel)
                            : (rankPos != null ? `${playerLabel} (${rankPos})` : playerLabel);
                          const isQualified = isLiga3 && row.position <= 3;
                          const isEliminated = isLiga3 && row.position >= 4;
                          const changeCellClass = isEliminated
                            ? 'px-3 py-2.5 text-center text-[#94a3b8] dark:text-slate-500 bg-slate-100 dark:bg-slate-800/60'
                            : isLiga3
                              ? 'px-3 py-2.5 text-center font-medium tabular-nums'
                              : '';
                          const changeDisplay = row.positionChange != null && row.positionChange !== 0
                            ? (row.positionChange > 0 ? `+${row.positionChange}` : String(row.positionChange))
                            : '—';
                          const changeContentClass = 'inline-block w-7 text-center tabular-nums';
                          const changeColor = row.positionChange != null && row.positionChange !== 0
                            ? (row.positionChange > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400')
                            : 'text-[#616f89] dark:text-gray-400';
                          const posCircleClass =
                            row.position <= 2
                              ? 'bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 ring-2 ring-green-500/60 dark:ring-green-400/50'
                              : row.position <= 4
                                ? 'bg-blue-500/20 dark:bg-blue-500/30 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/60 dark:ring-blue-400/50'
                                : 'bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300 ring-2 ring-red-500/60 dark:ring-red-400/50';
                          return (
                            <tr
                              key={row.playerId}
                              className={
                                isQualified
                                  ? 'hover:bg-gray-50 dark:hover:bg-gray-800/30 bg-slate-50/80 dark:bg-slate-800/50'
                                  : 'hover:bg-gray-50 dark:hover:bg-gray-800/30'
                              }
                            >
                              <td className="px-3 py-2.5 text-center align-middle">
                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold text-sm ${posCircleClass}`}>
                                  {row.position}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 font-medium text-[#111318] dark:text-white align-middle">{playerWithRanking}</td>
                              {isLiga3 && (
                                <td className={`${changeCellClass} ${row.positionChange != null && row.positionChange !== 0 ? changeColor : ''} align-middle`}>
                                  <span className={changeContentClass}>{changeDisplay}</span>
                                </td>
                              )}
                              <td className="px-3 py-2.5 text-center text-[#616f89] dark:text-gray-400 tabular-nums align-middle">{row.PJ}</td>
                              <td className="px-3 py-2.5 text-center text-green-600 dark:text-green-400 tabular-nums align-middle">{row.PG ?? '—'}</td>
                              <td className="px-3 py-2.5 text-center text-red-600 dark:text-red-400 tabular-nums align-middle">{row.PP ?? '—'}</td>
                              <td className="px-3 py-2.5 text-center text-green-600 dark:text-green-400 tabular-nums align-middle">{row.setsWon}</td>
                              <td className="px-3 py-2.5 pr-5 text-center text-red-600 dark:text-red-400 tabular-nums align-middle">{row.setsLost}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </section>
            {groupFixtures.length > 0 && (
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-4">Fechas por grupo</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {groupFixtures.map((group) => (
                    <div key={group.name} className="rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
                      <div className="px-3 py-2 border-b border-gray-300 dark:border-gray-700">
                        <h3 className="font-bold text-[#111318] dark:text-white text-sm">{group.name}</h3>
                      </div>
                      <div className="p-3 space-y-3">
                        {group.fechas.map((f) => (
                          <div key={`${group.name}-f-${f.fecha}`} className="rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900/50 p-2">
                            <p className="text-xs font-bold text-[#616f89] dark:text-gray-400 uppercase tracking-wider mb-1.5">Fecha {f.fecha}</p>
                            <ul className="space-y-1 text-sm text-[#111318] dark:text-white">
                              {f.matches.map((match, i) => (
                                <li key={i}>
                                  {match.ballsByA ? (
                                    <><span className="font-medium text-primary">{match.playerA}</span> <span className="text-xs text-primary font-semibold">(P)</span> vs {match.playerB}</>
                                  ) : (
                                    <>{match.playerA} vs <span className="font-medium text-primary">{match.playerB}</span> <span className="text-xs text-primary font-semibold">(P)</span></>
                                  )}
                                </li>
                              ))}
                              {f.libre && (
                                <li className="text-[#616f89] dark:text-gray-400 text-xs pt-0.5">Libre: {f.libre}</li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            {isLiga3 && (
              <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm">
                <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-4">Clasificación a Play Off</h2>
                <p className="text-sm text-[#616f89] dark:text-gray-300 whitespace-pre-line leading-relaxed">
                  {LIGA3_PLAYOFF_RULES}
                </p>
              </section>
            )}
          </>
        )}

        {/* Eliminación */}
        {section === 'eliminacion' && (
          <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm overflow-visible">
            <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-6">Eliminación</h2>
            {/* Mobile: tabs + match cards, no bracket */}
            <div className="md:hidden flex flex-col gap-4 overflow-visible">
              <div className="flex flex-wrap gap-2">
                {(['1', '2', '3'] as const).map((round) => (
                  <button
                    key={round}
                    type="button"
                    onClick={() => setEliminationRoundTab(round)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                      eliminationRoundTab === round
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-[#616f89] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {round === '1' ? 'Cuartos' : round === '2' ? 'Semifinal' : 'Final'}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 overflow-visible">
                {(() => {
                  const bracketMatches = getBracketMatchesForLibrary(tournament.id);
                  const roundMatches = bracketMatches.filter((m) => m.tournamentRoundText === eliminationRoundTab);
                  return roundMatches.map((match) => {
                    const [top, bottom] = match.participants;
                    const topWon = top?.isWinner === true;
                    const bottomWon = bottom?.isWinner === true;
                    const topName = top?.name ?? 'TBD';
                    const bottomName = bottom?.name ?? 'TBD';
                    const topSeed = top?.ranking != null ? ` (${top.ranking})` : '';
                    const bottomSeed = bottom?.ranking != null ? ` (${bottom.ranking})` : '';
                    const result = top?.resultText || bottom?.resultText || '–';
                    return (
                      <div
                        key={String(match.id)}
                        className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 overflow-visible"
                      >
                        <p className={`text-sm font-semibold ${topWon ? 'text-primary dark:text-primary' : 'text-[#111318] dark:text-white'}`}>
                          {topName}{topSeed}
                        </p>
                        <p className="text-xs text-[#616f89] dark:text-gray-400 py-1">vs</p>
                        <p className={`text-sm font-semibold ${bottomWon ? 'text-primary dark:text-primary' : 'text-[#111318] dark:text-white'}`}>
                          {bottomName}{bottomSeed}
                        </p>
                        <p className="text-sm font-bold text-primary mt-2 pt-2 border-t border-gray-300 dark:border-gray-700">Resultado: {result}</p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
            {/* Desktop: bracket unchanged */}
            <div className="hidden md:block">
              <BracketErrorBoundary tournamentId={tournament.id}>
                <TournamentBracket tournamentId={tournament.id} />
              </BracketErrorBoundary>
            </div>
          </section>
        )}

        {/* Resultados: todos los partidos jugados con filtro */}
        {section === 'resultados' && (
          <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm overflow-visible">
            <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-4">Resultados</h2>
            {isLiga3 ? (
              <>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(['todos', 'fase-grupos', 'eliminacion'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setResultadosFilter(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        resultadosFilter === f
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-[#616f89] dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                    >
                      {f === 'todos' ? 'Todos' : f === 'fase-grupos' ? 'Fase de grupos' : 'Eliminación'}
                    </button>
                  ))}
                </div>
                {/* Mobile: ATP-style match cards — date only, no time/court, scores right-aligned */}
                <div className="md:hidden flex flex-col gap-3 overflow-visible">
                  {(() => {
                    const groupRows = resultadosFilter !== 'eliminacion' ? getLiga3GroupStageResults() : [];
                    const elimEntries = resultadosFilter !== 'fase-grupos'
                      ? getLiga3Calendar().filter((e) => ['Cuartos de final', 'Semifinales', 'Final'].includes(e.phase))
                      : [];
                    const groupCards = groupRows.map((m, i) => ({ key: `g-${i}`, date: m.date, playerA: m.playerA, playerB: m.playerB, result: m.score, phase: m.groupName }));
                    const elimCards = elimEntries.map((e, i) => ({ key: `e-${i}`, date: e.date, playerA: e.playerA, playerB: e.playerB, result: e.result, phase: e.phase }));
                    const list = resultadosFilter === 'todos' ? [...groupCards, ...elimCards] : resultadosFilter === 'fase-grupos' ? groupCards : elimCards;
                    const parseScore = (s: string): { a: number[]; b: number[] } => {
                      const sets = s.split(',').map((x) => x.trim().split('-').map(Number));
                      const a = sets.map(([x]) => x).filter((n) => !Number.isNaN(n));
                      const b = sets.map(([, y]) => y).filter((n) => !Number.isNaN(n));
                      return { a, b };
                    };
                    const setsWonByA = (setA: number[], setB: number[]) =>
                      setA.filter((v, i) => v > (setB[i] ?? 0)).length;
                    return list.map((item) => {
                      const { a: setA, b: setB } = parseScore(item.result);
                      const aSets = setsWonByA(setA, setB);
                      const bSets = setsWonByA(setB, setA);
                      const aWon = setA.length > 0 && aSets > bSets;
                      const bWon = setB.length > 0 && bSets > aSets;
                      return (
                        <div key={item.key} className="rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4 overflow-visible relative">
                          <span className="absolute top-3 right-3 text-xs font-medium text-[#616f89] dark:text-gray-400">{item.date}</span>
                          <div className="flex flex-col gap-1.5 pr-20">
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <span className={`text-sm truncate ${aWon ? 'font-bold text-primary' : 'text-[#111318] dark:text-white'}`}>{item.playerA}</span>
                              <span className="flex gap-2 tabular-nums text-sm shrink-0">
                                {setA.length ? setA.map((n, i) => <span key={i} className={aWon ? 'font-bold text-primary' : ''}>{n}</span>) : '–'}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-2 min-w-0">
                              <span className={`text-sm truncate ${bWon ? 'font-bold text-primary' : 'text-[#111318] dark:text-white'}`}>{item.playerB}</span>
                              <span className="flex gap-2 tabular-nums text-sm shrink-0">
                                {setB.length ? setB.map((n, i) => <span key={i} className={bWon ? 'font-bold text-primary' : ''}>{n}</span>) : '–'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
                {/* Desktop: table unchanged */}
                <div className="hidden md:block overflow-visible">
                  <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 dark:border-gray-700">
                        <th className="px-4 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Fecha</th>
                        <th className="px-4 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Hora</th>
                        <th className="px-4 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Fase</th>
                        <th className="px-4 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Partido</th>
                        <th className="px-4 py-2 text-center font-bold text-[#616f89] dark:text-gray-400">Resultado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                      {resultadosFilter === 'fase-grupos' &&
                        getLiga3GroupStageResults().map((m, i) => (
                          <tr key={`g-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                            <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{m.date}</td>
                            <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{m.time}</td>
                            <td className="px-4 py-2 font-medium text-[#111318] dark:text-white">{m.groupName}</td>
                            <td className="px-4 py-2 text-[#111318] dark:text-white">{m.playerA} vs {m.playerB}</td>
                            <td className="px-4 py-2 text-center font-bold text-primary">{m.score}</td>
                          </tr>
                        ))}
                      {resultadosFilter === 'eliminacion' &&
                        getLiga3Calendar()
                          .filter((e) => e.result && e.result !== '–' && ['Cuartos de final', 'Semifinales', 'Final'].includes(e.phase))
                          .map((e, i) => (
                            <tr key={`e-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                              <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{e.date}</td>
                              <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{e.time}</td>
                              <td className="px-4 py-2 font-medium text-[#111318] dark:text-white">{e.phase}</td>
                              <td className="px-4 py-2 text-[#111318] dark:text-white">{e.playerA} vs {e.playerB}</td>
                              <td className="px-4 py-2 text-center font-bold text-primary">{e.result}</td>
                            </tr>
                          ))}
                      {resultadosFilter === 'todos' &&
                        (() => {
                          const groupRows = getLiga3GroupStageResults().map((m) => ({ date: m.date, time: m.time, phase: m.groupName, playerA: m.playerA, playerB: m.playerB, result: m.score }));
                          const elimRows = getLiga3Calendar().filter((e) => e.result && e.result !== '–' && ['Cuartos de final', 'Semifinales', 'Final'].includes(e.phase));
                          return (
                            <>
                              {groupRows.map((r, i) => (
                                <tr key={`t-g-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                  <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{r.date}</td>
                                  <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{r.time}</td>
                                  <td className="px-4 py-2 font-medium text-[#111318] dark:text-white">{r.phase}</td>
                                  <td className="px-4 py-2 text-[#111318] dark:text-white">{r.playerA} vs {r.playerB}</td>
                                  <td className="px-4 py-2 text-center font-bold text-primary">{r.result}</td>
                                </tr>
                              ))}
                              {elimRows.map((e, i) => (
                                <tr key={`t-e-${i}`} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                                  <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{e.date}</td>
                                  <td className="px-4 py-2 text-[#616f89] dark:text-gray-400">{e.time}</td>
                                  <td className="px-4 py-2 font-medium text-[#111318] dark:text-white">{e.phase}</td>
                                  <td className="px-4 py-2 text-[#111318] dark:text-white">{e.playerA} vs {e.playerB}</td>
                                  <td className="px-4 py-2 text-center font-bold text-primary">{e.result}</td>
                                </tr>
                              ))}
                            </>
                          );
                        })()}
                    </tbody>
                  </table>
                </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-[#616f89] dark:text-gray-400">Consultá la tabla de ranking y el cuadro de eliminación para ver los partidos jugados.</p>
            )}
          </section>
        )}

        {/* Reglamento: reglas, puntos por fase, calendario; sin resultados */}
        {section === 'reglamento' && (
          <section className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-300 dark:border-gray-700 shadow-sm">
            <div className="flex flex-wrap items-center gap-6 text-[#616f89] dark:text-gray-400 text-sm mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-5 h-5 shrink-0" />
                {formatTournamentDate(tournament)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 shrink-0" />
                {tournament.location}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#111318] dark:text-white mb-2">Reglamento</h2>
            <ul className="list-disc list-inside space-y-1 text-[#616f89] dark:text-gray-300 text-sm mb-4">
              {DEFAULT_TOURNAMENT_RULES.map((rule, i) => (
                <li key={i}>{rule}</li>
              ))}
            </ul>
            <p className="text-sm font-medium text-[#111318] dark:text-white bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 border border-gray-300 dark:border-gray-700 mb-4">
              {pelotaImgUrl && (
                <img src={pelotaImgUrl} alt="" className="inline-block w-5 h-5 mr-1.5 align-middle object-contain" aria-hidden />
              )}
              {BALL_RULE_TEXT}
            </p>
            <div className="rounded-xl border-2 border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-500 p-4 mb-4">
              <p className="flex items-center gap-2 font-bold text-red-800 dark:text-red-300 mb-1">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                {LATE_ARRIVAL_RULE_TITLE}
              </p>
              <p className="text-sm text-red-700 dark:text-red-200">{LATE_ARRIVAL_RULE_TEXT}</p>
            </div>
            <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider mb-2">Sistema de puntos (por fase)</h3>
            <p className="text-sm text-[#616f89] dark:text-gray-400 mb-2">Los puntos se otorgan por fase alcanzada en la eliminación, no por partido.</p>
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden max-w-sm mb-6">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Fase</th>
                    <th className="px-3 py-2 text-right font-bold text-[#616f89] dark:text-gray-400">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                  {PHASE_POINTS_DISPLAY.map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-[#111318] dark:text-white">{row.phase}</td>
                      <td className="px-3 py-2 text-right font-bold text-primary">{row.points} pts</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider mb-2">Estructura del calendario</h3>
            <div className="rounded-lg border border-gray-300 dark:border-gray-700 overflow-hidden max-w-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-[#616f89] dark:text-gray-400">Semana</th>
                    <th className="px-3 py-2 text-right font-bold text-[#616f89] dark:text-gray-400">Fase</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700">
                  {CALENDAR_STRUCTURE.map((row, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-[#111318] dark:text-white">{row.week}</td>
                      <td className="px-3 py-2 text-right text-[#616f89] dark:text-gray-400">{row.phase}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isLiga3 && (
              <>
                <h3 className="text-sm font-bold text-[#111318] dark:text-white uppercase tracking-wider mt-6 mb-2">Explicación de clasificación</h3>
                <p className="text-sm text-[#616f89] dark:text-gray-300">{LIGA3_CLASSIFICATION_RULES}</p>
              </>
            )}
          </section>
        )}

        <div className="flex justify-center pb-8">
          <button onClick={() => setScreen('directory')} className="text-primary font-bold hover:underline">
            ← Volver a torneos
          </button>
        </div>
      </div>
    </div>
  );
};
