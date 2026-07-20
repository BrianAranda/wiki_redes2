---
title: Migración IPv4 a IPv6
---
Los mecanismos de Migración IPv4 a IPv6 se ven en la materia a modo **INFORMATIVO**, no se realizan prácticas de implementaciones de los mismos, más allá de algo básico en el Laboratorio de IPv6.

Es razonable pensar que IPv4 e IPv6 coexistirán por muchos años. Por eso se han previsto técnicas para permitir a los dos protocolos convivir y a las empresas y organizaciones actualizar sus equipos e infraestructuras poco a poco. Hay tres principales categorías:

1) **Técnicas de doble pila (Dual Stack)** que permiten a IPv4 e IPv6 coexistir en el mismo equipo o red.

2) **Técnicas de tunneling** para enrutar tráfico IPv6 dentro de paquetes IPv4.

3) **Técnicas de traducción (NAT)**, para permitir a nodos IPv6 poderse comunicar con nodos IPv4.

Dentro de estas se pueden encontrar implementaciones como las siguientes (hay diferentes mecanismos, que podéis buscar y de los que podéis encontrar información):

- Stateless IP/ICMP Translation (SIIT)
- Tunnel Broker (6in4)
- 6to4
- 6over4
- 6rd (IPv6 rapid development)
- ISATAP
- NAT64
- 464XLAT
- Dual-Stack Lite (DS-Lite)
- Teredo

## 16.1. Técnicas de Doble pila (DUAL STACK)

La técnica de Dual Stack consiste en que un nodo tiene soporte completo para las dos implementaciones de IP. Cuando se trata de comunicar con nodos IPv4, el nodo se comporta como si fuese un nodo IPv4, mientras que con los nodos IPv6 se comporta como un nodo IPv6.

Esto permite una transición progresiva uno a uno manteniendo la operación de la red y permitiendo administrar las transiciones.

> [!warning] Inconveniente
> Los inconvenientes de esta técnica son que los nodos necesitan una completa actualización de software de red, con el costo que eso implica. La presencia de las dos pilas se traduce en un aumento de la carga para el procesador y una mayor ocupación de memoria: de hecho, los routers y los hosts deben tener dos copias de las tablas de enrutamiento y de otros recursos asociados a los protocolos.

![[arquitectura-dual-stack.png]]

![[red-dual-stack.png]]

Las aplicaciones deberán ser capaces de reconocer si el host está comunicando con otro host IPv6 o IPv4. A menudo habrá dos versiones de la misma aplicación, una por cada protocolo (p.ej. `ping` y `ping6` bajo Windows). La ventaja es que cuando ya no sea necesario el IPv4, se podrá quitar o remover el módulo correspondiente del sistema operativo.

Como podemos ver, en general los equipos nuevos ya están implementando dual stack. El cambio que resta serían en los ISPs intermedios, donde no es tan fácil ni económico incorporar dual stack routers.

Hay disponible una API (*Application Programming Interface*) que soporta requerimientos DNS para IPv4 e IPv6 y permite responder a diferentes situaciones:

- Una aplicación que no soporta IPv6 o está forzada a utilizar IPv4, hace una solicitud DNS de un registro tipo A para IPv4. En consecuencia la aplicación enviará su solicitud de servicio utilizando IPv4.
- Una aplicación que soporta solamente IPv6 o prefiere utilizar IPv6 operará sobre IPv6. La aplicación envía una solicitud exclusivamente de un registro AAAA (un registro AAAA determina qué dirección IPv6 se asigna a su dominio); con lo que obtendrá una dirección IPv6. En consecuencia la aplicación establecerá la conexión con el servidor utilizando IPv6.
- Una aplicación que puede operar indistintamente con IPv4 o IPv6, para cada nombre que debe resolver envía una solicitud DNS de cada tipo (IPv4 e IPv6). El servidor DNS responde enviando todas las direcciones IP disponibles (v4 y/o v6) que están asociadas a ese nombre.

Ya con la información de ambos protocolos, es la aplicación la que elige utilizar una u otra. El comportamiento típico por defecto es utilizar IPv6.

Cisco IOS soporta la operación en modo dual-stack tan pronto como ambos protocolos están configurados en una interfaz. A partir de ese punto puede reenviar ambos tipos de tráfico:

```
ipv6 unicast-routing !
interface GigabitEthernet0/0
ip address 192.168.0.1 255.255.255.0 ipv6 address 2001:abc:1::/64 eui-64
```

Eso puede realizarse tanto cuando se asignan direcciones IPv6 estáticas o por un proceso de configuración automática.

### Implementación dual-stack

