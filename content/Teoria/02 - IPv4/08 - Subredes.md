---
title: Subredes
fuente:
  - "[RFC 950](https://www.rfc-es.org/rfc/rfc0950-es.txt)"
---
En el [[06 - Direcciones IPv4#Redes con Clases|direccionamiento con clase]], los primeros bits de una dirección IP definían la red de la que formaba parte un host. A medida que Internet creció, esta forma de asignar direcciones se volvió ineficiente: las direcciones se otorgaban según lo solicitado, no según la necesidad real, lo que llevó a un agotamiento prematuro del espacio de direcciones.

> [!warning] El problema de distribución 
> Un `/24` admite 254 hosts (demasiado poco); un `/16` admite 65.534 hosts (demasiado). Asignar una única `/16` a una organización con unos pocos cientos de hosts agotaba prematuramente ese espacio, y a la vez la cantidad de entradas en las tablas de ruteo de los routers crecía sin control a medida que aumentaba la cantidad de redes.

El concepto de **subred** se introdujo para permitir una complejidad arbitraria de LANs interconectadas dentro de una organización, sin exponer esa complejidad al resto de Internet.

> [!important] Un solo número de red hacia afuera
> Si se asigna un único número de red a todas las LAN de un sitio, desde el resto de Internet **solo hay una red visible**, lo que simplifica el direccionamiento y el enrutamiento externo. Puertas adentro, cada LAN recibe un número de subred, y los *routers* locales deben conocer las subredes a las que están conectados.

![[subred_privada.png|500]]

## *Subnetting*

En 1985, el [RFC 950](https://www.rfc-es.org/rfc/rfc0950-es.txt) definió el procedimiento estándar para subdividir una red Clase A, B o C en partes más pequeñas, introduciendo una nueva jerarquía de direccionamiento:

![[subnet_jerarquia.png|600]]

La parte de *host* de la dirección IP se divide entonces en un **número de subred** y un **número de *host***. La **máscara de dirección** indica qué posiciones de bit contienen este número de red extendida, y le permite al *host* determinar si un datagrama saliente va a un *host* de la misma LAN (envío directo) o a otra LAN (envío al *router*).

> [!important] Qué problemas resuelve el *subnetting*
> 1. Achica las entradas de la tabla de ruteo.
> 2. Optimiza el uso de direcciones IP.
> 3. Reduce el dominio de broadcast

Todas las subredes de un mismo número de red usan el **mismo prefijo de red pero distinto número de subred**, y son invisibles desde afuera: los *routers* de Internet ven una sola entrada en su tabla de ruteo por toda la organización, sin importar cuántas subredes tenga puertas adentro.

Además, una trama de broadcast (como un [[07 - ARP#Funcionamiento de ARP|ARP Request]]) la recibe y procesa cada host del segmento, aunque solo uno responda. En una red grande sin segmentar, esto puede consumir una fracción enorme del tráfico total (ej. en la red de la CELO el 60% de los paquetes enviados eran de broadcast). Al dividir en subredes más chicas, cada broadcast queda contenido dentro de su propia subred en vez de inundar toda la red.

### Prefijo extendido de Red

Los *routers* de Internet usan solo el prefijo de red de la dirección destino para rutear tráfico hacia un entorno dividido en subredes; los *routers* dentro de ese entorno usan el prefijo de red para rutear entre las subredes individuales.

El **prefijo de red extendido** es el resultado de sumar el prefijo de red **por clase** (8, 16 o 24 bits, según A/B/C) más la cantidad de bits que se piden prestados al campo de host para crear las subredes. Es otra forma de nombrar la **máscara de subred**: los bits de la máscara y los de la dirección de Internet tienen una relación uno a uno, y juntos permiten determinar si una IP pertenece o no a una subred dada.

> [!example] Ejemplo de prefijo extendido
> Tenemos la dirección `193.1.1.0/24` y queremos divididirla en 8 subredes:
> $$
> \text{Prefijo extendido} = 24\text{ bits de red, clase C} + 3\text{ bits pedidos prestados} = 27 \Rightarrow \boxed{/27}
> $$
> La **máscara** es `/27` o `255.255.255.224`, el mismo concepto en dos notaciones distintas.

> [!example] Conversión de formato barra a punto decimal
> Para pasar de un formato al otro se toma el `/n` y se colocan `n bits 1`, agrupados en byes u octetos según el [[06 - Direcciones IPv4|formato punto decimal]]. De aquí que muchas mascaras posean 255.
> $$
> /8 \longrightarrow 1111 \: 1111 \longrightarrow 255 \longrightarrow 255.0.0.0
> $$
> $$
> /11 \longrightarrow 1111 \: 1111 \: 1110 \: 0000 \longrightarrow 255 \: 224 \longrightarrow 255.224.0.0
> $$
> Cualquier calculadora que convierta de binario a decimal sirve para conversiones rápidas.

> [!question]- ¿Cómo puedo con la máscara saber si un paquete es para mi red o no?
> Aplicando la operación lógica **AND bit a bit** entre la IP y la máscara, aplicada dos veces (a la propia IP y a la IP destino). Siempre se usa la máscara propia, nunca la del destino, si dan la misma red, están en el mismo segmento.
>- Si **coinciden** → el destino está en **mi misma subred** → lo puedo entregar **directo**
>- Si **no coinciden** → el destino está en **otra subred** → tengo que mandarlo a mi ***gateway***

## CIDR

**CIDR** (*Classless Inter-Domain Routing*) es el esquema de direccionamiento que reemplazó a las clases fijas (A, B, C) desde 1993. En vez de que la cantidad de bits de red esté determinada por la clase de la dirección, CIDR permite usar **prefijos de longitud variable** (`/n`, de `/1` a `/32`) para describir cualquier tamaño de red, sin importar en qué clase hubiera caído esa dirección originalmente.

> [!important] ¿Para qué sirve CIDR?
> Permite **agrupar (resumir)** varias redes contiguas en una sola entrada de la tabla de ruteo, lo que se conoce como *route aggregation* o *supernetting*. Por ejemplo, un ISP dueño de 8 redes `/24` consecutivas puede anunciarlas hacia el resto de Internet como una única red `/21`, en vez de 8 entradas separadas. Esto es justamente lo que evitó el colapso de las tablas de ruteo globales a medida que crecía Internet.

CIDR también es lo que permite asignar bloques de **cualquier tamaño** a una organización (no solo /8, /16 o /24 como con clases), ajustando la cantidad de direcciones a la necesidad real en vez de sobreasignar.

### CIDR vs. *Subnetting*

CIDR y *Subnetting* usan exactamente el mismo mecanismo, un prefijo de **longitud variable** en vez de una clase fija, pero aplicado en dos escalas distintas:

|                                     | **CIDR**                                                                                                                               | **Subnetting**                                                                                                                   |
| ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Dónde se aplica**                 | Hacia **afuera**: en el ruteo global de Internet, entre organizaciones/ISPs.                                                           | Hacia **adentro**: dentro de una sola organización, sobre el bloque que ya le fue asignado.                                      |
| **Qué resuelve**                    | Evita que las tablas de ruteo de Internet exploten de tamaño, agrupando varias redes chicas en una sola entrada (*route aggregation*). | Permite dividir el bloque propio en redes más chicas para organizar las LANs internas (una subred por sede, departamento, etc.). |
| **Dirección del cambio de prefijo** | **Agranda** el bloque lógicamente: varias redes `/24` se anuncian juntas como una sola `/21`.                                          | **Achica** el bloque: una red `/24` se parte en varias `/27`.                                                                    |
| **Quién lo usa**                    | ISPs, RIRs, routers troncales de Internet.                                                                                             | El administrador de red de una organización, puertas adentro.                                                                    |

> [!note] Relación entre ambos
> El *subnetting* es una **aplicación** de la idea de CIDR: ambos abandonan las clases fijas a favor de un prefijo `/n` configurable. La diferencia es solo la escala en la que se usa esa misma herramienta, CIDR mirando hacia el resto de Internet y *subnetting* mirando hacia adentro de la propia red.

## Diseño de subredes

El despliegue de un plan de direccionamiento requiere responder cuatro preguntas clave:

1. ¿Cuántas subredes totales necesita la organización **hoy**?
2. ¿Cuántas subredes totales necesitará la organización en el **futuro**?
3. ¿Cuántos hosts hay actualmente en la **subred más grande** de la organización?
4. ¿Cuántos hosts habrá en la subred más grande de la organización **en el futuro**?

> [!important] Dirección de subred y dirección de broadcast
> En cualquier subred, dos direcciones quedan siempre reservadas y nunca se asignan a un *host*:
> - **Dirección de subred**: todos los bits de *host* en **0**. Identifica a la subred como un todo (se usa en tablas de ruteo, configuración de *routers*), no a ningún dispositivo.
> - **Dirección de broadcast**: todos los bits de *host* en **1**. Sirve para mandar un paquete a **todos** los hosts de esa subred a la vez en una sola transmisión (ej. el `DHCPDISCOVER` de un cliente que todavía no tiene IP).
>
> Por eso de $2^n$ direcciones posibles siempre se restan 2 utilizables: las dos "puntas" del rango (todo ceros y todo unos) quedan reservadas.

> [!cite] RFC 950
> En ciertos contextos, es útil tener direcciones fijas con significado funcional, más que como identificadores de máquinas específicas. Cuando se reclame esta utilización, la dirección cero será interpretada con el significado de "éste", como en "ésta red". La dirección con todo unos será interpretada con el significado de "todos", como en "todos las máquinas"

### Ejemplo de diseño

Una organización tiene asignada la dirección `193.1.1.0/24`. Internamente necesita definir **6 subredes**, sin superar los **25 hosts por subred**.

1. **Determinar la máscara:** 
	- Con 2 bits obtenemos $2^2=4$ subredes que es insuficiente.
	- Con 3 bits obtenemos $2^3=8$ subredes que cumple los 6 requeridos con 2 de margen. 
	- Tomando 3 bits junto al `/24` original tenemos `/27` de máscara (`255.255.255.224`).
2. **Determinar la cantidad de *hosts*:** 
	- Teníamos originalmente $32-24=8$ bits disponibles para *host*. 
	- Tomando tres bits para subred quedan $8-3=5$ bits de *host*.
	- Con 5 bits tenemos $2^5=32$ direcciones posibles. 
	- Descontando las 2 reservadas (red y broadcast), quedan 30 *hosts* posibles por subred. Por lo que alcanza para los 25 requeridos, con 5 de margen.

Por lo que con 3 bits dedicados al subneteo tenemos 8 subredes con 30 *hosts* cada una:

| Subred    | Dirección binaria completa               | Dirección resultante |
| --------- | ---------------------------------------- | -------------------- |
| Red base  | 11000001.00000001.00000001.00000000      | 193.1.1.0/24         |
| Subred #0 | 11000001.00000001.00000001.**000** 00000 | 193.1.1.0/27         |
| Subred #1 | 11000001.00000001.00000001.**001** 00000 | 193.1.1.32/27        |
| Subred #2 | 11000001.00000001.00000001.**010** 00000 | 193.1.1.64/27        |
| Subred #3 | 11000001.00000001.00000001.**011** 00000 | 193.1.1.96/27        |
| Subred #4 | 11000001.00000001.00000001.**100** 00000 | 193.1.1.128/27       |
| Subred #5 | 11000001.00000001.00000001.**101** 00000 | 193.1.1.160/27       |
| Subred #6 | 11000001.00000001.00000001.**110** 00000 | 193.1.1.192/27       |
| Subred #7 | 11000001.00000001.00000001.**111** 00000 | 193.1.1.224/27       |

Por ejemplo para la subred número seis tendríamos los siguientes *host*:

| Host | Dirección binaria completa | Dirección resultante |
| --- | --- | --- |
| Subred #6 (base) | 11000001.00000001.00000001.**110**00000 | 193.1.1.192/27 |
| Host #1 | 11000001.00000001.00000001.**110**00001 | 193.1.1.193/27 |
| Host #2 | 11000001.00000001.00000001.**110**00010 | 193.1.1.194/27 |
| ... | ... | ... |
| Host #29 | 11000001.00000001.00000001.**110**11101 | 193.1.1.221/27 |
| Host #30 | 11000001.00000001.00000001.**110**11110 | 193.1.1.222/27 |

Tambien podemos definir la primer y última red así como la dirección de *broadcast*:

| Nro | Subred         | 1era IP     | Última IP   | Broadcast   |
| --- | -------------- | ----------- | ----------- | ----------- |
| 0   | 193.1.1.0/27   | 193.1.1.1   | 193.1.1.30  | 193.1.1.31  |
| 1   | 193.1.1.32/27  | 193.1.1.33  | 193.1.1.62  | 193.1.1.63  |
| 2   | 193.1.1.64/27  | 193.1.1.65  | 193.1.1.94  | 193.1.1.95  |
| 3   | 193.1.1.96/27  | 193.1.1.97  | 193.1.1.126 | 193.1.1.127 |
| 4   | 193.1.1.128/27 | 193.1.1.129 | 193.1.1.158 | 193.1.1.159 |
| 5   | 193.1.1.160/27 | 193.1.1.161 | 193.1.1.190 | 193.1.1.191 |
| 6   | 193.1.1.192/27 | 193.1.1.193 | 193.1.1.222 | 193.1.1.223 |
| 7   | 193.1.1.224/27 | 193.1.1.225 | 193.1.1.254 | 193.1.1.255 |

> [!note] Dato útil
> La dirección de broadcast de una subred es exactamente 1 bit menos que la dirección base de la subred siguiente.


---
**Volver a:** [[07 - ARP|ARP]]

**Continuar a:** [[09 - Localhost|Localhost]]
