# Backend MySQL en Hostinger — Greek Tennis

Este documento complementa `server/README.md` y describe cómo desplegar la API **Node.js + Express + Prisma + MySQL** para reemplazar persistencia solo en `localStorage` del navegador por datos compartidos entre dispositivos.

## 1. Arquitectura

- **Frontend** (Vite/React): estático en Hostinger o CDN; variables `VITE_API_URL`, `VITE_DATA_SOURCE`.
- **Backend** (`server/`): Node.js escuchando un puerto interno o el asignado por el panel.
- **MySQL**: base de datos en Hostinger con usuario dedicado (mínimo privilegios).
- **Rama deploy**: `hostinger-staging`.

No se deben exponer credenciales MySQL al frontend: solo el origin del sitio y la URL pública de la API.

## 2. Crear la base MySQL

1. En hPanel → **Bases de datos MySQL** → crear base (ej. `greek_tennis`).
2. Crear usuario con contraseña fuerte y **asignar todos los privilegios solo a esa base**.
3. Anotar host (a veces distinto de `localhost`, ej. `mysql.hostinger.io` o nombre interno del servicio Node).

## 3. Variables de entorno del backend

Copiar `server/.env.hostinger.example` → `server/.env` en el servidor, o cargar esos valores en el panel Node.js de Hostinger.

