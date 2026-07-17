---
title: Introducción a IPv4
fuente:
  - "[RFC 791](https://www.rfc-es.org/rfc/rfc0791-es.txt)"
---
> [!important] Motivación de IP
> El Protocolo Internet está diseñado para su uso en sistemas interconectados de redes de comunicación de ordenadores por  intercambio de paquetes. Proporciona los medios necesarios para la transmisión de bloques de datos llamados **datagramas** desde el origen al destino, donde origen y destino son hosts identificados por direcciones de longitud fija. Tambien se encarga, si es necesario, de la fragmentación y el reensamblaje de grandes datagramas para su transmisión a través de redes de trama pequeña.

El **Protocolo Internet (IP)** es parte del conjunto de protocolos TCP/IP y es el protocolo de interconexión de redes más utilizado. Se examina la versión 4 (IPv4), definida oficialmente en el **RFC 791** (1981). Aunque la intención es que IPv6 lo reemplace, IPv4 sigue siendo el estándar utilizado en las redes TCP/IP.

Como todo protocolo estándar, IP se especifica en dos partes:
1. La **interfaz con la capa superior** especificando los servicios que proporciona.
2. El **formato real del protocolo** y los mecanismos asociados.

> [!info] RFC 791
> Documento de DARPA con las especificaciones del protocolo IP (1981). Se desarrollaron cuatro versiones diferentes (TCP v1, v2, y una tercera dividida en TCP v3 e IP v3 en 1978) hasta estabilizarse en **TCP/IP v4**, el protocolo estándar que todavía se emplea en Internet.

> [!note] Unidad de información
> La unidad de información de IP es el **Datagrama**.
## Servicios IP

Los módulos internet usan las direcciones que se encuentran en su cabecera para transmitir los datagramas hacia sus destinos. La selección de un camino para la transmisión se llama encaminamiento o **direccionamiento**. Además usan campos en la cabecera para **fragmentar** y reensamblar los datagramas cuando sea necesario para su transmisión a través de redes de "trama pequeña".

>[!important] Funciones de IP
>IP implementa dos funciones básicas: **Direccionamiento** y **Fragmentación**

El modelo de operación es que un módulo internet reside en cada *host* involucrado en la comunicación y en cada pasarela que interconecta redes. Estos comparten reglas comunes para interpretar los campos de dirección y para fragmentar y ensamblar datagramas. Además, estos módulos (especialmente en las pasarelas) tienen procedimientos para tomar decisiones de encaminamiento y otras funciones.

El protocolo internet trata cada datagrama internet como una **entidad independiente no relacionada con ningún otro datagrama** internet. No existen conexiones o circuitos lógicos (virtuales o de cualquier otro tipo).

El protocolo internet utiliza cuatro mecanismos clave para prestar su servicio: Tipo de Servicio, Tiempo de Vida, Opciones, y Suma de Control de Cabecera. **No proporciona ningún mecanismo de comunicación fiable**. No existen acuses de recibo ni entre extremos ni entre saltos. No hay control de errores para los datos, sólo una suma de control de cabecera. No hay retransmisiones. No existe control de flujo.

>[!important] Servicios de IP
>IP brinda dos servicios: **Sevicio sin conexión** y **No confiable** (hace el mejor esfuerzo).

### Responsabilidades de IP

- Usar un esquema de direcciones para rutear los datagramas hasta el destino.
- Usar un protocolo complementario para reportar problemas ([[11 - Diagnostico de Red|ICMP]]).
- Fragmentar y reensamblar paquetes para adaptarlos al enlace.
- Rutear paquetes desde el origen al destino.

## ¿Cómo funciona?

La pila de protocolos TCP/IP es un software en ejecución (un proceso). El algoritmo general de decisión al recibir un datagrama es:

![[flujo_ip.png|600]]

## Procesamiento de un datagrama IP con *Loopback* y ARP

> **Nota:** El diagrama a continuación no tiene mucho contexto ni explicación en el aula virtual, adelanta el tema de [[07 - ARP|ARP]] e incluye cosas que no vemos en la materia, pero voy a tratar de darle una explicación. No tomar lo siguiente como verdad absoluta, mejor consultarle a los docentes.

