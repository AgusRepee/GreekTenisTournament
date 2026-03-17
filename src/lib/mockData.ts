/**
 * Central mock data for the tennis club tournament website.
 * Visitors only view information. No login.
 */

import {
  getLiga3PlayerById,
  getLiga3GroupStandings,
  getLiga3TournamentRanking,
  LIGA3_BRACKET_MATCHES,
  LIGA3_UPCOMING_FINAL,
  getLiga3GroupStageResults,
  getLiga3Calendar,
  LIGA3_STATUS,
  getLiga3FinalMatch,
  getLiga3Preclasificacion,
  LIGA3_POINTS_SYSTEM,
  LIGA3_CLASSIFICATION_RULES,
} from './liga3Data';

export const CATEGORIES = ['Primera', 'Segunda', 'Tercera', 'Cuarta', 'Quinta A', 'Quinta B'] as const;
export type CategoryKey = (typeof CATEGORIES)[number];

/** Ligas para selector en página Torneos (Liga 1 = Primera, etc.) */
export const LEAGUES = [1, 2, 3, 4, 5] as const;
export type LeagueNum = (typeof LEAGUES)[number];

export function categoryToLeague(cat: CategoryKey): LeagueNum {
  const map: Record<CategoryKey, LeagueNum> = {
    Primera: 1,
    Segunda: 2,
    Tercera: 3,
    Cuarta: 4,
    'Quinta A': 5,
    'Quinta B': 5,
  };
  return map[cat];
}

export type TournamentStatus = 'upcoming' | 'finished';

export interface PlayerStats {
  matchesPlayed: number;
  wins: number;
  losses: number;
}

export interface Player {
  id: string;
  name: string;
  category: CategoryKey;
  points: number;
  stats: PlayerStats;
  /** YYYY-MM-DD */
  birthDate?: string;
  nationality?: string;
  /** Derecha | Zurdo */
  playingHand?: 'Derecha' | 'Zurdo';
  /** Golpe principal */
  mainShot?: string;
  titles?: number;
  runnerUps?: number;
  /** Best global ranking position ever (e.g. 1). */
  bestGlobalPosition?: number;
  /** Promotion/relegation history for profile. */
  promotionHistory?: PromotionHistoryEntry[];
  /** Profile photo filename in /img (e.g. 'juan.png'). */
  profileImage?: string;
}

