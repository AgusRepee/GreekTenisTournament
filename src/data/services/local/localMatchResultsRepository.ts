import type { MatchInput } from '@/data/types';
import { MATCH_RESULTS_STORAGE_KEY } from '@/data/types/persistenceKeys';
import type { MatchResultsPort } from '../contracts/matchResultsPort';
import { matchInputDedupeKey } from '@/lib/tennis/matchDedupe';

/** Misma referencia en cada `getServerSnapshot` (evita bucle con useSyncExternalStore). */
const EMPTY_MATCH_RESULTS: MatchInput[] = Object.freeze([]) as unknown as MatchInput[];

/**
 * Persistencia local de resultados (localStorage).
 * Sustituir por un adaptador HTTP que implemente {@link MatchResultsPort}.
 */
export function createLocalMatchResultsRepository(): MatchResultsPort {
  const listeners = new Set<() => void>();
  let resultsByMatchId: Record<string, MatchInput> = {};
  let cachedList: MatchInput[] = [];

  function rebuildList(): void {
    cachedList = Object.values(resultsByMatchId);
  }

  function emit(): void {
    listeners.forEach((l) => l());
  }

  function persist(): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(MATCH_RESULTS_STORAGE_KEY, JSON.stringify(Object.values(resultsByMatchId)));
    } catch {
      /* quota */
    }
  }

  function loadFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      rebuildList();
      return;
    }
    try {
      const raw = localStorage.getItem(MATCH_RESULTS_STORAGE_KEY);
      if (!raw) {
        rebuildList();
        return;
      }
      const arr = JSON.parse(raw) as MatchInput[];
      if (!Array.isArray(arr)) {
        rebuildList();
        return;
      }
      const next: Record<string, MatchInput> = {};
      for (const m of arr) {
        const id = matchInputDedupeKey(m);
        next[id] = { ...m, matchId: id };
      }
      resultsByMatchId = next;
    } catch {
      resultsByMatchId = {};
    }
    rebuildList();
  }

  loadFromStorage();

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (e: StorageEvent) => {
      if (e.key !== MATCH_RESULTS_STORAGE_KEY) return;
      loadFromStorage();
      emit();
    });
  }

  return {
    getAll(): MatchInput[] {
      return cachedList;
    },
    getByMatchId(matchId: string): MatchInput | undefined {
      return resultsByMatchId[matchId];
    },
    upsert(result: MatchInput): void {
      const id = matchInputDedupeKey(result);
      resultsByMatchId = {
        ...resultsByMatchId,
        [id]: { ...result, matchId: id },
      };
      rebuildList();
      persist();
      emit();
    },
    removeByDedupeKey(dedupeKey: string): void {
      if (resultsByMatchId[dedupeKey] === undefined) return;
      const { [dedupeKey]: _, ...rest } = resultsByMatchId;
      resultsByMatchId = rest;
      rebuildList();
      persist();
      emit();
    },
    subscribe(callback: () => void): () => void {
      listeners.add(callback);
      return () => listeners.delete(callback);
    },
    getSnapshot(): MatchInput[] {
      return cachedList;
    },
    getServerSnapshot(): MatchInput[] {
      return EMPTY_MATCH_RESULTS;
    },
  };
}
