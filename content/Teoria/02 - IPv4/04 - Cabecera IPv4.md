---
title: Cabecera IPv4
fuente:
  - "[RFC 791](https://www.rfc-es.org/rfc/rfc0791-es.txt)"
  - "[RFC 4963](https://www.rfc-editor.org/info/rfc4963/)"
---
El protocolo entre entidades IP se describe mejor mediante el formato del **datagrama IP**. El *header* o encabezado de un datagrama (la PDU de IP) tiene **20 bytes** u octetos:

![[cabecera_ip.png]]

## Campos de un Datagrama
### Versión

La **versión** (4 bits) indica el número de versionado del protocolo, permitiendo interpretar los campos subsiguientes. Por ejemplo para IPv4 el valor es 4.

### Longitud de Cabecera o IHL

La **longitud de la cabecera Internet** o **IHL** **(*Internet Header Length*)** (4 bits) es la longitud de la cabecera expresada en palabras de 32 bits, y por tanto apunta al comienzo de los datos. El valor mínimo correcto es 5, correspondiente a una longitud mínima de 20 octetos (20 bytes = 160 bits = 5 × 32 bits).

>[!question]- ¿Por qué se dice que el IHL apunta al comienzo de los datos?
>Como la cabecera IP tiene longitud variable (por el campo Opciones, que es opcional y de tamaño variable), el receptor **no puede asumir que los datos empiezan siempre en el mismo byte**. IHL funciona como un offset: multiplicando IHL × 4 (para pasar de palabras de 32 bits a bytes) se obtiene exactamente cuántos bytes ocupa la cabecera, y por lo tanto en qué byte exacto arrancan los datos (el *payload*). Sin este campo, sería imposible separar cabecera de datos cuando hay Opciones presentes.

> [!question]- ¿Cuál es el máximo de tamaño de cabecera que puedo tener?
> El máximo es **60 bytes (60 octetos)**, puesto que IHL son 4 bits el valor más grande que se puede representar es $2^4 - 1 = 15$ (en binario 1111). Como cada unidad de IHL representa una **palabra de 32 bits** (4 bytes), el cálculo es: 15×32 bits=480 bits=60 bytes
> 
> Estos 60 bytes se reparten entre los **20 primeros obligatorios/fijos**, correspondientes desde la versión hasta la dirección de destino; y los otros **40 en los variables** entre opciones y relleno.

### Tipo de Servicio o TOS

El **tipo de servicio** o **TOS (*Type Of Service*)** (8 bits) especifica parámetros de fiabilidad, prioridad, retardo y rendimiento. Este campo **no se utiliza** globalmente en Internet (solo en entornos privados/locales). Los primeros 6 bits se denominan campo de **servicios diferenciados (DS)**, mientras que los 2 bits restantes están reservados para **notificación explícita de congestión (ECN)**.

### Longitud Total

La **longitud total** (16 bits) es la total del datagrama, incluyendo la cabecera y los datos, en **octetos** (a diferencia de otro campo que mide en longitudes de 32 bits). Restando este campo menos la longitud de la cabecera se obtiene la **cantidad de bytes de datos**, que es variable.

> [!question]- ¿Cuál es la longitud máxima que puede tener un datagrama?
> Dado que la longitud total es un campo de 16 bits que representa octetos: la longitud total máxima es $2^{16}=65535$ octetos.

### Identificador o ID

El **identificador** o **ID** (16 bits) es un número de secuencia que, junto a la dirección origen, destino y el protocolo usuario, identifica de forma única un datagrama durante el tiempo que permanece en la red. Es necesario para reensamblar fragmentos e informar errores.

> [!question]- ¿Cuántos IDs distintos puedo tener? 
> El campo ID tiene 16 bits entonces $2^{16} = 65.536$ valores distintos (de 0 a 65.535).

