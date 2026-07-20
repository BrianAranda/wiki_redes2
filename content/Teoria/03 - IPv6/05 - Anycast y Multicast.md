---
title: Anycast y Multicast
---
## Anycast

- Se asignan a **MÁS DE UNA INTERFAZ**, típicamente de distintos nodos.
- Notar que la parte de "interface ID" son **CEROS** (no está asociada a una sola interfaz).
- Tienen la propiedad de que un paquete con esta dirección de anycast es dirigido a la interfaz **MÁS CERCANA**; para ello usan el "subnet prefix" que identifica un enlace o *link* específico.
- Los paquetes enviados a esa dirección IP se reenvían al servidor más cercano.
- Todos los enrutadores deben admitir las direcciones anycast de Subred-Router para las subredes a las que tienen interfaces.
- Son direcciones que se ubican en el espacio de direcciones de Unicast.
- Se usan para comunicarse con un grupo o conjunto de routers.

![[anycast-diagrama.png]]

> [!note] Nota del docente
> Podemos decir que Anycast sería un subconjunto de Unicast; la diferencia está en que la parte de "interface ID" son CEROS.

**Beneficios:**
- **Redundancia:** el servicio no depende de un único servidor, de modo que si un equipo falla, los demás asumen sus funciones y el servicio sigue disponible.
- **Balanceo de carga:** los distintos servidores se reparten el trabajo de modo que no haya un equipo sobrecargado (con la consiguiente merma de rendimiento) y otro inactivo.
- **Eficiencia:** la gran ventaja del "Anycasting" es que simplifica la búsqueda del servidor más apropiado (que suele ser el más cercano).

> [!info]- Uso típico: DNS
> Los servidores de [[DNS]] usan este método, para ubicar el servidor de DNS más cercano a donde lo solicitan.
>
> El emisor NO tiene control sobre la interfaz de destino (id de interfaz es cero), así que el/los routers toman la decisión del destino.

![[arbol-tipos-direcciones-anycast.png]]

La dirección anycast del enrutador de subred está predefinida. Su formato es como sigue:

```
|         n bits         |        128-n bits          |
+-------------------------+-----------------------------+
|      subnet prefix      |     00000000000000 (ceros)  |
+-------------------------+-----------------------------+
```

El prefijo de subred de esta dirección de anycast es un prefijo que identifica un link o enlace específico.

Notar que esta dirección anycast es sintácticamente lo mismo que una dirección de unidifusión para una interfaz en el enlace con el identificador de interfaz establecido en cero.

Los paquetes enviados a esta dirección van a ser distribuidos al router o a la subred. Todos los enrutadores deben admitir las Direcciones anycast de Subred-Router para las subredes a las que tienen interfaces.

