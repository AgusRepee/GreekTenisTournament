# GreekTenisTournament

App de torneos de tenis. Contiene todo lo necesario para ejecutarla en local y desplegarla.

## Ejecutar en local

**Requisitos:** Node.js

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar `GEMINI_API_KEY` en [.env.local](.env.local) con tu API key de Gemini
3. Ejecutar la app:
   ```bash
   npm run dev
   ```

## Desplegar

- **GitHub Pages (manual):** `npm run deploy`
- **GitHub Actions:** cada push a `main` despliega automáticamente si tienes Pages configurado con Source: GitHub Actions.
