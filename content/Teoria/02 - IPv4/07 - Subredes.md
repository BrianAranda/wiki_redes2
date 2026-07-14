---
title: Subredes
---
En el direccionamiento con clase, los primeros bits de una dirección IP definían la red de la que formaba parte un host (ver [[05 - Direcciones IP|Direcciones IP]]). A medida que Internet creció, esta forma de asignar direcciones se volvió ineficiente: las direcciones se otorgaban según lo solicitado, no según la necesidad real, lo que llevó a un agotamiento prematuro del espacio de direcciones.

> [!note] El problema de fondo
> Un `/24` admite 254 hosts (demasiado poco); un `/16` admite 65.534 hosts (demasiado). Asignar una única `/16` a una organización con unos pocos cientos de hosts agotaba prematuramente ese espacio, y a la vez la cantidad de entradas en las tablas de ruteo de los routers crecía sin control a medida que aumentaba la cantidad de redes.

## Subredes y máscaras de subred

El concepto de subred se introdujo para permitir una complejidad arbitraria de LANs interconectadas dentro de una organización, sin exponer esa complejidad al resto de Internet.

> [!important] Un solo número de red hacia afuera
> Si se asigna un único número de red a todas las LAN de un sitio, desde el resto de Internet **solo hay una red visible**, lo que simplifica el direccionamiento y el enrutamiento externo. Puertas adentro, cada LAN recibe un número de subred, y los routers locales deben conocer las subredes a las que están conectados.

![[router-subredes-privadas-vista-externa.png]]

La parte de host de la dirección IP se divide entonces en un número de subred y un número de host. La **máscara de dirección** indica qué posiciones de bit contienen este número de red extendida, y le permite al host determinar si un datagrama saliente va a un host de la misma LAN (envío directo) o a otra LAN (envío al router).

![[jerarquia-subred-clasica-vs-tres-niveles.png]]

## Subnetting

En 1985, el **RFC 950** definió el procedimiento estándar para subdividir una red Clase A, B o C en partes más pequeñas, introduciendo una nueva jerarquía de direccionamiento: el campo de host se subdivide en subred + host.

> [!important] Qué problemas resuelve el subnetting
> 1. Achica las entradas de la tabla de ruteo (esto se suele olvidar).
> 2. Optimiza el uso de direcciones IP.

Todas las subredes de un mismo número de red usan el mismo prefijo de red pero distinto número de subred, y son invisibles desde afuera: los routers de Internet ven una sola entrada en su tabla de ruteo por toda la organización, sin importar cuántas subredes tenga puertas adentro.

### CRID y Subnetting

> [!info] Relación entre CRID y CIDR
> - **CRID** (Classless Routing Identifier) hace referencia a la identificación de rutas sin clases, relacionado con los esquemas de enrutamiento sin clase. Se utiliza en protocolos como **CIDR** (Classless Inter-Domain Routing), donde las direcciones IP se asignan con prefijos de longitud variable en vez de bloques fijos por clase.
> - Ambos trabajan con direccionamiento **sin clases** (classless) y evitan el desperdicio de direcciones.
> - El subnetting utiliza CRID para crear redes más pequeñas, dividiendo direcciones IP en bloques de tamaño variable.

## Prefijo extendido de Red

Los routers de Internet usan solo el **prefijo de red** de la dirección destino para rutear tráfico hacia un entorno dividido en subredes; los routers dentro de ese entorno usan el prefijo de red para rutear entre las subredes individuales.

El prefijo de red se compone del campo de red con clase más el número de subred, y se representa con una barra al final de la notación decimal (ej. `/27`). El **prefijo de red extendido** es otra forma de referirse a la **máscara de subred**: los bits de la máscara y los de la dirección de Internet tienen una relación uno a uno, y juntos permiten determinar si una IP pertenece o no a una subred dada.

![[mascara-subred-prefijo-extendido-ejemplo.png]]

![[calculadora-subred-10-0-0-0-8.png]]

## Diseño

El despliegue de un plan de direccionamiento requiere responder cuatro preguntas clave:

1. ¿Cuántas subredes totales necesita la organización **hoy**?
2. ¿Cuántas subredes totales necesitará la organización en el **futuro**?
3. ¿Cuántos hosts hay actualmente en la **subred más grande** de la organización?
4. ¿Cuántos hosts habrá en la subred más grande de la organización **en el futuro**?

## Ejemplo de diseño de subredes

Una organización tiene asignada la dirección `193.1.1.0/24`. Internamente necesita definir **6 subredes**, sin superar los **25 hosts por subred**.

