---
title: Historia de TCP/IP e IPv4
---
La interconexión de computadores es una idea en desarrollo desde los años 60 con **ARPANET**, un proyecto del Departamento de Defensa Estadounidense ejecutado por la DARPA (Agencia de Proyectos de Investigaciones Avanzadas de Defensa) para conectar diversas instituciones. Los dos primeros nodos de ARPANET estaban en la Universidad de California en Los Ángeles, con **Vinton Cerf** como uno de los responsables.

Paralelamente, la empresa Bolt, Beranek & Newman trabajaba en la arquitectura de hardware de ARPANET, con **Robert Elliot Kahn**. En octubre de 1972, Kahn hizo una demostración conectando 40 computadores, probando que la transmisión de paquetes de datos en red era viable.

> [!info]- Línea de tiempo resumida
> - [**1969**] Primera prueba IP: interconexión entre UCLA y Stanford (costa oeste de EEUU).
> - [**1973**] Cerf y Kahn unen sus trabajos y plantean una nueva generación de ARPANET sobre **4 premisas**. Se apoyan en CYCLADES, una investigación francesa de Louis Pouzin cuyo aporte clave fue poner la entrega de los datos en manos del host, no de la red. 
> - [**1974**] Cerf y Kahn presentan el **Programa de Control de Transmisión (TCP)**. Jonathan Postel sugiere dividirlo en capas, lo que da origen al **TCP/IP**.
> - [**1980-1983**] Primeras implementaciones en sistemas BSD (derivados de UNIX). TCP/IP llega a su versión 4. En 1983 el Departamento de Defensa lo decreta estándar de todas las redes militares.
> - [**1985**] Primera conferencia sobre uso comercial de TCP/IP.
> - [**1986**] La NSF desarrolla NSFNET, la principal red troncal de Internet en EEUU.
> - [**1989-1990**] Tim Berners-Lee crea HTML y la World Wide Web en el CERN.
> - [**Actualidad**]  IPv4 sigue siendo la base de Internet; ante el agotamiento de direcciones se desarrolló **IPv6**, que continúa trabajando sobre las mismas ideas de Cerf y Kahn.

>[!important] Las cuatro premisas 
>Planteadas en 1973 son los pilares arquitectónicos de Internet tal como existe hoy, es la base conceptual de por qué TCP/IP es como es:
> 1. **Interconexión de redes vía puertas de enlace**
> 2. **Descentralización de las redes**
> 3. **Recuperación de errores**
> 4. **Compatibilidad universal entre redes.** 

Cada premisa explica una decisión de diseño:
1. **Interconexión de redes vía puertas de enlace** es el inicio de lo que hoy son los ***routers***. La idea era que redes distintas (con tecnologías físicas distintas) pudieran conectarse entre sí a través de un dispositivo "puente" (*gateway*), sin que cada red tuviera que modificarse internamente para hablar con las demás. Es el concepto de "red de redes" (inter-net).
2. **Descentralización de las redes** implica que, sin un nodo central de control, cada red es autónoma. Si un nodo o una red cae, el resto sigue funcionando.
3. **Recuperación ante errores** incluye que si un paquete se pierde, alguien tiene que reenviarlo. Es la base de la parte confiable de TCP: la corrección de errores se resuelve en los **extremos** de la comunicación, no en la red, es decir, la confiabilidad se delega a la capa de Transporte.
4. **Compatibilidad universal entre redes** pretende ser un protocolo común que funcione sin importar la tecnología subyacente (Ethernet, Wi-Fi, lo que sea). Es la filosofía "IP sobre cualquier cosa".
## Código IPv4

La implementación de referencia del protocolo IPv4 en el kernel de Linux puede consultarse en su código fuente: [Github de Torvald sección TCP para IPv4](https://github.com/torvalds/linux/blob/master/net/ipv4/tcp_ipv4.c)

## Internet vs internet

No es lo mismo **Internet** que **internet**:

> [!important] Distinción entre Internet e internet
> - **Internet** (con "I" mayúscula) es la red mundial que interconecta millones de hosts a lo largo del mundo, comunicándose con el protocolo TCP/IP.
> - **internet** (sin mayúscula) es un conjunto de redes que usa una suite de protocolos común, es un sinónimo de **inter-redes**.

Internet es un caso particular de internet, es decir, Internet con "I" mayúscula incluye a internet con "i" minúscula, pero no viceversa.

---
**Continuar a:** [[02 - Organizacion de Internet|Organización de Internet]]
