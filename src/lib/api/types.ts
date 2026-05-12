/** DTOs HTTP mínimos alineados al backend `server/` (shape evolutivo). */

export type ApiErrorBody = { error?: string; message?: string };

export type BulkSaveResultsBody = {
  results: Record<string, unknown>[];
};

export type FinalizeTournamentBody = {
  championId?: string;
  finalistId?: string;
};
