# Greek Tennis API — Hostinger Deploy

Backend Node/Express separado para deploy en Hostinger. En esta rama el contenido de `server/` vive directamente en la raíz del repositorio.

## Hostinger settings

Framework preset: Express  
Branch: hostinger-api  
Root directory: ./  
Node version: 22.x  
Entry file: dist/index.js

## Build command

```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

## Start command

```bash
npm start
```

## Environment variables

```env
DATABASE_URL=mysql://u592173310_TorneosGreek:MYSQL_PASSWORD@localhost:3306/u592173310_TorneosGreek
PORT=3001
JWT_SECRET=COMPLETAR
ADMIN_PASSWORD=COMPLETAR
CORS_ORIGIN=https://greektennis.com
```

No subir `.env` reales al repositorio. Si la contraseña MySQL tiene caracteres especiales, encodearla para URL:

```txt
@ -> %40
# -> %23
: -> %3A
/ -> %2F
% -> %25
```

## Local setup

```bash
npm install
npx prisma generate
npm run build
npm test
```

No ejecutar `npx prisma migrate deploy` localmente sin `DATABASE_URL` real. Las migraciones se ejecutan en Hostinger con las variables reales.

## Test endpoints

GET /api/public/home  
GET /api/public/rankings  
POST /api/admin/auth/login
