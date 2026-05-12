# Admin Operativo - Auditoria y Testing

Fecha: 2026-05-08  
Proyecto: `GreekTenisTournament-copia`  
Alcance: Flujo operativo de torneo ya creado (admin + publico)

## 1) Flujo probado

Se audito y valido tecnicamente el flujo:

1. Programacion de partidos
2. Confirmacion de fechas programadas
3. Reprogramacion
4. Carga de resultados
5. Confirmacion de grupos
6. Tabla y clasificacion
7. Armado de eliminacion
8. Visibilidad publica
9. Persistencia local

Metodologia aplicada:
- Auditoria de codigo de punta a punta del flujo admin/publico.
- Validacion de persistencia y adaptadores de datos.
- Correcciones de codigo en flujo de programacion.
- Build de verificacion (`npm run build`) exitoso.

## 2) Datos de prueba usados

Se uso torneo existente de pruebas del proyecto:
- Torneo: `Novak Djokovic`
- Liga: `Liga 1` (`t-novak-l1`)
- Fuente de fixture: plantillas de liga (`liga1.json` via catalogo de fixture)
- Partidos de eliminacion: catalogo KO existente

Datos cargables en runtime:
- Programacion: `localStorage["greek-tennis-match-schedule-v1"]`
- Resultados: `localStorage["greek-tennis-results-v1"]`
- Borradores resultados: `sessionStorage["greek-admin-result-drafts-v1"]`
- Historial admin: `localStorage["greek-tennis-admin-audit-log-v1"]`

## 3) Hallazgos y correcciones aplicadas

### 3.1 Programacion (corregido)

- **Hallazgo:** faltaba estado `confirmed` y accion formal "Confirmar fechas".
- **Correccion aplicada:**
  - Se agrego estado `confirmed` en modelo de programacion.
  - Se agrego `confirmedAt` en registro de programacion.
  - Se implemento boton **Confirmar fechas** en admin con modal propio y listado de partidos.
  - Se registra historial para:
    - `programacion_confirmada`
    - `programacion_reprogramada`
  - Se ajusto reprogramacion: si partido publicado cambia fecha/hora/cancha => `rescheduled`.
- **Archivos:**
  - `src/lib/tennis/matchScheduleStore.ts`
  - `src/pages/admin/views/AdminProgramacionView.tsx`
  - `src/lib/admin/tournamentAuditLog.ts`

### 3.2 Publico: Programacion (corregido)

- **Hallazgo:** la vista publica listaba programados sin semantica de confirmacion.
- **Correccion aplicada:**
  - En publico se muestran solo estados publicados:
    - `confirmed`, `rescheduled`, `postponed`, `suspended`, `cancelled`
  - Se agrego badge visual por estado de agenda.
  - Se actualizo filtro de la seccion Programacion para incluir `Confirmados`.
- **Archivo:**
  - `screens/TournamentDetailScreen.tsx`

### 3.3 Navegacion admin (corregido)

- **Hallazgo:** faltaba la nueva solapa Programacion en flujo operativo.
- **Correccion aplicada:**
  - Solapa `Programacion` agregada al esquema de tabs.
  - Integrada en workspace de torneo.
- **Archivos:**
  - `src/pages/admin/adminPanelTypes.ts`
  - `src/pages/admin/AdminTournamentWorkspace.tsx`
  - `src/pages/admin/views/AdminProgramacionView.tsx` (nuevo)

## 4) Checklist de pruebas (esperado vs real)

Estado:
- `OK`: cumple en estado actual
- `corregido`: no cumplia, se implemento ajuste
- `pendiente`: requiere desarrollo adicional o validacion E2E manual profunda

