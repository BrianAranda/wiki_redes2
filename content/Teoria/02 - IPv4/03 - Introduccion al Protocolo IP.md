---
title: Introducción al Protocolo IP
fuente:
  - https://www.rfc-es.org/rfc/rfc0791-es.txt
---
El **Protocolo Internet (IP)** es parte del conjunto de protocolos TCP/IP y es el protocolo de interconexión de redes más utilizado. Se examina la versión 4 (IPv4), definida oficialmente en el **RFC 791** (1981). Aunque la intención es que IPv6 lo reemplace, IPv4 sigue siendo el estándar utilizado en las redes TCP/IP.

Como todo protocolo estándar, IP se especifica en dos partes:
1. La **interfaz con la capa superior** especificando los servicios que proporciona.
2. El **formato real del protocolo** y los mecanismos asociados.

![[pila_protocolos.png|600]]

> [!info] RFC 791
> Documento de DARPA con las especificaciones del protocolo IP (1981). Se desarrollaron cuatro versiones diferentes (TCP v1, v2, y una tercera dividida en TCP v3 e IP v3 en 1978) hasta estabilizarse en **TCP/IP v4**, el protocolo estándar que todavía se emplea en Internet.

## Servicios IP

IP brinda dos servicios:

1. Servicio **sin conexión**.
2. **No confiable** (hace el mejor esfuerzo, *best effort*).

> [!note] Unidad de información
> La unidad de información de IP es el **Datagrama**.

### Responsabilidades de IP

- Usar un esquema de direcciones para rutear los datagramas hasta el destino.
- Usar un protocolo complementario para reportar problemas ([[10 - Diagnostico de Red - Ping ICMP y Traceroute|ICMP]]).
- Fragmentar y reensamblar paquetes para adaptarlos al enlace.
- Rutear paquetes desde el origen al destino.

### Elementos que usa IP para brindar el servicio

- **Dirección origen:** dirección global de red de la entidad IP que envía la unidad de datos.
- **Dirección destino:** dirección global de red de la entidad IP de destino.
- **Protocolo:** entidad de protocolo receptor (un usuario IP, como TCP).
- **Indicadores del tipo de servicio:** especifican el tratamiento de la unidad de datos en su transmisión a través de la red.
- **Identificador:** combinado con las direcciones origen/destino y el protocolo usuario, identifica de forma única a la unidad de datos (necesario para reensamblar e informar errores).
- **Indicador de no fragmentación:** indica si IP puede fragmentar los datos.
- **Tiempo de vida:** medido en segundos.
- **Longitud de los datos** transmitidos.
- **Datos de opción** solicitados por el usuario IP.
- **Datos** de usuario a transmitir.

## ¿Cómo funciona?

La pila de protocolos TCP/IP es un software en ejecución (un proceso). El algoritmo general de decisión al recibir un datagrama es:

![[flujo_ip.png|600]]

## Procesamiento de un datagrama IP con *Loopback* y ARP


![[procesamiento_ip.png]]

> [!tip] A tener en cuenta
> - **Loopback:** interfaz virtual que permite que un host se comunique consigo mismo (ver [[08 - Localhost|Localhost]]).
> - **Driver:** el software que maneja la interfaz de red física (por ejemplo, Ethernet) y decide, entre otras cosas, cuándo resolver una dirección con [[06 - ARP|ARP]].

---
**Volver a:** [[02 - Organizacion de Internet|Organización de Internet]]

**Continuar a:** [[04 - Cabecera IP|Cabecera IP]]
