---
title: Cabecera IP
fuente:
  - https://www.rfc-es.org/rfc/rfc0791-es.txt
---
El protocolo entre entidades IP se describe mejor mediante el formato del **datagrama IP**. El header o encabezado de un datagrama (la PDU de IP) tiene **20 bytes** u octetos:

![[cabecera_ip.png]]

## Descripción de los campos de un Datagrama
### Versión

La **versión** (4 bits) indica el número de versionado del protocolo, permitiendo interpretar los campos subsiguientes. Por ejemplo para IPv4 el valor es 4.

### Longitud de Cabecera o IHL

La **longitud de la cabecera Internet** o **IHL** **(*Internet Header Length*)** (4 bits) es la longitud de la cabecera expresada en palabras de 32 bits, y por tanto apunta al comienzo de los datos. El valor mínimo correcto es 5, correspondiente a una longitud mínima de 20 octetos (20 bytes = 160 bits = 5 × 32 bits).

>[!question]- ¿Por qué se dice que el IHL apunta al comienzo de los datos?
>Como la cabecera IP tiene longitud variable (por el campo Opciones, que es opcional y de tamaño variable), el receptor **no puede asumir que los datos empiezan siempre en el mismo byte**. IHL funciona como un offset: multiplicando IHL × 4 (para pasar de palabras de 32 bits a bytes) se obtiene exactamente cuántos bytes ocupa la cabecera, y por lo tanto en qué byte exacto arrancan los datos (el *payload*). Sin este campo, sería imposible separar cabecera de datos cuando hay Opciones presentes.

### Tipo de Servicio o TOS

El **tipo de servicio** o **TOS (*Type Of Service*)** (8 bits) especifica parámetros de fiabilidad, prioridad, retardo y rendimiento. Este campo **no se utiliza** globalmente en Internet (solo en entornos privados/locales). Los primeros 6 bits se denominan campo de **servicios diferenciados (DS)**, mientras que los 2 bits restantes están reservados para **notificación explícita de congestión (ECN)**.

### Longitud Total

La **longitud total** (16 bits) es la total del datagrama, incluyendo la cabecera y los datos, en **octetos** (a diferencia de otro campo que mide en longitudes de 32 bits). Restando este campo menos la longitud de la cabecera se obtiene la **cantidad de bytes de datos**, que es variable.

> [!question]- ¿Cuál es la longitud máxima que puede tener un datagrama?
> Dado que la longitud total es un campo de 16 bits que representa octetos: la longitud total máxima es $2^{16}=65535$ octetos.

### Identificador o ID

El **identificador** o **ID** (16 bits) es un número de secuencia que, junto a la dirección origen, destino y el protocolo usuario, identifica de forma única un datagrama durante el tiempo que permanece en la red. Es necesario para reensamblar fragmentos e informar errores.

> [!question]- Pregunta de la cátedra
> ¿Cuántos IDs distintos puedo tener? Suponiendo que envío 4G de datos con datagramas de 1500 bytes, ¿existiría algún problema? ¿Qué pasa si se envían los 4G en 30 segundos? ¿Qué pasa si se envían los 4G en 2 minutos? Ayuda dada por la cátedra: RFC4963.

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
> Si el [[MTU]] de Ethernet es 1500 bytes, y se descuenta el header IP (20 bytes), quedan 1480 bytes para transportar. Para enviar 4252 bytes (no múltiplo de 64) se generan 3 fragmentos: dos de 1480 bytes (2960 bytes) y un último fragmento con los octetos restantes. **Todos los ID del datagrama son iguales**, ya que es el mismo datagrama fragmentado que luego debe reensamblarse.

### Tiempo de Vida o TTL

El **tiempo de vida** o **TTL (*Time To Live*)** (8 bits) especifica cuántos segundos se le permite a un datagrama permanecer en la red. Con 8 bits, el máximo es **255**. Cada dispositivo de encaminamiento (*router*) que procesa el datagrama debe **decrementar este campo al menos en una unidad**, en la práctica funciona como un contador de saltos (en IPv6 se llama ***Hop Limit***), no de tiempo real.

> [!important] TTL en la práctica
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

## CRC de Cabecera

