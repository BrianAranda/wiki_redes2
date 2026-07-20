---
title: IPv6
fuente: "[[3. IPv6.pdf]]"
---
# Tabla de contenido

## 1. [[01 - Introduccion|Introducción]]
## 2. [[02 - IoT|IoT]]
## 3. [[03 - Solucion IPv6|Solución IPv6]]
## 4. [[04 - Arquitectura Direcciones IPv6|Arquitectura de Direcciones IPv6]]

## 5. [[05 - IPv6 Addressing|IPv6 Addressing]]
## 6. [[06 - Representacion de Direcciones|Representación de Direcciones]]
## 7. [[07 - Prefijos de Direcciones|Prefijos de Direcciones]]
## 8. [[08 - Identificacion de Direcciones|Identificación de Direcciones]]
## 9. [[09 - Unicast|Unicast]]
## 10. [[10 - Anycast|Anycast]]
## 11. [[11 - Multicast FF02|Multicast FF02]]
## 12. [[12 - Resumen de Direcciones IPv6|Resumen de Direcciones IPv6]]

## 13. [[13 - Neighbor Discovery ND|Neighbor Discovery ND]]
## 14. [[14 - Direcciones Dinamicas|Direcciones Dinámicas]]
## 15. [[15 - ICMPv6|ICMPv6]]
## 16. [[16 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]

## 17. [[17 - ping6|ping6]]
## 18. [[18 - Ejemplo de Calculo de Red|Ejemplo de Cálculo de Red]]
## 19. [[19 - Ejemplo de Reglas de Simplificacion|Ejemplo de Reglas de Simplificación]]
## 20. [[20 - Videos|Videos]]
## 21. [[21 - Ejercicios de IPv6|Ejercicios de IPv6]]
## 22. [[22 - Preguntas y Respuestas|Preguntas y Respuestas]]

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
