# Blashgol CAD

CAD 3D en el navegador (sólidos + operaciones booleanas) que se usa **a la vez** con el ratón y desde el chat con Claude.

- **App publicada:** https://claude.ai/artifact/Y7Cktv7Whkm8ghJPjxEfVD
- El modelo vive en la base de datos del artefacto (documento `cad/model`). Lo que tú cambias en la app, Claude lo lee; lo que Claude escribe, aparece en tu pantalla al momento ("Claude actualizó el modelo"). Los cambios de Claude se pueden deshacer con Ctrl+Z.

## Qué hace

- Piezas: caja, cilindro (con nº de lados), prisma hexagonal, cono/tronco, esfera, toro.
- Cada pieza es **Sólido**, **Hueco** (se resta) o **Intersección**. Se aplican en el orden de la lista.
- Gizmo para mover / rotar / escalar, ajuste a rejilla (1, 5, 10, 0,5 mm o libre), giros de 15°.
- Vistas Iso, Planta, Alzado, Perfil; tamaño total y volumen en vivo.
- Deshacer/rehacer, duplicar, apoyar en el suelo, ocultar, reordenar.
- Exportar **STL** (para impresión 3D) y ver/editar/pegar el modelo como **JSON**.

Unidades en mm, eje Z hacia arriba, `pos` es el **centro** de la pieza.

## Formato del modelo

```json
{
  "name": "Soporte en L",
  "units": "mm",
  "objects": [
    {"id": "base", "name": "Base", "type": "box", "op": "add",
     "p": {"x": 80, "y": 40, "z": 8}, "pos": [0, 0, 4], "rot": [0, 0, 0],
     "color": "#8aa4c8", "hidden": false}
  ]
}
```

| type       | parámetros `p`                         |
|------------|----------------------------------------|
| `box`      | `x`, `y`, `z` (medidas)                |
| `cylinder` | `r`, `h`, `n` (lados, 3–128)           |
| `hex`      | `r` (a los vértices), `h`              |
| `cone`     | `r1` (base), `r2` (arriba), `h`, `n`   |
| `sphere`   | `r`                                    |
| `torus`    | `R` (mayor), `r` (tubo)                |

`op`: `add` | `sub` | `int`. `rot` en grados (X, Y, Z). Cilindros, conos y hexágonos van a lo largo de Z.

## Uso local

`index.html` funciona también abierto en local (guarda en `localStorage`, sin sincronizar).

```bash
npm install
# Renderiza un modelo a PNG (y STL) sin red, con las librerías de node_modules:
node tools/render.mjs models/ejemplo.json vista.png iso --stl pieza.stl
```

Requiere Playwright instalado (`NODE_PATH` debe apuntar a él si es global).
