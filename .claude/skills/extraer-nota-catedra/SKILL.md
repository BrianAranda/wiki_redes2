---
name: extraer-nota-catedra
description: Convierte un PDF de la cátedra en una carpeta de notas markdown de Obsidian, una nota por entrada del índice del PDF, con navegación secuencial entre ellas. Usar cuando se procese un PDF de /_Fuentes/, o cuando se diga "extraé este PDF", "armá la nota de este tema" o "pasá esto a nota". Frontmatter mínimo (solo title en las notas, con fuente propia si citan algo aparte; title+fuente en el index.md de la carpeta), nombres de archivo/carpeta sin tildes, index.md con Tabla de contenido como encabezados numerados (sin índice interno por nota, se apoya en el TOC automático de Quartz), wikilinks, callouts, extrae los diagramas reales embebidos del PDF a /_attachments/<carpeta>/ (placeholder solo si la extracción no es posible), y registra los wikilinks sin resolver en /pendientes.md.
allowed-tools: Read, Write, Glob, Bash, Skill
---

# Extraer nota de cátedra

## Cuándo se activa
Cuando hay que convertir un PDF de la cátedra (normalmente en `content/_Fuentes/`) en una nota de
estudio para el vault de Obsidian.

## Procedimiento

1. **Leer el PDF una sola vez.** No reabrirlo en pasos posteriores.

2. **Limpiar ruido del aula virtual.** Eliminar de plano:
   - Líneas de fecha/hora de impresión (ej. "4/12/25, 11:07").
   - "Imprimido por: ...", "Sitio: ...", "Curso: ...", "Libro: ...", "Día: ...".
   - URLs `https://aulavirtual.fio.unam.edu.ar/...`.
   - Números de página tipo "2/7".

3. **Un PDF = una carpeta = una nota por entrada del índice.** Cada PDF de la cátedra va a su
   propia carpeta en `content/Teoria/`, nombrada `<NN> - <Título del PDF, sin tildes>/`. Dentro,
   **cada entrada de nivel superior de la Tabla de Contenidos del PDF es su propia nota**, sin
   agrupar varias entradas en una sola nota (regla anterior de "agrupar por cohesión", derogada).
   - Nombre de archivo de cada nota: `<nn> - <Título de la entrada, sin tildes>.md`, con `nn` de
     dos dígitos **reiniciado en 1 dentro de cada carpeta** (no sigue la numeración de otras
     unidades). Ejemplo con un PDF de 5 entradas: `01 - Redes I.md`, `02 - ....md`, ...,
     `05 - Sockets.md`.
   - Si una entrada tiene subtítulos propios en la TOC, esos subtítulos son `##` dentro de esa
     nota (no notas separadas). Ver punto 6 sobre el esqueleto de cada nota.
   - Si el PDF cierra con un título tipo resumen/repaso, ese contenido no se convierte en nota:
     va a la sección de "Preguntas de repaso" de la carpeta (ver punto 8) o se descarta si ya
     está cubierto por otras preguntas.

4. **Nombre de archivo/carpeta, sin tildes/eñes**, tanto la carpeta del PDF como cada nota adentro
   (ej. `Encapsulacion.md` en vez de "Encapsulación.md"; si el título tiene `/`, como "TCP/IP",
   reemplazarlo por `-` en el nombre de archivo: `Suite de Protocolos TCP-IP.md`).
   > Esto es una regla técnica, no de estilo: el sitio publicado con Quartz genera la URL de cada
   > nota a partir del nombre del archivo, y una tilde/eñe ahí produce texto corrupto en el visor
   > de grafo (bug conocido). El texto correcto en español (con tildes, con `/`) vive en el
   > `title` del frontmatter (punto 5) y en los encabezados de la nota.

