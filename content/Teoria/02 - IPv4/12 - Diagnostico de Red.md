---
title: Diagnóstico de Red
fuente:
  - "[RFC 792](https://www.rfc-es.org/rfc/rfc0792-es.txt)"
---
> **Nota**: Las capturas a continuación son de la *PowerShell* de Windows, no de Linux. El fin de la imagen es la misma, pero difieren lo mostrado según el sistema operativo.

> **Nota:** La cátedra hace todo en Linux, como no lo tengo instalado ni a mano lo hago desde Windows, **pueden** cambiar los comandos y lo visual, mas no los resultados.
## ICMPv4

**ICMP** (*Internet Control Message Protocol*) o Protocolo de Mensajes de Control de Internet se utiliza para detectar y registrar condiciones de error en la red. Está definido en el RFC 792 y 777.

> [!quote] Definición de ICMP
> Ocasionalmente, una *gateway* o un *host* de destino se comunicará con un *host* de origen para, por ejemplo, informar de un error en el procesamiento de datagramas. El Protocolo de Mensajes de Control Internet (ICMP) se usa para este propósito.

> [!warning] No confundir con IGMP
> **[[IGMP]]** (*Internet Group Management Protocol*) es un protocolo distinto: permite que varios dispositivos compartan una dirección IP usando direcciones *multicast*, para que todos reciban los mismos datos, y que los dispositivos se unan a un grupo de multidifusión.

ICMP permite registrar:

1. **Paquetes soltados:** llegan demasiado rápido para poder procesarse.
2. **Fallo de conectividad:** no se puede alcanzar un sistema de destino.
3. **Redirección:** redirige un sistema de envío para que use otro enrutador.

El Protocolo Internet no está diseñado para ser absolutamente fiable. El propósito de estos mensajes de control **no es hacer a IP fiable**, sino suministrar información sobre los problemas en el entorno de comunicación. Sigue sin garantizarse que un datagrama sea entregado o que se devuelva un mensaje de control.

Típicamente, los mensajes ICMP informan de errores en el procesamiento de datagramas. Para evitar la generación sin fin de mensajes acerca de mensajes, **no se envían mensajes ICMP acerca de mensajes ICMP**.  Además sólo se envían mensajes ICMP acerca de errores en e procesamiento del primer fragmento de un datagrama fragmentado.

Mediante la herramienta **`netstat`** podemos gestionar y supervisar el estado de interfaces, rutas y conexiones. Con `netstat -s` ("s" de *statistics*) podemos mostrar las estadísticas por protocolo IP, TCP, UDP e ICMP. Por ejemplo para ICMPv4 tenemos:

![[icmp_netstat.png]]

### Formato de mensajes ICMPv4

Los mensajes de error ICMP viajan encapsulados en un datagrama IP como cualquier otro dato. Si bien utiliza el soporte básico de IP, como si se tratara de un protocolo de nivel superior, ICMP es realmente una parte **integrante** de IP, y debe ser implementado por todo módulo IP.

Los mensajes ICMPv4 se envían usando la [[04 - Cabecera IPv4|Cabecera IPv4]] básica y en el primer octeto de la parte de datos del datagrama se tiene el campo de **tipo ICMP**; el cual determina el formato del resto de los datos. De manera general se tienen los campos:

1. Tipo (8 bits)
2. Código (8 bits)
3. Suma de verificación (16 bits)
4. Datos sobre la cabecera

Sin abordar en profundidad la mensaje ICMP destaco:

