import React from 'react';
import { Check } from 'lucide-react';
import { getPlayerWithDisplay } from '../lib/mockData';

/** Participant shape from library (equivalent to seed.teams[0] / seed.teams[1]) */
type PartyLike = {
  id?: string | number;
  name?: string;
  resultText?: string | null;
  isWinner?: boolean;
  ranking?: number;
  [key: string]: unknown;
} | null | undefined;

/** Props passed by react-tournament-brackets MatchWrapper (matchComponent) */
export interface TennisMatchCardProps {
  match: { id: string | number; name?: string; startTime?: string; [key: string]: unknown };
  topParty: PartyLike;
  bottomParty: PartyLike;
  topWon: boolean;
  bottomWon: boolean;
  topHovered: boolean;
  bottomHovered: boolean;
  topText?: string;
  bottomText?: string;
  onMatchClick?: (args: { match: unknown; topWon: boolean; bottomWon: boolean; event: React.MouseEvent<HTMLAnchorElement> }) => void;
  onPartyClick?: (party: unknown, partyWon: boolean) => void;
  onMouseEnter: (partyId: string | number) => void;
  onMouseLeave: () => void;
  connectorColor?: string;
  computedStyles?: { width?: number; boxHeight?: number; [key: string]: unknown };
}

const PLACEHOLDER_LABEL = 'A confirmar';
const EMPTY_PARTY: PartyLike = { id: 'tbd', name: PLACEHOLDER_LABEL, resultText: null, isWinner: false };
function safeParty(party: PartyLike): NonNullable<PartyLike> {
  return (party != null && typeof party === 'object' ? party : EMPTY_PARTY) as NonNullable<PartyLike>;
}

function isPlaceholderParty(party: PartyLike): boolean {
  if (party == null || typeof party !== 'object') return true;
  const name = party.name;
  return name == null || String(name).trim() === '';
}

function PlayerRow({
  party,
  won,
  hovered,
  onMouseEnter,
  onMouseLeave,
  onPartyClick,
}: {
  party: PartyLike;
  won: boolean;
  hovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPartyClick: () => void;
}) {
  const p = safeParty(party);
  const isPlaceholder = isPlaceholderParty(party);
  const playerId = p.id != null ? String(p.id) : '';
  const displayName =
    p.name != null && String(p.name).trim() !== '' ? String(p.name).trim() : PLACEHOLDER_LABEL;
  const displayRanking = p.ranking ?? (playerId ? getPlayerWithDisplay(playerId)?.position : undefined);
  const score = p.resultText != null && p.resultText !== '' ? p.resultText : null;

  return (
    <div
      role="button"
      tabIndex={0}
      className={`flex items-center justify-between gap-2 min-h-[34px] border border-transparent rounded-lg cursor-pointer transition-all ${
        won
          ? 'bg-slate-800/80 font-semibold text-white border-l-2 border-l-emerald-400'
          : 'bg-slate-800/40 font-medium text-slate-300 border border-slate-600/50'
      } ${hovered ? 'ring-1 ring-cyan-400/30' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onPartyClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPartyClick()}
    >
      {/* Nombre (preclasificación) [check] */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span className={`truncate text-sm ${isPlaceholder ? 'text-slate-400 italic' : won ? 'text-white font-semibold' : 'text-slate-300'}`}>
          {displayName}
          {!isPlaceholder && displayRanking != null && displayRanking > 0 && (
            <span className="text-slate-400 text-xs font-normal ml-1">({displayRanking})</span>
          )}
        </span>
        {won && (
          <span className="text-emerald-400 shrink-0" aria-hidden>
            <Check className="w-4 h-4" />
          </span>
        )}
      </div>
      {/* Resultado a la derecha (solo para el ganador) */}
      {won && score != null && (
        <span className="font-semibold tracking-wider tabular-nums text-xs shrink-0 text-emerald-400">
          {score}
        </span>
      )}
    </div>
  );
}

function TennisMatchCardInner({
  match,
  topParty,
  bottomParty,
  topWon,
  bottomWon,
  topHovered,
  bottomHovered,
  onMouseEnter,
  onMouseLeave,
  onPartyClick,
  topText,
  bottomText,
  computedStyles,
}: TennisMatchCardProps) {
  const top = safeParty(topParty);
  const bottom = safeParty(bottomParty);
  const boxHeight = (computedStyles?.boxHeight as number) || 88;
  const isFinal = match != null && (match as { nextMatchId?: string | null }).nextMatchId == null;

  return (
    <div
      className={`w-full h-full flex flex-col justify-between rounded-xl overflow-hidden border bg-gradient-to-r from-slate-900 to-blue-950 shadow-sm transition-all min-w-0 ${
        isFinal
          ? 'border-slate-600 ring-1 ring-blue-400/20'
          : 'border-slate-700'
      } hover:border-blue-500 hover:shadow-md`}
      style={{ minHeight: boxHeight, boxSizing: 'border-box', maxWidth: '100%' }}
    >
      <div className="flex flex-col gap-1.5 flex-1 px-3 py-2 min-w-0 overflow-hidden">
        <PlayerRow
          party={top}
          won={topWon}
          hovered={topHovered}
          onMouseEnter={() => onMouseEnter(top?.id ?? 'tbd')}
          onMouseLeave={onMouseLeave}
          onPartyClick={() => onPartyClick?.(top, topWon)}
        />
        <PlayerRow
          party={bottom}
          won={bottomWon}
          hovered={bottomHovered}
          onMouseEnter={() => onMouseEnter(bottom?.id ?? 'tbd')}
          onMouseLeave={onMouseLeave}
          onPartyClick={() => onPartyClick?.(bottom, bottomWon)}
        />
      </div>
      {bottomText != null && bottomText !== '' && (
        <div className="px-3 pb-1.5 pt-0 text-[10px] text-slate-500 text-center truncate">
          {bottomText}
        </div>
      )}
    </div>
  );
}

export const TennisMatchCard = React.memo(TennisMatchCardInner);