| Flujo | Esperado | Resultado real | Estado |
|---|---|---|---|
| Programar partido | Guardar fecha/hora/cancha por partido | Implementado en admin | OK |
| Editar programacion | Modificar programacion existente | Implementado en admin | OK |
| Reprogramar publicado | Cambiar a estado reprogramado | Implementado (auto) | corregido |
| Confirmar fechas | Confirmacion formal por tanda con modal | Implementado + historial | corregido |
| Publicar programacion | Visible en publico tras confirmacion | Visible solo en estados publicados | corregido |
| Filtro sin programar/programados/todos | Operativo en admin programacion | Operativo | OK |
| Estado confirmado de agenda | Existente y persistido | Agregado (`confirmed`) | corregido |
| Resultados pendientes/jugados | Flujo de carga existente | Implementado previamente | OK |
| Guardado de borrador resultados | Mantener draft sin publicar | Implementado (sessionStorage) | OK |
| Confirmar resultados de grupos | Bloquear y confirmar fase de grupos | Implementado (`groupStageStatus`) | OK |
| Tabla actualizada por resultados | Recalculo de posiciones | Implementado | OK |
| Armado eliminacion condicionado | Solo con grupos confirmados | Implementado | OK |
| Confirmacion de cruces eliminacion | Flujo de confirmacion | Implementado; fase previa/repechaje si >8 clasificados (placeholders WAIT_RP*) | OK |
| Avance automatico de ganadores KO | Propagar siguientes cruces | Cliente: flujo KO existente. Con `VITE_DATA_SOURCE=api`: avance y bloqueo de edicion dependiente en **servidor** (`server/src/services/knockoutAdvanceFromMatchResult.ts`, tests `npm test` en `server/`) | OK |
| Finalizar torneo | Accion formal de cierre + bloqueo total | Boton en cabecera + modal + `finalizeTournamentInStorage` + auditoria `torneo_finalizado` | corregido |
| Ranking desde motor | Actualizar por resultados | Local: capa derivada. API: `LeagueRankingRow` en MySQL (`recalculateRankings`) + `GET /api/public/rankings`; UI usa `useTennisLiveData` | OK |
| Perfil jugador datos derivados | Stats / últimos partidos | Local: derivados. API: `GET /api/public/players/:id` + roster local | OK |
| Perfil publico actualizado | Stats y ultimos partidos | Implementado por capa derivada | OK |
| Historial de programacion | Registrar altas/confirmaciones/reprogramaciones | Agregado | corregido |
| Confirmaciones sin `window.confirm` | Solo modales propios | Reemplazados en wizard resultados / tabla grupos / reemplazo masivo jugador | OK |
| Persistencia recarga browser | Datos sobreviven recarga | Programacion/resultados/historial persisten | OK |

## 5) Persistencia y arquitectura de datos

### 5.1 Estado actual

- Persistencia principal en `localStorage` (prototipo funcional single-admin) cuando `VITE_DATA_SOURCE=local`.
- Con `VITE_DATA_SOURCE=api`: resultados (`MatchResultsPort`), programación (`MatchSchedulePort`), estado de liga (`TournamentLeaguePort`) y eliminación (`EliminationBracketPort`) usan MySQL vía `src/lib/api/apiClient.ts` y `src/data/services/registry.ts`; el catálogo de club sigue en overlay local y los partidos KO se **sincronizan** desde `GET /api/admin/tournaments/:id/matches` (`syncTournamentMatchesFromAdminApi`) y en público desde `GET /api/public/elimination`.
- **Migración MySQL/API**: backend `server/`, documentación `docs/hostinger-backend-mysql.md`.

### 5.2 Riesgo Hostinger / multi-admin

Limitacion actual:
- `localStorage` no sincroniza entre administradores/dispositivos.
- No hay control de concurrencia ni trazabilidad server-side.

Recomendacion:
- Migrar programacion y resultados a repositorios API en `src/data/services/contracts`.
- Mantener UI desacoplada para swap transparente a backend (MySQL/PostgreSQL).

## 6) Archivos modificados en esta iteracion

- `src/pages/admin/results/AdminResultsVisualPanel.tsx`
- `src/pages/admin/views/AdminResultadosView.tsx`
- `src/pages/admin/adminPanelTypes.ts`
- `src/pages/admin/AdminTournamentWorkspace.tsx`
- `src/pages/admin/views/AdminProgramacionView.tsx` (nuevo)
- `src/lib/tennis/matchScheduleStore.ts` (nuevo)
- `src/lib/tennis/schedulableMatchCatalog.ts` (nuevo)
- `screens/TournamentDetailScreen.tsx`
- `src/lib/admin/tournamentAuditLog.ts`

## 7) Funcionalidades pendientes fuera de alcance total

