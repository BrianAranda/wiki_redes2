---
title: Direcciones Dinámicas
---
> [!note] Relación con Neighbor Discovery
> La obtención de direcciones de capa 3, y la relación de direcciones de capa 3 con capa 2 (MAC), están relacionadas; es por eso que este tema de "Direcciones Dinámicas" y "[[06 - Neighbor Discovery ND|Neighbor Discovery ND]]", el tema anterior, están íntimamente relacionados.

En esta sección veremos las formas en las que un dispositivo con IPv6 puede obtener de manera dinámica la dirección global unicast. Ellas son:

- **Método 1:** Stateless Address Autoconfiguration (SLAAC).
- **Método 2:** SLAAC and a stateless DHCPv6 server.
- **Método 3:** Stateful DHCPv6 server.

![[asignacion-dinamica-gua-stateless-stateful.png]]

## ¿Cuál usa el cliente para la auto configuración?

La decisión de cómo un cliente obtendrá un GUA IPv6 depende de la configuración dentro del mensaje RA.

Un mensaje de RA ICMPv6 incluye **tres flags** para identificar las opciones dinámicas disponibles para un host, como se indica a continuación:

- **flag A:** este es el indicador de configuración automática de direcciones (*Autoconfiguration*). Usa Stateless Address Autoconfiguration (SLAAC) para crear un GUA de IPv6.
- **flag O:** este es otro indicador de configuración (*Other Configuration*). Otra información está disponible desde un servidor DHCPv6 stateless.
- **flag M:** esta es la indicador de configuración de la dirección administrada (*Managed Address*). Usa un servidor DHCPv6 con estado/stateful para obtener una GUA IPv6.

Mediante diferentes combinaciones de los flags A, O y M, los mensajes RA informan al host sobre las opciones dinámicas disponibles:

| Opción de RA | Combinación de flags |
| --- | --- |
| SLAAC solo (predeterminado) | A flag=1, O flag=0, M flag=0 |
| DHCP stateless: SLAAC y DHCPv6 | A flag=1, O flag=1, M flag=0 |
| DHCPv6 stateful: DHCPv6 solamente | A flag=0, M flag=1 |

## ¿Cuándo se usa uno u otro?

SLAAC es a menudo suficiente para redes domésticas o pequeñas oficinas donde la configuración básica de red es todo lo que se necesita. Es simple y no requiere un servidor adicional.

DHCPv6 es preferido en entornos empresariales o redes más grandes donde se necesita un control más granular sobre la configuración de red y la gestión del espacio de direcciones IP.

Recordemos que un host necesita de:
1. Prefijo de Red.
2. Longitud del Prefijo de red.
3. Dirección del Gateway.
4. Direcciones de Servidores DNS.
5. MAC de Gateway.

Para poder utilizar Internet, estos elementos son los que deberían proveer los métodos de asignación de direcciones dinámicas.

A modo de anticipo, en estas autoconfiguraciones se intercambian los siguientes mensajes:

| Mensaje | Origen → Destino |
| --- | --- |
| Mensaje de Solicitud (RA) | De Router a Dispositivos |
| Mensaje de solicitud de Router (RS) | De Dispositivos a Routers |

## 14.1. SLAAC

### Servicio sin estado - Stateless Address Autoconfiguration (SLAAC)

Este tipo de configuración es el que usamos en la práctica de Laboratorio IPv6.

No todas las redes tienen acceso a un servidor DHCPv6. Pero todos los dispositivos de una red IPv6 necesitan un GUA. El método SLAAC permite a los hosts crear su propia dirección unicast global IPv6 sin los servicios de un servidor DHCPv6.

SLAAC es un servicio **stateless** (sin estado). Esto significa que no hay ningún servidor que mantenga información de direcciones de red para saber qué direcciones IPv6 se están utilizando y cuáles están disponibles.

SLAAC utiliza mensajes ICMPv6 RA para proporcionar direccionamiento y otra información de configuración que normalmente proporcionaría un servidor DHCP. Un host configura su dirección IPv6 en función de la información que se envía en el RA. Los mensajes RA son enviados por un router IPv6 cada 200 segundos. Un host también puede enviar un mensaje Router Solicitation (RS) solicitando que un router habilitado para IPv6 envíe al host un RA.

