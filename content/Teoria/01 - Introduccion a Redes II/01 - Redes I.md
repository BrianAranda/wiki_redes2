---
title: Redes I
fuente:
  - https://www.ibm.com/docs/es/aix/7.3.0?topic=protocol-tcpip-protocols
---
En **Redes I** se trabajaron las dos primeras capas del modelo de capas de Redes:
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
# Capas y transmisión de datos

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

## **El envió de datos**

En primer lugar, los programas de **aplicación** envían mensajes o flujos de datos a uno de los protocolos de la capa de **transporte** de Internet: UDP o TCP. Estos protocolos dividen los datos en piezas más pequeñas llamadas paquetes, añaden una dirección de destino y, a continuación, pasan los paquetes a la siguiente capa de protocolo, la capa de **red de Internet**. Esta capa encierra el paquete en un datagrama de *Internet Protocol* (IP), coloca la cabecera y la cola del datagrama, decide dónde enviar el datagrama y lo pasa a la capa de **interfaz de red**. Finalmente se transmite el datagrama como tramas a través de un **hardware** de red específico, como por ejemplo redes Ethernet o Red en anillo.
![[capas_envio.png]]
## **La recepción de datos**

La capa de **interfaz de red** recibe las tramas, le quita la cabecera Ethernet y envía el datagrama hacia arriba hasta la capa de red. En la capa de **red**, Protocolo Internet quita la cabecera IP y envía el paquete hacia arriba hasta la capa de transporte. En la capa de **transporte**, el controlador de transporte ( TCP, en este caso) elimina el encabezado y envía los datos a la capa de **aplicación**.

![[capas_recepcion.png]]
## **Transmisión completa**

Los sistemas principales de una red envían y reciben información **simultáneamente**

En conclusión:
* A medida que se **desciende** en cada capa se van **agregando** las cabeceras de cada una.
* A medida que se **asciende** en cada capa, se van **sacando** las cabeceras de cada una.

![[capas_transmision.png]]

---
**Continuar a:** [[02 - Puntos de Acceso a Servicios|Puntos de Acceso a Servicios]]
