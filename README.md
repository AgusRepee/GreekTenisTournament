# Greek Tennis Series

App de torneos de tenis con frontend Vite/React y backend Express/Prisma para persistencia MySQL.

## Ejecutar en local

**Requisitos:** Node.js

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Copiar `.env.example` a `.env.local` y ajustar `VITE_API_URL` / `VITE_DATA_SOURCE`.
3. Ejecutar la app:
   ```bash
   npm run dev
   ```

## Desplegar

- **Frontend Hostinger:** compilar con `VITE_DATA_SOURCE=api` y `VITE_API_URL=https://tu-api`.
- **Backend Hostinger/MySQL:** ver `docs/hostinger-backend-mysql.md` y `server/.env.example`.
- **Validación operativa:** ver `docs/admin-operativo-testing.md`.
