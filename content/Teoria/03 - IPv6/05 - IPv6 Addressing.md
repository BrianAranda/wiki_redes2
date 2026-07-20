---
title: IPv6 Addressing
---
Las direcciones IPv6 de cualquier tipo son asignadas a las **interfaces** (no a los nodos).

Una sola interfaz puede tener múltiples direcciones IPv6 (unicast, multicast, anycast, como ya se verá).

> [!note] Excepción
> Direcciones de unidifusión con un alcance mayor que el alcance del enlace no son necesarias para interfaces que no se utilizan como origen o destino de ningún paquete IPv6 hacia o desde el nodo. A veces esto es conveniente para interfaces punto a punto.

Cada interfaz pertenece a un solo nodo.

Hay en principio 3 tipos de direcciones:

## Unicast

Una IPv6 de Unicast identifica una única interfaz. Un paquete con dirección de Unicast es distribuido a UNA, la única interfaz con esa dirección.

## Multicast

Una IPv6 de Multicast identifica un conjunto de interfaces de red, típicamente de distintos nodos. Un paquete con dirección de Multicast es distribuido a TODAS las interfaces con esa dirección.

> [!note] Def. nodo
> Dispositivo que implementa capa 3 IP.

## Anycast

Una IPv6 de Anycast identifica un conjunto de interfaces de red, típicamente de distintos nodos. Un paquete con dirección de Anycast es distribuido a UNA de las interfaces con esa dirección, la que esté más cerca.

## Broadcast NO existe en IPv6

![[unicast-anycast-multicast-broadcast.png]]

---
**Volver a:** [[04 - Arquitectura Direcciones IPv6|Arquitectura de Direcciones IPv6]]

**Continuar a:** [[06 - Representacion de Direcciones|Representación de Direcciones]]