1. **Bits para la máscara:** con 2 bits se obtienen $2^2=4$ subredes (insuficiente); con 3 bits, $2^3=8$ subredes. Se adoptan **3 bits**, con máscara `255.255.255.224` (`/27`).
2. **Cantidad de hosts:** quedan $8-3=5$ bits de host, es decir $2^5=32$ direcciones. Descontando las 2 reservadas (red y broadcast), quedan **30 hosts** posibles por subred — alcanza para los 25 requeridos, con 5 de margen.
3. **Direcciones de las subredes:** con los 3 bits definidos se obtienen 8 subredes en total (2 más de las 6 requeridas).

![[diseno-subred-193-1-1-0-24-prefijo-27.png]]

![[tabla-8-subredes-193-1-1-0-27.png]]

4. **Direcciones de host** dentro de cada subred (ejemplo con la subred N.º 6, con sus 30 hosts posibles):

![[tabla-hosts-subred-6-193-1-1-192-27.png]]

5. **Dirección de broadcast** de cada subred: se obtiene rellenando los bits de host con todos `1`.

![[tabla-resumen-subredes-primera-ultima-broadcast.png]]

> [!tip] Dato útil
> La dirección de broadcast de una subred es exactamente 1 bit menos que la dirección base de la subred siguiente.

## Ejercicios de subredes

Para cada dirección, determinar la máscara de subred, la dirección de gateway (GW), y la primera y última dirección utilizable de esa subred:

1. `172.16.18.10/18`
2. `172.28.26.12/13`
3. `192.168.200.100/27`
4. `10.10.229.130/21`
5. `10.113.30.38/22`

## Ejercicios IP: teoría y práctica

### Sección teoría

1. Describa los objetivos principales de la red primitiva ARPANET.
2. Dada una cantidad X de paquetes que "viajan" por internet, ¿usan la misma ruta para llegar?
3. ¿Qué diferencia existe entre una dirección física y una lógica?
4. ¿Qué función cumple el protocolo IP?
5. Describa brevemente el proceso de envío, transmisión y llegada de paquetes en una red de conmutación de paquetes.
6. ¿Cuántos tipos de clases IP existen y en qué se diferencia cada una?
7. ¿Por qué es necesario realizar una división de redes o subnetting? ¿Qué ventajas se obtienen?
8. ¿Cuál es la función de la IP `127.0.0.1`?
9. En un datagrama IP, ¿qué función cumple el campo TTL?

### Sección práctica

**Ejercicio 1:**
a) Analizar las siguientes direcciones IPv4 y determinar si son válidas, a qué clase pertenecen y si son públicas o privadas (si no es válida, explicar por qué): `192.168.1.5`, `192.256.5.10`, `240.1.10.10`, `100.100.15.15`.
b) Indicar qué máscaras son válidas y cuáles no, y por qué: `255.255.0.0`, `255.256.255.0`, `254.255.255.0`, `255.255.0.255`.

**Ejercicio 2:** dada la red `149.250.0.0` con máscara `255.255.255.0`: ¿cuántas redes disponibles hay? Indicar la primera y la última red disponible, y las direcciones de broadcast de la primera y la última.

**Ejercicio 3:** dada la dirección `220.120.120.10/27`, ¿a qué subred pertenece? Dada `192.255.15.75/28`, ¿cuántas IP para host y cuántas subredes como máximo son posibles?

**Ejercicio 4:** sea la subred `150.214.141.0` con máscara `255.255.255.0`. Comprobar cuáles de estas direcciones **no** pertenecen a dicha red: `150.214.141.128`, `150.214.141.138`, `150.214.142.23`.

**Ejercicio 5:** dada la IP `172.16.45.14/30`, ¿cuál es la dirección de la subred a la que pertenece ese nodo?

**Ejercicio 6:** una organización posee la IP `172.12.0.0`. Se necesita dividir en subredes que soporten un máximo de 459 hosts por subred, procurando mantener al máximo el número de subredes disponibles. Determinar la máscara a utilizar.

**Ejercicio 7:** la empresa NATURALIVE es propietaria de `172.50.10.07/16`. Se plantearon inicialmente 25 subredes, con un mínimo de 900 hosts por subred, y se proyecta un crecimiento a 55 subredes en los próximos años. Determinar qué máscara de subred se debería utilizar.

---
**Volver a:** [[06 - ARP|ARP]]

**Continuar a:** [[08 - Localhost|Localhost]]
