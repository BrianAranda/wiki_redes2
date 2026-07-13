---
title: Introducción a Redes II
fuente: "[[1. Introducción a Redes II.pdf]]"
---
# Índice
- [[#1. Redes I]]
- [[#2. Puntos de Acceso a Servicios]]
- [[#3. Encapsulación]]
- [[#4. Suite de Protocolos TCP/IP]]
- [[#5. Sockets]]
- [[#Preguntas de repaso (final teórico)]]

## 1. Redes I

En **Redes I** (la materia del cuatrimestre pasado) se trabajaron las dos primeras capas del modelo de capas de Redes:
1. **Física**
2. **Enlace de Datos**

Recordando los modelos y sus capas:

| **Modelo** | **TCP/IP**                                                             | **OSI**                                                                                                         |
| ---------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Niveles    | 5. Aplicación<br>4. Transporte<br>3. Red<br>**2. Enlace<br>1. Físico** | 7. Aplicación<br>6. Presentación<br>5. Sesión<br>4. Transporte<br>3. Red<br>**2. Enlace de datos<br>1. Físico** |

Ambos modelos, **Modelo OSI** y **Modelo TCP/IP**, tienen esas dos primeras capas con las mismas funciones, se puede decir que son "casi iguales".

> [!question] Pregunta de la cátedra
> ¿Por qué decimos que las capas Física y de Enlace de Datos son "casi iguales" entre OSI y TCP/IP, y no exactamente iguales?
> Ayuda dada por la cátedra: pensar en las **tramas**.

En **Redes II** nos concentramos en lo que resta de la suite de protocolos TCP/IP: las capas de **Red**, **Transporte** y **Aplicación**.

$$
\begin{equation*}
	\text{TCP/IP} \quad
	\left\{ \quad
	\begin{aligned}
		& \left.
			\begin{aligned}
				& \text{5. Aplicación} \\
				& \text{4. Transporte} \\
				& \text{3. Red} \\
			\end{aligned} \quad 
		\right\} \quad \text{Redes II} \\
		& \left.
			\begin{aligned}
				& \text{2. Enlace}  \\
				& \text{1. Físico}
			\end{aligned} \quad 
		\right\} \quad \text{Redes I} \\
	\end{aligned}
	\right.
\end{equation*}
$$ 

> [!important] Principio de capas
> Cada capa **brinda servicio** a las capas superiores y **obtiene servicio** de las capas inferiores. Todas las capas están soportadas por las capas precedentes.

TCP/IP define cuidadosamente cómo se mueve la información desde el remitente hasta el destinatario:

| Capa            | Protocolo(s)                                    |
| --------------- | ----------------------------------------------- |
| Aplicación      | Protocolo de aplicación (HTTP, FTP, SMTP, etc.) |
| Transporte      | UDP / TCP                                       |
| Red             | Protocolo Internet (IP)                         |
| Interfaz de red | Interfaz de red                                 |
| Hardware        | Red física                                      |

### **El envió de datos**

En primer lugar, los programas de **aplicación** envían mensajes o flujos de datos a uno de los protocolos de la capa de **transporte** de Internet: UDP o TCP. 

Estos protocolos reciben los datos de la aplicación, los dividen en piezas más pequeñas llamadas paquetes, añaden una dirección de destino y, a continuación, pasan los paquetes a la siguiente capa de protocolo, la capa de **red de Internet**.

La capa de red de Internet encierra el paquete en un datagrama de Internet Protocol (IP), coloca la cabecera y la cola del datagrama, decide dónde enviar el datagrama y lo pasa a la capa de **interfaz de red**.

La capa de interfaz de red acepta datagramas IP y los transmite como tramas a través de un **hardware** de red específico, como por ejemplo redes Ethernet o Red en anillo.

![[capas_envio.png]]
### **La recepción de datos**

La capa de **interfaz de red** recibe las tramas, le quita la cabecera Ethernet y envía el datagrama hacia arriba hasta la capa de red. En la capa de **red**, Protocolo Internet quita la cabecera IP y envía el paquete hacia arriba hasta la capa de transporte. En la capa de **transporte**, el controlador de transporte ( TCP, en este caso) elimina el encabezado y envía los datos a la capa de **aplicación**.

![[capas_recepcion.png]]
### **Transmisión completa**

Los sistemas principales de una red envían y reciben información **simultáneamente**

En conclusión:
* A medida que se **desciende** en cada capa se van **agregando** las cabeceras de cada una.
* A medida que se **asciende** en cada capa, se van **sacando** las cabeceras de cada una.

![[capas_transmision.png]]
## 2. Puntos de Acceso a Servicios

El concepto de **SAP** *(Service Access Point)* es el punto de acceso al servicio de una capa. Se implementa también en el Estándar OSI y permite **independencia entre capas**. En TCP/IP tiene un propósito parecido: la independencia se plantea entre los accesos a los servicios que tienen las aplicaciones **a través de la capa 4 (TCP)**.

Considerando un modelo simple de tres capas: aplicación, transporte y acceso a la red. Para una comunicación con éxito, cada entidad deberá tener una dirección única. En realidad, se necesitan dos niveles de direccionamiento. 

Cada computador en la red debe tener una dirección de red. Esto permite a la red proporcionar los datos al computador apropiado. A su vez, cada aplicación en el computador debe tener una dirección que sea única dentro del propio computador; esto permitirá a la capa de transporte proporcionar los datos a la aplicación apropiada. 

Estas últimas direcciones son denominadas puntos de acceso al servicio (SAP, Service Access Point), o también puertos, evidenciando que cada aplicación accede individualmente a los servicios proporcionados por la capa de transporte.

![[sap_trescapas.png]]

### Ejemplo de comunicación

Los puntos de acceso son como **"agujeros"** por los que se logra un **conducto** (virtual, no físico) entre los extremos, un camino punto a punto para los datos.

Supóngase que una aplicación, asociada al SAP 1 en el computador A quiere transmitir un mensaje a otra aplicación, asociada al SAP 2 del computador B. La aplicación en A pasa el mensaje a la capa de transporte con instrucciones para que lo envíe al SAP 2 de B. A su vez, la capa de transporte pasa el mensaje a la capa de acceso a la red, la cual proporciona las instrucciones necesarias a la red para que envíe el mensaje a B. Debe observarse que la red no necesita conocer la dirección del punto de acceso al servicio en el destino. Todo lo que necesita conocer es que los datos están dirigidos al computador B.


![[sap-flujo-datos-secuencia.png]]

Otra forma de verlo es pasando por un **Router** (capa 3):

![[sap-tcpip-concepts-router.png]]

### Normalización entre capas del modelo OSI

La principal motivación para el desarrollo del modelo OSI fue proporcionar un modelo de referencia para la normalización. Dentro del modelo, en cada capa se pueden desarrollar uno o más protocolos. El modelo define en términos generales las funciones que se deben realizar en cada capa y simplifica el procedimiento de la normalización.

La función global de comunicación se descompone en 7 capas distintas, haciendo que las interfaces entre módulos sean tan simples como sea posible. Además, se utiliza el **principio de ocultación de la información**: las capas inferiores abordan ciertos detalles de tal manera que las capas superiores sean ajenas a las particularidades de estos detalles. Dentro de cada capa, se suministra el servicio proporcionado a la capa inmediatamente superior, a la vez que se implementa el protocolo con la capa par en el sistema remoto.

![[capas_osi.png]]

Existen tres elementos clave:

1. **Especificación del protocolo:** dos entidades en la misma capa en sistemas diferentes cooperan e interactúan por medio del protocolo. El protocolo se debe especificar con precisión, ya que están implicados dos sistemas abiertos diferentes. Esto incluye el formato de la unidad de datos del protocolo, la semántica de todos los campos, así como la secuencia permitida de PDU.
2. **Definición del servicio:** además del protocolo o protocolos que operan en una capa dada, se necesitan normalizaciones para los servicios que cada capa ofrece a la capa inmediatamente superior. Normalmente, la definición de los servicios es equivalente a una descripción funcional que definiera los servicios proporcionados, pero sin especificar cómo se están proporcionando.
3. **Direccionamiento:** cada capa suministra servicios a las entidades de la capa inmediatamente superior. Las entidades se identifican mediante un punto de acceso al servicio (SAP). Así, un punto de acceso al servicio de red (NSAP, Network SAP) identifica a una entidad de transporte usuaria del servicio de red.

![[capas_clave.png]]

## 3. Encapsulación

La **[[Encapsulación]]** (y su contraparte, la desencapsulación) es propia del sistema de capas y paquetes.

> [!important] Definición clave
> A medida que los datos bajan en el modelo de capas, se van **encapsulando**. Cuando llegan al destino y suben por las capas, se van **desencapsulando**.

![[encapsulacion-pdu-tcpip.png]]

| PDU                     | Capa            | Contenido                                                |
| ----------------------- | --------------- | -------------------------------------------------------- |
| Application byte stream | Aplicación      | User data                                                |
| TCP segment             | Transporte      | Cabecera TCP + User data                                 |
| IP datagram             | Red             | Cabecera IP + Cabecera TCP + User data                   |
| Network-level packet    | Interfaz de red | Cabecera de red + Cabecera IP + Cabecera TCP + User data |

## 4. Suite de Protocolos TCP/IP

![[suite-protocolos-tcpip.png]]

> [!info]- Glosario de protocolos (siglas)
> - **[[BGP]]** = Border Gateway Protocol
> - **[[FTP]]** = File Transfer Protocol
> - **[[HTTP]]** = Hypertext Transfer Protocol
> - **[[ICMP]]** = Internet Control Message Protocol
> - **[[IGMP]]** = Internet Group Management Protocol
> - **[[IP]]** = Internet Protocol
> - **[[MIME]]** = Multipurpose Internet Mail Extension
> - **[[OSPF]]** = Open Shortest Path First
> - **[[RSVP]]** = Resource ReSerVation Protocol
> - **[[SMTP]]** = Simple Mail Transfer Protocol
> - **[[SNMP]]** = Simple Network Management Protocol
> - **[[SSH]]** = Secure Shell
> - **[[TCP]]** = Transmission Control Protocol
> - **[[UDP]]** = User Datagram Protocol

No se pretende profundidad en todos estos protocolos, pero sí conocer la **utilidad y propósito** de cada uno.

## 5. Sockets

El concepto de **[[Sockets|socket]]** (enchufe) y la programación de sockets se desarrolló en la década de 1980 en el entorno UNIX, como la interfaz de sockets de Berkeley.

Un socket permite comunicación entre un proceso cliente y uno servidor, y puede ser una conexión **orientada a conexión o sin conexión** (Puerto ⇒ Capa 4). Se lo considera un **punto final** de la comunicación, que define un vínculo unívoco.

> [!important] 5 elementos componen un Socket
> 1. IP Origen
> 2. Puerto Origen
> 3. IP Destino
> 4. Puerto Destino
> 5. Protocolo (UDP o TCP)

Un socket cliente usa una dirección para llamar, buscar y conectarse a un socket servidor en otra computadora. Una vez conectados los "enchufes apropiados", ambas computadoras pueden intercambiar datos por un canal punto a punto.

> [!tip] Cliente vs. servidor
> Las computadoras con sockets de **servidor** mantienen abierto un puerto TCP o UDP, listo para llamadas entrantes no programadas. El **cliente** normalmente determina el socket (elige puerto origen y se conecta a IP:puerto del servidor).

![[sockets-conexion-logica-router.png]]

## Preguntas de repaso (final teórico)
1. ¿Por qué decimos que las capas Física y de Enlace de Datos son "casi iguales" entre el modelo OSI y el modelo TCP/IP, pero no exactamente iguales?
2. Explicá el concepto de Punto de Acceso a Servicio (SAP) y qué independencia permite entre capas.
3. ¿Cómo se relaciona el concepto de SAP con los puertos de la capa de Transporte en TCP/IP?
4. Describí el proceso de encapsulación y desencapsulación a medida que los datos atraviesan el modelo de capas TCP/IP.
5. Nombrá y explicá los distintos PDU (Protocol Data Unit) según la capa: byte stream, segmento, datagrama, paquete.
6. ¿Qué protocolos componen la Suite TCP/IP en las capas de Aplicación, Transporte y Red? Dar al menos un ejemplo de cada capa.
7. Definí qué es un socket y cuáles son los 5 elementos que lo componen.
8. ¿Qué diferencia hay entre el rol de un socket cliente y un socket servidor al establecer una conexión?
