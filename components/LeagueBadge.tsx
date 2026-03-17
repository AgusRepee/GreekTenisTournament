import React from 'react';
import type { LeagueNum } from '../src/lib/mockData';

const LEAGUE_BADGE_CLASSES: Record<LeagueNum, string> = {
  1: 'bg-red-100 text-red-600 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  2: 'bg-orange-100 text-orange-600 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  3: 'bg-blue-100 text-blue-600 border-blue-300 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  4: 'bg-green-100 text-green-600 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
  5: 'bg-gray-100 text-gray-600 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600',
};

export interface LeagueBadgeProps {
  league: LeagueNum;
  className?: string;
}

/**
 * Reusable league badge. Use in ranking table, profile, tournament cards, player lists.
 */
export const LeagueBadge: React.FC<LeagueBadgeProps> = ({ league, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-lg px-3 py-1 text-xs font-semibold border ${LEAGUE_BADGE_CLASSES[league]} ${className}`.trim()}
  >
    Liga {league}
  </span>
);