1. ~~Reemplazar `window.confirm` remanentes~~ **Hecho** (wizard, tabla grupos, reemplazo en resultados).
2. ~~Flujo formal **Finalizar torneo** UI~~ **Hecho en workspace** (`AdminTournamentWorkspace` + `tournamentFinalize.ts`). Validacion manual profunda recomendada.
3. Suite E2E automatizada real (Playwright/Cypress) con casos de:
   - Programacion confirmada/reprogramada
   - Carga de resultados validos/invalidos
   - Confirmacion de grupos + eliminacion + final
   - Persistencia recarga paso a paso
4. Endpoint/backend real para persistencia compartida (multi-admin).

## 8) Segunda tanda admin operativo (2026-05-08)

### 8.1 Implementado / verificado en codigo

- **Sin `alert`/`window.confirm` en admin operativo revisado**: confirmaciones via `AdminConfirmDialog`.
- **Finalizar torneo**: solo habilitado con final con ganador; modal de confirmacion; `finalizeTournamentInStorage`; torneo `status: finished`; `winnerId`/`finalistId`; `recalculateTournament` + historial `torneo_finalizado`; ciclo admin pasa a solo lectura (`deriveAdminTournamentLifecycle` → finalizado).
- **Eliminatoria**: armado con cuartos + **fase previa/repechaje** cuando hay mas de ocho clasificados (persistencia KO shell + avance placeholders `WAIT_RP_*` documentado en iteracion anterior).
- **Confirmar grupos**: flujo previo intacto (`groupStageStatus`, bloqueo, historial).

### 8.2 Pendiente validacion manual E2E

- Ver seccion **11** (QA asistida): alli quedan pendientes reales tras revision de codigo + build.
- Caso marginal: revertir/desfinalizar torneo desde datos (solo documentado en lifecycle hint; no automatizado).

## 11) QA manual asistida – circuito completo (2026-05-08)

**Metodologia:** revision de codigo y datos de punta a punta (admin + publico + stores), `npm run build` OK. **No** se ejecuto Playwright ni navegador headless en esta pasada; los pasos marcados **OK (codigo)** siguen recomendando una pasada manual en Chrome/Edge.

### 11.1 Errores concretos encontrados y correcciones

| ID | Sintoma esperado en QA | Hallazgo | Correccion |
|---|---|---|---|
| E1 | Tras confirmar fechas en admin, el bloque **Próximo partido** del resumen publico deberia listar esos partidos | El resumen usaba solo `getUpcomingMatchesForTournament` (fechas en `Match` del snapshot del club), **sin** leer `greek-tennis-match-schedule-v1` | Se agrego `buildUpcomingFromConfirmedSchedules` + `mergeUpcomingPreferSchedule` y el `useMemo` de `upcoming` en `TournamentDetailScreen.tsx` prioriza la agenda confirmada; Liga 3 y placeholders siguen con la ruta legacy |
| E2 | Borradores de marcador sobreviven al cerrar desplegables y a navegacion | Cierre de acordeon ya conservaba estado en React (`toggleExpanded`); el riesgo era **no persistir** si el debounce de 400 ms no alcanzaba a correr antes de desmontar la vista | En `AdminResultsVisualPanel.tsx`, el cleanup del effect de persistencia ahora llama `saveMatchDraftCellsForTournament` al desmontar o al re-disparar el effect (ademas de cancelar el timeout) |

**Archivos nuevos / tocados en esta QA:** `src/lib/tennis/publicUpcomingFromSchedule.ts`, `screens/TournamentDetailScreen.tsx`, `src/pages/admin/results/AdminResultsVisualPanel.tsx`.

### 11.2 Matriz de pasos (1–22)

Leyenda estado: **OK (codigo)** = trazado en fuente coherente con el esperado; **Corregido** = ajuste aplicado en esta QA; **Manual** = requiere ejecutar UI en navegador para cerrar.

