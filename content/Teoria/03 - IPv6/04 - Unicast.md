---
title: Unicast
fuente:
  - "[RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291)"
---
Las direcciones *unicast* IPv6 se pueden agregar con prefijos de longitud de bits arbitraria, de forma similar a las direcciones IPv4 *classless*. Existen varios tipos y subtipos de direcciones *unicast*:

![[unicast.png]]

Los nodos IPv6 pueden tener distinto conocimiento de la estructura interna de la dirección IPv6, dependiendo de la función que desempeñe el nodo, por ejemplo, si es un *host* o un *router*.

Aunque un *router* muy sencillo puede no tener conocimiento de la estructura interna de las direcciones de *unicast* IPv6, suelen tener, en general, conocimiento de uno o varios de los límites jerárquicos necesarios para el funcionamiento de los protocolos de enrutamiento. Los límites conocidos variarán de un *router* a otro, dependiendo de la posición que ocupe en la jerarquía de enrutamiento.

> [!note] Estructura de direcciones
> Salvo por el conocimiento del límite de subred mencionado antes, los nodos no deben hacer ninguna suposición sobre la estructura de una dirección IPv6.

> [!note] Excepción
> Direcciones de unidifusión con un alcance mayor que el alcance del enlace no son necesarias para interfaces que no se utilizan como origen o destino de ningún paquete IPv6 hacia o desde el nodo. A veces esto es conveniente para interfaces punto a punto.

## *Subnet* ID

A diferencia de IPv4 se tomaba parte del campo de *host* para crear el de subred, en IPv6 es más sencillo de entender porque es un campo separado dentro de cada tipo de dirección. Por lo general son tomados 16 bit con los que son posibles 65535 subredes ($2^{16}$). El uso de todos ceros o todos unos para este campo está permitido, pero **no es recomendado**, porque puede crear confusión.

> [!note]- Subnet ID extendido (solo informativo)
> En realidad la RFC 4291 no indica el tamaño de Subnet ID; esto surge de asignar un `/48` al prefijo global y 64 bits al ID de interfaz de red, por lo que deja 16 bits para ID de subred; dicho esto, el campo de Subnet ID puede variar su longitud.
>
> En otras palabras, se puede elegir cualquier número de bits después del prefijo de enrutamiento global para la ID de subred. Al igual que con IPv4, si se desea ampliar la cantidad de subredes (o más probablemente en IPv6, reducir la cantidad de hosts por subred), debe tomar prestados bits del Identificador de interfaz. Es importante señalar que las mejores prácticas dictan que esto debe hacerse **sólo en enlaces de infraestructura de red**. Cualquier segmento que incluya sistemas finales debe tener un prefijo `/64`, que es necesario para admitir SLAAC.
>
> Existen variaciones al campo Subnet ID pero **debe ser en múltiplos de 4 bits o *nibbles*** (*Nibble Boundary*: una máscara de red con 4 bits). El tratamiento de la variación de prefijo de subred en IPv6 escapa a nuestra materia.

#### *Subnet* para enlaces punto a punto

En IPv6 no hay *broadcast* y no se tiene una dirección reservada para red, por lo que no se necesita destinar direcciones para eso. Entonces solo serían necesarias **dos direcciones**, una para cada interfase del enlace punto a punto. En IPv4 estos enlaces eran `/30`, lo que permite 4 direcciones, dos para cada interfaz, una para red y otra para *broadcast*. En IPv6 con un `/127` sería suficiente.

