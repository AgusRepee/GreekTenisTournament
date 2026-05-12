# API Greek Tennis (MySQL + Prisma + Express)

## Requisitos

- Node.js 20+
- MySQL 8+ (local o Hostinger)

## Puesta en marcha

```bash
cd server
npm install
cp .env.example .env
# Editar .env: DATABASE_URL o piezas DB_*
npx prisma generate
# Si el repo ya incluye migraciones en prisma/migrations/:
npx prisma migrate deploy
# Desarrollo con shadow DB (alternativa): npx prisma migrate dev
npm run dev
```

- Salud: `GET http://localhost:3001/health`
- Público: `GET /api/public/tournaments`, etc.
- Admin (JWT): rutas bajo `/api/admin` (ver `src/routes/adminApiRouter.ts`); login `POST /api/admin/auth/login`.

## Producción (Hostinger)

1. Importar repo desde GitHub: `https://github.com/AgusRepee/GreekTenisTournament.git`.
2. Rama deploy: `hostinger-staging`.
3. Root directory en Hostinger: `server`.
4. Variables de entorno: `DATABASE_URL` o `DB_*`, `JWT_SECRET`, `ADMIN_PASSWORD`, `CORS_ORIGIN`, etc. (ver `.env.hostinger.example`).
5. Build command: `npm install && npx prisma generate && npx prisma migrate deploy && npm run build`.
6. Start command: `npm start` (`node dist/index.js`).
7. Guía detallada: `docs/hostinger-backend-mysql.md` y `docs/hostinger-deploy-checklist.md`.

## Documentación adicional

- `docs/hostinger-backend-mysql.md` — despliegue Hostinger + variables + Vite.
- `docs/BACKEND_MIGRATION.md` (si existe) — evolución incremental.