| # | Paso | Resultado esperado | Resultado obtenido (asistido) | Estado |
|---:|---|---|---|---|
| 1 | Programar partidos de fase de grupos | Filas en Programacion con fecha/hora/cancha persistidas | `AdminProgramacionView` + `upsertMatchSchedule` → `localStorage` | OK (codigo) |
| 2 | Confirmar fechas asignadas | Estado `confirmed`, historial | `matchScheduleStore` + flujo confirmacion en vista programacion | OK (codigo) |
| 3 | Publico: proximos partidos | Ver partidos confirmados en resumen o programacion | Antes fallaba resumen (E1); corregido alineando con store | Corregido |
| 4 | Cargar resultados de grupos | Grillas + `upsertResult` | `AdminResultsVisualPanel` + `resultsStore` | OK (codigo) |
| 5 | Borradores al cerrar desplegables | No perder celdas ni contador borrador | Estado en `matchDraftByKey` + session; riesgo unmount (E2) corregido | Corregido |
| 6 | Guardar resultados | Persistidos y recalculo | `upsertResult` + particiones bulk en panel | OK (codigo) |
| 7 | Confirmar resultados de fase de grupos | Bloqueo fixture + historial | `groupStageStatus`, modal confirmacion | OK (codigo) |
| 8 | Ver tabla actualizada | Posiciones desde motor/snapshot | `AdminTablaView` + `computeTournamentSnapshot` cuando aplica | OK (codigo) |
| 9 | Clasificados / repechaje / eliminados | Visible en modal confirmacion grupos | `ConfirmGroupResultsModalBody` / previews en `AdminResultsVisualPanel` | OK (codigo) |
| 10 | Armar cuadro de eliminacion | Draft cruces + validacion | `AdminEliminacionSetupPanel` | OK (codigo) |
| 11 | Confirmar cruces | Shell KO + auditoria | `replaceKnockoutShellMatches` / persist | OK (codigo) |
| 12 | Pendientes en Resultados | KO en lista pendientes | `collectPendingWorkload` + `buildKnockoutAdminEntries` | OK (codigo) |
| 13 | Fechas > Eliminacion | Pestaña si hay `koEntries` | `AdminFechasView` `showElimTab` | OK (codigo) |
| 14 | Cargar resultados eliminacion | Misma grilla KO en resultados | Panel eliminacion seccion | OK (codigo) |
| 15 | Avance automatico ganadores | Propagacion a SF/Final | `knockoutBracketAdvance` (repechaje + rondas) | OK (codigo) |
| 16 | Cargar final | Resultado con ganador en catálogo final | `evaluateTournamentFinalize` precarga | OK (codigo) |
| 17 | Finalizar torneo | `finished`, solo lectura, auditoria | `AdminTournamentWorkspace` + `finalizeTournamentInStorage` | OK (codigo) |
| 18 | Campeon y finalista | En torneo persistido + UI | `winnerId` / `finalistId` en finalize | OK (codigo) |
| 19 | Ranking actualizado | Derivado de resultados | `useTennisLiveData` / recalculate | OK (codigo) |
| 20 | Perfiles jugadores | Stats derivadas | capa perfil + resultados | OK (codigo) |
| 21 | Pagina publica actualizada | Cuadro, resultados, programacion | `TournamentDetailScreen` + stores | OK (codigo) salvo E1 corregido |
| 22 | Recarga navegador | localStorage + session borradores | Programacion y resultados en LS; borradores en SS por torneo | OK (codigo); session se pierde si se cierra pestaña (esperado) |

### 11.3 Pendientes reales

1. **E2E manual en navegador** sobre torneo de prueba (`t-novak-l1` o el que usen), siguiendo la tabla 11.2 en orden, incluyendo recarga (22) y comprobacion visual de ranking/perfil.
2. **Automatizacion** (Playwright): no cubierto; sigue en seccion 7.
3. **Homonimos / alias** en `filterUpcomingStillPending`: la coincidencia es por nombres normalizados; riesgo teoricamente bajo pero no auditado con datos reales conflictivos.
4. **Multi-dispositivo / multi-admin**: sin backend, no verificable.

## 12) Checklist API (`VITE_DATA_SOURCE=api`)

Variables de ejemplo: `VITE_API_URL=http://localhost:3001`, `VITE_ADMIN_TOKEN=<jwt>` solo en desarrollo (en staging/produccion obtener token con `adminLogin`).

