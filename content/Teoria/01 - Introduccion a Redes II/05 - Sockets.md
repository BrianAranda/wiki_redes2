---
title: Sockets
---
El concepto de **socket** (enchufe) y la programación de sockets se desarrolló en la década de 1980 en el entorno UNIX, como la interfaz de sockets de Berkeley.

Un socket permite comunicación entre un proceso cliente y uno servidor, y puede ser una conexión **orientada a conexión o sin conexión** (Puerto ⇒ Capa 4). Se lo considera un **punto final** de la comunicación, que define un vínculo **unívoco**.

> [!important] 5 elementos componen un Socket
> 1. IP Origen
> 2. Puerto Origen
> 3. IP Destino
> 4. Puerto Destino
> 5. Protocolo (UDP o TCP)

Un socket cliente usa una dirección para llamar, buscar y conectarse a un socket servidor en otra computadora. Una vez conectados los "enchufes apropiados", ambas computadoras pueden intercambiar datos por un canal punto a punto.

> [!tip] Cliente vs. servidor
> Las computadoras con sockets de **servidor** mantienen abierto un puerto TCP o UDP, listo para llamadas entrantes no programadas. El **cliente** normalmente determina el socket (elige puerto origen y se conecta a IP:puerto del servidor).

En cualquier instante de tiempo, sólo puede haber **una única conexión** TCP entre un **único par de puertos**. Sin embargo, un puerto dado puede admitir múltiples conexiones, cada una con un puerto diferente.

---
**Volver a:** [[04 - Suite de Protocolos TCP-IP|Suite de Protocolos TCP-IP]]

**Continuar a:** [[Teoria/01 - Introduccion a Redes II/index#Preguntas de repaso|Preguntas de repaso]]

