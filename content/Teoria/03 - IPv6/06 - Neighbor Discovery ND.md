---
title: Neighbor Discovery ND
---
En Neighbor Discovery se envían mensajes ICMPv6 y se hace uso de diferentes direcciones de IPv6, todas ellas definidas en [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291).

**IPv6 NDP** (*Neighbor Discovery Protocol*, Protocolo de Descubrimiento de Vecinos en español) es el protocolo que proporciona el descubrimiento de nodo de red, como su nombre indica, esto sirve para dos propósitos:

1. Reemplazar a [[07 - ARP|ARP]].
2. Autoconfigurar el host para la red.

Los mensajes informativos y de error encontrados en [[ICMP|ICMPv6]] son muy similares a los mensajes de control y error implementados por ICMPv4. Sin embargo, ICMPv6 usado en ND tiene nuevas características y funcionalidades mejoradas que no se encuentran en ICMPv4. Los mensajes ICMPv6 se encapsulan en IPv6.

- Estos mensajes se usan para la configuración de prefijo de red, dirección de gateway, DNS (usado en SLAAC, DHCP).
- Estos se usan para obtener la dirección MAC a partir de la IPv6; este mecanismo reemplaza al ARP (para comunicarse con cualquier equipo de la red).

## Mensajes de ND

Este mecanismo Neighbor Discovery o simplemente ND es usado entre:

- **A)** Mensajes de router-dispositivo utilizados para la **asignación dinámica de direcciones**.
- **B)** Mensajes de dispositivo a dispositivo utilizados para la **resolución de direcciones**.

Para implementar estos dos mecanismos se usa en principio 4 (*) mensajes ICMPv6:

**A) Los mensajes que comienzan con R** de router ↔ equipo (RA y RS) para la asignación dinámica de direcciones:
1. Mensaje de solicitud de enrutador (**RS**).
2. Mensaje de anuncio de enrutador (**RA**).

**B) Los mensajes que comienzan con N** de equipo ↔ equipo (NA y NS) utilizados para la resolución de direcciones:
3. Mensaje de solicitud de vecino (**NS**).
4. Mensaje de anuncio de vecino (**NA**).

> [!important] Importante
> - Notar que 1 y 2, Router-Dispositivo, es para **OBTENER IPV6**.
> - Notar que 3 y 4, Dispositivo-Dispositivo (cualquier tipo, incluso Router), es para **RESOLVER DIRECCIONES**.

> [!note] (*) Nota
> Existe un 5to mensaje de Redirección utilizado para comunicar equipo con Router para la selección del 1er salto; esto no lo veremos en nuestra materia y es similar a ICMPv4.

### Tipos de mensajes de ND

Existen **5 tipos** de mensajes ICMPv6 para estos cuatro mecanismos. Algunas de las cuales pueden aparecer varias veces en el mismo mensaje.

Hay cinco opciones de descubrimiento de vecinos ICMPv6:

- **Tipo 1:** Dirección de capa de enlace de origen: esta opción contiene la dirección de capa 2 MAC (normalmente Ethernet) del remitente del paquete. Se utiliza en NS, RS, RA.
- **Tipo 2:** dirección de capa de enlace de destino: esta opción contiene la dirección de capa 2 MAC (normalmente Ethernet) del objetivo previsto. Se utiliza en NA y mensajes de redireccionamiento(*).
- **Tipo 3:** información de prefijo: la opción información de prefijo proporciona a los hosts prefijos y otra información para SLAAC. Aparece la opción información de prefijo en mensajes de anuncio de enrutador RA.
- **Tipo 4:** encabezado de redireccionamiento: esta opción se usa en mensajes de redireccionamiento para contener todos o parte del paquete que se está redirigiendo.
- **Tipo 5:** MTU: la opción MTU se utiliza en los mensajes de anuncio del enrutador para ayudar a asegurarse de que todos los dispositivos en un enlace utilicen la misma MTU.

## 13.1. Direcciones usadas en ND

ND utiliza las siguientes direcciones:

- **Multicast a todos los nodos:** es una dirección del tipo link-local para alcanzar a todos los nodos, y es `FF02::1`.
- **Multicast a todos los routers:** es una dirección del tipo link-local para alcanzar a todos los enrutadores, y es `FF02::2`.
- **Link-Local:** es una dirección unicast que sirve para alcanzar a los vecinos, siendo de la forma `FE80::/10`. Cada interfaz de un enrutador debe tener direcciones de este tipo.
- **Direcciones de Multicast de capa 2:** `33:33`.
- **Direcciones de Unicast Global.**

