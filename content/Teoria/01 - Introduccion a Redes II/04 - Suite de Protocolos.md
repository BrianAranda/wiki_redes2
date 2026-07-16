---
title: Suite de Protocolos
---
Se han normalizado una serie de aplicaciones para funcionar por encima de TCP. A continuación se mencionan tres de las más importantes:

- El **protocolo simple de transferencia de correo** (SMTP, *Simple Mail Transfer Protocol*) que proporciona una función básica de correo electrónico.
- El **protocolo de transferencia de archivos** (FTP, *File Transfer Protocol*) que se utiliza para enviar archivos de un sistema a otro bajo el control del usuario.
- **TELNET** que facilita la realización de conexiones remotas, mediante las cuales el usuario se conecta a una computadora remota y trabaja como si estuviera conectado directamente.

La arquitectura de TCP/IP **no exige que se haga uso de todas las capas**, es posible desarrollar aplicaciones que invoquen directamente los servicios de cualquier capa. La mayoría de las que requieran un protocolo extremo a extremo fiable utilizan TCP. Otras aplicaciones de propósito específico no necesitan de los servicios del TCP, por ejemplo, el protocolo simple de gestión de red (SNMP), utilizan un protocolo alternativo denominado protocolo de datagrama de usuario (UDP). Incluso es posible usar el protocolo IP directamente, aplicaciones que no necesiten interconexión de redes y que no necesiten TCP pueden invocar directamente los servicios de la capa de acceso a la red.

![[protocolos_tcpip.png]]

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
## Vista de Pila de protocolos TCP/IP

> Nota: la imagen siguiente se encuentra originalmente en la Introducción al protocolo IP. Pero sin contexto o conexión con lo tratado antes y despues. Me parecio mas adecuado agregarla acá como un vistazo de lo que se verá luego.

![[pila_protocolos.png]]

---
**Volver a:** [[03 - Encapsulacion|Encapsulación]]

**Continuar a:** [[05 - Sockets|Sockets]]
