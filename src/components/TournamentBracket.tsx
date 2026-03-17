import React, { useMemo, useCallback } from 'react';
import { SingleEliminationBracket, SVGViewer, createTheme } from 'react-tournament-brackets';
import { getBracketMatchesForLibrary } from '../lib/mockData';
import { sanitizeBracketMatches, type BracketMatchForLibrary } from '../lib/bracketData';
import { TennisMatchCard } from './TennisMatchCard';

const ROUND_LABELS: Record<string, string> = {
  '1': 'Cuartos de final',
  '2': 'Semifinales',
  '3': 'Final',
};

const BRACKET_THEME = createTheme({
  fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  roundHeaders: { background: 'rgba(30, 41, 59, 0.8)' },
  matchBackground: { wonColor: '#1e293b', lostColor: '#0f172a' },
  border: { color: '#334155', highlightedColor: 'rgba(59, 130, 246, 0.5)' },
  textColor: {
    highlighted: '#34d399',
    main: 'rgba(248,250,252,0.95)',
    dark: 'rgba(248,250,252,0.6)',
    disabled: 'rgba(248,250,252,0.4)',
  },
  score: {
    text: { highlightedWonColor: '#34d399', highlightedLostColor: 'rgba(248,250,252,0.5)' },
    background: { wonColor: '#1e293b', lostColor: '#0f172a' },
  },
  canvasBackground: 'transparent',
});

interface TournamentBracketProps {
  tournamentId: string;
}

/**
 * Bracket: stable memoized data, single theme instance, responsive scroll.
 * react-tournament-brackets passes participants as topParty/bottomParty to matchComponent.
 */
export function TournamentBracket({ tournamentId }: TournamentBracketProps) {
  const rawMatches = useMemo(() => getBracketMatchesForLibrary(tournamentId), [tournamentId]);
  const matches = useMemo(() => sanitizeBracketMatches(rawMatches), [rawMatches]);

  const hasValidBracket = matches.length > 0 && matches.some((m) => m.nextMatchId == null);

  const roundTextGenerator = useCallback(
    (currentRound: number, _total: number) => ROUND_LABELS[String(currentRound)] ?? `Ronda ${currentRound}`,
    []
  );

  const svgWrapper = useCallback(
    ({ children, bracketWidth, bracketHeight }: { children: React.ReactElement; bracketWidth: number; bracketHeight: number }) => (
      <SVGViewer
        width={bracketWidth}
        height={bracketHeight}
        bracketWidth={bracketWidth}
        bracketHeight={bracketHeight}
      >
        {children}
      </SVGViewer>
    ),
    []
  );

  const options = useMemo(
    () => ({
      style: {
        width: 248,
        boxHeight: 120,
        canvasPadding: 24,
        spaceBetweenColumns: 64,
        spaceBetweenRows: 24,
        connectorColor: '#475569',
        connectorColorHighlight: 'rgba(59, 130, 246, 0.5)',
        roundHeader: {
          isShown: true,
          height: 40,
          marginBottom: 24,
          fontSize: 12,
          fontColor: '#e2e8f0',
          backgroundColor: 'rgba(30, 41, 59, 0.8)',
          fontFamily: '"Inter", sans-serif',
          roundTextGenerator,
        },
      },
    }),
    [roundTextGenerator]
  );

  if (!hasValidBracket) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 dark:bg-gray-900 p-8 text-center text-slate-400 text-sm min-h-[200px] flex items-center justify-center">
        No hay datos de cuadro para este torneo o falta la partida final (nextMatchId nulo).
      </div>
    );
  }

  return (
    <div className="max-sm:overflow-x-auto">
      <div className="rounded-xl border border-slate-700 bg-slate-900 dark:bg-gray-900 min-h-[420px] p-8 bracket-container">
        <SingleEliminationBracket
          key={tournamentId}
          matches={matches as BracketMatchForLibrary[]}
          matchComponent={TennisMatchCard}
          theme={BRACKET_THEME}
          options={options}
          svgWrapper={svgWrapper}
        />
      </div>
    </div>
  );
}