| # | Paso | Qué verificar |
|---:|---|---|
| 1 | Cargar resultados de grupos | `MatchResult` sin `pending` para el torneo (`GET /api/admin/match-results?tournamentId=`). |
| 2 | Confirmar resultados de grupos | `POST .../tournament-leagues/:id/confirm-results` → 200; `TournamentLeague.groupStageStatus=confirmed`; `eliminationStatus=ready` si aplica. |
| 3 | `groupStageStatus` en MySQL | `GET /api/admin/tournaments/:tid/leagues` muestra la liga actualizada. |
| 4 | Generar cruces | `POST .../elimination/generate` o flujo UI “Generar automático” con `tournamentLeagueId` real. |
| 5 | Editar cruces | `PUT .../elimination` con `{ bracket: { preliminary, quarter } }`. |
| 6 | Confirmar cruces | `POST .../elimination/confirm` crea `Match` KO; respuesta `matchesCreated`. |
| 7 | Partidos en MySQL | `SELECT * FROM Match WHERE tournamentLeagueId=...` — repechaje/cuartos/semis/final. |
| 8 | Resultados > Pendientes | Tras `syncTournamentMatchesFromAdminApi`, partidos visibles en admin. |
| 9 | Fechas > Eliminación | Misma fuente `partidos` sincronizados. |
| 10 | Cargar resultado de eliminación | `PUT .../matches/:id/result` (flujo existente de resultados). |
| 11 | Avance automático | **Cliente** (`knockoutBracketAdvance`) con `partidos` actualizados; avance en servidor aún **pendiente** (ver §6.3 doc Hostinger). |
| 12 | Final + campeón | Finalizar torneo / `winnerId` según flujo vigente. |

**Prerequisito:** existir `TournamentLeague` para el par `(tournamentId, leagueNum)` y jugadores `sys-ko-*` (migración `20260510120000_ko_placeholder_players`).

## 9) Verificacion tecnica ejecutada

- Build produccion: `npm run build` OK (segunda tanda, QA seccion **11**, validacion navegador **13**).
- Tests: `npm test` (`vitest run`) OK – **99** tests.
- Pendiente: corrida ESLint proyectada completa si el CI lo exige.

## 10) Archivos tocados segunda tanda (referencia)

- `src/pages/admin/AdminTournamentWorkspace.tsx`
- `src/pages/admin/AdminResultWizard.tsx`
- `src/pages/admin/views/AdminTablaView.tsx`
- `src/pages/admin/ReplacePlayerInResultsTool.tsx`
- `src/lib/admin/tournamentFinalize.ts` (logica persistencia; previo esta iteracion)
- Modulos KO repechaje: `eliminationBracketProposal.ts`, `eliminationKnockoutPersist.ts`, `knockoutBracketAdvance.ts`, `elimination/AdminEliminacionSetupPanel.tsx` (revision previa/handoff)

## 12) Archivos QA asistida (2026-05-08)

- `src/lib/tennis/publicUpcomingFromSchedule.ts` (nuevo)
- `screens/TournamentDetailScreen.tsx` (bloque **Próximo partido** / `upcoming`)
- `src/pages/admin/results/AdminResultsVisualPanel.tsx` (flush borradores)
- `docs/admin-operativo-testing.md` (seccion 11)

## 13) Validacion navegador real – ultima pasada (2026-05-08)

### 13.1 Limitacion del entorno Cursor

No se puede abrir Chrome/Edge del usuario ni automatizar clics en `http://localhost:*` desde esta sesion. Por tanto la **lista 1–34** no queda marcada como “pasada en UI” desde aca; corresponde ejecutarla **en tu maquina** con `npm run dev` (o `npm run preview` sobre `dist/`).

### 13.2 Ejecucion automatica disponible (esta pasada)

| Comando | Resultado |
|---------|-----------|
| `npm run build` | OK |
| `npm test` (`vitest run`) | OK – 17 archivos, **99** tests |

Esto no reemplaza la prueba visual pero da señal de regresion sobre logica pura (ranking, grupos, KO, etc.).

### 13.3 Checklist manual recomendada (1–34)

Usar torneo de prueba **`t-novak-l1`** (u otro con plantilla de grupos activa). Persistencia: `localStorage` programacion `greek-tennis-match-schedule-v1`, resultados `greek-tennis-results-v1`, borradores `sessionStorage` `greek-admin-result-drafts-v1`.

