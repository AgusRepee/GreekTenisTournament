# Informe Final de Testing — Greek Tennis Series

## Resumen ejecutivo

La base técnica está en buen estado: frontend compila en modo API, backend compila, Prisma genera cliente y las suites automatizadas pasan. La app tiene login admin real por JWT, rutas API admin protegidas, persistencia API/MySQL cableada para resultados, programación, estado de liga, eliminación, rankings/perfiles y finalización.

La conclusión de QA es: **no está lista todavía para subir como producción final sin una última corrida en entorno Hostinger/MySQL real**. El bloqueo no es un error de build: falta ejecutar `prisma migrate deploy` y una simulación E2E real con `DATABASE_URL`, `ADMIN_PASSWORD`, `JWT_SECRET`, `CORS_ORIGIN`, `VITE_DATA_SOURCE=api` y `VITE_API_URL` definitivos.

## Comandos ejecutados

```bash
npm run build
npm test
```

```powershell
$env:VITE_DATA_SOURCE='api'; $env:VITE_API_URL='http://localhost:3001'; npm run build
```

```bash
cd server
npx prisma generate
npm run build
npm test
```

```powershell
cd server
if ($env:DATABASE_URL) { npx prisma migrate deploy } else { Write-Output 'DATABASE_URL not set; skipping migrate deploy' }
```

## Resultado técnico

- Frontend build: **OK** en modo API (`VITE_DATA_SOURCE=api`, `VITE_API_URL=http://localhost:3001`).
- Backend build: **OK** (`tsc -p tsconfig.json`).
- Tests: **OK**. Frontend: 19 archivos, 122 tests. Backend: 4 archivos, 23 tests.
- Prisma: **OK** (`npx prisma generate`).
- Migraciones: **pendiente por entorno**. No se ejecutó `prisma migrate deploy` porque no hay `DATABASE_URL` seteada en esta máquina.

## Flujo admin validado

Validado por código y tests:

- `/login` usa `POST /api/admin/auth/login`.
- Backend exige `ADMIN_PASSWORD` y `JWT_SECRET`.
- JWT se guarda en `sessionStorage` bajo `greek-admin-jwt`.
- Las rutas `/api/admin/*` pasan por `requireAdminJwt`.
- 401 limpia sesión y redirige a `/login?sesion=expirada`.
- La regla crítica “resultado jugado normal requiere fecha/hora” existe en frontend y backend.
- W.O. queda exceptuado de fecha/hora y puede persistir resultado 6-0 6-0.
- Avance KO backend está cubierto por tests.
- Confirmaciones admin ya no usan `window.confirm` en el panel revisado.
- Modales globales renderizan en `document.body`, bloquean scroll y ya no cierran por click afuera por defecto.

Pendiente de validar en navegador real:

- Login completo con contraseña real.
- Operar Novak Liga 1 punta a punta contra MySQL.
- Recarga de navegador después de programar, cargar resultado, capturar seeds y finalizar torneo.
- Confirmación visual responsive 375px/430px.

## Flujo público validado

Validado por código:

- Rutas públicas no requieren JWT.
- Detalle público consume programación, eliminación, rankings y perfiles desde API cuando `VITE_DATA_SOURCE=api`.
- La programación pública excluye cancelados/jugados donde corresponde para “partidos importantes”.
- El detalle de torneo tiene estructura responsive y vistas Novak unificadas.
- Master Finals se identifica como Masters 1000 por ID/nombre y ahora también en el dato default.

Pendiente de validar en navegador real:

- Home pública completa contra API real.
- Ranking/perfil reflejando cambios post-finalización.
- Sin scroll horizontal general en mobile.
- Visual final de `Programación`, `Partidos`, `Tabla` y `Eliminación` en datos reales.

## API/MySQL y persistencia

El backend tiene modelos Prisma para torneos, jugadores, partidos, resultados, agenda, ligas, eliminación, rankings y auditoría. La API admin persiste resultados, programación, confirmación de grupos, eliminación, KO, preclasificación y finalización.

Limitación importante: sin `DATABASE_URL` no se pudo validar migración real ni persistencia real con recarga. Esto debe cerrarse en Hostinger o en local con MySQL.

## Responsive