> [!question]- Si envío 4G de datos con datagramas de 1500 bytes, ¿existiría algún problema? 
> Primero, cuántos datagramas hacen falta (tomando $4G=2^{32}$ bytes): 
> 
> $$
> 4 G = 4.294.967.296 \text{ bytes}
> $$
> 
> $$
> \dfrac{4.294.967.296}{1500} \approx 2.863.312 \text{ datagramas}
> $$
> 
> Comparado con los IDs disponibles:
> 
> $$
> \dfrac{2.863.312}{65.536} \approx 43,7
> $$
> 
> **Sí hay un problema**: el espacio de IDs es muchísimo más chico que la cantidad de datagramas a enviar, así que el contador de ID **se agota y vuelve a repetir valores casi 44 veces** durante toda la transferencia. Repetir un ID no es grave, pero el problema aparece si un datagrama se **fragmenta**: la [[05 - Fragmentacion#Reensamblado|reconstrucción]] en el destino agrupa fragmentos usando la tupla que contiene el ID. Si ese valor  se reutiliza mientras todavía hay fragmentos "viejos" dando vueltas por la red sin haberse reensamblado o descartado, el receptor puede **mezclar fragmentos de dos datagramas distintos** en uno solo.

> [!question]- ¿Qué pasa si se envían los 4G en 30 segundos? 
> 
> $$
> \text{Datagramas/segundo}=\dfrac{2.863.312}{30}\approx95.444 \text{ datagramas/s}
> $$
> 
> $$
> \text{Tiempo para agotar los IDs }=\dfrac{65.536}{95.444}\approx0,687 \text{ segundos}
> $$
> 
> El contador de ID **da toda la vuelta en menos de 0,7 s**. Si algún fragmento de un datagrama anterior sigue "vivo" en la red (retrasado, reordenado, esperando reensamblarse) más de ese lapso puede colisionar con un datagrama nuevo que reutilizó el mismo ID.

> [!question]- ¿Qué pasa si se envían los 4G en 2 minutos?
> 
> $$
> \text{Datagramas/segundo}=\dfrac{2.863.312}{120}\approx23.861 \text{ datagramas/s}
> $$
> 
> $$
> \text{Tiempo para agotar los IDs }=\dfrac{65.536}{23.861}\approx2,75 \text{ segundos}
> $$
> 
> Sigue siendo rápido (menos de 3 segundos por vuelta completa), pero **4 veces más lento** que el caso anterior. El riesgo de colisión baja porque hay más margen para que los fragmentos viejos se reensamblen o se descarten por *timeout* antes de que su ID se repita.

> [!info]- RFC 4963
> El problema no es "quedarse sin IDs" (eso siempre va a pasar en transferencias grandes, 65.536 es poco). El problema es la **velocidad** a la que se repiten: cuanto más alta la tasa de datagramas por segundo, más rápido se agota el espacio de 16 bits, y más probable es que un ID se reutilice mientras fragmentos de un datagrama anterior con el mismo ID todavía no terminaron de reensamblarse. Es un problema real a velocidades altas (enlaces Gigabit o más), y es una de las razones por las que en IPv6 el campo *Identification* de fragmentación se amplió a **32 bits** para que el ciclo de repetición tarde muchísimo más en darse.
### *Flags* o Identificadores

De los **indicadores** (3 bits) solo dos de los tres bits están definidos actualmente.
- El primer bit está **reservado** y vale siempre cero.
- El segundo bit corresponde a **DF (*Don't Fragment*)**, es decir, no fragmentar:
	- Si vale 0 puede fragmentarse
	- Si vale 1 no puede fragmentarse
- El tercer bit corresponde a **MF (*More Fragments*)**, es decir, mas fragmentos:
	- Si vale 0 es el último fragmento
	- Si vale 1 existen mas fragmentos

El bit MF se usa para la fragmentación y el reensamblado, mientras que, el bit DF la prohíbe. Si el datagrama excede el tamaño máximo de una red en la ruta y DF es 1, se **descarta**. Cuando se prohíbe la fragmentación es aconsejable usar encaminamiento desde el origen para evitar redes con MTU pequeños.

### Desplazamiento u Offset

El **desplazamiento del fragmento** (13 bits) indica el lugar donde se sitúa el fragmento dentro del datagrama original, medido en unidades de **64 bits**. Todos los fragmentos, salvo el último, contienen un campo de datos múltiplo de 64 bits.

> [!example]- Ejemplo de fragmentación por MTU
> Si el MTU de Ethernet es 1500 bytes, y se descuenta el header IP (20 bytes), quedan 1480 bytes para transportar. Para enviar 4252 bytes (no múltiplo de 64) se generan 3 fragmentos: dos de 1480 bytes (2960 bytes) y un último fragmento con los octetos restantes. **Todos los ID del datagrama son iguales**, ya que es el mismo datagrama fragmentado que luego debe reensamblarse.

### Tiempo de Vida o TTL

El **tiempo de vida** o **TTL (*Time To Live*)** (8 bits) especifica cuántos segundos se le permite a un datagrama permanecer en la red. Con 8 bits, el máximo es **255**. Cada dispositivo de encaminamiento (*router*) que procesa el datagrama debe **decrementar este campo al menos en una unidad**, en la práctica funciona como un contador de saltos (en IPv6 se llama ***Hop Limit***), no de tiempo real.

> [!info]- TTL en la práctica
> Un valor inicial recomendado es **64**. El remitente lo establece y cada *router* en la ruta lo reduce. Si llega a cero antes de alcanzar el destino, el datagrama se descarta y se envía un mensaje de error ICMP (RFC792, "Tiempo excedido") al remitente. El propósito es evitar que un datagrama no entregable circule indefinidamente por la red.
#### Demostración de TTL

> **Nota:** La cátedra hace la demostración de que TTL cuenta saltos y no tiempo en Linux, como no lo tengo instalado ni a mano lo hago desde Windows, cambian los comandos.

Obteniendo los valores default a un *ping* y *tracerout* (*tracert* en en Windows) tenemos que:

![[ping_bien.png]]

![[traceroute_bien.png]]

De lo anterior podemos ver que el *tracert* muestra que la **ida** (→ 1.1.1.1) tarda **12 saltos**. Pero el ping te devuelve TTL=56 en la respuesta, este es el que puso **1.1.1.1** al generar su respuesta, ya decrementado por cada *router* de la **vuelta**. Como los sistemas tipo Unix/Linux (*Cloudflare* corre sobre eso) suelen arrancar con TTL por defecto = 64, la cuenta es: 64−56=8 saltos de vuelta.

Es decir, el camino que toma el paquete para llegar no es el mismo que toma la respuesta para volver. Esto es totalmente normal puesto que cada *router* decide el "mejor camino" de forma independiente, y no hay garantía de simetría.

En el *tracert* entre los saltos 3 y 6 está el mensaje de "Tiempo de espera agotado ..." que significa que ese *router* específico **no contesta** el ICMP Tiempo Excedido (muchos ISPs configuran esto a propósito, por seguridad o para no gastar recursos respondiendo tráfico de diagnóstico)

Si ahora limitamos el ping a un TTL menor que 11 este no funcionará:

![[ping_11saltos.png]]

En cambio si usamos un TTL de 12 o mayor, el ping si funciona:

![[ping_12saltos.png]]

En cuanto al *traceroute* si limitamos la cantidad de saltos solo afectamos hasta donde llega, pero no su respuesta. Lo anterior refiriéndome a que no expira el TTL, pero tampoco alcanza el destino 1.1.1.1 (dirección final a la derecha). Por ejemplo para un máximo de dos y ocho saltos tenemos:

![[traceroute_2saltos.png]]

![[traceroute_8saltos.png]]

> [!question]- ¿Por qué modificar el TTL a un valor bajo no impide que traceroute llegue al destino, pero sí impide que ping llegue?
>
> **Respuesta:** ambos usan el mismo mecanismo de fondo (ICMP Tiempo Excedido al agotarse el TTL), pero lo aprovechan de forma distinta.
>
> ***Traceroute*** no manda un único paquete con un TTL fijo: manda una secuencia con TTL creciente (1, 2, 3...) hasta llegar al destino o agotar el máximo de saltos configurado. Cada "muerte" de un paquete en un salto intermedio es exactamente el dato que traceroute busca. El programa sigue subiendo el TTL automáticamente hasta obtener una respuesta real del destino. Por eso, fijar manualmente un límite sí lo corta, pero es un techo impuesto a propósito, el mecanismo de "TTL bajo" en sí mismo no le impide llegar, es su método de trabajo.
>
> **Ping**, en cambio, manda paquetes con un TTL fijo elegido de antemano, sin ninguna lógica de reintento con un valor mayor. Si ese TTL es menor a la cantidad real de saltos hasta el destino, el paquete muere en un router intermedio y ping nunca llega — solo reporta el Tiempo Excedido de ese salto y ahí termina.
>
> En resumen: para *traceroute*, que el TTL se agote rápido es el objetivo de cada sonda individual; para ping, es simplemente un impedimento sin forma de recuperarse.

> [!tip] Latencia de red
> La latencia es el retraso en la comunicación de la red: el tiempo que tardan los datos en transferirse a través de ella.

### Protocolo

El **protocolo** (8 bits) identifica el protocolo de la capa de red inmediatamente superior que va a recibir el campo de datos **en el destino** (por ejemplo, TCP, UDP o ICMP).

### CRC de Cabecera

La **suma de comprobación de la cabecera** (16 bits) es el código de detección de errores aplicado **solo a la cabecera**. Como algunos campos cambian en el camino (ej. TTL), este valor se recalcula en cada router. Es el complemento a uno de la suma de todas las palabras de 16 bits de la cabecera; para calcularlo, el campo se inicializa a cero y luego se reemplaza por el valor obtenido.

Proporciona una verificación de que la información utilizada al procesar el datagrama ha sido transmitida correctamente. Los datos pueden contener errores. Si la suma de control de cabecera falla, el datagrama es **descartado** inmediatamente por la entidad que detecta el error.

### Direcciones de Origen y Destino

Tanto la **dirección de origen** como la **dirección destino** (32 bits c/u) describen la dirección de capa 3 (IP) del host de destino. Están codificadas para permitir una asignación variable de bits que especifique la red y el sistema final conectado a ella (Tratado luego en [[06 - Direcciones IPv4|Direcciones IP]] y [[08 - Subredes|Subredes]]).

### Opciones y Relleno

Las **opciones** (bits variables) contienen las opciones solicitadas por el usuario que envía los datos y rara vez se utiliza. Son opcionales en cada datagrama, pero obligatorias en las implementaciones. Es decir, la presencia o ausencia de una opción es elección del remitente, pero cada módulo debe ser capaz de analizar cualquier opción. Puede haber varias opciones presentes en el campo opción (Están todas definidas en el RFC791 adjunto, abarca las páginas 15 a 23). 

Mientras que, el **relleno** (variable también) asegura que la cabecera tenga una longitud múltiplo de 32 bits y solo se usa si existen campos opcionales. Dado que las **opciones** pueden no ocupar exactamente un espacio múltiplo de 32 bits, la cabecera debe ser completada con octetos de ceros. El primero de estos será interpretado como la opción fin-de-opciones.

### Datos

Por último, los **datos** (cantidad variable) que deben tener una longitud múltiplo de 8 bits.

---
**Volver a:** [[03 - Introduccion a IPv4|Introducción al Protocolo IP]]

**Continuar a:** [[05 - Fragmentacion|Fragmentación y reensamblado]]
