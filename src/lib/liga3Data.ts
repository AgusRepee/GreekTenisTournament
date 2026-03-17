/**
 * Datos completos del torneo Novak Djokovic – Liga 3.
 * Torneo simulado hasta la final (solo falta jugar la final).
 * No modifica el ranking global de jugadores.
 */

export const LIGA3_TOURNAMENT_ID = 't-novak-l3';

/** Jugadores del torneo (solo para este torneo). ID interno para bracket/datos. */
export const LIGA3_PLAYERS: { id: string; name: string }[] = [
  { id: 'l3-pusterla', name: 'Pusterla P.' },
  { id: 'l3-santi-m', name: 'Santi M.' },
  { id: 'l3-rusel', name: 'Rusel S.' },
  { id: 'l3-bocchicchio', name: 'Bocchicchio F.' },
  { id: 'l3-repecka', name: 'Repecka A.' },
  { id: 'l3-marin', name: 'Marin G.' },
  { id: 'l3-fernandez', name: 'Fernandez B.' },
  { id: 'l3-casadio', name: 'Casadio M.' },
  { id: 'l3-volpe', name: 'Volpe S.' },
  { id: 'l3-bianco', name: 'Bianco D.' },
  { id: 'l3-vito', name: 'Vito C.' },
  { id: 'l3-santi-g', name: 'Santi G.' },
  { id: 'l3-delvalle', name: 'Del Valle G.' },
  { id: 'l3-ferreres', name: 'Ferreres G.' },
  { id: 'l3-komesu', name: 'Komesu F.' },
];

const nameToId: Record<string, string> = Object.fromEntries(LIGA3_PLAYERS.map((p) => [p.name, p.id]));
export function getLiga3Id(name: string): string {
  return nameToId[name] ?? name;
}

/** Preclasificación del torneo (1-15). Cabezas de grupo: 1, 2, 3 (Grupo A, B, C). */
export const LIGA3_PRECLASIFICACION: Record<string, number> = {
  'l3-repecka': 1,    // cabeza Grupo A
  'l3-marin': 2,      // cabeza Grupo B
  'l3-vito': 3,      // cabeza Grupo C
  'l3-delvalle': 4,
  'l3-volpe': 5,
  'l3-pusterla': 6,
  'l3-casadio': 7,
  'l3-rusel': 8,
  'l3-bianco': 9,
  'l3-bocchicchio': 10,
  'l3-santi-m': 11,
  'l3-ferreres': 12,
  'l3-santi-g': 13,
  'l3-fernandez': 14,
  'l3-komesu': 15,
};
export function getLiga3Preclasificacion(playerId: string): number | undefined {
  return LIGA3_PRECLASIFICACION[playerId];
}
export function getLiga3PlayerById(id: string): { id: string; name: string } | undefined {
  return LIGA3_PLAYERS.find((p) => p.id === id);
}
export function getLiga3PlayerByName(name: string): { id: string; name: string } | undefined {
  return LIGA3_PLAYERS.find((p) => p.name === name);
}

/** Resultado de un partido de fase de grupos */
export interface Liga3GroupMatchResult {
  groupName: string;
  fecha: number;
  playerA: string;
  playerB: string;
  score: string;
  winner: string;
  date: string;
  time: string;
}

