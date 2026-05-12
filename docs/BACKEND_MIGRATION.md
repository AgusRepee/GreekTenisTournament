# Migración: localStorage / datos embebidos → MySQL (Hostinger) + API Node

## Objetivo

Persistir jugadores, torneos, partidos, resultados, rankings derivados, noticias y auditoría en **MySQL** detrás de una **API Express** consumida por el **frontend React/Vite** actual. Las credenciales viven solo en el servidor (variables de entorno en Hostinger o `.env` local, nunca en el bundle del cliente).

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | React + Vite (repo actual) |
| Backend | Node.js 20+ + Express |
| ORM | Prisma (MySQL) |
| Auth admin | JWT en `Authorization: Bearer` (fase 4) o cookie httpOnly (alternativa) |
| DB | MySQL (Hostinger) |

## Variables de entorno (servidor)

No commitear secretos. Ejemplo en `server/.env.example`.

| Variable | Uso |
|----------|-----|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | Construir `DATABASE_URL` si preferís piezas sueltas |
| `DATABASE_URL` | URL completa Prisma: `mysql://USER:PASSWORD@HOST:PORT/DB_NAME` |
| `PORT` | Puerto HTTP del API (ej. 4000) |
| `CORS_ORIGIN` | Origen del frontend en producción (ej. `https://tudominio.com`) |
| `JWT_SECRET` | Firma de tokens admin (fase 4) |
| `JWT_EXPIRES_IN` | Ej. `8h` |

**Prisma** usa típicamente `DATABASE_URL`. Podés generarla en el entrypoint del servidor:

```bash
export DATABASE_URL="mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
```

En Hostinger Node, configurá las variables en el panel y la misma línea en el script de arranque si no usás `DATABASE_URL` directa.

## Arquitectura de carpetas (`server/`)

```
server/
  package.json
  tsconfig.json
  .env.example
  prisma/
    schema.prisma
    seed.ts                 # opcional, datos mínimos dev
  src/
    index.ts                # Express + CORS + rutas
    config/
      env.ts                # validación zod/dotenv (fase 2)
    lib/
      prisma.ts             # PrismaClient singleton
    middleware/
      authAdmin.ts          # JWT (fase 4)
    routes/
      players.ts
      tournaments.ts
      matches.ts
      rankings.ts
      public.ts
      news.ts
      audit.ts
      settings.ts
```

El **frontend** seguirá usando los “ports” (`ClubCatalogPort`, `MatchResultsPort`) definidos en `src/data/services/registry.ts`: en una fase posterior se reemplaza la implementación `local*` por `api*` que hace `fetch` a estas rutas.

## API mínima (contrato)

Rutas alineadas al pedido; implementación por fases (501 → CRUD real).

### Players
- `GET /api/players`
- `POST /api/players`
- `PUT /api/players/:id`
- `PATCH /api/players/:id/status`

### Tournaments
- `GET /api/tournaments`
- `GET /api/tournaments/:id`
- `POST /api/tournaments`
- `PUT /api/tournaments/:id`

### Matches / resultados
- `GET /api/tournaments/:id/matches`
- `POST /api/matches/:id/result`
- `POST /api/results/bulk-save`

### Rankings
- `GET /api/rankings?league=`
- `POST /api/recalculate/rankings`

### Público (sin auth o rate-limit)
- `GET /api/public/home`
- `GET /api/public/tournaments`
- `GET /api/public/tournaments/:slug`
- `GET /api/public/rankings`
- `GET /api/public/players/:id`

### News
- `GET /api/news`
- `POST /api/news`
- `PUT /api/news/:id`
- `PATCH /api/news/:id/status`

### Audit
- `GET /api/audit`

### Settings
- `GET /api/settings` / `PUT /api/settings/:key` (opcional en schema `settings`)

## Modelo de datos (resumen)

| Entidad Prisma | Rol |
|----------------|-----|
| `Player` | Jugador del club |
| `Tournament` | Torneo + `ligaDoc` JSON |
| `TournamentLeague` | Ligas 1–6 declaradas por torneo |
| `Group` / `GroupPlayer` | Grupos de fase y plantel |
| `Match` | Partido cuadro / agenda (IDs de jugadores) |
| `MatchResult` | Resultado admin (nombres + `dedupeKey`, alineado a `MatchInput`) |
| `RankingSnapshot` | Cache opcional por liga |
| `News` | Noticias con `status` |
| `AuditLog` | Auditoría |
| `Setting` | Clave/valor JSON (site settings) |

Migración SQL inicial: `server/prisma/migrations/20260205120000_init/migration.sql` + `migration_lock.toml`. En Hostinger: `npx prisma migrate deploy`.

## Estado actual del backend (en este repo)

- **Fase 0**: `server/` con Express, CORS, `GET /health`, Prisma, `src/envBootstrap.ts` (compone `DATABASE_URL` desde `DB_*` si falta la URL completa).
- **Lecturas con datos reales**: `GET /api/players`, `GET /api/tournaments`, `GET /api/tournaments/:id`, `GET /api/tournaments/:id/matches`, `GET /api/news` (listado), `GET /api/audit`, `GET /api/public/home`, `GET /api/public/tournaments`, `GET /api/public/tournaments/:slug`, `GET /api/public/players/:id`.
- **501 (pendiente por fase)**: mutaciones de players/tournaments/news; `POST /api/matches/:id/result`, `POST /api/results/bulk-save`; `GET /api/rankings`, `POST /api/rankings/recalculate`, `POST /api/recalculate/rankings`; `GET /api/public/rankings`.

## Fases de implementación

| Fase | Contenido |
|------|-----------|
| **0** | Schema Prisma + migraciones + `server` arranca + `GET /health` |
| **1** | `players` CRUD + validación básica |
| **2** | `tournaments`, `tournament_leagues`, `groups`, `group_players`, `matches` |
| **3** | `match_results` alineado a `MatchInput` + bulk-save + recálculo servidor (job o sync) |
| **4** | Auth admin JWT + `audit_logs` en mutaciones |
| **5** | `ranking_snapshots` + `GET /api/rankings` materializado o bajo demanda |
| **6** | `news` + `settings` |
| **7** | Adaptadores frontend: `ApiClubCatalogRepository`, `ApiMatchResultsRepository` + `VITE_API_URL` |

## Despliegue Hostinger

1. Crear base MySQL y usuario con acceso remoto (o solo localhost si el Node corre en el mismo host).
2. Aplicar migraciones: `npx prisma migrate deploy` en CI/CD o post-deploy.
3. App Node: comando `node dist/index.js` o `tsx` según build; `PORT` el que asigne Hostinger.
4. Frontend estático: build Vite y servir; `VITE_API_URL` apuntando al subdominio API o path `/api` detrás de reverse proxy.

## Seguridad

- CORS restrictivo a dominios conocidos.
- HTTPS obligatorio en producción.
- JWT corto + refresh opcional; rotación de `JWT_SECRET`.
- Auditoría en tablas sensibles (`match_results`, `players` status).
