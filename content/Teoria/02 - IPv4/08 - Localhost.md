---
title: Localhost
---
**Localhost** es el nombre que se usa para designar el ordenador o dispositivo que se está utilizando en un momento determinado — más correctamente, el dispositivo o servidor local ("huésped local" sería la traducción literal).

> [!important] Dirección de loopback
> Todo localhost tiene asignada la dirección IP **`127.0.0.1`** (o `::1` en IPv6), también llamada dirección IP de **loopback** o bucle reverso. Permite usar herramientas TCP/IP apuntando a sí mismo, en modo local, sin salir del equipo ni conectarse a Internet. También se usa para que se comuniquen entre sí los procesos internos del equipo.

Esta IP **no cambia**, por lo que siempre se puede hacer referencia a ella.

> [!note] En realidad hay muchas direcciones de loopback
> Todo el bloque `127.0.0.0/8` está reservado para loopback, por lo que un ping a cualquier `127.0.0.x` debería responder igual que `127.0.0.1`.

![[ifconfig-localhost-loopback-anotado.png]]

---
**Volver a:** [[07 - Subredes|Subredes]]

**Continuar a:** [[09 - DHCP|DHCP]]