/** Partidos de grupos con resultado (30 partidos: 3 grupos × 5 fechas × 2 partidos) */
export const LIGA3_GROUP_RESULTS: Liga3GroupMatchResult[] = [
  // Grupo A
  { groupName: 'Grupo A', fecha: 1, playerA: 'Pusterla P.', playerB: 'Santi M.', score: '6-3, 6-4', winner: 'Pusterla P.', date: 'Dom 2 Mar', time: '10:00' },
  { groupName: 'Grupo A', fecha: 1, playerA: 'Rusel S.', playerB: 'Bocchicchio F.', score: '6-2, 7-5', winner: 'Rusel S.', date: 'Dom 2 Mar', time: '11:30' },
  { groupName: 'Grupo A', fecha: 2, playerA: 'Bocchicchio F.', playerB: 'Pusterla P.', score: '4-6, 6-3, 6-4', winner: 'Bocchicchio F.', date: 'Dom 9 Mar', time: '10:00' },
  { groupName: 'Grupo A', fecha: 2, playerA: 'Rusel S.', playerB: 'Repecka A.', score: '6-4, 6-2', winner: 'Repecka A.', date: 'Dom 9 Mar', time: '11:30' },
  { groupName: 'Grupo A', fecha: 3, playerA: 'Pusterla P.', playerB: 'Rusel S.', score: '7-5, 6-3', winner: 'Pusterla P.', date: 'Dom 16 Mar', time: '10:00' },
  { groupName: 'Grupo A', fecha: 3, playerA: 'Repecka A.', playerB: 'Santi M.', score: '6-2, 6-1', winner: 'Repecka A.', date: 'Dom 16 Mar', time: '11:30' },
  { groupName: 'Grupo A', fecha: 4, playerA: 'Repecka A.', playerB: 'Pusterla P.', score: '6-3, 6-4', winner: 'Repecka A.', date: 'Sáb 22 Mar', time: '16:00' },
  { groupName: 'Grupo A', fecha: 4, playerA: 'Santi M.', playerB: 'Bocchicchio F.', score: '6-4, 3-6, 6-2', winner: 'Santi M.', date: 'Sáb 22 Mar', time: '17:30' },
  { groupName: 'Grupo A', fecha: 5, playerA: 'Santi M.', playerB: 'Rusel S.', score: '6-2, 7-6(4)', winner: 'Santi M.', date: 'Dom 23 Mar', time: '10:00' },
  { groupName: 'Grupo A', fecha: 5, playerA: 'Bocchicchio F.', playerB: 'Repecka A.', score: '2-6, 6-4, 3-6', winner: 'Repecka A.', date: 'Dom 23 Mar', time: '11:30' },
  // Grupo B
  { groupName: 'Grupo B', fecha: 1, playerA: 'Marin G.', playerB: 'Fernandez B.', score: '6-3, 6-2', winner: 'Marin G.', date: 'Dom 2 Mar', time: '14:00' },
  { groupName: 'Grupo B', fecha: 1, playerA: 'Casadio M.', playerB: 'Volpe S.', score: '7-5, 6-4', winner: 'Casadio M.', date: 'Dom 2 Mar', time: '15:30' },
  { groupName: 'Grupo B', fecha: 2, playerA: 'Volpe S.', playerB: 'Marin G.', score: '4-6, 6-3, 4-6', winner: 'Marin G.', date: 'Dom 9 Mar', time: '14:00' },
  { groupName: 'Grupo B', fecha: 2, playerA: 'Casadio M.', playerB: 'Bianco D.', score: '6-2, 6-1', winner: 'Casadio M.', date: 'Dom 9 Mar', time: '15:30' },
  { groupName: 'Grupo B', fecha: 3, playerA: 'Marin G.', playerB: 'Casadio M.', score: '6-4, 6-3', winner: 'Marin G.', date: 'Dom 16 Mar', time: '14:00' },
  { groupName: 'Grupo B', fecha: 3, playerA: 'Bianco D.', playerB: 'Fernandez B.', score: '6-3, 5-7, 6-4', winner: 'Bianco D.', date: 'Dom 16 Mar', time: '15:30' },
  { groupName: 'Grupo B', fecha: 4, playerA: 'Bianco D.', playerB: 'Marin G.', score: '2-6, 4-6', winner: 'Marin G.', date: 'Sáb 22 Mar', time: '10:00' },
  { groupName: 'Grupo B', fecha: 4, playerA: 'Fernandez B.', playerB: 'Volpe S.', score: '6-4, 6-2', winner: 'Fernandez B.', date: 'Sáb 22 Mar', time: '11:30' },
  { groupName: 'Grupo B', fecha: 5, playerA: 'Fernandez B.', playerB: 'Casadio M.', score: '3-6, 6-4, 2-6', winner: 'Casadio M.', date: 'Dom 23 Mar', time: '14:00' },
  { groupName: 'Grupo B', fecha: 5, playerA: 'Volpe S.', playerB: 'Bianco D.', score: '6-3, 6-4', winner: 'Volpe S.', date: 'Dom 23 Mar', time: '15:30' },
  // Grupo C
  { groupName: 'Grupo C', fecha: 1, playerA: 'Vito C.', playerB: 'Santi G.', score: '6-2, 6-3', winner: 'Vito C.', date: 'Dom 2 Mar', time: '18:00' },
  { groupName: 'Grupo C', fecha: 1, playerA: 'Del Valle G.', playerB: 'Ferreres G.', score: '7-6(2), 6-4', winner: 'Del Valle G.', date: 'Dom 2 Mar', time: '19:30' },
  { groupName: 'Grupo C', fecha: 2, playerA: 'Ferreres G.', playerB: 'Vito C.', score: '4-6, 6-3, 2-6', winner: 'Vito C.', date: 'Dom 9 Mar', time: '18:00' },
  { groupName: 'Grupo C', fecha: 2, playerA: 'Del Valle G.', playerB: 'Komesu F.', score: '6-1, 6-2', winner: 'Del Valle G.', date: 'Dom 9 Mar', time: '19:30' },
  { groupName: 'Grupo C', fecha: 3, playerA: 'Vito C.', playerB: 'Del Valle G.', score: '6-4, 3-6, 6-3', winner: 'Vito C.', date: 'Dom 16 Mar', time: '18:00' },
  { groupName: 'Grupo C', fecha: 3, playerA: 'Komesu F.', playerB: 'Santi G.', score: '6-2, 7-5', winner: 'Komesu F.', date: 'Dom 16 Mar', time: '19:30' },
  { groupName: 'Grupo C', fecha: 4, playerA: 'Komesu F.', playerB: 'Vito C.', score: '3-6, 4-6', winner: 'Vito C.', date: 'Sáb 22 Mar', time: '14:00' },
  { groupName: 'Grupo C', fecha: 4, playerA: 'Santi G.', playerB: 'Ferreres G.', score: '6-3, 6-4', winner: 'Santi G.', date: 'Sáb 22 Mar', time: '15:30' },
  { groupName: 'Grupo C', fecha: 5, playerA: 'Santi G.', playerB: 'Del Valle G.', score: '2-6, 5-7', winner: 'Del Valle G.', date: 'Dom 23 Mar', time: '18:00' },
  { groupName: 'Grupo C', fecha: 5, playerA: 'Ferreres G.', playerB: 'Komesu F.', score: '6-4, 6-3', winner: 'Ferreres G.', date: 'Dom 23 Mar', time: '19:30' },
];