1. Revise la red, las aplicaciones y las políticas de seguridad para asegurarse de que la implementación de IPv6 sea tan inclusiva como sea posible.
2. Actualice nodos, routers y servicios de infraestructura para soportar IPv6. Se debe prestar especial atención en servicios de infraestructura tales como DNS, HTTP, SNMP y servicios de autenticación.
3. Habilite el soporte IPv6.
4. Actualice todos los servicios siempre que sea posible, para proveer funcionalidades sobre IPv6. Hay que estar atentos a que algunos servicios pueden requerir alguna atención adicional en función de que IPv6 será el protocolo de transporte preferido.
5. Asegúrese de que la operación dual-stack está funcionando correctamente y que todos los servicios funcionan correctamente. Hay que verificar particularmente la implementación de las políticas de seguridad.

**Consideraciones a tener en cuenta:**

1. La implementación de dual-stack no puede ser por tiempo indefinido ya que puede afectar la performance (algunos dispositivos reenvían más rápido el tráfico IPv4 que el IPv6), la seguridad y generar mayores costos dada la mayor complejidad de gestión.
2. Hay que tener presente que dispositivos terminales viejos pueden interpretar erróneamente respuestas DNS que contengan registros A y AAAA y actuar de modo errático. Mantener políticas de seguridad semejantes sobre IPv4 e IPv6 puede ser complejo, pero son necesarias.
3. A medida que avance la implementación global de IPv6 se hará más complejo y costoso el mantenimiento de sistemas IPv4 en estado operativo.

## 16.2. Técnicas de Tunneling

Durante la implementación de IPv6 un escenario posible es que parte de la red no soporte IPv6, o que se desee realizar una implementación gradual por sectores de la red. En cualquiera de estos casos la solución más simple es encapsular el tráfico IPv6 y enviarlo a través de la red IPv4. Son los denominados mecanismos de tunelizado.

En este caso, los túneles son utilizados para crear redes virtuales IPv6 sobre redes físicas IPv4 ya existentes. En este caso, un encabezado IPv6 es encapsulado dentro de un paquete IPv4:

**Opción 1:** un dispositivo dual-stack con una interfaz conectada a la red IPv6 y otra interfaz conectada a la red IPv4, recibe un paquete IPv6. Encapsula el paquete IPv6 en un paquete IPv4 y lo envía a través de la red IPv4. La red IPv4 reenvía el tráfico sobre la base del encabezado IPv4, únicamente, hasta el dispositivo que termina el túnel. El túnel termina en otro dispositivo dual-stack conectado a la red IPv4 por una interfaz y a la red IPv6 por la otra. Recibe el paquete IPv4, retira el encabezado, lee el encabezado IPv6 y lo reenvía sobre la red IPv6. Este procedimiento permite conectar 2 "islas" o redes IPv6 a través de un backbone o red IPv4.

![[tunel-ipv6-en-ipv4.png]]

### Consideraciones a tener en cuenta

El MTU efectivo es reducido en al menos 20 bytes cuando el encabezado IPv4 no contiene datos adicionales, ya que hoy que considerar un segundo encabezado de capa de red.

Una red tunelizada es difícil de diagnosticar, por lo que debe ser considerada una solución de transición y no una arquitectura final.

Los túneles pueden establecerse:
1. Entre 2 routers.
2. Entre un host y un router.
3. Entre 2 hosts.

Técnicas de tunelizado disponibles para implementaciones IPv6. Los túneles IPv6 sobre IPv4 descriptos antes pueden ser logrados a través de 2 metodologías diferentes: configuración manual o automática.

### Túneles de configuración manual

- Red IPv6 — Red IPv6
- Red IPv4
- IPv4 IPv6 Dispositivos dual-stack

Este modo de implementación requiere que el túnel inicie y termine en dispositivos dual-stack que tienen conectividad IPv4 entre sí. Es necesario utilizar una interfaz túnel con una dirección IPv6 link-local asociada a la interfaz IPv4 de cada extremo del túnel.

Está disponible en la mayoría de las plataformas, aunque es un recurso limitado ya que no escala bien.

**IPv6-in-IPv4.** Permite establecer conexión entre 2 puntos (site-to-site). Requiere de la configuración de las direcciones de origen y destino del túnel. Impone muy poco overhead.

**GRE (Generic Routing Encapsulation).** Utiliza el protocolo de tunelizado IPv4 estándar. Permite establecer túneles punto a punto. Es necesario solamente para soportar redes que utilizan enrutamiento IS-IS (del inglés *Intermediate System to intermediate System*), un protocolo de estado de enlace, o SPF (*shortest path first*). VPN (*Virtual Private Network*).

### Túneles de configuración automática

En estos casos el túnel se configura automáticamente sin necesidad de que al momento de configurar un extremo del túnel se conozca el otro extremo del mismo.

