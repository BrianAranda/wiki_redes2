---
title: ICMPv6
---
El protocolo [[ICMP|ICMPv6]] es utilizado por los nodos IPv6 para detectar errores encontrados en la interpretación de paquetes y para realizar otras funciones de la capa de internet, como el diagnóstico (ICMPv6 ping).

El protocolo ICMPv6 incorpora la función de descubrimiento de vecinos, que en IPv4 realiza el protocolo [[07 - ARP|ARP]]. Dentro de esta funcionalidad se incorpora el descubrimiento de enrutadores que incluso permite la configuración automática de las direcciones globales (ver [[06 - Neighbor Discovery ND|Neighbor Discovery ND]]).

A través de esta funcionalidad de descubrimiento de vecinos y de enrutadores, un equipo conectado a la red con una dirección de enlace local puede descubrir el enrutador que está en su misma red y obtener el prefijo global asignado a la red.

Los paquetes ICMPv6 tienen el formato **Tipo, Código y Checksum**.

![[formato-mensaje-icmpv6.png]]

Los 8 bits del campo Tipo indican el tipo de mensaje. Si el bit de mayor peso tiene el valor 0 (valores entre 0 y 127) entonces es un mensaje de error; por el contrario, si el bit de mayor peso es 1 (valores entre 128 y 255) entonces es un mensaje informativo.

Los 8 bits del campo Código dependen del tipo de mensaje, y son usados para crear un **nivel adicional de clasificación** de mensajes, de tal forma que los mensajes informativos en función del campo Código se pueden subdividir en varios tipos.

A modo de ejemplo, si Type=1 ⇒ Destino Inalcanzable, en campo de Code podría tener:

| Type | Type Description | Code y Code Description |
| --- | --- | --- |
| 1 | Destination Unreachable | 0: No route to destination |
| | | 1: Communication with destination administratively prohibited |
| | | 2: Beyond scope of source address |
| | | 3: Address unreachable |
| | | 4: Port unreachable |
| | | 5: Source address failed ingress/egress policy |
| | | 6: Reject route to destination |

El campo Checksum es usado para detectar errores en los mensajes ICMP y en algunos de los mensajes IPv6.

## Mensajes de Error

Los mensajes de error de ICMPv6 son similares a los mensajes de error de ICMPv4. Se dividen en 4 categorías: destino inaccesible, paquete demasiado grande, tiempo excedido y problemas de parámetros.

1. Destination Unreachable (Destino Inalcanzable).
2. Packet Too Big (Paquete Demasiado Grande).
3. Time Exceeded (Tiempo Agotado).
4. Parameter Problem (Problema de Parámetros).

## Mensajes Informativos

El segundo tipo de mensajes ICMP son los mensajes informativos. Estos mensajes se subdividen en tres grupos: mensajes de diagnóstico, mensajes para la administración de grupos multicast y mensajes de Neighbor Discovery.

- 128 Echo Request (Solicitud de Eco)
- 129 Echo Reply (Respuesta de Eco)

Cada mensaje ICMPv6 está precedido por una cabecera IPv6 y cero o más extensiones de cabecera IPv6. La cabecera ICMPv6 es identificada por un valor **58** en "Cabecera Siguiente" en la cabecera inmediatamente predecesora. (Nota: el valor del campo "Cabecera Siguiente" es distinto del valor utilizado para identificar ICMP para IPv4).

## Determinación de la Dirección de un Paquete

Cuando un nodo envía un mensaje ICMPv6 debe especificar las direcciones IPv6 origen y destino en la cabecera del paquete antes de calcular el checksum. Si el nodo tiene más de una dirección unicast, éste debe elegir la dirección origen como sigue:

(a) Si el mensaje es una respuesta a un mensaje enviado a una de las direcciones unicast del nodo, la dirección origen de la respuesta debe ser esa misma dirección.

(b) Si el mensaje es una respuesta a un mensaje enviado a cualquier otra dirección, tal como:
- una dirección de un grupo multicast,
- una dirección anycast implementada por el nodo, o
- una dirección unicast que no pertenece al nodo.

La dirección origen del paquete ICMPv6 debe ser una dirección unicast perteneciente al nodo. La dirección debería ser elegida de acuerdo con las reglas que serán utilizadas para seleccionar la dirección origen de cualquier paquete originado por el nodo, dada la dirección de destino del paquete. Sin embargo, debería ser seleccionada en una forma alternativa si va a derivar en una opción más informativa de la dirección accesible desde el destino del paquete ICMPv6.

