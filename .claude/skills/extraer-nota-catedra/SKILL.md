---
name: extraer-nota-catedra
description: Convierte un PDF de la cátedra en una o varias notas markdown de Obsidian para el vault de estudio (agrupando por cohesión temática si el PDF tiene muchos títulos, no 1 título = 1 nota). Usar cuando se procese un PDF de /_Fuentes/, o cuando se diga "extraé este PDF", "armá la nota de este tema" o "pasá esto a nota". Frontmatter mínimo (solo title), nombres de archivo/carpeta sin tildes, índice interno de encabezados, wikilinks, callouts, extrae los diagramas reales embebidos del PDF a /_attachments/<nota>/ (placeholder solo si la extracción no es posible), y registra los wikilinks sin resolver en /pendientes.md.
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

3. **Cuántas notas salen del PDF: agrupar por cohesión temática, no 1 título = 1 nota.**
   Un PDF chico (pocos títulos cortos y relacionados, como la unidad 1) da **una sola nota**. Un
   PDF con muchos títulos (10, 20+) hay que partirlo, pero el corte no es título por título:
   - **Agrupar** en una misma nota los títulos cortos y temáticamente relacionados entre sí (poca
     profundidad, sin muchos subtítulos propios) — mismo criterio que ya usamos en la unidad 1.
   - **Nota propia** para un título cuando es sustancioso por sí solo: muchos subtítulos, o
     contenido suficiente como para ser una sesión de estudio propia (ej. la estructura completa
     de una cabecera de protocolo, con uno o dos subtítulos por campo).
   - Si un título "contenedor" no tiene contenido propio y el que le sigue es donde arranca el
     desarrollo real (ej. TOC: "12. Subredes" seguido de "13. Introducción"), no crear un
     encabezado redundante para ese segundo título dentro de la nota — sus propios subtítulos
     pasan a ser directamente los `##` de la nota (llamada, en este ejemplo, "Subredes").
   - Si el PDF cierra con un título tipo resumen/repaso que sintetiza contenido repartido en
     varias de las notas resultantes, evaluar si conviene como nota propia corta (a modo de
     mini-índice con wikilinks hacia esas notas) o como sección de cierre de la última nota — es
     criterio caso por caso, no una regla fija.
   - Antes de escribir nada, para un PDF con muchos títulos conviene proponer el agrupamiento
     (qué títulos entran en cada nota resultante) y confirmarlo, en vez de asumir y procesar
     directo.

4. **Nombre de archivo, sin tildes/eñes.** `<NN> - <Título sin tildes>.md` (NN con dos dígitos,
   ej. `02 - Capa de Red.md`; `04 - Encriptacion.md` en vez de "Encriptación"). La numeración
   `NN` sigue la secuencia general de `content/Teoria/`, no reinicia por PDF: si la última nota usada
   fue `01` y este PDF da 7 notas (ver punto 3), van de `02` a `08`.
   > Esto es una regla técnica, no de estilo: el sitio publicado con Quartz genera la URL de cada
   > nota a partir del nombre del archivo, y una tilde/eñe ahí produce texto corrupto en el visor
   > de grafo (bug conocido). El texto correcto en español vive en el `title` del frontmatter
   > (punto 6) y en los encabezados de la nota, donde no hay ninguna restricción.

5. **Esqueleto desde la Tabla de Contenidos**, según cómo se agrupó en el punto 3:
   - Título que queda solo en su propia nota → es el `# Título` de la nota, sus subtítulos
     bajan a `##`.
   - Títulos agrupados junto con otros en una misma nota → cada título es un `##`, sus
     subtítulos bajan a `###`.

6. **Frontmatter: `title` + `fuente`.** Nada de `unidad`, `materia`, `tags`, `estado`.
   ```yaml
   ---
   title: <Título de la unidad, con tildes, sin el prefijo "NN - ">
   fuente: "[[<nombre del PDF>.pdf]]"
   ---
   ```
   - `title`: si falta, Quartz usa el nombre del archivo como respaldo en todos lados (grafo,
     pestaña, breadcrumbs) — y ese nombre lleva el prefijo `NN -` y no tiene tildes, así que queda feo.
   - `fuente`: wikilink al PDF de `content/_Fuentes/` del que salió la nota. Se ve clickeable tanto
     en Obsidian como en el sitio publicado (link real y descargable al archivo). Si la fuente es
     un capítulo de libro u otra referencia sin archivo, usar texto plano en vez de wikilink
     (ej. `"Autor - Libro, cap. N"`). Si la nota sale de varias fuentes, usar una lista.

