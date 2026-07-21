---
title: IPv6
fuente: "[[3. IPv6.pdf]]"
---
# Tabla de contenido

## [[01 - Introduccion a IPv6|Introducción a IPv6]]
## [[02 - Cabecera IPv6|Cabecera IPv6]]
## [[03 - Direcciones IPv6|Direcciones IPv6]]

## [[04 - Unicast|Unicast]]
## [[05 - Anycast y Multicast|Anycast y Multicast]]

## [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]
## [[07 - Direcciones Dinamicas|Direcciones Dinámicas]]
## [[08 - ICMPv6|ICMPv6]]
## [[09 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]

## [[10 - Herramientas y Ejemplos Practicos|Herramientas y Ejemplos Prácticos]]
## [[11 - Complementos|Complementos]]

# Preguntas de repaso

1. ¿Por qué se dice que IPv4 se "agotó" mucho antes de lo esperado, y qué medidas (CIDR, NAT) prolongaron su vida útil?
2. Explicar la diferencia entre los tres tipos de direcciones IPv6 (Unicast, Multicast, Anycast) y por qué Broadcast no existe en IPv6.
3. Comparar la cabecera IPv6 con la de IPv4: ¿qué campos se eliminaron, cuáles cambiaron de nombre y por qué se dice que la cabecera IPv6 es más eficiente de procesar?
4. ¿Qué son las Extension Headers y qué reglas cumplen (dónde se ubican, cómo se declaran, quién las procesa)?
5. Explicar la regla "3-1-4" para una dirección Global Unicast Address (GUA) y qué representa cada uno de sus tres campos.
6. ¿Cuáles son los tres ámbitos (scope) de direccionamiento en IPv6 y qué rango de direcciones corresponde a cada uno?
7. Describir el mecanismo EUI-64: ¿qué bits de la MAC se modifican y qué significa el bit U/L?
8. ¿Qué es una dirección Link-Local, quién la debe tener, y por qué un router nunca la reenvía?
9. ¿Cuál es la diferencia entre una dirección ULA (Unique Local Address) y una GUA? ¿Por qué solo `FD00::/8` es una ULA legítima?
10. Explicar cómo se deriva una dirección multicast de nodo solicitado (*solicited-node*) a partir de una dirección unicast.
11. Describir los cuatro mensajes principales de Neighbor Discovery (RS, RA, NS, NA): quién los envía, a quién, y para qué sirve cada uno.
12. ¿Cómo reemplaza Neighbor Discovery al protocolo ARP de IPv4?
13. Explicar la diferencia entre SLAAC, DHCPv6 sin estado y DHCPv6 con estado, y qué combinación de flags (A, O, M) del mensaje RA corresponde a cada método.
14. ¿Qué es el proceso de Duplicate Address Detection (DAD) y qué dirección de origen usa el mensaje NS que lo implementa?
15. ¿Por qué IPv6 no fragmenta en el camino y cómo funciona el mecanismo de Path MTU Discovery (ICMPv6 Packet Too Big)?
16. Describir las tres estrategias de migración de IPv4 a IPv6 (Dual Stack, Tunneling, Traducción/NAT64) y una ventaja o desventaja de cada una.