/** Partidos de fase de grupos con resultado (para "Partidos por fase de grupos") */
export function getLiga3GroupStageResults(): Liga3GroupMatchResult[] {
  return LIGA3_GROUP_RESULTS;
}

const POINTS_WIN = 3;
const POINTS_LOSS = 0;

function parseSets(score: string): { setsA: number; setsB: number } {
  const parts = score.split(',').map((s) => s.trim().split('-').map(Number));
  let setsA = 0;
  let setsB = 0;
  for (const [a, b] of parts) {
    if (a > b) setsA++;
    else if (b > a) setsB++;
  }
  return { setsA, setsB };
}

/** Standings por jugador (solo fase de grupos) */
export interface Liga3StandingRow {
  playerId: string;
  playerName: string;
  PJ: number;
  PG: number;
  PP: number;
  setsWon: number;
  setsLost: number;
  setDiff: number;
  points: number;
  /** Cambio de posición respecto a la fecha anterior: +2 = subió 2, -1 = bajó 1 */
  positionChange?: number;
}

function buildGroupStandings(groupName: string, upToFecha?: number): Liga3StandingRow[] {
  const matches = LIGA3_GROUP_RESULTS.filter(
    (m) => m.groupName === groupName && (upToFecha == null || m.fecha <= upToFecha)
  );
  const map = new Map<string, Liga3StandingRow>();
  for (const m of matches) {
    const { setsA, setsB } = parseSets(m.score);
    for (const name of [m.playerA, m.playerB]) {
      if (!map.has(name)) {
        map.set(name, {
          playerId: getLiga3Id(name),
          playerName: name,
          PJ: 0,
          PG: 0,
          PP: 0,
          setsWon: 0,
          setsLost: 0,
          setDiff: 0,
          points: 0,
        });
      }
    }
    const rowA = map.get(m.playerA)!;
    const rowB = map.get(m.playerB)!;
    rowA.PJ++;
    rowB.PJ++;
    rowA.setsWon += setsA;
    rowA.setsLost += setsB;
    rowB.setsWon += setsB;
    rowB.setsLost += setsA;
    if (m.winner === m.playerA) {
      rowA.PG++;
      rowA.points += POINTS_WIN;
      rowB.PP++;
      rowB.points += POINTS_LOSS;
    } else {
      rowB.PG++;
      rowB.points += POINTS_WIN;
      rowA.PP++;
      rowA.points += POINTS_LOSS;
    }
  }
  const rows = Array.from(map.values()).map((r) => ({
    ...r,
    setDiff: r.setsWon - r.setsLost,
  }));
  rows.sort((a, b) => b.points - a.points || b.setDiff - a.setDiff);
  return rows;
}

