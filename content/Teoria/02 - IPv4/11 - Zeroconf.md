---
title: Zeroconf
---
**Zeroconf** (Zero Configuration Networking) resuelve el caso en que dos equipos quieren armar una red punto a punto (ad hoc) — por ejemplo para compartir archivos o Internet — sin que ninguno de los dos actúe de servidor DHCP ni requiera configuración manual del usuario. Se desarrolló entre 1999 y 2003 por el IETF; sus implementaciones más destacadas son **Bonjour** y **Avahi**.

**Características:**
- Resolución de nombres integrada.
- Asignación automática de máscara de subred de la IP local y del router.
- Búsqueda de servicios de red disponibles.
- Asignación automática de direcciones de multidifusión para conexiones multipunto.
- Mismo nivel de seguridad que las redes sin Zeroconf.

El IETF definió el **RFC 3927** ("Dynamic Configuration of IPv4 Link-Local Addresses", **IPv4LL**): asigna automáticamente direcciones IP aleatorias con prefijo `169.254/16` (entre `169.254.0.x` y `169.254.255.x`, con las primeras y últimas 256 direcciones reservadas). El generador de números aleatorios considera información propia del equipo (como la MAC) para minimizar colisiones.

> [!important] Cómo funciona IPv4LL
> 1. Se genera la dirección IP.
> 2. Se hacen pruebas **ARP**: se envían 3 paquetes ARP con dirección de origen `0.0.0.0`, preguntando por la dirección a comprobar.
> 3. Si se recibe una respuesta ARP donde el emisor coincide con la IP generada, esa IP ya está en uso: se reinicia el proceso.
> 4. Si se recibe una prueba ARP externa con la misma dirección, otro dispositivo la está reclamando al mismo tiempo: también se reinicia.
> 5. Si no hay conflicto, el dispositivo reclama la IP como propia y envía dos **ARP Announcements**.
>
> Este proceso se repite luego de cada reinicio, activación tras hibernación, conexión del cable Ethernet, o inicio de sesión en la red inalámbrica.

## Multicast DNS (mDNS)

Describe cómo los dispositivos pueden enviar consultas DNS a direcciones IP de multidifusión. El dominio de nivel superior `.local` se define como enlace local; todas las peticiones que terminan en `.local` se envían a la dirección multidifusión `224.0.0.251` (en IPv6, `FF02::FB`), usando el puerto `5353`. Si la red tiene un servidor DNS declarado, las peticiones que no terminan en `.local` se consultan ahí en su lugar.

## DNS Based Service Discovery (DNS-SD)

Protocolo ligero de Apple (usado también por impresoras de red y terceros) que define cómo los servicios pueden hacerse visibles y disponibles para todos los participantes de una red Zeroconf. Para garantizar la sintonización, primero deben registrarse en la **IANA**.

## Bonjour y Avahi

**Bonjour** es la solución de Zeroconf más usada, desarrollada por Apple sobre el kernel **XNU** (usado en macOS desde 1996). **Avahi** es su alternativa en sistemas Linux (software libre).

Características de Bonjour:
- **Direccionamiento:** asignación de direcciones IP a hosts.
- **Nombrado:** usar nombres para referirse a hosts en vez de direcciones IP (vía mDNS).
- **Descubrimiento de servicios:** encontrar servicios en la red automáticamente (vía DNS-SD).

> [!note] Alcance
> Bonjour solo funciona dentro de una **subred única**, sin necesidad de configuración especial de DNS.


--- 
**Volver a:** [[10 - DHCP|DHCP]]

**Continuar a:** [[12 - Diagnostico de Red|Diagnóstico de Red: Ping, ICMP y Traceroute]]