Validado por revisión de código:

- Admin usa header mobile, drawer, tabs adaptadas y modales globales.
- Resultados/Fechas permiten nombres legibles y layouts adaptados.
- Botón “volver arriba” aparece según scroll.
- Público usa grillas/selects responsive en navegación y filtros.

Pendiente: prueba manual en 375px y 430px con navegador real.

## Seguridad

Correcciones aplicadas:

- En modo API, `/admin` ya no acepta sesión local vieja (`localStorage`) como admin.
- `VITE_ADMIN_TOKEN` ya no se usa fuera de `DEV`.
- Los requests admin de producción dependen del JWT de login.

Riesgos pendientes:

- `ADMIN_PASSWORD` es contraseña plana compartida. Para producción inicial puede servir, pero conviene rotarla y hacerla fuerte.
- Si `CORS_ORIGIN` no se configura, el backend queda permisivo. Debe setease al dominio real.
- No hay rate limiting en login admin.

## Problemas encontrados

- `Master Finals` figuraba como `greek500` en defaults aunque la lógica efectiva lo trataba como Masters 1000.
- `VITE_ADMIN_TOKEN` podía actuar como bypass si se configuraba fuera de desarrollo.
- Una sesión legacy local podía habilitar visualmente el admin en modo API.
- `AdminGlobalModal` cerraba por click afuera por defecto.
- Había un `confirm()` nativo en gestión secundaria de partidos locales.
- Documentación Hostinger mostraba un build de ejemplo con `VITE_DATA_SOURCE=local`.

## Correcciones aplicadas

- `src/lib/clubDataDefaults.ts`: `t-masters` ahora usa `tournamentType: 'masters1000'`.
- `src/lib/adminAuth.ts`: en modo API solo cuenta JWT real o token dev.
- `src/lib/api/apiClient.ts`: `VITE_ADMIN_TOKEN` solo se usa en `DEV`.
- `src/pages/admin/AdminGlobalModal.tsx`: click afuera no cierra por defecto.
- `src/pages/admin/AdminDataManager.tsx`: reemplazado `confirm()` por `AdminConfirmDialog`.
- `.env.example`, `README.md`, `docs/hostinger-backend-mysql.md`: documentación alineada a Hostinger/API.

## Pendientes críticos

- Ejecutar `npx prisma migrate deploy` con `DATABASE_URL` real.
- Probar login admin real contra backend Hostinger/local MySQL.
- Simular flujo completo Novak Liga 1 con persistencia real: programación, resultado, confirmación, KO, ranking, perfil y público.
- Confirmar `CORS_ORIGIN` exacto del dominio de producción.
- Confirmar que el build final se haga con `VITE_DATA_SOURCE=api` y `VITE_API_URL` productiva.

## Pendientes no críticos

- Optimizar chunk JS principal mayor a 500 kB.
- Revisar imagen `pagefondo` de ~9 MB en assets.
- Agregar rate limiting al login.
- Reemplazar `ADMIN_PASSWORD` plano por usuarios/hash si el admin crece.

## Recomendación final

### ¿Está listo para subir a Hostinger?

**No está lista todavía como producción final.**

Sí está lista para una **prueba de staging en Hostinger/MySQL**. Si esa corrida pasa con migraciones, login real y flujo Novak Liga 1 punta a punta, puede pasar a producción con observaciones menores.

## Checklist final

- [x] Frontend build OK.
- [x] Frontend build OK en modo API.
- [x] Tests frontend OK.
- [x] Prisma generate OK.
- [x] Backend build OK.
- [x] Tests backend OK.
- [x] Variables documentadas.
- [x] Login JWT implementado.
- [x] API admin protegida por JWT.
- [x] No depender de `VITE_ADMIN_TOKEN` en producción.
- [x] Master Finals marcado como Masters 1000.
- [x] Modales globales sin cierre por click afuera.
- [x] Sin `window.confirm` en admin revisado.
- [ ] `prisma migrate deploy` ejecutado con `DATABASE_URL` real.
- [ ] E2E admin completo contra MySQL.
- [ ] E2E público reflejando cambios admin.
- [ ] Responsive manual 375px/430px.
- [ ] CORS productivo confirmado.
