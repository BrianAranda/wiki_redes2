---
title: Laboratorio N°2 - IPv6
fuente: "[[C. Laboratorio N°2 IPv6.pdf]]"
---
El presente laboratorio es muy similar al realizado anteriormente utilizando el protocolo IPv4 (ver [[02 - Laboratorio 1 - IPv4 GNS3|Laboratorio N°1 - IPv4 GNS3]]), pero esta vez configuraremos el Mikrotik para que trabaje con direcciones IPv6. Si el *router* no trae por defecto el protocolo, podemos actualizarlo.

Se relaciona con [[03 - Direcciones IPv6|Direcciones IPv6]], [[04 - Unicast|Unicast]], [[08 - Neighbor Discovery|Neighbor Discovery]] y [[10 - Direcciones Dinamicas|Direcciones Dinámicas]].

## Objetivos

Los objetivos del laboratorio son los siguientes:

- Familiarizar al alumno con la implementación física del protocolo, como ser su notación, direccionamiento, asignación de direcciones, salida a internet, etc.
- Poner en práctica las reglas de abreviatura de direcciones IPv6.
- Poder identificar los diferentes tipos de direcciones IPv6.
- Poder identificar las direcciones de red IPv6 de la interfaz *host*.
- Poder configurar un *router* Mikrotik para asignar direcciones IPv6.
- Poder asignar direcciones en una red local IPv6 de manera que los dispositivos estén interconectados y puedan tener acceso a internet.
- Poder identificar con Wireshark el protocolo ICMPv6: mensajes *Neighbor Solicitation* y *Neighbor Advertisement*.

## Listado de tareas a realizar

Se resumen las tareas a efectuar en los *routers*. Para los *router* de nivel 2, dependiendo la cantidad que coloquemos se deben repetir los pasos para cada uno de ellos.

1. Configurar *Router* de borde:
    1. Asignar manualmente la dirección *unicast* global.
    2. Ruta al GW de la facultad.
    3. Rutas a *routers* de nivel 2.
2. Configurar *Router* de nivel 2:
    1. Asignar manualmente la dirección *unicast* global.
    2. Asignar ruta por defecto hacia la interfaz *link-local* aguas arriba.
    3. Configurar ND para los *hosts*.

## *Routers*

En este laboratorio vamos a distinguir la denominación del *router* de acuerdo a dónde se utiliza el mismo, depende del sitio el *router* se encargará de tareas diferentes.

> [!important] ¿Qué es un *router* de borde/frontera?
> En telecomunicaciones al equipo *router* que se encuentra en la entrada a la red central (LAN) se le llama *router* de borde o fronterizo ya que es el equipo que, por así decirlo, separa la red WAN de una LAN. Estos equipos se encargan del enrutamiento BGP y ciertas configuraciones como [[NAT]], balanceo de carga, administrar diferentes tipos de tráfico, entre otras cosas. Estos equipos suelen o deben ser robustos ya que serán los que se encargan de todo el tráfico entrante y saliente de la WAN y así distribuirlo a los *router* de administración.
>
> En estos equipos se debe manejar la regla NAT de enmascaramiento ya que es el que se encuentra conectado con nuestro ISP y es con la IP con la que deberá salir el tráfico que venga de cualquiera de nuestras LAN.

> [!important] ¿Qué es un *router* de administración?
> Estos equipos son los que se encargan de administrar y gestionar los equipos de acceso de los equipos que se conectarán a nuestra red. Normalmente en estos equipos se lleva el control de ancho de banda, calidad de servicio (QoS), gestión y optimización de subredes. En estos equipos prácticamente se gestiona lo que viene siendo la LAN de nuestra red.

![[topologia-conceptual-routers.png|600]]

## Topología

### Aclaraciones

- Todos los pasos de este laboratorio fueron comprobados utilizando un *host* con Linux. También debería funcionar utilizando Windows.
- Los *routers* Mikrotik son totalmente compatibles con *dual-stack* (IPv4+IPv6). Se pueden implementar en simultáneo todo lo aprendido en IPv4 en conjunto con IPv6.
- Sin embargo, en este laboratorio utilizaremos solo IPv6 para afianzar mejor los conceptos.

### Descripción de la situación

Para los ensayos de IPv6 contamos con el siguiente prefijo `2803:70e0:101:6000::/56` accesible desde el Departamento de Electrónica. Por simplicidad, de este `/56` asignaremos un `/60` a cada *router* del nivel 2 y un `/64` a cada interfaz del mismo.

Por ejemplo, para el Router2 utilizaremos el dígito hexadecimal "2" por lo que le asignaremos el prefijo `2803:70e0:101:6020::/60`:

![[convencion-prefijo-router.png|350]]

