---
title: Cabecera IP
---
El protocolo entre entidades IP se describe mejor mediante el formato del **datagrama IP**. El header o encabezado de un datagrama (la PDU de IP) tiene **20 bytes** u octetos:

![[datagrama-ip-header-figura-18-6.png]]

## Versión

**Versión (4 bits):** indica el número de versión del protocolo, permitiendo interpretar los campos subsiguientes. El valor es **4**, acorde a IPv4.

## Logitud de Cabecera

**Longitud de la cabecera Internet — IHL, Internet Header Length (4 bits):** longitud de la cabecera expresada en palabras de 32 bits. El valor mínimo es **5**, correspondiente a una longitud mínima de 20 octetos.

## Tipo de Servicio

**Tipo de servicio (8 bits):** especifica parámetros de fiabilidad, prioridad, retardo y rendimiento. Este campo **no se utiliza** globalmente en Internet (solo en entornos privados/locales). Los primeros 6 bits se denominan campo de **servicios diferenciados (DS)**; los 2 bits restantes están reservados para **notificación explícita de congestión (ECN)**.

## Longitud Total

**Longitud total (16 bits):** longitud total del datagrama, en **octetos** (a diferencia de otro campo que mide en longitudes de 32 bits). Restando este campo menos la longitud de la cabecera se obtiene la cantidad de bytes de datos, que es variable.

## Identificador (ID)

**Identificador (16 bits):** número de secuencia que, junto a la dirección origen, destino y el protocolo usuario, identifica de forma única un datagrama durante el tiempo que permanece en la red. Es necesario para reensamblar fragmentos e informar errores.

> [!question] Pregunta de la cátedra
> ¿Cuántos IDs distintos puedo tener? Suponiendo que envío 4G de datos con datagramas de 1500 bytes, ¿existiría algún problema? ¿Qué pasa si se envían los 4G en 30 segundos? ¿Qué pasa si se envían los 4G en 2 minutos?
> Ayuda dada por la cátedra: RFC4963.

## Flags o Identificadores

**Indicadores (3 bits):** solo dos de los tres bits están definidos actualmente.
- El primer bit está **reservado** y vale siempre cero.
- El bit **"más datos" (MF)** se usa para la fragmentación y el reensamblado.
- El bit **"no fragmentación" (DF)** prohíbe la fragmentación cuando vale 1. Si el datagrama excede el tamaño máximo de una red en la ruta, se **descarta**. Cuando este bit vale 1, es aconsejable usar encaminamiento desde el origen para evitar redes con MTU pequeños.

## Desplazamiento u Offset

**Desplazamiento del fragmento (13 bits):** indica el lugar donde se sitúa el fragmento dentro del datagrama original, medido en unidades de **64 bits**. Todos los fragmentos, salvo el último, contienen un campo de datos múltiplo de 64 bits.

> [!example] Ejemplo de fragmentación por MTU
> Si el [[MTU]] de Ethernet es 1500 bytes, y se descuenta el header IP (20 bytes), quedan 1480 bytes para transportar. Para enviar 4252 bytes (no múltiplo de 64) se generan 3 fragmentos: dos de 1480 bytes (2960 bytes) y un último fragmento con los octetos restantes. **Todos los ID del datagrama son iguales**, ya que es el mismo datagrama fragmentado que luego debe reensamblarse.

## Tiempo de Vida

**Tiempo de vida — TTL (8 bits):** especifica cuántos segundos se le permite a un datagrama permanecer en la red. Con 8 bits, el máximo es **255**. Cada dispositivo de encaminamiento (router) que procesa el datagrama debe **decrementar este campo al menos en una unidad** — en la práctica funciona como un contador de saltos (en IPv6 se llama **Hop Limit**), no de tiempo real.

> [!important] TTL en la práctica
> Un valor inicial recomendado es **64**. El remitente lo establece y cada router en la ruta lo reduce. Si llega a cero antes de alcanzar el destino, el datagrama se descarta y se envía un mensaje de error ICMP (RFC792, "Tiempo excedido") al remitente. El propósito es evitar que un datagrama no entregable circule indefinidamente por la red.

### Demostración: modificar el TTL en Linux

En Linux se puede consultar y cambiar el TTL por defecto con `sysctl` sobre el parámetro `net.ipv4.ip_default_ttl` (archivo `/etc/sysctl.conf`):

![[ttl-default-ubuntu-64.png]]

El valor por defecto en Ubuntu es **64**. Al modificarlo a 2 y hacer ping a un DNS (1.1.1.1, que normalmente está a 6 saltos), el paquete no debería llegar y debería mostrar "Tiempo Excedido":

![[ttl-modificado-a-2-sysctl.png]]

![[demo-ttl-ping-traceroute-completa.png]]

> [!question] Pregunta de la cátedra
> Se deja para el alumno el análisis de por qué modificar el TTL a un valor bajo no impide que **traceroute** llegue al destino, pero sí impide que **ping** llegue.

> [!tip] Latencia de red
> La latencia es el retraso en la comunicación de la red: el tiempo que tardan los datos en transferirse a través de ella.

## Protocolo

**Protocolo (8 bits):** identifica el protocolo de la capa de red inmediatamente superior que va a recibir el campo de datos en el destino (por ejemplo, TCP, UDP o ICMP).

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
