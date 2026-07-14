---
title: "Diagnóstico de Red: Ping, ICMP y Traceroute"
---
## Ping

Una prueba de conectividad se puede realizar con el comando/aplicación **ping**: emite un **Echo Request** y espera recibir un **Echo Reply**.

> [!important] Echo Request / Echo Reply
> El Echo Request es un mensaje de control que se envía a un host esperando recibir de él un Echo Reply con exactamente los mismos datos. Esto es lo que conocemos como **ping**, una utilidad de **ICMP** (subprotocolo de IP). Todo host debe responder a un Echo Request con un Echo Reply.

Si se ejecuta `ping -c 3 <host>`, el argumento `-c 3` indica que se emitan 3 Echo Request. La salida muestra la cantidad de paquetes transmitidos, perdidos y el **RTT** (round trip time) mínimo, promedio y máximo.

> [!note] Ping no mide latencia "pura"
> El tiempo que muestra el ping suele asociarse a la latencia de la red, pero en realidad el ping es una **aplicación** y como todo proceso conlleva su propio tiempo de procesamiento. El indicador de ping es entonces la latencia **más** el procesamiento de la aplicación — aunque se lo use, erróneamente, como si fuera solo latencia.

**Ejemplo práctico** (laboratorio simulado con GNS3/Mikrotik): un ping exitoso a `8.8.8.8` frente a un ping a una IP mal escrita (`18.8.8.8`, en vez de `8.8.8.8`), que resulta en 100% de pérdida de paquetes — así se ve una falla de conectividad real:

![[gns3-topologia-mikrotik-ping-8-8-8-8.png]]

![[ping-8-8-8-8-exitoso-ttl117.png]]

![[ping-18-8-8-8-fallido-100-perdida.png]]

> [!important] Antes de poder hacer ping
> Para hacer ping a un nombre (ej. `www.google.com`) se realizan primero dos acciones:
> 1. **DNS:** se resuelve la IP correspondiente al nombre.
> 2. Se determina la **MAC del Gateway** para los paquetes que salen de la red local — usando alguno o todos estos métodos: [[06 - ARP|ARP]], [[09 - DHCP|DHCP]], subnetting (ver [[07 - Subredes|Subredes]]).
>
> Los mensajes de error de ICMP pueden a su vez contener errores: si hay un error en un datagrama que transporta un mensaje ICMP, **no se envía otro mensaje de error** por ese datagrama, para evitar un efecto "bola de nieve" en la red.

## Manual de Ping (resumen)

`ping` usa el datagrama ICMP **ECHO_REQUEST** para obtener un **ECHO_REPLY** de un host o gateway. Funciona con IPv4 e IPv6 (`-4`/`-6` para forzar uno).

| Flag | Función |
| --- | --- |
| `-c count` | Detener luego de enviar `count` paquetes ECHO_REQUEST. |
| `-i interval` | Esperar `interval` segundos entre cada paquete (por defecto, 1 segundo). |
| `-s packetsize` | Cantidad de bytes de datos a enviar (por defecto 56, = 64 bytes ICMP con el header). |
| `-t ttl` | Fijar el TTL del paquete IP saliente. |
| `-W timeout` | Tiempo a esperar por una respuesta. |
| `-R` | Registrar la ruta (Record Route) — la cabecera IP solo tiene lugar para 9 saltos, y muchos hosts la ignoran. |
| `-f` | Flood ping: envía paquetes tan rápido como sea posible (requiere privilegios para intervalo 0). |
| `-b` | Permite hacer ping a una dirección de broadcast. |

> [!info]- Detalle completo del manual
> Ver manual completo con `man ping`. Un dato relevante: el valor de TTL de los mensajes ICMP Echo suele fijarse en 255 en sistemas Unix modernos, por lo que a veces se puede "pinguear" un host aunque no se lo alcance con `telnet` o `ftp` (que usan TCP).

## ICMP v.4

**ICMP** (Internet Control Message Protocol, Protocolo de Mensajes de Control de Internet) detecta y registra condiciones de error en la red. Está definido en el **RFC 792** (y RFC 777).

> [!note] No confundir con IGMP
> **[[IGMP]]** (Internet Group Management Protocol) es un protocolo distinto: permite que varios dispositivos compartan una dirección IP usando direcciones multicast, para que todos reciban los mismos datos, y que los dispositivos se unan a un grupo de multidifusión.

ICMP permite registrar:

1. **Paquetes soltados:** llegan demasiado rápido para poder procesarse.
2. **Fallo de conectividad:** no se puede alcanzar un sistema de destino.
3. **Redirección:** redirige un sistema de envío para que use otro enrutador.

La herramienta **`netstat`** gestiona y supervisa el estado de interfaces, rutas y conexiones. `netstat -s` ("s" de *statistics*) muestra estadísticas por protocolo — IP, TCP, UDP e ICMP:

![[estadisticas-icmp-mensajes-recibidos-enviados.png]]

Los mensajes de error ICMP viajan encapsulados en un datagrama IP como cualquier otro dato:

![[relacion-ip-icmp-igmp-pila.png]]

![[datagrama-ipv4-con-datos-icmp-tipo-codigo.png]]

![[campos-icmp-tipo-codigo-suma-verificacion-es.png]]

> [!important] Campo Código (Code)
> - `0` = red inalcanzable (net unreachable)
> - `1` = host inalcanzable (host unreachable)
> - `2` = protocolo inalcanzable (protocol unreachable)
> - `3` = puerto inalcanzable (port unreachable)
> - `4` = se necesita fragmentación y el bit DF está activo
> - `5` = falló el encaminamiento desde el origen (source route failed)
>
> Los códigos 0, 1, 4 y 5 se suelen recibir del gateway; los códigos 2 y 3, de un host.

El campo **Type** identifica el tipo de mensaje ICMP (Echo Request/Reply, Time Exceeded, Destination Unreachable, etc.):

![[tabla-tipos-codigos-icmp-echo-traceroute.png]]

> [!tip] Aplicaciones que usan ICMP
> Tanto **ping** como **traceroute** utilizan ICMP.

## Comando Traceroute

`traceroute` imprime la ruta que tarda un paquete en llegar a un host — útil para conocer la ruta y todos los saltos que atraviesa un paquete:

![[ping-traceroute-google-30-hops-completo.png]]

- La **primera columna** es el número de salto (hop).
- La **segunda columna** es la dirección de ese salto.
- Le siguen **tres tiempos** en milisegundos: por defecto, traceroute envía 3 paquetes por salto, y cada tiempo es cuánto tardó ese paquete en llegar al salto.

## Ejemplos de uso de Traceroute

| Opción | Efecto |
| --- | --- |
| `-q <n>` | Cantidad de paquetes de sondeo (probe) por salto. Por defecto es 3. |
| `-F` | No fragmentar los paquetes de sondeo. |
| `-g <gateway>` | Trazar la ruta desde un gateway específico. |
| `-m <max_ttl>` | TTL máximo (cantidad máxima de saltos) a sondear. Por defecto es 30. |

![[traceroute-flag-q2.png]]

![[traceroute-flag-q5.png]]

![[traceroute-flag-q2-f.png]]

![[traceroute-flag-g-gateway.png]]

![[traceroute-flag-m2-q1.png]]

## Manual de Traceroute (resumen)

`traceroute` sigue la ruta de los paquetes IP hacia un host, usando el campo **TTL** e intentando obtener una respuesta ICMP **TIME_EXCEEDED** de cada gateway en el camino. Comienza con TTL=1 y lo incrementa de a uno, hasta recibir un "puerto inalcanzable" (o el destino) o alcanzar el máximo de saltos.

| Flag | Función |
| --- | --- |
| `-I`, `--icmp` | Usar ICMP Echo para los sondeos (en vez de UDP). |
| `-T`, `--tcp` | Usar TCP SYN para los sondeos (útil para atravesar firewalls). |
| `-n` | No resolver nombres de host, solo mostrar direcciones numéricas. |
| `-f first_ttl` | TTL inicial (por defecto, 1). |
| `-p port` | Puerto destino a usar (UDP/TCP) o valor ICMP inicial. |
| `-w max` | Tiempo máximo de espera por una respuesta (por defecto, 5 segundos). |

> [!info]- Detalle completo del manual
> Ver manual completo con `man traceroute`. Existen métodos alternativos (`-I` ICMP, `-T` TCP, `-U` UDP con puerto fijo) pensados para atravesar firewalls que filtran los puertos UDP "improbables" que usa el método tradicional.

---
**Volver a:** [[09 - DHCP|DHCP]]

**Continuar a:** [[Teoria/02 - IPv4/index#Preguntas de repaso|Preguntas de repaso]]
