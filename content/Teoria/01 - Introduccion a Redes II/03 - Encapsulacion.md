---
title: Encapsulación
---
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

---
⬅ **Volver a:** [[02 - Puntos de Acceso a Servicios|Puntos de Acceso a Servicios]]
➡ **Continuar a:** [[04 - Suite de Protocolos TCP-IP|Suite de Protocolos TCP-IP]]