| Variable | Uso |
|---------|-----|
| `DATABASE_URL` | URL completa `mysql://usuario:pass@host:puerto/base` (recomendado). |
| O bien `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | `server/src/envBootstrap.ts` arma `DATABASE_URL`. |
| `PORT` | Puerto HTTP (ej. `3001`). |
| `JWT_SECRET` | Secreto firma JWT (largo, aleatorio). **Obligatorio** para rutas `/api/admin/*`. |
| `ADMIN_PASSWORD` | Contraseña del panel admin para `POST /api/admin/auth/login` (MVP; reemplazar por usuarios/hash en producción). |
| `JWT_EXPIRES_SECONDS` | Duración del token en segundos (opcional; por defecto 8 h). |
| `CORS_ORIGIN` | Origen del frontend separado por coma, ej. `https://tudominio.com`. |

Para la base Hostinger creada para este proyecto:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=u592173310_TorneosGreek
DB_NAME=u592173310_TorneosGreek
DB_PASSWORD=...
```

Usar `DB_*` es preferible porque la contraseña se codifica automáticamente. Si se usa `DATABASE_URL`, cualquier `@` en la contraseña debe escribirse como `%40`.

Ejemplo `DATABASE_URL` para Hostinger:

```env
DATABASE_URL="mysql://u592173310_TorneosGreek:MYSQL_PASSWORD@localhost:3306/u592173310_TorneosGreek"
```

Caracteres especiales en contraseña cuando se usa URL:

```txt
@ -> %40
# -> %23
: -> %3A
/ -> %2F
% -> %25
```

## 4. Migraciones

En el entorno de deploy (SSH o pipeline):

```bash
cd server
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
node dist/index.js
```

- `migrate deploy` aplica las migraciones ya versionadas en `server/prisma/migrations/`.
- No commitear `.env` real.

## 5. Desplegar Node.js en Hostinger

Según el plan:

- Usar **Importa un repositorio Git** con la rama `hostinger-staging`.
- Configurar **Root directory**: `server`.
- Usar Node 20 o 22.
- Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`.
- Start command: `npm start`.
- Definir las variables de entorno en el panel (no en el repo).

Comprobar salud: `GET https://api.greektennis.com/health`.

## 6. Frontend: conectar la API

En el build del proyecto Vite (raíz del monorepo frontend):

| Variable | Valor |
|---------|--------|
| `VITE_API_URL` | Base de la API pública, ej. `https://api.greektennis.com` (sin barra final). |
| `VITE_DATA_SOURCE` | `local` (default) o `api` para persistir resultados confirmados en MySQL. |
| `VITE_ADMIN_TOKEN` | (Opcional) Bearer fijo para desarrollo; en producción preferir `POST /api/admin/auth/login` → token en `sessionStorage` (`apiClient.adminLogin`). |

Copiar `.env.staging.example` → `.env.staging`, ajustar `VITE_API_URL` si cambia el dominio real de la API y construir con:

```bash
npm run build:staging
```

Build de ejemplo:

```bash
npm run build:production
```

La capa de cliente está en `src/lib/api/apiClient.ts`; el selector de modo está en `src/lib/data/tournamentRepository.ts`.

### 6.1 Resultados ya cableados (`VITE_DATA_SOURCE=api`)

- `src/data/services/registry.ts` elige `createApiMatchResultsRepository()` cuando `VITE_DATA_SOURCE=api`.
- Ese adaptador cumple `MatchResultsPort`: hidrata con `GET /api/admin/match-results`, escribe con `POST /api/admin/matches/:dedupeKey/result`, borra con `POST /api/admin/match-results/delete`.
- Los hooks `useResults`, `upsertResult`, `getResults`, etc. (`src/data/hooks/matchResults.ts`) usan el registry; no hace falta cambiar pantallas para el flujo básico de resultados.
- **Programación** y **fase de grupos / eliminación** también tienen adaptadores API (ver secciones siguientes). El catálogo de club (`jugadores` / `torneos` overlay) sigue mayormente en modo local salvo sincronización puntual de `partidos` desde el admin.

### 6.2 Programación de partidos por API/MySQL

El frontend usa `getMatchSchedulePort()` (`src/data/services/registry.ts`) y `src/lib/api/apiClient.ts`.

**Variables:** `VITE_DATA_SOURCE=api`, `VITE_API_URL`, JWT admin (`VITE_ADMIN_TOKEN` o login).

#### Admin (`Authorization: Bearer …`)

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/admin/schedules` | Todas las filas `TournamentScheduleEntry`. |
| GET | `/api/admin/schedules?tournamentId=` | Filtradas por torneo. |
| GET | `/api/admin/tournaments/:id/schedules` | Igual, por `tournamentId` en path. |
| POST / PUT | `/api/admin/matches/:id/schedule` | `:id` = `dedupeKey` (URL-encoded). Body: `tournamentId`, `leagueNum`, `scheduleStatus`, `date`, `time`, `venue`, `note`, `confirmedAt`. |
| POST | `/api/admin/tournaments/:id/schedules/confirm` | Confirma fechas; body opcional `{ keys: string[] }` (dedupeKeys). |
| POST | `/api/admin/matches/:id/schedule/postpone` | Marca postergado. |
| POST | `/api/admin/matches/:id/schedule/cancel` | Cancela. |
| DELETE | `/api/admin/matches/:id/schedule` | Elimina la fila de agenda. |

#### Público (sin JWT)

| Método | Ruta | Uso |
|--------|------|-----|
| GET | `/api/public/schedule?tournamentId=` | Torneo por id: `matches` + `schedules`. |
| GET | `/api/public/tournaments/:slug/schedule` | Por `slug`: mismo payload. |

**Guardar programación:** upsert en `TournamentScheduleEntry` por `dedupeKey`. **Confirmar:** endpoint de confirmación o `scheduleStatus: confirmed` vía PUT. **Reprogramar:** cambiar fecha/hora/cancha y estado `rescheduled` desde la UI. **Público:** el SPA hidrata agenda con `GET .../schedule` y `mergeMatchScheduleRows` (ver `TournamentDetailScreen`).

### 6.3 Fase de grupos y eliminación (API)

- **Ligas:** `GET /api/admin/tournaments/:id/leagues` — filas `TournamentLeague` + `EliminationBracket` embebido.
- **Cerrar grupos:** `POST /api/admin/tournament-leagues/:id/confirm-results` — valida que no queden `MatchResult` en `pending` para ese torneo; pone `groupStageStatus=confirmed` y `eliminationStatus=ready` si aplica; auditoría.
- **Reabrir:** `POST .../reopen-results` — `groupStageStatus=reopened`; respuesta puede incluir `warning` si hay borrador/confirmación de KO.
- **KO borrador:** `POST .../elimination/generate` y `PUT .../elimination` — guardan `bracketJson`, `eliminationStatus=draft`.
- **Confirmar KO:** `POST .../elimination/confirm` — crea `Match` de repechaje/cuartos/semis/final (jugadores placeholder `sys-ko-*` en migración `20260510120000_ko_placeholder_players`), `eliminationStatus=confirmed`.
- **Estado KO manual:** `PUT /api/admin/tournament-leagues/:id/elimination-status` body `{ status }` (`unavailable` \| `ready` \| `draft` \| `confirmed` \| `in_progress` \| `finished`).
- **Lectura admin:** `GET /api/admin/tournament-leagues/:id/elimination`.
- **Público:** `GET /api/public/elimination?tournamentId=&leagueNum=` y `GET /api/public/tournaments/:slug/elimination?leagueNum=` — devuelven `league`, `bracket`, `matches` (partidos solo si `eliminationStatus` es `confirmed`, `in_progress` o `finished`). Cada `match` incluye `score`, `completed`, `winner`, `loser` y jugadores cuando la API los persiste.

**Frontend:** `getTournamentLeaguePort()`, `getEliminationBracketPort()`, sincronización de `partidos` con `syncTournamentMatchesFromAdminApi` al abrir el workspace admin y tras confirmar KO.

**Avance automático de ganadores KO en servidor:** al guardar `POST`/`PUT` `/api/admin/matches/:id/result` (y en `POST /api/admin/results/bulk-save`, en orden de ronda), si el cuerpo incluye `matchId` de un `Match` con `tournamentLeagueId` y etapa/ronda de eliminación (`quarterfinal`, `semifinal`, `final`, `repechage` o `roundLabel` con Cuartos/Semifinal/Final/Repechaje/Octavos), el backend actualiza la fila `Match` (`winnerId`, `loserId`, `score`, `completed`), coloca el ganador en el slot de la siguiente ronda (`ko-{tournamentId}-qf-*` → `sf-*` → `fn-0`), pasa `eliminationStatus` a `in_progress` y, si es la final, define `Tournament.winnerId` / `finalistId` y `eliminationStatus=finished` (sin marcar el torneo como `finished` hasta `POST /api/admin/tournaments/:id/finalize`). Marcador suspendido no avanza; W.O. respeta `score` `A`/`B`. Edición que cambia el ganador con rondas posteriores ya cerradas devuelve **409** con mensaje controlado. Auditoría: `ko_result_applied`, `ko_winner_advanced`, `ko_champion_defined`, `ko_edit_blocked_downstream`, etc. La fuente de verdad sigue siendo las filas `Match` en MySQL; `EliminationBracket.bracketJson` recibe un espejo opcional bajo `serverKoMirror` por `matchId`.

### 6.4 Ranking y perfiles (API / MySQL)

- **Servidor:** `server/src/services/recalculateRankings.ts` recalcula desde `Player`, `Tournament`, `TournamentLeague`, `Match`, `MatchResult` y escribe `LeagueRankingRow` (una fila por `playerId` + `league` 1–6). Añade un registro agregado en `RankingSnapshot` (`leagueNum: 0`, payload con metadatos). Los puntos por fase siguen la tabla por defecto alineada al frontend (`DEFAULT_RANKING_POINTS` en `rankingPointsConfig.ts`: campeón 500, finalista 350, semifinalista 200, cuartos 100, repechaje 50, solo grupos 25). Overrides opcionales en `TournamentLeague.rulesJson.rankingPoints`.
- **Cuándo recalcula:** tras guardar/editar resultado (`POST`/`PUT` `/api/admin/matches/:id/result`), `POST /api/admin/results/bulk-save`, borrar resultado (`POST /api/admin/match-results/delete`), confirmar/reabrir grupos, confirmar cuadro KO, finalizar torneo y `POST /api/admin/tournaments/:id/recalculate`.
- **Público — ranking:** `GET /api/public/rankings` sin query devuelve `byLeague` (`"1"`…`"6"`) con filas ordenadas y campo `rank`; `GET /api/public/rankings?league=3` devuelve solo esa liga en `rows` (+ `leagueFilter`). Criterio de orden: puntos → títulos → finales → victorias → diferencia de sets (`statsJson`) → nombre.
- **Público — jugador:** `GET /api/public/players/:id` devuelve `player`, filas de ranking por liga (`rankingsByLeague`), `recentMatches` (desde `Match` completados), `tournamentHistory` (campeón/finalista en torneos `finished`), agregados y metadatos.
- **Frontend (`VITE_DATA_SOURCE=api`):** `useTennisLiveData` hidrata `rankingsByLeague` con `fetchApiRankingsByLeague()`; `RankingsScreen` y `HomeScreen` usan ese mapa. Perfil: `fetchPublicPlayerProfile` + datos locales del roster. Export en `src/data/index.ts`: `fetchApiRankingsByLeague`, `fetchPublicPlayerProfile`.

## 7. Rutas principales

### Públicas (`/api/public/...`)

Sin autenticación: listado de torneos, detalle por `slug`, programa (`/tournaments/:slug/schedule`), rankings, jugador.

### Admin (`/api/admin/...`)

Requieren cabecera `Authorization: Bearer <JWT>`.

Obtener JWT:

```http
POST /api/admin/auth/login
Content-Type: application/json

{"password":"..."}
```

Listado exhaustivo de rutas implementadas: ver `server/src/routes/adminApiRouter.ts` y `server/src/routes/public.ts`.

## 8. Seguridad recomendada

- Rotar `JWT_SECRET` si se filtra.
- Sustituir `ADMIN_PASSWORD` plano por cuenta de operador con bcrypt y/o proveedor de identidad.
- HTTPS en frontend y API.
- Limitar IPs al panel admin si Hostinger lo permite (WAF / reglas).

## 9. Recálculo de ranking en servidor

`POST /api/admin/tournaments/:id/recalculate` ejecuta `recalculateRankings` (materializa `LeagueRankingRow` + `RankingSnapshot`) y registra auditoría `recalculate`. El ranking público lee las filas materializadas, no recalcula en el navegador.