5. **Frontmatter de cada nota: solo `title`, salvo excepción puntual.** Nada de `unidad`,
   `materia`, `tags`, `estado`. `fuente` va normalmente únicamente en el `index.md` de la carpeta
   (ver punto 8) — no se repite en cada nota porque todas comparten el/los PDF de origen. Si una
   nota puntual se apoya además en una fuente propia distinta a la(s) del `index.md` (ej. un
   artículo o documentación externa citada solo ahí), esa nota suma su propio `fuente` en
   frontmatter, sin quitar el que ya tiene el `index.md`.
   ```yaml
   ---
   title: <Título de la entrada, con tildes/"/" como corresponda, sin el prefijo "nn - ">
   ---
   ```
   Si falta `title`, Quartz usa el nombre del archivo como respaldo en todos lados (grafo,
   pestaña, breadcrumbs) — y ese nombre lleva el prefijo `nn -` y no tiene tildes, así que queda feo.

6. **Esqueleto de cada nota:**
   - Sin `# Título` (el título ya lo muestra Quartz/Obsidian desde el frontmatter, repetirlo es
     redundante).
   - **Sin índice interno a mano**, aunque la nota tenga subtítulos `##`/`###` propios: Quartz
     genera automáticamente un TOC en la barra lateral a partir de los encabezados de la nota, así
     que agregar un `# Índice` con lista `[[#Encabezado]]` sería redundante. Arrancar directo con
     el contenido después del frontmatter.
     ```markdown
     ---
     title: Puntos de Acceso a Servicios
     ---
     <contenido>

     ## Ejemplo de comunicación
     ...
     ```

7. **Navegación secuencial al final de cada nota** (obligatorio), separada del contenido con
   `---`, con un renglón en blanco entre "Volver a" y "Continuar a":
   ```markdown
   ---
   **Volver a:** [[<nota anterior>|<Título limpio>]]

   **Continuar a:** [[<nota siguiente>|<Título limpio>]]
   ```
   - La primera nota de la carpeta no lleva "Volver a" (nada antes en la secuencia).
   - La última nota, en vez de "Continuar a" hacia una nota, enlaza a las preguntas de repaso de
     la carpeta: `**Continuar a:** [[Teoria/<NN - Titulo carpeta>/index#Preguntas de repaso|Preguntas de repaso]]`.
     Usar la **ruta completa** de la carpeta, nunca `[[index#...]]` a secas: cada carpeta de
     `Teoria/` tiene su propio `index.md`, así que un wikilink corto a "index" es ambiguo en todo
     el vault.
   - **El alias del wikilink (la parte después de `|`) nunca debe contener `/`** — es un bug
     conocido del renderer: un alias con `/` se trunca y solo muestra el texto después de la
     última barra (ej. `Suite de Protocolos TCP/IP` se ve como `IP`). Si el título tiene `/`,
     usar el alias sin barra (ej. `Suite de Protocolos TCP-IP`) o el nombre de archivo tal cual.

8. **`index.md` de la carpeta del PDF**, con tres partes fijas:
   ```yaml
   ---
   title: <Título del PDF/unidad, con tildes>
   fuente: "[[<nombre del PDF>.pdf]]"
   ---
   # Tabla de contenido
   ## 1. [[01 - Primer entrada|Título limpio]]
   ## 2. [[02 - Segunda entrada|Título limpio]]
   ...

   # Preguntas de repaso
   1. ... (preguntas de desarrollo derivadas de todo el contenido del PDF)
   ```
   Las entradas del índice van como encabezados `##` numerados (no una lista simple `-`): así
   aparecen en el TOC automático de Quartz en la barra lateral, igual que dentro de cualquier nota.
   `fuente` acepta lista o texto plano si la entrada no es un PDF con archivo — ver CLAUDE.md.

9. **Wikilinks.** Cada concepto con peso propio (protocolos, modelos, términos técnicos eje)
   se marca `[[Concepto]]`. Usar alias cuando convenga (recordar la limitante de barras del
   punto 7). Los que todavía no tienen nota propia se agregan a `pendientes.md` (ver "Al terminar").

