---
title: Cabecera IPv6
fuente:
  - "[RFC 4291](https://datatracker.ietf.org/doc/html/rfc4291#section-2)"
  - "[Fundamentos de IPv6](https://cloud.fio.unam.edu.ar/index.php/s/kfroJFkzy5YNi59?dir=/&editing=false&openfile=true)"
  - "[RFC 8200](https://datatracker.ietf.org/doc/html/rfc8200)"
---
## Datagrama IPv6

![[cabecera_ipv6.png]]
### Campos del datagrama

#### Versión (4 bits) 

Número de la versión del protocolo Internet; el valor es 6.

#### Clase de tráfico o *Traffic Class* (8 bits)

Disponible para su uso por el nodo origen y/o los dispositivos de encaminamiento para identificar y distinguir entre clases o prioridades de paquete IPv6.

#### Etiqueta de flujo o *Flow Label* (20 bits)

Se puede utilizar por un dispositivo para etiquetar aquellos paquetes para los que requiere un tratamiento especial en los dispositivos de encaminamiento dentro de la red. Sería algo como identificar el flujo que requiera una QoS para darle prioridad. Ver más en [RFC 6437](https://datatracker.ietf.org/doc/html/rfc6437)

#### Longitud de la carga útil o *Payload Length* (16 bits)

Longitud del resto del paquete IPv6 excluida la cabecera, en octetos. En otras palabras, representa la longitud de todas las cabeceras de extensión **más** los datos de la capa de transporte.

> [!note]- *Jumbograms*
> Al tener 16 bits, el campo *Payload Length* solo puede representar hasta 65.535 bytes (64KB); ese es el tamaño máximo de carga útil de un paquete IPv6 "normal". Para casos que necesiten transportar más datos en un único paquete, el RFC 2675 define la opción ***Jumbo Payload***, que viaja dentro de la cabecera de extensión *Hop-by-Hop Options* y usa un campo propio de 32 bits para indicar la longitud real de la carga útil, permitiendo paquetes (llamados *jumbograms*) de hasta $2^{32}-1$ bytes, es decir, prácticamente 4GB. 
> 
> Cuando se usa esta opción, el campo *Payload Length* de la cabecera base debe ponerse en 0, ya que el tamaño real lo indica el campo de 32 bits de la opción; además, un *jumbogram* no puede coexistir con la cabecera de fragmentación (no tendría sentido fragmentar un paquete pensado justamente para evitar la fragmentación) y requiere que todos los enlaces y dispositivos en el camino soporten un MTU igual o mayor a esa longitud, por lo que en la práctica es un mecanismo poco usado fuera de entornos muy específicos.

#### Cabecera siguiente o *Next Header* (8 bits)

Identifica el tipo de cabecera que sigue inmediatamente a la cabecera IPv6; se puede tratar tanto de una cabecera de extensión IPv6 como de una cabecera de la capa superior, como TCP o UDP.

#### Límite de saltos o *Hop Limit* (8 bits)

Número restante de saltos permitidos para este paquete. Se establece por la fuente a algún valor máximo deseado y se decrementa en 1 en cada nodo que reenvía el paquete. El paquete se descarta si el límite de saltos se hace cero. 

El consenso fue que el esfuerzo extra de contabilizar los intervalos de tiempo no añadía un valor significativo a IPv4; de hecho, y como regla general, los dispositivos de encaminamiento en IPv4 tratan el campo tiempo de vida como un límite de saltos.

#### Dirección de origen y destino (128 bits c/u)

Son las direcciones del productor y destino del paquete. Puede que este no sea en realidad el último destino deseado si está presente la cabecera de encaminamiento.

> [!info] Observación
> Notar que **NO existe FCS ni CRC** (Suma de comprobación de cabecera).

> [!important] MTU mínimo y recomendado
> IPv6 requiere que cada enlace de Internet tenga un MTU de 1280 octetos o más. Esto se conoce como el **MTU mínimo** de enlace de IPv6. En cualquier enlace que no pueda transmitir un paquete de 1280 octetos de una sola pieza, se debe proporcionar fragmentación y reensamblaje específicos del enlace en una **capa inferior** a IPv6.
> 
> Los enlaces que tienen un MTU configurable (por ejemplo, los enlaces PPP) deben configurarse para que tengan un MTU de al menos 1280 octetos; se **recomienda** configurarlos con un **MTU de 1500** octetos o más, para dar cabida a posibles encapsulaciones (es decir, túneles) sin incurrir en fragmentación en la capa de IPv6.

### *Extension Headers*

> Las **cabeceras de extensión** no figuran en la imagen del datagrama.

En IPv6, la información **opcional** de la capa de Internet se codifica en encabezados separados que pueden colocarse entre el encabezado IPv6 y el encabezado de la capa superior en un paquete. Existe un número reducido de estos encabezados de extensión, cada uno de los cuales se identifica mediante un valor distinto de *Next Header*. Se utiliza un valor especial denominado *No Next Header* si no hay ningún encabezado de la capa superior.

Los encabezados de extensión (excepto el encabezado de opciones salto a salto) **no son procesados, insertados ni eliminados** por ningún nodo a lo largo de la ruta de entrega de un paquete, hasta que el paquete llega al nodo (o a cada uno de los nodos del conjunto, en el caso de la multidifusión) identificado en el campo de dirección de destino del encabezado IPv6.

En el nodo de destino, el demultiplexado normal en el campo *Next Header* activa un módulo para procesar la primera cabecera de extensión, o de capa superior si no hay.  El contenido y la semántica de cada extensión determina si se debe o no continuar con el siguiente encabezado. Por lo tanto, se **deben procesar en el orden en que aparecen** en el paquete.

> [!info]- Problema al reconocer una extensión
> Si, como resultado del procesamiento de una cabecera, el nodo de destino debe pasar a la siguiente cabecera, pero el valor de *Next Header* en la cabecera actual no es reconocido por el nodo, este debe descartar el paquete y enviar un mensaje ICMP de problema de parámetros a la fuente del paquete, con un valor de código ICMP de 1 (*Unrecognized Next Header*
   *type encountered*)

### *Next Headers*

A modo informativo, se mencionan los posibles valores de la cabecera siguiente (*Next Header*):

| Valor decimal | Extensión                                                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0             | **Hop-by-Hop options:** permite añadir valores adicionales a tener en cuenta por los enrutadores                                                                     |
| 60            | **Destinations Options for IPv6:** permite establecer opciones adicionales para el nodo destino                                                                      |
| 43            | **Routing Header for IPv6:** establece opciones adicionales sobre el enrutamiento a aplicar en el paquete IP                                                         |
| 44            | **Fragment Header for IPv6:** el paquete IPv6 no pudo ser fragmentado por los enrutadores intermedios, pero el dispositivo que genera el paquete lo puede fragmentar |
| 51            | **Authentication Header:** similar a la que propone IPSEC para IPv4, pero en IPv6 ya está incluida dentro del mismo protocolo                                        |
| 50            | **Encap Security Payload:** igual que la cabecera anterior, forma parte de IPSEC y en IPv6 está incluida dentro del protocolo                                        |
| 6             | TCP                                                                                                                                                                  |
| 17            | UDP                                                                                                                                                                  |
| 58            | ICMP for IPv6 (se resalta porque es algo que se verá más adelante)                                                                                                   |

> [!info]- Orden de *Nexts Headers*
> El RFC 8200 recomienda que cuando se utiliza más de una cabecera de extensión en el mismo paquete, que dichas cabeceras aparezcan en el siguiente orden:
>1. IPv6 header
>2. Hop-by-Hop Options header
>3. Destination Options header
>4. Routing header
>5. Fragment header
>6. Authentication header 
>7. Encapsulating Security Payload header
>8. Destination Options header
>9. Upper-Layer header

## Comparación con IPv4 

Si comparamos ambas cabeceras veremos algunos campos eliminados y otros renombrados:

![[cambios_ipv4.png]]

- Se eliminaron: Longitud de cabecera, Identificador, *Flags*, *Fragment offset*, FCS y Opciones.
- Se renombraron: Tipo de servicio, Tiempo de vida, Protocolo y Relleno

> [!warning] Header Checksum e ID
> Al eliminar el *Checksum* de la cabecera, el *router* puede decrementar el *Hop Limit* y reenviar el paquete **sin tener que realizar cálculos complejos**, lo que resulta en un encaminamiento más rápido y eficiente. Además como en IPv6 **no se fragmenta en el camino**, no es necesario tener un ID de datagrama, cada datagrama es único.

Resumiendo tenemos que: 

| IPv6                                   | IPv4                                   |
| -------------------------------------- | -------------------------------------- |
| *Header* mínimo de 40 bytes (320 bits) | *Header* mínimo de 20 bytes (160 bits) |
| Direcciones de 128 bits (4 x 32)       | Direcciones de 32 bits                 |
| Límite de Saltos                       | Tiempo de Vida                         |
| Clase de Tráfico                       | Tipo de Tráfico (se utiliza muy poco)  |
| Etiqueta de Flujo                      |                                        |
| Longitud de la Carga Útil              |                                        |
| Cabecera Siguiente                     |                                        |

## Cantidad de IPv6s por metro cuadrado

Dado que el espacio de direcciones IPv6 tiene tamaño $2^{128}$, y asumiendo (solo para el ejercicio) que las direcciones se reparten uniformemente sobre la superficie de la Tierra:

- Radio de la Tierra: $R = 6.371\ km = 6.371.000\ m$
- Diámetro: $D \approx 12.742\ km$
- Superficie esférica: $A = 4\pi R^2$

**Se pide:**
1. Calcular cuántas direcciones IPv6 "tocarían" por cada metro cuadrado de la superficie terrestre.
2. Un edificio tiene 10 pisos y una planta rectangular de 10 m × 20 m. ¿Cuántas direcciones le "tocarían" al edificio completo (sumando todos los pisos)?
3. ¿Cuántas direcciones le "tocarían" a cada uno de los 10 pisos?

> [!success]- Solución
> 
> **Paso 1: Superficie de la Tierra**
> $$
> A = 4\pi R^2 = 4\pi(6.371.000\ m)^2 \approx 5{,}1006\times10^{14}\ m^2
> $$
> 
> **Paso 2: Direcciones IPv6 totales**
> $$
> 2^{128} \approx 3{,}4028\times10^{38}
> $$
> 
> **Direcciones por metro cuadrado:**
> $$
> 2^{128} / A = 3{,}4028\times10^{38} / 5{,}1006\times10^{14} \approx 6{,}671\times10^{23} \text{ direcciones/m²}
> $$
> 
> **Edificio completo (10 pisos)**
>  Área total = 10 pisos × (10×20 m²) = 2000 m²
>  $$
> 6{,}671\times10^{23} \times 2000 \approx 1{,}334\times10^{27}
> $$
> 
> **Cada piso (200 m²)**
> $$
> 6{,}671\times10^{23} \times 200 \approx 1{,}334\times10^{26}
> $$
> 
> **Concluyendo:**
> - Por m² de Tierra: ≈ $6{,}671\times10^{23}$
> - Edificio completo (2000 m²): ≈ $1{,}334\times10^{27}$
> - Cada piso (200 m²): ≈ $1{,}334\times10^{26}$

---
**Volver a:** [[01 - Introduccion a IPv6|Introducción a IPv6]]

**Continuar a:** [[03 - Direcciones IPv6|Direcciones IPv6]]