| # | Accion | Verificar especialmente |
|---:|--------|-------------------------|
| 1 | Entrar al admin | Ruta admin carga |
| 2 | Entrar al torneo | Workspace con tabs |
| 3 | Elegir liga | Selector Novak 1–6 si aplica |
| 4 | Programar partidos de grupos | Fecha/hora/cancha persisten en Programacion |
| 5 | Confirmar fechas | Estado `confirmed` + historial si aplica |
| 6 | Pagina publica: **Próximo partido** | Bloque resumen con parejas y fecha (agenda confirmada) |
| 7 | Reprogramar partido ya confirmado | Admin pasa estado a `rescheduled` al cambiar fecha/hora publicados |
| 8 | Publico reprogramado | Pestaña Programacion: badge **Reprogramado** o filtro “Reprogramados” |
| 9 | Cargar resultados grupos | Grilla guarda en resultados |
| 10 | Cerrar desplegable sin guardar | Sin perder celdas en memoria |
| 11 | Reabrir mismo partido | Borrador visible |
| 12 | F5 con borrador sin guardar | Borrador sigue (misma pestaña; `sessionStorage`) |
| 13 | Guardar resultado | Marcador persistido |
| 14 | Fechas (admin) | Partido muestra cargado/jugado |
| 15 | Resultados admin | Estado “jugado” / cargado |
| 16 | Tabla | Posiciones coherentes |
| 17 | Jugadores sin partidos jugados | Siguen figurando donde la plantilla los lista (PJ puede ser 0) |
| 18 | Resto resultados grupos | Completar fixture grupos |
| 19 | Confirmar fase grupos | Modal + bloqueo edicion grupos sin desbloqueo |
| 20 | Modal confirmacion | Clasificados / repechaje / eliminados |
| 21 | Armar eliminacion | Draft cruces OK |
| 22 | Confirmar cruces | Partidos KO en catalogo |
| 23 | Resultados > Pendientes | Aparecen cruces KO jugables |
| 24 | Fechas > Eliminacion | Pestaña y listados |
| 25 | Cargar KO | Marcadores por ronda |
| 26 | Avance automatico | SF/Final se rellenan |
| 27 | Final con ganador | Condicion finalize |
| 28 | Finalizar torneo | Solo lectura + estado finalizado |
| 29 | Campeon / finalista | Texto/UI torneo |
| 30 | Ranking global o del torneo | Puntos ordenados |
| 31 | Perfil jugador | Ultimos torneos / stats |
| 32 | Pagina publica | Cuadro, resultados, programacion coherentes |
| 33 | F5 | Persistencia datos en `localStorage` |
| 34 | Cierre opcional pestaña | Sesion drafts se pierden (esperado); datos guardados siguen |

**Notas:** En Programacion publica usar filtro **Todos** o **Reprogramados** para el paso 8. Cancelados no deben salir como “proximos”; la agenda nueva prioriza confirmados/reprogramados/etc. (`publicUpcomingFromSchedule.ts`), no `cancelled`.

### 13.4 Errores y correcciones en esta sesion de documentacion

- **Errores de código nuevos encontrados:** ninguno en esta ultima revisión (solo `build` + `test` + consistencia lectura código).
- **Archivos de código modificados:** ninguno en esta pasada exclusiva seccion **13**.
- **Pendiente:** marcar vos la tabla anterior en una corrida manual y anotar desvíos en el repo o issues si aparecen.

## 14) Validación final modo API/MySQL (2026-05-08)

**Entorno de referencia:** `VITE_DATA_SOURCE=api`, `VITE_API_URL=http://localhost:3001`, API en `http://localhost:3001`, MySQL con `DATABASE_URL` en `server/.env`.

**Alcance:** comandos automáticos ejecutados en esta sesión + matriz funcional para cerrar en hosting o en local con API y base reales. No se añadieron funcionalidades.

### 14.1 Backend (`server/`)

| Prueba | Resultado esperado | Resultado obtenido | Estado | Archivo / nota |
|---|---|---|---|---|
| `npm run build` | `tsc` sin errores | Exit code 0 | OK | — |
| `npm test` | Vitest verde | 4 archivos, 23 tests OK | OK | `server/src/services/*.test.ts` |
| `npx prisma generate` | Cliente Prisma generado | Exit code 0 | OK | — |
| `npx prisma migrate deploy` | Migraciones aplicadas | Error P1012: falta `DATABASE_URL` en este entorno | **pendiente** | Ejecutar donde exista MySQL (Hostinger / `.env` local) |

### 14.2 Frontend (raíz del repo)

| Prueba | Resultado esperado | Resultado obtenido | Estado | Archivo / nota |
|---|---|---|---|---|
| `npm run build` con `VITE_DATA_SOURCE=api` y `VITE_API_URL=http://localhost:3001` | Compilación OK | `vite build` exit code 0 | OK | Variables pasadas en la misma shell antes del build |
| `npm test` | Vitest verde | 17 archivos, 99 tests OK | OK | stderr `fetch failed` / ECONNREFUSED si no hay API en :3001: esperado, tests pasan |

