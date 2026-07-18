---
title: Localhost
---
El ***localhost*** es el nombre que se usa para designar el ordenador o dispositivo que se está utilizando en un momento determinado, más correctamente es el dispositivo o servidor local ("huésped local" sería la traducción literal). Esta IP **no cambia**, por lo que siempre se puede hacer referencia a ella.

> [!important] Dirección de loopback
> Todo *localhost* tiene asignada la dirección IP **`127.0.0.1`** (o `::1` en IPv6), también llamada dirección IP de ***loopback*** o **bucle reverso**. Permite usar herramientas TCP/IP apuntando a sí mismo, en modo local, sin salir del equipo ni conectarse a Internet. También se usa para que se comuniquen entre sí los procesos internos del equipo.

> [!note] En realidad hay muchas direcciones de loopback
> Todo el bloque `127.0.0.0/8` está reservado para loopback, por lo que un ping a cualquier `127.0.0.x` debería responder igual que `127.0.0.1`.

> [!note] Ver dirección de *localhost*
> En una terminal de **Linux** con `ifconfig` se ve una sección que comienza con `lo` y allí buscamos la denominada `inet` que corresponde a la dirección y máscara de *loopback*. 
> En **Windows** no puede verse (o por lo menos al momento de redactar esto) por terminal utilizando `ipconfig /all` pero si se resuelve `ping localhost` como `127.0.0.1`

---
**Volver a:** [[08 - Subredes|Subredes]]

**Continuar a:** [[10 - DHCP|DHCP]]
