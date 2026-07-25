---
title: Neighbor Discovery
fuente:
  - "[RFC 4861](https://datatracker.ietf.org/doc/html/rfc4861)"
---
El protocolo de descubrimiento de vecinos (ND de *Neighbor Discovery*) se utiliza en IPv6 para que los nodos (*hosts* y *routers*) determinen las direcciones de la capa de enlace de los vecinos que se sabe que residen en los enlaces conectados y para eliminar rápidamente los valores almacenados en caché que dejan de ser válidos.  

Los *hosts* también utilizan ND para encontrar *routers* vecinos que estén dispuestos a reenviar paquetes en su nombre.  A su vez, utilizan el protocolo para realizar un seguimiento activo de qué vecinos son accesibles y cuáles no, y para detectar cambios en las direcciones de la capa de enlace.

Este protocolo resuelve una serie de problemas relacionados con la interacción entre nodos conectados al mismo enlace, los cuales podríamos agrupar en tres propósitos:

> [!important] Propósitos de *Neighbor Discovery*
> 1. **Reemplazar ARP:** resuelve quién es quién en capa 2 por medio de:
> 	- ***Address resolution***: el reemplazo directo de ARP, obtener la MAC a partir de la IPv6.
> 	- ***Next hop determination***: determinar a qué vecino/*router* reenviar un paquete.
> 	- ***Neighbor Unreachability Detection* (NUD)**: detectar si un vecino dejó de responder.
> 	- ***Duplicate Address Detection* (DAD)**: detectar si ya existe la dirección.
> 2. **Auto configurar el *host* para la red**: resuelve qué necesita saber un *host* para poder funcionar en la red por medio de:
> 	- ***Router Discovery***: encontrar el _router_ del enlace (el _Default Gateway_).
> 	- ***Prefix Discovery***: descubrir qué prefijos son "locales" (on-link) en ese enlace.
> 	- ***Parameter Discovery***: enterarse de parámetros como el MTU.
> 	- ***Address Autoconfiguration***: literalmente SLAAC, armar la GUA propia.
> 	- **Duplicate Address Detection (DAD)**: detectar si ya existe la dirección.
> 3. **Redirección**: resuelve cuando un *router* quiere decirle a un host "para ese destino hay un salto mejor que yo". Esto por medio de:
> 	- ***Redirect***: informa que existe un mejor primer salto para el destino.

> [!info] Estudio de redirección
> En la materia no estudiamos el uso de redirección pero se detalla en [RFC 4861 - Sección 8](https://datatracker.ietf.org/doc/html/rfc4861#section-8)

## Mensajes de ND

El protocolo *Neighbor Discovery* define cinco tipos diferentes de paquetes ICMP: 

1. RS: *Router Solicitation* ó Solicitud de *router*.
2. RA: *Router Advertisement* ó Anuncio de *router* .
3. NS: *Neighbor Solicitation* ó Solicitud de vecino.
4. NA: *Neighbor Advertisement* ó Anuncio de vecino.
5. Re: *Redirect* ó Redireccionamiento.

Los mensajes anteriores se agrupan según quién los envía y para qué:

A) Mensajes entre _host_ y _router_ (RS y RA), usados para la **asignación dinámica de direcciones**:
1. Mensaje *Router Solicitation* (RS): de *host* a *router*.
2. Mensaje *Router Advertisement*  (RA): de *router* a *host*.

B) Mensajes entre _nodos_ (NS y NA), usados para la **resolución de direcciones**:  
3. Mensaje *Neighbor Solicitation* (NS).  
4. Mensaje *Neighbor Advertisement* (NA).
- Nota: no importa si son *host* o *router* en cada extremo.

C) Mensaje de _router_ a _host_ (Re), usado para la **optimización del primer salto**:
5. Mensaje *Redirect* (Re): desde *router* a *host*.

### Formatos de los mensajes ND

Los cinco mensajes ND traen primeramente lo esencial: Tipo, Código y *Checksum*, pero tambien necesita llevar datos variables según el mensaje. En vez de hacer una estructura distinta por mensaje, cada uno declara las opciones que trae, y el receptor las lee una por una.

Los mensajes incluyen cero o más opciones, algunas de las cuales pueden aparecer varias veces en el mismo mensaje. Estas deben completarse con ceros cuando sea necesario para garantizar que terminen en sus límites de 64 bits. Estas opciones son:

| Tipo | Nombre de la opción         | Objetivo de la opción                              |
| ---- | --------------------------- | -------------------------------------------------- |
| 1    | *Source Link-Layer Address* | Contiene la dirección de Capa 2 (MAC) del origen   |
| 2    | *Target Link-Layer Address* | Contiene la dirección de Capa 2 (MAC) del destino  |
| 3    | *Prefix Information*        | Proporciona prefijos y otra información para SLAAC |
| 4    | *Redirected Header*         | Contiene todos o parte del paquete redirigido      |
| 5    | MTU                         | Se asegura que todos los nodos usen el mismo MTU   |

 Además pueden utilizarse las siguientes direcciones:

- *Multicast* a todos los nodos del tipo *Link Local* (`FF02::1`) para alcanzar a todos los nodos.
- *Multicast* a todos los *routers* del tipo *Link Local* (`FF02::2`) para alcanzar a todos los *routers*.
- *Link Local* (`FE80::/10`) para alcanzar a los vecinos, siendo de la forma.
- *Multicast* de Capa 2 (`33:33`).
- *Unicast* Global (`2000::/3`)

> [!info] Estudio completo de los formatos de mensajes ND
> En la materia no estudiamos a fondo la estructura de los bits de cada mensaje. A modo opcional se detalla cada una en el [RFC 4861 - Sección 4](https://datatracker.ietf.org/doc/html/rfc4861#section-4)

### *Router Solicitation* (RS)

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

### *Router Advertisement* (RA)

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