### 14.3 Login admin y JWT (revisión de código + pendiente E2E manual)

| Prueba | Resultado esperado | Resultado obtenido | Estado | Archivo |
|---|---|---|---|---|
| `/login` con `ADMIN_PASSWORD` | JWT en respuesta | `POST /api/admin/auth/login` implementado | OK (código) | `server/src/routes/authAdmin.ts` |
| Guardar token | `sessionStorage` | Clave `greek-admin-jwt` | OK (código) | `src/lib/adminTokenStorage.ts` |
| Requests admin | Header `Authorization: Bearer` | JWT o fallback `VITE_ADMIN_TOKEN` (solo dev) | OK (código) | `src/lib/api/apiClient.ts` |
| Cerrar sesión | Sin JWT accesible | `clearAdminSession` limpia sesión + token | OK (código) | `src/lib/adminAuth.ts` |
| `/admin` sin sesión | Redirige a `/login` | `ProtectedAdminRoute` + `readIsAdmin` | OK (código) | `src/pages/admin/ProtectedAdminRoute.tsx` |
| API responde **401** | Limpiar sesión y `/login?sesion=expirada` | Implementado en `req()` | OK (código) | `src/lib/api/apiClient.ts` |
| Flujo completo pasos 1–10 (usuario) | Comportamiento descrito en checklist de producto | No ejecutado en navegador desde Cursor | **pendiente (manual)** | — |

### 14.4 Programación, resultados, grupos, KO, finalización, ranking, perfil, buscador, público

Ejecutar en navegador con API + MySQL reales. Estado registrado aquí tras la pasada automática:

| Prueba | Resultado esperado | Resultado obtenido | Estado | Archivo corregido |
|---|---|---|---|---|
| §3 Programación (admin + público + F5) | Persistencia MySQL + próximos / badges | No ejecutado UI | pendiente (manual) | — |
| §5 Resultados (borrador, guardar, F5, fechas/tabla/ranking/perfil) | Consistencia API | No ejecutado UI | pendiente (manual) | — |
| §6 Confirmación grupos | `groupStageStatus`, clasificados, bloqueo, desbloqueo | No ejecutado UI | pendiente (manual) | — |
| §7 Eliminación + avance KO servidor | `Match` KO, pendientes, avance cuartos→semis→final, `winnerId`/`finalistId` | Cubierto en tests server; E2E no ejecutado | OK (tests); pendiente (manual E2E) | `server/src/services/knockoutAdvanceFromMatchResult.ts` |
| §8 Finalizar torneo | `finished`, auditoría, perfiles | No ejecutado UI | pendiente (manual) | — |
| §9 Ranking y perfiles API (casos PJ, W.O., etc.) | Payload público + rankings | No ejecutado UI | pendiente (manual) | `server/src/services/buildPublicPlayerProfile.ts`, etc. |
| §10 Buscador modo API | Posición/puntos desde ranking API | No ejecutado UI | pendiente (manual) | `src/lib/tennis/derivedTennisData.ts` |
| §11 Público completo | Home, detalle, ranking | No ejecutado UI | pendiente (manual) | — |

### 14.5 Auth API (recordatorio)

- Login: `POST /api/admin/auth/login` con cuerpo `{ password }` (igual que `ADMIN_PASSWORD` en servidor).
- Producción: preferir login; `VITE_ADMIN_TOKEN` solo como respaldo de desarrollo en cliente.

### 14.6 Resumen ejecutivo

| Criterio | Estado |
|---|---|
| TypeScript `server` (`npm run build`) | OK |
| Tests `server` (`npm test`) | OK |
| `prisma generate` | OK |
| `prisma migrate deploy` | Pendiente sin `DATABASE_URL` en la pasada |
| Build frontend con env API | OK |
| Tests frontend (`npm test`) | OK |
| QA funcional navegador + MySQL (secciones 3–11 del pedido) | Pendiente operador / Hostinger |

**Conclusión:** la base técnica compila y los tests automatizados pasan; para cierre de “listo producción” falta ejecutar la matriz §14.4 en un entorno con `DATABASE_URL`, API en `:3001` y variables `VITE_*` de API activas.