El [RFC 6164](https://datatracker.ietf.org/doc/html/rfc6164) trata el uso de `/127` para prefijos de IPv6 en enlaces punto a punto entre *routers*. En el se hace referencia a un par de ocasiones donde no usar `/127` dado el caso, sin embargo escapa a nuestra materia el debate.

Recordemos que somos parte de una institución y la IPv6 que configuremos debe respetar y seguir los lineamientos de la institución. En nuestro caso el `/126` fue tomado por los administradores de red de la Facultad de Ingeniería.

## *Interface* ID

Cada dirección *unicast* tiene una parte que corresponde al **identificador de interfase**, de 64 bits. Este se utiliza para identificar las interfaces de un enlace, puede utilizarse en varias interfaces de un mismo nodo siempre que estén conectadas a subredes diferentes. Esta porción de "ID de interfase" puede formar parte de otras direcciones globales. En realidad, lo que nunca va a existir es el conjunto prefijo de subred + identificador de interfaz iguales.

En algunos sistemas operativos esta porción se genera a partir de la MAC de la placa de red y en otros de manera aleatoria. Por lo que si bien podrían generarse en algún lugar del mundo iguales, la parte de red no sería igual, así que no crearía conflicto de IP duplicada.

### EUI-64

Un mecanismo para lograr un identificador de interfaz de 64 bits es el **EUI-64** (*Extended Unique Identifier* 64) que toma los 48 bits de la MAC de la placa de red y genera el ID a partir de este.

El método consiste en insertar dos octetos, con valores hexadecimales fijos de FF y FE en medio del MAC de 48 bits para completar los 64. Para explicar como funciona primero recordemos como está estructurada la MAC:

```
|0              1|1              3|3              4|
|0              5|6              1|2              7|
+----------------+----------------+----------------+
|ccccccugcccccccc|ccccccccmmmmmmmm|mmmmmmmmmmmmmmmm|
+----------------+----------------+----------------+
```

Donde:
- `c` son los bits `company_id` asignados a la organización (bits del OUI).
- `u` es el bit `universal/local` que indica ámbito local (con 0) o global (con 1).
- `g` es el bit `individual/group` que indica si es para una interfaz (con 0) o un grupo (con 1).
- `m` son los bits `manufacturer` que representan al dispositivo.

El proceso consiste en:
1. Dividir la MAC en dos partes (justo donde cambia de `c` a `m`).
2. Insertar los hexadecimales FF y FE entre ambos.
3. Invertir el bit `u` (tambien llamado `u/l`)

El resultado se vería como (suponiendo que el bit `u/l` estaba en `u`):

```
|0              1|1              3|3              4|4              6|
|0              5|6              1|2              7|8              3|
+----------------+----------------+----------------+----------------+
|cccccclgcccccccc|cccccccc11111111|11111110mmmmmmmm|mmmmmmmmmmmmmmmm|
+----------------+----------------+----------------+----------------+
```

> [!info] Toggleo del bit u/l
> Dada la estructura de la MAC mencionada anteriormente para cambiar el bit `u/l` sin pasar todo a binario debemos fijarnos en el segundo valor hexadecimal a partir del MSB.

> [!example]- Aplicando EUI-64
> Para la MAC $00 \: 50 \: 56 \: AF \: 25 \: 24$ aplicamos los pasos:
> 1. Dividimos en dos la MAC:
> $$
> 00 \:50 \:56 \qquad AF \:25 \:24
> $$
> 2. Insertamos el FF FE:
> $$
> 00 \:50 \:56 \:FF \:FE \:AF \:25 \:24
> $$
> 3. Toggleamos el bit `u/l`:
> $$
> \boxed{ 02 \:50 \:56 \:FF \:FE \:AF \:25 \:24 }
> $$

> [!note]- Comprensión del bit u/l
> La comprensión de identificador local o global escapa a la materia, pero tenemos que mencionar que existen casos de enlaces serie, punto a punto de túneles, etc. en los que el administrador debe configurar manualmente los identificadores de alcance local cuando la MAC de hardware no está disponible; aquí el bit u cobra más sentido.

### *Random*

Generar aleatoriamente la parte baja de la dirección IPv6 se conoce como ***Privacy Extensions for* SLAAC** y es tratado en el [RFC 4941](https://www.rfc-editor.org/info/rfc4941/). En el caso de usar esta configuración, el SLAAC tiene algunos parámetros extra que configurar.

El problema con el mecanismo anterior (EUI-64) es que se puede rastrear el equipo sabiendo la IPv6, y esto de alguna manera atenta contra la privacidad. Desde Windows Vista, Microsoft ha habilitado la extensión de privacidad en su sistema operativo Windows por defecto.

> [!important] Configuración por defecto
> 
> 
> Si el *host* tiene la configuración *default* se utiliza *Random* para generar *Interface* ID y direcciones temporales. Caso contrario se puede habilitar EUI-64 y direcciones no temporales.

> [!question] ¿Por qué usar direcciones temporales si tengo *Interface* ID *random*?
> Un *Interface* ID aleatorio, si se genera una sola vez y después queda fijo, sigue siendo un identificador estable. Es decir, aunque ya no diga nada del *hardware*, la dirección IPv6 completa (prefijo + esa parte aleatoria fija) va a ser siempre la misma, sesión tras sesión, día tras día. Un sitio web que rastree no necesita saber la MAC para armar un perfil de tu actividad a lo largo del tiempo. No alcanza con que el número sea impredecible, tiene que además cambiar periódicamente para que ese rastreo de largo plazo tampoco sea posible.

## *Global Unicast Address* (GUA)

El formato de dirección de *Unicast Global* es:

```
|         n bits         |   m bits  |       128-n-m bits         |
+------------------------+-----------+----------------------------+
| global routing prefix  | subnet ID |       interface ID         |
+------------------------+-----------+----------------------------+
```

Con sus tres campos se crea la **regla 3-1-4**:
- 3 hextetos para el *Global Routing Prefix*.
- 1 hexteto para el *Subnet* ID.
- 4 hextetos para el *Interface* ID.

Recordar que un hexteto es un conjunto de cuatro hexadecimales o dieciséis bits, lo que antes se denominaba el conjunto `x` (Por ejemplo A05D o FFDE).

> [!note] Nota
> Direcciones de unidifusión global que comienzan con binario `000` no tienen la restricción anterior en el tamaño o estructura del campo de ID de interfaz; estas direcciones se usan para [[#IPv6 con IPv4 embebida]].

Las GUA se pueden asignar de tres maneras distintas:

1. Manual:
	1. Manual.
	2. Manual + EUI-64.
	3. IPv6 *unnumbered*
2. *Stateless Address Autoconfiguration* (SLAAC).
3. *Stateful* DHCPv6.

> [!info]- IPv6 *unnumbered* 
> IPv6 sin numerar, es lo mismo que IPv4. Permite a una interfaz utilizar la dirección IPv6 de otra interfaz del mismo dispositivo, solo en Cisco.

>[!question]- ¿Cuales son las primer y última dirección *unicast* global?
>Las direcciones unicast global utilizan los tres primeros bits en `001`:
>- Primer hexadecimal: **001**0 y **001**1
>- Primer conjunto: 0010 0000 0000 0000 o sea 2000 en hexadecimal.
>- Último conjunto: 0011 1111 1111 1111 o sea 3FFF en hexadecimal.
>- El rango de *unicast* global abarca desde 2000 a 3FFF

## Link Local Address (LLA)

Las direcciones *Link Local* están destinadas a su uso en **un único enlace** y todo servicio de IPv6 debe tener esta dirección. Están diseñadas para utilizarse en el direccionamiento de un solo enlace con fines tales como la configuración automática de direcciones, el descubrimiento de vecinos o cuando no hay enrutadores presentes.

Los *routers* no deben reenviar a otros enlaces ningún paquete con direcciones *Link Local* de origen o destino. Los dispositivos usan un mecanismo llamado: *Duplicate Address Detection* (DAD) para determinar si es o no única esta dirección en su enlace/subred.

El formato es:

```
| 10 bits  |         54 bits         |          64 bits           |
+----------+-------------------------+----------------------------+
|1111111010|           0             |       interface ID         |
+----------+-------------------------+----------------------------+
```

Dado los 10 bits:
1. Con los primeros 8 podemos ver que toda LLA comienza por:
$$
1111 \: 1110  \longrightarrow FE
$$
2. Completando con los 10 bits y rellenando con cero tenemos el límite inferior:
$$
1111 \: 1110 \quad 1000 \: 0000 \longrightarrow FE80
$$
3. Completando con los 10 bits y rellenando con unos tenemos el límite superior:
$$
1111 \: 1110 \quad 1011 \: 1111 \longrightarrow FEBF
$$

> [!important] Identificar LLA
> Toda dirección LLA está dentro del rango FE80::/10 y FEBF::/10

> [!note] Nota
> Algunos autores recomiendan utilizar la misma dirección *link local* para todas las interfaces del *router* (`FE80::1`) debido a que es una dirección fácil de recordar y, como todas las interfaces del router son una red separada, no habría problemas porque no se enrutan. Esto **no se puede hacer en el RouterOS de MK** porque el mismo asigna el *interface* ID por EUI-64.

La idea de que un dispositivo cree su propia dirección IP al iniciarse es realmente un beneficio sorprendente, dado logra que el dispositivo pueda comunicarse inmediatamente con cualquier otro en la red local (subred IPv6). Esto sin ningún tipo de configuración manual, ni los servicios de un servidor DHCP.

Es posible que un dispositivo solo necesite una dirección de LLA, esto porque solo necesita comunicarse con otros en su misma red (como una impresora). Además, puede usarla para comunicarse con un dispositivo para obtener o crear una dirección GUA y entonces comunicarse con dispositivos en otras redes.

> [!info] Red AD HOC o *peer to peer*
> Muchos sistemas operativos utilizan un mecanismo llamado APIPA (de *Automatic Private IP Addressing*) o *Link Local Addressing*, donde las direcciones LLA son usadas para crear redes AD HOC o *peer to peer* (conexiones punto a punto). Esto sin servidor DHCP, rangos, etc.

## Loop Back (LO)

La dirección *unicast* `::1` se denomina dirección de *loop back* o bucle invertido. Un nodo puede utilizarla para enviarse a sí mismo un paquete IPv6, pero no debe asignarse a ninguna interfaz física.  Se considera que tiene un alcance de *link local* y puede pensarse que es la LLA de una interfaz virtual hacia un enlace imaginario que no conduce a ninguna parte.

No debe utilizarse como dirección de origen en paquetes IPv6 que se envíen fuera del nodo y nunca debe ser reenviado por un *router* IPv6.  Un paquete recibido en una interfaz con una dirección de destino de *loop back* debe descartarse. Típicamente se usa para probar la pila TCP/IP.

Formas de escribirla:
- `0000:0000:0000:0000:0000:0000:0000:0001`
- `0:0:0:0:0:0:0:1` 
- `::1` 
- `::1/128`

> [!note] Nota
> En IPv4 la dirección de Loopback se corresponde con una Red del tipo `127.0.0.0/8`, es por ello que un ping a `127.a.b.c` será respondido (con a, b en [0,255] y c en [0, 254]). Para IPv6 la dirección de **loopback es una sola dirección** IP, no una red.

## *Unspecified Address* (UA)

La dirección `::` se denomina dirección no especificada o *unspecified address*.  Esta dirección nunca debe asignarse a ningún nodo dado que indica la ausencia de una dirección. Se usa durante el proceso de inicialización de IPv6 en el campo de IP de origen cuando el nodo no tiene IP.

No debe utilizarse como dirección de destino de los paquetes IPv6 ni en las cabeceras de enrutamiento IPv6. Un paquete IPv6 con una dirección de origen no especificada nunca debe ser reenviado por un *router* IPv6.

Formas de escribir:
- `0000:0000:0000:0000:0000:0000:0000:0000`
- `0:0:0:0:0:0:0:0`
- `::/128`
- `::`

> [!warning] Ojo con la máscara
> Cualquier conjunto `::/0` no es una UA. La dirección no especificada es una dirección puntual `/128`. En cambio, `::/0` se usa para indicar rutas por defecto en tablas de ruteo.

## *Unique Local Address* (ULA) 

> Específicamente este tipo de *unicast* tiene su propio [RFC 4193](https://datatracker.ietf.org/doc/html/rfc4193)

Las direcciones locales únicas también son conocidas como direcciones IPv6 privadas o direcciones IPv6 locales (que no deben confundirse con direcciones Link Local Address) y serían el equivalente a las direcciones IPv4 [[06 - Direcciones IPv4#Redes privadas|privadas]].

El formato es:

```
| 7 bits |1|  40 bits   |  16 bits  |          64 bits           |
+--------+-+------------+-----------+----------------------------+
| Prefix |L| Global ID  | Subnet ID |        Interface ID        |
+--------+-+------------+-----------+----------------------------+
```

Donde `Prefix` corresponde a `1111 110`, definiendo el rango `FC00::/7` a `FDFF::/7`

Resumiendo sus características tenemos que:

- Se pueden usar de manera similar a las GUA, pero son para uso privado y no debe enrutarse en la Internet global.
- Solo se deben utilizar en un área más limitada, como dentro de un sitio o entre un número limitado de dominios administrativos.
- Son para dispositivos que nunca necesitan acceso a Internet y nunca es necesario que sea accesible desde Internet (seguro), pero no tienen como propósito ser usadas para ocultar un dispositivo.
- *Pueden* ser enrutadas por los *routers* internos de una organización, pero cuando llegan al borde de la organización y pasan a un *router* del ISP, éstas serán descartadas.

> [!info]- ULA a NAT
> ULA y NAT son un tema un poco complicado. El concepto de traducir una ULA a GUA es objeto de debate continuo dentro de la comunidad IPv6. La IAB (*Interne Architecture Board*) publicó un RFC informativo que destaca sus pensamientos sobre [[NAT]] e IPv6 en RFC 5902, "IAB Reflexiones sobre la traducción de direcciones de red IPv6".
>
> En este RFC, la IAB resume el uso de NAT de la siguiente manera: *"La traducción de direcciones de red se considera una solución para lograr una serie de propiedades deseadas para redes individuales, evitando varias cuestiones y permitiendo ocultar detalles de la red interna y proporcionar seguridad simple"*.

El uso y definición del L *Flag* y *Global* ID es tratado muy en profundidad en el RFC. Sin entrar en detalles con los bits de `prefix` de ULA  (`1111 110x`) se dividen dos partes:
1. `fc00::/8` (`1111 1100`): cuando la bandera L de Local vale 0.
2. **`fd00::/8`** (`1111 1101`): cuando la bandera L de Local vale 1.

El problema es que el RFC 4193 solo define los métodos específicos para el bit L en 1, por lo tanto el primer segmento no está definido y las únicas direcciones legítimas de ULA son: **`fd00::/8`**.

## *Site Local Address* (SLA)

> No tratamos el tema en la materia.

Existen direcciones llamadas de Sitio local o *Site-Local* del tipo *unicast* que estan obsoletas y comenzaban con el tipo `FEC0/10`, pero, si no existen, deberían desaparecer en el futuro. 

## IPv6 con IPv4 embebida

IPv6 tiene un mecanismo de transición desde IPv4, este incorpora la técnica para que *hosts* y *routers* hagan dinámicamente un túnel entre ambos. Así direcciones IPv6 asignadas a IPv4 pueden ser utilizadas por un dispositivo *dual stack* que necesita enviar un paquete IPv6 a un dispositivo que solo admite IPv4.

Se definen dos tipos de direcciones IPv6 que contienen una dirección IPv4 en los 32 bits de orden inferior de la dirección.  Se trata de la «dirección IPv6 compatible con IPv4 y la «dirección IPv6 mapeada a IPv4».

### IPv4 Compatible IPv6 *Address*

 Se definió para facilitar la transición a IPv6. El formato es el siguiente:

```
|                80 bits               | 16 |      32 bits        |
+--------------------------------------+--------------------------+
|0000..............................0000|0000|    IPv4 address     |
+--------------------------------------+----+---------------------+
```

La dirección IPv4 utilizada debe ser una dirección de unidifusión IPv4 única a nivel global.

Este formato quedo obsoleto ya que los mecanismos actuales de transición a IPv6 ya no utilizan estas direcciones. No es necesario que las implementaciones nuevas o actualizadas admitan este tipo de dirección.

### IPv4 *Mapped* IPv6 *Address*

Se utiliza para representar las direcciones de los nodos IPv4 como direcciones IPv6. El formato es:

```
|                80 bits               | 16 |      32 bits        |
+--------------------------------------+--------------------------+
|0000..............................0000|FFFF|    IPv4 address     |
+--------------------------------------+----+---------------------+
```

Esta última es para representar solo a los nodos IPv4 que no soportan IPv6. Es un esquema de direcciones de transición y no profundizaremos en la materia. Se trata en el [RFC 4038](https://datatracker.ietf.org/doc/html/rfc4038)

---
**Volver a:** [[03 - Direcciones IPv6|Direccionamiento IPv6]]

**Continuar a:** [[05 - Anycast y Multicast|Anycast y Multicast]]
