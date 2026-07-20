---
title: Introducción a IPv6
---
A apenas 10 años de la implementación de IPv4, los organismos se dieron cuenta de que la cantidad de IPs públicas sería un problema y que se agotarían.

## Introducción

### Agotamiento de IPv4

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

### Agotamiento del espacio IPv4 por RIR

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

### Terminología y configuración

El mecanismo más fácil para configurar un **Host** con IPv6 es usar la autoconfiguración de direcciones sin estado (SLAAC) o el DHCPv6, siempre que exista un router que provea estos mecanismos.

En un **Router**, una dirección unicast global (GUA) IPv6 se configura manualmente utilizando el comando de configuración de la interfaz `ipv6 address ipv6-address/prefix-length`. También dependiendo del router (Cisco, MikroTik, etc.) pueden existir otros parámetros a configurar; en esta materia nos concentramos en los MikroTik (MK).

Un host Windows también puede ser configurado manualmente con una dirección GUA IPv6.

## IoT

En la actualidad, Internet es significativamente distinta a como era en las últimas décadas. Hoy en día, Internet es más que correo electrónico, páginas web y transferencia de archivos entre PC: Internet evoluciona y se está convirtiendo en una **Internet de las cosas**.

![[internet-de-las-cosas.png]]

La Internet de hoy está formada por un **núcleo** (*Core Internet*) de enrutadores y servidores troncales, que incluye millones de nodos en total. El núcleo cambia raras veces y tiene una capacidad extremadamente alta.

La gran mayoría de los nodos de Internet hoy se encuentran en lo que a veces se denomina **Internet marginal o Fringe** (nosotros). La Internet marginal incluye todas las computadoras personales, portátiles e infraestructura de red local conectadas a Internet. Esta franja cambia rápidamente y se estima que tiene hasta mil millones de nodos. En 2008 se estimó que Internet tenía aproximadamente 1.400 millones de usuarios habituales, y Google anunció que existían más de un billón de URL únicas en sus índices de búsqueda. El crecimiento de la franja depende del número de usuarios de Internet y de los dispositivos personales que utilizan.

La **Internet de las cosas** (a veces denominada Fringe/Embedded Fringe) es el mayor desafío y oportunidad para Internet en la actualidad. Se compone de dispositivos integrados habilitados para IP conectados a Internet, incluidos sensores, máquinas, etiquetas de posicionamiento activo, lectores de identificación por radiofrecuencia (RFID) y equipos de automatización de edificios, por nombrar solo algunos.

> [!important] Magnitud del IoT
> El tamaño exacto de Internet de las cosas es difícil de estimar, ya que su crecimiento no depende de los usuarios humanos. Se supone que Internet de las cosas pronto superará al resto de Internet en tamaño (número de nodos) y seguirá creciendo a un ritmo vertiginoso. El tamaño potencial a largo plazo se expresa en **billones de dispositivos**.

El mayor potencial de crecimiento a futuro proviene de redes y dispositivos inalámbricos integrados de bajo consumo de energía que hasta ahora no han sido habilitados para IP: la **Internet integrada inalámbrica**. En 2008, líderes de la industria formaron la IP Smart Objects (IPSO) Alliance para promover el uso de protocolos de Internet por parte de objetos inteligentes y la Internet de las cosas a través del marketing, la educación y la interoperabilidad. La Internet inalámbrica integrada es un subconjunto de la Internet de las cosas.

Para este escenario, IPv4 no podría satisfacer las necesidades → **Solución: IPv6**.

> [!note] Adopción de IPv6
> Google mide en tiempo real, a nivel mundial y por país, el porcentaje de usuarios que acceden a sus servicios sobre IPv6 (`https://www.google.com/intl/en/ipv6/statistics.html`). Al momento del libro, la adopción global venía en crecimiento sostenido desde 2016, y Argentina se ubicaba en torno al 15% de adopción.
>
> **Teredo** es una tecnología de transición que provee conectividad IPv6 a hosts que soportan IPv6 pero que se encuentran conectados a Internet mediante una red IPv4 (ver [[09 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]).

## Solución IPv6

Apenas en 1990, antes de que se comenzara a explotar comercialmente Internet, ya un grupo visionario vio el problema en el horizonte y se comenzaron a trabajar alternativas. Estas aparecieron en 1992.

1. En 1992 el IETF crea el Grupo **ROAD** (ROuting ADdressing) que comienza a estudiar posibles soluciones.
2. ✅ **CIDR** (RFC 4632): dejar de usar clases. *Classless Inter-Domain Routing* se introdujo en 1993 por el IETF y representa la última mejora. Su introducción permitió una mayor flexibilidad al dividir rangos de direcciones IP en redes separadas. De esta manera permitió:
   - Un uso más eficiente de las cada vez más escasas direcciones IPv4.
   - Un mayor uso de la jerarquía de direcciones (agregación de prefijos de red), disminuyendo la sobrecarga de los enrutadores principales de Internet para realizar el encaminamiento.
   - Bloques de direcciones de tamaño apropiado a las necesidades y usos.
   - Dirección de red = prefijo/longitud.
3. ✅ Agregación de rutas + DHCP:
   - NAT + RFC 1918 (ver [[06 - Direcciones IPv4#Redes privadas|Redes privadas]]).
   - En el año 1995 se comienza a usar NAT + CIDR, lo que permite usar una única dirección IP pública para toda una red. Sin embargo, el acceso y su implementación resultó **insuficiente** por sí sola para frenar el agotamiento.

> [!note] Observación de la cátedra
> Es indudable que las medidas de los puntos 2 y 3 fueron tan buenas que la tasa de sobrevida de IPv4 se extendió más allá de lo esperado; el problema de falta de direcciones se comenzó a tratar en 1990, apenas 9 años desde la implementación de IPv4 en 1980.

### Terminología

Se utiliza la siguiente terminología a lo largo de toda la unidad:

- **Router**: nodo que reenvía paquetes IP que no son para él mismo.
- **Host**: cualquier nodo que no es router.
- **Nodo**: dispositivo que implementa IP (router o host).
- **Enlace** (*link*): medio o facilidad que comunica a los nodos.
- **Interfase**: lo que usa el nodo para conectarse al enlace.

---
**Continuar a:** [[02 - Arquitectura de Direcciones IPv6|Arquitectura de Direcciones IPv6]]
