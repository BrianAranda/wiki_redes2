---
title: Direcciones IPv6
fuente:
  - "[RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291#section-2)"
---
## Representar direcciones IPv6

Existen tres formas de representar una dirección de IPv6. Recordando que consta de 128 bits usaremos dos tipos de base distinta según la ocasión:
- Base hexadecimal con `x` (0 al 9 y A a la F)
- Base decimal con `d`

### Notación preferida o expandida

Tiene la forma: `x:x:x:x:x:x:x:x` donde cada `x` representa un conjunto de cuatro dígitos hexadecimales, cada conjunto separado por ":". Por ejemplo:

$$
ABCD:EF01:2345:6789:ABCD:EF01:2345:6789
$$
$$
001:DB8:0:0:8:800:200C:417A
$$

Dado que cada conjunto tiene cuatro hexadecimales, y cada hexadecimal es representado por cuatro bits, un conjunto `x` posee 16 bits. Con 8 `x` tenemos el total de los 128 bits de dirección.  

> [!note] Forma abreviada
> No es necesario escribir los **ceros iniciales** (a la izquierda) en un campo individual `x`, pero debe haber al menos un número en cada campo en esta notación. Entonces:
> $$
> 0800 \longrightarrow 800 \qquad \text{o} \qquad 0000 \longrightarrow 0
> $$
> **No** se pueden quitar ceros finales (a la derecha)
> $$
> CD30 \:\nrightarrow \:CD3
> $$

### Notación comprimida

Es común en direcciones de IPv6 tener cadenas de ceros, para simplificar esto se pueden reemplazar por un solo "::". Por ejemplo:

$$
FF01:0:0:0:0:0:0:101 \longrightarrow FF01::101
$$
$$
0:0:0:0:0:0:0:1 \longrightarrow \: ::1
$$

> [!warning] Uso del abreviado
> El uso de "::" **solo puede aparecer una vez** por dirección.

### Notación alternativa

En entornos mixtos entre IPv4 e IPv6, se suele usar una notación del siguiente tipo:

`x:x:x:x:x:x:d.d.d.d`