export interface Tournament {
  id: string;
  name: string;
  category: CategoryKey;
  status: TournamentStatus;
  startDate: string;
  endDate: string;
  location: string;
  winnerId?: string | null;
  finalistId?: string | null;
  matchCount: number;
  /** Cover image filename in /img (e.g. 'novak.png') */
  coverImage?: string;
  /** Liga 1-5 for filter; defaults from category if not set */
  league?: LeagueNum;
  /** Total slots (cupos) for upcoming tournaments */
  slotsTotal?: number;
  /** Taken slots for upcoming tournaments */
  slotsTaken?: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  playerA: string;
  playerB: string;
  score: string;
  winnerId: string | null;
  round?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface BracketRounds {
  quarterfinals: Match[];
  semifinals: Match[];
  final: Match[];
}

export interface GroupTableRow {
  playerId: string;
  PJ: number;
  PG: number;
  PP: number;
  points: number;
}

export interface GroupTable {
  name: string;
  rows: GroupTableRow[];
}

/** Group stage row with set statistics (for tournament group tables) */
export interface GroupTableRowWithSets {
  position: number;
  playerId: string;
  PJ: number;
  setsWon: number;
  setsLost: number;
  setDiff: number;
  /** Optional: for Liga 3 group tables */
  PG?: number;
  PP?: number;
  points?: number;
  /** Cambio de posición desde la última fecha: +2 = subió 2, -1 = bajó 1 (Liga 3) */
  positionChange?: number;
}

export interface GroupTableWithSets {
  name: string;
  rows: GroupTableRowWithSets[];
}

export interface UpcomingMatchDisplay {
  id: string;
  date: string;
  time: string;
  playerA: string;
  playerB: string;
  round?: string;
  /** Group label e.g. "Grupo A" for Liga 3 upcoming */
  group?: string;
  /** true = playerA brings balls, false = playerB (tennis ball icon) */
  ballsByPlayerA?: boolean;
}

/** One match line in a group fixture: "PlayerA (P) vs PlayerB" */
export interface GroupFixtureMatch {
  playerA: string;
  playerB: string;
  ballsByA: boolean;
}

/** One round (Fecha) in a group: list of matches + optional libre */
export interface GroupFecha {
  fecha: number;
  matches: GroupFixtureMatch[];
  libre?: string;
}

/** Full fixture for one group (e.g. Grupo A) */
export interface GroupStageGroup {
  name: string;
  fechas: GroupFecha[];
}

/** Scheduled/featured match for display (no live data) */
export interface ScheduledMatch {
  id: string;
  label: string;
  playerA: string;
  playerB: string;
  category: string;
  dateTime: string;
  round: string;
  /** Short date for cards e.g. "dom 21 abr" */
  date?: string;
  /** Time e.g. "10:00" */
  time?: string;
}

export interface RankingRow {
  position: number;
  playerId: string;
  player: Player;
  points: number;
  matchesPlayed: number;
  wins: number;
  losses: number;
  /** Optional: sets won in tournament (e.g. Liga 3) */
  setsWon?: number;
  /** Optional: sets lost in tournament (e.g. Liga 3) */
  setsLost?: number;
  /** Change vs previous week: positive = up, negative = down, 0 = no change */
  rankingChange?: number;
  /** Net change in points since last update: positive = gained, negative = lost */
  pointsChange?: number;
  /** Player age (from birthDate) */
  age?: number;
  /** Number of tournaments played (for ranking table) */
  tournamentsPlayed?: number;
  /** League number (1-5) for display as "Liga N" */
  leagueNum?: LeagueNum;
}

/** Leagues shown in ranking filter (Liga 1–4). */
export const LEAGUES_RANKING: LeagueNum[] = [1, 2, 3, 4];

export interface PromotionHistoryEntry {
  year: number;
  type: 'promotion' | 'relegation';
  toLeague: LeagueNum;
  fromLeague?: LeagueNum;
}

// ---- Sample players (one per category as specified) ----
const PLAYERS_BY_CATEGORY: Record<CategoryKey, string[]> = {
  Primera: ['Juan Perez', 'Martin Lopez', 'Tomas Alvarez', 'Federico Ruiz'],
  Segunda: ['Nicolas Gomez', 'Diego Silva', 'Lucas Fernandez', 'Mariano Ortiz'],
  Tercera: ['Pablo Diaz', 'Ricardo Mendez', 'Franco Torres'],
  Cuarta: ['Javier Castro', 'Matias Suarez', 'Bruno Vega'],
  'Quinta A': ['Kevin Rojas', 'Gonzalo Paz', 'Lucas Romero'],
  'Quinta B': ['Nicolas Lara', 'Brian Soto', 'Tomas Rivas'],
};

const PLAYER_PROFILES: Partial<Player>[] = [
  { birthDate: '1990-05-12', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 3, runnerUps: 2 },
  { birthDate: '1988-11-03', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Reves', titles: 2, runnerUps: 1 },
  { birthDate: '1992-07-22', nationality: 'Argentina', playingHand: 'Zurdo', mainShot: 'Derecha', titles: 1, runnerUps: 3 },
  { birthDate: '1985-01-15', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 5, runnerUps: 1 },
  { birthDate: '1994-09-08', nationality: 'Uruguay', playingHand: 'Derecha', mainShot: 'Reves', titles: 0, runnerUps: 2 },
  { birthDate: '1991-03-30', nationality: 'Argentina', playingHand: 'Zurdo', mainShot: 'Derecha', titles: 1, runnerUps: 0 },
  { birthDate: '1989-12-10', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 2, runnerUps: 2 },
  { birthDate: '1993-06-18', nationality: 'Chile', playingHand: 'Derecha', mainShot: 'Reves', titles: 0, runnerUps: 1 },
  { birthDate: '1987-04-25', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 1, runnerUps: 1 },
  { birthDate: '1995-08-02', nationality: 'Argentina', playingHand: 'Zurdo', mainShot: 'Derecha', titles: 0, runnerUps: 0 },
  { birthDate: '1990-10-14', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Reves', titles: 0, runnerUps: 0 },
  { birthDate: '1986-02-28', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 2, runnerUps: 1 },
  { birthDate: '1992-11-20', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 1, runnerUps: 0 },
  { birthDate: '1988-05-07', nationality: 'Paraguay', playingHand: 'Zurdo', mainShot: 'Derecha', titles: 0, runnerUps: 0 },
  { birthDate: '1994-01-12', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Reves', titles: 0, runnerUps: 0 },
  { birthDate: '1991-07-05', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 0, runnerUps: 0 },
  { birthDate: '1989-09-30', nationality: 'Argentina', playingHand: 'Zurdo', mainShot: 'Derecha', titles: 0, runnerUps: 0 },
  { birthDate: '1993-03-15', nationality: 'Argentina', playingHand: 'Derecha', mainShot: 'Derecha', titles: 0, runnerUps: 0 },
];

function buildPlayers(): Player[] {
  const list: Player[] = [];
  let id = 0;
  (CATEGORIES as readonly string[]).forEach((cat, catIdx) => {
    const names = PLAYERS_BY_CATEGORY[cat as CategoryKey];
    names.forEach((name, i) => {
      const wins = 5 + Math.floor(Math.random() * 12);
      const losses = 2 + Math.floor(Math.random() * 8);
      const profile = PLAYER_PROFILES[id % PLAYER_PROFILES.length];
      list.push({
        id: `p-${id}`,
        name,
        category: cat as CategoryKey,
        points: 800 - catIdx * 80 - i * 40 + Math.floor(Math.random() * 30),
        stats: { matchesPlayed: wins + losses, wins, losses },
        birthDate: profile?.birthDate,
        nationality: profile?.nationality,
        playingHand: profile?.playingHand,
        mainShot: profile?.mainShot,
        titles: profile?.titles ?? 0,
        runnerUps: profile?.runnerUps ?? 0,
      });
      id++;
    });
  });
  return list.sort((a, b) => b.points - a.points);
}

export const players: Player[] = buildPlayers();

/** Returns start/end dates for "current" period (ongoing now) so tournaments appear in progress. */
function getCurrentPeriodDates(): { startDate: string; endDate: string } {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 7);
  const end = new Date(today);
  end.setDate(end.getDate() + 21);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
}

const currentPeriod = getCurrentPeriodDates();

// ---- Tournaments: Novak Djokovic Liga 1–5 (current) + upcoming + finished ----
export const tournaments: Tournament[] = [
  { id: 't-novak', name: 'Novak Djokovic - Liga 1', category: 'Primera', status: 'upcoming', startDate: currentPeriod.startDate, endDate: currentPeriod.endDate, location: 'Club de Tenis — Pistas centrales', matchCount: 16, coverImage: 'novak.png', league: 1, slotsTotal: 8, slotsTaken: 6 },
  { id: 't-novak-l2', name: 'Novak Djokovic - Liga 2', category: 'Segunda', status: 'upcoming', startDate: currentPeriod.startDate, endDate: currentPeriod.endDate, location: 'Club de Tenis', matchCount: 16, coverImage: 'novak.png', league: 2, slotsTotal: 8, slotsTaken: 5 },
  { id: 't-novak-l3', name: 'Novak Djokovic - Liga 3', category: 'Tercera', status: 'upcoming', startDate: currentPeriod.startDate, endDate: currentPeriod.endDate, location: 'Club de Tenis', matchCount: 16, coverImage: 'novak.png', league: 3, slotsTotal: 8, slotsTaken: 4 },
  { id: 't-novak-l4', name: 'Novak Djokovic - Liga 4', category: 'Cuarta', status: 'upcoming', startDate: currentPeriod.startDate, endDate: currentPeriod.endDate, location: 'Club de Tenis', matchCount: 16, league: 4, slotsTotal: 8, slotsTaken: 3 },
  { id: 't-novak-l5', name: 'Novak Djokovic - Liga 5', category: 'Quinta A', status: 'upcoming', startDate: currentPeriod.startDate, endDate: currentPeriod.endDate, location: 'Club de Tenis', matchCount: 20, league: 5, slotsTotal: 12, slotsTaken: 8 },
  { id: 't-nadal', name: 'Torneo Rafael Nadal', category: 'Primera', status: 'upcoming', startDate: '2025-05-10', endDate: '2025-05-18', location: 'Club de Tenis', matchCount: 16, coverImage: 'nadal.png', league: 1, slotsTotal: 8, slotsTaken: 2 },
  { id: 't-federer', name: 'Torneo Roger Federer', category: 'Primera', status: 'upcoming', startDate: '2025-06-01', endDate: '2025-06-09', location: 'Club de Tenis', matchCount: 16, coverImage: 'federer.png', league: 1, slotsTotal: 8, slotsTaken: 5 },
  { id: 't-1', name: 'Torneo de Otoño', category: 'Primera', status: 'upcoming', startDate: '2025-04-15', endDate: '2025-04-22', location: 'Club de Tenis — Pistas centrales', matchCount: 16, league: 1, slotsTotal: 8, slotsTaken: 7 },
  { id: 't-2', name: 'Copa Primera', category: 'Primera', status: 'upcoming', startDate: '2025-05-01', endDate: '2025-05-08', location: 'Club de Tenis', matchCount: 12, league: 1, slotsTotal: 8, slotsTaken: 4 },
  { id: 't-3', name: 'Torneo Quinta A y B', category: 'Quinta A', status: 'upcoming', startDate: '2025-05-10', endDate: '2025-05-12', location: 'Club de Tenis', matchCount: 20, league: 5, slotsTotal: 12, slotsTaken: 9 },
  { id: 't-4', name: 'Campeonato Segunda', category: 'Segunda', status: 'finished', startDate: '2024-02-01', endDate: '2024-02-10', location: 'Club de Tenis', winnerId: 'p-4', finalistId: 'p-5', matchCount: 16, league: 2 },
  { id: 't-5', name: 'Torneo Verano 2024', category: 'Tercera', status: 'finished', startDate: '2024-01-10', endDate: '2024-01-18', location: 'Club de Tenis', winnerId: 'p-7', finalistId: 'p-8', matchCount: 14, league: 3 },
  // Torneos de Juan Pérez (ejemplo perfil completo): títulos y finales
  { id: 't-jp-1', name: 'Copa Primavera 2023', category: 'Primera', status: 'finished', startDate: '2023-09-15', endDate: '2023-09-24', location: 'Club de Tenis', winnerId: 'p-0', finalistId: 'p-1', matchCount: 16, league: 1 },
  { id: 't-jp-2', name: 'Torneo Apertura 2024', category: 'Primera', status: 'finished', startDate: '2024-03-01', endDate: '2024-03-10', location: 'Club de Tenis', winnerId: 'p-0', finalistId: 'p-2', matchCount: 16, league: 1 },
  { id: 't-jp-3', name: 'Campeonato de Verano 2023', category: 'Primera', status: 'finished', startDate: '2023-01-08', endDate: '2023-01-15', location: 'Sede Central', winnerId: 'p-0', finalistId: 'p-3', matchCount: 12, league: 1 },
  { id: 't-jp-4', name: 'Copa Otoño 2023', category: 'Primera', status: 'finished', startDate: '2023-04-10', endDate: '2023-04-18', location: 'Club de Tenis', winnerId: 'p-0', finalistId: 'p-1', matchCount: 14, league: 1 },
  { id: 't-jp-5', name: 'Torneo Fin de Año 2022', category: 'Primera', status: 'finished', startDate: '2022-12-01', endDate: '2022-12-09', location: 'Club de Tenis', winnerId: 'p-2', finalistId: 'p-0', matchCount: 16, league: 1 },
  { id: 't-jp-6', name: 'Masters Primera 2023', category: 'Primera', status: 'finished', startDate: '2023-11-02', endDate: '2023-11-12', location: 'Pistas centrales', winnerId: 'p-0', finalistId: 'p-4', matchCount: 16, league: 1 },
];

// ---- Scheduled featured / upcoming important matches (no live) ----
export const featuredMatches: ScheduledMatch[] = [
  { id: 'sm-1', label: 'Final de Primera', playerA: 'Juan Perez', playerB: 'Martin Lopez', category: 'Primera', dateTime: 'Sábado 20 Abr, 11:00', round: 'Final', date: 'sáb 20 abr', time: '11:00' },
  { id: 'sm-2', label: 'Semifinal Quinta A', playerA: 'Kevin Rojas', playerB: 'Gonzalo Paz', category: 'Quinta A', dateTime: 'Domingo 21 Abr, 10:00', round: 'Semifinal', date: 'dom 21 abr', time: '10:00' },
  { id: 'sm-3', label: 'Partido destacado del fin de semana', playerA: 'Tomas Alvarez', playerB: 'Federico Ruiz', category: 'Primera', dateTime: 'Sábado 20 Abr, 16:00', round: 'Semifinal', date: 'sáb 20 abr', time: '16:00' },
];

export const upcomingImportantMatches: ScheduledMatch[] = [
  { id: 'sm-4', label: 'Cuartos de final Segunda', playerA: 'Nicolas Gomez', playerB: 'Diego Silva', category: 'Segunda', dateTime: 'Viernes 19 Abr, 18:00', round: 'Cuartos', date: 'vie 19 abr', time: '18:00' },
  { id: 'sm-5', label: 'Semifinal Tercera', playerA: 'Pablo Diaz', playerB: 'Ricardo Mendez', category: 'Tercera', dateTime: 'Domingo 21 Abr, 12:00', round: 'Semifinal', date: 'dom 21 abr', time: '12:00' },
];

// ---- Matches (results + bracket + scheduled) ----
export const matches: Match[] = [
  // t-novak bracket: quarterfinals (4), semifinals (2), final (1)
  { id: 'mb-q1', tournamentId: 't-novak', playerA: 'p-0', playerB: 'p-1', score: '6-4, 6-3', winnerId: 'p-0', round: 'Cuartos de final' },
  { id: 'mb-q2', tournamentId: 't-novak', playerA: 'p-2', playerB: 'p-3', score: '7-5, 6-2', winnerId: 'p-2', round: 'Cuartos de final' },
  { id: 'mb-q3', tournamentId: 't-novak', playerA: 'p-4', playerB: 'p-5', score: '', winnerId: null, round: 'Cuartos de final', scheduledDate: '2024-04-22', scheduledTime: '10:00' },
  { id: 'mb-q4', tournamentId: 't-novak', playerA: 'p-6', playerB: 'p-7', score: '', winnerId: null, round: 'Cuartos de final', scheduledDate: '2024-04-22', scheduledTime: '12:00' },
  { id: 'mb-s1', tournamentId: 't-novak', playerA: 'p-0', playerB: 'p-2', score: '6-2, 4-6, 6-4', winnerId: 'p-0', round: 'Semifinales' },
  { id: 'mb-s2', tournamentId: 't-novak', playerA: 'p-4', playerB: 'p-6', score: '', winnerId: null, round: 'Semifinales', scheduledDate: '2024-04-25', scheduledTime: '11:00' },
  { id: 'mb-f', tournamentId: 't-novak', playerA: 'p-0', playerB: 'p-4', score: '', winnerId: null, round: 'Final', scheduledDate: '2024-04-28', scheduledTime: '15:00' },
  // t-4, t-5
  { id: 'm-1', tournamentId: 't-4', playerA: 'p-4', playerB: 'p-5', score: '6-4, 6-3', winnerId: 'p-4', round: 'Final' },
  { id: 'm-2', tournamentId: 't-4', playerA: 'p-6', playerB: 'p-7', score: '7-5, 4-6, 6-2', winnerId: 'p-6', round: 'Semifinal' },
  { id: 'm-3', tournamentId: 't-5', playerA: 'p-7', playerB: 'p-8', score: '6-2, 6-4', winnerId: 'p-7', round: 'Final' },
  { id: 'm-4', tournamentId: 't-1', playerA: 'p-0', playerB: 'p-1', score: '', winnerId: null, round: 'Cuartos', scheduledDate: '2024-04-18', scheduledTime: '09:00' },
  { id: 'm-5', tournamentId: 't-1', playerA: 'p-2', playerB: 'p-3', score: '', winnerId: null, round: 'Cuartos', scheduledDate: '2024-04-18', scheduledTime: '11:00' },
  // Partidos recientes de Juan Pérez (p-0) con fase para perfil de ejemplo
  { id: 'm-jp-1', tournamentId: 't-novak', playerA: 'p-0', playerB: 'p-4', score: '7-5, 6-3', winnerId: 'p-0', round: 'Final' },
  { id: 'm-jp-2', tournamentId: 't-novak', playerA: 'p-0', playerB: 'p-2', score: '6-2, 4-6, 6-4', winnerId: 'p-0', round: 'Semifinales' },
  { id: 'm-jp-3', tournamentId: 't-novak', playerA: 'p-0', playerB: 'p-1', score: '6-4, 6-3', winnerId: 'p-0', round: 'Cuartos de final' },
  { id: 'm-jp-4', tournamentId: 't-jp-2', playerA: 'p-0', playerB: 'p-2', score: '6-3, 7-6(4)', winnerId: 'p-0', round: 'Final' },
  { id: 'm-jp-5', tournamentId: 't-jp-2', playerA: 'p-0', playerB: 'p-3', score: '4-6, 6-4, 6-2', winnerId: 'p-0', round: 'Semifinales' },
  { id: 'm-jp-6', tournamentId: 't-jp-2', playerA: 'p-0', playerB: 'p-1', score: '6-2, 6-4', winnerId: 'p-0', round: 'Cuartos de final' },
  { id: 'm-jp-7', tournamentId: 't-jp-1', playerA: 'p-0', playerB: 'p-1', score: '7-6(2), 6-4', winnerId: 'p-0', round: 'Final' },
  { id: 'm-jp-8', tournamentId: 't-jp-1', playerA: 'p-0', playerB: 'p-2', score: '6-4, 6-1', winnerId: 'p-0', round: 'Semifinales' },
  { id: 'm-jp-9', tournamentId: 't-jp-5', playerA: 'p-0', playerB: 'p-2', score: '6-7(5), 6-4, 3-6', winnerId: 'p-2', round: 'Final' },
];

/** Novak Djokovic – Liga 3: group stage fixtures (3 groups × 5 fechas) */
export const LIGA3_GROUP_FIXTURES: GroupStageGroup[] = [
  {
    name: 'Grupo A',
    fechas: [
      { fecha: 1, matches: [{ playerA: 'Pusterla P.', playerB: 'Santi M.', ballsByA: true }, { playerA: 'Rusel S.', playerB: 'Bocchicchio F.', ballsByA: true }], libre: 'Repecka A.' },
      { fecha: 2, matches: [{ playerA: 'Bocchicchio F.', playerB: 'Pusterla P.', ballsByA: true }, { playerA: 'Rusel S.', playerB: 'Repecka A.', ballsByA: true }], libre: 'Santi M.' },
      { fecha: 3, matches: [{ playerA: 'Pusterla P.', playerB: 'Rusel S.', ballsByA: true }, { playerA: 'Repecka A.', playerB: 'Santi M.', ballsByA: true }], libre: 'Bocchicchio F.' },
      { fecha: 4, matches: [{ playerA: 'Repecka A.', playerB: 'Pusterla P.', ballsByA: true }, { playerA: 'Santi M.', playerB: 'Bocchicchio F.', ballsByA: true }], libre: 'Rusel S.' },
      { fecha: 5, matches: [{ playerA: 'Santi M.', playerB: 'Rusel S.', ballsByA: true }, { playerA: 'Bocchicchio F.', playerB: 'Repecka A.', ballsByA: true }], libre: 'Pusterla P.' },
    ],
  },
  {
    name: 'Grupo B',
    fechas: [
      { fecha: 1, matches: [{ playerA: 'Marin G.', playerB: 'Fernandez B.', ballsByA: true }, { playerA: 'Casadio M.', playerB: 'Volpe S.', ballsByA: true }], libre: 'Bianco D.' },
      { fecha: 2, matches: [{ playerA: 'Volpe S.', playerB: 'Marin G.', ballsByA: true }, { playerA: 'Casadio M.', playerB: 'Bianco D.', ballsByA: true }], libre: 'Fernandez B.' },
      { fecha: 3, matches: [{ playerA: 'Marin G.', playerB: 'Casadio M.', ballsByA: true }, { playerA: 'Bianco D.', playerB: 'Fernandez B.', ballsByA: true }], libre: 'Volpe S.' },
      { fecha: 4, matches: [{ playerA: 'Bianco D.', playerB: 'Marin G.', ballsByA: true }, { playerA: 'Fernandez B.', playerB: 'Volpe S.', ballsByA: true }], libre: 'Casadio M.' },
      { fecha: 5, matches: [{ playerA: 'Fernandez B.', playerB: 'Casadio M.', ballsByA: true }, { playerA: 'Volpe S.', playerB: 'Bianco D.', ballsByA: true }], libre: 'Marin G.' },
    ],
  },
  {
    name: 'Grupo C',
    fechas: [
      { fecha: 1, matches: [{ playerA: 'Vito C.', playerB: 'Santi G.', ballsByA: true }, { playerA: 'Del Valle G.', playerB: 'Ferreres G.', ballsByA: true }], libre: 'Komesu F.' },
      { fecha: 2, matches: [{ playerA: 'Ferreres G.', playerB: 'Vito C.', ballsByA: true }, { playerA: 'Del Valle G.', playerB: 'Komesu F.', ballsByA: true }], libre: 'Santi G.' },
      { fecha: 3, matches: [{ playerA: 'Vito C.', playerB: 'Del Valle G.', ballsByA: true }, { playerA: 'Komesu F.', playerB: 'Santi G.', ballsByA: true }], libre: 'Ferreres G.' },
      { fecha: 4, matches: [{ playerA: 'Komesu F.', playerB: 'Vito C.', ballsByA: true }, { playerA: 'Santi G.', playerB: 'Ferreres G.', ballsByA: true }], libre: 'Del Valle G.' },
      { fecha: 5, matches: [{ playerA: 'Santi G.', playerB: 'Del Valle G.', ballsByA: true }, { playerA: 'Ferreres G.', playerB: 'Komesu F.', ballsByA: true }], libre: 'Vito C.' },
    ],
  },
];

/** Upcoming matches for Novak Djokovic – Liga 3: solo la final (Próximos partidos – Liga 3) */
export const LIGA3_UPCOMING: UpcomingMatchDisplay[] = LIGA3_UPCOMING_FINAL;

/** Partidos del cuadro de eliminación Liga 3 para getBracketRounds / bracket */
const LIGA3_MATCHES: Match[] = LIGA3_BRACKET_MATCHES.map((m) => ({
  id: m.id,
  tournamentId: 't-novak-l3',
  playerA: m.playerA,
  playerB: m.playerB,
  score: m.score,
  winnerId: m.winnerId,
  round: m.round,
  scheduledDate: m.scheduledDate,
  scheduledTime: m.scheduledTime,
}));

/** Playoff classification rules text for Liga 3 */
export const LIGA3_PLAYOFF_RULES =
  'Los tres primeros de cada Grupo pasan a la Fase de Eliminación Directa.\n\nLos dos peores terceros juegan entre sí un Repechaje.\n\nEl ganador de ese partido avanza a Cuartos de Final junto con el resto de los clasificados y se enfrentará al mejor primero.';

/** Novak Djokovic – Liga 4: group stage fixtures (3 groups × 3 fechas + Fecha 4 Interzonal) */
export const LIGA4_GROUP_FIXTURES: GroupStageGroup[] = [
  {
    name: 'Grupo A',
    fechas: [
      { fecha: 1, matches: [{ playerA: 'Chantada M.', playerB: 'Beitia J.', ballsByA: true }, { playerA: 'Malcangi R.', playerB: 'Cardozo M.', ballsByA: true }] },
      { fecha: 2, matches: [{ playerA: 'Chantada M.', playerB: 'Malcangi R.', ballsByA: true }, { playerA: 'Cardozo M.', playerB: 'Beitia J.', ballsByA: true }] },
      { fecha: 3, matches: [{ playerA: 'Cardozo M.', playerB: 'Chantada M.', ballsByA: true }, { playerA: 'Beitia J.', playerB: 'Malcangi R.', ballsByA: true }] },
    ],
  },
  {
    name: 'Grupo B',
    fechas: [
      { fecha: 1, matches: [{ playerA: 'Anetta D.', playerB: 'Vera F.', ballsByA: true }, { playerA: 'Blanco J.', playerB: 'Repecka J.', ballsByA: true }] },
      { fecha: 2, matches: [{ playerA: 'Blanco J.', playerB: 'Anetta D.', ballsByA: true }, { playerA: 'Vera F.', playerB: 'Repecka J.', ballsByA: true }] },
      { fecha: 3, matches: [{ playerA: 'Repecka J.', playerB: 'Anetta D.', ballsByA: true }, { playerA: 'Bianco D.', playerB: 'Fernandez B.', ballsByA: true }] },
    ],
  },
  {
    name: 'Grupo C',
    fechas: [
      { fecha: 1, matches: [{ playerA: 'Bernardini G.', playerB: 'Murchio M.', ballsByA: true }, { playerA: 'Cellilli M.', playerB: 'Garcia J.', ballsByA: true }] },
      { fecha: 2, matches: [{ playerA: 'Bernardini G.', playerB: 'Cellilli M.', ballsByA: true }, { playerA: 'Murchio M.', playerB: 'Garcia J.', ballsByA: true }] },
      { fecha: 3, matches: [{ playerA: 'Garcia J.', playerB: 'Bernardini G.', ballsByA: true }, { playerA: 'Murchio M.', playerB: 'Cellilli M.', ballsByA: true }] },
    ],
  },
  {
    name: 'Fecha 4 (Interzonal)',
    fechas: [
      {
        fecha: 4,
        matches: [
          { playerA: 'Cellilli M.', playerB: 'Chantada M.', ballsByA: true },
          { playerA: 'Beitia J.', playerB: 'Bernardini G.', ballsByA: true },
          { playerA: 'Malcangi R.', playerB: 'Blanco J.', ballsByA: true },
          { playerA: 'Repecka J.', playerB: 'Cardozo M.', ballsByA: true },
          { playerA: 'Anetta D.', playerB: 'Murchio M.', ballsByA: true },
          { playerA: 'Garcia J.', playerB: 'Vera F.', ballsByA: true },
        ],
      },
    ],
  },
];

/** Ball responsibility note for group fixture (P) */
export const GROUP_FIXTURE_BALL_NOTE = '(P): Jugador asignado para llevar pelotas en ese partido.';

// ---- Default tournament rules and points ----
export const DEFAULT_TOURNAMENT_RULES = [
  'Partidos al mejor de 3 sets.',
  'Super tie-break en el tercer set (a 10 puntos).',
  'Tolerancia de 15 minutos de llegada.',
];

/** Rule about who brings the balls (logo next to name). */
export const BALL_RULE_TEXT =
  'El jugador o pareja que tenga el logo del torneo junto a su nombre deberá llevar las pelotas para ese partido.';

/** Critical rule: late arrival may result in walkover. */
export const LATE_ARRIVAL_RULE_TITLE = 'Llegada tarde';
export const LATE_ARRIVAL_RULE_TEXT =
  'Si un jugador llega tarde más allá del tiempo de tolerancia, el partido puede declararse WALKOVER.';

export const DEFAULT_POINTS_SYSTEM = [
  { position: 'Campeón', points: 100 },
  { position: 'Finalista', points: 70 },
  { position: 'Semifinal', points: 40 },
  { position: 'Cuartos de final', points: 20 },
  { position: 'Participación', points: 5 },
];

/** Tournament schedule phases with current-looking dates (relative to today). */
export function getTournamentSchedulePhases(): { phase: string; dateLabel: string }[] {
  const today = new Date();
  const fmt = (d: Date) => d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  const d1 = new Date(today);
  const d2 = new Date(today);
  d2.setDate(d2.getDate() + 7);
  const d3 = new Date(today);
  d3.setDate(d3.getDate() + 14);
  const d4 = new Date(today);
  d4.setDate(d4.getDate() + 18);
  const d5 = new Date(today);
  d5.setDate(d5.getDate() + 21);
  const d6 = new Date(today);
  d6.setDate(d6.getDate() + 25);
  return [
    { phase: 'Semana 1', dateLabel: fmt(d1) },
    { phase: 'Semana 2', dateLabel: fmt(d2) },
    { phase: 'Semana 3', dateLabel: fmt(d3) },
    { phase: 'Cuartos de final', dateLabel: fmt(d4) },
    { phase: 'Semifinales', dateLabel: fmt(d5) },
    { phase: 'Final', dateLabel: fmt(d6) },
  ];
}

const playerMap = new Map(players.map(p => [p.id, p]));

// Mock: best ranking, promotion/relegation and profile image
(function patchMockProfileData() {
  const p4 = playerMap.get('p-4');
  if (p4) {
    p4.bestGlobalPosition = 1;
    p4.promotionHistory = [{ year: 2025, type: 'promotion', toLeague: 2, fromLeague: 3 }];
  }
  const p6 = playerMap.get('p-6');
  if (p6) {
    p6.bestGlobalPosition = 2;
    p6.promotionHistory = [{ year: 2024, type: 'relegation', toLeague: 2, fromLeague: 1 }];
  }
  const p0 = playerMap.get('p-0');
  if (p0) {
    p0.bestGlobalPosition = 1;
    p0.profileImage = 'juan.png';
    p0.titles = 5;
    p0.runnerUps = 2;
    p0.stats = { matchesPlayed: 42, wins: 28, losses: 14 };
    p0.points = 720;
    p0.promotionHistory = [{ year: 2021, type: 'promotion', toLeague: 1, fromLeague: 2 }];
  }
  const p7 = playerMap.get('p-7');
  if (p7) {
    p7.promotionHistory = [{ year: 2025, type: 'promotion', toLeague: 2, fromLeague: 3 }];
  }
})();

export function getPlayerById(id: string): Player | undefined {
  if (id.startsWith('l3-')) {
    const p = getLiga3PlayerById(id);
    return p
      ? { id: p.id, name: p.name, category: 'Tercera', points: 0, stats: { matchesPlayed: 0, wins: 0, losses: 0 } }
      : undefined;
  }
  return playerMap.get(id);
}

export function getCurrentTournament(): Tournament | undefined {
  return tournaments.find(t => t.status === 'upcoming' && isTournamentCurrent(t));
}

export function searchPlayersByName(query: string): Player[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return players.filter(p => p.name.toLowerCase().includes(q)).slice(0, 20);
}

export function getPlayersByFilters(category: CategoryKey | 'all'): Player[] {
  return players
    .filter(p => category === 'all' || p.category === category)
    .sort((a, b) => b.points - a.points);
}

/** Stable mock ranking change from player id (so UI shows variety: up/down/unchanged). */
function getMockRankingChange(playerId: string): number {
  const hash = playerId.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  const mod = Math.abs(hash % 5);
  return mod === 0 ? 0 : mod === 1 ? 1 : mod === 2 ? 2 : mod === 3 ? -1 : -2;
}

/** Mock points change (positive = gained, negative = lost) for ranking display. */
function getMockPointsChange(playerId: string): number {
  const hash = playerId.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  const mod = Math.abs(hash % 7);
  if (mod === 0) return 0;
  if (mod <= 2) return 50 + (hash % 3) * 50;
  if (mod <= 4) return -50 - (Math.abs(hash) % 3) * 50;
  return 250;
}

/** Mock tournaments played (e.g. 18–26) for ranking display. */
function getMockTournamentsPlayed(playerId: string): number {
  const hash = playerId.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  return 18 + (Math.abs(hash) % 9);
}

/** Age from birthDate (YYYY-MM-DD). */
export function getPlayerAge(birthDate: string | undefined): number | undefined {
  if (!birthDate) return undefined;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function getRankings(category: CategoryKey | 'all'): RankingRow[] {
  const filtered = getPlayersByFilters(category);
  return filtered.map((player, i) => ({
    position: i + 1,
    playerId: player.id,
    player,
    points: player.points,
    matchesPlayed: player.stats.matchesPlayed,
    wins: player.stats.wins,
    losses: player.stats.losses,
    rankingChange: getMockRankingChange(player.id),
    pointsChange: getMockPointsChange(player.id),
    age: getPlayerAge(player.birthDate),
    tournamentsPlayed: getMockTournamentsPlayed(player.id),
    leagueNum: categoryToLeague(player.category),
  }));
}

/** Get players in a league (or all) sorted by points. */
function getPlayersByLeague(league: LeagueNum | 'all'): Player[] {
  if (league === 'all') {
    return [...players].sort((a, b) => b.points - a.points);
  }
  return players
    .filter(p => categoryToLeague(p.category) === league)
    .sort((a, b) => b.points - a.points);
}

/** Global ranking or per-league ranking. Use for main ranking page with filter [Todos, Liga 1, Liga 2, Liga 3, Liga 4]. */
export function getRankingsByLeague(league: LeagueNum | 'all'): RankingRow[] {
  const filtered = getPlayersByLeague(league);
  return filtered.map((player, i) => ({
    position: i + 1,
    playerId: player.id,
    player,
    points: player.points,
    matchesPlayed: player.stats.matchesPlayed,
    wins: player.stats.wins,
    losses: player.stats.losses,
    rankingChange: getMockRankingChange(player.id),
    pointsChange: getMockPointsChange(player.id),
    age: getPlayerAge(player.birthDate),
    tournamentsPlayed: getMockTournamentsPlayed(player.id),
    leagueNum: categoryToLeague(player.category),
  }));
}

/** Tournament seeds (preclasificados) by ranking within the tournament's league. */
export function getTournamentSeeds(tournamentId: string): { seed: number; playerId: string; player: Player }[] {
  const t = getTournamentById(tournamentId);
  if (!t) return [];
  const league = t.league ?? categoryToLeague(t.category);
  const leaguePlayers = getPlayersByLeague(league);
  return leaguePlayers.slice(0, 16).map((player, i) => ({
    seed: i + 1,
    playerId: player.id,
    player,
  }));
}

/** Seed (1-based) of a player in a tournament's league, or undefined if not seeded. */
export function getSeedInTournament(tournamentId: string, playerId: string): number | undefined {
  if (tournamentId === 't-novak-l3') return getLiga3Preclasificacion(playerId);
  const seeds = getTournamentSeeds(tournamentId);
  const entry = seeds.find((s) => s.playerId === playerId);
  return entry?.seed;
}

export function getTournamentsByStatus(status: TournamentStatus | 'all'): Tournament[] {
  if (status === 'all') return [...tournaments];
  return tournaments.filter(t => t.status === status);
}

export function getTournamentsByLeague(league: LeagueNum, status?: TournamentStatus): Tournament[] {
  const list = status ? getTournamentsByStatus(status) : getTournamentsByStatus('all');
  return list.filter(t => (t.league ?? categoryToLeague(t.category)) === league);
}

/** True if tournament is currently in progress (today between start and end, status upcoming). */
export function isTournamentCurrent(t: Tournament): boolean {
  if (t.status !== 'upcoming') return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(t.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(t.endDate);
  end.setHours(23, 59, 59, 999);
  return today >= start && today <= end;
}

export function getTournamentById(id: string): Tournament | undefined {
  return tournaments.find(t => t.id === id);
}

export function getMatchesByTournament(tournamentId: string): Match[] {
  if (tournamentId === 't-novak-l3') return LIGA3_MATCHES;
  return matches.filter(m => m.tournamentId === tournamentId);
}

export function getScheduledMatchesByTournament(tournamentId: string): Match[] {
  return matches.filter(m => m.tournamentId === tournamentId && !m.winnerId && m.scheduledDate);
}

export function getRecentMatchesForPlayer(playerId: string, limit = 5): Match[] {
  return matches
    .filter(m => m.winnerId !== null && (m.playerA === playerId || m.playerB === playerId))
    .slice(-limit)
    .reverse();
}

export function getTournamentHistoryForPlayer(playerId: string): { tournament: Tournament; result: string }[] {
  return tournaments
    .filter(t => t.status === 'finished' && (t.winnerId === playerId || t.finalistId === playerId))
    .map(t => ({
      tournament: t,
      result: t.winnerId === playerId ? 'Campeón' : 'Finalista',
    }))
    .sort((a, b) => b.tournament.endDate.localeCompare(a.tournament.endDate));
}

export function getPlayerWithDisplay(id: string): (Player & { position: number; initial: string }) | undefined {
  const p = getPlayerById(id);
  if (!p) return undefined;
  const all = getPlayersByFilters('all');
  const idx = all.findIndex(x => x.id === p.id);
  const position = idx >= 0 ? idx + 1 : 0;
  const initial = p.name.split(' ').map(n => n[0]).join('').slice(0, 2);
  return { ...p, position, initial };
}

/** Ranking history for profile: best, average, current, bestAt (date when best was reached). */
export function getPlayerRankingHistory(playerId: string): { best: number; average: number; current: number; bestAt?: string } {
  const p = getPlayerById(playerId);
  const d = getPlayerWithDisplay(playerId);
  const current = d?.position ?? 0;
  const best = p?.bestGlobalPosition ?? Math.max(1, current - 2);
  const average = Math.round((best + current) / 2) || current;
  const bestAt = getBestRankingDate(playerId);
  return { best, average, current, bestAt };
}

/** Mock: date when player reached their best ranking (e.g. "Abril 2024"). */
function getBestRankingDate(playerId: string): string | undefined {
  const hash = playerId.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const month = months[Math.abs(hash) % 12];
  const year = 2023 + (Math.abs(hash) % 3);
  return `${month} ${year}`;
}

/** Promotion/relegation history for profile. */
export function getPlayerPromotionHistory(playerId: string): PromotionHistoryEntry[] {
  const p = getPlayerById(playerId);
  return p?.promotionHistory ?? [];
}

export function searchPlayersWithPosition(query: string): (Player & { position: number })[] {
  const found = searchPlayersByName(query);
  const all = getPlayersByFilters('all');
  return found.map(p => ({
    ...p,
    position: all.findIndex(x => x.id === p.id) + 1 || 0,
  }));
}

export function formatTournamentDate(t: Tournament): string {
  const s = new Date(t.startDate);
  const e = new Date(t.endDate);
  return `${s.getDate()} ${s.toLocaleDateString('es-ES', { month: 'short' })} - ${e.getDate()} ${e.toLocaleDateString('es-ES', { month: 'short' })} ${e.getFullYear()}`;
}

/** Tournament ranking: points earned in this tournament (mock: use global points for display). Liga 3: ranking solo del torneo. */
export function getTournamentRanking(tournamentId: string): RankingRow[] {
  if (tournamentId === 't-novak-l3') {
    const rows = getLiga3TournamentRanking();
    return rows.map((r) => {
      const player = getPlayerById(r.playerId)!;
      return {
        position: r.position,
        playerId: r.playerId,
        player,
        points: r.points,
        matchesPlayed: r.PJ,
        wins: r.PG,
        losses: r.PP,
        setsWon: r.setsWon,
        setsLost: r.setsLost,
      };
    });
  }
  const t = getTournamentById(tournamentId);
  if (!t) return [];
  const categoryPlayers = getPlayersByFilters(t.category);
  return categoryPlayers.slice(0, 16).map((player, i) => ({
    position: i + 1,
    playerId: player.id,
    player,
    points: player.points,
    matchesPlayed: player.stats.matchesPlayed,
    wins: player.stats.wins,
    losses: player.stats.losses,
  }));
}

/** Bracket by rounds: Cuartos de final → Semifinales → Final */
export function getBracketRounds(tournamentId: string): BracketRounds {
  const all = getMatchesByTournament(tournamentId);
  const quarterfinals = all.filter(m => m.round === 'Cuartos de final' || m.round === 'Cuartos');
  const semifinals = all.filter(m => m.round === 'Semifinales' || m.round === 'Semifinal');
  const finalMatch = all.filter(m => m.round === 'Final');
  return { quarterfinals, semifinals, final: finalMatch };
}

/** Group tables (Grupo A, Grupo B) with PJ, PG, PP, Points */
export function getGroupTables(tournamentId: string): GroupTable[] {
  const t = getTournamentById(tournamentId);
  if (!t) return [];
  const categoryPlayers = getPlayersByFilters(t.category);
  const half = Math.ceil(categoryPlayers.length / 2);
  const groupA: GroupTableRow[] = categoryPlayers.slice(0, half).map((p) => ({
    playerId: p.id,
    PJ: p.stats.matchesPlayed,
    PG: p.stats.wins,
    PP: p.stats.losses,
    points: p.points,
  }));
  const groupB: GroupTableRow[] = categoryPlayers.slice(half, half * 2).map((p) => ({
    playerId: p.id,
    PJ: p.stats.matchesPlayed,
    PG: p.stats.wins,
    PP: p.stats.losses,
    points: p.points,
  }));
  return [
    { name: 'Grupo A', rows: groupA },
    { name: 'Grupo B', rows: groupB },
  ];
}

/** IDs of featured upcoming (not yet started) tournaments for the homepage */
const UPCOMING_TOURNAMENT_IDS = ['t-nadal', 't-federer', 't-1'] as const;

/** Upcoming tournaments for homepage "Próximos torneos" (excludes current in-progress ones) */
export function getUpcomingTournamentsForHome(): Tournament[] {
  return UPCOMING_TOURNAMENT_IDS
    .map((id) => getTournamentById(id))
    .filter((t): t is Tournament => t != null && t.status === 'upcoming' && !isTournamentCurrent(t));
}

/** Simulate set stats for one player (4 matches): returns [setsWon, setsLost]. Plausible totals ~8–14 sets. */
function simulateSetStatsForPlayer(playerId: string): [number, number] {
  const hash = (s: string) => s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  const seed = Math.abs(hash(playerId));
  const setsWon = 6 + (seed % 6) + Math.floor((seed / 7) % 4);
  const setsLost = 2 + (seed % 4) + Math.floor((seed / 11) % 3);
  return [setsWon, setsLost];
}

/** Group tables with set statistics: Pos, Player, PJ, Sets +, Sets -, Dif. Liga 3: 3 grupos con datos reales del torneo. */
export function getGroupTablesWithSetStats(tournamentId: string): GroupTableWithSets[] {
  if (tournamentId === 't-novak-l3') {
    return getLiga3GroupStandings().map((g) => ({
      name: g.name,
      rows: g.rows.map((r, i) => ({
        position: i + 1,
        playerId: r.playerId,
        PJ: r.PJ,
        setsWon: r.setsWon,
        setsLost: r.setsLost,
        setDiff: r.setDiff,
        PG: r.PG,
        PP: r.PP,
        points: r.points,
        positionChange: r.positionChange,
      })),
    }));
  }
  const t = getTournamentById(tournamentId);
  if (!t) return [];
  const categoryPlayers = getPlayersByFilters(t.category);
  const half = Math.ceil(categoryPlayers.length / 2);
  const groupAPlayers = categoryPlayers.slice(0, half);
  const groupBPlayers = categoryPlayers.slice(half, half * 2);

  const buildRows = (list: Player[]): GroupTableRowWithSets[] => {
    const rows = list.map((p) => {
      const [setsWon, setsLost] = simulateSetStatsForPlayer(p.id);
      return {
        position: 0,
        playerId: p.id,
        PJ: 4,
        setsWon,
        setsLost,
        setDiff: setsWon - setsLost,
      };
    });
    rows.sort((a, b) => b.setDiff - a.setDiff);
    rows.forEach((r, i) => {
      r.position = i + 1;
    });
    return rows;
  };

  return [
    { name: 'Grupo A', rows: buildRows(groupAPlayers) },
    { name: 'Grupo B', rows: buildRows(groupBPlayers) },
  ];
}

/** Format for react-tournament-brackets SingleEliminationBracket */
export interface BracketMatchForLibrary {
  id: string | number;
  name?: string;
  nextMatchId: string | number | null;
  tournamentRoundText: string;
  startTime: string;
  state: 'PLAYED' | 'SCORE_DONE' | 'SCHEDULED' | 'RUNNING' | 'DONE';
  participants: Array<{
    id: string;
    name?: string;
    resultText?: string | null;
    isWinner?: boolean;
    status?: string | null;
    ranking?: number;
  }>;
}

/** Build bracket matches in library format: Quarterfinals (1) → Semifinals (2) → Final (3) */
export function getBracketMatchesForLibrary(tournamentId: string): BracketMatchForLibrary[] {
  const rounds = getBracketRounds(tournamentId);
  const list: BracketMatchForLibrary[] = [];
  const idFinal = 'b-f';
  const idS1 = 'b-s1';
  const idS2 = 'b-s2';

  const seed = (playerId: string) => getSeedInTournament(tournamentId, playerId) ?? getPlayerWithDisplay(playerId)?.position;

  // Final
  const f = rounds.final[0];
  if (f) {
    const pa = getPlayerById(f.playerA);
    const pb = getPlayerById(f.playerB);
    list.push({
      id: idFinal,
      name: 'Final',
      nextMatchId: null,
      tournamentRoundText: '3',
      startTime: f.scheduledDate ?? tournamentId,
      state: f.winnerId ? 'SCORE_DONE' : 'SCHEDULED',
      participants: [
        { id: f.playerA, name: pa?.name ?? 'TBD', resultText: f.score || null, isWinner: f.winnerId === f.playerA, status: f.winnerId ? 'PLAYED' : null, ranking: seed(f.playerA) },
        { id: f.playerB, name: pb?.name ?? 'TBD', resultText: f.score || null, isWinner: f.winnerId === f.playerB, status: f.winnerId ? 'PLAYED' : null, ranking: seed(f.playerB) },
      ],
    });
  } else {
    list.push({
      id: idFinal,
      name: 'Final',
      nextMatchId: null,
      tournamentRoundText: '3',
      startTime: '',
      state: 'SCHEDULED',
      participants: [{ id: 'tbd1', name: 'TBD' }, { id: 'tbd2', name: 'TBD' }],
    });
  }

  // Semifinals
  [rounds.semifinals[0], rounds.semifinals[1]].forEach((m, i) => {
    const id = i === 0 ? idS1 : idS2;
    if (m) {
      const pa = getPlayerById(m.playerA);
      const pb = getPlayerById(m.playerB);
      list.push({
        id,
        name: `Semifinal ${i + 1}`,
        nextMatchId: idFinal,
        tournamentRoundText: '2',
        startTime: m.scheduledDate ?? '',
        state: m.winnerId ? 'SCORE_DONE' : 'SCHEDULED',
        participants: [
          { id: m.playerA, name: pa?.name ?? 'TBD', resultText: m.score || null, isWinner: m.winnerId === m.playerA, status: m.winnerId ? 'PLAYED' : null, ranking: seed(m.playerA) },
          { id: m.playerB, name: pb?.name ?? 'TBD', resultText: m.score || null, isWinner: m.winnerId === m.playerB, status: m.winnerId ? 'PLAYED' : null, ranking: seed(m.playerB) },
        ],
      });
    } else {
      list.push({
        id,
        name: `Semifinal ${i + 1}`,
        nextMatchId: idFinal,
        tournamentRoundText: '2',
        startTime: '',
        state: 'SCHEDULED',
        participants: [{ id: `s${i}-1`, name: 'TBD' }, { id: `s${i}-2`, name: 'TBD' }],
      });
    }
  });

  // Quarterfinals (always 4 matches for full bracket)
  const qIds = ['b-q1', 'b-q2', 'b-q3', 'b-q4'];
  const semiIds = [idS1, idS1, idS2, idS2];
  for (let i = 0; i < 4; i++) {
    const m = rounds.quarterfinals[i];
    const id = qIds[i];
    const nextId = semiIds[i];
    if (m) {
      const pa = getPlayerById(m.playerA);
      const pb = getPlayerById(m.playerB);
      list.push({
        id,
        name: `Cuartos ${i + 1}`,
        nextMatchId: nextId,
        tournamentRoundText: '1',
        startTime: m.scheduledDate ?? '',
        state: m.winnerId ? 'SCORE_DONE' : 'SCHEDULED',
        participants: [
          { id: m.playerA, name: pa?.name ?? 'TBD', resultText: m.score || null, isWinner: m.winnerId === m.playerA, status: m.winnerId ? 'PLAYED' : null, ranking: seed(m.playerA) },
          { id: m.playerB, name: pb?.name ?? 'TBD', resultText: m.score || null, isWinner: m.winnerId === m.playerB, status: m.winnerId ? 'PLAYED' : null, ranking: seed(m.playerB) },
        ],
      });
    } else {
      list.push({
        id,
        name: `Cuartos ${i + 1}`,
        nextMatchId: nextId,
        tournamentRoundText: '1',
        startTime: '',
        state: 'SCHEDULED',
        participants: [{ id: `q${i}-1`, name: 'TBD' }, { id: `q${i}-2`, name: 'TBD' }],
      });
    }
  }

  return list;
}

/** Group stage fixtures (by group and fecha) – Liga 3 and Liga 4 */
export function getGroupStageFixtures(tournamentId: string): GroupStageGroup[] {
  if (tournamentId === 't-novak-l3') return LIGA3_GROUP_FIXTURES;
  if (tournamentId === 't-novak-l4') return LIGA4_GROUP_FIXTURES;
  return [];
}

/** Upcoming matches with date, time, players for "Próximos partidos". Liga 3: solo la final. */
export function getUpcomingMatchesForTournament(tournamentId: string): UpcomingMatchDisplay[] {
  if (tournamentId === 't-novak-l3') return LIGA3_UPCOMING_FINAL;
  const scheduled = matches.filter(
    m => m.tournamentId === tournamentId && (m.scheduledDate || m.scheduledTime) && !m.winnerId
  );
  return scheduled.map((m, idx) => {
    const pa = getPlayerById(m.playerA);
    const pb = getPlayerById(m.playerB);
    const date = m.scheduledDate
      ? new Date(m.scheduledDate).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
      : '—';
    return {
      id: m.id,
      date,
      time: m.scheduledTime ?? '—',
      playerA: pa?.name ?? '—',
      playerB: pb?.name ?? '—',
      round: m.round,
      ballsByPlayerA: idx % 2 === 0,
    };
  });
}

// Re-export Liga 3 helpers for TournamentDetailScreen
export {
  getLiga3GroupStageResults,
  getLiga3Calendar,
  LIGA3_STATUS,
  getLiga3FinalMatch,
  getLiga3Preclasificacion,
  LIGA3_POINTS_SYSTEM,
  LIGA3_CLASSIFICATION_RULES,
};
