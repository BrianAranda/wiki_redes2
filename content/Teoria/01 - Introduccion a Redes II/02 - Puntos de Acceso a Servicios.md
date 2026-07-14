---
title: Puntos de Acceso a Servicios
---
El concepto de **SAP** *(Service Access Point)* es el punto de acceso al servicio de una capa. Se implementa en el Estándar OSI y permite **independencia entre capas**. En TCP/IP tiene un propósito parecido: la independencia se plantea entre los accesos a los servicios que tienen las aplicaciones **a través de la capa 4 (TCP)**.

Considerando un modelo simple de tres capas: aplicación, transporte y acceso a la red. Para una comunicación con éxito, cada entidad deberá tener una dirección única. En realidad, se necesitan dos niveles de direccionamiento. 

Cada computador en la red debe tener una **dirección de red**. Esto permite a la red proporcionar los datos al computador apropiado. A su vez, cada aplicación en el computador debe tener una dirección que sea única dentro del propio computador; esto permitirá a la capa de transporte proporcionar los datos a la aplicación apropiada. 

Estas últimas direcciones son denominadas **puntos de acceso al servicio** (SAP, Service Access Point), o también **puertos**, evidenciando que cada aplicación accede individualmente a los servicios proporcionados por la capa de transporte.

![[sap_trescapas.png]]

## Ejemplo de comunicación

Los puntos de acceso son como **"agujeros"** por los que se logra un **conducto** (virtual, no físico) entre los extremos, un camino punto a punto para los datos.

### Modelo de tres capas

Supóngase que una aplicación, asociada al SAP 1 en el computador A quiere transmitir un mensaje a otra aplicación, asociada al SAP 2 del computador B. La aplicación en A pasa el mensaje a la capa de transporte con instrucciones para que lo envíe al SAP 2 de B. A su vez, la capa de transporte pasa el mensaje a la capa de acceso a la red, la cual proporciona las instrucciones necesarias a la red para que envíe el mensaje a B. Debe observarse que la red no necesita conocer la dirección del punto de acceso al servicio en el destino. Todo lo que necesita conocer es que los datos están dirigidos al computador B.


![[sap-flujo-datos-secuencia.png]]

### Modelo TCP/IP

Otra forma de verlo es pasando por un **Router** (capa 3). Supóngase que un proceso de la aplicación X, asociado al puerto 1 en la estación A, desea enviar un mensaje a otro proceso X, asociado al puerto 1 de la estación B.
- La aplicación X en A pasa el mensaje a TCP con la instrucción de enviarlo al puerto 1 SAP de B. 
- TCP pasa el mensaje a IP con la instrucción de enviarlo de la estación B. Obsérvese que no es necesario comunicarle a IP la identidad del puerto destino. Todo lo que necesita saber es que los datos van dirigidos al computador B. 
- A continuación, IP pasa el mensaje a la capa de acceso a la red (por ejemplo, a la lógica de Ethernet) con el mandato expreso de enviarlo al dispositivo de encaminamiento J (el primer salto en el camino hacia B).

![[sap_tcpip.png]]

## Normalización entre capas del modelo OSI

La principal motivación para el desarrollo del modelo OSI fue proporcionar un modelo de referencia para la normalización. Dentro del modelo, en cada capa se pueden desarrollar uno o más protocolos. El modelo define en términos generales las funciones que se deben realizar en cada capa y simplifica el procedimiento de la normalización.

La función global de comunicación se descompone en 7 capas distintas, haciendo que las interfaces entre módulos sean tan simples como sea posible. Además, se utiliza el **principio de ocultación de la información**: las capas inferiores abordan ciertos detalles de tal manera que las capas superiores sean ajenas a las particularidades de estos detalles. Dentro de cada capa, se suministra el servicio proporcionado a la capa inmediatamente superior, a la vez que se implementa el protocolo con la capa par en el sistema remoto.

![[capas_osi.png]]

Existen tres elementos clave:

1. **Especificación del protocolo:** dos entidades en la misma capa en sistemas diferentes cooperan e interactúan por medio del protocolo. El protocolo se debe especificar con precisión, ya que están implicados dos sistemas abiertos diferentes. Esto incluye el formato de la unidad de datos del protocolo, la semántica de todos los campos, así como la secuencia permitida de PDU.

2. **Definición del servicio:** además del protocolo o protocolos que operan en una capa dada, se necesitan normalizaciones para los servicios que cada capa ofrece a la capa inmediatamente superior. Normalmente, la definición de los servicios es equivalente a una descripción funcional que definiera los servicios proporcionados, pero sin especificar cómo se están proporcionando.

3. **Direccionamiento:** cada capa suministra servicios a las entidades de la capa inmediatamente superior. Las entidades se identifican mediante un punto de acceso al servicio (SAP). Así, un punto de acceso al servicio de red (NSAP, Network SAP) identifica a una entidad de transporte usuaria del servicio de red.

![[capas_clave.png]]

---
**Volver a:** [[01 - Redes I|Redes I]]

**Continuar a:** [[03 - Encapsulacion|Encapsulación]]