Estas direcciones son usadas en 4 tipos de mensajes:

| Mensaje | Origen → Destino |
| --- | --- |
| Mensaje de Solicitud (RA) | De Router a Dispositivos |
| Mensaje de solicitud de Router (RS) | De Dispositivos a Routers |
| Mensaje de solicitud de vecino (NS) | De Dispositivo a Dispositivos |
| Mensaje de anuncio de vecino (NA) | De Dispositivo a Dispositivos |

## 13.2. Mensajes RS y RA de ND

### Mensaje RS

![[escenario-rs-ra.png]]

Los mensajes RS son utilizados por un equipo que no es router para:
1. Descubrir quién es el Gateway de la red.
2. Autoconfigurarse IPv6: en caso de que el dispositivo final no cuente con una IPv6 asignada, también utilizará el RS para autoconfigurarse basada en la respuesta del RS donde obtiene el prefijo de red local por parte del Gateway.

Un equipo WinPC envía un mensaje RS (ver parámetros del ICMP6, Nro. 133) cuando necesita obtener información de Direccionamiento. Esto sucede al iniciar el equipo en la mayoría de los SO.

En el RS, se solicita un RA (una respuesta por parte del Router), por lo que si hay un router habilitado y configurado responderá con un mensaje RA en respuesta a un mensaje RS. En la imagen, PC1 (WinPC) envía un mensaje RS para determinar cómo recibir dinámicamente su información de dirección IPv6.

La PC envía un mensaje RS, esperando como respuesta un mensaje de RA. Las direcciones de este mensaje son:
- origen de este mensaje es la de Unicast del tipo **Link Local Address (LLA)** `fe80::d0f8:9ff6:4201:7086`
- destino la `FF02::2` (Multicast de Nodo solicitado de todos los Routers)

Si capturamos con Wireshark este mensaje RS, veríamos que incluye la MAC de origen, y va dirigido a una dirección multicast, en la que todos los routers forman parte; este mensaje sería el Tipo 1 (visto en el capítulo anterior). La dirección `33:33` es la dirección de multidifusión Ethernet para IPv6. Los 32 bits inferiores, `00:00:00:02`, se asignan desde la dirección de multidifusión IPv6 de destino, `ff02::2`.

![[wireshark-rs-mensaje.png]]

El router R1 responde con un mensaje RA del tipo 1 (ver parámetros del ICMP6, Nro. 134), en nuestro ejemplo:

**RS Resumen**
**WinPC → Router**
Capa 3 IP Origen: `fe80::d0f8:9ff6:4201:7086` (Unicast Link Local)
Capa 3 IP Destino: `FF02::2` (Multicast, todos los routers)
Capa 2 Origen: `00:50:56:af:97:68`
Capa 2 Destino: `33:33:0:0:0:2`

### Mensaje RA

Los mensajes RA son enviados por routers habilitados para IPv6 cada 200 segundos para proporcionar información de direccionamiento a los hosts habilitados para IPv6, o como respuesta a un mensaje RS.

Antes de enviar mensajes RA, se debe configurar un enrutador como enrutador IPv6, utilizando la configuración de enrutamiento de unidifusión ipv6 (`ipv6 unicast-routing`).

Esto también permite que el router habilite protocolos de enrutamiento IPv6 dinámicos y reenvíe paquetes IPv6.

En nuestro ejemplo, el RA sería una respuesta al RS enviado desde R1 a WinPC. El router puede ser configurado para enviar el mensaje RA como unicast en respuesta a un mensaje RS.

El mensaje de RS sería del tipo 133 y el de RA sería 134; si los capturamos con Wireshark se vería que el RA incluye: dirección de origen `fe80::1` (LLA del router R1), destino `ff02::1` (todos los dispositivos IPv6), la opción "Source link-layer address" con la MAC del router, la opción MTU, y la **opción Prefix Information** con el prefijo `2001:db8:cafe:1::/64` y el flag A (*Autonomous address-configuration flag*) activado, que indica que el equipo debe usar SLAAC para crear su GUA.

La IP dirección de destino (recordar que el equipo NO tiene IP) es la dirección de multicast del router donde está el router: `33:33:00:00:00:01`.

