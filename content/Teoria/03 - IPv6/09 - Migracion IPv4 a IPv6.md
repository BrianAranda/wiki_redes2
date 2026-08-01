---
title: Migración IPv4 a IPv6
---
> Los mecanismos de migración IPv4 a IPv6 se ven en la materia a modo **informativo**, no se realizan prácticas de implementaciones de los mismos, más allá de algo básico en el laboratorio.

Es razonable pensar que IPv4 e IPv6 coexistirán por muchos años. Por eso se han previsto técnicas para permitir a los dos protocolos convivir y a las empresas y organizaciones actualizar sus equipos e infraestructuras poco a poco. Hay tres principales categorías, donde dentro de cada una se pueden encontrar implementaciones diferentes con distintos mecanismos:

1) **Técnicas de *dual stack*** que permiten a IPv4 e IPv6 coexistir en el mismo equipo o red.
2) **Técnicas de *tunneling*** para enrutar tráfico IPv6 dentro de paquetes IPv4.
3) **Técnicas de traducción** para permitir a nodos IPv6 poderse comunicar con nodos IPv4.

Las técnicas de transición inicialmente involucraron unir islas de IPv6 sobre un océano de IPv4. Luego, de forma intermedia, involucrar ambos protocolos en paralelo en una configuración de *dual stack*. Posteriormente, en una última etapa, operar un entorno de protocolo único de IPv6, esto aún se está desarrollando a medida que las organizaciones transicionan.

> [!info]- Registros DNS entre IPv4 e IPv6
> Registros DNS más comunes y a qué servicios afectan:
> - **A:** contiene una dirección IPv4. Afecta al sitio web mostrado (para navegadores que prefieren IPv4).
> - **AAAA:** contiene una dirección IPv6. Afecta al sitio web mostrado (para navegadores que prefieren IPv6).
> - **CNAME:** contiene el nombre de dominio y es solamente para subdominios. Redirige el sub-dominio al dominio deseado.
> - **MX:** contiene el nombre del servidor de e-mail (por ejemplo `mx1.active24.com`). Define dónde se tienen que entregar los correos electrónicos.

## *Dual Stack*