**Suma de comprobación de la cabecera (16 bits):** código de detección de errores aplicado solo a la cabecera. Como algunos campos cambian en el camino (ej. TTL), este valor se **recalcula en cada router**. Es el complemento a uno de la suma de todas las palabras de 16 bits de la cabecera; para calcularlo, el campo se inicializa a cero y luego se reemplaza por el valor obtenido.

## Dirección de Origen

**Dirección de origen (32 bits):** codificada para permitir una asignación variable de bits que especifique la red y el sistema final conectado a ella.

## Dirección de Destino

**Dirección destino (32 bits):** igual que el campo anterior, describe la dirección de capa 3 (IP) del host de destino.

![[datagrama-ip-header-direcciones-resaltadas.png]]

## Opciones

**Opciones (variable):** contiene las opciones solicitadas por el usuario que envía los datos. Rara vez se utiliza.

## Relleno

**Relleno (variable):** asegura que la cabecera tenga una longitud múltiplo de 32 bits. Solo se usa si existen campos opcionales.

## Datos

**Datos (variable):** debe tener una longitud múltiplo de 8 bits. La longitud máxima de un datagrama (datos + cabecera) es de **65.535 octetos**.

## Fragmentación y reensamblado

En IPv4, la fragmentación y el reensamblado permiten dividir un paquete IP grande en fragmentos más pequeños cuando debe atravesar redes con distinto [[MTU]] (Maximum Transmission Unit).

### Motivo de la fragmentación

Cada enlace físico tiene un tamaño máximo de paquete que puede transportar:

| Enlace | MTU típica |
| --- | --- |
| Ethernet | 1500 bytes |
| PPPoE | 1492 bytes |
| Wi-Fi | 2304 bytes |

Si un paquete IP es más grande que el MTU del siguiente enlace, debe fragmentarse.

### Dónde ocurre

En algún punto del camino (en capa 3), donde el router determina que el MTU de la interfaz de salida es menor que el de la interfaz de entrada. Para lograrlo se **modifican** los campos Flags, Offset y FCS del datagrama original.

### Campos del encabezado implicados

- **Identification (16 bits):** identifica a qué datagrama original pertenece el fragmento — todos los fragmentos del mismo paquete tienen el mismo valor.
- **Flags (3 bits):** bit 0 reservado (0); bit 1 **DF** (Don't Fragment); bit 2 **MF** (More Fragments: 1 si hay más fragmentos después, 0 en el último).
- **Fragment Offset (13 bits):** posición del fragmento dentro del datagrama original, en unidades de 8 bytes.

### Ejemplo

Un datagrama IP con 4000 bytes de carga útil debe atravesar una red con MTU 1500. Cada fragmento debe ser ≤ 1500 bytes incluyendo el encabezado IP (20 bytes), es decir, máximo **1480 bytes de datos** por fragmento, en múltiplos de 8 (por el offset).

| Fragmento | Datos | Offset | bit MF |
| --- | --- | --- | --- |
| 1 | 1480 bytes | 0 | 1 |
| 2 | 1480 bytes | 185 (1480/8) | 1 |
| 3 | 1040 bytes | 370 (2960/8) | 0 |

Cada fragmento lleva su propio encabezado IP con el mismo Identification, y se debe **recalcular el CRC** de cada uno luego de fragmentar.

### Reensamblado

El **receptor final** (nunca los routers intermedios) hace el trabajo:
1. Recibe los fragmentos.
2. Los ordena según el offset.
3. Reconoce el último porque su MF = 0.
4. Reconstruye el datagrama original concatenando los datos.

Si falta algún fragmento o no llega a tiempo, se **descarta todo el datagrama**.

> [!warning] Problemas comunes de la fragmentación
> - **Retransmisión costosa:** si se pierde un fragmento, hay que reenviar todo el datagrama.
> - **Ataques de fragmentación:** pueden usarse para evadir cortafuegos o IDS.
> - **Mayor carga de procesamiento** en el receptor y en cada router.
>
> Por eso hoy se prefiere evitarla usando **Path MTU Discovery** (en IPv6), donde el emisor detecta el MTU más bajo del camino y ajusta el tamaño de los paquetes.

---
**Volver a:** [[03 - Introduccion al Protocolo IP|Introducción al Protocolo IP]]

**Continuar a:** [[05 - Direcciones IP|Direcciones IP]]