Esta metodología escala mejor que la configuración estática ya que no es necesario configurar explícitamente cada punto terminal de los túneles. Como contrapartida, estos túneles dependen de servidores provistos por terceras partes en Internet y no soportan bien el tráfico de multicast.

**6to4.** Permite conectar "islas" IPv6 a través de una red IPv4. En este tipo de túneles no se pueden utilizar direcciones IPv6 unicast globales. El túnel utiliza direcciones con prefijo `2002::/16`.

**6rd (6 rapid deployment).** Mecanismo de tunelizado para transición a IPv6 utilizado en redes de service providers para transporte de tráfico IPv6.

**ISATAP (Intra-Site Automatic Tunnel Addressing Protocol).** Túneles para intranets corporativas en las que la infraestructura aún no soporta IPv6, mientras que los terminales requieren conectividad IPv6.

**Teredo.** Permite establecer túneles desde terminales que soportan IPv6 pero están conectadas a redes IPv4, contra servidores Teredo. Encapsula el tráfico IPv6 en un paquete IPv4 UDP, por lo que tiene objeciones desde la perspectiva de seguridad.

### Cómo funciona el tunneling

![[tunel-r1-r2-dual-stack.png]]

Las fases de la encapsulación de paquetes IPv6 son las siguientes:

1. El router a la entrada del túnel decrementa el valor del campo Hop Limit del paquete IPv6 en una unidad y crea un paquete IPv4 con el valor 41 en el campo Protocol Type. La longitud del paquete es calculada sumando la longitud de la cabecera IPv6, las eventuales cabeceras adicionales y el contenido del paquete. Si es necesario, el router fragmenta el paquete. El destino del nuevo paquete IPv4 es la salida del túnel.
2. El router a la salida del túnel recibe el paquete IPv4. Si es fragmentado, espera todos los fragmentos y los reúne. Luego saca el paquete IPv6 y lo encamina hacia su destino.

El túnel es considerado como un salto único. No hay manera para que un host IPv6 se entere de que el paquete ha sido encapsulado a lo largo de su camino por medio de herramientas como `traceroute`.

> [!info]- A modo de ejemplo: Hurricane Electric
> **HURRICANE ELECTRIC – Internet Services** (`https://www.tunnelbroker.net/`) ofrece un servicio Gratuito de Tunelización de IPv6 sobre Redes IPv4.
> El Servicio de intermediación de túneles le permite acceder a Internet IPv6 mediante la tunelización a través de conexiones IPv4 existentes desde su host o enrutador habilitado para IPv6 a uno de sus enrutadores IPv6.
> Para utilizar este servicio, debe tener un host compatible con IPv6 (el soporte IPv6 está disponible para la mayoría de las plataformas) o un enrutador que también tenga conectividad IPv4 (Internet existente). El servicio de túneles está orientado a desarrolladores y experimentadores que desean una plataforma de túnel estable.

## 16.3. Traducción o Transición IPV4 a IPV6

Esta técnica consiste en utilizar algún dispositivo en la red que convierta los paquetes de IPv4 a IPv6 y viceversa. Ese dispositivo tiene que ser capaz de realizar la traducción en los dos sentidos de forma de permitir la comunicación. Dentro de esta clasificación podemos mencionar NAT64/DNS64.

### NAT64/DNS64

La red IPv6 es nativa y para llegar a sitios que son sólo IPv4 se realiza una traducción al estilo NAT, mediante un mapeo entre los paquetes IPv6 e IPv4.

![[nat64-traduccion.png]]

Se utiliza un prefijo especial para mapear direcciones IPv4 a IPv6: `64:ff9b::/96`. De esta forma, la complejidad de administración se simplifica al sólo tener que administrar una red IPv6-only. Las conexiones IPv6 son nativas, por lo que a medida que el despliegue de IPv6 crece en el mundo, el costo de esta solución no se incrementa. Es necesario también utilizar una modificación al DNS, llamada **DNS64**, que permite generar un registro AAAA aún cuando el destino no tenga dirección IPv6 (es decir, el DNS responda sólo con registros de tipo A).

**Registros DNS más comunes y a qué servicios afectan:**
- **A record:** contiene una dirección IPv4. Afecta al sitio web mostrado (para navegadores que prefieren IPv4).
- **AAAA:** contiene una dirección IPv6. Afecta al sitio web mostrado (para navegadores que prefieren IPv6).
- **CNAME:** contiene el nombre de dominio y es solamente para subdominios. Redirige el sub-dominio al dominio deseado.
- **MX:** contiene el nombre del servidor de e-mail (por ejemplo `mx1.active24.com`). Define dónde se tienen que entregar los correos electrónicos.

### 464XLAT