7. **Índice interno al comienzo de la nota.** Justo después del `# Título` y antes del primer
   `##`, una lista con link a cada encabezado `##` de la nota (en orden), con sintaxis de
   Obsidian `[[#Encabezado]]`:
   ```markdown
   # Título

   - [[#1. Primer encabezado]]
   - [[#2. Segundo encabezado]]
   - [[#Preguntas de repaso (final teórico)]]

   ## 1. Primer encabezado
   ...
   ```
   Es un índice de navegación interna, distinto del panel de TOC automático que Quartz ya
   muestra a la derecha en el sitio publicado.

8. **Wikilinks.** Cada concepto con peso propio (protocolos, modelos, términos técnicos eje)
   se marca `[[Concepto]]`. Usar alias cuando convenga: `[[Modelo TCP-IP|TCP/IP]]`. Los que
   todavía no tienen nota propia se agregan a `pendientes.md` (ver "Al terminar").

9. **Imágenes — extracción real es obligatoria, el placeholder es el último recurso.**
   a. Antes de escribir ningún placeholder, intentar extraer las imágenes embebidas en el PDF:
      - Invocar la skill `pdf`, o directamente `pdfimages -list <pdf>` para listar los objetos
        de imagen por página, y `pdfimages -png <pdf> <prefijo>` para extraerlos.
      - Abrir (Read) cada imagen extraída para identificar cuál figura del texto es, descartar
        íconos decorativos/logos/animaciones (ej. el "signo de pregunta" de motivación) y
        detectar duplicados exactos (mismo tamaño en bytes/dimensiones) cuando el PDF reutiliza
        la misma figura en varias páginas — copiar el duplicado una sola vez, aunque se enlace
        desde dos secciones distintas de la nota.
      - Copiar cada diagrama útil a `content/_attachments/<nombre de la nota, sin extensión>/` con
        un nombre descriptivo en kebab-case (ver punto 10).
   b. Solo si la extracción falla (imagen no embebida, PDF escaneado sin capa de imagen
      recuperable, etc.) o si la figura no vive dentro del PDF (ej. una captura de pantalla de
      un lab con la VM, que se pega después), insertar el placeholder:
      ```
      ![[nombre-descriptivo.png]]
      %% CAPTURAR: <descripción de la figura> (Figura X, pág. Y del PDF) %%
      ```
   c. Ignorar siempre imágenes decorativas (íconos, logos, signos de pregunta animados, etc.),
      se hayan extraído o no.

10. **Organización de `content/_attachments/`.** Cada nota tiene su propia subcarpeta dentro de
   `content/_attachments/`, con el mismo nombre que el archivo de la nota (sin extensión ni ruta).
   Ejemplo: `content/Teoria/01 - Introduccion a Redes II.md` guarda sus imágenes en
   `content/_attachments/01 - Introduccion a Redes II/`. Esto evita que `_attachments/` se vuelva una
   bolsa plana de archivos a medida que crece el vault. Los wikilinks de imagen
   (`![[nombre.png]]`) no necesitan la ruta completa — Obsidian resuelve por nombre de archivo
   único en todo el vault — pero el archivo físico sí debe vivir en la subcarpeta del tema.

11. **Callouts.** Resaltar:
   - `> [!important]` → definiciones clave y listas cerradas (lo que cae en el final).
   - `> [!question]` → preguntas que plantea la cátedra en el texto.
   - `> [!info]-` → glosarios de siglas (colapsable).
   - `> [!tip]` → analogías / mnemotecnia.
   - `> [!note]` → principios o aclaraciones conceptuales.

12. **Tablas** para todo lo que sea comparación o estructura (capas vs unidades de datos,
   protocolos por capa de transporte, etc.).

13. **Sección de cierre obligatoria (una sola):**
    ```
    ## Preguntas de repaso (final teórico)
    1. ... (preguntas de desarrollo derivadas del contenido)
    ```
    No agregar una sección de "conceptos a desarrollar" dentro de la nota — ver "Al terminar".

## Reglas de token
- El PDF se procesa una vez; el resto del trabajo es sobre el `.md` generado.
- No cargar varios PDFs en la misma sesión.

## Al terminar
- Guardar la nota en `content/Teoria/`.
- Agregar el wikilink de la nota nueva al **índice manual de su carpeta**, `content/Teoria/index.md`
  (una línea de lista `- [[NN - Titulo|Título lindo]]`). NO se toca el `content/index.md` (home):
  la home es un árbol que solo linkea a las carpetas, no a las notas individuales.
- Agregar los wikilinks que quedaron sin resolver a `content/pendientes.md` (crearlo si no existe),
  sin duplicar entradas que ya estén listadas ahí.
- No hay paso de copia a otra carpeta: `content/` es a la vez el vault y lo que se publica.
  Para que el cambio salga al sitio, hacer `git push` (ver CLAUDE.md → "Cómo se publica").
