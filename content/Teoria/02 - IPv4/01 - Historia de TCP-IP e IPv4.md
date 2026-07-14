---
title: Historia de TCP/IP e IPv4
---
La interconexión de computadores es una idea en desarrollo desde los años 60 con **ARPANET**, un proyecto del Departamento de Defensa Estadounidense ejecutado por la DARPA (Agencia de Proyectos de Investigaciones Avanzadas de Defensa) para conectar diversas instituciones. Los dos primeros nodos de ARPANET estaban en la Universidad de California en Los Ángeles, con **Vinton Cerf** como uno de los responsables.

Paralelamente, la empresa Bolt, Beranek & Newman trabajaba en la arquitectura de hardware de ARPANET, con **Robert Elliot Kahn**. En octubre de 1972, Kahn hizo una demostración conectando 40 computadores, probando que la transmisión de paquetes de datos en red era viable.

> [!important] Línea de tiempo clave
> - **1969** — Primera prueba IP: interconexión entre UCLA y Stanford (costa oeste de EEUU).
> - **1973** — Cerf y Kahn unen sus trabajos y plantean una nueva generación de ARPANET sobre 4 premisas: interconexión de redes vía puertas de enlace, descentralización de las redes, recuperación ante errores y compatibilidad universal entre redes. Se apoyan en **CYCLADES**, una investigación francesa de Louis Pouzin cuyo aporte clave fue poner la entrega de los datos en manos del host, no de la red.
> - **1974** — Cerf y Kahn presentan el **Programa de Control de Transmisión (TCP)**. Jonathan Postel sugiere dividirlo en capas, lo que da origen al **TCP/IP**.
> - **1980-1983** — Primeras implementaciones en sistemas BSD (derivados de UNIX). TCP/IP llega a su versión 4. En 1983 el Departamento de Defensa lo decreta estándar de todas las redes militares.
> - **1985** — Primera conferencia sobre uso comercial de TCP/IP.
> - **1986** — La NSF desarrolla NSFNET, la principal red troncal de Internet en EEUU.
> - **1989-1990** — Tim Berners-Lee crea HTML y la World Wide Web en el CERN.
> - **Actualidad** — IPv4 sigue siendo la base de Internet; ante el agotamiento de direcciones se desarrolló **IPv6**, que continúa trabajando sobre las mismas ideas de Cerf y Kahn.

## Código IPv4

La implementación de referencia del protocolo IPv4 en el kernel de Linux puede consultarse en su código fuente (`net/ipv4/tcp_ipv4.c`).

## Internet vs. internet

No es lo mismo **Internet** que **internet**:

> [!note] Distinción de términos
> - **Internet** (con "I" mayúscula): la red mundial que interconecta millones de hosts a lo largo del mundo, comunicándose con el protocolo TCP/IP.
> - **internet** (sin mayúscula): un conjunto de redes que usa una suite de protocolos común; es sinónimo de **inter-redes**.
>
> Internet es un caso particular de internet: el término Internet incluye a internet, pero no a la inversa.

---
**Continuar a:** [[02 - Organizacion de Internet|Organización de Internet]]
