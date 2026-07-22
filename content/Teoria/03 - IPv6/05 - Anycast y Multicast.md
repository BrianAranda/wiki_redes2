---
title: Anycast y Multicast
---
## *Anycast*

Una dirección *anycast* de IPv6 es una dirección que se asigna a **más de una interfaz** (que suelen pertenecer a nodos diferentes), con la propiedad de que un paquete enviado a una dirección *anycast* se enruta a la interfaz **más cercana** que tenga esa dirección, según la medida de distancia establecida por los protocolos de enrutamiento.

![[anycast.png|500]]

Las direcciones *anycast* se asignan a partir del espacio de direcciones *unicast*, utilizando cualquiera de sus formatos. Por lo tanto, las direcciones de *anycast* son sintácticamente indistinguibles de las direcciones de unidifusión. Cuando una dirección de unidifusión se asigna a más de una interfaz, convirtiéndola así en una dirección de *anycast*, los nodos a los que se asigna la dirección deben configurarse explícitamente para que sepan que se trata de una dirección de *anycast*.

La dirección *anycast* **del enrutador** de subred está predefinida y su formato es el siguiente:

```
|                      n bits                    |   128-n bits   |
+------------------------------------------------+----------------+
|                   subnet prefix                | 00000000000000 |
+------------------------------------------------+----------------+
```

El `subnet prefix` de una dirección *anycast* es el prefijo que identifica un enlace específico. Esta dirección es sintácticamente idéntica a una dirección *unicast* de una interfaz del enlace con el *interface* ID establecido en cero.

Los paquetes enviados a la dirección de *anycast* *Subnet-Router* se entregarán a un *router* de la subred. Todos los *routers* deben ser compatibles con las direcciones de *anycast* *Subnet-Router* de las subredes a las que tienen interfaces. Esta dirección está pensada para utilizarse en aplicaciones en las que un nodo necesita comunicarse con cualquiera de los *routers* del conjunto.

> [!important] Beneficios de las direcciones *anycast*
> - **Redundancia:** el servicio no depende de un único servidor, de modo que si un equipo falla, los demás asumen sus funciones y el servicio sigue disponible.
> - **Balanceo de carga:** los distintos servidores se reparten el trabajo de modo que no haya un equipo sobrecargado (con la consiguiente merma de rendimiento) y otro inactivo.
> - **Eficiencia:** simplifica la búsqueda del servidor más apropiado (suele ser el más cercano).

> [!info]- Uso típico: DNS
> Los servidores de [[DNS]] usan este método, para ubicar el servidor de DNS más cercano a donde lo solicitan. El emisor no tiene control sobre la interfaz de destino, así que el/los *routers* toman la decisión del destino.

## *Multicast*

Una dirección de multidifusión IPv6 es un identificador de un grupo de interfaces (normalmente en distintos nodos). Una interfaz puede pertenecer a cualquier número de grupos de *multicast*.

Los nodos que se configuran con una dirección *multicast* determinada forman lo que se llama un **grupo de multidifusión** y un nodo puede pertenecer a varios grupos distintos. Cuando un paquete es enviado a una *multicast*, todos los miembros del grupo procesan el paquete.

![[multicast.png|600]]

> [!warning] Importante
> Las direcciones de Multicast están **solo** en el campo de IP de **destino** de un datagrama.

Tienen el siguiente formato:

```
|   8    | 4  | 4  |                  112 bits                   |
+------ -+----+----+---------------------------------------------+
|11111111|flgs|scop|                  group ID                   |
+--------+----+----+---------------------------------------------+
```

El campo `flags` a su vez está subdividido en cuatro distintas *flags*:

```
+-+-+-+-+
|0|R|P|T|
+-+-+-+-+
```

