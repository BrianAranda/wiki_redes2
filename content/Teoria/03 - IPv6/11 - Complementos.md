---
title: Complementos
fuente: "[6sos.org](http://www.6sos.org/index.php)"
---
## Videos

La cátedra recomienda una serie de videos ilustrativos (formato *whiteboard/pizarra animada*) como repaso complementario de la unidad, cubriendo tres ejes:

- **IPv6 Introducción:** repaso visual de la notación y estructura básica de una dirección IPv6.
- **Migración:** pasos para planificar una migración a IPv6 — verificar que los equipos sean compatibles con IPv6, verificar equipamiento con IPv6 habilitado por defecto, posibles túneles automáticos, elaborar un plan de implantación, deshabilitar equipamiento viejo.
- **Seguridad:** diferencias de seguridad entre IPv4 e IPv6 — formato de dirección, ND/MLD y multicast reemplazando ARP/ICMP e IGMP, distribución de grandes redes, cabeceras de extensión, autoconfiguración stateless, y preguntas abiertas sobre blacklists y firewall en el nuevo escenario de direccionamiento.

## Ejercicios de IPv6

### 1) Identificar según tipo las siguientes direcciones IPv6

1. `0000:00AA:ABCD:0000:A1B2:EEEE:1111:2222`
2. `FE80:0001:0000:FEAD:0005:5555:87AC:3CE1`
3. `2018:000A:DDED:4444:FF5E:00FE:0000:1245`
4. `FE80:0000:0000:0000:0005:4175:BBBB:0101`
5. `000F:0000:0000:0000:0000:AAAA:BBBB:CCCC`
6. `0FFF:0000:0000:FFFF:0000:1111:DCBA:0001`
7. `FFF1:0000:A000:B000:C000:D000:E000:F000`

### 2) Identificar cuáles de las direcciones IPv6 son correctas

1. `FE80::CAFE`
2. `4F00::0A01:1`
3. `::1`
4. `FE80::AC04::0012`
5. `2001:DB8:1:ACAD::FE55:0:0001`
6. `FEAA:0001:0:1:FFEA:1001:000E`
7. `2001:101::ABC0`

### 3) Comprimir las siguientes direcciones IPv6

1. `FE80:0001:0000:FEAD:0500:5555:87AC:3CE1`
2. `0000:0001:0000:0000:A000:0002:1111:BA01`
3. `2001:0DB8:0004:ACAD:0000:0000:FE00:0002`
4. `2001:0030:0001:ACAD:0000:330E:10C2:32BF`
5. `FE80:0000:0000:0001:0000:60BB:008E:7402`

### 4) Obtener información a partir del prefijo de red de la siguiente dirección IPv6

`2000:1111:aaaa:0:50a5:8a35:a5bb:66e1/64`

#### Resolución

De izquierda a derecha, la porción de red de una dirección IPv6 unicast global tiene una estructura jerárquica que proporcionará la siguiente información:

1. **Número de enrutamiento global de IANA** (los tres primeros bits binarios se fijan en `001`): `200::/12`
2. **Prefijo del registro regional de Internet (RIR)** (bits del /12 al /23): `2001:0D::/23` (el carácter D hexadecimal es 1101 en sistema binario. Los bits del 21 al 23 son 110, y el último bit es parte del prefijo del ISP).
3. **Prefijo del proveedor de servicios de Internet (ISP)** (bits hasta el /32): `2001:0DB8::/32`
4. **Prefijo de sitio o agregador de nivel de sitio (SLA)**, que el ISP asigna al cliente (bits hasta el /48): `2001:0DB8:0001::/48`
5. **Prefijo de subred** (asignado por el cliente; bits hasta el /64): `2001:0DB8:0001:ACAD::/64`
6. **ID de interfaz** (el host se identifica por los últimos 64 bits en la dirección): `2001:DB8:0001:ACAD:8D4F:4F4D:3237:95E2/64`

## Preguntas y Respuestas

La cátedra encontró varias preguntas sobre IPv6 en el sitio `http://www.6sos.org/index.php` y las incluyó, ya resueltas, como FAQ de cierre de la unidad.