Como veremos más adelante, los mensajes de ICMPv6 permiten implementar un mecanismo llamado Neighbor Discovery que reemplaza al ARP de IPv4.

## ICMP Accesibilidad al Host

El protocolo ICMP es utilizado en una herramienta de diagnóstico (aplicación) que se llama **ping**.

Permite diagnosticar el estado, velocidad y calidad de una red determinada y utiliza el envío de paquetes ICMP de solicitud (ICMP Echo Request) y de respuesta (ICMP Echo Reply). Muchas veces se utiliza para medir la latencia o tiempo que tardan en comunicarse dos puntos remotos, y por ello se utiliza el término PING para referirse al retardo o latencia (en inglés, *lag*) de la conexión en los juegos en red, esto daría una idea de congestión, por ejemplo.

Veamos unos ejemplos de ping a `www.google.com`:

```
The response for 'www.google.com' using IPv6 is:PING www.google.com(nuq04s43-in-x04.1e100.net) 56 data bytes
64 bytes from nuq04s43-in-x04.1e100.net: icmp_seq=1 ttl=120 time=1.40 ms
64 bytes from nuq04s43-in-x04.1e100.net: icmp_seq=2 ttl=120 time=1.58 ms
64 bytes from nuq04s43-in-x04.1e100.net: icmp_seq=3 ttl=120 time=1.46 ms
64 bytes from nuq04s43-in-x04.1e100.net: icmp_seq=4 ttl=120 time=1.54 ms
64 bytes from nuq04s43-in-x04.1e100.net: icmp_seq=5 ttl=120 time=1.82 ms

--- www.google.com ping statistics ---
5 packets transmitted, 5 received, 0% packet loss, time 4005ms
rtt min/avg/max/mdev = 1.404/1.564/1.823/0.145 ms
```

En este caso la utilidad ping hizo solo "5 pings" y podemos ver que al finalizar muestra un detalle que es el que permite obtener información o inferir el estado de la red contra `www.google.com`.

Podemos ver que el ping se hace a un Nombre (`www.google.com`) así que es de esperar que se realice una resolución de nombres previo al ping.

## 15.1. MTU Discovery Packet Too Big

Como sabemos, IPv6 no fragmenta en el camino, es por eso que debe conocer el MTU máximo a lo largo del camino para que no tenga que fragmentar; bueno, ICMPv6 hace este trabajo.

*Path MTU Discovery* es definido en [RFC 1981](https://www.rfc-editor.org/rfc/rfc1981), llamado *Path MTU Discovery for IP version 6*.

El MTU Discovery se realiza en 4 pasos.

![[mtu-discovery-packet-too-big.png]]

**Paso 1:** el equipo de origen asume que el MTU es igual al MTU del primer router de la red o de la interfaz de red; en este caso es una Ethernet, por lo que se toma como 1500.

**Paso 2:** en este caso el paquete de R1→R2 tiene un MTU menor (1350 < 1500), entonces el paquete es descartado por R2, y genera un mensaje de **ICMPv6 Packet Too Big** e indica que el MTU es de 1350. Esto llega a R1 y luego al Origen, que se da por enterado de que ese MTU de 1500 no es el que debe usar.

**Paso 3:** el origen se da por enterado y reduce el tamaño del paquete, para que pueda coincidir con MTU de 1350, y lo vuelve a transmitir como dos paquetes con el código 44 en el campo *extension header* que indica que es un fragmento de un mensaje más grande.

> [!note] Nota
> Recordar que MTU mínimo de 1280 octetos en IPv6, no hablamos del tamaño mínimo del campo de datos del datagrama. Este valor está fijado por la norma y tiene que ver con el mínimo valor para ser eficiente; recordar que enlaces punto a punto (no Ethernet) pueden tener valores distintos de 1500.

**Paso 4:** si hubiera más routers en el camino, el proceso continuaría hasta llegar a encontrar el mínimo MTU desde origen a destino, siempre siendo mayor que 1280.

---
**Volver a:** [[07 - Direcciones Dinamicas|Direcciones Dinámicas]]

**Continuar a:** [[09 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]