10. **Imágenes — extracción real es obligatoria, el placeholder es el último recurso.**
   a. Antes de escribir ningún placeholder, intentar extraer las imágenes embebidas en el PDF:
      - Invocar la skill `pdf`, o directamente `pdfimages -list <pdf>` para listar los objetos
        de imagen por página, y `pdfimages -png <pdf> <prefijo>` para extraerlos.
      - Abrir (Read) cada imagen extraída para identificar cuál figura del texto es, descartar
        íconos decorativos/logos/animaciones (ej. el "signo de pregunta" de motivación) y
        detectar duplicados exactos (mismo tamaño en bytes/dimensiones) cuando el PDF reutiliza
        la misma figura en varias páginas — copiar el duplicado una sola vez, aunque se enlace
        desde dos secciones distintas de la nota.
      - Copiar cada diagrama útil a `content/_attachments/<nombre de la carpeta del PDF>/` con
        un nombre descriptivo en kebab-case (ver punto 11).
   b. Solo si la extracción falla (imagen no embebida, PDF escaneado sin capa de imagen
      recuperable, etc.) o si la figura no vive dentro del PDF (ej. una captura de pantalla de
      un lab con la VM, que se pega después), insertar el placeholder:
      ```
      ![[nombre-descriptivo.png]]
      %% CAPTURAR: <descripción de la figura> (Figura X, pág. Y del PDF) %%
      ```
   c. Ignorar siempre imágenes decorativas (íconos, logos, signos de pregunta animados, etc.),
      se hayan extraído o no.

11. **Organización de `content/_attachments/`.** Todas las notas de un mismo PDF comparten una
   subcarpeta dentro de `content/_attachments/`, con el mismo nombre que la carpeta del PDF (sin
   ruta). Ejemplo: las notas de `content/Teoria/01 - Introduccion a Redes II/` guardan sus
   imágenes en `content/_attachments/01 - Introduccion a Redes II/`. Esto evita que
   `_attachments/` se vuelva una bolsa plana de archivos a medida que crece el vault. Los
   wikilinks de imagen (`![[nombre.png]]`) no necesitan la ruta completa — Obsidian resuelve por
   nombre de archivo único en todo el vault — pero el archivo físico sí debe vivir en esa
   subcarpeta.

12. **Callouts.** Resaltar:
   - `> [!important]` → definiciones clave y listas cerradas (lo que cae en el final).
   - `> [!question]` → preguntas que plantea la cátedra en el texto (sin el modificador `-` en la
     extracción: todavía no tiene respuesta. El flujo de repaso, a pedido, le agrega `-` y la
     respuesta — ver CLAUDE.md → "Flujo de repaso").
   - `> [!info]-` → glosarios de siglas (colapsable).
   - `> [!tip]` → analogías / mnemotecnia.
   - `> [!note]` → principios o aclaraciones conceptuales.

13. **Tablas** para todo lo que sea comparación o estructura (capas vs unidades de datos,
   protocolos por capa de transporte, etc.).

## Reglas de token
- El PDF se procesa una vez; el resto del trabajo es sobre los `.md` generados.
- No cargar varios PDFs en la misma sesión.

## Al terminar
- Guardar la carpeta completa (notas + `index.md`) en `content/Teoria/`.
- Agregar el wikilink de la **carpeta** (no de cada nota) al índice manual `content/Teoria/index.md`
  — una línea de lista `- [[<NN - Titulo>/|Título lindo]]` (con la barra final, sintaxis de link
  a carpeta). NO se toca el `content/index.md` (home): la home es un árbol que solo linkea a
  `Teoria/`, `Practica/`, `Modelos/`, no a unidades individuales.
- Agregar los wikilinks que quedaron sin resolver a `content/pendientes.md` (crearlo si no existe),
  sin duplicar entradas que ya estén listadas ahí.
- No hay paso de copia a otra carpeta: `content/` es a la vez el vault y lo que se publica.
  Para que el cambio salga al sitio, hacer `git push` (ver CLAUDE.md → "Cómo se publica").