Se incluye la dirección MAC del Router: `58:ac:78:93:da:00`, necesaria en el futuro para los paquetes de capa 2 que tengan destino fuera de la red.

La dirección IPv6 de origen (la del router) es `fe80::1`, dirección de LLA (Local Link Address).

La dirección IPv6 de destino es la dirección multicast `FF02::1`, o la dirección de RS que envió el dispositivo (multicast de todos los dispositivos).

Se puede ver que el RA notifica al equipo que puede usar el prefijo `2001:db8:cafe:1::` al host, sobre el prefijo que se puede usar para configuración automática de direcciones sin estado.

**RA Resumen**
**Router → WinPC**
Capa 3 IP Origen: `fe80::1` (Unicast Link Local)
Capa 3 IP Destino: `FF02::1` (Multicast, todos los nodos)
Capa 2 Origen: `58:ac:78:93:da:00`
Capa 2 Destino: `33:33:0:0:0:1`

## 13.3. Mensajes NS y NA de ND

Este mecanismo Neighbor Discovery, o simplemente ND, es usado entre un Equipo y otro Equipo (PCs o Routers) para gestionar la comunicación con IPv6.

### a) Resolución de direcciones

La resolución de direcciones en IPv6 es similar a la [[07 - ARP|ARP]] en IPv4. Un dispositivo envía un mensaje de solicitud de vecino cuando conoce la dirección IPv6 de destino pero necesita solicitar su dirección de capa 2 (normalmente una dirección Ethernet). Esto es similar a una solicitud de ARP en IPv4. En respuesta al mensaje de solicitud de vecino, el dispositivo de destino envía un mensaje de anuncio de vecino, similar a una respuesta de ARP.

La resolución de direcciones incluye la **detección de direcciones duplicadas (DAD)**, que verifica la exclusividad de una dirección en el enlace. DAD es muy similar a un ARP gratuito. El dispositivo envía un mensaje de solicitud de vecino para su propia dirección IPv6 para detectar si otro dispositivo en el enlace está usando la misma dirección. Si no se recibe un mensaje de anuncio de vecino, el dispositivo sabe que su dirección es única en el enlace.

### b) Caché de vecinos y detección de no alcanzabilidad de vecinos (NUD)

Los dispositivos IPv6 utilizan mensajes NS y sus mensajes NA asociados para crear un caché de vecinos. El caché de vecinos contiene una asignación de direcciones MAC de IPv6 a Ethernet, similar a un caché ARP de IPv4.

Veamos cómo funcionan. En nuestro ejemplo, como el propósito es comunicar dos equipos, vamos a tomar en particular Router y PC; no cambia nada, son dos equipos que en este caso se quieren comunicar (NO se habla de configurar IPv6, eso se vio en el capítulo anterior).

> [!info]- Referencia
> Este tema no se verá en profundidad; si desea más información puede remitirse a: *"IPv6 Fundamentals: A Straightforward Approach to Understanding IPv6"*, Second Edition, autor Rick Graziani.

### Resolución de direcciones (paso a paso)

R1 se quiere comunicar con WinPC, mira su "TABLA DE VECINOS" (IPv6/MAC), antes conocida como tabla ARP. Pero no tiene MAC para ese vecino.

![[ns-objetivo-resolver-mac.png]]

**Paso 1) ¿Tengo la MAC de esa IP en mi tabla de vecinos?**

R1 revisa su caché de vecinos (o tabla de vecinos) para ver si hay una entrada para la dirección `2001:db8:cafe:1:d0f8:9ff6:4201:7086` y una dirección MAC Ethernet asociada. Similar a una caché ARP, la caché de vecinos mantiene una lista de asignaciones de direcciones MAC de IPv6 a Ethernet. En este ejemplo, R1 no tiene esta dirección IPv6 aún en su caché de vecinos, por lo que necesita enviar un mensaje de solicitud de vecino para solicitar la dirección MAC a quien la tenga.

**Paso 2) Mensaje NS**

R1 envía un mensaje de solicitud de vecino a través de su interfaz G0/0. La dirección IPv6 de destino es una dirección de multidifusión de nodo solicitado derivada de la dirección de destino en el mensaje ICMPv6. La dirección de destino en el mensaje NS es la dirección IPv6 de destino en el paquete, `2001:db8:cafe:1:d0f8:9ff6:4201:7086`.

