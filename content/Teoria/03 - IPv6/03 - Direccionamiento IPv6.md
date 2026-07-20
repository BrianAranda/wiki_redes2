---
title: Direccionamiento IPv6
---
## IPv6 Addressing

Las direcciones IPv6 de cualquier tipo son asignadas a las **interfaces** (no a los nodos).

Una sola interfaz puede tener múltiples direcciones IPv6 (unicast, multicast, anycast, como ya se verá).

> [!note] Excepción
> Direcciones de unidifusión con un alcance mayor que el alcance del enlace no son necesarias para interfaces que no se utilizan como origen o destino de ningún paquete IPv6 hacia o desde el nodo. A veces esto es conveniente para interfaces punto a punto.

Cada interfaz pertenece a un solo nodo.

Hay en principio 3 tipos de direcciones:

### Unicast

Una IPv6 de Unicast identifica una única interfaz. Un paquete con dirección de Unicast es distribuido a UNA, la única interfaz con esa dirección.

### Multicast

Una IPv6 de Multicast identifica un conjunto de interfaces de red, típicamente de distintos nodos. Un paquete con dirección de Multicast es distribuido a TODAS las interfaces con esa dirección.

> [!note] Def. nodo
> Dispositivo que implementa capa 3 IP.

### Anycast

Una IPv6 de Anycast identifica un conjunto de interfaces de red, típicamente de distintos nodos. Un paquete con dirección de Anycast es distribuido a UNA de las interfaces con esa dirección, la que esté más cerca.

### Broadcast NO existe en IPv6

![[unicast-anycast-multicast-broadcast.png]]

## Representación de Direcciones

Hay tres formas de representar una dirección de IPv6.

### 1. Forma preferida

`x:x:x:x:x:x:x:x` donde `x` es un valor de cuatro dígitos hexadecimales (0,1,2,3...8,9,A,B,C,D,E,F). Cada dígito hexadecimal tiene 4 bits ⇒ `x` tiene 4 valores hexadecimales ⇒ 16 bits (4×4).

Ejemplos:
- `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`
- `1080:0:0:0:8:800:200C:417A`

> [!note] Nota
> Tenga en cuenta que no es necesario escribir los **ceros iniciales** (a la izquierda) en un campo individual, pero debe haber al menos un número en cada campo (excepto el caso descrito a continuación).

### 2. Forma comprimida

En algunas direcciones de IPv6 pueden existir varios campos seguidos de ceros; se pueden **reemplazar por un solo `::`** (una única vez en toda la dirección):

- `1080:0:0:0:8:800:200C:417A` se escribe `1080::8:800:200C:417A` (a unicast address)
- `FF01:0:0:0:0:0:0:101` se escribe `FF01::101` (a multicast address)
- `0:0:0:0:0:0:0:1` se escribe `::1` (the loopback address)
- `0:0:0:0:0:0:0:0` se escribe `::` (unspecified addresses)

### 3. Forma alternativa (entornos mixtos IPv4/IPv6)

En entornos mixtos de IPv4 e IPv6, se suele usar una notación del siguiente tipo:

`x:x:x:x:x:x:d.d.d.d`

Donde las `x` son los valores hexadecimales de las seis partes de 16 bits de orden superior de la dirección, y las `d` son los valores decimales de las cuatro piezas de 8 bits de orden inferior de la dirección (representación IPv4 estándar).

Ejemplo:
- `0:0:0:0:0:0:13.1.68.3`
- `0:0:0:0:0:FFFF:129.144.52.38`

que en formato comprimido sería:
- `::13.1.68.3`
- `::FFFF:129.144.52.38`

### Direcciones IPv6 en URLs

