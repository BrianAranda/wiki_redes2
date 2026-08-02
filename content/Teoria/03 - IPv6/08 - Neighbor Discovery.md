---
title: Neighbor Discovery
fuente:
  - "[RFC 4861](https://datatracker.ietf.org/doc/html/rfc4861)"
  - "[Fundamentos IPv6 Cisco](https://cloud.fio.unam.edu.ar/index.php/s/kfroJFkzy5YNi59?dir=/&editing=false&openfile=true)"
---
El protocolo de descubrimiento de vecinos (ND de *Neighbor Discovery*) se utiliza en IPv6 para que los nodos (*hosts* y *routers*) determinen las direcciones de la capa de enlace de los vecinos que se sabe que residen en los enlaces conectados y para eliminar rápidamente los valores almacenados en caché que dejan de ser válidos.  

Los *hosts* también utilizan ND para encontrar *routers* vecinos que estén dispuestos a reenviar paquetes en su nombre.  A su vez, utilizan el protocolo para realizar un seguimiento activo de qué vecinos son accesibles y cuáles no, y para detectar cambios en las direcciones de la capa de enlace.

Este protocolo resuelve una serie de problemas relacionados con la interacción entre nodos conectados al mismo enlace, los cuales podríamos agrupar en tres propósitos:

> [!important] Propósitos de *Neighbor Discovery*
> 1. **Reemplazar ARP:** resuelve quién es quién en capa 2 por medio de:
>    - ***Address resolution***: el reemplazo directo de ARP, obtener la MAC a partir de la IPv6.
>    - ***Next hop determination***: determinar a qué vecino/*router* reenviar un paquete.
>    - ***Neighbor Unreachability Detection* (NUD)**: detectar si un vecino dejó de responder.
>    - ***Duplicate Address Detection* (DAD)**: detectar si ya existe la dirección.
> 2. **Auto configurar el *host* para la red**: resuelve qué necesita saber un *host* para poder funcionar en la red por medio de:
>    - ***Router Discovery***: encontrar el _router_ del enlace (el _Default Gateway_).
>    - ***Prefix Discovery***: descubrir qué prefijos son "locales" (on-link) en ese enlace.
>    - ***Parameter Discovery***: enterarse de parámetros como el MTU.
>    - ***Address Autoconfiguration***: literalmente SLAAC, armar la GUA propia.
>    - **Duplicate Address Detection (DAD)**: detectar si ya existe la dirección.
> 3. **Redirección**: resuelve cuando un *router* quiere decirle a un host "para ese destino hay un salto mejor que yo". Esto por medio de:
>    - ***Redirect***: informa que existe un mejor primer salto para el destino.

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
- Mensaje *Router Solicitation* (RS): de *host* a *router*.
- Mensaje *Router Advertisement*  (RA): de *router* a *host*.

B) Mensajes entre _nodos_ (NS y NA), usados para la **resolución de direcciones**:
- Mensaje *Neighbor Solicitation* (NS).  
- Mensaje *Neighbor Advertisement* (NA).
- Nota: no importa si son *host* o *router* en cada extremo.

C) Mensaje de _router_ a _host_ (Re), usado para la **optimización del primer salto**:
- Mensaje *Redirect* (Re): desde *router* a *host*.

### Formatos de los mensajes

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
> En la materia no estudiamos a fondo la estructura de los bits de cada mensaje. A modo opcional se detalla cada una en el [RFC 4861 - Sección 4](https://datatracker.ietf.org/doc/html/rfc4861#section-4). 
> 
> Además a continuación se exponen imágenes y capturas del libro [Fundamentos IPv6 Cisco](https://cloud.fio.unam.edu.ar/index.php/s/kfroJFkzy5YNi59?dir=/&editing=false&openfile=true) del capítulo 13 (Parte IV). Para profundizar mas en qué tiene cada mensaje.

### *Router Solicitation* (RS)

Un *host* (no un *router*) envía un RS para descubrir quién es el *gateway* del enlace y, si todavía no tiene dirección, para disparar su autoconfiguración: la respuesta (RA) le va a traer el prefijo de red desde el cual arma su GUA. Esto sucede al iniciar el equipo en la mayoría de los SO. 

Vamos a analizar el siguiente ejemplo:

![[rs_situacion.png|600]]

Un *host* (WinPC) envía un RS a todos los *routers* esperando como respuesta un RA. Las direcciones que tiene el mensaje son:
- Origen: su propia *Link Local Address* (LLA), `FE80::D0F8:9FF6:4201:7086`.
- Destino: `FF02::2` (*multicast* a todos los *routers*).

Si se captura el mensaje con Wireshark, el RS incluye la opción *Source Link-Layer Address* con la MAC de origen, y va dirigido a una dirección *multicast* de capa 2: `33:33` seguido de los 32 bits inferiores de la dirección *multicast* IPv6 de destino (`00:00:00:02`, tomados de `FF02::2`).

![[rs_captura.png]]

Entonces: *Host* → *Router*
- Capa 3 IP Origen: `FE80::D0F8:9FF6:4201:7086` (*Unicast Link Local*)
- Capa 3 IP Destino: `FF02::2` (*Multicast*, todos los *routers*)
- Capa 2 MAC Origen: `00:50:56:af:97:68`
- Capa 2 MAC Destino: `33:33:0:0:0:2`

### *Router Advertisement* (RA)

Un *router* envía un RA para proporcionar información de direccionamiento a los *hosts* del enlace: lo hace periódicamente (cada 200 segundos por defecto) y también como respuesta directa a un RS. Antes de poder enviarlos, el *router* debe estar habilitado como *router* IPv6, lo que también le permite reenviar paquetes IPv6 y correr protocolos de *routing* dinámico.

Continuando con el ejemplo de RS:

![[ra_situacion.png|600]]

Un *router* (R1) responde al RS del *host* (WinPC) con un RA. El mensaje incluye:
- Origen: la LLA del *router*, `FE80::1`.
- Destino: `FF02::1` (*multicast* a todos los dispositivos IPv6) o, si el *router* está configurado para responder por *unicast*, la LLA del *host* que envió el RS.
- Opción *Source Link-Layer Address* con la MAC del *router* (`58:AC:78:93:DA:00`), necesaria para que el *host* pueda armarle tramas de vuelta.
- Opción MTU.
- Opción *Prefix Information*, con el prefijo `2001:DB8:CAFE:1::/64` y el *flag* A (*Autonomous address-configuration flag*) activado, indicando que el *host* debe usar SLAAC para armar su GUA con ese prefijo.

Si capturamos el mensaje con Wireshark podemos ver esto en:

![[ra_captura_1.png|600]]
![[ra_captura_2.png|600]]
![[ra_captura_3.png|600]]

Entonces: *Router → Host*
- Capa 3 IP Origen: `fe80::1` (*Unicast Link Local*)
- Capa 3 IP Destino: `FF02::1` (*Multicast*, todos los nodos) o la LLA
- Capa 2 MAC Origen: `58:AC:78:93:DA:00`
- Capa 2 MAC Destino: `33:33:0:0:0:1`

### *Neighbor Solicitation* (NS)

Un NS es enviado por cualquier nodo (*host* o *router*, no hay una dirección fija como en RS/RA) que conoce la IPv6 de destino pero necesita su MAC, es el reemplazo directo de una solicitud [[07 - ARP|ARP]]. 

> [!info]- NS también se usa para DAD
> El mismo mensaje NS se reutiliza para la Detección de Direcciones Duplicadas (DAD), cambiando el propósito de la pregunta: en vez de "¿quién tiene esta IP? decime tu MAC", pregunta "¿alguien más tiene ya esta IP?", por eso su dirección de origen es la *Unspecified Address* (`::`) en vez de una dirección propia. El procedimiento de DAD está definido en [RFC 4862 - Sección 5.4](https://datatracker.ietf.org/doc/html/rfc4862#section-5.4) y se desarrolla con su propio ejemplo en [[10 - Direcciones Dinamicas#*Duplicate Address Detection* (DAD)|Direcciones Dinámicas]].

Por ejemplo el *router* R1 quiere comunicarse con el *host* WinPC, revisa su caché de vecinos (tabla IPv6/MAC, la evolución de la tabla ARP), pero no tiene una entrada para esa IP.

![[ns_escenario.png|600]]

Entonces el *router* (R1) envía un NS por su interfaz G0/0 hacia la [[05 - Multicast#*Multicast* de nodo solicitado|dirección de multidifusión de nodo solicitado]] derivada de la IPv6 de destino, esta es formada con los 24 bits de orden inferior de la IPv6 buscada. 

En capa 2, por la [[05 - Multicast#*Multicast* Capa 2 y Capa 3|relación multicast entre capa 2 y 3]], se antepone `33:33` a los 32 bits inferiores de esa dirección *multicast* para armar la MAC de destino (desconocida realmente). La ventaja frente a ARP es que este mensaje no es un verdadero *broadcast*: solo lo procesan las interfaces que ya calcularon esa misma dirección de nodo solicitado (idealmente, solo el *host* WinPC).

Calculando:
- Dirección de destino: `2001:DB8:CAFE:1:D0F8:9FF6:4201:7086`
- Últimos 24 bits: `01:7086`
- *Multicast* de nodo solicitado derivada: `FF02::1:FF01:7086`
- MAC de destino: `33:33:FF:01:70:86`

El mensaje NS para el ejemplo sería:

![[ns_mensaje.png|600]]

Entonces: *Router → Host* (En este ejemplo, podría ser entre cualquier tipo de nodo)
- Capa 3 IP Origen: `2001:DB8:CAFE:1::1` (*Unicast Global*)
- Capa 3 IP Destino: `FF02::1:FF01:7086` (*Multicast* de nodo solicitado derivada)
- Capa 2 MAC Origen: `58:AC:78:93:DA:00`
- Capa 2 MAC Destino: `33:33:FF:01:70:86` (Derivada de la IPv6 destino)

### *Neighbor Advertisement* (NA)

Un NA es la respuesta a un NS: lo envía el nodo que reconoce que la dirección solicitada es la suya, informando su propia MAC.

Continuando con el ejemplo de NS, el *host* (WinPC) recibe el NS de *router* R1 y reconoce que el destino es su propia dirección, aprovecha para agregar a su propia caché de vecinos la IPv6 y MAC de R1 (que venían en ese NS). 

![[na_situacion.png|600]]

Después responde con un NA por *unicast*, directo a R1, incluyendo su propia MAC:

![[na_mensaje_1.png|600]]

Entonces: *Host → Router*
- Capa 3 IP Origen: `2001:DB8:CAFE:1:D0F8:9FF6:4201:7086` (*Unicast Global*)
- Capa 3 IP Destino: `2001:DB8:CAFE:1::1` (*Unicast Global*)
- Capa 2 MAC Origen: `00:50:56:AF:97:68`
- Capa 2 MAC Destino: `58:AC:78:93:DA:00`

Al recibir este NA, R1 agrega la IPv6 y MAC de WinPC a su caché de vecinos, y con eso ya puede reenviarle directamente la trama que tenía pendiente. Con este último paso se cierra el ciclo: ambos extremos terminan con una entrada nueva en su caché de vecinos.

![[ns_na.png|600]]

## Cache de los *Hosts*

Los *host* tienen 2 tipos de caché:

### Caché de Vecinos (*Neighbor Cache*)

La caché vecina equivale a una caché ARP o una tabla ARP en IPv4. El *Neighbor Cache* mantiene una lista de entradas sobre los vecinos a los que se ha dirigido tráfico recientemente enviado. También indica si el vecino es un *router* o un *host*, el estado de accesibilidad de la dirección o si hay alguna en cola.

Comandos en Linux:

```
ip -6 neighbor show
```

Solo guarda pares IPv6 ↔ MAC de nodos que están **en el mismo enlace** (vecinos directos).. Nunca tiene una entrada para algo que está fuera del enlace, porque ahí no tiene sentido preguntar por una MAC (un destino remoto no tiene una MAC directamente alcanzable).

### Caché de Destino (*Destination Cache*)

Mantiene una lista de los destinos a los que se ha enviado tráfico recientemente, incluidos aquellos en otros enlaces o redes. En esos casos, la entrada es la Capa 2 dirección del enrutador del siguiente salto.

Un *host* IPv6 mantiene una lista de *routers* predeterminada desde la cual selecciona uno para el tráfico a destinos fuera del enlace. El *router* seleccionado para un destino luego se almacena en la caché de destino.

Guarda, para **cualquier destino** al que se le mande tráfico recientemente, cuál es el próximo salto que hay que usar para llegar ahí. Es la referencia a qué vecino usar para reenviar el paquete.

---
**Volver a:** [[07 - ICMPv6|ICMPv6]]

**Continuar a:** [[09 - Direcciones Temporales|Direcciones Temporales]]