La dirección de multidifusión de nodo solicitado es `ff02::1:ff01:7086`, que utiliza los 24 bits de orden inferior de la dirección de destino. La dirección IPv6 de nodo solicitado se asigna a la dirección MAC de destino Ethernet: `33:33` se antepone a los 32 bits de orden inferior de la dirección de multidifusión de nodo solicitado, lo que da como resultado una dirección de multidifusión Ethernet de `33:33:ff:01:70:86`. (Esta asignación se analiza con más detalle más adelante en este capítulo, y verá la ventaja de utilizar una dirección de multidifusión Ethernet en comparación con una dirección de difusión en una solicitud ARP IPv4).

![[ns-mensaje-detalle.png]]

**NS Resumen**
**Router → WinPC**
Capa 3 IP Origen: `2001:db8:cafe:1::1` (Unicast Global)
Capa 3 IP Destino: `FF02::1ff01:7086` (Multicast, todos los nodos derivada de la IPv6 destino)
Capa 2 Origen: `58:ac:78:93:da:00`
Capa 2 Destino: `33:33:ff:01:ff:70:86` (Multicast todos los nodos derivada de la IPv6 destino)

**Paso 3) WinPC procesa lo que recibe**

WinPC recibe el mensaje de solicitud de vecino y determina que es el destino previsto del mensaje. Agrega la dirección IPv6 de origen `2001:db8:cafe:1::1` del encabezado IPv6 y la dirección de capa de enlace `58:ac:78:93:da:00` del mensaje NS a su propia caché de vecino. Luego, usará esta información en su mensaje de anuncio de vecino a R1.

**Paso 4) Mensaje NA**

WinPC responde con un mensaje de anuncio de vecino NA. El mensaje NA incluye la dirección IPv6 de WinPC, la dirección IPv6 de destino `2001:db8:cafe:1:d0f8:9ff6:4201:7086` y la dirección MAC Ethernet `00:50:56:af:97:68`. El anuncio de vecino se envía como unidifusión a R1.

![[na-mensaje-detalle.png]]

**NA Resumen**
**WinPC → Router**
Capa 3 IP Origen: `2001:db8:cafe:1:d0f8:9ff6:4201:7086` (Unicast Global)
Capa 3 IP Destino: `2001:db8:cafe:1::1` (Unicast Global)
Capa 2 Origen: `00:50:56:af:97:68`
Capa 2 Destino: `58:ac:78:93:da:00`

**Paso 5) Router procesa lo que recibe**

R1 recibe el mensaje NA de anuncio de vecino de WinPC. R1 ahora puede agregar la dirección MAC de WinPC, `00:50:56:af:97:68`, y su dirección IPv6 asociada, `2001:db8:cafe:1:d0f8:9ff6:4201:7086`, a su caché de vecinos. `00:50:56:af:97:68` se incluye como la dirección MAC de destino en el encabezado Ethernet, y R1 puede reenviar la trama a WinPC.

Como se puede observar, los pasos para lograr la comunicación entre dos equipos son sencillos, utilizan direcciones que ya hemos mencionado, pero no tiene sentido profundizar en estos temas, ya que son propios de gente que se especialice en comunicaciones y configuraciones de IPv6; en nuestro caso excede la profundidad de nuestra materia.

## 13.4. Cache de los Hosts

Los host tienen 2 tipos de caché.

### Caché de Vecinos (Neighbor Cache)

La caché vecina equivale a una caché ARP o una tabla ARP en IPv4. El Neighbor Cache mantiene una lista de entradas sobre los vecinos a los que se ha dirigido tráfico recientemente enviado. La caché también indica si el vecino es un enrutador o un host, el estado de accesibilidad de la dirección, si hay alguna en cola.

Comandos en Linux:

```
ip -6 neighbor show
```

### Caché de Destino (Destination Cache)

Mantiene una lista de los destinos a los que se ha enviado tráfico recientemente, incluidos aquellos en otros enlaces o redes. En esos casos, la entrada es la Capa 2 dirección del enrutador del siguiente salto.

Un host IPv6 mantiene una lista de enrutadores predeterminada desde la cual selecciona un enrutador para el tráfico a destinos fuera del enlace. El enrutador seleccionado para un destino luego se almacena en caché en la caché de destino.

---
**Volver a:** [[05 - Anycast y Multicast|Anycast y Multicast]]

**Continuar a:** [[07 - Direcciones Dinamicas|Direcciones Dinámicas]]