> [!note] Nota
> Ver que en IPv6 se usa `:` (dos puntos); esto en IPv4 se correspondería con un puerto de TCP, por eso en algunas ocasiones al momento de presentar una dirección IPv6 (como una dirección en un navegador, por ejemplo) se la pone **entre corchetes** para evitar esa confusión.
>
> En una dirección URL, las direcciones IPv6 se muestran entre corchetes. Ejemplo:
> `http://[2001:0db8:83a3:08d3::0380:7344]/`
>
> Los números de los puertos se escriben detrás de los corchetes de cierre separados por dos puntos. Ejemplo:
> `http://[2001:0db8:83a3:08d3::0380:7344]:8080/`
>
> En algunas ocasiones se podría ver el signo de porcentaje (`%`), que se sigue utilizando para identificar la codificación de caracteres hexadecimales en las URL. Dentro de la URL, el signo de porcentaje se sustituirá por su propio código hexadecimal `%25` ([RFC 6874](https://www.rfc-editor.org/rfc/rfc6874)). Esto es necesario si se desea forzar la conexión a través de una interfaz específica.

![[winbox-conexion-link-local.png]]

## Prefijos de Direcciones

Los prefijos de IPv6 son similares a los de IPv4.

Un prefijo se representa: `ipv6-address/prefix-length`, donde:

- **ipv6-address:** es la notación de IPv6.
- **prefix-length:** valores decimales de bits contiguos a la izquierda que componen el prefijo.

**Ejemplo:**
- `12AB:0000:0000:CD30:0000:0000:0000:0000/60`
- `12AB::CD30:0:0:0:0/60` (alternativa 1)
- `12AB:0:0:CD30::/60` (alternativa 2)

**Ejemplos NO válidos:**
- `12AB:0:0:CD3/60` → no puedo eliminar ceros finales
- `12AB::CD30/60` ⇒ `12AB:0000:0000:0000:0000:000:0000:CD30` → no puedo eliminar ceros finales
- `12AB::CD3/60` ⇒ `12AB:0000:0000:0000:0000:000:0000:0CD3` → no puedo eliminar ceros finales

## Identificación de Direcciones

En IPv6 aparece un concepto de direccionamiento que se conoce como **"ámbito"** (*scope*). Hay 3 ámbitos.

![[ambitos-enlace-sitio-global.png]]

- **Ámbito enlace:** direcciones únicas para ser usadas en UNA SOLA interfaz de red. Conocidas como Link Local (`FE80::/10`). Con estas direcciones se pueden asignar las direcciones globales, y sirven para la detección de vecinos; los protocolos de enrutamiento dinámico también utilizan estas direcciones para compartir las rutas.
- **Ámbito sitio:** similares a direcciones IPv4 privadas. Se conocen como Unique Local Address. Son `FC00::/7` a `FD00::/7`. Se obtienen con un proceso aleatorio que permite asegurar que son únicas. Aunque sean únicas no se pueden utilizar para comunicarse en Internet, los enrutadores de Internet no tienen rutas para llegar a ellas.
- **Ámbito Global:** estas direcciones son únicas globalmente, `2000::/3` a `3FFF::/3`. Globalmente las asigna la IANA.

Cualquier dirección de IPv6 se puede identificar **por los bits de mayor orden**:

| Address type | Binary prefix | IPv6 notation |
| --- | --- | --- |
| Unspecified | 00...0 (128 bits) | `::/128` |
| Loopback | 00...1 (128 bits) | `::1/128` |
| Multicast | 11111111 | `FF00::/8` |
| Link-Local unicast | 1111111010 | `FE80::/10` |
| Global Unicast | (everything else) | — |

> [!note] Notas
> 1. Las direcciones de **Anycast** son tomadas de las Unicast Global, por eso no figuran en la tabla.
> 2. La IANA dividió todo el rango de direcciones IPv6 en 8 partes. Para ello utilizó los 3 primeros bits, $2^3 = 8$. Por el momento usa 1/8 parte de las direcciones totales, con los tres primeros bits en `001`.
> 3. Direcciones posibles de Unicast al momento de escribir este capítulo:
>    - Con los tres primeros bits en `001`: de `0010 0000 0000 0000` a `0011 1111 1111 1111` ⇒ `2000` a `3FFF`.
>    - `2000` = `0010 0000 0000 0000` (primera IP Unicast Global).
>    - `3FFF` = `0011 1111 1111 1111` (última IP Unicast Global).

![[espacio-direcciones-ipv6-3bits.png]]

*Las porciones restantes del espacio de direcciones IPv6 están reservadas por el IETF para uso futuro.*

Hay dos tipos de direcciones que se pueden asignar a una organización de usuarios finales:

- Agregable por el proveedor (**PA**).
- Independiente del proveedor (**PI**).

### Agregable por el proveedor (PA)

El espacio de direcciones agregable por el proveedor (PA) es un bloque de direcciones asignadas por un RIR a un ISP. Esto permite al ISP agregar (resumir) su espacio de direcciones para un enrutamiento de mayor eficiencia.

![[prefijo-agregable-proveedor-pa.png]]

### Independiente del proveedor (PI)

El cliente final también puede elegir un espacio de direcciones independiente del proveedor yendo directo al RIR. El espacio de direcciones IP es asignado por un RIR directamente a una organización de usuarios finales.

Este sería el caso de la Facultad de Ingeniería: por un lado, la Facultad forma parte de la U.Na.M, de la cual recibe un prefijo de red, y por otro lado el ISP Obercom del cual también recibe el prefijo. Desde la Facultad de Ingeniería se envió una nota a Obercom para que publique sus IPs v6 del prefijo de la U.Na.M, y así desde afuera se podría observar que el rango de IPv6 de Obercom **NO** es el mismo que el de la Facultad de Ingeniería.

#### Sistemas Autónomos

Internet es una red de redes, y los sistemas autónomos son las grandes redes que componen Internet. Más concretamente, un sistema autónomo (**AS**) es una red grande o grupo de redes que tiene una política de enrutamiento unificada; cada AS tiene un número que lo identifica.

Desde `https://bgp.he.net/` (Hurricane Electric) se pueden consultar los prefijos IPv6 asignados a un AS:

- **AS263235 U.Na.M.:** `2803:70e0::/32`, y subdivisiones como `2803:70e0:100::/40`, `2803:70e0:101::/48`, `2803:70e0:102::/48`, `2803:70e0:501::/48`.
- **AS266668 Obercom:** `2803:a920::/32`, y subdivisiones `2803:a920:800::/44`, `2803:a920:810::/44`, `2803:a920:820::/44`, `2803:a920:830::/44` (sigue hasta `2803:a920:990::/44`).
- **AS4270 RIU:** `2800:110::/32`, y subdivisiones `2800:110:1024::/48`, `2800:110:2604::/48`, `2800:110:3804::/48`, `2800:110:3c00::/48`.

> [!info]- ¿Qué es la RIU?
> La **RIU** es la Red de Interconexión Universitaria. Proporciona conectividad a la totalidad de universidades miembro con ancho de banda de 500 Mbps simétricos, tecnología cien por ciento en fibra óptica contratada a distintas compañías de telecomunicaciones. La misma se despliega con topología estrella, donde los enlaces convergen en un datacenter con equipos propios administrados por la ARIU. La U.Na.M es parte de la RIU.

Finalmente, así se interconectan estos sistemas autónomos: la U.Na.M (AS263235) llega a Internet tanto a través de la RIU (AS4270) como de Obercom (AS266668).

---
**Volver a:** [[02 - Cabecera IPv6|Arquitectura de Direcciones IPv6]]

**Continuar a:** [[04 - Unicast|Unicast]]
