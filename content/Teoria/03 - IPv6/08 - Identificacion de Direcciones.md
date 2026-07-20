---
title: Identificación de Direcciones
---
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

## Agregable por el proveedor (PA)

El espacio de direcciones agregable por el proveedor (PA) es un bloque de direcciones asignadas por un RIR a un ISP. Esto permite al ISP agregar (resumir) su espacio de direcciones para un enrutamiento de mayor eficiencia.

![[prefijo-agregable-proveedor-pa.png]]

## Independiente del proveedor (PI)

El cliente final también puede elegir un espacio de direcciones independiente del proveedor yendo directo al RIR. El espacio de direcciones IP es asignado por un RIR directamente a una organización de usuarios finales.

Este sería el caso de la Facultad de Ingeniería: por un lado, la Facultad forma parte de la U.Na.M, de la cual recibe un prefijo de red, y por otro lado el ISP Obercom del cual también recibe el prefijo. Desde la Facultad de Ingeniería se envió una nota a Obercom para que publique sus IPs v6 del prefijo de la U.Na.M, y así desde afuera se podría observar que el rango de IPv6 de Obercom **NO** es el mismo que el de la Facultad de Ingeniería.

### Sistemas Autónomos

Internet es una red de redes, y los sistemas autónomos son las grandes redes que componen Internet. Más concretamente, un sistema autónomo (**AS**) es una red grande o grupo de redes que tiene una política de enrutamiento unificada; cada AS tiene un número que lo identifica.

Desde `https://bgp.he.net/` (Hurricane Electric) se pueden consultar los prefijos IPv6 asignados a un AS:

- **AS263235 U.Na.M.:** `2803:70e0::/32`, y subdivisiones como `2803:70e0:100::/40`, `2803:70e0:101::/48`, `2803:70e0:102::/48`, `2803:70e0:501::/48`.
- **AS266668 Obercom:** `2803:a920::/32`, y subdivisiones `2803:a920:800::/44`, `2803:a920:810::/44`, `2803:a920:820::/44`, `2803:a920:830::/44` (sigue hasta `2803:a920:990::/44`).
- **AS4270 RIU:** `2800:110::/32`, y subdivisiones `2800:110:1024::/48`, `2800:110:2604::/48`, `2800:110:3804::/48`, `2800:110:3c00::/48`.

> [!info]- ¿Qué es la RIU?
> La **RIU** es la Red de Interconexión Universitaria. Proporciona conectividad a la totalidad de universidades miembro con ancho de banda de 500 Mbps simétricos, tecnología cien por ciento en fibra óptica contratada a distintas compañías de telecomunicaciones. La misma se despliega con topología estrella, donde los enlaces convergen en un datacenter con equipos propios administrados por la ARIU. La U.Na.M es parte de la RIU.

Finalmente, así se interconectan estos sistemas autónomos: la U.Na.M (AS263235) llega a Internet tanto a través de la RIU (AS4270) como de Obercom (AS266668).

---
**Volver a:** [[07 - Prefijos de Direcciones|Prefijos de Direcciones]]

**Continuar a:** [[09 - Unicast|Unicast]]
