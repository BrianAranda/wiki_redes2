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
  Teoria/         ← una nota .md por unidad. Acá vive el grueso del contenido teórico.
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
Al procesar un PDF de `content/_Fuentes/`:
1. **Descartar los rótulos del aula virtual**: fecha/hora de impresión, "Imprimido por...",
   las URLs `https://aulavirtual.fio.unam.edu.ar/...` y los números de página tipo "2/7".
2. **Usar la Tabla de Contenidos del PDF como esqueleto**: una nota por unidad, y las secciones
   de esa tabla pasan a ser los encabezados `##` internos.
3. **Frontmatter: `title` + `fuente`.** Nada de `unidad`, `materia`, `tags`, `estado` — no los uso
   y ensucian la nota. Solo dos campos:
   - `title`: nombre limpio de la nota (con tildes, sin el prefijo `NN -`). Quartz lo necesita para
     mostrar bien el nombre en el grafo, la pestaña del navegador y los breadcrumbs — si falta, usa
     el nombre de archivo (con el número) como respaldo.
   - `fuente`: de dónde salió la nota. Se muestra en el panel de propiedades tanto en Obsidian
     como en el sitio publicado (con link real y descargable si es un archivo).
     - PDF de la cátedra en `_Fuentes/`: wikilink `"[[<nombre del PDF>.pdf]]"`.
     - Capítulo de libro u otra fuente externa: si tenés el archivo, mismo tratamiento (subirlo a
       `_Fuentes/` y wikilink); si es solo una referencia bibliográfica sin archivo, texto plano
       (ej. `"Kurose & Ross - Computer Networking, cap. 4"`).
     - Si la nota sale de más de una fuente, usar una lista en vez de un solo valor.
   ```yaml
   ---
   title: <Título de la unidad, sin el "NN - ">
   fuente: "[[<nombre del PDF>.pdf]]"
   ---
   ```
   Con varias fuentes:
   ```yaml
   ---
   title: <Título de la unidad, sin el "NN - ">
   fuente:
     - "[[<nombre del PDF>.pdf]]"
     - "Autor - Libro, cap. N"
   ---
   ```
4. **Índice interno al comienzo de la nota.** Justo después del encabezado `# Título` (y antes del
   primer `##`), agregar una lista con un link a cada encabezado `##` de la nota, en orden, usando
   sintaxis de Obsidian `[[#Encabezado]]`. Sirve para saltar rápido dentro de notas largas; es
   distinto del panel de TOC automático que Quartz muestra a la derecha del sitio publicado.
5. Sembrar **wikilinks `[[Concepto]]`** cada vez que aparezca un concepto que merezca nota propia
   (protocolos, modelos, términos clave). Esto teje el grafo. Si la nota destino aún no existe,
   dejar el link igual (queda "no resuelto" hasta crearla) y sumarlo a `pendientes.md`.
6. Para las imágenes: NO inventar la imagen. Insertar un placeholder
   `![[nombre-descriptivo.png]]` seguido de un comentario Obsidian
   `%% CAPTURAR: <qué figura, qué muestra, qué página del PDF> %%`.
   Si la skill de extracción de imágenes está disponible, extraer el diagrama real al
   `content/_attachments/` con ese nombre.
7. Usar **callouts de Obsidian** para resaltar:
   - `> [!important]` lo que cae seguro en el final (definiciones clave, listas cerradas).
   - `> [!question]` preguntas que plantea la cátedra.
   - `> [!info]-` glosarios largos (colapsables).
   - `> [!tip]` analogías y reglas mnemotécnicas.
8. Cerrar cada nota con una sola sección fija:
   - `## Preguntas de repaso (final teórico)` (preguntas de desarrollo derivadas del tema).
   No agregar una sección de "conceptos a desarrollar" dentro de la nota — los wikilinks sin
   resolver van a `pendientes.md`, no repetidos en cada nota.

## Flujo de práctica / labs
- Cada lab es una nota en `content/Practica/`. Pego capturas de la VM en `content/_attachments/`.
- Redactar el **paso a paso** intercalando `![[captura.png]]` con la explicación de qué se hizo
  y por qué (no solo describir la imagen: explicar el concepto de red que demuestra).
- Enlazar cada lab con la(s) nota(s) teórica(s) que aplica (`[[Encapsulación]]`, etc.).

## Flujo de repaso: responder preguntas de cátedra
- Se activa **a pedido**, no automáticamente al extraer la nota (para eso ver la skill
  `extraer-nota-catedra`). Normalmente lo pido después de haber revisado/editado la nota a mano.
- Para cada callout `> [!question]` de la nota indicada, agregar una línea
  `> **Respuesta:** ...` dentro del mismo callout (después de la pregunta y de la pista de la
  cátedra si la tiene), respondiendo en base al contenido de esa nota (y de notas enlazadas si
  hace falta).
- Si una pregunta no se puede responder solo con lo que hay en el vault (requiere un dato de
  laboratorio, algo externo a la cátedra, etc.), no inventar: marcarla como
  `> **Respuesta:** (requiere información externa, no está en esta nota)` y avisarme cuál quedó así.
- No confundir con la sección de cierre `## Preguntas de repaso (final teórico)` — esa se deja
  **sin** respuesta a propósito, es para practicar de memoria (ver "Flujo de simulacro de examen").

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
- [ ] Unidad 1 — Introducción a Redes II
- [ ] (ir completando a medida que avancemos)