export function getLiga3GroupStandings(): { name: string; rows: Liga3StandingRow[] }[] {
  const groups: { name: string; rows: Liga3StandingRow[] }[] = [];
  for (const name of ['Grupo A', 'Grupo B', 'Grupo C']) {
    const current = buildGroupStandings(name);
    const previous = buildGroupStandings(name, 4);
    const prevPosByPlayer = new Map<string, number>();
    previous.forEach((r, i) => prevPosByPlayer.set(r.playerId, i + 1));
    current.forEach((r, i) => {
      const prevPos = prevPosByPlayer.get(r.playerId);
      r.positionChange = prevPos != null ? prevPos - (i + 1) : undefined;
    });
    groups.push({ name, rows: current });
  }
  return groups;
}

/** Clasificación general del torneo (15 jugadores: grupos + eliminación). Para eliminación sumamos puntos por partidos jugados. */
export interface Liga3TournamentRankingRow {
  position: number;
  playerId: string;
  playerName: string;
  PJ: number;
  PG: number;
  PP: number;
  setsWon: number;
  setsLost: number;
  points: number;
}

/** Partidos del cuadro de eliminación (IDs internos l3-). Final sin winner. Orden: Q1,Q4,Q2,Q3 para que S1=Q1+Q4, S2=Q2+Q3. */
export const LIGA3_BRACKET_MATCHES: Array<{
  id: string;
  playerA: string;
  playerB: string;
  score: string;
  winnerId: string | null;
  round: string;
  scheduledDate?: string;
  scheduledTime?: string;
}> = [
  { id: 'l3-q1', playerA: 'l3-repecka', playerB: 'l3-volpe', score: '6-4, 6-3', winnerId: 'l3-repecka', round: 'Cuartos de final', scheduledDate: '2025-03-29', scheduledTime: '10:00' },
  { id: 'l3-q4', playerA: 'l3-delvalle', playerB: 'l3-rusel', score: '6-2, 7-6(3)', winnerId: 'l3-delvalle', round: 'Cuartos de final', scheduledDate: '2025-03-29', scheduledTime: '15:30' },
  { id: 'l3-q2', playerA: 'l3-marin', playerB: 'l3-santi-m', score: '7-5, 6-2', winnerId: 'l3-marin', round: 'Cuartos de final', scheduledDate: '2025-03-29', scheduledTime: '11:30' },
  { id: 'l3-q3', playerA: 'l3-vito', playerB: 'l3-bianco', score: '6-3, 6-4', winnerId: 'l3-vito', round: 'Cuartos de final', scheduledDate: '2025-03-29', scheduledTime: '14:00' },
  { id: 'l3-s1', playerA: 'l3-repecka', playerB: 'l3-delvalle', score: '6-3, 4-6, 6-2', winnerId: 'l3-repecka', round: 'Semifinales', scheduledDate: '2025-03-30', scheduledTime: '10:00' },
  { id: 'l3-s2', playerA: 'l3-marin', playerB: 'l3-vito', score: '7-6(4), 6-4', winnerId: 'l3-marin', round: 'Semifinales', scheduledDate: '2025-03-30', scheduledTime: '12:00' },
  { id: 'l3-f', playerA: 'l3-repecka', playerB: 'l3-marin', score: '', winnerId: null, round: 'Final', scheduledDate: '2025-04-06', scheduledTime: '17:00' },
];

