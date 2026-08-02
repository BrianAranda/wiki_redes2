---
title: ICMPv6
fuente:
  - "[Fundamentos IPv6 Cisco](https://cloud.fio.unam.edu.ar/index.php/s/kfroJFkzy5YNi59?dir=/&editing=false&openfile=true)"
  - "[RFC 4443](https://www.rfc-editor.org/info/rfc4443/)"
---
> Esto se desarrolla en el capítulo 12 del libro (Pág. 347)

> Esto originalmente estaba en el final de IPv6 pero lo moví mucho antes para dar contexto previo de ND, así mismo se hace en los libros y guías.

IPv6 utiliza el *Internet Control Message Protocol* (ICMP) tal y como se define para IPv4 (Ver [[12 - Diagnostico de Red#ICMPv4|ICMPv4]]), con una serie de modificaciones. El protocolo resultante se denomina ICMPv6 y tiene un valor de [[02 - Cabecera IPv6#*Extension Headers*|Extension Header]] de 58 (diferente al de ICMP para IPv4).

Los nodos IPv6 utilizan ICMPv6 para notificar los errores que se producen durante el procesamiento de paquetes y para realizar otras funciones de la capa de Internet, como el [[#ping6|diagnóstico]] o [[08 - Neighbor Discovery|Neighbor Discovery]].

Los mensajes ICMPv6 tienen el siguiente formato general:

```
0                   1                   2                   3
0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|     Type      |     Code      |          Checksum           |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                                                             |
+                         Message Body                        +
|                                                             |

```

Donde: 
- `Type` (8 bits) indica el tipo de mensaje. Su valor determina el formato del resto de los datos.
- `Code` (8 bits) depende del tipo de mensaje. Se utiliza para crear un nivel adicional de granularidad del mensaje. Por ejemplo, si el tipo de mensaje es destino inaccesible, el campo código indica el motivo específico por el que el paquete no pudo llegar. 
- `Checksum` (16 bits) se utiliza para detectar la corrupción de datos en el mensaje ICMPv6 y en partes de la cabecera IPv6.

Ejemplo relación entre el campo `type` y `code` para *Destination Unreachable*:

| *Type*                         | *Code*                                                            |
| ------------------------------ | ----------------------------------------------------------------- |
| `1`: *Destination Unreachable* | `0`: *No route to destination*                                    |
|                                | `1`: *Communication with destination administratively prohibited* |
|                                | `2`: *Beyond scope of source address*                             |
|                                | `3`: *Address unreachable*                                        |
|                                | `4`: *Port unreachable*                                           |
|                                | `5`: *Source address failed ingress/egress policy*                |
|                                | `6`: *Reject route to destination*                                |

> [!important] Clases de mensajes ICMPv6
> Los mensajes ICMPv6 se agrupan en dos clases: mensajes de **error** e **informativos**. Los mensajes de error se identifican con un **cero** en el bit de orden superior del campo `type` (entre 0 y 127). Mientras que, los mensaje informativos, tienen un **uno** (entre 128 y 255).

## Mensajes de Error

> No se aborda cada uno por completo, están descriptos en el [RFC 4443 sección 3](https://www.rfc-editor.org/info/rfc4443/#section-3) y en el libro de Cisco a partir de la pág. 352 en el capítulo 12.

Los mensajes de error de ICMPv6 son similares a los mensajes de error de ICMPv4. Se dividen en:

- `type = 1` *Destination Unreachable* (Destino Inalcanzable).
- `type = 2` *Packet Too Big* (Paquete Demasiado Grande).
- `type = 3` *Time Exceeded* (Tiempo Agotado).
- `type = 4` *Parameter Problem* (Problema de Parámetros).

### *Packet Too Big*

> Definido en el libro de Cisco pág. 355 (cap. 12) y [RFC 4443 sección 3.2](https://www.rfc-editor.org/info/rfc4443/#section-3.2).

IPv6 elimina la tarea de fragmentación del *router*, permitiendo que solo el origen del paquete la realice. Cuando un *router* IPv6 tiene que reenviar un paquete con MTU mayor a la de la interfaz de salida, se desecha el paquete y se envía un mensaje ICMPv6 *Packet Too Big* (Paquete demasiado grande) a la fuente. El mensaje incluye el tamaño de la MTU del enlace en bytes, de modo que fuente pueda modificar el tamaño del paquete para su retransmisión.

> [!note] Nota
> Un *router* **si puede fragmentar** un paquete IPv6 cuando es el origen del mismo.

A diferencia de la mayoría de los mensajes de error ICMPv6, que no deben generarse en respuesta a un paquete cuyo destino era una dirección *multicast* IPv6 o un *multicast*/*broadcast* de capa de enlace (para evitar que múltiples receptores respondan simultáneamente al origen y generen una sobrecarga de tráfico), el mensaje *Packet Too Big* es una excepción, se envía igualmente.

Lo anterior se debe a que este mensaje es la base del mecanismo de *Path MTU Discovery*, donde si un *router* descartara el paquete sin notificarlo, el origen nunca conocería la necesidad de reducir el tamaño de sus paquetes hacia ese destino, y el mecanismo dejaría de funcionar para el tráfico *multicast*. Por eso se prioriza el correcto funcionamiento de este mecanismo por sobre el riesgo de sobrecarga que la regla general busca evitar en los demás casos.

#### *Path* MTU *Discovery*

> Definido en el [RFC 1981](https://www.rfc-editor.org/info/rfc1981/) y actualizado en el [RFC 8201](https://www.rfc-editor.org/info/rfc8201/) pero se toman los pasos del Cisco.

Cuando un dispositivo tiene que transmitir un gran número de paquetes, es preferible que estos paquetes sean lo más grandes posible, de modo que se tengan que enviar menos paquetes. Para ello, es necesario que la fuente conozca la MTU mínima de todos los enlaces de la ruta hasta el destino. De este modo, el remitente puede transmitir el paquete de mayor tamaño posible, sin el riesgo de que un enrutador descarte el paquete a lo largo de la ruta porque el MTU de su enlace de salida sea demasiado pequeño. El tamaño de este paquete se denomina *path* MTU (PMTU).

> [!info]- Pasos para *Path* MTU *Discovery*
> Los pasos para realizar el *Path* MTU *Discovery* son:
>
> ![[pasos_pmtu.png|600]]
> 
> **Paso 1:** El equipo de origen asume que el *Path* MTU es igual al MTU del primer router de la red o de la interfaz de red; en este caso es una *Ethernet*, por lo que se toma como 1500.
> 
> **Paso 2:** Llegado a R2 se tiene un MTU menor (1350 < 1500), entonces el paquete es descartado y se genera un mensaje de **ICMPv6 Packet Too Big** que indica que el MTU es de 1350. Esto llega a R1 y luego al origen, que se da por enterado de que ese MTU de 1500 no es el que debe usar.
> 
> **Paso 3:** El origen se da por enterado y reduce el tamaño del paquete, para que pueda coincidir con MTU de 1350, y lo vuelve a transmitir como dos paquetes con el código 44 en el campo *extension header* que indica que es un fragmento de un mensaje más grande.
> 
> **Paso 4:** Si hubiera más *routers* en el camino, el proceso continuaría hasta llegar a encontrar el mínimo MTU desde origen a destino, siempre siendo mayor que 1280.

## Mensajes Informativos

> No se aborda cada uno por completo, están descriptos algunos en el [RFC 4443 sección 4](https://www.rfc-editor.org/info/rfc4443/#section-4) y otros en el libro de Cisco comenzando en la pág. 361 (Cap. 12) y otros en los capítulos 7 y 13.

Los mensajes ICMP informativos son utilizados para distintos propósitos, se pueden subdividir en tres grupos:

* Para diagnóstico:
    * `type = 128` *Echo Request* (Solicitud de Eco)
    - `type = 129` *Echo Reply* (Respuesta de Eco)
* Para administrar grupos *multicast* (no vemos esto):
    * *Multicast Listener Query*
    - *Multicast Listener Report*
    - *Multicast Listener Done*
* Para [[08 - Neighbor Discovery|Neighbor Discovery]].:
    * Router Solicitation message
    - Router Advertisement message
    - Neighbor Solicitation message
    - Neighbor Advertisement message
    - Redirect message

### ping6

La herramienta [[12 - Diagnostico de Red#Comando Ping|ping]], ya vista para IPv4, funciona igual sobre ICMPv6 usando estos mismos mensajes *Echo Request*/*Echo Reply*. Para forzar su uso sobre IPv6 se puede usar `ping6` o `ping -6` desde la terminal de Linux.

> [!note] Nota histórica
> A partir de la versión `s20150815` de `iputils`, el binario `ping6` ya no existe: fue fusionado dentro de `ping`. Crear un enlace simbólico llamado `ping6` que apunte a `ping` da la misma funcionalidad que antes.

`ping` también puede enviar *IPv6 Node Information Queries* ([RFC 4620](https://www.rfc-editor.org/rfc/rfc4620)). Los saltos intermedios pueden no estar permitidos, porque el enrutamiento de origen (*source routing*) de IPv6 fue declarado obsoleto ([RFC 5095](https://www.rfc-editor.org/rfc/rfc5095)).

A diferencia de IPv4, al hacer *ping* a una dirección de alcance *link-local* hay que indicar la interfaz de salida, ya sea con la notación `%` en el destino (ej. `fe80::1%eth0`) o con la opción `-I interface`.

## Determinación del origen del paquete

Cuando un nodo envía un mensaje ICMPv6 debe especificar las direcciones IPv6 origen y destino en la cabecera del paquete antes de calcular el *checksum*. Si el nodo tiene más de una dirección *unicast*, éste debe elegir la dirección origen de la siguiente manera:

1. Si el mensaje es una respuesta a un mensaje enviado a una de las direcciones *unicast* del nodo, la dirección origen de la respuesta debe ser esa misma dirección.
2. Si el mensaje es una respuesta a un mensaje enviado a cualquier otra dirección, como por ejemplo grupo *multicast*, una *anycast* o *unicast* que no sea del nodo; la dirección de origen del paquete debe ser una dirección *unicast* del nodo.

La dirección origen del paquete ICMPv6 debe ser una dirección unicast propia del nodo. Por defecto, se elige aplicando las mismas reglas de selección de dirección origen que el nodo usaría para cualquier otro paquete que envía, tomando como referencia la dirección de destino del mensaje ICMPv6 (es decir, quien va a recibir el error). 

Sin embargo, el nodo puede elegir otra dirección propia si eso le da al receptor una pista más útil sobre dónde se originó el problema. Por ejemplo, usar la dirección de la interfaz donde se detectó la falla en lugar de la interfaz más cercana al destino, para que quien recibe el error pueda identificar mejor en qué punto de la red ocurrió el problema.

---
**Volver a:** [[06 - Anycast|Anycast]]

**Continuar a:** [[08 - Neighbor Discovery|Neighbor Discovery ND]]