Donde se tienen seis `x` (conjunto hexadecimal) al principio de la dirección (a la izquierda) y cuatro `d` (conjunto decimal) al final de la dirección ([[06 - Direcciones IPv4#Notación decimal con punto|notación decimal con punto]]). Por ejemplo:

$$
0:0:0:0:0:0:13.1.68.3
$$
$$
0:0:0:0:0:FFFF:129.144.52.38
$$

Con seis conjuntos `x` tenemos 96 bits (6x16), sumados a los 32 bits de los conjuntos `d` (4x8) resultan en los 128 bits totales de la dirección.

> [!info] Mezcla de notaciones
> Es posible combinar las notaciones comprimida y alternativa, e incluso aplicar la forma abreviada si se desea:
> $$
> 0:0:0:0:0:00A9:196.144.52.38 \longrightarrow \: ::A9:196.144.52.38
> $$

### Direcciones IPv6 en URLs

Ver que en IPv6 se usa ":" y esto en IPv4 se correspondía con un puerto de TCP, por eso en algunas ocasiones al momento de presentar una dirección IPv6 (como una dirección en un navegador, por ejemplo) se la pone **entre corchetes** para evitar esa confusión.

En una dirección URL, las direcciones IPv6 se muestran entre corchetes. Ejemplo:  
$$
\text{http://}[2001:0db8:83a3:08d3::0380:7344]/
$$

El puerto se escribiría detrás del corchete de cierre, tambien separados por dos puntos. Ejemplo:  
$$
\text{http://}[2001:0db8:83a3:08d3::0380:7344]:8080/
$$

> [!info]- Uso de % para direcciones IPv6
> En algunas ocasiones se podría ver el signo de porcentaje "%" acompañando a una dirección link-local, como en `fe80::1%eth0`. Esto es el **zone ID** o identificador de zona ([RFC 4007](https://www.rfc-editor.org/rfc/rfc4007)): como una dirección link-local (`FE80::/10`) solo es única dentro de un enlace, y un equipo puede tener varias interfaces (Wi-Fi, Ethernet, una VPN, etc.), hace falta indicar explícitamente por cuál interfaz se debe usar esa dirección, de ahí el `%` seguido del nombre o índice de la interfaz. 
>
> ![[winbox-conexion-link-local.png|600]]
>
> Dentro de una URL, el "%" ya es un carácter reservado que introduce una codificación hexadecimal (por ejemplo "%20" para un espacio), así que para no generar ambigüedad, el [RFC 6874](https://www.rfc-editor.org/rfc/rfc6874) exige escapar ese "%" reemplazándolo por su propio código hexadecimal 25, quedando `%25` en su lugar. Por eso una URL a una dirección link-local vía la interfaz `eth0` se escribe `http://[fe80::1%25eth0]/`, y no `http://[fe80::1%eth0]/`.

### Prefijos de direcciones

Al igual que en IPv4 los [[06 - Direcciones IPv4#Prefijo o máscaras red|prefijos o máscaras red]] en IPv6 se representa como la dirección seguida de un `/n` donde `n` es el valor decimal de bits contiguos a la izquierda que componen el prefijo.

Ejemplos:
$$
12AB:0000:0000:CD30:0000:0000:0000:0000/60
$$
$$
12AB::CD30:0:0:0:0/60
$$
$$
12AB:0:0:CD30::/60
$$

## Tipos de direcciones IPv6

Las direcciones IPv6 de cualquier tipo son asignadas a las **interfaces** no a los nodos. Una sola interfaz puede tener múltiples tipos de direcciones IPv6. Existen tres tipos:

- *Unicast*: identifica a **una única interfaz**, un paquete con dirección de *unicast* es **distribuido a una sola** interfaz con esa dirección.

- *Multicast*: identifica un **conjunto de interfaces** de red, típicamente de distintos nodos. Un paquete con dirección de *multicast* es **distribuido a todas** las interfaces con esa dirección.

- *Anycast*: identifica un **conjunto de interfaces** de red, típicamente de distintos nodos. Un paquete con dirección de *anycast* es **distribuido a la interfaz mas cercana** con esa dirección.

> [!warning] Broadcast no existe en IPv6

![[tipos_direcciones.png]]

La IANA dividió todo el rango de direcciones IPv6 en 8 partes y para ello utilizó los 3 primeros bits. Por el momento usa 1/8 de la parte de las direcciones totales:

![[espacio-direcciones-ipv6-3bits.png]]

*Las porciones restantes del espacio de direcciones IPv6 están reservadas por el IETF para uso futuro.*

Cualquier dirección de IPv6 se puede reconocer, entre otras cosas, **por sus bits de mayor orden**:

| Tipo de dirección    | Prefijo binario          | Notación IPv6 |
| -------------------- | ------------------------ | ------------- |
| *Unspecified*        | 00 $\cdots$ 0 (128 bits) | ::/128        |
| *Loopback*           | 00 $\cdots$ 1 (128 bits) | ::1/128       |
| *Multicast*          | 1111 1111                | FF00::/8      |
| *Link Local Unicast* | 1111 1110 1000           | FE80::/10     |
| *Global Unicast*     | (Cualquier otra)         |               |

> [!note] Notas
> Las direcciones de *anycast* son tomadas de las *unicast* global, por eso no figuran en la tabla.

## Ámbito de las direcciones *Unicast*

Dentro de las direcciones *unicast* existe además un concepto de direccionamiento que se conoce como ámbito o *scope*, que indica hasta dónde es alcanzable una dirección.  Hay 3 ámbitos:

- **Ámbito enlace:** Direcciones únicas para ser usadas en **una sola interfaz** de red. Conocidas como *Link Local* (`FE80::/10`). Con estas direcciones se pueden asignar las direcciones globales, y sirven para la detección de vecinos o los protocolos de enrutamiento dinámico para compartir las rutas.

- **Ámbito sitio:** Similares a direcciones IPv4 privadas. Se conocen como *Unique Local Address* (`FC00::/7` a `FD00::/7`). Se obtienen con un proceso aleatorio que permite asegurar que son únicas y aunque lo sean no se pueden utilizar para comunicarse en Internet, los enrutadores de Internet no tienen rutas para llegar a ellas.

- **Ámbito Global:** Estas direcciones son únicas globalmente (`2000::/3` a `3FFF::/3`). Las asigna la IANA.

![[ambitos-enlace-sitio-global.png]]

## Prefijos Globales

Ya vimos que existe un ámbito Global que asigna la IANA, por lo que, ahora tenemos que ver cómo una organización obtiene en la práctica su propio bloque de direcciones dentro de ese ámbito. Hay dos tipos de direcciones que se pueden asignar a un ISP:

### Agregable por el proveedor (PA)

El espacio de direcciones agregable por el proveedor (PA de *provider aggregatable*) es un bloque de direcciones asignadas por un RIR a un ISP. Esto permite al ISP agregar (resumir) su espacio de direcciones para un enrutamiento de mayor eficiencia.

![[prefijo-agregable-proveedor-pa.png]]

### Independiente del proveedor (PI)

El cliente final también puede elegir un espacio de direcciones independiente del proveedor (PI de *provider independent*) yendo directo al RIR. El espacio de direcciones IP es asignado por un RIR **directamente** a una organización de usuarios finales.

### Sistemas Autónomos

Internet es una red de redes, y los sistemas autónomos son las grandes redes que componen Internet. Más concretamente, un sistema autónomo (AS de *Autonomous System*) es una red grande o grupo de redes que tiene una política de enrutamiento unificada. Cada AS tiene un número que lo identifica (ASN de `Autonomous System Number`).

Desde [*Hurricane Electric*](https://bgp.he.net/ () se pueden consultar los prefijos IPv6 asignados a un AS:

- **AS263235 U.Na.M.:** `2803:70e0::/32`
- **AS266668 Obercom:** `2803:a920::/32`
- **AS4270 RIU:** `2800:110::/32

> [!info]- ¿Qué es la RIU?
> La **RIU** es la Red de Interconexión Universitaria. Proporciona conectividad a la totalidad de universidades miembro con ancho de banda de 500 Mbps simétricos, tecnología cien por ciento en fibra óptica contratada a distintas compañías de telecomunicaciones. La misma se despliega con topología estrella, donde los enlaces convergen en un datacenter con equipos propios administrados por la ARIU. La U.Na.M es parte de la RIU.

En la Facultad de Ingeniería: por un lado, la Facultad forma parte de la U.Na.M, de la cual recibe un prefijo de red, y por otro lado el ISP Obercom del cual también recibe el prefijo. Desde la Facultad de Ingeniería se envió una nota a Obercom para que publique sus IPs v6 del prefijo de la U.Na.M, y así desde afuera se podría observar que el rango de IPv6 de Obercom **NO** es el mismo que el de la Facultad de Ingeniería:

>[!example] Caso de la FIO 
> - La UNaM tiene su **propio** AS (263235) porque quiere ser independiente, tiene su propio prefijo `2803:70e0::/32` obtenido **directamente de LACNIC** (el RIR), no de ningún ISP (es un caso PI). Al tener AS propio, puede anunciar su prefijo `2803:70e0::/32` a quien la conecte con Internet (a la RIU, y también a Obercom), y el anuncio queda registrado con su ASN como origen.
> - Obercom es un ISP comercial, con **su propio** prefijo separado `2803:a920::/32`, que normalmente reparte a sus clientes. Con su AS (266668), simplemente **retransmite** ese anuncio hacia el resto de Internet cuando actúa de tránsito para la FIO, pero en el anuncio BGP, el "AS de origen del prefijo de la fucultad sigue figurando con el ASN de la facultad, no con el de Obercom. Aparece como un salto intermedio (AS-*path*), no como el dueño del prefijo.
> - Por eso alguien de afuera puede ver, mirando la tabla de rutas de BGP, que ese rango específico pertenece a la UNaM aunque el paquete físicamente sale por Obercom.

## Direcciones temporales

Una dirección temporal en IPv6 es una dirección generada de manera **aleatoria** y **cambiada periódicamente** para mejorar la privacidad del usuario. Se utiliza en dispositivos que se conectan a Internet para evitar el rastreo de la dirección IP fija por parte de sitios web o servicios en línea.

El uso de direcciones temporales es opcional y configurable pero están habilitadas por defecto. Tienen una vida útil corta, normalmente horas o días y es común tener varias para asegurarse de que las conexiones existentes puedan continuar mientras se crea una nueva.

> [!tip] ¿Cuándo usar direcciones temporales?
> Es útil en dispositivos personales para proteger la privacidad al navegar en Internet.
> 
> No recomendable para servidores o dispositivos que necesitan direcciones estáticas para funcionar, como impresoras, *routers* o servidores web.

Objetivos principales de las direcciones temporales en IPv6:

1. **Mejorar la privacidad:** al cambiar frecuentemente, dificulta que terceros rastreen la actividad de un dispositivo en la red.
2. **Evitar identificación a largo plazo:** a diferencia de las direcciones EUI-64 (basadas en la MAC del dispositivo), las temporales no revelan información del hardware.
3. **Seguridad contra ataques de seguimiento:** algunos atacantes pueden usar direcciones IPv6 estáticas para crear perfiles de actividad de usuarios.

Se generan utilizando el mecanismo de privacidad definido en el RFC 8981 (antes RFC 4941):

1. **Obtención del prefijo IPv6:** el dispositivo recibe un prefijo de red mediante SLAAC o DHCPv6.
2. **Generación del identificador de interfaz aleatorio:** se usa un número aleatorio para generar la parte del *host* y cambia cada cierto tiempo.
3. **Asignación y uso de la dirección temporal:** se usa para conexiones salientes y se mantiene activa solo por un tiempo definido antes de generar una nueva.
4. **Eliminación de direcciones viejas:** cuando se genera una nueva dirección temporal, la anterior se marca como "*deprecated*" y deja de usarse en nuevas conexiones, pero sigue funcionando hasta que las conexiones activas finalicen.

### Tiempos de vida

> Esta sección es meramente informativa

Las direcciones IPv6 tienen distintos tiempos de vida; el tratamiento en profundidad de este tema escapa a la materia y se puede profundizar en el [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862).

- **Direcciones tentativas:** las que están en proceso de verificación.
- **Dirección preferida:** se verificó que la dirección es única.
- **Dirección en desuso (*deprecated*):** la dirección todavía es válida pero no lo será en el futuro.
- **Dirección válida:** la dirección es una dirección preferida o en desuso.
- **Dirección inválida:** una dirección que se volvió inválida al terminar su vida útil.

![[tiempodevida.png|600]]

- **Vida útil preferida:** este es el período de tiempo en el que se prefiere una dirección válida hasta que queda obsoleta. Cuando expira la dirección pasa a ser obsoleta.
- **Vida útil válida:** este es el período de tiempo que una dirección permanece en el estado válido. Debe ser mayor o igual a la vida preferida. Cuando expira la dirección deja de ser válida.

> [!tip] "Forever" no es tan literal
> Las IPv6 que no son temporales aparecen con la etiqueta `forever`, esto no quiere decir que sean para siempre. A modo de ejemplo, dos capturas del mismo host `ip -6 addr show` en momentos distintos muestran que la Link-Local (`fe80::.../64`) es "forever" pero cambia entre una captura y otra, por el principio de *Privacy Extensions for* SLAAC.

---
**Volver a:** [[02 - Cabecera IPv6|Cabecera IPv6]]

**Continuar a:** [[04 - Unicast|Unicast]]
