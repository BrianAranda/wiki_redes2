# Proyecto: Wiki de estudio — Redes II (IC421)

## Qué es este proyecto
Soy estudiante de Ingeniería (U.Na.M.) preparando el **final de Redes II**, materia teórica y
práctica. Es una wiki de notas `.md` interconectadas que construimos **iterativamente, tema por
tema**, a partir de los PDFs de la cátedra, escrita en Obsidian y publicada con Quartz.

NO es un proyecto de software (aunque Quartz sí lo sea): no escribo código, el "producto" son
notas de estudio bien estructuradas y enlazadas entre sí.

## Estructura del repo
Este repo cumple dos roles a la vez: es el **proyecto Quartz** (que publica el sitio) y su carpeta
`content/` es, a la vez, el **vault de Obsidian** que abro para editar. No hay copia intermedia:
edito los archivos reales que se publican.
```
/content/         ← el vault de Obsidian (se abre ESTA carpeta en Obsidian). Todo lo de abajo vive acá:
  _Fuentes/       ← PDFs crudos de la cátedra. Se leen UNA vez para extraer. No se editan.
  Teoria/         ← una subcarpeta por PDF de la cátedra (ej. `01 - Introduccion a Redes II/`),
                    con una nota por entrada del índice del PDF + un `index.md` de la carpeta.
                    Acá vive el grueso del contenido teórico.
  Practica/       ← labs y ejercicios con la máquina virtual (capturas + paso a paso).
  Modelos/        ← modelos de examen, en subcarpetas por instancia:
                    Primer parcial/, Segundo parcial/, Tercer parcial/, Final/
  Conceptos/      ← notas atómicas de conceptos transversales (TCP, UDP, IP, SAP, etc.), a demanda.
  _attachments/   ← imágenes: diagramas extraídos de PDFs y capturas de los labs.
  index.md        ← home del sitio: árbol de contenido (links a las carpetas Teoria/Practica/Modelos).
  pendientes.md   ← lista única de wikilinks sin resolver de toda la wiki (no vive en el índice).
  .obsidian/      ← config del vault (snippets CSS, plugins). Quartz la ignora al publicar.
/quartz.config.yaml, /quartz.ts, /quartz/  ← config y motor de Quartz. NO tocar salvo para estética.
/quartz/styles/custom.scss  ← overrides de CSS del sitio publicado.
```
Cada nota se referencia en las rutas de este archivo como `content/<...>` (Claude Code corre desde
la raíz del repo). Dentro de Obsidian, en cambio, `content/` es la raíz del vault, así que los
wikilinks `[[...]]` no llevan el prefijo `content/`.

### Índices de carpeta manuales (convención)
Cada carpeta tiene un `index.md` que funciona como su **índice manual**: lista con wikilinks las
notas (o subcarpetas) que contiene. El listado automático de folder-page está **desactivado**
(`showFolderCount: false` en la config + una regla CSS en `custom.scss` que oculta `.page-listing`
en las páginas de carpeta), justamente para que el index.md sea la única lista y además esos
wikilinks alimenten el grafo. Al agregar una nota nueva a una carpeta, hay que **sumar su wikilink
al `index.md` de esa carpeta a mano**. Links a carpetas: `[[Carpeta/|Alias]]` (con barra final).

## Cómo se publica (flujo, importante)
Editar una nota en `content/` y hacer `git push` a `main` es todo lo necesario: una GitHub Action
recompila el sitio y lo publica en https://brianaranda.github.io/wiki_redes2 en ~1-2 min. **No hay
paso de copia manual** entre vault y sitio: son la misma carpeta. Para previsualizar en local antes
de pushear: `npx quartz build --serve` (o el `preview.bat` de la raíz).

## Nombres de archivo y carpeta: sin tildes/ñ (regla técnica, no de estilo)
El sitio publicado con Quartz (ver más abajo) usa el nombre de archivo para generar la URL de
cada nota, y hay un bug conocido en el visor de grafo cuando esa URL tiene tildes o eñes: en vez
del nombre de la nota, muestra texto corrupto (mojibake). Por eso:
- **Carpetas y nombres de archivo van siempre sin tildes/eñes** (ej. `Teoria`, `Practica`,
  `Introduccion`, `Indice`), aunque la palabra correcta en español las lleve.
- El **texto correcto en español (con tildes)** vive en el `title` del frontmatter y en los
  encabezados dentro de la nota — ahí no hay ninguna restricción, se escribe normal.
- Esta regla es solo para el nombre físico del archivo/carpeta, no para el contenido.

## Reglas de tokens (IMPORTANTES — afectan el costo de cada sesión)
- Los PDFs tienen muchas imágenes; cada página se procesa como imagen (~1.600 tokens c/u). Un PDF
  largo puede llenar el contexto. Por eso:
- **Un PDF se lee UNA sola vez**, para generar su nota `.md`. Después no se vuelve a abrir el PDF:
  se trabaja siempre sobre la nota markdown (pesa 50-100x menos).
- **Trabajamos de a un tema/unidad por sesión.** No cargar varios PDFs juntos.
- De las imágenes de cada PDF, extraer **solo los diagramas que aportan** (modelos de capas,
  esquemas de protocolos, diagramas de encapsulación). Descartar logos, íconos decorativos y
  capturas de adorno.
- Al terminar una unidad, no recargar sus imágenes en sesiones posteriores salvo que se edite esa nota.