SLAAC se puede implementar como SLAAC solamente, o SLAAC con DHCPv6.

Con esta modalidad de asignación o de adquisición dinámica de dirección IPv6, el dispositivo usa la información que recibe en un mensaje RA (Router Advertisement) que incluye el prefijo de red y puede crear su propia dirección global de unicast.

Un equipo solo debería esperar este mensaje RA para obtener la parte de la dirección global que desconoce:

**Method 1: SLAAC**

**IPv6 Header**
To: ff02::1 (All-IPv6 Devices)
From: fe80::1 (Link-local Address)

**ICMPv6 Router Advertisement**
Prefix: 2001:db8:cafe1::
Prefix-length: /64
Flags: A = 1, O = 0, M = 0
Other Options: DNS Server Address

Lógicamente el Router R1 DEBE ser configurado como Router IPv6 para que envíe estos mensajes de RA. Para ello se debe habilitar el *Advertisment* en la interfaz que corresponda del MK.

SLAAC en principio no reemplaza completamente a un servidor DHCP, pero puede funcionar de manera similar bajo ciertas circunstancias gracias a que SLAAC puede incluir en los RA los DNS, que sería lo único que le faltaría saber a un host para poder navegar en Internet.

En RouterOS (MikroTik), la opción "Advertise" en el contexto de los Router Advertisements en IPv6 hace que el router emita (o mejor dicho, envíe) RA cada 200 segundos ⇒ SLAAC.

**Paso 1**

El mensaje de RA tiene como dirección de origen unicast LLA Link Local Address `FE80::1/10` y como destino una multicast Link Local All Nodes `FF02::1`.

La dirección de enlace local se configuró manualmente en R1, y es la dirección que los dispositivos receptores pueden usar para su configuración predeterminada de Gateway.

Se puede ver que se incluye el prefijo de dirección global y la longitud del prefijo en el mensaje de RA.

El mensaje de RA puede de manera opcional incluir el servidor de DNS.

> [!info]- Flags del RA
> 1. **A (de Address):** indicador de configuración automática de dirección, cuando se establece en 1 (activado), este indicador le indica al host receptor que utilice SLAAC para crear su dirección de unidifusión global.
> 2. **O (de Other):** cuando se establece en 1 (activado), este indicador le indica al host que obtenga otra información de dirección, distinta de su dirección de unidifusión global, de un sistema sin estado Servidor DHCPv6.
> 3. **M (de Managed):** cuando se establece en 1 (activado), este indicador le indica al host que utilice un servidor DHCPv6 con estado para su dirección de unidifusión global y todos los demás abordar la información.

**RA Resumen**
**Router → WinPC**
Capa 3 IP Origen: `fe80::1` (Unicast Link Local)
Capa 3 IP Destino: `FF02::1` (Multicast, todos los nodos)
Capa 2 Origen: `58:ac:78:93:da:00`
Capa 2 Destino: `33:33:0:0:0:1`
En campo datos: Prefijo de red `2001:db8:cafe:1::`, Longitud de prefijo `/64`, Flag `A=1`, DNSs.

**Paso 2: WinPC procesa lo recibido**

El equipo recibe el RA desde `FE80::1` y lo toma como Default Gateway; el flag A le indica al equipo que puede usar la información para crear su global unicast address GUA, también obtiene la MAC del Gateway.

**Paso 3**

Este método SLAAC, WinPC a partir de los datos recibidos genera dos direcciones de unicast, una global pública y otra global temporal.