> [!important] Campo Tipo
> Identifica el tipo de mensaje ICMP con distintas funcionalidades, entre ellos:
>- *Echo Request/Reply* utilizado para el [[12 - Diagnostico de Red#Ping|ping]] y [[12 - Diagnostico de Red#Comando Traceroute|traceroute]]
>- *Time Exceded* utilizado para [[04 - Cabecera IPv4#Tiempo de Vida o TTL|TTL]] y tiempo de [[05 - Fragmentacion#Reensamblado|reensamblado]]
>- *Destination Unreachable* para problemas de enrutamiento

> [!important] Campo Código
> - `0` = red inalcanzable (*net unreachable*)
> - `1` = host inalcanzable (*host unreachable*)
> - `2` = protocolo inalcanzable (*protocol unreachable*)
> - `3` = puerto inalcanzable (*port unreachable*)
> - `4` = se necesita fragmentación y el bit DF está activo
> - `5` = falló el encaminamiento desde el origen (*source route failed*)
>
> Los códigos 0, 1, 4 y 5 se suelen recibir del *gateway*; los códigos 2 y 3, de un *host*.

## Comando Ping

Una prueba de conectividad se puede realizar con el comando/aplicación **ping**, el cual emite un ***Echo Request*** y espera recibir un ***Echo Reply***.

> [!important] *Echo Request / Echo Reply*
> El *Echo Request* es un mensaje de control que se envía a un host esperando recibir de él un *Echo Reply* con **exactamente los mismos datos**. Esto es lo que conocemos como ping, una utilidad de ICMP. Todo host debe responder a un *Echo Request* con un *Echo Reply*.

> [!tip] Latencia de red
> La latencia es el retraso en la comunicación de la red: el tiempo que tardan los datos en transferirse a través de ella.

> [!warning] Ping no mide latencia pura
> El tiempo que muestra el ping suele asociarse a la latencia de la red, pero en realidad el ping es una **aplicación** y como todo proceso conlleva su propio tiempo de procesamiento. El indicador de ping es entonces la latencia **más** el procesamiento de la aplicación, aunque se lo use, erróneamente, como si fuera solo latencia.

### Utilizando ping

Podemos comparar las respuestas de pings correctas e incorrectas entre `8.8.8.8` y `8.8.8.10`:

![[prueb_ping.png]]

Para hacer ping a un nombre (ej. `www.google.com`) se realizan primero dos acciones:
 1. **DNS:** se resuelve la IP correspondiente al nombre.
 2. Se determina la **MAC del *gateway*** para los paquetes que salen de la red local, usando alguno o todos estos métodos: [[07 - ARP|ARP]], [[10 - DHCP|DHCP]] y [[08 - Subredes#*Subnetting*|Subnetting]].

![[prueba_ping_google.png]]

### Manual de Ping (resumen)

| Flag            | Función                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------- |
| `-4`/`-6`       | Forzar el uso de IPv4 o IPv6 respectivamente                                                    |
| `-c count`      | Detener luego de enviar `count` paquetes ECHO_REQUEST.                                          |
| `-i interval`   | Esperar `interval` segundos entre cada paquete (default 1 segundo).                             |
| `-s packetsize` | Cantidad de bytes de datos a enviar                                                             |
| `-t ttl`        | Fijar el TTL del paquete IP saliente.                                                           |
| `-W timeout`    | Tiempo a esperar por una respuesta.                                                             |
| `-R`            | Registrar la ruta la cabecera IP solo tiene lugar para 9 saltos, y muchos hosts la ignoran.     |
| `-f`            | Flood ping: envía paquetes tan rápido como sea posible (requiere privilegios para intervalo 0). |
| `-b`            | Permite hacer ping a una dirección de broadcast.                                                |

## Comando Traceroute

Otro tipo de prueba de conectividad  es el`traceroute`  el cual imprime la ruta que tarda un paquete en llegar a un *host*, es útil para conocer la ruta y todos los saltos que atraviesa un paquete. Imprime los datos de:
- La **número de salto** (*hop*).
- La **dirección** de ese salto.
- El **tiempo por paquete** en milisegundos por salto.

La función `traceroute` sigue la ruta de los paquetes IP hacia un host, usando el campo TTL e intentando obtener una respuesta ICMP TIME_EXCEEDED de cada *gateway* en el camino. Comienza con TTL=1 y lo incrementa de a uno, hasta recibir:
- El destino
- Puerto inalcanzable
- Alcanzar el máximo de saltos.
### Utilizando traceroute

![[prueba_traceroute.png]]

>[!note] Cantidad de paquetes por salto
>Por defecto, traceroute envía 3 paquetes por salto, y cada tiempo es cuánto tardó ese paquete en llegar al salto.

### Manual de Traceroute (Resumen)

| Opción | Efecto |
| --- | --- |
| `-q <n>` | Cantidad de paquetes de sondeo (probe) por salto. Por defecto es 3. |
| `-F` | No fragmentar los paquetes de sondeo. |
| `-g <gateway>` | Trazar la ruta desde un gateway específico. |
| `-m <max_ttl>` | TTL máximo (cantidad máxima de saltos) a sondear. Por defecto es 30. |

| Flag           | Función                                                              |
| -------------- | -------------------------------------------------------------------- |
| `-4`/`-6`      | Forzar el uso de IPv4 o IPv6 respectivamente                         |
| `-I`, `--icmp` | Usar ICMP Echo para los sondeos (en vez de UDP).                     |
| `-T`, `--tcp`  | Usar TCP SYN para los sondeos (útil para atravesar firewalls).       |
| `-n`           | No resolver nombres de host, solo mostrar direcciones numéricas.     |
| `-f first_ttl` | TTL inicial (por defecto, 1).                                        |
| `-p port`      | Puerto destino a usar (UDP/TCP) o valor ICMP inicial.                |
| `-w max`       | Tiempo máximo de espera por una respuesta (por defecto, 5 segundos). |

## Ejemplo con TTL

Obteniendo los valores default a un *ping* y *tracerout* (*tracert* en en Windows) tenemos que:

![[ping_bien.png]]

![[traceroute_bien.png]]

De lo anterior podemos ver que el *tracert* muestra que la **ida** (→ 1.1.1.1) tarda **12 saltos**. Pero el ping te devuelve TTL=56 en la respuesta, este es el que puso **1.1.1.1** al generar su respuesta, ya decrementado por cada *router* de la **vuelta**. Como los sistemas tipo Unix/Linux (*Cloudflare* corre sobre eso) suelen arrancar con TTL por defecto = 64, la cuenta es: 64−56=8 saltos de vuelta.

Es decir, el camino que toma el paquete para llegar no es el mismo que toma la respuesta para volver. Esto es totalmente normal puesto que cada *router* decide el "mejor camino" de forma independiente, y no hay garantía de simetría.

En el *tracert* entre los saltos 3 y 6 está el mensaje de "Tiempo de espera agotado ..." que significa que ese *router* específico **no contesta** el ICMP Tiempo Excedido (muchos ISPs configuran esto a propósito, por seguridad o para no gastar recursos respondiendo tráfico de diagnóstico)

Si ahora limitamos el ping a un TTL menor que 11 este no funcionará:

![[ping_11saltos.png]]

En cambio si usamos un TTL de 12 o mayor, el ping si funciona:

![[ping_12saltos.png]]

En cuanto al *traceroute* si limitamos la cantidad de saltos solo afectamos hasta donde llega, pero no su respuesta. Lo anterior refiriéndome a que no expira el TTL, pero tampoco alcanza el destino 1.1.1.1 (dirección final a la derecha). Por ejemplo para un máximo de dos y ocho saltos tenemos:

![[traceroute_2saltos.png]]

![[traceroute_8saltos.png]]

> [!question]- ¿Por qué modificar el TTL a un valor bajo no impide que traceroute llegue al destino, pero sí impide que ping llegue?
>
> **Respuesta:** ambos usan el mismo mecanismo de fondo (ICMP Tiempo Excedido al agotarse el TTL), pero lo aprovechan de forma distinta.
>
> ***Traceroute*** no manda un único paquete con un TTL fijo: manda una secuencia con TTL creciente (1, 2, 3...) hasta llegar al destino o agotar el máximo de saltos configurado. Cada "muerte" de un paquete en un salto intermedio es exactamente el dato que traceroute busca. El programa sigue subiendo el TTL automáticamente hasta obtener una respuesta real del destino. Por eso, fijar manualmente un límite sí lo corta, pero es un techo impuesto a propósito, el mecanismo de "TTL bajo" en sí mismo no le impide llegar, es su método de trabajo.
>
> **Ping**, en cambio, manda paquetes con un TTL fijo elegido de antemano, sin ninguna lógica de reintento con un valor mayor. Si ese TTL es menor a la cantidad real de saltos hasta el destino, el paquete muere en un router intermedio y ping nunca llega — solo reporta el Tiempo Excedido de ese salto y ahí termina.
>
> En resumen: para *traceroute*, que el TTL se agote rápido es el objetivo de cada sonda individual; para ping, es simplemente un impedimento sin forma de recuperarse.

---
**Volver a:** [[11 - Zeroconf|Zeroconf]]

**Continuar a:** [[Teoria/02 - IPv4/index#Preguntas de repaso|Preguntas de repaso]]