Este diagrama muestra cómo interactúan la **capa de Red (IP)** y la **capa de Interfaz de Red** al procesar un datagrama, tanto de salida como de entrada, integrando las decisiones de entrega local (loopback) y resolución de direcciones (ARP).
![[procesamiento_ip.png]]

> [!note] A tener en cuenta
> - **Loopback:** interfaz virtual que permite que un *host* se comunique consigo mismo (ver [[09 - Localhost|Localhost]]).
> - **Driver:** el *software* que maneja la interfaz de red física (por ejemplo, *Ethernet*) y decide, entre otras cosas, cuándo resolver una dirección con [[07 - ARP|ARP]].

**Capa de Red (IP):** en la parte superior están los dos puntos de entrada/salida de la capa IP.
- Salida de datagrama IP: recibe un datagrama que viene de capas superiores o de una decisión de ruteo, listo para transmitirse. (Bloque superior izquierdo con flecha viniendo de abajo)
- Entrada de datagrama IP: entrega un datagrama recibido hacia el resto del procesamiento de IP y capas superiores. (Bloque superior derecho con flecha para arriba)

Todo lo que ocurre por debajo de estos dos puntos pertenece a la capa de **Interfaz de Red** (frontera entre capa 3 y capa 2/1): es la capa que decide, para cada datagrama, si corresponde entregarlo localmente, resolver una dirección física o transmitirlo por el medio.

>[!important]- Camino de salida
>Al llegar un datagrama desde **Salida de datagrama IP**, primero se evalúa si la dirección destino es *broadcast* o *multicast*. Si lo es, ocurren dos cosas en simultáneo: se entrega una copia a la Cola de entrada IP del ***Loopback Driver*** (porque el propio *host* también es destinatario de su propio *broadcast*/*multicast*) y, además, se transmite directamente por *Ethernet* sin pasar por ARP, porque la dirección física en estos casos no se resuelve dinámicamente sino que se calcula con una fórmula fija. 
>
>Si la dirección destino **no** es *broadcast*/*multicast*, se evalúa una segunda condición: si la IP destino es la propia IP de la interfaz (el *host* se está enviando el datagrama a sí mismo), también se entrega directo a la Cola de entrada IP del *loopback*, sin salir nunca a la red. 
>
>Solo si ninguna de las dos condiciones se cumple, es un destino *unicast* externo real, el datagrama pasa por **ARP**, que resuelve la dirección física (MAC) correspondiente a esa IP, y recién ahí se transmite por ***Ethernet***.

>[!important]- Camino de entrada
>Una trama que llega por el medio físico ***Ethernet*** (capa Física/Enlace) es recibida por el **Ethernet Driver**, que la pasa a Demultiplexado *Ethernet*. Este módulo mira el tipo de trama: 
>
> Si es una trama **ARP** (un *Request* o *Reply*), la deriva al mismo módulo **ARP** que usa la salida para resolver direcciones, es decir, ARP cumple un doble rol, tanto lo consulta la salida de IP como recibe tramas ARP entrantes de la red. 
>
> Si en cambio es una trama que transporta un datagrama IP, se envía a la **Cola de entrada de IP** (la cola del *Ethernet Driver*, distinta de la del *loopback*) y de ahí sube a **Entrada de datagrama IP**, en la capa de Red.
>

> [!important]- *Loopback* entre salida y entrada 
> La Cola de entrada IP del ***Loopback Driver*** no es un destino final, es una interfaz de red virtual (sin medio físico real) cuya salida también desemboca en **Entrada de datagrama IP**. Por eso ese punto de entrada de la capa IP recibe datagramas de **dos fuentes distintas**: los que realmente llegaron por la red (vía la cola del *Ethernet Driver*) y los que el propio *host* se generó y entregó a sí mismo (vía *loopback*), sin que la capa IP necesite distinguir entre ambos orígenes.

> Nota: este último inchequeable

---
**Volver a:** [[02 - Organizacion de Internet|Organización de Internet]]

**Continuar a:** [[04 - Cabecera IPv4|Cabecera IPv4]]