A la LAN conectada a la interfaz `ether2`, de dicho *router*, se le asignará dígito hexadecimal "2" con lo que resulta el prefijo `2803:70e0:101:6022::/64`:

![[convencion-prefijo-lan.png|420]]

Además, a cada interfaz del *router* se le asignará manualmente la primera dirección de la red.

![[topologia-laboratorio-ipv6.png]]

> [!warning] Aclaración
> El *router* de borde (nivel uno) será **único** para el laboratorio, es decir un grupo o alumno se encargará de su configuración, y los demás configurarán *Routers* Nivel 2.

En principio los *routers* no necesitan una dirección única global para enrutar al próximo salto. Esto lo resuelven perfectamente con las direcciones de enlace local.

Recordemos que los *routers* no modifican las IP de origen ni de destino global, simplemente enrutan al próximo *router*, para lo cual necesitan la dirección MAC. La dirección MAC la pueden obtener con la dirección *link-local*.

Algunos autores incluso van más allá y recomiendan utilizar la misma dirección *link-local* para todas las interfases del *router* (`FE80::1`) debido a que es una dirección fácil de recordar y como todas las interfaces del *router* son una red separada no habría problemas porque, como sabemos, las direcciones de enlace local no se enrutan (ver [[04 - Unicast#Link Local Address (LLA)|Link Local Address]]).

![[link-local-fe80-1-todas-interfaces.png|350]]

> [!info]- Referencias sobre direcciones *link-local*
> - `https://blogs.infoblox.com/ipv6-coe/fe80-1-is-a-perfectly-valid-ipv6-default-gateway-address/`
> - `https://serverfault.com/a/549634`
> - `https://networkengineering.stackexchange.com/a/65826`
> - `https://labs.ripe.net/author/philip_homburg/whats-the-deal-with-ipv6-link-local-addresses/`
> - `https://zivaro.com/what-you-need-to-know-about-ipv6-link-local-addresses/`

> [!warning] Limitación de RouterOS
> Esto último **no se puede implementar en Mikrotik** ya que RouterOS no permite asignar manualmente direcciones *link-local*. Todas las direcciones de enlace local de los *routers* Mikrotik son generadas mediante [[04 - Unicast#EUI-64|EUI-64]]. Pero el concepto es el mismo y funciona de igual manera.

## Routers configuración

### WinBox

Se recomienda, como primer paso, reiniciar todos los *router* a su estado de fábrica (ver el reseteo en [[03 - Laboratorio 1 - IPv4 Fisico#Reseteando dispositivos|Laboratorio N°1 - IPv4 Físico]]).

Durante este proceso **evite cargar la configuración por defecto**. De esta manera nos aseguramos de que no exista alguna configuración subyacente que pueda interferir con la nuestra.

![[winbox-remove-configuration.png]]

> [!note] Nota
> En el caso de que no nos haya aparecido este diálogo, debemos borrar la configuración. Podemos hacerlo reiniciando el dispositivo desde Winbox y tildando la casilla de no cargar configuración por defecto.

Un *router* sin configuración (en blanco) será detectado luego de un tiempo por el WinBox.

![[winbox-neighbors-link-local.png]]

Observe que no tiene asignada ninguna dirección IPv4 y solo posee la dirección IPv6 *link-local* (comienza con `FE80`) generada por EUI-64. Utilizaremos la dirección IPv6 para conectarnos al *router*.

Nótese la nomenclatura de la dirección IPv6 entre corchetes `[` y `]`. El último número, después del `%`, es el índice de la interfaz que el sistema operativo le asigna a la interfaz de red (ver [[03 - Direcciones IPv6#Direcciones IPv6 en URLs|Direcciones IPv6 en URLs]]).

- En **Linux**: `sudo ip add` debería mostrar el índice que asigna Linux a la interfaz de red.
- En **Windows**, para saber qué nro. de índice le asigna a la interfaz de red podemos ejecutar desde una terminal:

```
netsh interface ipv6 show interfaz
```

### Direcciones

En la versión 7.4.1 de RouterOS ya está instalado por defecto el paquete de IPv6. Todas las configuraciones de este laboratorio se van a llevar a cabo en ese menú.

## Router de Borde

### Direcciones

Durante el laboratorio, al tener una única dirección asignada, existirá un único *router* de borde, por lo que un grupo se encargará de su administración y los otros configurarán los *Router* de nivel 2.

Una vez conectados al *router* de borde, asignamos la dirección *global-unicast* estática a la interfaz `ether1` conectada a la nube de la facultad. Esta única dirección fue asignada por la gente de redes de la facultad:

```
2803:70e0:101:f300::2/126
```

![[borde-new-ipv6-address.png]]

> [!warning] Desmarcar EUI64 y Advertise
> Al ser una IP estática hay que desmarcar la opción **EUI64**. También hay que desmarcar la opción **Advertise** debido a que no se puede anunciar direcciones con prefijo mayor a `/64`; si lo hiciéramos, las IPv6 asignadas no estarían dentro del rango que nos brinda el proveedor (Facultad de Ingeniería).

![[borde-address-list.png]]

La "G" que aparece a la izquierda significa **Global**. Como ya mencionamos, las direcciones *link-local* se generan automáticamente utilizando EUI-64.

### Rutas

En el *router* de borde debemos agregar una ruta estática correspondiente al GW por defecto (salida hacia la nube). Esta información también es brindada por la gente de redes:

```
2803:70e0:101:f300::1
```

Esto se realiza en el menú **Routes** de IPv6.

![[borde-ruta-default.png]]

La dirección de destino es `::/0` que significa todos los *host* de todas las redes y es equivalente a la IPv4 `0.0.0.0`. En **Gateway** se indica la dirección del próximo salto y por qué interfaz se llega a la misma: `2803:70e0:101:f300::1%ether1`.

Además tendremos que agregar una ruta a cada *router* que esté en el nivel 2 (Router2, Router3, etc.).

![[borde-ruta-router2.png]]

En el ejemplo agregamos la ruta para el Router 2, la dirección de destino es la adoptada por nuestra convención. En este caso el dígito 2 porque se trata del Router 2 y un prefijo `/60`.

El *gateway* es la IP *link-local* de la interfaz del Router2 (`ether1`) conectada al *Router* de nivel 1, seguida de la interfaz del *Router* de Borde por la cuál se llega a esa IP (`ether2`). Para esto debemos ver qué dirección IP ha tomado el Router 2 en este caso, ya sea conectándonos al mismo, o desde el menú del dispositivo.

![[borde-route-list.png]]

En este ejemplo solo se agregaron las rutas del GW por defecto y la correspondiente al Router2. Restaría agregar las rutas a los *Routers* adicionales.

## Routers Nivel 2

Las configuraciones de los *Routers* serán similares, solamente variaremos los bits adoptados por la convención; su finalidad es simplificar las configuraciones y, ya que no utilizaremos todas las direcciones posibles, podemos dejar algunas sin afectar para simplificar la tarea.

A continuación vemos en el esquema cómo serían las direcciones para los Router 2 y Router 3. Observe el índice adoptado para *Router* y para Interfaz.

![[esquema-routers-nivel2.png]]

![[convencion-indices-router-interfaz.png|450]]

Para cada *Router* tenemos lo siguiente a configurar:

- En el *Router* de borde:
    - Agregar ruta desde *Router* de borde hacia *Router* de administración.
- En el *Router* de administración:
    - Agregar direcciones globales a cada interfaz que va a enrutar una LAN.
    - Agregar la ruta por defecto de todas las redes.
    - Configurar ND.

### Router 2

Configuraremos el Router 2. Para ello recordamos la convención adoptada para las interfaces del *Router*:

![[convencion-indices-router-interfaz.png|450]]

#### Direcciones

En el ejemplo asignamos la IP *unicast* global a la interfaz `ether2`. De nuestra convención: `2803:70e0:101:6022::/64`.

![[router2-new-ipv6-address.png]]

Se marca la opción **Advertise**, para que los *host* que se conecten a este *router* puedan obtener los datos mediante ND. Se debe habilitar la configuración de direcciones sin estado. El prefijo de esa dirección se anuncia automáticamente a los *hosts* que utilizan el protocolo ICMPv6. La opción está configurada de forma predeterminada para direcciones con longitud de prefijo 64.

> [!note] Nota
> Se desmarca la opción **EUI64**, para establecer una dirección específica, fácil de recordar. La [RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291) dice:
>
> *El "prefijo de subred" en una dirección anycast es el prefijo que identifica un enlace específico. Esta dirección anycast es sintácticamente lo mismo que una dirección de unicast para una interfaz en el enlace con el identificador de interfaz puesto a cero.*
>
> *Los paquetes enviados a la dirección anycast del enrutador de subred se entregarán a un enrutador en la subred. Todos los enrutadores deben admitir las direcciones anycast de Subred-Router para las subredes a las que tienen interfaces.*
>
> *La dirección anycast del enrutador de subred está destinada a utilizarse para aplicaciones donde un nodo necesita comunicarse con cualquiera del conjunto de enrutadores.*
>
> Ver [[06 - Anycast|Anycast]].

Como es una dirección *unicast* global marcamos **Advertise** para que los *host* de esa LAN puedan obtener el prefijo mediante el mecanismo ND ([[08 - Neighbor Discovery|Neighbor Discovery]]).

![[router2-address-list.png]]

Repetimos el procedimiento para la cantidad de LAN/*interface* de salida que tengamos, siempre modificando el subíndice correspondiente a la *interface*.

#### Rutas

Como ya no quedan *routers* "aguas abajo" solo será necesario agregar la ruta por defecto.

![[router2-ruta-default.png]]

El destino de la ruta es `::/0` y el GW es la dirección *link-local* de la interfaz, a la que está conectado este *router*, del *router* del nivel superior (*router* de borde), seguido de la interfaz local por la que se llega al *router* de nivel superior.

![[router2-route-list.png]]

#### Neighbor Discovery

A los *host* no se les impondrá una dirección IP, solo se les proveerá, entre otras cosas, el prefijo de red y longitud del prefijo. Por ello no hace falta un servidor DHCPv6. Cada *host* deberá generar el identificador de interfaz de la dirección IP que le corresponde para completar la IPv6 *unicast* global. Esto lo podrá realizar por EUI-64 o de forma aleatoria. Este proceso se conoce como SLAAC (*Stateless Address AutoConfiguration*, ver [[10 - Direcciones Dinamicas#SLAAC|SLAAC]]).

Los *routers* anuncian el prefijo de red, la longitud del prefijo, el GW y los DNS utilizando el mecanismo de *Neighbor Discovery* (ND). Por defecto ya se crea un servicio de ND, solo faltaría agregarle los DNS que queramos: `2001:4860:4860::8844` y `2001:4860:4860::8888`.

![[router2-neighbor-discovery.png]]

### Router 3 y otros

Se deja al alumno realizar esta configuración. Resumimos las direcciones para los Router 3 y 4, para las primeras 3 interfaces, adoptando nuestra convención:

| *Router*  | Interface 2                | Interface 3                | Interface 4                |
| --------- | -------------------------- | -------------------------- | -------------------------- |
| Router 3  | `2803:70e0:101:6032::/64`  | `2803:70e0:101:6033::/64`  | `2803:70e0:101:6034::/64`  |
| Router 4  | `2803:70e0:101:6042::/64`  | `2803:70e0:101:6043::/64`  | `2803:70e0:101:6044::/64`  |

## Hosts

Para que los clientes adquieran la configuración IPv6 del *router* hay que asegurarse de que esté seleccionada la opción "automática" (DHCPv6).

![[host-configuracion-obtenida.png|550]]

Nótese que la ruta predeterminada es una dirección *link-local*. Esto a pesar de que la interfaz del *router*, a la que se conecta el *host*, posee una dirección *unicast* global. Recordamos que la IP de la ruta predeterminada se utiliza solo para adquirir la dirección de capa 2 y esto es totalmente factible con la IP *link-local*.

## ping

Si los *host* obtuvieron su dirección ahora estaríamos en condiciones de comprobar la conectividad entre ambos, podemos hacerlo realizando el comando con la dirección del *host* asignada:

```
ping -6 direccion de host
```

Y para comprobar la conectividad, un ping a Google, donde para IPv6 sus direcciones son `2001:4860:4860::8888` o `2001:4860:4860::8844`:

![[ping6-google.png]]

## Análisis con Wireshark

Ahora vamos a capturar los paquetes que transmite el *router* con un *host*, para observar los mensajes de ND. Para ello podemos utilizar el siguiente filtro, para filtrar específicamente los paquetes de RA y RS:

```
icmpv6.type == 133 y icmpv6.type == 134
```

> [!info] Tipos ICMPv6 del filtro
> El `type = 133` corresponde a [[08 - Neighbor Discovery#*Router Solicitation* (RS)|Router Solicitation]] y el `type = 134` a [[08 - Neighbor Discovery#*Router Advertisement* (RA)|Router Advertisement]].

![[wireshark-router-advertisement.png]]

> [!note] Sobre la captura
> La captura de la guía corresponde a otra red (prefijo `2003:50:aa10:4243::/64`), distinta del direccionamiento `2803:70e0:101:60xx` usado en este laboratorio. Sirve igual para ilustrar los campos del mensaje RA: la *flag* **Other configuration** activada y la opción *Prefix Information* con el prefijo que los *hosts* usan para su autoconfiguración.

## Preguntas

> [!question] ¿Cuántas interfaces pueden haber en una red IPv6 con prefijo `/126`?

> [!question] ¿Para qué sería necesario que a un *router* intermedio (sin conexión directa a una LAN) se le asigne una dirección global *unicast*?

> [!question] ¿Cómo es posible que los *host* naveguen en internet si no se configuró NAT/*masquerade*?

---
**Volver a:** [[04 - Ejercicios IPv6|Ejercicios IPv6]]