/** Próximos partidos: solo la final */
export const LIGA3_UPCOMING_FINAL = [
  { id: 'l3-final', date: 'Domingo 6/4', time: '17:00', playerA: 'Repecka A.', playerB: 'Marin G.', group: 'Final', ballsByPlayerA: true },
];

/** Estado del torneo */
export const LIGA3_STATUS = 'FASE FINAL – A LA ESPERA DE LA FINAL';

/** Final pendiente */
export function getLiga3FinalMatch(): { playerA: string; playerB: string; date: string; time: string } {
  const f = LIGA3_BRACKET_MATCHES.find((m) => m.round === 'Final')!;
  const pa = getLiga3PlayerById(f.playerA);
  const pb = getLiga3PlayerById(f.playerB);
  return {
    playerA: pa?.name ?? f.playerA,
    playerB: pb?.name ?? f.playerB,
    date: 'Domingo 6 de abril',
    time: '17:00',
  };
}

/** Sistema de puntos Liga 3 */
export const LIGA3_POINTS_SYSTEM = [
  { result: 'Victoria', points: 3 },
  { result: 'Derrota', points: 0 },
];

/** Criterios de clasificación */
export const LIGA3_CLASSIFICATION_RULES =
  'Clasifican los mejores de cada grupo según: 1) Puntos; 2) Diferencia de sets; 3) Enfrentamiento directo.';

/** Calendario cronológico: grupos + eliminación */
export interface Liga3CalendarEntry {
  date: string;
  time: string;
  phase: string;
  result: string;
  playerA: string;
  playerB: string;
  group?: string;
}

export function getLiga3Calendar(): Liga3CalendarEntry[] {
  const entries: Liga3CalendarEntry[] = LIGA3_GROUP_RESULTS.map((m) => ({
    date: m.date,
    time: m.time,
    phase: `Fecha ${m.fecha} – ${m.groupName}`,
    result: m.score,
    playerA: m.playerA,
    playerB: m.playerB,
    group: m.groupName,
  }));
  const qf = LIGA3_BRACKET_MATCHES.filter((m) => m.round === 'Cuartos de final');
  const sf = LIGA3_BRACKET_MATCHES.filter((m) => m.round === 'Semifinales');
  const fin = LIGA3_BRACKET_MATCHES.find((m) => m.round === 'Final');
  for (const m of qf) {
    const pa = getLiga3PlayerById(m.playerA)?.name ?? m.playerA;
    const pb = getLiga3PlayerById(m.playerB)?.name ?? m.playerB;
    entries.push({ date: 'Sáb 29 Mar', time: m.scheduledTime ?? '', phase: 'Cuartos de final', result: m.score || '—', playerA: pa, playerB: pb });
  }
  for (const m of sf) {
    const pa = getLiga3PlayerById(m.playerA)?.name ?? m.playerA;
    const pb = getLiga3PlayerById(m.playerB)?.name ?? m.playerB;
    entries.push({ date: 'Dom 30 Mar', time: m.scheduledTime ?? '', phase: 'Semifinales', result: m.score || '—', playerA: pa, playerB: pb });
  }
  if (fin) {
    const pa = getLiga3PlayerById(fin.playerA)?.name ?? fin.playerA;
    const pb = getLiga3PlayerById(fin.playerB)?.name ?? fin.playerB;
    entries.push({ date: 'Dom 6 Abr', time: fin.scheduledTime ?? '', phase: 'Final', result: 'Pendiente', playerA: pa, playerB: pb });
  }
  return entries;
}

