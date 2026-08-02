---
title: Direcciones Dinámicas
fuente:
  - "[Fundamentos IPv6 Cisco](https://cloud.fio.unam.edu.ar/index.php/s/kfroJFkzy5YNi59?dir=/&editing=false&openfile=true)"
---

> Los temas desarrollados a continuación se encuentran a partir del capítulo 8 (Pág. 227)

Las direcciones dinámicas ofrecen un método para que los dispositivos creen u obtengan sus direcciones de [[04 - Unicast#*Global Unicast Address* (GUA)|unicasts globales]] y otra información relativa al direccionamiento. Como se mencionó en la sección de GUA existen distintas maneras de obtenerla:

![[obtener_gua.png|600]]

> [!info] GUAs manuales
> Nosotros vamos a estudiar únicamente la manera dinámica de obtención, pero la forma manual se detalla en el Capítulo 5 del libro [Fundamentos IPv6 Cisco](https://cloud.fio.unam.edu.ar/index.php/s/kfroJFkzy5YNi59?dir=/&editing=false&openfile=true).

A modo de repaso sabemos que un *host* configurado para obtener su dirección IPv6 automáticamente envía un mensaje de [[08 - Neighbor Discovery#*Router Solicitation* (RS)|Router Solicitation]] (RS), esto para informar al *router* IPv6 local que necesita un mensaje de [[08 - Neighbor Discovery#*Router Advertisement* (RA)|Router Advertisement]] (RA) que le proporcione la información necesaria. 

![[mensajes_rs_ra.png|600]]

En el mensaje de Router Advertisement (RA) viene incluido el método **sugerido** por el *router* para crear la dirección GUA dinámicamente. Es solo una sugerencia para los clientes y los sistemas operativos pueden estar configurados para ignorar el mensaje RA. La mayoría de las organizaciones prefieren configurar de forma estática la información de direccionamiento IPv6 en sistemas específicos, como servidores e impresoras.

## Métodos

El RA indica a los dispositivos cómo crear u obtener una GUA y otra información de direccionamiento para comunicarse a través del enlace. Para ello utiliza tres *flags* para indicar a los dispositivos cómo deben hacerlo:

- ***Flag* A (*Address Autoconfiguration*):** Cuando se establece en 1 indica al host receptor que utilice SLAAC para crear su GUA. Combina el prefijo del mensaje RA con un *Interface* ID generado por él mismo. El método que utiliza el host para crear su propio *Interface* ID depende del sistema operativo, sea EUI-64 o *Random*.
- ***Flag* O (*Other Configuration*):** Cuando se establece en 1 indica al *host* que obtenga información de direccionamiento, distinta de su dirección de GUA, desde un servidor DHCPv6 *stateless*. Esta información puede incluir direcciones de servidores DNS y un nombre de dominio.
- ***Flag* M (*Managed Address Configuration*)**: Cuando se establece en 1 indica a un *host* que utilice un servidor DHCPv6 *stateful* para su dirección GUA y el resto de información de direccionamiento. El *host* solo utiliza del mensaje RA la dirección IPv6 de origen del paquete, la cual utiliza como *gateway* predeterminado.

> [!important] Diferencias entre *Stateless* y *Stateful*
> Un servidor DHCPv6 *stateful* (con estado) asigna GUAs a los clientes y mantiene información de estado, es decir, un registro de a qué cliente se le ha asignado qué dirección. Un servidor DHCPv6 *stateless* (sin estado) no proporciona la GUA, sino que proporciona información genérica, como las direcciones de los servidores DNS y un nombre de dominio, a todos los clientes por igual.

Mediante diferentes combinaciones de los *flags* anteriores, el mensaje RA informa al *host* sobre las opciones dinámicas disponibles.  Un 1 indica que el indicador está activado, y un 0 indica que está desactivado. Como las *flags* se configuran en la interfaz, se permite utilizar diferentes tipos de mensajes RA en cada enlace.

| Método de asignación       | *Flag* A  | *Flag* O  | *Flag* M  |
| -------------------------- | --------- | --------- | --------- |
| SLAAC (*default*)          | 1 (*on*)  | 0 (*off*) | 0 (*off*) |
| SLAAC + DHCPv6 *stateless* | 1 (*on*)  | 1 (*on*)  | 0 (*off*) |
| DHCPv6 *stateful*          | 0 (*off*) | N/A       | 1 (*on*)  |

> [!question]- ¿Qué pasa si seteo todos los *flags*?
> Cuando tanto la *flag* O como la M están establecidos en 1, la O deja de ser relevante. En ese caso, el dispositivo utiliza DHCPv6 *stateful* para toda su información de configuración (excepto el *gateway*). Si tambien A es 1 muchos sistemas operativos (como Windows) configuran una dirección adicional mediante SLAAC. El resultado final es que el dispositivo puede tener tanto una dirección creada por SLAAC y otra obtenida de un DHCPv6 *stateful*.

> [!question]- ¿Cuándo usar cada método?
> SLAAC es a menudo suficiente para redes domésticas o pequeñas oficinas donde la configuración básica de red es todo lo que se necesita. Es simple y no requiere un servidor adicional.
> 
> DHCPv6 es preferido en entornos empresariales o redes más grandes donde se necesita un control más granular sobre la configuración de red y la gestión del espacio de direcciones IP.

> [!question]- ¿Qué elementos debe proveer una asignación dinámica?
> Para poder utilizar Internet, los elementos que deberían proveer los métodos de asignación de direcciones dinámicas son:
> 1. Prefijo de Red.
> 2. Longitud del Prefijo de red.
> 3. Dirección del *Gateway*.
> 4. Direcciones de Servidores DNS.
> 5. MAC de *Gateway*.

### SLAAC

> Esto se define a profundidad en el capítulo 9 del libro.

El método SLAAC (*Stateless Address Autoconfiguration*) indica al receptor que el mensaje RA contiene toda la información de direccionamiento que necesita un dispositivo, incluido el prefijo que este utilizará para crear su propia dirección GUA. 

![[metodo1.png|600]]

Dado que no todas las redes tienen acceso a un servidor DHCPv6, pero todos los dispositivos de una red IPv6 necesitan un GUA, el método SLAAC permite crearla sin este servidor. Un equipo solo debería esperar este mensaje RA para obtener la parte de la dirección global que desconoce.

En principio este método no reemplaza completamente a un servidor DHCP, pero puede funcionar de manera similar bajo ciertas circunstancias gracias a que puede incluir en los RA los DNS, que sería lo único que le faltaría saber a un host para poder navegar en Internet.

El mensaje RA viaja encapsulado en una cabecera IPv6 con dirección de origen LLA `FE80::1/10` y como destino una *multicast* de todos los nodos `FF02::1` (también podría ser *unicast* solicitado). La LLA, configurada manualmente en el *router*, es la que los dispositivos receptores usan como *gateway* predeterminado.

> [!info]- Pasos de SLAAC
> 
> Los pasos a seguir para este método son:
>
> ![[slaac.png|600]]
> 
> **Paso 1:** El mensaje RA envia mucha información, en este caso nos interesa ver que el mensaje RA incluye el **prefijo** y la **longitud del prefijo** del enlace: `2001:DB8:CAFE:1::` y `/64`. También puede incluir, opcionalmente, las direcciones de los servidores DNS a utilizar.
> 
> **Paso 2:** El *host* receptor recibe el RA desde `FE80::1`, obtiene su MAC y toma la dirección como *default gateway*. Al ver el *flag* A seteado el *host* sabe que debe usar la información del mensaje para crear su GUA.
> 
> **Paso 3:** El *host* toma el prefijo que recibió del mensaje, en este ejemplo `2001:DB8:CAFE:1::`, para que sea el prefijo de su propia GUA. Genera dos direcciones de *unicast* global, una pública y otra temporal.
> 
> **Paso 4:** El *host* genera el *Interface* ID para la dirección GUA utilizando EUI-64 o *Random* (*default*). Luego lleva a cabo la detección de direcciones duplicadas (DAD) para asegurarse de que ningún otro dispositivo del enlace esté utilizando dicha dirección.

### SLAAC + DHCPv6 *stateless*

> Este método se trata en [RFC 3736](https://www.rfc-editor.org/rfc/rfc3736) y esta sección es **informativa**. También se define a profundidad en el capítulo 10 del libro.

Con este método, el dispositivo crea su propia GUA mediante SLAAC, al igual que en el primer método. Pero además,  al tener la *flag* O activada, se le indica al dispositivo receptor que hay más información disponible en un servidor DHCPv6 *stateless*.

![[metodo2.png|600]]

> [!info]- Pasos de SLAAC + DHCPv6 *stateless*
> 
> Los pasos a seguir para este método son:
> 
> ![[slaac_dhcp.png|600]]
> 
> **Paso 1:** El *host* envía un RS si no recibe un RA antes.
> 
> **Paso 2:** El mensaje de respuesta RA viene con los *flags* A y O seteados, sugiriendo usar SLAAC y que hay mas información en un servidor DHCPv6 *stateless*. La *flag* M no está seteada por *default* indicando que el servicio DHCPv6 *stateful* no es necesario.
> 
> **Paso 3:** El *host* forma su dirección según SLAAC y determina su GW. Por defecto se generan dos direcciones, una pública y otra temporal (*random*).
> 
> **Paso 4:** El *host* realiza la verificación de dirección duplicada (DAD) sobre la dirección de *unicast* (GUA o LLA); si no recibe respuesta, asume que es única.
> 
> **Paso 5:** La *flag* O seteada indica que se puede conseguir información adicional en un DHCPv6 *stateless*, entonces envía un mensaje *multicast* de nodo solicitado `FF02::1:2`.
> 
> **Paso 6:** Uno o más servidores de DHCPv6 responden al mensaje anterior, indicando que él tiene servicio disponible.
> 
> **Paso 7:** El *host* responde al servidor seleccionado consultando por la información de configuración que le falta.
> 
> **Paso 8:** El DHCPv6 responde con la información de configuración que falta.

### DHCPv6 *stateful*

> Esto se define en profundidad en el capítulo 11 del libro.

En este método, el mensaje RA informa al cliente que no debe usar la información de su mensaje, en cambio para obtener su GUA y toda otra información, excepto el *default gateway*, tiene que consultar a un servidor DHCPv6 *stateful*. 

![[metodo3.png|600]]

> [!info]- Pasos DHCPv6 *stateful*
> 
> Los pasos a seguir para este método son:
> 
> ![[dhcp_stateful.png|600]]
> 
> 
> **Paso 1:** El _host_ envía un RS si no recibe un RA antes.
> 
> **Paso 2:** El mensaje de respuesta RA viene con el *flag* M seteado, indicando la existencia de un servidor DHCPv6 *stateful*. La *flag* A viene sin setear indicando que SLAAC no es necesario, mientras que por otro lado, el estado de la *flag* O es irrelevante.
> 
> **Paso 3:** Utiliza la dirección de origen `FE80::1` de *default gateway*. Dado que A es cero, no se crea dirección por SLAAC
> 
> **Paso 4:** El _host_ envía una solicitud de servicios DHCPv6. 
> 
> **Paso 5:** Uno o más servidores de DHCP responden indicando que están disponibles.
> 
> **Paso 6:** El _host_ solicita la dirección y otras informaciones para su configuración al servidor elegido.
> 
> **Paso 7:** El servidor seleccionado responde con un mensaje que contiene la dirección GUA y las otras informaciones de configuración.
> 
> **Paso 8:** El _host_ realiza DAD para asegurarse de que ningún otro dispositivo del enlace esté utilizando dicha dirección.

## *Duplicate Address Detection* (DAD)

Un dispositivo puede utilizar la detección de direcciones duplicadas (DAD) de ICMPv6 para determinar si una dirección que desea asignar a una interfaz ya está siendo utilizada por otro dispositivo. Salvo algunas excepciones, el RFC 4861 recomienda que se aplique el DAD a todas las direcciones de *unicast*, ya sean *link local* o globales, antes de asignarlas a una interfaz, independientemente de si se han asignado mediante SLAAC, DHCPv6 o configuración manual. 

Si durante este proceso se detecta una dirección duplicada, esta no podrá utilizarse en la interfaz. El procedimiento implica el envio de [[08 - Neighbor Discovery#*Neighbor Solicitation* (NS)|Neighbor Solicitation]] (NS) y la espera de un [[08 - Neighbor Discovery#*Neighbor Advertisement* (NA)|Neighbor Advertisement]] (NA). Si ningún otro dispositivo responde con un mensaje NA en un tiempo determinado, prácticamente se garantiza que la dirección es única y puede ser utilizada. Si es recibido, la dirección no es única, y el sistema operativo debe determinar una nueva ID de interfaz para utilizar.

> [!info]- Pasos de DAD
> 
> Los pasos a seguir para este método son:
> 
> ![[dad_pasos.png|600]]
> 
> **Paso 1:** Antes de utilizar cualquier dirección *unicast*, el *host* debe determinar si es única en el enlace. Mientras tanto la dirección se mantiene en estado provisional hasta que finalice el procedimiento.
> 
> **Paso 2:** El *host* envía un mensaje NS para comprobar si alguien más en la red ya está utilizando esta dirección.
> 
> **Paso 3:** El *host* establece un temporizador para dar la oportunidad a otro dispositivo que utilice la misma dirección (en provisional) de responder con un mensaje NA. Si no se recibe ningún mensaje una vez transcurrido este tiempo, la dirección pasa de ser provisional a asignada.
> 
> **Paso 4:** Si otro dispositivo del enlace tiene la misma dirección local de enlace, responde con un mensaje NA. La recepción del mensaje le indica al *host* que esa dirección ya está en uso y no se puede asignar. La dirección queda entonces suspendida.

## Autoconfiguración IPv6 en RouterOS

La implementación de IPv6 sobre RouterOS nos brinda las siguientes posibilidades:
1. SLAAC (autoconfiguración *stateless*).
2. DHCP *Server* (sólo trabajando como DHCP-PD).

Primero debemos configurar las direcciones de IPv6 para configurar de manera completa una interfaz. Son necesarios distintos datos, como la dirección IPv6 base, el prefijo, si queremos utilizar o no EUI-64 o la opción *Advertise*.

Podemos usar tres métodos para usar en MK para la configuración:
1. Asignación de dirección **estática**, configuración manual (no lo veremos).
2. Autoconfiguración ***stateless*** usando mensajes ND y DAD (RS / RA / NS / NA).
3. Autoconfiguración con servidor ***stateful*** usando DHCPv6.

> Acá se detalla el proceso práctico de SLAAC pero es redundante dado que se detalla en la sección y las cuestiones prácticas es preferibles verlas en los laboratorios.

### DHCP-PD

> Esta sección es informativa. Se aborda en profundidad a partir la pág. 329 del libro.

En MikroTik y en el contexto de DHCPv6, las siglas PD significan *Prefix Delegation*. DHCPv6 que permite asignar no solo una dirección IPv6 a un dispositivo o cliente, sino un **prefijo completo**, es decir, un bloque de direcciones IPv6. Este prefijo puede ser utilizado por el cliente para distribuir las direcciones IPv6 entre otros dispositivos en su red local. 

> [!important] DHCP-PD distinción
> - **DHCPv6:** protocolo que asigna una dirección IPv6.
> - **PD (*Prefix Delegation*):** permite asignar un prefijo completo (un rango de direcciones) a un cliente, para que este pueda distribuirlo a otros dispositivos.

> [!info]- ¿Cómo funciona DHCPv6-PD?
> Sacado de [Formas de Asignar Direccionamiento IPv6 (Parte 2) - abcXperts](https://abcxperts.com/formas-de-asignar-direccionamiento-ipv6-parte-2/)
> 1. **Rol del ISP (Proveedor de servicios de Internet):** en un entorno típico de DHCPv6-PD, el ISP juega un papel importante. El ISP tiene un bloque grande de direcciones IPv6 asignado a través de su proveedor de direcciones (RIR – *Regional Internet Registry*). Este bloque es conocido como el bloque de asignación del ISP (ISP *Allocation*).
> 2. **Asignación al router del cliente:** el router del cliente (también conocido como CPE – *Customer Premises Equipment*) se conecta a la red del ISP y tiene una interfaz externa que obtiene una dirección IPv6 mediante DHCPv6 de la infraestructura del ISP.
> 3. **Solicitud de prefijo:** una vez que el router del cliente ha obtenido su dirección IPv6, envía una solicitud de prefijo (PD) al servidor DHCPv6 del ISP. En esta solicitud, el router del cliente solicita una porción del bloque de asignación del ISP para su propia red.
> 4. **Asignación de prefijo:** el servidor DHCPv6 del ISP, al recibir la solicitud de prefijo, evalúa su bloque de asignación y asigna un prefijo (sub-bloque) del mismo al router del cliente. Este prefijo será utilizado por el router del cliente para asignar direcciones IPv6 a sus propias interfaces y subredes internas.
> 5. **Configuración del router del cliente:** con el prefijo asignado por el servidor DHCPv6 del ISP, el router del cliente divide este prefijo en subredes más pequeñas según las necesidades de su propia red interna. Luego, configura sus interfaces internas y subredes con las direcciones IPv6 correspondientes.
> 6. **Distribución de direcciones internas:** una vez que el router del cliente ha dividido el prefijo recibido en subredes internas, puede utilizar SLAAC o DHCPv6 para asignar direcciones IPv6 a los dispositivos en sus redes internas.
> 7. **Renovación y actualización:** los prefijos asignados a través de DHCPv6-PD pueden tener un tiempo de vida determinado (TTL – *Time to Live*) después del cual deben renovarse o actualizarse. El router del cliente debe estar atento a las renovaciones y actualizaciones para asegurarse de que las direcciones IPv6 en su red interna sigan siendo válidas y estén actualizadas según lo asignado por el ISP.

En resumen, DHCPv6-PD es una extensión del protocolo DHCPv6 que permite a los *routers* obtener bloques de direcciones IPv6 (prefijos) del ISP para su propia red y, a partir de ahí, dividir y asignar direcciones a sus subredes internas.

Esto es especialmente útil en entornos de proveedores de servicios de Internet y en redes que requieren una jerarquía de direccionamiento IPv6 para subdividir un bloque de direcciones en subredes más pequeñas.

---
**Volver a:** [[09 - Direcciones Temporales|Direcciones Temporales]]

**Continuar a:** [[11 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]