> [!question]- 1. ¿Qué es el protocolo IP?
> **Respuesta:** IP son las siglas de "Internet Protocol". El protocolo fue diseñado en los años 70 con el fin de interconectar ordenadores que estuviesen en redes separadas. Hasta entonces los equipos informáticos se conectaban entre sí mediante redes locales, pero éstas estaban separadas entre sí formando islas de información.
>
> El nombre Internet para designar el protocolo, y posteriormente la red mundial de información, significa justamente "inter red", es decir, conexión entre redes. Al principio el protocolo tuvo un uso exclusivamente militar, pero rápidamente se fueron añadiendo ordenadores de universidades y posteriormente usuarios particulares y empresas.
>
> La Internet como red mundial de información es el resultado de la aplicación práctica del protocolo IP, es decir, el resultado de la interconexión de todas las redes de información que existen en el mundo.

> [!question]- 2. ¿Qué son las direcciones IP?
> **Respuesta:** La dirección IP es un identificador único que se aplica a cada dispositivo que esté conectado a una red IP. De esa forma los distintos elementos participantes de la red (servidores, routers, ordenadores de usuarios, etc.) se comunican entre sí utilizando su dirección IP como identificación.
>
> En la versión 4 del protocolo IP (la usada actualmente) las direcciones están formadas por 4 números de 8 bits (un número de 8 bits puede valer desde 0 hasta 255) que se suelen representar separados por puntos, por ejemplo: `155.54.210.63`.
>
> En total, una dirección IP versión 4 tiene 32 bits, lo que equivale a $2^{32}$ direcciones IP diferentes (unos 4 billones).

> [!question]- 3. ¿Qué es IPv6?
> **Respuesta:** IPv6 es la nomenclatura abreviada de "Internet Protocol Version 6". IPv6 es el protocolo de la próxima generación de Internet, al que originalmente se denominó IPng, que viene de "Internet Protocol Next Generation".
>
> IPv6 es por tanto la actualización del protocolo de red de datos en el que se fundamenta Internet. El IETF (*Internet Engineering Task Force*) desarrolló las especificaciones básicas durante los 90 para sustituir la versión actual del protocolo de Internet, IP versión 4 (IPv4), que vio la luz a finales de los 70.

> [!question]- 4. ¿Qué pasó con IPv5?
> **Respuesta:** La referencia "versión 5" se empleó para otro cometido distinto. Se diseñó un protocolo experimental de streaming en tiempo real. Para evitar confusiones, se optó por no usar ese nombre.

> [!question]- 5. ¿Por qué es necesario un nuevo protocolo IPv6?
> **Respuesta:** IPv4 ha demostrado por su duración un diseño flexible y poderoso, pero está empezando a tener problemas, siendo el más importante el crecimiento en poco tiempo de la necesidad de direcciones IP.
>
> Nuevos usuarios en países tan poblados como China o la India, nuevas tecnologías con dispositivos conectados de forma permanente (xDSL, cable, PLC, PDAs, teléfonos móviles UMTS, etc.) están provocando la rápida desaparición, de forma práctica, de las direcciones IP disponibles en la versión 4.
>
> IPv6 resuelve este problema creando un nuevo formato de dirección IP con muchísimas más variaciones, de forma que el número de direcciones IP no se agote incluso contando con que cada dispositivo que podamos imaginar (incluyendo electrodomésticos) se termine conectando a la red Internet.
>
> IPv6 añade también muchas mejoras en áreas como el *routing* y la autoconfiguración de red. Los nuevos dispositivos que se incorporen a la red serán *plug and play*. Con IPv6 no es preciso configurar la IP del DNS, la puerta de enlace predeterminada, la máscara de subred y demás parámetros. Simplemente hay que enchufar el equipo a la red y éste obtendrá de la misma todos los datos de configuración que necesita.

