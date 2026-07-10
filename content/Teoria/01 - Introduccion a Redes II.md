---
title: Introducción a Redes II
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

| **Modelo** | Niveles                                                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------------------- |
| **TCP/IP** | 5. Aplicación<br>4. Transporte<br>3. Red<br>**2. Enlace<br>1. Físico**                                          |
| **OSI**    | 7. Aplicación<br>6. Presentación<br>5. Sesión<br>4. Transporte<br>3. Red<br>**2. Enlace de datos<br>1. Físico** |

Ambos modelos, **[[Modelo OSI]]** y **[[Modelo TCP/IP]]**, tienen esas dos primeras capas con las mismas funciones, se puede decir que son "casi iguales".

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

| Capa            | Protocolo(s)                                    |
| --------------- | ----------------------------------------------- |
| Aplicación      | Protocolo de aplicación (HTTP, FTP, SMTP, etc.) |
| Transporte      | UDP / TCP                                       |
| Red             | Protocolo Internet (IP)                         |
| Interfaz de red | Interfaz de red                                 |
| Hardware        | Red física                                      |
A modo ilustrativo tenemos la figura siguiente:
* A medida que se **desciende** en cada capa se van **agregando** las cabeceras de cada una.
* A medida que se **asciende** en cada capa, se van **sacando** las cabeceras de cada una.
 
![[04-encapsulacion-dos-hosts-ibm.png]]

## 2. Puntos de Acceso a Servicios

El concepto de **[[SAP - Punto de Acceso a Servicio|SAP]]** (Service Access Point) es el punto de acceso al servicio de una capa. Se implementa también en el Estándar OSI y permite **independencia entre capas**.

En TCP/IP tiene un propósito parecido: la independencia se plantea entre los accesos a los servicios que tienen las aplicaciones **a través de la capa 4 (TCP)**.

![[sap-arquitectura-protocolos-redes.png]]

Los puntos de acceso son como **"agujeros"** por los que se logra un **conducto** (virtual, no físico) entre los extremos — un camino punto a punto para los datos.

![[sap-flujo-datos-secuencia.png]]

Otra forma de verlo es pasando por un **Router** (capa 3):

![[sap-tcpip-concepts-router.png]]

![[protocol-architecture-framework.png]]

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