/** Puntos por fase de eliminación (mismo criterio que en Resumen/Reglamento). */
const LIGA3_ELIM_POINTS = { champion: 500, finalist: 350, semifinal: 200, quarterfinal: 100 } as const;

/** Ranking del torneo: solo puntos por fase superada (no por partidos ganados/perdidos). */
export function getLiga3TournamentRanking(): Liga3TournamentRankingRow[] {
  const groups = getLiga3GroupStandings();
  const allRows: Liga3StandingRow[] = groups.flatMap((g) => g.rows);
  const byId = new Map<string, Liga3StandingRow>();
  for (const r of allRows) {
    byId.set(r.playerId, { ...r });
  }
  for (const m of LIGA3_BRACKET_MATCHES) {
    if (m.winnerId) {
      for (const id of [m.playerA, m.playerB]) {
        if (!byId.has(id)) {
          const p = getLiga3PlayerById(id);
          byId.set(id, { playerId: id, playerName: p?.name ?? id, PJ: 0, PG: 0, PP: 0, setsWon: 0, setsLost: 0, setDiff: 0, points: 0 });
        }
        const row = byId.get(id)!;
        row.PJ++;
        if (m.winnerId === id) row.PG++;
        else row.PP++;
      }
    }
  }

  const finalMatch = LIGA3_BRACKET_MATCHES.find((m) => m.round === 'Final');
  const semifinals = LIGA3_BRACKET_MATCHES.filter((m) => m.round === 'Semifinales');
  const quarterfinals = LIGA3_BRACKET_MATCHES.filter((m) => m.round === 'Cuartos de final');

  const phasePoints = new Map<string, number>();
  for (const id of byId.keys()) {
    if (finalMatch && (finalMatch.playerA === id || finalMatch.playerB === id)) {
      phasePoints.set(id, finalMatch.winnerId === id ? LIGA3_ELIM_POINTS.champion : LIGA3_ELIM_POINTS.finalist);
    } else if (semifinals.some((m) => m.winnerId && (m.playerA === id || m.playerB === id) && m.winnerId !== id)) {
      phasePoints.set(id, LIGA3_ELIM_POINTS.semifinal);
    } else if (quarterfinals.some((m) => m.winnerId && (m.playerA === id || m.playerB === id) && m.winnerId !== id)) {
      phasePoints.set(id, LIGA3_ELIM_POINTS.quarterfinal);
    }
  }

  const list = Array.from(byId.values()).map((r) => ({
    position: 0,
    playerId: r.playerId,
    playerName: r.playerName,
    PJ: r.PJ,
    PG: r.PG,
    PP: r.PP,
    setsWon: r.setsWon,
    setsLost: r.setsLost,
    points: phasePoints.get(r.playerId) ?? 0,
  }));

  list.sort((a, b) => b.points - a.points || (b.setsWon - b.setsLost) - (a.setsWon - a.setsLost));
  list.forEach((r, i) => {
    r.position = i + 1;
  });
  return list;
}
