# Blashgol CAD

CAD 3D en el navegador (sólidos + operaciones booleanas) que se usa **a la vez** con el ratón y desde el chat con Claude.

- **App publicada:** https://claude.ai/artifact/Y7Cktv7Whkm8ghJPjxEfVD
- **Proyectos**: botón «Proyectos» en la barra superior para crear, abrir, duplicar y borrar. Todo se guarda solo; cada proyecto vive en `projects/<id>` de la base de datos del artefacto y `cad/state` indica cuál está abierto.
- El modelo abierto se sincroniza en vivo. Lo que tú cambias en la app, Claude lo lee; lo que Claude escribe, aparece en tu pantalla al momento ("Claude actualizó el modelo"). Los cambios de Claude se pueden deshacer con Ctrl+Z.

## Qué hace

- **Chat con Claude** dentro de la app: los mensajes llegan a la sesión de Claude Code del proyecto, que modifica el modelo y responde en el mismo panel. También hay un «Asistente rápido» que responde al momento dentro de la página.
- Sólidos: caja (con redondeo y vaciado), cilindro (con vaciado), prisma hexagonal, cono/tronco, esfera, toro.
- **Croquis** (botón en la barra izquierda): eliges plano XY, XZ o YZ, dibujas con Línea, Rectángulo o Círculo (las formas interiores son agujeros), **acotas** con la herramienta Cota (longitudes, ancho/alto, diámetro y posición exactos; las cotas se muestran en el croquis) y terminas con Extruir, Extruir corte, Revolución, Barrido o Nervio. Operaciones con croquis:
  - **Extrusión** (con chaflán/redondeo de aristas, vaciado, simétrica; plano XY, XZ o YZ)
  - **Revolución** (ángulo parcial o completo)
  - **Barrido** de un perfil por una trayectoria 3D (suave o poligonal)
  - **Recubrir** (loft) entre dos perfiles distintos
  - **Nervio**: línea abierta que se rellena hasta tocar el material anterior, con espesor
- **Imágenes de referencia**: adjunta fotos o planos en el chat (botón, pegar o arrastrar) para que Claude construya a partir de ellas, y colócalas en la vista 3D como plano de calco (como «Picture» de Rhino) con plano, ancho, posición y opacidad.
- **Editar cualquier pieza**: doble clic (en la vista o en el árbol) abre su croquis; los sólidos básicos se convierten en extrusión o revolución con la misma forma.
- **Redondeo** y **Chaflán** como operaciones: en todas las aristas, solo arriba y abajo, o solo en las esquinas del croquis.
- **Patrones** lineal y circular, y **simetría** respecto a los planos del origen, en cualquier pieza.
- Cada pieza es **Sólido**, **Hueco** (se resta) o **Intersección**. Se aplican en el orden de la lista.
- Gizmo para mover / rotar / escalar, ajuste a rejilla (1, 5, 10, 0,5 mm o libre), giros de 15°.
- Vistas Iso, Planta, Alzado, Perfil; tamaño total y volumen en vivo.
- Deshacer/rehacer, duplicar, apoyar en el suelo, ocultar, reordenar.
- Exportar **STL** (para impresión 3D) y ver/editar/pegar el modelo como **JSON**.

Unidades en mm, eje Z hacia arriba. En los sólidos `pos` es el **centro**; en las operaciones con boceto, el origen del boceto.

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
| `extrude`  | `d`, `b` (chaflán/redondeo), `bs` (segmentos, 1 = chaflán), `t` (vaciado), `open`, `sym` + `sk` |
| `revolve`  | `a` (ángulo), `n` + `sk` (perfil x = radio, y = altura; eje Z local) |
| `sweep`    | `steps`, `smooth` + `sk` (perfil) + `path` `[[x,y,z],…]` |
| `loft`     | `h`, `n` + `sk` (perfil inferior) + `sk2` (superior) |
| `rib`      | `t` (espesor), `d` (distancia máx.), `flip` + `sk` (línea abierta) |

Los croquis son `{"loops": [[[x,y],…], …]}`: el primer lazo es el contorno y los demás, agujeros. Se dibujan en el plano XY local de la pieza; `rot` lo orienta (`[90,0,0]` = plano XZ, `[90,90,0]` = plano YZ) y `pos` es su origen.

Imágenes de calco a nivel de modelo: `"refs": [{"img": "<asset id>", "plane": "XZ", "w": 100, "pos": [0,0,50], "op": 0.6, "hidden": false}]` (`w` = ancho en mm, `pos` = centro).

Opcionales en cualquier pieza: `"pat": {"t":"lin","n":3,"d":[20,0,0]}` o `{"t":"circ","n":6,"a":360,"ax":"z","c":[0,0,0]}`, y `"mir": {"x":true}` (espejo respecto al plano YZ).

`op`: `add` | `sub` | `int`. `rot` en grados (X, Y, Z). Cilindros, conos y hexágonos van a lo largo de Z.

## Uso local

`index.html` funciona también abierto en local (guarda en `localStorage`, sin sincronizar).

```bash
npm install
# Renderiza un modelo a PNG (y STL) sin red, con las librerías de node_modules:
node tools/render.mjs models/ejemplo.json vista.png iso --stl pieza.stl
```

Requiere Playwright instalado (`NODE_PATH` debe apuntar a él si es global).