## Cómo extraer una nota desde un PDF (formato obligatorio)
El detalle completo está en la skill `extraer-nota-catedra` (`.claude/skills/extraer-nota-catedra/SKILL.md`).
Resumen de las reglas clave:
- **Un PDF = una carpeta = una nota por entrada del índice.** Cada PDF de `content/_Fuentes/` va a
  su propia carpeta `content/Teoria/<NN> - <Título del PDF>/`, y **cada entrada de nivel superior
  de la Tabla de Contenidos del PDF es su propia nota** dentro de esa carpeta (no se agrupan varias
  entradas en una sola nota). Los subtítulos de una entrada son `##` dentro de su nota, no notas
  separadas.
- **Frontmatter de cada nota: solo `title`, salvo excepción puntual.** `fuente` va normalmente
  únicamente en el `index.md` de la carpeta (wikilink al PDF, o texto plano si es una referencia
  sin archivo como un capítulo de libro; lista si son varias fuentes) — no se repite en cada nota
  porque todas comparten el mismo origen. Si una nota puntual se apoya además en una fuente propia
  distinta (ej. un artículo o documentación externa citada solo ahí), esa nota suma su propio
  `fuente` en frontmatter, sin quitar el del `index.md`.
- **`index.md` de la carpeta**, con `title` + `fuente`, y el índice de las notas como
  `# Tabla de contenido` seguido de una entrada por nota en formato `## N. [[nn - Nota|Título]]`
  (encabezados numerados, no una lista simple `-`, para que el TOC automático de Quartz en la
  barra lateral los muestre), y la sección de cierre `# Preguntas de repaso` — esto ya no va en
  cada nota individual, se consolida acá.
- **Sin índice interno por nota.** Aunque una nota tenga subtítulos (`##`/`###`) propios, no se
  agrega a mano una lista `# Índice`: Quartz ya genera un TOC automático en la barra lateral a
  partir de los encabezados de la nota.
- **Navegación secuencial obligatoria** al final de cada nota: `**Volver a:** [[...]]` /
  `**Continuar a:** [[...]]` (en líneas separadas por un renglón en blanco), conectando cada nota
  con la siguiente. La primera no lleva "Volver a"; la última, en vez de "Continuar a" hacia una
  nota, enlaza a las preguntas de repaso del `index.md` de la carpeta usando la **ruta completa**
  (ej. `[[Teoria/01 - Introduccion a Redes II/index#Preguntas de repaso|Preguntas de repaso]]`),
  porque cada carpeta tiene su propio `index.md` y un wikilink corto `[[index#...]]` es ambiguo en
  todo el vault. Ojo: un alias de wikilink con `/` se trunca (bug del renderer, ej. "TCP/IP" se ve
  como "IP") — usar alias sin barra.
- Wikilinks a conceptos con nota propia, callouts de Obsidian, imágenes extraídas del PDF (no
  inventadas), sin tildes/eñes en archivos y carpetas — todo esto igual que antes, ver la skill.

## Flujo de práctica / labs
- Cada lab es una nota en `content/Practica/`. Pego capturas de la VM en `content/_attachments/`.
- Redactar el **paso a paso** intercalando `![[captura.png]]` con la explicación de qué se hizo
  y por qué (no solo describir la imagen: explicar el concepto de red que demuestra).
- Enlazar cada lab con la(s) nota(s) teórica(s) que aplica (`[[Encapsulación]]`, etc.).

## Flujo de repaso: responder preguntas de cátedra
- Se activa **a pedido**, no automáticamente al extraer la nota (para eso ver la skill
  `extraer-nota-catedra`). Normalmente lo pido después de haber revisado/editado la nota a mano.
- Para cada callout `> [!question]` de la nota indicada, agregarle el modificador `-` (queda
  `> [!question]-`) y sumar una línea `> **Respuesta:** ...` al final (después de la pregunta y de
  la pista de la cátedra si la tiene), respondiendo en base al contenido de esa nota (y de notas
  enlazadas si hace falta):
  ```markdown
  > [!question]- Pregunta de la cátedra
  > ¿...?
  > Ayuda dada por la cátedra: ...
  >
  > **Respuesta:** ...
  ```
  Todo el callout (pregunta, pista y respuesta) se pliega en conjunto, para poder practicar
  tapándolo entero. **No usar un callout anidado para la respuesta** (`> > [!success]-`): en el
  sitio publicado no queda colapsable.
- Si una pregunta no se puede responder solo con lo que hay en el vault (requiere un dato de
  laboratorio, algo externo a la cátedra, etc.), no inventar: marcarla como
  `> **Respuesta:** (requiere información externa, no está en esta nota)` y avisarme cuál quedó así.
- No confundir con `# Preguntas de repaso` del `index.md` de la carpeta del PDF —
  esa se deja **sin** respuesta a propósito, es para practicar de memoria (ver "Flujo de simulacro
  de examen").

## Flujo de simulacro de examen
- En `content/Modelos/` guardo modelos de examen, en subcarpetas por instancia (`Primer parcial/`,
  `Segundo parcial/`, `Tercer parcial/`, `Final/`). Las preguntas teóricas son **de desarrollo**
  (pregunta → respuesta teórica breve), no opción múltiple.
- Modo práctica: me hacés UNA pregunta, respondo, y corregís **contra mi nota del tema**,
  marcando qué me faltó o qué dije de más. No me des la respuesta antes de que yo intente.

## Mis preferencias
- Respondé en **español**, explicaciones breves, sin introducción ni conclusión de relleno.
- Paso a paso y con ejemplos concretos.
- **Si para resolver algo te falta información, pedímela antes de inventar.**
- Trabajo iterativo: voy corrigiendo sobre la marcha; esperá mis ajustes antes de procesar en lote.

## Estado de avance
- [x] Unidad 1 — Introducción a Redes II
- [ ] (ir completando a medida que avancemos)