Donde:
- La *flag* MSB está reservada y debe inicializarse en 0.
- `T = 0` indica una dirección es permanente, es asignada IANA.
- `T = 1` indica una dirección es transitoria o dinámica.
- La definición y el uso de la *flag* `P` se pueden consultar en [RFC 3306](https://datatracker.ietf.org/doc/html/rfc3306).
- La definición y el uso de la *flag* `R` se pueden consultar en [RFC3956](https://datatracker.ietf.org/doc/html/rfc3956).

> [!important] *Multicast transient*
> Una dirección _multicast transient_ (`T=1`) es una dirección **asignada dinámicamente**, no permanente ni reservada por la IANA, la crea un protocolo o una aplicación para un grupo de multidifusión de vida limitada, y deja de tener validez cuando ese grupo o esa sesión termina. 

Por otro lado el campo de `scop` es un valor del ámbito de aplicación y se utiliza para limitar el alcance del grupo de multidifusión. Los valores son los siguientes:

- `1`  *Interface Local scope*
- `2`  *Link Local scope*
- `4`  *Admin Local scope*
- `5`  *Site Local scope*
- `8`  *Organization Local scope*
- `E`  *Global scope*

De los valores faltantes `0`,`3` y `F` están reservados, los demás sin asignar.

### *Well Known Multicasts*

Hay algunas direcciones predefinidas de *multicast* y nunca deben ser asignadas a ningún grupo  para ningún otro valor de ámbito, con el indicador T igual a 0 (permanentes).

#### *Multicasts* reservadas

Las direcciones de multidifusión `FF0X::` (siendo `X` en este caso cualquier valor hexadecimal) están reservadas y nunca deberán asignarse a **ningún grupo** de multidifusión.

#### *Multicast* de todos los nodos 

Son direcciones de multidifusión que identifican el grupo de todos los nodos IPv6, dentro de dos ámbitos distintos: `FF01::1` (*Interface Local*) o `FF02::1` (*Link Local*). Los paquetes que se envían a estos grupos son recibidos y procesados por todas las interfaces IPv6 en el enlace o en la red. Esto tiene el mismo efecto que una dirección de *broadcast* en IPv4.

#### *Multicast* de todos los *routers* 

Son direcciones de multidifusión que identifican el grupo de todos los *routers* IPv6, dentro de tres ámbitos distintos: `FF01::2` (*Interface Local*), `FF02::2` (*Link Local*) o `FF05::2` (*Site Local* , obsoletas). Los paquetes que se envían a este grupo son recibidos y procesados por todos los *routers* IPv6 en el enlace o en la red.

####  *Multicast* de nodo solicitado

Son direcciones de multidifusión que se calculan en función de las direcciones de *unicast* y *anycast* de un nodo. Estas se forman tomando los 24 bits de orden inferior de una dirección y añadiendo dichos bits al prefijo `FF02:0:0:0:0:1:FF00::/104`, lo que da como resultado una dirección de multidifusión en el  rango de `FF02::1:FF00:0000` a `FF02::1:FFFF:FFFF`.

Son similares a las direcciones *multicast* de todos los nodos, esencialmente lo mismo que una dirección IPv4 de *broadcast*. Se utiliza para reducir el número de dispositivos que deben procesar el tráfico.

Por ejemplo, la dirección de multidifusión de nodo solicitado correspondiente a la dirección IPv6 `4037::01:800:200E:8C6C` es `FF02::1:FF0E:8C6C`, donde coinciden en los LSB `0E:8C6C`. Las direcciones IPv6 que solo difieren en los bits de orden superior, se asignarán a la misma dirección de nodo solicitado, reduciendo así el número de direcciones *multicast* a las que debe unirse.

Un nodo debe calcular y unirse a las direcciones de multidifusión de nodo solicitado asociadas a **todas las direcciones de *unicast* y *anycast*** que se hayan configurado para las interfaces del nodo (sea manualmente o de forma automática).

### *Multicast* Capa 2 y Capa 3

Las direcciones de *multicast* de capa 3 deben tener su equivalente en capa 2. Para ello se utilizan los 32 bits bajos de la dirección Ethernet y los 32 bits bajos de la dirección IPv6 de multidifusión.

> [!example] *Multicast* entre capas
> En el origen:
> - Capa 3 IPv6 utiliza la dirección: `FF02::D`
> - Capa 2 MAC utiliza la dirección: `33 33 00 00 00 0D`
> - Coincide el `:D` con el `00 00 00 0D`
> 
> En el destino:
> - Capa 3 utiliza el tráfico: `FF05::1:3`
> - Capa 2 utiliza la dirección:`33 33 00 01 00 03`
> - Coinciden el `:1:3` con el `00 01 00 03`

## IPv6 necesarias

#### En *hosts*

1. Dirección GUA.
2. Dirección ULA.
3. Dirección LLA para cada interfaz
4. Dirección de *Loopback*.
5. Dirección de *Multicast* de todos los nodos.
6. Dirección de *Multicast* de todos los *routers*.

#### En *routers*

1. Dirección GUA.
2. Dirección LLA para cada interfaz
3. Dirección de *Loopback*.
4. Dirección de *Multicast* de todos los nodos.
5. Dirección de *Multicast* de todos los *routers*.

A modo de resumen final tenemos:

![[resumen_direcciones.png|600]]

---
**Volver a:** [[04 - Unicast|Unicast]]

**Continuar a:** [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]
