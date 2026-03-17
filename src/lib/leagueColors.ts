/**
 * League color system — hierarchy by league.
 * Liga 1 = Red, Liga 2 = Orange, Liga 3 = Blue, Liga 4 = Green, Liga 5 = Gray.
 */

import type { LeagueNum } from './mockData';

export interface LeagueColorClasses {
  /** Top border for cards/headers (e.g. border-t-4 border-red-500) */
  borderTop: string;
  /** Top bar background (for a 4px strip, e.g. bg-red-500) — use with h-1 rounded-t-xl */
  topBar: string;
  /** Light background */
  bg: string;
  /** Left/side border */
  border: string;
  /** Badge/chip: rounded-full px-3 py-1 text-xs font-semibold */
  badge: string;
  /** Category cell in tables (bg + text) */
  categoryBg: string;
}

const leagueMap: Record<LeagueNum, LeagueColorClasses> = {
  1: {
    borderTop: 'border-t-4 border-t-red-500',
    topBar: 'bg-red-500',
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-l-4 border-l-red-500',
    badge: 'rounded-full px-3 py-1 text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 border border-red-500',
    categoryBg: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-200',
  },
  2: {
    borderTop: 'border-t-4 border-t-orange-400',
    topBar: 'bg-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    border: 'border-l-4 border-l-orange-400',
    badge: 'rounded-full px-3 py-1 text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-400',
    categoryBg: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-200',
  },
  3: {
    borderTop: 'border-t-4 border-t-blue-400',
    topBar: 'bg-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-l-4 border-l-blue-400',
    badge: 'rounded-full px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-400',
    categoryBg: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-200',
  },
  4: {
    borderTop: 'border-t-4 border-t-green-400',
    topBar: 'bg-green-400',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-l-4 border-l-green-400',
    badge: 'rounded-full px-3 py-1 text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 border border-green-400',
    categoryBg: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-200',
  },
  5: {
    borderTop: 'border-t-4 border-t-gray-400',
    topBar: 'bg-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800/50',
    border: 'border-l-4 border-l-gray-400',
    badge: 'rounded-full px-3 py-1 text-xs font-semibold bg-gray-50 text-gray-600 dark:bg-gray-700 dark:text-gray-300 border border-gray-500',
    categoryBg: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-200',
  },
};

/**
 * Returns Tailwind classes for the given league (1–5).
 * Use for borders, backgrounds, and badges everywhere: ranking, profile, tournaments.
 */
export function getLeagueColor(league: LeagueNum): LeagueColorClasses {
  return leagueMap[league];
}
