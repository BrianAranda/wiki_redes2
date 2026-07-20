---
title: Multicast FF02
---
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

## Scope o alcance

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

### Flags

```
+-+-+-+-+
|0|R|P|T|
+-+-+-+-+
```

- `T=0`, indica que es permanente la dirección asignada.
- `T=1`, indica que NO es permanente la dirección asignada.
- El segundo bit (`R`) indica si esta dirección de multidifusión incluye el llamado Rendezvous Point (Punto de Encuentro).

## Tipos de Direcciones de Multicast

Hay algunas direcciones reservadas de Multicast y nunca deben ser asignadas a ningún grupo de Multicast.

### 1) Dirección multicast asignada

**Grupo multicast de todos los nodos `FF02::1`**
Se explica el uso en [[13 - Neighbor Discovery ND|Neighbor Discovery ND]]. Grupo multicast al que se unen todos los dispositivos con IPv6 habilitado. Los paquetes que se envían a este grupo son recibidos y procesados por todas las interfaces IPv6 en el enlace o en la red. Esto tiene el mismo efecto que una dirección de broadcast en IPv4.

**Grupo multicast de todos los routers `FF02::2`**
Se explica el uso en [[13 - Neighbor Discovery ND|Neighbor Discovery ND]]. Grupo multicast al que se unen todos los routers con IPv6 habilitado. Un router se convierte en un miembro de este grupo cuando se habilita como router IPv6 mediante el comando de configuración global `ipv6 unicast-routing`. Los paquetes que se envían a este grupo son recibidos y procesados por todos los routers IPv6 en el enlace o en la red.

### 2) Dirección multicast de nodo solicitado

Las direcciones multicast de nodo solicitado son similares a las direcciones multicast de todos los nodos. Recuerde que la dirección multicast de todos los nodos es esencialmente lo mismo que una dirección IPv4 de broadcast. Todos los dispositivos en la red deben procesar el tráfico enviado a la dirección de todos los nodos. Para reducir el número de dispositivos que deben procesar tráfico, utilice una dirección multicast de nodo solicitado.

**Prefijo multicast `FF02:0:0:0:0:1:FF00::/104`:**
Los primeros 104 bits de la dirección multicast de todos los nodos solicitados. Los 24 bits menos significativos (finales), o que se encuentran más hacia la derecha de la dirección unicast global o unicast link-local del dispositivo, se copian de los 24 bits del extremo derecho de la dirección.

**Ejemplo 1:**
Para la IPv6 `4037::01:800:200E:8C6C`, la dirección de nodo solicitado sería `FF02::1:FF0E:8C6C`. Vemos que los últimos 24 bits coinciden: `E:8C6C`.

**Ejemplo 2:**

![[direccion-multicast-nodo-solicitado.png]]

Dirección IPv6 unicast global: `2001:0DB8:ACAD:0001:0000:0000:0000:0010`
Dirección IPv6 multicast de nodo solicitado: `FF02::0:FF00:0010`

## Multicast capa 2 vs Multicast de capa 3

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

---
**Volver a:** [[10 - Anycast|Anycast]]

**Continuar a:** [[12 - Resumen de Direcciones IPv6|Resumen de Direcciones IPv6]]
