# Instrucciones para Claude

Este repo es **Blashgol CAD**. El usuario edita el modelo en la app y pide cambios en el chat.

- Artefacto publicado: slug `fbe901a8-2ee9-4131-9a0b-66808b334e74` (https://claude.ai/artifact/Y7Cktv7Whkm8ghJPjxEfVD).
- Modelo compartido: documento `cad/model` de la base de datos del artefacto.
  - Leer: `db_get` (slug, path `cad/model`). Anota la `version`.
  - Escribir: `db_write` con `op: "set"`, `ifVersion` = versión leída, y el modelo completo con `"by": "claude"` y `"at"` (ISO). Lee siempre justo antes de escribir: el usuario puede haber cambiado algo.
- Formato del modelo: ver README.md. mm, Z arriba, `pos` = centro, operaciones en orden de lista.
- Para "ver" el modelo: guarda el JSON en el scratchpad y ejecuta `node tools/render.mjs modelo.json vista.png iso` (vistas: iso, top, front, right). Necesita `npm install` y `NODE_PATH` hacia Playwright.
- Cambios a la app: editar `index.html`, probar con `tools/render.mjs`, y republicar con `publish_files` (slug arriba, `as: index.html`). Las capacidades declaradas son `db` (lectura view, escritura admin) y `downloads`.
- UI y textos en español.