## 15) Validación staging Hostinger/MySQL

- **Fecha:** 2026-05-12
- **Base de datos:** pendiente. En este workspace no existe `server/.env` real; solo `server/.env.example`.
- **Backend URL:** pendiente.
- **Frontend URL:** pendiente.
- **Migraciones:** pendiente. No se ejecuta `npx prisma migrate deploy` hasta disponer de `DATABASE_URL` real de Hostinger/MySQL.
- **Login admin:** pendiente de probar contra backend real con `ADMIN_PASSWORD`.
- **Flujo Novak Liga 1:** pendiente de prueba E2E real.
- **Persistencia:** pendiente de validar con recarga de navegador y MySQL real.
- **Mobile:** pendiente de validar en 375px / 430px contra frontend staging.
- **Errores encontrados:** bloqueo de entorno, faltan variables reales (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD`, `CORS_ORIGIN`, `VITE_API_URL`).
- **Correcciones:** no se aplicaron cambios de código en esta etapa; se documentó el bloqueo para ejecutar staging.
- **Estado final:** pendiente de ejecución en Hostinger/MySQL.

### 15.1 Variables requeridas para staging

Backend (`server/.env` o variables del panel Hostinger):

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DB_NAME"
PORT=3001
JWT_SECRET="clave-larga-segura"
ADMIN_PASSWORD="contraseña-admin-segura"
CORS_ORIGIN="https://DOMINIO_FRONTEND"
```

Frontend staging:

```env
VITE_DATA_SOURCE=api
VITE_API_URL=https://URL_BACKEND_REAL
```

No configurar `VITE_ADMIN_TOKEN` en producción/staging.

### 15.2 Comandos de ejecución

Backend:

```bash
cd server
npx prisma generate
npx prisma migrate deploy
npm run build
npm start
```

Frontend:

```bash
VITE_DATA_SOURCE=api VITE_API_URL=https://URL_BACKEND_REAL npm run build
```

### 15.3 Endpoints mínimos a validar

```bash
curl https://URL_BACKEND_REAL/health
curl https://URL_BACKEND_REAL/api/public/home
curl https://URL_BACKEND_REAL/api/public/rankings
curl -X POST https://URL_BACKEND_REAL/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"password\":\"ADMIN_PASSWORD_REAL\"}"
```

### 15.4 Matriz E2E obligatoria

| Área | Prueba | Estado |
|---|---|---|
| Migraciones | `npx prisma migrate deploy` sobre MySQL Hostinger | Pendiente |
| Backend | `npm start` y `/health` OK | Pendiente |
| Público | `/api/public/home` y `/api/public/rankings` OK | Pendiente |
| Login | `/login` recibe JWT y entra al admin | Pendiente |
| Logout | Cierra sesión y sin JWT no entra | Pendiente |
| Novak Liga 1 | Capturar seeds | Pendiente |
| Novak Liga 1 | Programar partido y confirmar programación | Pendiente |
| Persistencia | Recargar y ver programación guardada | Pendiente |
| Resultados | Cargar resultado normal con fecha | Pendiente |
| Regla crítica | Bloquear resultado jugado normal sin fecha | Pendiente |
| W.O. | Permitir W.O. sin fecha | Pendiente |
| Tabla | Tabla actualizada luego del resultado | Pendiente |
| Eliminación | Confirmar cruces y cargar KO | Pendiente |
| Ranking/perfil | Ranking y perfil actualizados | Pendiente |
| Público | Página pública refleja cambios admin | Pendiente |
| Mobile | Admin usable en 375px / 430px | Pendiente |

## 16) Deploy Hostinger desde GitHub

- **Repositorio:** `https://github.com/AgusRepee/GreekTenisTournament.git`
- **Rama:** `hostinger-staging`
- **Backend root directory:** `server`
- **Frontend build:** `npm run build:production`
- **Frontend output:** `dist/`
- **Variables reales:** fuera del repo, cargadas en Hostinger.

Checklist operativo completo: `docs/hostinger-deploy-checklist.md`.

Pruebas minimas post-deploy:

```bash
curl https://api.greektennis.com/health
curl https://api.greektennis.com/api/public/home
curl https://api.greektennis.com/api/public/rankings
curl -X POST https://api.greektennis.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"ADMIN_PASSWORD"}'
```