> [!question]- 6. ¿Cuáles son las mayores ventajas de IPv6?
> **Respuesta:** Las podemos resumir en las siguientes:
>
> - **Escalabilidad:** IPv6 tiene direcciones de 128 bits frente a las direcciones de 32 bits de IPv4. Por tanto el número de direcciones IP disponibles se multiplica por 7,9 × 10²⁸. IPv6 nos ofrece un espacio de $2^{128}$ (340.282.366.920.938.463.463.374.607.431.768.211.456). Para hacernos a la idea de lo que esta cifra implica, basta con calcular el número de direcciones IP que podríamos tener por metro cuadrado de la superficie terrestre: nada más y nada menos que 665.570.793.348.866.943.898.599 (ver [[02 - Cabecera IPv6#Cantidad de IPs por metro cuadrado|Cantidad de IPs por metro cuadrado]]).
> - **Seguridad:** IPv6 incluye seguridad en sus especificaciones como es la encriptación de la información y la autentificación del remitente de dicha información.
> - **Aplicaciones en tiempo real:** para dar mejor soporte a tráfico en tiempo real (i.e. videoconferencia), IPv6 incluye etiquetado de flujos en sus especificaciones. Con este mecanismo los encaminadores o routers pueden reconocer a qué flujo extremo a extremo pertenecen los paquetes que se transmiten.
> - **Plug and Play:** IPv6 incluye en su estándar el mecanismo "plug and play", lo cual facilita a los usuarios la conexión de sus equipos a la red. La configuración se realiza automáticamente.
> - **Movilidad:** IPv6 incluye mecanismos de movilidad más eficientes y robustos.
> - **Especificaciones más claras y optimizadas:** IPv6 seguirá las buenas prácticas de IPv4 y elimina las características no utilizadas u obsoletas de IPv4, con lo que se consigue una optimización del protocolo de Internet. La idea es quedarse con lo bueno y eliminar lo malo del protocolo actual.
> - **Direccionamiento y encaminado:** IPv6 mejora la jerarquía de direccionamiento y encaminamiento.
> - **Extensibilidad:** IPv6 ha sido diseñado para ser extensible y ofrece soporte optimizado para nuevas opciones y extensiones.

> [!question]- 7. ¿Por qué faltan direcciones IP cuando en teoría el protocolo permite hasta 2^32 direcciones?
> **Respuesta:** El protocolo IP actual nos permite tener más de 4 mil millones de direcciones. El problema de falta de direcciones actual surge porque en la década de los 80, sin prever el auge futuro del uso de Internet, se asignaron una gran cantidad de direcciones innecesarias sin ningún tipo de control. Esto ha provocado que existan muchas organizaciones que cuentan con un número mucho mayor de direcciones de las que realmente necesitan, con la consecuente carencia actual, o la imposibilidad práctica de usarlas todas, por la fragmentación producida.

> [!question]- 8. ¿Hay otra solución más sencilla a IPv6?
> **Respuesta:** Hay una solución que podríamos considerar como evidente, como sería la renumeración, y reasignación del espacio de direccionamiento IPv4. Sin embargo, no es tan sencillo, es incluso impensable en algunas redes, ya que requiere unos esfuerzos de coordinación, a escala mundial, absolutamente inimaginables. Además, seguiría siendo limitado para la población y cantidad de dispositivos que se prevé estén conectados a Internet en pocos años.

> [!question]- 9. ¿Cuál es la solución empleada actualmente?
> **Respuesta:** Temporalmente, para paliar la falta de direcciones, se emplean mecanismos [[NAT]] (*network address translation*). Este mecanismo consiste básicamente y a grandes rasgos, en usar una única dirección IPv4 para que una red completa pueda acceder a Internet. Desafortunadamente, de seguir con IPv4, este mecanismo no sería "temporal", sino "invariablemente permanente".

> [!question]- 10. ¿Por qué no seguimos usando NAT para siempre?
> **Respuesta:** NAT implica la imposibilidad práctica de muchas aplicaciones, que quedan relegadas a su uso en Intranets, dado que muchos protocolos son incapaces de atravesar los dispositivos NAT:
>
> Las aplicaciones multimedia como por ejemplo las aplicaciones de videoconferencia, telefonía por Internet, vídeo bajo demanda..., no funcionan bien mediante NAT. Esto es debido a que los protocolos RTP y RTCP ("*Real-time Transport Protocol*" y "*Real Time Control Protocol*") usan UDP con asignación dinámica de puertos (NAT no soporta esta traslación).
> La autenticación Kerberos necesita la dirección fuente, que es modificada por NAT en la cabecera IP.
> IPSec permite la autenticación, integridad y confidencialidad de los datos. Sin embargo, al utilizarse NAT, IPsec pierde integridad, debido a que NAT cambia la dirección en la cabecera IP.
> Multicast, aunque es posible, técnicamente, su configuración es tan complicada con NAT que en la práctica no se emplea.
>
> La idea es que NAT desaparezca con IPv6.

> [!question]- 11. ¿Cómo es el formato de las direcciones IPv6?
> **Respuesta:** Veamos un ejemplo de dirección IP versión 6: `2001:0ba0:01e0:d001:0000:0000:d0f0:0010`.
>
> La dirección en total está formada por 128 bits, frente a los 32 de las actuales (versión 4). Se representa en 8 grupos de 16 bits cada uno, separados por el carácter `:`.
>
> Cada grupo de 16 bits se representa a su vez mediante 4 cifras hexadecimales, es decir, que cada cifra va del 0 al 15 (0,1,2,... a,b,c,d,e,f siendo a=10, b=11, etc. hasta f=15).
>
> Existe un formato abreviado para designar direcciones IP versión 6 cuando las terminaciones son todas 0, por ejemplo: `2001:0ba0::` es la forma abreviada de `2001:0ba0:0000:0000:0000:0000:0000:0000`.
>
> Igualmente, se puede poner un solo 0, quitar los ceros a la izquierda y se pueden abreviar 4 ceros en medio de la dirección (una sola vez en cada dirección), así: `2001:ba0:0:0:0::1234` es la forma abreviada de `2001:0ba0:0000:0000:0000:0000:0000:1234`.
>
> También existe un método para designar grupos de direcciones IP o subredes que consiste en especificar el número de bits que designan la subred, empezando de izquierda a derecha, utilizándose los bits restantes para designar equipos individuales dentro de la subred.
>
> Por ejemplo la notación: `2001:0ba0:01a0::/48`. Indica que la parte de la dirección IP utilizada para representar la subred tiene 48 bits. Como cada cifra hexadecimal son 4 bits, esto indica que la parte utilizada para representar la subred está formada por 12 cifras, es decir: "2001:0ba0:01a0". El resto de las cifras de la dirección IP (las que estén a su derecha cuando se escriba completa) se utilizarán para representar nodos dentro de la subred.

> [!question]- 12. ¿Cuáles son las direcciones especiales en IPv6?
> **Respuesta:** **Dirección virtual de auto-retorno o loopback.** Esta dirección se especifica en IPv4 con la dirección `127.0.0.1`. En IPv6 esta dirección se representa como `::1`.
>
> **Dirección no especificada (`::`).** Nunca debe ser asignada a ningún nodo, ya que se emplea para indicar la ausencia de dirección.
>
> Túneles dinámicos/automáticos de IPv6 sobre IPv4, de forma que permiten la retransmisión de tráfico IPv6 sobre redes IPv4, de forma transparente. Se denominan direcciones IPv6 compatibles con IPv4. Se indican como `::`, por ejemplo `::156.55.23.5`.
>
> Representación automática de direcciones IPv4 sobre IPv6: nos permite que los nodos que sólo soportan IPv4 puedan seguir trabajando en redes IPv6. Se denominan "direcciones IPv6 mapeadas desde IPv4". Se indican como `::FFFF:`, por ejemplo `::FFFF:156.55.43.3`.

> [!question]- 13. ¿Qué se entiende por "autoconfiguración" en IPv6?
> **Respuesta:** Es una nueva característica del protocolo, que facilita la administración de las redes, y las tareas de instalación de los sistemas operativos por parte de los propios usuarios, en lo que a configuración de IP se refiere.
>
> Frecuentemente se denomina esta característica como "*plug & play*" o "conectar y funcionar". Esto permite que al conectar una máquina a una red IPv6, se le asigne automáticamente una (o varias) direcciones IPv6.

> [!question]- 14. ¿En qué consiste la "autoconfiguración"?
> **Respuesta:** El proceso es variable y muy complejo, ya que la política decidida por el administrador de red es la que determina qué parámetros serán "asignados" automáticamente.
>
> Al menos, y cuando no hay administrador de red, se suele incluir la asignación de una dirección de "enlace local". La dirección de "enlace local" permite la comunicación con los otros nodos situados en el mismo enlace físico, cuando por ejemplo, hablamos de una interfaz Ethernet.

> [!question]- 15. ¿Hay varias formas de "autoconfiguración"?
> **Respuesta:** Sí, efectivamente, se distinguen dos mecanismos básicos de autoconfiguración.
>
> Por un lado existe la autoconfiguración "stateful" y por otro la "stateless". Lo más importante es entender que estos mecanismos pueden utilizarse de forma complementaria, para definir unos u otros parámetros de configuración por medio de uno u otro de los mecanismos, o de ambos simultáneamente.

> [!question]- 16. ¿En qué consiste la autoconfiguración "stateless"?
> **Respuesta:** Comúnmente se denomina autoconfiguración "serverless", y ello es casi una definición del mecanismo.
>
> En la autoconfiguración "stateless", no se requiere ninguna configuración manual de equipos (hosts) y servidores, y tan sólo en ocasiones, mínima configuración de los routers.
>
> Por tanto, para la autoconfiguración stateless, no se requiere la presencia de servidores.
>
> En este mecanismo, el equipo (host) genera su propia dirección usando una combinación de la información que el mismo tiene (en su interfaz, o tarjeta de red), y la información que periódicamente suministran los routers.
>
> Los routers indican el prefijo que identifica la(-s) subredes asociadas con el enlace (ver [[07 - Direcciones Dinamicas#14.1. SLAAC|SLAAC]]).

> [!question]- 17. ¿Qué es el "identificador de interfaz"?
> **Respuesta:** El "identificador de interfaz" es aquel que identifica de forma única una interfaz en una subred, y que a menudo, por defecto, es generado a partir de la dirección MAC de la tarjeta de red.
>
> La dirección IPv6 se forma combinando los 64 bits del identificador de interfaz con los prefijos que los encaminadores (routers) indican como correspondientes a la subred (ver [[04 - Unicast#1) EUI-64|EUI-64]]).

> [!question]- 18. ¿Qué ocurre si en una red no hay encaminadores?
> **Respuesta:** Si no hay encaminadores, el identificador de interfaz es autosuficiente para permitir al PC que genere la dirección de enlace local.
>
> La dirección de enlace local es suficiente, lógicamente, para permitir la comunicación entre los diversos nodos conectados al mismo enlace (la misma red local).

> [!question]- 19. ¿En qué consiste la autoconfiguración "stateful"?
> **Respuesta:** Al contrario que en la configuración "stateless", en el caso de la "stateful", se requiere la existencia de algún tipo de servidor, a través del cual los nodos o host reciben la información y parámetros de su conexión a la red.
>
> Los servidores mantienen, por tanto, una base de datos con todas las direcciones que han sido asignadas y a qué hosts, al igual que todo lo relacionado con el resto de los parámetros.
>
> Por lo general, este mecanismo se basa en el uso de DHCPv6 (ver [[07 - Direcciones Dinamicas#14.3. DHCPv6 con estado|DHCPv6 con estado]]).

> [!question]- 20. ¿Qué sentido tiene el uso de ambos mecanismos de autoconfiguración?
> **Respuesta:** La autoconfiguración "stateful", a menudo se usa cuando se requiere un control más riguroso acerca de qué dirección es asignada a qué hosts, al contrario del caso de la autoconfiguración "stateless" (en la que la única preocupación es que la dirección no esté duplicada).
>
> Por tanto, en función de la política de administración de la red, se puede requerir que determinadas direcciones sean asignadas de forma fija a determinas máquinas, y por tanto ello requiere el mecanismo "stateful", pero el control del resto de los parámetros puede no ser necesariamente tan riguroso.
>
> Por supuesto, el caso puede ser el de una política invertida respecto de este ejemplo, es decir, que no importe la dirección que se asigne, y por tanto se emplea "stateless", pero se desea que el resto de los parámetros sean asignados de forma "estática", con información almacenada en un servidor.

> [!question]- 21. ¿Qué es la caducidad de las direcciones IPv6?
> **Respuesta:** Las direcciones IPv6 son "alquiladas" a una interfaz por un tiempo fijo si estas son asignadas por DHCPv6, y sea probablemente infinito.
>
> Cuando dicho "tiempo de vida" expira, la vinculación entre la interfaz y la dirección se invalida, y dicha dirección puede ser reasignada a otra interfaz en cualquier punto de Internet.
>
> Para la adecuada gestión de la expiración de las direcciones, una dirección pasa por dos fases mientras está asignada a una interfaz:
>
> a) Inicialmente, una dirección es "preferida" ("preferred"), lo que implica que su uso en cualquier comunicación no está restringido.
>
> b) Posteriormente, una dirección pasa a ser "desaprobada" ("deprecated"), anticipándose a que se va a invalidar su vínculo con la interfaz actual. Mientras esta en estado "desaprobada", se desaconseja el uso de una dirección, aunque no estrictamente prohibido. Sin embargo, cuando sea posible, cualquier nueva comunicación (por ejemplo la apertura de una nueva conexión TCP), debe usar una dirección "preferida". Una dirección "desaprobada" sólo debería de ser utilizada por aquellas aplicaciones que ya la empleaban y a las que les es difícil cambiar a otra dirección sin causar una interrupción del servicio (ver [[04 - Unicast#Tiempos de vida de las direcciones (informativo)|Tiempos de vida de las direcciones]]).

> [!question]- 22. ¿Qué es la detección de direcciones duplicadas?
> **Respuesta:** Para asegurarse de que las direcciones asignadas, tanto por procesos de autoconfiguración como por mecanismos manuales, son únicas en un determinado enlace, se emplea, antes de dicha asignación, el algoritmo de detección de direcciones duplicadas.
>
> Recordemos que algunos SO asignan de manera aleatoria la parte de IP que corresponde a la interfase y se podría dar el caso de que hayan dos iguales.
>
> Si se detecta una dirección duplicada, esta no puede ser asignada a la interfaz en cuestión.
>
> La dirección en la que se está aplicando el algoritmo de detección de direcciones duplicadas, se dice que es "tentativa", hasta la completa finalización de dicho algoritmo. En este caso, no se considera que dicha dirección ha sido asignada a una interfaz, y por tanto los paquetes recibidos son descartados (ver [[07 - Direcciones Dinamicas#14.4. Duplicate Address Detection (DAD)|DAD]]).

> [!question]- 23. ¿Cómo se forma una dirección IPv6?
> **Respuesta:** Ya sabemos que una dirección IPv6 tiene 128 bits. De estos, los 64 bits inferiores o de menor peso, identifican a una determinada interfaz, como ya hemos comentado, y se denominan "identificador de interfaz".
>
> Los 64 bits de orden superior, indican la "ruta" o "prefijo" de la red o del router en uno de cuyos enlaces se conecta dicha interfaz.
>
> La dirección IPv6, se forma por tanto, combinando el prefijo con el identificador de interfaz (ver [[04 - Unicast#9.1. Global Unicast Address (GUA)|GUA]]).

> [!question]- 24. ¿Es posible tener direcciones IPv4 e IPv6 a la vez?
> **Respuesta:** Sí. La mayoría de los sistemas operativos que soportan actualmente IPv6 permiten la utilización simultánea de ambos protocolos. De esta forma, es posible la comunicación tanto con redes que sólo soporten IPv4 como con aquellas redes que sólo soporten IPv6, así como la utilización de aplicaciones diseñadas para ambos protocolos (ver [[09 - Migracion IPv4 a IPv6#16.1. Técnicas de Doble pila (DUAL STACK)|Dual Stack]]).

> [!question]- 25. ¿Es posible la utilización de tráfico IPv6 sobre redes IPv4?
> **Respuesta:** Sí. Para ello se utiliza una técnica que se denomina túnel. Consiste en introducir en un extremo el tráfico IPv6 como si fueran datos del protocolo IPv4. De esta manera, el tráfico IPv6 viaja "encapsulado" dentro del tráfico IPv4 y en el otro extremo, este tráfico es separado e interpretado como tráfico IPv6. Para ello necesitas utilizar un servidor de túneles, como el que proporcionamos en la sección de conectividad (ver [[09 - Migracion IPv4 a IPv6#16.2. Técnicas de Tunneling|Técnicas de Tunneling]]).

> [!question]- 26. ¿Cómo se repartirán las nuevas direcciones IPv6?
> **Respuesta:** Los proveedores de servicios Internet (ISPs) que están ya en el proceso de implantación de la nueva versión del protocolo IP siguen las políticas de los registradores regionales de Internet o RIRs (*Regional Internet Registries*, RIPE en el caso de Europa, LATNIC en Latinoamérica), respecto de cómo repartir el enorme espacio de direccionamiento IP versión 6 entre sus clientes.
>
> Existe una diferencia muy grande entre las recomendaciones para la asignación de las direcciones IP versión 4, que busca ante todo la economía de direcciones, pues como es sabido es un recurso escaso y debe ser administrado con precaución, y las de la versión 6 que busca la flexibilidad.
>
> Los RIPE RIRs estará recomendando a los ISP y operadores que asignen a cada cliente de IPv6 una subred del tipo `/48` con el fin de que el cliente pueda gestionar sus propias subredes sin tener que utilizar NAT. (La idea es que NAT desaparezca en IPv6).

> [!question]- 27. ¿Qué es la siguiente cabecera?
> **Respuesta:** El protocolo IPv6, para permitir su máxima escalabilidad, ha optado por un sistema de una cabecera básica, con información mínima, a diferencia de IPv4, donde las diferentes opciones se van añadiendo a dicha cabecera básica.
>
> En su lugar, IPv6 conlleva un mecanismo de "encadenamiento" de cabeceras, de tal forma que la cabecera básica indica cuál es la siguiente, y así sucesivamente.
>
> ![[encadenamiento-cabeceras-ipv6.png]]

> [!question]- 28. ¿Cuál es la ventaja del mecanismo de Siguiente Cabecera?
> **Respuesta:** Las ventajas son varias y bastante evidentes.
>
> La primera es que permite que el tamaño de la cabecera básica sea siempre el mismo, y perfectamente conocido.
>
> La segunda es que los routers situados entre una dirección origen y una dirección destino, es decir, en el camino que tiene que recorrer un determinado paquete, no necesiten procesar ni siquiera interpretar o entender las "siguientes cabeceras". Ello supone además, para IPv4, la desventaja de que los routers tienen que ser actualizados más frecuentemente para soportar cualquier nueva función del protocolo, ya que debía ser capaz de interpretarla, aún cuando no tuviera que realizar ninguna función al respecto.
>
> La tercera ventaja es que no hay límite para el número de opciones que se soportan. En IPv4, sólo se pueden soportar opciones hasta un máximo de 40 bytes.

> [!question]- 29. ¿Cuál es la longitud de la cabecera IPv6?
> **Respuesta:** La longitud de la cabecera IPv6 es de 40 bytes, a diferencia de la IPv4 que podría oscilar entre 20 y 60 bytes (según las opciones empleadas).
>
> Sin embargo, se ha simplificado enormemente, dado que se ha pasado de 12 campos a tan solo 8, evitando redundancias.

> [!question]- 30. ¿Por qué es más eficaz el proceso de cabeceras IPv6?
> **Respuesta:** Como hemos dicho, la cabecera básica IPv6 es de longitud fija. Ello implica que es más fácil su procesado por parte de nodos y routers, e incluso simplifica el diseño de semiconductores dedicados a su procesado.
>
> Por otro lado, su estructura está alineada a 64 bits, lo que permite también que los nuevos y futuros procesadores (como mínimo de 64 bits), puedan procesarla de forma más eficiente.
>
> Pero también hemos mencionado que tiene menos campos, lo que de nuevo redunda en dicha eficacia.
>
> Por último, en general, y salvo un par de excepciones, los puntos intermedios de la red (routers), sólo tienen que procesar la cabecera básica, mientras que en IPv4 se ven forzados a procesarlas todas.

> [!question]- 31. ¿Qué es un "jumbogram"?
> **Respuesta:** Es una opción que permite que la longitud máxima de los datos transportados por IPv6 (16 bits, 65.535 bytes), se extienda hasta 64 bits.
>
> Se prevé su uso especialmente para tráficos multimedia, sobre líneas de banda ancha. Sin embargo estos paquetes no pueden ser fragmentados.

> [!question]- 32. ¿Para qué se utiliza la cabecera de fragmentación?
> **Respuesta:** En IPv6, los routers intermedios no realizan la fragmentación de los paquetes, sino que en su lugar la fragmentación se realiza extremo a extremo.
>
> Es decir, son los nodos origen y destino los que se ocupan, a través de la propia pila IPv6, de fragmentar un paquete, y en su caso reensamblarlo, respectivamente.
>
> El proceso de fragmentación consiste, lógicamente, en dividir en paquetes más pequeños la parte "fragmentable" del paquete origen, y agregarle a cada uno de ellos la parte no fragmentable, que permitirá, al nodo destino, la re-composición de dicho paquete.

> [!question]- 33. ¿Qué son los mecanismos de transición?
> **Respuesta:** Son los métodos ideados para que coexistan máquinas y redes con IPv4 y/o IPv6 (ver [[09 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]).

> [!question]- 34. ¿Qué es un túnel IPv6-en-IPv4?
> **Respuesta:** Es un mecanismo de transición que permite a máquinas con IPv6 instalado comunicarse entre sí a través de una red IPv4.
>
> El mecanismo consiste en crear los paquetes IPv6 de forma normal e introducirlos en un paquete IPv4. El proceso inverso se realiza en la máquina destino, que recibe un paquete IPv4 y extrae el paquete IPv6.

> [!question]- 35. ¿Por qué no se necesita campo de ID en IPv6?
> **Respuesta:** Hay que empezar por preguntarse para qué se usa el campo ID en IPv4: la respuesta es para poder re-ensamblar en origen los fragmentos. En IPv6, los routers intermedios no fragmentan paquetes. Si el paquete es demasiado grande para una red intermedia, simplemente se descarta y se envía un mensaje ICMP ("*Packet Too Big*") al origen, para que el dispositivo que envía ajuste el tamaño de los paquetes. Esto elimina la necesidad de tener un campo de identificación en cada paquete, ya que los routers no necesitan fragmentarlos. Así que se elimina el campo porque no se necesita identificar el Datagrama. En caso de que fuera necesario, se debería poner en la extensión de encabezado de fragmentación, solo cuando sea necesario, algo que en IPv6 se debería evitar.

> [!question]- 36. ¿Por qué creen que en IPv6 el Header no necesita campo de Checksum?
> **Respuesta:** El encabezado IPv6 no está protegido por una suma de comprobación (*checksum*); la protección de integridad se asume asegurada tanto por el checksum de capa de enlace y por un checksum de nivel superior (TCP, UDP, etc.). De esta forma los routers IPv6 no necesitan recalcular la suma de comprobación cada vez que algún campo del encabezado (como el contador de saltos o Tiempo de Vida) cambia.

---
**Volver a:** [[10 - Herramientas y Ejemplos Practicos|Herramientas y Ejemplos Prácticos]]

**Continuar a:** [[Teoria/03 - IPv6/index#Preguntas de repaso|Preguntas de repaso]]