> [!question] ¿Cuántas IPs se necesitan en IPv6 para un enlace punto a punto entre dos routers?
> La primer respuesta sería `/127`. Pero tomando en cuenta esta dirección de anycast de subred de router, vemos que debería ser `/126` (visto en [[04 - Unicast#9.3. Subnet ID|Subnet ID]]).

## Multicast FF02

![[arbol-tipos-direcciones-multicast.png]]

Una dirección de IPv6 del tipo Multicast es un identificador de un grupo de interfaces, típicamente de nodos diferentes.

> [!warning] Importante
> Las direcciones de Multicast están **solo** en el campo de IP de Destino de un datagrama.

El formato es:

![[formato-multicast.png]]

- Se las identifica fácilmente porque son direcciones que empiezan por `0xFF` (es decir, por `1111 1111`, en binario).
- Los nodos que se configuran con una dirección multicast determinada forman lo que se llama un **GRUPO DE MULTIDIFUSIÓN**.
- Un nodo puede pertenecer a varios grupos de multidifusión.
- Cuando un paquete es enviado a una dirección de multidifusión, todos los miembros del grupo procesan el paquete.

### Scope o alcance

El campo "Scope" (= ámbito de aplicación) se utiliza para limitar el alcance de una dirección de multidifusión.

En función del valor asignado el ámbito puede ser de interfaz local, de enlace local, de sitio local, global...

![[alcance-scope-multicast.png]]

- `0` reserved.
- `1` Interface-Local scope.
- `2` Link-Local scope.
- `3` reserved.
- `4` Admin-Local scope.
- `5` Site-Local scope.
- `6`–`D` (unassigned).
- `E` Global scope.
- `F` reserved.

#### Flags

```
+-+-+-+-+
|0|R|P|T|
+-+-+-+-+
```

- `T=0`, indica que es permanente la dirección asignada.
- `T=1`, indica que NO es permanente la dirección asignada.
- El segundo bit (`R`) indica si esta dirección de multidifusión incluye el llamado Rendezvous Point (Punto de Encuentro).

### Tipos de Direcciones de Multicast

Hay algunas direcciones reservadas de Multicast y nunca deben ser asignadas a ningún grupo de Multicast.

#### 1) Dirección multicast asignada

**Grupo multicast de todos los nodos `FF02::1`**
Se explica el uso en [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]. Grupo multicast al que se unen todos los dispositivos con IPv6 habilitado. Los paquetes que se envían a este grupo son recibidos y procesados por todas las interfaces IPv6 en el enlace o en la red. Esto tiene el mismo efecto que una dirección de broadcast en IPv4.

**Grupo multicast de todos los routers `FF02::2`**
Se explica el uso en [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]. Grupo multicast al que se unen todos los routers con IPv6 habilitado. Un router se convierte en un miembro de este grupo cuando se habilita como router IPv6 mediante el comando de configuración global `ipv6 unicast-routing`. Los paquetes que se envían a este grupo son recibidos y procesados por todos los routers IPv6 en el enlace o en la red.

#### 2) Dirección multicast de nodo solicitado

Las direcciones multicast de nodo solicitado son similares a las direcciones multicast de todos los nodos. Recuerde que la dirección multicast de todos los nodos es esencialmente lo mismo que una dirección IPv4 de broadcast. Todos los dispositivos en la red deben procesar el tráfico enviado a la dirección de todos los nodos. Para reducir el número de dispositivos que deben procesar tráfico, utilice una dirección multicast de nodo solicitado.

**Prefijo multicast `FF02:0:0:0:0:1:FF00::/104`:**
Los primeros 104 bits de la dirección multicast de todos los nodos solicitados. Los 24 bits menos significativos (finales), o que se encuentran más hacia la derecha de la dirección unicast global o unicast link-local del dispositivo, se copian de los 24 bits del extremo derecho de la dirección.

**Ejemplo 1:**
Para la IPv6 `4037::01:800:200E:8C6C`, la dirección de nodo solicitado sería `FF02::1:FF0E:8C6C`. Vemos que los últimos 24 bits coinciden: `E:8C6C`.

**Ejemplo 2:**

![[direccion-multicast-nodo-solicitado.png]]

Dirección IPv6 unicast global: `2001:0DB8:ACAD:0001:0000:0000:0000:0010`
Dirección IPv6 multicast de nodo solicitado: `FF02::0:FF00:0010`

### Multicast capa 2 vs Multicast de capa 3

Las direcciones de multicast de capa 3 deben tener su equivalente en capa 2.

**Multidifusión IPv6:** los 32 bits bajos de una dirección Ethernet para el tráfico de multidifusión IPv6 son los 32 bits bajos de la dirección IPv6 de multidifusión utilizada.

Por ejemplo, el tráfico de multidifusión:

![[multicast-capa2-vs-capa3.png]]

**Origen:**
- capa 3 IPv6 que utiliza la dirección `ff02::d`
- capa 2 utiliza la dirección MAC `33-33-00-00-00-0D`

**Destino:**
- capa 3 el tráfico a `ff05::1:3`
- capa 2 la dirección MAC `33-33-00-01-00-03`

**Direcciones comunes de Multicast usadas en RouterOS (MikroTik):**
- `FF01::1` - Todos los nodos (node-local)
- `FF01::2` - Todos los routers (node-local)
- `FF02::1` - Todos los nodos (link-local)
- `FF02::2` - All routers (link-local)
- `FF02::5` - OSPFv3 (Hellos, LSAs) (link-local)
- `FF02::6` - OSPFv3 (Designated Routers) (link-local)
- `FF02::C` - Servidores DHCP (link-local)

## Resumen de Direcciones IPv6

### Host

Un host con IPv6 necesita reconocer varias direcciones:

1. Dirección GUA (Global Unicast Address).
2. Dirección ULA: `FC00::/7` a `FDFF::/7`
3. Dirección de Link Local de cada interfaz LLA: `FE80::/10`
4. Dirección de Loopback: `::1/128`
5. Dirección de Multicast de todos los nodos: `FF01::1` ó `FF02::1`
6. Dirección de Multicast de todos los routers: `FF01::2`, `FF02::2`... hasta `FF05::2`

### Router

Un router necesita reconocer las siguientes direcciones:

1. Dirección GUA (Global Unicast Address).
2. Dirección de Loopback: `::1/128`
3. Dirección de Link Local de cada interfaz LLA: `FE80::/10`
4. Dirección de Multicast de todos los nodos: `FF01::1` ó `FF02::1`
5. Dirección de Multicast de todos los routers: `FF01::2`, `FF02::2`... hasta `FF05::2`

![[resumen-tipos-direcciones-ipv6.png]]

---
**Volver a:** [[04 - Unicast|Unicast]]

**Continuar a:** [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]