Se basa en la técnica anterior, pero introduce una doble traducción para los casos en que se necesite utilizar una aplicación que no soporta IPv6. Esto soluciona algunos problemas de NAT64 y es una técnica muy adecuada para redes de celulares (móviles), ya que los sistemas Android ya la incorporan. También para montar datacenters IPv6-only.

### MAP-E y MAP-T

Son técnicas de transición similares a las anteriores pero que trabajan por compartición de puertos (A+P, ver RFC6346). MAP-T usa traducción para transportar el tráfico IPv4. MAP-E utiliza encapsulado (túneles).

## 16.4. Observaciones sobre la Migración (Informativo)

Las técnicas de transición en etapa inicial involucraron unir islas de IPv6 sobre un océano de IPv4. La transición de etapa intermedia involucra ambos protocolos en paralelo en una configuración de doble pila. Las técnicas de transición de última etapa aún se están desarrollando a medida que las organizaciones buscan operar un entorno de protocolo único y solo IPv6.

En 2007, la guía típica sobre la implementación de IPv6 era "IPv6: doble pila donde puedas; túnel donde debas".

En los primeros días de la implementación de IPv6, había muchos enfoques basados en túneles destinados a permitir que los implementadores implementaran IPv6 sobre una red IPv4 existente.

Sin embargo, había desventajas en técnicas como 6to4 ([RFC 7526](https://www.rfc-editor.org/rfc/rfc7526)), ISATAP ([RFC 5214](https://www.rfc-editor.org/rfc/rfc5214)) y Teredo ([RFC 4380](https://www.rfc-editor.org/rfc/rfc4380)).

Las técnicas de tunelización agregaron sobrecarga, redujeron el tamaño de la MTU y requirieron *backhauling* (transporte de retorno) para agregar latencia a través de una puerta de enlace a la red. También hubo muchas preocupaciones de seguridad sobre IPv6 durante este período inicial. Estos problemas dieron lugar a debates en el IETF sobre la desaprobación de los enfoques de tunelización dinámica.

Se tomaron medidas para degradarlos en las tablas de políticas de preferencias de selección de direcciones ([RFC 6724](https://www.rfc-editor.org/rfc/rfc6724) sección 2.1) en los sistemas operativos host.

Es por eso que los prefijos de IPv6 `2002::/16`, `2001::/32` tienen valores de precedencia bajos.

Ahora, Windows 10 y Windows Server 2019 tienen ISATAP (desde Creators Update – 1703) y 6to4 (desde Anniversary Update – 1607) deshabilitados de forma predeterminada.

Durante la etapa intermedia de la transición, la Guía de implementación de IPv6 empresarial predominante ([RFC 7381](https://www.rfc-editor.org/rfc/rfc7381)) ha sido implementar IPv6 para crear una red de protocolo dual.

Incluso hoy en día, algunas empresas están luchando para comenzar su viaje IPv6 y posponen sus implementaciones de protocolo dual.

Parece que algunas empresas están "jugando a la gallina" con el requisito de IPv6 que se acerca rápidamente y están retrasando la implementación.

Están en peligro de convertirse en la categoría de "rezagados tecnológicos" cuando se trata de IPv6.

Podrían estar retrasando por una variedad de razones, como la falta de talento o habilidades con IPv6, la incapacidad de articular los beneficios comerciales, las razones financieras u operativas para adoptar IPv6 u otras demoras no técnicas.

> [!info]- Mandato del gobierno de EE.UU.
> Esto es parte del pensamiento y la justificación detrás de algunos mandatos gubernamentales de IPv6.
>
> La Oficina de Administración y Presupuesto (OMB, por sus siglas en inglés) del gobierno federal de EE. UU. publicó un mandato en noviembre de 2020 (M-21-07) que vuelve a enfatizar la importancia de IPv6 para los departamentos y agencias gubernamentales y establece un cronograma para deshabilitar IPv4. El cronograma es tener un 20% solo de IPv6 para fines del año fiscal 2023, un 50% solo de IPv6 para fines del año fiscal 2024 y un 80% solo de IPv6 para fines del año fiscal 2025. La idea aquí es que en la etapa del 80%, Internet utilizará predominantemente IPv6. El estado de Washington tiene una "Política 300" de IPv6 para deshabilitar IPv4 a fines de 2025, y el gobierno chino tiene una meta de 100% de IPv6 para 2025.
>
> Obtenido de: `https://blogs.infoblox.com/ipv6-coe/ipv6-only-where-you-can-dual-stack-where-you-must/`

---
**Volver a:** [[08 - ICMPv6|ICMPv6]]

**Continuar a:** [[10 - Herramientas y Ejemplos Practicos|Herramientas y Ejemplos Prácticos]]
