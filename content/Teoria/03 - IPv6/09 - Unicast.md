---
title: Unicast
---
Las direcciones de unidifusión o unicast global de IPv6 tienen la siguiente estructura:

```
|      n bits         |   m bits   |   128-n-m bits   |
+----------------------+-----------+-------------------+
| global routing prefix | subnet ID |    interface ID   |
+----------------------+-----------+-------------------+
```

pero en otras ocasiones puede interesar solo los **prefijos de subred** para los enlaces en los que se encuentra:

```
|        n bits         |   128-n bits   |
+------------------------+----------------+
|      subnet prefix     |  interface ID  |
+------------------------+----------------+
```

**Prefijo de subred:** conjunto de bits de una dirección. Se suele indicar igual que en IPv4, con una `/` y un número decimal que indica de cuántos bits es el conjunto.

![[arbol-tipos-direcciones-unicast.png]]

## 9.1. Global Unicast Address (GUA)

El formato de dirección de Unicast Global es:

![[formato-gua-global-unicast.png]]

El "subnet ID" identifica un enlace o *link*. El campo "interface ID" ya se vio y se lo crea aleatoriamente u obtiene de la MAC del host.

> [!note] Nota
> Direcciones de unidifusión global que comienzan con binario `000` no tienen tal restricción en el tamaño o estructura del campo de ID de interfaz; estas direcciones se usan para IPv4 embebida en IPv6, como ya se verá (ver [[#9.10. IPv6 con IPv4 embebida]]).

Se pueden asignar de tres maneras (se verán más adelante):

1. **Manual:**
   1. Manual.
   2. Manual + EUI-64.
   3. **IPv6 unnumbered** (IPv6 sin numerar es lo mismo que IPv4. Permite a una interfaz utilizar la dirección IPv6 de otra interfaz del mismo dispositivo, solo en Cisco).
2. **Stateless Address Autoconfiguration (SLAAC).**
3. **Stateful DHCPv6.**

Las GUA tienen 3 campos: Global Routing Prefix, Subnet ID e Interfase ID. Esta división hace que se conozca como **regla 3-1-4**: 3 hextetos para el Global Routing Prefix, 1 hexteto para el Subnet ID y 4 hextetos para el Interface ID.

![[regla-3-1-4.png]]

### 9.2. IPv6 en Linux

Si se usa el comando:

```
ip -6 addr
```

se pueden ver los distintos tipos de direcciones IPv6 que tiene un equipo (ejemplo con un Linux/Ubuntu conectado a UNAM Libre):

```
daniel@NB3410:~$ ip -6 addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 state UNKNOWN qlen 1000
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: wlp1s0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 state UP qlen 1000
    inet6 2803:70e0:101:125:ad52:34c3:7fa1:ac36/64 scope global temporary dynamic
       valid_lft 600582sec preferred_lft 82002sec
    inet6 2803:70e0:101:125:d881:cb40:e933:4c31/64 scope global dynamic mngtmpaddr noprefixroute
       valid_lft 2591856sec preferred_lft 604656sec
    inet6 fe80::b016:4d30:431c:6e68/64 scope link nonprefixroute
       valid_lft forever preferred_lft forever
```

Nos vamos a concentrar en las del tipo **Global**; en otros capítulos veremos las demás.

> [!note] Nota
> La dirección que dice `noprefixroute` quiere decir que esa IPv6 no tiene una ruta automática para esa interfaz → *nonprefixroute*. Más info con `man ipv6`.

### Direcciones temporales

Una dirección temporal en IPv6 es una dirección generada de manera aleatoria y **cambiada periódicamente** para mejorar la privacidad del usuario. Se utiliza en dispositivos que se conectan a Internet para evitar el rastreo de la dirección IP fija por parte de sitios web o servicios en línea.

Las direcciones temporales se pueden activar o no desde el sistema operativo de manera manual. Generalmente ya vienen activas.

**Objetivos principales de las direcciones temporales en IPv6:**
1. Mejorar la privacidad: al cambiar frecuentemente, dificulta que terceros rastreen la actividad de un dispositivo en la red.
2. Evitar identificación a largo plazo: a diferencia de las direcciones EUI-64 (basadas en la MAC del dispositivo), las temporales no revelan información del hardware.
3. Seguridad contra ataques de seguimiento: algunos atacantes pueden usar direcciones IPv6 estáticas para crear perfiles de actividad de usuarios.

**Cómo se logran las direcciones temporales:** se generan utilizando el mecanismo de privacidad definido en el RFC 8981 (anteriormente RFC 4941):

1. **Obtención del prefijo IPv6:** el dispositivo recibe un prefijo de red (por ejemplo `2001:db8::/64`) mediante SLAAC o DHCPv6.
2. **Generación del identificador de interfaz aleatorio:** en lugar de usar la dirección MAC para generar la parte del host (como en EUI-64), se usa un número aleatorio. Este identificador cambia cada cierto tiempo (por ejemplo, cada 24 horas o al reiniciar el dispositivo).
3. **Asignación y uso de la dirección temporal:** la dirección IPv6 temporal se usa para conexiones salientes (como navegar en la web o enviar correos). Se mantiene activa solo por un tiempo definido antes de generar una nueva.
4. **Eliminación de direcciones viejas:** cuando se genera una nueva dirección temporal, la anterior se marca como "deprecated" y deja de usarse en nuevas conexiones, pero sigue funcionando hasta que las conexiones activas finalicen.

> [!tip] ¿Cuándo usar direcciones temporales y cuándo no?
> ✅ Útil en dispositivos personales (PCs, teléfonos, laptops) para proteger la privacidad al navegar en Internet.
> ❌ No recomendable en servidores o dispositivos que necesitan direcciones estáticas (como impresoras, routers o servidores web).

> [!question] Si los sistemas operativos modernos ya generan un identificador de interfaz aleatorio, ¿por qué seguir usando direcciones temporales en IPv6?
> Las direcciones temporales cambian periódicamente, evitando rastreo a largo plazo; no sucede esto necesariamente con las direcciones IPv6 que no son temporales, así que no cambian una vez asignadas (salvo reinicio de la interfaz o renovación del prefijo) y pueden ser usadas por semanas o días. Esto es porque el identificador aleatorio protege la MAC, pero sigue siendo **estable en el tiempo**, lo que permite rastreo prolongado. Son útiles en dispositivos personales y conexiones a Internet, pero no en servidores donde es mejor una dirección estable.

**Ejemplo:** el ISP asigna el prefijo IPv6 `2001:db8:abcd:1234::/64`.

> [!info]- Caso sin direcciones temporales
> La computadora genera una dirección basada en el identificador aleatorio: `2001:db8:abcd:1234:**a1b2:c3d4:e5f6:7890**`. Como el identificador es estable, los sitios web pueden rastrearte cada vez que te conectás, incluso si cambiás de red Wi-Fi dentro del mismo prefijo IPv6.

> [!info]- Caso con direcciones temporales activadas
> - La primera hora usás esta dirección: `2001:db8:abcd:1234:**1111:2222:3333:4444**`
> - Luego, tras unas horas, se genera una nueva dirección: `2001:db8:abcd:1234:**5555:6666:7777:8888**`
> - Los sitios web **no pueden vincular fácilmente tu actividad previa con la nueva sesión** porque la dirección ha cambiado.

## 9.3. Subnet ID

A diferencia de IPv4, es más sencillo de entender, porque es un campo separado SOLO para ID de subred; en IPv4 se tomaba parte de otro campo (el de Host) para crear el de subred.

Como son 16 bits, se permitirían 65535 subredes ($2^{16}$).

El uso de todos ceros o todos unos para este campo está permitido, pero **NO es recomendado**, porque puede crear confusión.

> [!note]- Subnet ID extendido (solo informativo)
> En realidad la RFC 4291 no indica el tamaño de Subnet ID; esto surge de asignar un `/48` al prefijo global y 64 bits al ID de interfaz de red, por lo que deja 16 bits para ID de subred; dicho esto, el campo de Subnet ID puede variar su longitud.
>
> En otras palabras, se puede elegir cualquier número de bits después del prefijo de enrutamiento global para la ID de subred. Al igual que con IPv4, si se desea ampliar la cantidad de subredes (o más probablemente en IPv6, reducir la cantidad de hosts por subred), debe tomar prestados bits del Identificador de interfaz. Es importante señalar que las mejores prácticas dictan que esto debe hacerse **sólo en enlaces de infraestructura de red**. Cualquier segmento que incluya sistemas finales debe tener un prefijo `/64`, que es necesario para admitir SLAAC.
>
> Existen variaciones al campo Subnet ID pero DEBE ser en múltiplos de 4 bits o *nibbles* (*Nibble Boundary*: una máscara de red con 4 bits). El tratamiento de la variación de prefijo de subred en IPv6 escapa a nuestra materia.

### Subnet para enlaces punto a punto en IPv6: ¿/127 o /126?

En IPv6 no hay Broadcast, por lo que no se necesita destinar una dirección para broadcast. Tampoco se tiene una dirección reservada para Red, por lo tanto tampoco necesitamos una dirección para ello. Siendo así, en principio solo serían necesarias **dos direcciones**, una para cada interfase del enlace punto a punto. En IPv4 estos enlaces eran `/30`, lo que permite 4 direcciones, dos para cada interfaz, una para red y otra para broadcast. En IPv6 con un `/127` sería suficiente.

El [RFC 6164](https://datatracker.ietf.org/doc/html/rfc6164) trata el uso de `/127` para prefijos de IPv6 en enlaces punto a punto entre routers. En el mismo se hace referencia en un par de ocasiones a NO usar `/127` para el caso de estudio; sin embargo, aunque los análisis en el RFC son correctos y la experiencia operativa con IPv6 ha demostrado que los prefijos `/127` se pueden utilizar con éxito, escapa a nuestra materia un tema tan puntual y vamos a tomar **`/126`** para los enlaces punto a punto entre routers. Recordemos que somos parte de una institución y la IPv6 que configuremos debe respetar y seguir los lineamientos de la institución; en nuestro caso el `/126` fue tomado por los administradores de red de la Facultad de Ingeniería.

## 9.4. Interface de red

### Identificador de Interfaz

Cada dirección Unicast IPv6 tiene una parte que corresponde al Identificador de interfase, de 64 bits.

Note que esta porción de "ID de interfase" puede formar parte de OTRAS direcciones globales; en realidad lo que nunca va a existir es el conjunto prefijo de subred + ID de interfase iguales. En algunos SO esta porción se genera a partir de la MAC de la placa de red y en otros de manera aleatoria; vemos cada una de ellas. Por lo que si bien podrían generarse en algún lugar del mundo iguales, la parte de red NO sería igual, así que esto NO crearía conflicto de IP duplicada; este caso de IP duplicada se acotaría al contexto de una red de una organización solamente. Veamos cómo lograr ID de interfaz.

#### 1) EUI-64

Para lograr los 64 bits de la id de interfase se usa un mecanismo llamado **EUI-64** que toma los 48 bits de la MAC de la placa de red y genera el id de interfase de 64 bits.

```
0    0  0     1  1     2
|0   7  8     5  6     3|
+----+----+----+----+----+----+
|cccc|ccug|cccc|cccc|cccc|cccc|
+----+----+----+----+----+----+
```

En la figura vemos los 48 bits de una MAC; hay dos bits indicados como `u` y `g`. Si `u=0`, indica ámbito Local; si `u=1` indica ámbito Global, es por eso que el proceso de EUI-64...

Veamos cómo se logra esto a partir de la MAC de una interfase:

![[proceso-eui-64.png]]

El Apéndice A del RFC 2373 *APPENDIX A: Creating EUI-64 based Interface Identifiers* (página 19) explica de forma aproximada cómo se realiza el EUI-64.

> [!note] Nota
> La comprensión de identificador local o global escapa a la materia, pero tenemos que mencionar que existen casos de enlaces serie, punto a punto de túneles, etc. en los que el administrador debe configurar manualmente los identificadores de alcance local cuando la MAC de hardware no está disponible; aquí el bit u cobra más sentido, pero esto escapa a la materia.

#### 2) Extensión de la Privacidad

Esto de generar aleatoriamente la parte baja de la dirección IPv6 se conoce como **Privacy Extensions for SLAAC** (que es una manera dinámica de asignar IPv6), tratado en el RFC 4941; en el caso de usar esta configuración, el SLAAC tiene algunos parámetros extra que configurar.

La idea es que se puede rastrear el equipo sabiendo la IPv6, y esto de alguna manera atenta contra la privacidad. Desde Windows Vista, Microsoft ha habilitado la extensión de privacidad en su sistema operativo Windows por defecto.

![[slaac-identificador-vs-privacidad.png]]

Vemos en la figura que si el Host (representado como WinPC) tiene habilitado por defecto el *Random Identifier*, la parte de IPv6 correspondiente al identificador de interfase se genera aleatoriamente. En este escenario, parte del ID de interfase que se crea aleatoriamente se utiliza como dirección IPv6 de origen cuando el dispositivo origina la conexión.

**Direcciones temporales.** También existen direcciones IPv6 temporales (direcciones de privacidad temporales), que se utilizan para mejorar la privacidad de los usuarios cuando se conectan a redes públicas o acceden a servicios en Internet. También se generan de manera aleatoria como en Privacy Extensions for SLAAC y cambian periódicamente para evitar que un dispositivo sea rastreado a lo largo del tiempo por su dirección.

El uso de direcciones temporales es opcional y configurable en el SO. En la mayoría de los sistemas operativos modernos (Windows, Linux, macOS y Android) las direcciones temporales están habilitadas por defecto, pero los administradores de red o los usuarios pueden desactivarlas si es necesario.

Las direcciones temporales tienen una vida útil corta, normalmente horas o días. Es común tener varias direcciones temporales para asegurarse de que las conexiones existentes puedan continuar mientras se crea una nueva dirección temporal para nuevas conexiones.

### Tiempos de vida de las direcciones (informativo)

![[ciclo-vida-direccion-ipv6.png]]

Las direcciones IPv6 tienen distintos tiempos de vida; el tratamiento en profundidad de este tema escapa a la materia y se puede profundizar en el [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862).

- **Direcciones tentativas:** las que están en proceso de verificación.
- **Dirección válida:** la dirección es una dirección preferida o en desuso.
- **Dirección preferida:** se verificó que la dirección es única.
- **Dirección en desuso (deprecated):** la dirección todavía es válida pero no lo será en el futuro.
- **Dirección inválida:** una dirección que se volvió inválida.
- **Vida útil preferida:** este es el período de tiempo en el que se prefiere una dirección válida hasta que queda obsoleta. Cuando expira el Período de Vida Preferido, la dirección pasa a ser obsoleta.
- **Vida útil válida:** este es el período de tiempo que una dirección permanece en el estado válido. La Vida Válida debe ser mayor o igual a la Vida Preferida. Cuando expira la vida útil, la dirección deja de ser válida.

> [!tip] "Forever" no es tan literal
> Las IPv6 que NO son temporales aparecen con la etiqueta `forever`, esto NO quiere decir que sean para siempre. A modo de ejemplo, dos capturas del mismo host `ip -6 addr show` en momentos distintos muestran que la Link-Local (`fe80::.../64`) es "forever" pero cambia entre una captura y otra, por el principio de Privacy Extensions for SLAAC.

## 9.5. LLA Link Local Address FE80::/10

Link-Local es otra de las direcciones de IPv6 de tipo Unicast.

1. Todo servicio de IPv6 DEBE tener esta dirección de Link Local.
2. Se diseñaron para ser usadas en el direccionamiento de un **único enlace o link LOCALES o sub red**.
3. Es común poner las mismas direcciones para distintos enlaces de un router, por ejemplo.
4. Un Router no reenvía paquetes del tipo Local Link.
5. Los dispositivos usan un mecanismo llamado: Duplicate Address Detection (DAD) para determinar si es o no única esta dirección en su enlace/subred.

El formato es:

```
|--------------- 128 Bits ----------------|
|-- 10 Bits --|--- Remaining 54 Bits ---|------- 64 Bits -------|
| 1111 1110 10xx xxxx |                 |     Interface ID       |
```

`fe80::/10` → *Range of First Hextet: fe80 thru febf*

Las direcciones IPv6 link-local están en el rango de `FE80::/10` (en binario `1111 1110 1000 0000`).

Estas direcciones se usan para:
1. Configuración automática de direcciones.
2. Descubrimiento de vecinos o cuando no hay enrutadores presentes.

> [!note] Nota
> Algunos autores recomiendan utilizar la misma dirección link-local para todas las interfaces del router (`FE80::1`) debido a que es una dirección fácil de recordar y, como todas las interfaces del router son una red separada, no habría problemas, porque, como sabemos, las direcciones de enlace local no se enrutan. Esto **NO se puede hacer en el RouterOS de MK** porque el mismo asigna el "interface-ID", los últimos 64 bits por EUI-64.

> [!note]- Direcciones de Sitio local (obsoletas)
> Existen direcciones llamadas de Sitio local o Site-Local del tipo Unicast que son **OBSOLETAS** y comenzaban con el tipo `FEC0/10`, pero, no si existen, deberían desaparecer en el futuro.

**Observación:** la idea de que un dispositivo cree su propia dirección IP al iniciarse es realmente un beneficio sorprendente en IPv6. Un dispositivo puede crear su propia dirección de enlace local IPv6, sin ningún tipo de configuración manual ni los servicios de un servidor DHCP; con esto se logra que el dispositivo pueda comunicarse inmediatamente con cualquier otro dispositivo en la red local (subred IPv6).

Es posible que un dispositivo solo necesite una dirección de enlace local porque solo necesita comunicarse con otros dispositivos en su misma red (como una impresora, por ejemplo). O puede usar su dirección de enlace local para comunicarse con un dispositivo donde pueda obtener información para obtener o crear una dirección de unidifusión global (como un enrutador IPv6 o un servidor DHCPv6). El dispositivo puede entonces utilizar esta información para comunicarse con dispositivos en otras redes.

### Red AD HOC o peer-to-peer

![[red-adhoc-peer-to-peer.png]]

En el caso de que se quiera formar una red AD HOC entre dos equipos, si lo pensamos bien, deberíamos crear un servidor de DHCP, con rangos de IPs, luego un mecanismo para que se pongan de acuerdo cuál de los dos va a ser servidor y cuál cliente para que finalmente se puedan comunicar en capa 3, pero nada de eso ocurre.

Muchos sistemas operativos utilizan un mecanismo llamado APIPA (*Automatic Private IP Addressing*) o Link-Local Addressing. Las direcciones Link-Local en IPv6 (`fe80::/10`) son usadas para redes AD HOC o *peer to peer*. En IPv6, cada interfaz de red genera automáticamente una dirección link-local dentro del prefijo `fe80::/10`. Estas direcciones son equivalentes a las direcciones `169.254.0.0/16` en IPv4, y se usan para la comunicación local en la misma red física.

## 9.6. Loop back

1. Es una dirección del tipo Unicast: `0:0:0:0:0:0:0:1`.
2. **No se puede asignar a ninguna interfase.**
3. **Se asocia a una interfase virtual.**
4. Un paquete con esta dirección como dirección de origen o como dirección de destino nunca se enviará más allá del dispositivo.
5. El dispositivo debe descartar un paquete recibido en una interfaz si la dirección de destino es una dirección de loopback.
6. Típicamente se usa para probar la pila TCP/IP.

Formas de escribirla:
- `0000:0000:0000:0000:0000:0000:0000:0001`
- `0:0:0:0:0:0:0:1` (notación comprimida)
- `::1` (regla de los ceros y los dos puntos `::`)
- `::1/128` (usando prefijo de red)

> [!note] Nota
> En IPv4 la dirección de Loopback se corresponde con una Red del tipo `127.0.0.0/8`, es por ello que un ping a `127.a.b.c` será respondido (con a, b en [0,255] y c en [0, 254]). Para IPv6 la dirección de loopback es UNA SOLA dirección IP, ¡no una red!

## 9.7. UA Unspecified Address

La dirección `0:0:0:0:0:0:0:0`, se conoce como Dirección No específica. Indica la ausencia de dirección, y **se usa durante el proceso de inicialización de IPv6 en el campo de IP de Origen cuando el nodo no tiene IP**.

1. Nunca se debe asignar a ningún nodo (definición nodo: dispositivo que implementa capa 3 IP).
2. Una dirección de origen no especificada indica la ausencia de una dirección.
3. No se puede asignar una dirección no especificada a una interfaz física.
4. Una dirección no especificada no se puede utilizar como dirección de destino.
5. Un router nunca reenviará un paquete que tenga una dirección de origen no especificada.

Formas de escribir:
- `0:0:0:0:0:0:0:0`
- `::/128`
- `::`

> [!note] Nota 1
> Un ejemplo en el que se puede utilizar una dirección no especificada es como dirección de origen en ICMPv6. Detección de direcciones duplicadas (DAD). DAD es un proceso que utiliza un dispositivo para garantizar que su dirección de unidifusión es única en el enlace local (red).

> [!warning] Nota 2
> `::/0` **NO** es una UA. `0:0:0:0:0:0:0:0` (ó `::/128`) es una dirección de RED. `::/0` se usa para indicar Rutas por defecto en tablas de ruteo.

## 9.8. ULA - Unique Local Address FD00::/8

Sería el equivalente a las direcciones IPv4 privadas.

Las direcciones locales únicas también son conocidas como direcciones IPv6 privadas o direcciones IPv6 locales (que no deben confundirse con direcciones Link Local Address).

Las direcciones locales únicas están en el rango de `FC00::/7` a `FDFF::/7`, las LLA `FE80::/10`.

```
+7 Bits+1+---- 40 Bits ----+16 Bits+---------- 64 Bits ----------+
|1111 110|L|  Global ID     |Subnet |         Interface ID        |
|         |                 |  ID   |                              |
+---------+-----------------+-------+------------------------------+
  fc00::/7
```

| Unique Local Unicast Address (Hexadecimal) | Range of First Hextet | Range of First Hextet in Binary |
| --- | --- | --- |
| fc00::/7 | fc00 a fdff | 1111 1100 0000 0000 a 1111 1101 1111 1111 |

- Las direcciones ULA se pueden usar de manera similar a las direcciones de unidifusión global, **pero son para uso privado** y no debe enrutarse en la Internet global.
- Las direcciones ULA solo se deben utilizar en un área más limitada, como dentro de un sitio o entre un número limitado de dominios administrativos.
- Las direcciones ULA son para dispositivos que nunca necesitan acceso a Internet y nunca es necesario que sea accesible desde Internet (seguro), pero no tienen como propósito ser usadas para ocultar un dispositivo.
- Estas direcciones pueden ser enrutadas por los routers internos de una organización, pero cuando llegan al borde de la organización y pasan a un router del ISP, éstas serán descartadas.

> [!note] ULA a NAT
> ULA y NAT son un tema un poco complicado. El concepto de traducir una dirección local única ULA a una dirección de unicast global GUA es objeto de debate continuo dentro de la comunidad IPv6, y fomenta opiniones emocionales en ambos lados del argumento. La IAB (*Interne Architecture Board*) publicó un RFC informativo que destaca sus pensamientos sobre [[NAT]] e IPv6 en RFC 5902, "IAB Reflexiones sobre la traducción de direcciones de red IPv6".
>
> En este RFC, la IAB resume el uso de NAT de la siguiente manera: *"La traducción de direcciones de red se considera una solución para lograr una serie de propiedades deseadas para redes individuales, evitando varias cuestiones y permitiendo ocultar detalles de la red interna y proporcionar seguridad simple"*.

**L Flag y Global ID.** Como los primeros 7 bits son `1111 110x`, dependiendo si `x` es 0 ó 1 las ULAs se dividen en dos partes:
1. `fc00::/8` (`1111 1100`): cuando la bandera L de Local vale 0, no está definida.
2. **`fd00::/8`** (`1111 1101`): cuando la bandera L de Local vale 1.

Por lo tanto las únicas direcciones legítimas de ULA serán: **`fd00::/8`**.

## 9.9. SLA Site Local Address

Existen direcciones llamadas de Sitio local o Site-Local del tipo Unicast que son **OBSOLETAS** y comenzarían con el tipo `FEC0/10`, pero, no si existen, deberían desaparecer en el futuro.

No trataremos el tema.

## 9.10. IPv6 con IPv4 embebida

IPv6 tiene un mecanismo de transición desde IPv4; este mecanismo incorpora la técnica para que hosts y routers hagan dinámicamente un túnel de IPv4 con paquetes IPv6.

Las direcciones IPv6 asignadas a IPv4 pueden ser utilizadas por un dispositivo de doble pila que necesita enviar un paquete IPv6 a un dispositivo solo IPv4. Como se muestra en la figura, los primeros 80 bits están configurados como todos 0, y el segmento de 16 bits que precede a la dirección IPv4 de 32 bits todo 1. Los últimos 32 bits de la dirección se representan en notación decimal con puntos. Así, los primeros 96 bits están representados en hexadecimal y los últimos 32 bits contienen la dirección IPv4 en notación decimal con puntos.

```
|-------- 80 Bits --------|-- 16 Bits --|--- 32 Bits ---|
| 0000 ................ 0000 |   ffff   | w.x.y.z (IPv4) |
```

IPv6 asigna direcciones IPv6 de unicast que llevan en la parte más baja direcciones de IPv4. Hay dos tipos de IPv6 embebida:

**Tipo 1) IPv4-Compatible IPv6 address:** para ayudar en la "transición".

```
|-------- 80 Bits --------|-- 16 --|------- 32 Bits -------|
| 0000 ................ 0000 |  0000  |     IPv4 address     |
```

**Tipo 2) IPv4-Mapped IPv6 Address:** esta es usada para representar direcciones de nodos IPv4 como IPv6.

```
|-------- 80 Bits --------|-- 16 --|------- 32 Bits -------|
| 0000 ................ 0000 |  FFFF  |     IPv4 address     |
```

Esta última es para representar **SOLO** a los nodos IPv4 que **NO** soportan IPv6.

Es un esquema de direcciones de transición y no profundizaremos en la materia.

---
**Volver a:** [[08 - Identificacion de Direcciones|Identificación de Direcciones]]

**Continuar a:** [[10 - Anycast|Anycast]]
