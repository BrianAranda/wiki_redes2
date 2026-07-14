---
title: Encapsulación
---
La **Encapsulación** (y su contraparte, la desencapsulación) es propia del sistema de capas y paquetes. Algo ya fue introducido en [[01 - Redes I|Redes I]] dado el **principio de capas**.

> [!important] Definición de encapsulación
> A medida que los datos bajan en el modelo de capas, se van **encapsulando**. Cuando llegan al destino y suben por las capas, se van **desencapsulando**.

![[encapsulamiento.png]]

Para controlar una transmisión se debe transmitir **información de control** junto con los datos de usuario. Supongamos que el proceso emisor genera un bloque de datos y lo pasa a TCP:

> TCP puede que divida este bloque en fragmentos más pequeños para hacerlos más manejables. A cada uno de estos fragmentos le añade información de control, denominada cabecera TCP, formando un **segmento TCP**. La información de control la utilizará la entidad par TCP en B. Entre otros, en la cabecera se incluyen campos como puerto de destino, número de secuencia o suma de comprobación.

A continuación, TCP pasa cada segmento a IP con instrucciones para que los transmita a B.

> Estos segmentos se transmitirán a través de una o varias subredes y serán retransmitidos en uno o más dispositivos de encaminamiento intermedios. Esta operación también requiere el uso de información de control. Así, IP añade una cabecera de información de control a cada segmento para formar lo que se denomina un **datagrama IP**. En la cabecera IP, además de otros campos, se incluirá la dirección del destino B.

Finalmente, cada datagrama IP se pasa a la capa de acceso a la red para que se envíe a través de la primera subred. 

> La capa de acceso a la red añade su propia cabecera, creando un **paquete**, o **trama**. El paquete se transmite a través de la subred al dispositivo de encaminamiento J. La cabecera del paquete contiene la información que la subred necesita para transferir los datos. La cabecera puede contener, entre otros, la dirección de la subred destino y las funciones solicitadas (ej prioridad)

Cuando se reciben los datos en B, ocurre el proceso inverso. En cada capa se elimina la cabecera correspondiente y el resto se pasa a la capa inmediatamente superior, hasta que los datos de usuario originales alcancen al proceso destino.

El nombre genérico del bloque de datos intercambiado en cualquier nivel se denomina **unidad de datos del protocolo** (PDU, *Protocol Data Unit*). Consecuentemente, el segmento TCP es la PDU del protocolo TCP.

| Capa            | PDU             | Contenido                                            |
| --------------- | --------------- | ---------------------------------------------------- |
| Aplicación      | Bloque de datos | Datos                                                |
| Transporte      | Segmento TCP    | Cabecera TCP + Datos                                 |
| Red             | Datagrama IP    | Cabecera IP + Cabecera TCP + Datos                   |
| Interfaz de red | Trama o paquete | Cabecera de red + Cabecera IP + Cabecera TCP + Datos |

---
**Volver a:** [[02 - Puntos de Acceso a Servicios|Puntos de Acceso a Servicios]]

**Continuar a:** [[04 - Suite de Protocolos TCP-IP|Suite de Protocolos TCP-IP]]