> Definido en el [RFC 4213](https://www.rfc-editor.org/info/rfc4213/)

La técnica de *Dual Stack* (o doble pila) consiste en que un nodo tiene soporte completo para las dos implementaciones de IP. Cuando se trata de comunicar con nodos IPv4, el nodo se comporta como si fuese un nodo IPv4, mientras que con los nodos IPv6 se comporta como un nodo IPv6.

Esto permite una transición progresiva uno a uno manteniendo la operación de la red y permitiendo administrar las transiciones.

> [!warning] Inconveniente
> Los nodos necesitan una completa actualización de *software* de red, con el costo que eso implica. La presencia de las dos pilas se traduce en un aumento de la carga para el procesador y una mayor ocupación de memoria. Por ejemplo, los *routers* y los *hosts* deben tener dos copias de las tablas de enrutamiento y de otros recursos asociados a cada protocolo.

Las aplicaciones deberán ser capaces de reconocer si el *host* se está comunicando con otro IPv6 o IPv4. A menudo habrá dos versiones de la misma aplicación, una por cada protocolo (p.ej. `ping` y `ping6` bajo Windows). La ventaja es que cuando ya no sea necesario el IPv4, se podría quitar o remover el módulo correspondiente del sistema operativo.

En general, los equipos nuevos ya implementan *dual stack*, por ejemplo, Cisco IOS soporta la operación en modo *dual stack* tan pronto como ambos protocolos están configurados en una interfaz, donde a partir de ese punto puede reenviar ambos tipos de tráfico. El cambio que resta serían en los ISPs intermedios, donde no es tan fácil ni económico incorporar *dual stack routers*.

> [!note] Implementación *dual stack*
> 1. Revisar la red, aplicaciones y políticas de seguridad para asegurarse de que la implementación de IPv6 sea tan inclusiva como sea posible.
> 2. Actualizar nodos, *routers* y servicios de infraestructura para soportar IPv6. 
>     - Se debe prestar especial atención en servicios de infraestructura tales como DNS, HTTP, SNMP y servicios de autenticación.
> 3. Habilitar el soporte IPv6.
> 4. Actualizar todos los servicios siempre que sea posible para proveer funcionalidades sobre IPv6.
>     - Hay que estar atentos a que algunos servicios pueden requerir alguna atención adicional en función de que IPv6 será el protocolo de transporte preferido.
> 5. Asegúrarse de que la operación *dual stack* está funcionando correctamente y que todos los servicios funcionan correctamente. 
>     - Hay que verificar particularmente la implementación de las políticas de seguridad.

### Consideraciones 

- La implementación de *dual stack* **no puede ser por tiempo indefinido** ya que puede afectar la *performance* (algunos dispositivos reenvían más rápido el tráfico IPv4 que el IPv6), la seguridad y generar mayores costos dada la mayor complejidad de gestión.
- Hay que tener presente que dispositivos terminales viejos **pueden interpretar erróneamente respuestas DNS** que contengan registros A o AAAA (ver nota a continuación) y actuar de modo errático. Mantener políticas de seguridad semejantes sobre IPv4 e IPv6 puede ser complejo, pero son necesarias.
- A medida que avance la implementación global de IPv6 se hará más complejo y costoso el mantenimiento de sistemas IPv4 en estado operativo.

> [!info]- API para DNS IPv4 e IPv6
> 
> Hay disponible una API (*Application Programming Interface*) que soporta requerimientos DNS para IPv4 e IPv6 y permite responder a diferentes situaciones:
> 
> - Una aplicación que **no soporta IPv6** o está forzada a utilizar IPv4, hace una solicitud DNS de un registro tipo A para IPv4. En consecuencia la aplicación enviará su solicitud de servicio utilizando IPv4.
> - Una aplicación que soporta **solamente IPv6** o prefiere utilizar IPv6 operará sobre IPv6. La aplicación envía una solicitud exclusivamente de un registro AAAA. En consecuencia la aplicación establecerá la conexión con el servidor utilizando IPv6.
>     - Un registro AAAA determina qué dirección IPv6 se asigna a su dominio.
> - Una aplicación que puede operar **indistintamente con IPv4 o IPv6**, para cada nombre que debe resolver envía una solicitud DNS de cada tipo (IPv4 e IPv6). El servidor DNS responde enviando todas las direcciones IP disponibles (v4 y/o v6) que están asociadas a ese nombre.
> 
> Ya con la información de ambos protocolos, es la aplicación la que elige utilizar una u otra. El comportamiento típico por defecto es utilizar IPv6.

## *Tunneling*

Durante la implementación de IPv6 un escenario posible es que parte de la red no soporte IPv6, o que se desee realizar una implementación gradual por sectores de la red. En cualquiera de estos casos la solución más simple es **encapsular** el tráfico IPv6 y enviarlo a través de la red IPv4. Son los denominados mecanismos de tunelizado.

Los mecanismos consisten en que los paquetes IPv6 se encapsulan en paquetes IPv4 como si fueran de otro protocolo de nivel superior y se enrutan en redes IPv4 a lo largo de un túnel. En un extremo se encapsula, luego "pasa por el tunel", y en el otro extremo "se saca" el paquete IPv6. 

Estos túneles pueden ser configurados de manera manual o ser automáticos. Crean redes virtuales IPv6 sobre redes físicas IPv4 ya existentes:


![[tunneling.png]]

> [!note] Implementación de *Tunneling*
> 
> Este procedimiento permite conectar 2 "islas" o redes IPv6 a través de un *backbone* o red IPv4. Podríamos describir sus pasos como:
> 
> 1. Un *router* *dual stack* con una interfaz conectada a una red IPv6 y otra a una IPv4, recibe un paquete IPv6 desde un *host* que debe aplicar *tunneling*. 
> 2. Encapsula el paquete IPv6 en un paquete IPv4 y lo envía a través del túnel. 
> 3. La red IPv4 reenvía el tráfico sobre la base del encabezado IPv4 únicamente hasta el dispositivo que termina el túnel.
> 4. El *router dual stack* de destino recibe el paquete IPv4 y retira el encabezado, lee el encabezado v6 y lo reenvía sobre la red IPv6. 

Los túneles pueden establecerse:
1. Entre 2 *routers*.
2. Entre un *host* y un *router*.
3. Entre 2 *hosts*.

Pueden ser logrados a través de dos metodologías diferentes: 
1. Configuración manual
2. Configuración automática.

### Configuración manual

Este modo de implementación requiere que el túnel inicie y termine en dispositivos *dual stack* que tienen conectividad IPv4 entre sí. Es necesario utilizar una interfaz túnel con una dirección IPv6 *link local* asociada a la interfaz IPv4 de cada extremo del túnel. Está disponible en la mayoría de las plataformas, aunque es un recurso limitado ya que no escala bien.

- **IPv6 *in* IPv4** (Ver [RFC 3053](https://www.rfc-editor.org/rfc/rfc3053) y [RFC 4213](https://datatracker.ietf.org/doc/html/rfc4213)): Permite establecer conexión entre 2 puntos (*site to site*). Requiere de la configuración de las direcciones de origen y destino del túnel. Impone muy poco *overhead*.

- **GRE** (Ver [RFC 2784](https://www.rfc-editor.org/rfc/rfc2784) y [RFC 2890](https://www.rfc-editor.org/rfc/rfc2890)) : El *Generic Routing Encapsulation*) utiliza el protocolo de tunelizado IPv4 estándar. Permite establecer túneles punto a punto. Es necesario solamente para soportar redes que utilizan enrutamiento IS-IS (del inglés *Intermediate System to intermediate System*), un protocolo de estado de enlace, o SPF (*shortest path first*).

### Configuración automática

En estos casos el túnel se configura automáticamente sin necesidad de que al momento de configurar un extremo del túnel se conozca el otro extremo del mismo. Esta metodología escala mejor que la configuración estática ya que no es necesario configurar explícitamente cada punto terminal de los túneles. Como contrapartida, estos túneles dependen de servidores provistos por terceras partes en Internet y no soportan bien el tráfico de *multicast*.

- **6to4** (Ver [RFC 6732]((https://datatracker.ietf.org/doc/html/rfc6732)): Permite conectar "islas" IPv6 a través de una red IPv4. En este tipo de túneles no se pueden utilizar direcciones IPv6 *unicast* globales. El túnel utiliza direcciones con prefijo `2002::/16`.

- **6rd**  (Ver [RFC 5969](https://www.rfc-editor.org/rfc/rfc5969)): De 6 *rapid deployment* es un mecanismo de tunelizado para transición a IPv6 utilizado en redes de *service providers* para transporte de tráfico IPv6.

- **ISATAP**  (Ver [RFC 5214](https://www.rfc-editor.org/rfc/rfc5214)): De *Intra-Site Automatic Tunnel Addressing Protocol* son túneles para intranets corporativas en las que la infraestructura aún no soporta IPv6, mientras que los terminales requieren IPv6.

- **Teredo** (Ver [RFC 4380](https://www.rfc-editor.org/rfc/rfc4380)): Permite establecer túneles desde terminales que soportan IPv6 pero están conectadas a redes IPv4, contra servidores Teredo. Encapsula el tráfico IPv6 en un paquete IPv4 UDP, por lo que tiene objeciones desde la perspectiva de seguridad.

### Consideraciones

- El MTU efectivo es reducido en al menos 20 bytes cuando el encabezado IPv4 no contiene datos adicionales, ya que hay que considerar un segundo encabezado de capa de red.
- Una red tunelizada es difícil de diagnosticar, por lo que debe ser considerada una solución de transición y no una arquitectura final.
- El túnel es considerado como un salto único. No hay manera para que un host IPv6 se entere de que el paquete ha sido encapsulado a lo largo de su camino por medio de herramientas como `traceroute`.
- La tunelización agrega sobrecarga, reduce el tamaño de MTU y requiriere *backhauling* (transporte de retorno), agregando latencia a través del *gateway* la red. Estos problemas dieron lugar a debates en el IETF sobre la desaprobación de los enfoques de tunelización dinámica.

> [!info]- Hurricane Electric
> **HURRICANE ELECTRIC – Internet Services** (`https://www.tunnelbroker.net/`) ofrece un servicio Gratuito de Tunelización de IPv6 sobre Redes IPv4.
> 
> El Servicio de intermediación de túneles le permite acceder a Internet IPv6 mediante la tunelización a través de conexiones IPv4 existentes desde su host o enrutador habilitado para IPv6 a uno de sus enrutadores IPv6.
> 
> Para utilizar este servicio, debe tener un *host* compatible con IPv6 o un *router* que también tenga conectividad IPv4 (Internet existente). El servicio de túneles está orientado a desarrolladores y experimentadores que desean una plataforma de túnel estable.

## Traducción IPv4 a IPv6

Esta técnica consiste en utilizar algún dispositivo en la red que convierta los paquetes de IPv4 a IPv6 y viceversa. Ese dispositivo tiene que ser capaz de realizar la traducción en los dos sentidos de forma de permitir la comunicación.

- **NAT64 y DNS64** (Ver [RFC 6146](https://www.rfc-editor.org/rfc/rfc6146) y [RFC 6147](https://www.rfc-editor.org/rfc/rfc6147)): En NAT64 se utiliza un prefijo especial para mapear direcciones IPv4 a IPv6: `64:ff9b::/96`. De esta forma, la complejidad de administración se simplifica al sólo tener que administrar una red IPv6 *only*. Las conexiones IPv6 son nativas, por lo que a medida que el despliegue de IPv6 crece en el mundo, el costo de esta solución no se incrementa. 
    - Es necesario también utilizar una modificación al DNS, llamada DNS64, que permite generar un registro AAAA aún cuando el destino no tenga dirección IPv6, es decir, el DNS responda sólo con registros de tipo A .

- **464XLAT** (Ver [RFC 6877](https://www.rfc-editor.org/rfc/rfc6877)): Se basa en la técnica anterior, pero introduce una doble traducción para los casos en que se necesite utilizar una aplicación que no soporta IPv6. Esto soluciona algunos problemas de NAT64 y es una técnica muy adecuada para redes de celulares (móviles), ya que los sistemas Android ya la incorporan. También para montar *datacenters* IPv6 *only*.

- **MAP-E y MAP-T** (Ver [RFC 7597](https://www.rfc-editor.org/rfc/rfc7597) y  [RFC 7599](https://www.rfc-editor.org/rfc/rfc7599)): Son técnicas de transición similares a las anteriores pero que trabajan por compartición de puertos (A+P, ver RFC6346). 
    - MAP-T usa traducción para transportar el tráfico IPv4. 
    - MAP-E utiliza encapsulado (túneles).

---
**Volver a:** [[08 - ICMPv6|ICMPv6]]

**Continuar a:** [[10 - Herramientas y Ejemplos Practicos|Herramientas y Ejemplos Prácticos]]
