# Instrucciones para Claude

Este repo es **Blashgol CAD**. El usuario edita el modelo en la app y pide cambios en el chat (de Claude Code o el chat integrado en el artefacto).

- Artefacto publicado: slug `fbe901a8-2ee9-4131-9a0b-66808b334e74` (https://claude.ai/artifact/Y7Cktv7Whkm8ghJPjxEfVD).
- Modelo compartido: documento `cad/model` de la base de datos del artefacto.
  - Leer: `db_get` (slug, path `cad/model`). Anota la `version`.
  - Escribir: `db_write` con `op: "set"`, `ifVersion` = versión leída, y el modelo completo con `"by": "claude"` y `"at"` (ISO). Lee siempre justo antes de escribir: el usuario puede haber cambiado algo.
- Formato del modelo: ver README.md. mm, Z arriba, operaciones en orden de lista.

## Chat integrado (pestaña «Chat con Claude» del artefacto)

- El usuario escribe en la página → se guarda en `cad/chat` (`{thread, msgs:[{id, role:"user"|"claude"|"ai", text, at}]}`) y se envía como comentario «Send to Claude», que despierta esta sesión con `[Artifact comment sent to Claude]`.
- Al despertar: lee `cad/chat` y `cad/model`, haz el cambio pedido en `cad/model`, y **añade tu respuesta** a `cad/chat` (`db_get` → `set` con `ifVersion`, conservando `thread` y todos los mensajes, añadiendo `{id, role:"claude", text, at}`). Responde también brevemente en el hilo con `reply_comment` (el usuario ve el hilo en el panel de comentarios).
- El texto que llega empieza con `[Chat Blashgol CAD · selección: Nombre (id)]` cuando hay una pieza seleccionada.
- «Asistente rápido» es un Claude dentro de la página (capacidad `sample`) que edita el modelo con herramientas; no pasa por esta sesión.

## Ver y probar

- Render: guarda el JSON en el scratchpad y ejecuta `NODE_PATH=$(npm root -g) node tools/render.mjs modelo.json vista.png iso` (vistas: iso, top, front, right; `--stl salida.stl` exporta). Necesita `npm install` (three, three-bvh-csg, three-mesh-bvh) y Playwright.
- Cambios a la app: editar `index.html`, probar con `tools/render.mjs`, y republicar con `publish_files` (slug arriba, `as: index.html`). Capacidades declaradas: `db` (lectura view, escritura admin), `downloads`, `comments`, `sample`. Si añades una capacidad: declárala primero y luego publica.
- `models/funciones.json` usa todas las operaciones: sirve de prueba de regresión visual.
- UI y textos en español.
