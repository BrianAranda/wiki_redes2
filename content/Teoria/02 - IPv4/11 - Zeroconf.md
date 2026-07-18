---
title: Zeroconf
fuente:
  - "[RFC 3927](https://datatracker.ietf.org/doc/html/rfc3927)"
---
**Zeroconf** (*Zero Configuration Networking*) resuelve el caso en que dos equipos quieren armar una red punto a punto (AD HOC), por ejemplo para compartir archivos o Internet, sin que ninguno de los dos actúe de servidor DHCP ni requiera configuración manual del usuario. Se desarrolló entre 1999 y 2003 por el IETF; sus implementaciones más destacadas son ***Bonjour*** y ***Avahi***.

> [!important] Características de Zeroconf
>- Resolución de nombres integrada.
>- Asignación automática de máscara de subred de la IP local y del *router*.
>- Búsqueda de servicios de red disponibles.
>- Asignación automática de direcciones de multidifusión para conexiones multipunto.
>- Mismo nivel de seguridad que las redes sin Zeroconf.

## Soluciones de Zeroconf

Zeroconf no es un protocolo, es un **objetivo**: que una red funcione sin que nadie tenga que configurar nada a mano ni tener un servidor. Para lograr eso hace falta solucionar tres problemas:

1. ¿Cómo consigo una IP sin servidor DHCP?
2. ¿Cómo utilizo nombres sin servidor DNS?
3. ¿Cómo descubro qué servicios hay en la red sin un registro central?

### IPv4LL

Viene para solucionar el primer problema: la IETF definió el **RFC 3927** "*Dynamic Configuration of IPv4 Link-Local Addresses*", abreviado como **IPv4LL**, el cual asigna automáticamente direcciones IP aleatorias con prefijo `169.254/16` (entre `169.254.0.x` y `169.254.255.x`, con las primeras y últimas 256 direcciones reservadas). El generador de números aleatorios considera información propia del equipo (como la MAC) para minimizar colisiones.

> [!important] Cómo funciona IPv4LL
> 1. Se genera la dirección IP.
> 2. Se hacen pruebas [[07 - ARP|ARP]]: se envían 3 paquetes ARP con dirección de origen `0.0.0.0`, preguntando por la dirección generada en el paso 1.
> 3. Si se recibe una respuesta ARP donde el emisor coincide con la IP generada, esa IP ya está en uso y se vuelve al paso 1.
> 4. Si se recibe una prueba ARP externa con la misma dirección, otro dispositivo la está reclamando al mismo tiempo: también se reinicia.
> 5. Si no hay conflicto, el dispositivo reclama la IP como propia y envía dos **ARP *Announcements***.

> [!note] El proceso anterior se repite luego de cada reinicio, activación tras hibernación, conexión del cable Ethernet, o inicio de sesión en la red inalámbrica.

### *Multicast* DNS (mDNS)

Viene a solucionar el segundo problema: describe cómo los dispositivos pueden enviar consultas DNS a direcciones IP de multidifusión. El dominio de nivel superior `.local` se define como enlace local; todas las peticiones que terminan en `.local` se envían a la dirección multidifusión `224.0.0.251` (en IPv6, `FF02::FB`), usando el puerto `5353`. Si la red tiene un servidor DNS declarado, las peticiones que no terminan en `.local` se consultan ahí en su lugar.

### DNS Based Service Discovery (DNS-SD)

Viene a solucionar el tercer problema: es un protocolo ligero de Apple (usado también por impresoras de red y terceros) que define cómo los servicios pueden hacerse visibles y disponibles para todos los participantes de una red Zeroconf. Para garantizar la sintonización, primero deben registrarse en la **IANA**. Podría, en teoría, usarse sobre DNS normal, no es exclusivo de Zeroconf. Consultar [DNS-SD](https://www.dns-sd.org/)

> [!note]- Relación entre DNS-SD y mDNS
>- **DNS-SD** define **qué información** poner en los registros, es una **convención de cómo estructurar** registros DNS para anunciar servicios. 
>- **mDNS** es el **transporte**, define cómo esos registros viajan sin servidor, es decir por multicast, en la red local.
>
>En  Zeroconf específicamente: los mensajes de DNS-SD (el "qué") viajan **sobre** mDNS (el "cómo"), porque no hay servidor DNS real donde publicarlos.

## *Bonjour* y *Avahi*

***Bonjour*** es la solución de Zeroconf más usada, desarrollada por Apple sobre el kernel **XNU** (usado en macOS desde 1996). ***Avahi*** es su alternativa en sistemas Linux (software libre).

> [!important] Características de *Bonjour*
>- **Direccionamiento:** asignación de direcciones IP a *hosts*.
>- **Nombrado:** usar nombres para referirse a hosts en vez de direcciones IP (vía [[11 - Zeroconf#*Multicast* DNS (mDNS)|mDNS]]).
>- **Descubrimiento de servicios:** encontrar servicios en la red automáticamente (vía [[11 - Zeroconf#DNS Based Service Discovery (DNS-SD)|DNS-SD]]).

> [!note] Alcance de *Bonjour*
>  Solo funciona dentro de una **subred única**, sin necesidad de configuración especial de DNS.

Para mas información consultar [Bonjour - Apple Developer](https://developer.apple.com/bonjour/)

--- 
**Volver a:** [[10 - DHCP|DHCP]]

**Continuar a:** [[12 - Diagnostico de Red|Diagnóstico de Red: Ping, ICMP y Traceroute]]