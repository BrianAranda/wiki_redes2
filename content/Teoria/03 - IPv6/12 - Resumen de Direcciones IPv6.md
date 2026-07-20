---
title: Resumen de Direcciones IPv6
---
## Host

Un host con IPv6 necesita reconocer varias direcciones:

1. Dirección GUA (Global Unicast Address).
2. Dirección ULA: `FC00::/7` a `FDFF::/7`
3. Dirección de Link Local de cada interfaz LLA: `FE80::/10`
4. Dirección de Loopback: `::1/128`
5. Dirección de Multicast de todos los nodos: `FF01::1` ó `FF02::1`
6. Dirección de Multicast de todos los routers: `FF01::2`, `FF02::2`... hasta `FF05::2`

## Router

Un router necesita reconocer las siguientes direcciones:

1. Dirección GUA (Global Unicast Address).
2. Dirección de Loopback: `::1/128`
3. Dirección de Link Local de cada interfaz LLA: `FE80::/10`
4. Dirección de Multicast de todos los nodos: `FF01::1` ó `FF02::1`
5. Dirección de Multicast de todos los routers: `FF01::2`, `FF02::2`... hasta `FF05::2`

![[resumen-tipos-direcciones-ipv6.png]]

---
**Volver a:** [[11 - Multicast FF02|Multicast FF02]]

**Continuar a:** [[13 - Neighbor Discovery ND|Neighbor Discovery ND]]
