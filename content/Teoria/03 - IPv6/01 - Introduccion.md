---
title: Introducción
---
A apenas 10 años de la implementación de IPv4, los organismos se dieron cuenta de que la cantidad de IPs públicas sería un problema y que se agotarían.

## Agotamiento de IPv4

Las direcciones IPv4 identifican la interfaz de red en todo Internet, y deben ser únicas para que el sistema funcione. Al ser de 32 bits, la cantidad de direcciones posibles es:

$$
IPv4 = 4.294.967.296 \ (= 2^{32})
$$

> [!question] ¿Es esta cantidad de direcciones disponibles totalmente cierta?
> Matemáticamente es totalmente cierta, pero el punto es **cómo se utilizaron**. A priori parecía una cantidad extremadamente alta, pero algunas decisiones de distribución, sumadas al gran crecimiento, causaron que esta cantidad de direcciones no fuera suficiente.

Los routers de Internet son los que analizan el camino a seguir para llegar de una IP de origen a otra de destino (siempre hablando de IP Pública, es decir, de ruteo). IPv4 tiene 32 bits para generar las IPs, pero sobre ese espacio no se ha asignado con efectividad, lo que perjudicó la falta de IPs.

**ICANN** es el organismo que distribuye las IPs públicas en el mundo. Este organismo distribuye las IPs entre los RIRs, y estos a su vez a los ISP (*Internet Service Provider*), y estos a los usuarios finales.

> [!info]- RIR
> **RIR:** Registro Regional de Internet (*Regional Internet Registry*), es una organización que supervisa la asignación y el registro de recursos de números de Internet dentro de una región particular del mundo. Los recursos incluyen direcciones IP (tanto IPv4 como IPv6). Hay 5 RIRs a nivel mundial, cada uno ubicado en una zona geográfica, y cada uno con sus propias políticas de asignación de IPs.

![[mapa-rirs-mundial.png]]

Sobre la [[02 - Organizacion de Internet|Organización de Internet]] ya se desarrolló en detalle el rol de IANA/ICANN, los 5 RIRs (AfriNIC, APNIC, ARIN, LACNIC, RIPE NCC) y los niveles de ISP (Tier1, Tier2, Tier3); esa misma jerarquía es la que reparte también el espacio de direcciones IPv6.

![[jerarquia-isp-tier-1-2-3.png]]

## Agotamiento del espacio IPv4 por RIR

El 3 de febrero de 2011 (hace más de 10 años) la IANA asignó su **último bloque de direcciones IPv4** a los RIRs. Desde ese momento, cada RIR fue agotando su propio remanente:

| RIR | Fecha de últimas IPs |
| --- | --- |
| APNIC | 15 de abril de 2011 |
| RIPE NCC | 14 de septiembre de 2012 |
| ARIN | 23 de abril de 2014 |
| LACNIC | 10 de junio de 2014 |
| AfriNIC | (sin información al momento del libro) |

> [!note] Observaciones de la cátedra
> - Es indudable que las medidas utilizadas para prolongar la vida de IPv4 (CIDR y NAT + RFC 1918, ya vistas en [[08 - Subredes|Subredes]] y [[06 - Direcciones IPv4|Direcciones IPv4 privadas]]) fueron tan buenas que la tasa de sobrevida de IPv4 se extendió más allá de lo esperado.
> - El problema de falta de direcciones se comenzó a tratar recién en 1990, apenas 9 años desde la implementación de IPv4 en 1980.

También contribuyeron a agravar el problema cuestiones como la **mala práctica de asignación** (bloques de Clase A completos entregados a IBM, HP, AT&T, etc. que nunca se usaron efectivamente) y el consecuente **crecimiento descontrolado de las tablas de rutas BGP IPv4**.

## Terminología y configuración

El mecanismo más fácil para configurar un **Host** con IPv6 es usar la autoconfiguración de direcciones sin estado (SLAAC) o el DHCPv6, siempre que exista un router que provea estos mecanismos.

En un **Router**, una dirección unicast global (GUA) IPv6 se configura manualmente utilizando el comando de configuración de la interfaz `ipv6 address ipv6-address/prefix-length`. También dependiendo del router (Cisco, MikroTik, etc.) pueden existir otros parámetros a configurar; en esta materia nos concentramos en los MikroTik (MK).

Un host Windows también puede ser configurado manualmente con una dirección GUA IPv6.

---
**Continuar a:** [[02 - IoT|IoT]]
