---
title: Introducción a IPv6
fuente:
  - "[RFC 8200](https://datatracker.ietf.org/doc/html/rfc8200)"
---
## Los problemas

### Agotamiento de IPv4

A apenas 10 años de la implementación de IPv4, los organismos se dieron cuenta de que la cantidad de IPs públicas sería un problema y que se agotarían. Las direcciones IPv4 identifican la interfaz de red en todo Internet, y deben ser únicas para que el sistema funcione. Al ser de 32 bits, la cantidad de direcciones posibles es:

$$
\text{Direcciones IPv4} = 2^{32} = 4.294.967.296
$$

> [!question] ¿Es esta cantidad de direcciones disponibles totalmente cierta?
> Matemáticamente es totalmente cierta, pero el punto es **cómo se utilizaron**. A priori parecía una cantidad extremadamente alta, pero algunas decisiones de distribución, sumadas al gran crecimiento, causaron que esta cantidad de direcciones no fuera suficiente.

Los *routers* de Internet son los que analizan el camino a seguir para llegar de una IP de origen a otra de destino (siempre hablando de IP Pública, es decir, de ruteo). IPv4 tiene 32 bits para generar las IPs, pero sobre ese espacio no se ha asignado con efectividad, lo que perjudicó la falta de IPs.

### Agotamiento de IPv4 por RIR

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

## Crecimiento de Internet

En la actualidad, Internet es significativamente distinta a como era en las últimas décadas. Hoy en día, Internet es más que correo electrónico, páginas web y transferencia de archivos entre PC: Internet evoluciona y se está convirtiendo en una **Internet de las cosas**.

![[internet-de-las-cosas.png]]

La Internet de hoy está formada por un **núcleo** (*Core Internet*) de enrutadores y servidores troncales, que incluye millones de nodos en total. El núcleo cambia raras veces y tiene una capacidad extremadamente alta.

La gran mayoría de los nodos de Internet hoy se encuentran en lo que a veces se denomina **Internet marginal o *Fringe*** (nosotros). La Internet marginal incluye todas las computadoras personales, portátiles e infraestructura de red local conectadas a Internet. Esta franja cambia rápidamente y se estima que tiene hasta mil millones de nodos. 

> [!note] Crecimiento de *hosts*
> En 2008 se estimó que Internet tenía aproximadamente 1.400 millones de usuarios habituales, y Google anunció que existían más de un billón de URL únicas en sus índices de búsqueda. El crecimiento de la franja depende del número de usuarios de Internet y de los dispositivos personales que utilizan.