La parte de IPv6 que corresponde a la interfase de red se genera de manera automática usando [[04 - Unicast#EUI-64|EUI-64]] o de manera aleatoria dependiendo de la configuración del Sistema Operativo.

> [!important] Relación entre SLAAC y RA
> Notar que este mensaje de RA usado en SLAAC da la posibilidad de que los equipos reciban los DNSs que de por sí SLAAC no los proveería. Esto se realiza en nuestro laboratorio de IPv6 al configurar el ND del MK de nivel 2 (agregando los servidores DNS a la configuración de ND del router, además del prefijo de red).

## 14.2. DHCPv6 sin estado + SLAAC (Informativo)

Esta forma de asignación dinámica de IPv6 se trata en [RFC 3736](https://www.rfc-editor.org/rfc/rfc3736).

En las prácticas de Laboratorio NO se usa la configuración DHCPv6, por eso este capítulo es informativo.

Este proceso se conoce como DHCPv6 stateless/sin estado, debido a que el servidor **no mantiene información** o registro del estado del cliente (es decir, una lista de direcciones IPv6 asignadas y disponibles).

El servidor de DHCPv6 stateless **solo proporciona parámetros de configuración para los clientes, no direcciones IPv6**, si proporciona por ejemplo dirección IPv6 del Servidor DNS.

> [!note] Nota
> Si bien DHCPv6 es similar a DHCPv4 en cuanto a lo que proporciona, los dos protocolos son independientes respecto sí.

Los pasos son los siguientes:

1. El host envía un mensaje RS.
2. El router responde con un mensaje RA.
3. En este punto el host analiza del RA los flags A, O y M, que le indican si usa SLAAC para su auto configuración.
4. Verifica que la IPv6 no esté duplicada.
5. El host envía un mensaje DHCPv6 SOLICIT.
6. El servidor DHCPv6 responde con un mensaje ADVERTISE.
7. El host responde al servidor DHCPv6.
8. El servidor DHCPv6 envía un mensaje REPLY.

Veamos un caso en que WinPC vía un RS, paso a paso:

![[secuencia-dhcpv6-sin-estado.png]]

**Paso 1:** el equipo envía un RS (Router Solicitation) si no recibe un RA antes.

**Paso 2:** el mensaje RA con el flag A=1, sugiere que el host use SLAAC. El flag O=1 sugiere que también se puede disponer de la configuración usando DHCPv6 sin estado. El flag M=0, es su estado de default, indicando que el servicio DHCPv6 con estado NO es necesario.

**Paso 3:** forma su dirección según SLAAC y determina su GW. Por defecto se generan dos direcciones, una pública y otra temporal (random).

**Paso 4:** el equipo realiza la verificación de dirección duplicada DAD sobre la dirección de Unicast (GUA o LLA); si no recibe respuesta, asume que es única.

**Paso 5:** el flag O=1 indica que se puede conseguir información adicional en un DHCPv6 sin estado, entonces envía un mensaje de Multicast de nodo solicitado `FF02::1:2`.

**Paso 6:** algún servidor de DHCPv6 responde al mensaje del punto 5, indicando que él tiene servicio disponible.

**Paso 7:** el equipo responde consultando por la información de configuración que le falta.

**Paso 8:** el DHCPv6 responde con la información de configuración que falta.

## 14.3. DHCPv6 con estado

Esta opción es la más similar al DHCP que estudiamos en redes IPv4 (ver [[10 - DHCP|DHCP]]).

En este caso, el mensaje RA informa al cliente que no debe usar la información de su mensaje y toda la información de direccionamiento IPv6 y los parámetros de configuración adicionales deben obtenerse de un servidor DHCPv6 con estado.

Se define con este nombre porque el servidor DHCPv6 **mantiene la información** de estado de IPv6 (lista de direcciones IPv6 asignadas, por ejemplo).

![[secuencia-dhcpv6-con-estado.png]]

**Paso 1:** el equipo envía un RS (Router Solicitation) solicitando un RA.

**Paso 2:** el router responde con RA y M=1. Sugiriendo que hay un servidor de DHCPv6 con estado. El flag A=0 indicando que no existe SLAAC.

**Paso 3:** luego que el equipo recibe el RA con M=1 que le indica que hay un DHCPv6 Server con estado, el equipo envía una solicitud, usando como dirección de destino `FE80::1` Default Gateway, ya que A=0.

**Paso 4:** como el mensaje RA con M=1, envía una solicitud al servicio de DHCP.

**Paso 5:** algún servidor de DHCP responde indicando que está disponible.

**Paso 6:** el equipo solicita la dirección y otras informaciones para su configuración.

**Paso 7:** el servidor de DHCP responde con un mensaje que contiene la dirección de unicast global y las otras informaciones de configuración.

**Paso 8:** el equipo lanza el proceso de DAD (detección de dirección duplicada).

## 14.4. Duplicate Address Detection (DAD)

El proceso permite al host crear una dirección IPv6. Sin embargo, no hay garantía de que la dirección sea única en la red. Ya que SLAAC es stateless (sin estado); por lo tanto, un host tiene la opción de verificar que una dirección IPv6 recién creada sea única antes de que pueda usarse. Un host utiliza el proceso de detección de direcciones duplicadas (DAD) para asegurarse de que IPv6 GUA es único.

Con algunas excepciones, el [RFC 4861](https://www.rfc-editor.org/rfc/rfc4861) recomienda que DAD se realice en cada dirección de unidifusión, enlace local o global, antes de asignarlo a una interfaz, independientemente de si fue asignado mediante SLAAC, DHCPv6 o configuración manual.

Hay algunas excepciones a este comportamiento, como se analiza en RFC 4429, "Detección optimista de direcciones duplicadas (DAD) para IPv6".

Este proceso se realiza en 4 pasos, no vamos a entrar en detalle en esta materia.

![[duplicate-address-detection-dad.png]]

> [!info]- Referencia
> Para más detalles ver página 402 del libro: *"IPv6 Fundamentals: A Straightforward Approach to Understanding IPv6"*, Second Edition, autor Rick Graziani.

Podemos ver en la figura que WinPC envía un NS, en el que como IP de origen usa la Unspecified Address; recordemos que la dirección `0:0:0:0:0:0:0:0` se conoce como Dirección No específica (ver [[04 - Unicast#UA - Unspecified Address|UA Unspecified Address]]). Indica la ausencia de dirección, y se usa durante el proceso de inicialización de IPv6 en el campo de IP de Origen cuando el nodo no tiene IP. Como dirección de Destino, pone una dirección del Grupo multicast de todos los nodos solicitados `FF02::1`; los paquetes que se envían a este grupo son recibidos y procesados por todas las interfaces IPv6 en el enlace o en la red. Esto tiene el mismo efecto que una dirección de broadcast en IPv4.

Si ningún otro dispositivo responde con un mensaje NA en un tiempo determinado, prácticamente se garantiza que la dirección es única y puede ser utilizada por la WinPC. Si un mensaje NA es recibido por el host, la dirección no es única, y el sistema operativo debe determinar una nueva ID de interfaz para utilizar.

## 14.5. Autoconfiguración IPv6 en RouterOS

La implementación de IPv6 sobre RouterOS nos brinda las siguientes posibilidades:

- SLAAC Autoconfiguración sin estado.
- DHCP Server (sólo trabajando como DHCP-PD).

Primero debemos configurar las direcciones de IPv6 para configurar de manera completa una interfaz. Datos necesarios: `ipv6 address: 3000:1234:5678:9abc`, prefix: `/64`, indicar `eui-64=yes` (menú **IP → IPv6 → Addresses**, se puede ver que la parte de IPv6 de la interfaz se genera por EUI-64: `5054:ff:fed2:5cf`).

Luego podemos usar tres métodos para usar en MK para la configuración:
1. Asignación de dirección estática, configuración manual (no lo veremos).
2. Autoconfiguración sin estado (Stateless) usando mensajes ND y DAD (RS / RA / NS / NA).
3. Autoconfiguración con servidor (Stateful) usando DHCPv6.

Veremos cómo implementar la opción 2.

### SLAAC - Autoconfiguración sin estado

Los routers envían anuncios periódicos (Router Advertisements, RAs) que incluyen el prefijo de red. Los dispositivos cliente utilizan esta información para generar sus propias direcciones IP usando el prefijo de red proporcionado y su propia identificación generada localmente (usualmente basada en la dirección MAC).

SLAAC principalmente configura la dirección IP del dispositivo. Los Router Advertisements también pueden proporcionar otra información de configuración de red, como la dirección del gateway por defecto y los servidores DNS si se configura para hacerlo.

- Se realiza utilizando mensajes ND, precisamente RS y RA.
- Los routers publican periódicamente o mediante una solicitud el prefijo `/64` de la interfaz correspondiente. Esta publicación se hace con el mensaje RA.
- De modo que los dispositivos que se conecten con ese router pueden configurarse solo una IPv6 y demás parámetros.

Para configurar esta opción debemos proveer los siguientes elementos, para nuestro ejemplo:

`ipv6 address: 3000:1234:5678:9abcd`, `prefix: /64`, `advertise=yes`

En RouterOS, la opción "advertise" en el contexto de los Router Advertisements en IPv6 no reemplaza completamente a un servidor DHCP, pero puede funcionar de manera similar bajo ciertas circunstancias gracias a SLAAC.

**Autoconfiguración por ND.** Esta es la usada en la práctica de IPv6. La IPv6 Unicast global es provista por el administrador de la Facultad, así que difiere de las IPs anteriores.

En los routers de Nivel 2, que serán los que provean lo necesario a los equipos, se configura de la siguiente forma: se crea una dirección estática (por lo que hay que desmarcar la opción EUI64), se marca la opción **Advertise**, para que los host que se conecten a este router puedan obtener los datos mediante ND. A los hosts no se les impondrá una dirección IP, solo se les proveerá, entre otras cosas, del prefijo. Por ello no hace falta un servidor DHCPv6. Cada host deberá generar el identificador de interfaz de la dirección IP que le corresponde para completar la IPv6 unicast global. Esto lo podrá realizar por EUI-64 o de forma aleatoria. Este proceso se conoce como SLAAC (*Stateless Address AutoConfiguration*).

Los routers anuncian el prefijo, la longitud del prefijo, el GW y los DNS utilizando el mecanismo de "Neighbor Discovery" (ND). Por defecto ya se crea un servicio de ND, solo faltaría agregar los DNS que queramos (por ejemplo `2001:4860:4860::8844` y `2001:4860:4860::8888`).

### DHCP-PD (informativo)

En MikroTik y en el contexto de DHCPv6, las siglas PD significan *Prefix Delegation*. DHCPv6 que permite asignar no solo una dirección IPv6 a un dispositivo o cliente, sino un **prefijo completo**, es decir, un bloque de direcciones IPv6. Este prefijo puede ser utilizado por el cliente para distribuir las direcciones IPv6 entre otros dispositivos en su red local.

En resumen:
- **DHCPv6:** protocolo que asigna una dirección IPv6.
- **PD (Prefix Delegation):** permite asignar un prefijo completo (un rango de direcciones) a un cliente, para que este pueda distribuirlo a otros dispositivos.

1. **Rol del ISP (Proveedor de servicios de Internet):** en un entorno típico de DHCPv6-PD, el ISP juega un papel importante. El ISP tiene un bloque grande de direcciones IPv6 asignado a través de su proveedor de direcciones (RIR – Regional Internet Registry). Este bloque es conocido como el bloque de asignación del ISP (ISP Allocation).
2. **Asignación al router del cliente:** el router del cliente (también conocido como CPE – Customer Premises Equipment) se conecta a la red del ISP y tiene una interfaz externa que obtiene una dirección IPv6 mediante DHCPv6 de la infraestructura del ISP.
3. **Solicitud de prefijo:** una vez que el router del cliente ha obtenido su dirección IPv6, envía una solicitud de prefijo (PD) al servidor DHCPv6 del ISP. En esta solicitud, el router del cliente solicita una porción del bloque de asignación del ISP para su propia red.
4. **Asignación de prefijo:** el servidor DHCPv6 del ISP, al recibir la solicitud de prefijo, evalúa su bloque de asignación y asigna un prefijo (sub-bloque) del mismo al router del cliente. Este prefijo será utilizado por el router del cliente para asignar direcciones IPv6 a sus propias interfaces y subredes internas.
5. **Configuración del router del cliente:** con el prefijo asignado por el servidor DHCPv6 del ISP, el router del cliente divide este prefijo en subredes más pequeñas según las necesidades de su propia red interna. Luego, configura sus interfaces internas y subredes con las direcciones IPv6 correspondientes.
6. **Distribución de direcciones internas:** una vez que el router del cliente ha dividido el prefijo recibido en subredes internas, puede utilizar SLAAC o DHCPv6 para asignar direcciones IPv6 a los dispositivos en sus redes internas.
7. **Renovación y actualización:** los prefijos asignados a través de DHCPv6-PD pueden tener un tiempo de vida determinado (TTL – *Time to Live*) después del cual deben renovarse o actualizarse. El router del cliente debe estar atento a las renovaciones y actualizaciones para asegurarse de que las direcciones IPv6 en su red interna sigan siendo válidas y estén actualizadas según lo asignado por el ISP.

> [!info]- Referencia
> `https://abcxperts.com/formas-de-asignar-direccionamiento-ipv6-parte-2/`

---
**Volver a:** [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]

**Continuar a:** [[08 - ICMPv6|ICMPv6]]
