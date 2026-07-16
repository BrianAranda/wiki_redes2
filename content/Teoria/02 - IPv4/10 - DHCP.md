---
title: DHCP
---
**DHCPv4** (Dynamic Host Configuration Protocol v4) asigna direcciones IPv4 y otra información de configuración de red de forma **dinámica**. Normalmente el equipo que cumple este rol es el router/gateway, aunque no tiene por qué serlo.

![[dhcp-cliente-servidor-necesito-puedo.png]]

El servidor DHCPv4 asigna:

1. Dirección IPv4.
2. Máscara de red (Subnet Mask).
3. Puerta de enlace predeterminada (Default Gateway).
4. Servidores [[DNS]] (Domain Name System).
5. Duración del arrendamiento (Lease Time).

> [!info]- Opcionales de DHCPv4
> - **NTP Server** (Opción 42): servidor de hora.
> - **TFTP Server** (Opciones 66 y 150): servidor para descargar configuraciones o firmware.
> - **PXE Boot Server** (Opción 67): para arrancar sistemas operativos por red.
> - **VoIP Server** (Opciones 66 y 150): para teléfonos IP.
> - **Domain Name** (Opción 15): nombre de dominio de la red local.

## Mecanismos de asignación

- **Manual** (para servidores, impresoras, etc.): el administrador asigna una IP preasignada al cliente; DHCP solo comunica esa dirección.
- **Automática:** DHCP asigna automáticamente una IP estática de forma permanente, seleccionada de un conjunto disponible (sin arrendamiento).
- **Dinámica** (la más usada): DHCP arrienda una IP de un conjunto de direcciones por un período limitado, elegido por el servidor o hasta que el cliente ya no la necesite.

El arrendamiento típicamente dura de 24 horas a una semana o más. Al caducar, el cliente solicita otra dirección (generalmente se le reasigna la misma).

## Proceso de arrendamiento (4 pasos)

Cuando el cliente arranca o quiere unirse a una red:

1. **DHCP Discover** (DHCPDISCOVER)
2. **DHCP Offer** (DHCPOFFER)
3. **DHCP Request** (DHCPREQUEST)
4. **DHCP Acknowledgment** (DHCPACK)

![[dhcp-proceso-4-pasos-discover-offer-request-ack.png]]

![[dhcp-resumen-4-pasos-iconos.png]]

### Renovación del arrendamiento (2 pasos)

Antes de que expire el arrendamiento, el cliente inicia un proceso más corto:

1. **DHCP Request** (DHCPREQUEST)
2. **DHCP Acknowledgment** (DHCPACK)

![[dhcp-renovacion-arrendamiento-2-pasos.png]]

## Formato del mensaje DHCP

Los mensajes DHCPv4 están en la capa de **Aplicación** (capa 5) y se envían sobre **UDP** (capa 4): el cliente usa el puerto origen 68 y destino 67; el servidor usa origen 67 y destino 68.

![[dhcp-formato-mensaje-campos.png]]

| Campo | Descripción |
| --- | --- |
| **Código de operación (OP)** | Tipo de mensaje general: 1 = solicitud, 2 = respuesta. |
| **Tipo de hardware** | Tipo de red (1 = Ethernet, 15 = Frame Relay, 20 = línea serial). Mismos códigos que ARP. |
| **Longitud de dirección de hardware** | Longitud de la dirección física. |
| **Saltos** | Controla el reenvío; el cliente lo pone en 0 antes de transmitir. |
| **Identificador de transacción** | Usado por el cliente para emparejar su solicitud con la respuesta del servidor. |
| **Segundos** | Segundos transcurridos desde que el cliente empezó a intentar adquirir/renovar el arrendamiento. |
| **Indicadores** | Bit de difusión: si vale 1, le indica al servidor/relay que la respuesta debe enviarse como broadcast. |
| **Dirección IP del cliente** | La usa el cliente durante la renovación, si ya tiene una IP válida; si no, va en `0.0.0.0`. |
| **Su dirección IP** | La usa el servidor para asignar la IP al cliente. |
| **Dirección IP del servidor** | Identifica al servidor a usar en el próximo paso del proceso "bootstrap" (BOOTP). |
| **Dirección IP del gateway** | Enruta mensajes DHCP cuando intervienen agentes de retransmisión, entre subredes distintas. |
| **Dirección de hardware del cliente** | La capa física del cliente. |
| **Nombre del servidor** | Opcional, apodo o nombre DNS del servidor que envía un Offer o Ack. |
| **Nombre del archivo de arranque** | Opcional, usado en procesos de arranque por red. |
| **Opciones de DHCP** | Longitud variable; parámetros adicionales requeridos para el funcionamiento básico. |

![[dhcp-discover-detalle-trama.png]]

![[dhcp-offer-detalle-trama.png]]

> [!tip] APIPA
> Si un sistema Windows no encuentra un servidor DHCP, inicia **APIPA** (Automatic Private Internet Protocol Addressing): asigna automáticamente una IP privada de clase B en el rango `169.254.0.0/16`, con máscara `255.255.0.0`.

![[calculadora-apipa-169-254-0-0-16.png]]

## ¿En qué capa funciona DHCP?

DHCP opera principalmente en la **capa de Aplicación**, pero gestiona direcciones de capa 3 y usa UDP (capa 4) para transportarse:

- **Capa de Transporte (4):** usa UDP, puertos 67 y 68.
- **Capa de Red (3):** configura direcciones IP.
- **Capa de Enlace de Datos (2):** usa direcciones MAC para la comunicación inicial, antes de obtener una IP.

> [!note] Independencia entre capas
> Este comportamiento de DHCP muestra que **no existe independencia total entre las capas** en el modelo TCP/IP: un protocolo de aplicación termina condicionando el trabajo de capas inferiores.

## Zeroconf

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

### Multicast DNS (mDNS)

Describe cómo los dispositivos pueden enviar consultas DNS a direcciones IP de multidifusión. El dominio de nivel superior `.local` se define como enlace local; todas las peticiones que terminan en `.local` se envían a la dirección multidifusión `224.0.0.251` (en IPv6, `FF02::FB`), usando el puerto `5353`. Si la red tiene un servidor DNS declarado, las peticiones que no terminan en `.local` se consultan ahí en su lugar.

### DNS Based Service Discovery (DNS-SD)

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
**Volver a:** [[09 - Localhost|Localhost]]

**Continuar a:** [[11 - Diagnostico de Red|Diagnóstico de Red: Ping, ICMP y Traceroute]]