La **Internet de las cosas** (a veces denominada *Fringe*/*Embedded Fringe*) es el mayor desafío y oportunidad para Internet en la actualidad. Se compone de dispositivos integrados habilitados para IP conectados a Internet, incluidos sensores, máquinas, etiquetas de posicionamiento activo, lectores de identificación por radiofrecuencia (RFID) y equipos de automatización de edificios, por nombrar solo algunos.

> [!important] Magnitud del IoT
> El tamaño exacto de Internet de las cosas es difícil de estimar, ya que su crecimiento no depende de los usuarios humanos. Se supone que Internet de las cosas pronto superará al resto de Internet en tamaño (número de nodos) y seguirá creciendo a un ritmo vertiginoso. El tamaño potencial a largo plazo se expresa en **billones de dispositivos**.

El mayor potencial de crecimiento a futuro proviene de redes y dispositivos inalámbricos integrados de bajo consumo de energía que hasta ahora no han sido habilitados para IP: la **Internet integrada inalámbrica**. En 2008, líderes de la industria formaron la IP Smart Objects (IPSO) Alliance para promover el uso de protocolos de Internet por parte de objetos inteligentes y la Internet de las cosas a través del marketing, la educación y la interoperabilidad. La Internet inalámbrica integrada es un subconjunto de la Internet de las cosas.

Para este escenario, IPv4 no podría satisfacer las necesidades.

## La solución: IPv6

Apenas en 1990, antes de que se comenzara a explotar comercialmente Internet, ya un grupo visionario vio el problema en el horizonte y se comenzaron a trabajar alternativas. Estas aparecieron en 1992 cuando el IETF crea el Grupo **ROAD** (ROuting ADdressing) que comienza a estudiar posibles soluciones:

1. El uso de [[08 - Subredes|Subredes]] y [[08 - Subredes#CIDR|CIDR]] para dejar de usar clases. Su introducción permitió una mayor flexibilidad al dividir rangos de direcciones IP en redes separadas. Permitió:
	-  Un uso más eficiente de las cada vez más escasas direcciones IPv4.
	-  Un mayor uso de la jerarquía de direcciones (agregación de prefijos de red), disminuyendo la sobrecarga de los enrutadores principales de Internet para realizar el encaminamiento.
	- Bloques de direcciones de tamaño apropiado a las necesidades y usos.
2. El uso de [[NAT]] y [[10 - DHCP|DHCP]]:
    - NAT +  [[06 - Direcciones IPv4#Redes privadas|Redes privadas]].
	- En el año 1995 se comienza a usar NAT + CIDR, lo que permite usar una única dirección IP pública para toda una red. Sin embargo, el acceso y su implementación resultó **insuficiente** por sí sola para frenar el agotamiento.

> [!important] Extensión del uso de IPv4
> Es indudable que las medidas tomadas fueron tan buenas que la tasa de sobrevida de IPv4 se extendió más allá de lo esperado; el problema de falta de direcciones se comenzó a tratar en 1990, apenas 9 años desde la implementación de IPv4 en 1980.

La solución fue **IPv6**, que directamente cambia el tamaño del campo de direccionamiento de 32 a **128 bits**, llevando el espacio disponible de los ~4.300 millones de IPv4 a un número prácticamente inagotable ($2^{128}$, ver [[02 - Cabecera IPv6#Cantidad de IPs por metro cuadrado|Cantidad de IPs por metro cuadrado]]). Pero no se trata solo de "más direcciones": IPv6 aprovecha la oportunidad para simplificar y modernizar el protocolo, con una cabecera base más liviana y de longitud fija, mecanismos de autoconfiguración incorporados (SLAAC) que evitan la necesidad de un servidor DHCP para que un equipo obtenga una dirección, y un diseño pensado para que el uso de NAT deje de ser necesario, restableciendo la conectividad extremo a extremo que las direcciones privadas de IPv4 habían roto.

Las características mas destacas de IPv6 son:

- **Capacidades de direccionamiento ampliadas**: IPv6 aumenta el tamaño de las direcciones IP de 32 bits a 128 bits, para admitir más niveles de jerarquía de direccionamiento, un número mucho mayor de nodos direccionables y una autoconfiguración más sencilla de las direcciones. 

- **Simplificación del formato de la cabecera**: Se eliminaron o se volvieron opcionales algunos campos de la cabecera IPv4, con el fin de reducir el costo de procesamiento en casos comunes del manejo de paquetes y limitar el costo de ancho de banda de la cabecera IPv6.

- **Mejora en el soporte para extensiones y opciones**: Los cambios en la forma en que se codifican las opciones de la cabecera IP permiten un reenvío más eficiente, límites menos estrictos en la longitud de las opciones y mayor flexibilidad para introducir nuevas opciones en el futuro.

- **Capacidad de etiquetado de flujos**: Se agrega una nueva capacidad para permitir el etiquetado de secuencias de paquetes que el remitente solicita que se traten en la red como un solo flujo.

 - **Capacidades de autenticación y privacidad**: Se especifican extensiones para IPv6 que admiten la autenticación, la integridad de los datos y (opcionalmente) la confidencialidad de los datos.

Por otro lado se tiene:

- Mecanismos de IPsec incorporados.
- Fragmentación solo en origen y re-ensamblado en destino.
- No requiere el uso de NAT, permitiendo conexiones punto a punto.
- Posee mecanismos que facilitan la configuración de las redes (SLAAC/autoconfiguración).

>[!note] IPsec 
>*Internet Protocol security* es un conjunto de protocolos cuya función es asegurar las comunicaciones sobre el Protocolo de Internet (IP) autenticando y/o cifrando cada paquete IP en un flujo de datos. Incluye protocolos para el establecimiento de claves de cifrado.

> [!note] Adopción de IPv6
> Google mide en tiempo real, a nivel mundial y por país, el porcentaje de usuarios que acceden a sus servicios sobre IPv6 (Visitar [Adopción IPv6](https://www.google.com/intl/en/ipv6/statistics.html)). Al momento de redactar esto la adopción global es del 50,91% y específicamente en Argentina del 28,89%.
>

 >[!note] Teredo 
 >Es una tecnología de transición que provee conectividad IPv6 a *hosts* que soportan IPv6 pero que se encuentran conectados a Internet mediante una red IPv4 (ver [[09 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]).

---
**Continuar a:** [[02 - Cabecera IPv6|Arquitectura de Direcciones IPv6]]
