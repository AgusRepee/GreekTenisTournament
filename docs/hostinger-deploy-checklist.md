# Deploy Hostinger — Greek Tennis Series

## Backend Node.js App

Repositorio: https://github.com/AgusRepee/GreekTenisTournament.git
Rama: `hostinger-staging`
Root directory: `server`
Node version: 20 o 22

### Build command

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

### Start command

```bash
npm start
```

### App port

```txt
3001
```

Si Hostinger asigna el puerto automaticamente, el backend usa `process.env.PORT`.

### Variables backend

```env
DATABASE_URL="mysql://u592173310_TorneosGreek:MYSQL_PASSWORD@localhost:3306/u592173310_TorneosGreek"
PORT=3001
JWT_SECRET="COMPLETAR_CLAVE_LARGA_SEGURA"
ADMIN_PASSWORD="COMPLETAR_PASSWORD_ADMIN"
CORS_ORIGIN="https://greektennis.com"
```

Si la password MySQL tiene caracteres especiales en `DATABASE_URL`, codificarlos:

```txt
@ -> %40
# -> %23
: -> %3A
/ -> %2F
% -> %25
```

Tambien se puede usar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` en vez de `DATABASE_URL`; el backend arma la URL con `server/src/envBootstrap.ts`.

## Frontend HTML

Frontend publico:

```txt
https://greektennis.com
```

API:

```txt
https://api.greektennis.com
```

Variables frontend:

```env
VITE_DATA_SOURCE=api
VITE_API_URL=https://api.greektennis.com
```

No usar `VITE_ADMIN_TOKEN` en produccion. El admin debe funcionar con login real y JWT.

Build:

```bash
npm run build:production
```

Carpeta a subir:

```txt
dist/
```

## Endpoints minimos para probar

```bash
curl https://api.greektennis.com/health
curl https://api.greektennis.com/api/public/home
curl https://api.greektennis.com/api/public/rankings
curl -X POST https://api.greektennis.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"ADMIN_PASSWORD"}'
```

## Checklist de validacion

- [ ] Backend deployado en Hostinger.
- [ ] Variables backend cargadas.
- [ ] Prisma generate OK.
- [ ] Prisma migrate deploy OK.
- [ ] Backend build OK.
- [ ] Backend responde `/health`.
- [ ] Backend responde `/api/public/home`.
- [ ] Login admin devuelve JWT.
- [ ] Frontend build production OK.
- [ ] Frontend conectado a `VITE_API_URL`.
- [ ] Login admin funciona desde `greektennis.com`.
- [ ] Programar partido persiste.
- [ ] Cargar resultado persiste.
- [ ] Publico refleja cambios del admin.
- [ ] Simular Novak Djokovic Liga 1.
