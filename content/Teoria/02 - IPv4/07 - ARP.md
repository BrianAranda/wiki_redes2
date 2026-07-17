---
title: ARP
---
El **ARP** **(*Address Resolution Protocol*)** o **Protocolo de Resolución de Direcciones** construye una tabla de dos columnas que vincula direcciones IP (Capa 3) con direcciones físicas MAC (Capa 1/2). Relaciona direcciones físicas con lógicas, sirve para resolver direcciones IPv4 a MAC.

> [!tip] Analogía de la carta
> Para enviar una carta a una persona (equivalente a la IP, capa 3), el cartero necesita saber dónde entregarla físicamente, su dirección (equivalente a la MAC, capa 2).

Si un host de origen X con IPx quiere contactar a un host de destino Y con IPy, conoce la dirección de capa 3, pero para transmitir debe bajar a capa 2 y capa 1. Puesto que **en capa 2 no hay dirección IP**, solo dirección MAC, que no conoce de antemano.

ARP es el protocolo que **establece la asociación entre IPs y MACs** de los equipos, guardándola en una **tabla de caché ARP**. Es una caché porque debe **renovarse**, si fuera eterna, y un equipo cambiara de placa de red (y por lo tanto de MAC), la tabla quedaría desactualizada.

## Funcionamiento de ARP

1. El protocolo envía un mensaje de **broadcast** a la red, preguntando por la MAC del host con IPy.
2. **Todos** los equipos de la red leen ese paquete, pero **solo responde** el host IPy, con su MAC.
3. El host origen completa su tabla ARP con esa **asociación**.

> [!iinfo] Ver ARP en la terminal
> En una terminal, la tabla ARP se consulta con el comando: arp -a.

> [!example] Ejemplo de ARP
> El equipo con IP 197.15.22.33 quiere llegar a 197.15.22.126 pero no conoce su dirección física. Hace un broadcast enviando un **ARP *Request***, y el equipo 197.15.22.126 responde con su MAC. Así, 197.15.22.33 completa la tabla con la asociación IP/MAC del destino, y a partir de ahí pueden comunicarse por capa 3.

> [!question]- ¿Por qué la tabla ARP no puede ser eterna?
> La tabla de caché ARP es **dinámica**, ya que tanto la IP como también la MAC (si cambia el dispositivo de red) de los dispositivos puede cambiar con el tiempo.
## ¿Cuándo se utiliza ARP?

ARP se utiliza en cuatro casos referentes a la comunicación entre dos hosts:

1. Cuando dos *hosts* están en la misma red y uno quiere enviar un paquete a otro.
2. Cuando dos *hosts* están sobre redes diferentes y deben usar un *gateway* o *router* para alcanzar otro *host*.
3. Cuando un *router* necesita enviar un paquete a un *host* a través de otro *router*.
4. Cuando un *router* necesita enviar un paquete a un *host* de la misma red.

![[casos_arp.png|600]]
## Ataques ARP

> [!warning] ARP *Spoofing* (suplantación de identidad)
> Consiste en enviar mensajes ARP falsos, asociando la MAC de un atacante con una IP ajena. De esta forma el atacante puede recopilar información que se envía a esa dirección IP y controlar el tráfico. Se puede prevenir con **tablas ARP estáticas** (evita la caché dinámica, aunque no siempre es viable). Herramientas típicas: Arpoison, Netcut, Ettercap.

Ataques relacionados:
- ***Man in the Middle* / ARP *Poisoning*:** el atacante intercepta todo lo que se envía (contraseñas, datos), ubicándose literalmente en el medio de la comunicación.
- **Secuestro de sesión:** similar al *Man-in-the-Middle*, pero el atacante captura un número de secuencia TCP genuino o una cookie web de la víctima para asumir su identidad, en vez de reenviar el tráfico. Se inicia en capa 2, pero se explota en capa 4.
- **DoS (*Denial of Service*):** el atacante envía una gran cantidad de solicitudes para que los sistemas no puedan responder con normalidad, explotando alguna vulnerabilidad del protocolo. Puede escalar a **DDoS**.

> [!note] No confundir
> El ataque de saturación de la tabla de un switch (que asocia puertos del switch a direcciones MAC) **no tiene nada que ver con ARP**.

## Comandos para ARP

En Linux, el comando `arp` manipula o muestra la caché ARP del kernel (`/proc/net/arp`):

| Uso                                                | Comando                                                                   |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| Ver la tabla ARP completa                          | `arp` / `arp -a` (formato BSD) / `arp -e` (formato Linux, columnas fijas) |
| Ver solo numérico (sin resolver nombres)           | `arp -n`                                                                  |
| Borrar una entrada                                 | `arp -d <IP>` (requiere privilegios de root)                              |
| Agregar una entrada estática                       | `arp -s <IP> <MAC>`                                                       |
| Agregar entrada proxy ARP para una interfaz propia | `arp -Ds <IP> <interfaz> pub`                                             |

> [!info]- Detalle completo del manual
> `arp` es parte del paquete `net-tools`. Ver manual completo con `man arp` (incluye opciones como `-i` para elegir interfaz, `-H` para el tipo de hardware, `-f` para cargar entradas desde un archivo, típicamente `/etc/ethers`).

> [!note] ARP en Windows
> Los comandos son practicamente idénticos. Consultar mediante `arp -help`
## Proxy ARP

En **Proxy ARP**, un router tiene la capacidad de responder a solicitudes ARP en nombre de otros hosts (retransmite). Así es posible establecer comunicación entre dos hosts de subredes diferentes sin modificar los ajustes de red de los dispositivos.

> [!question] Pregunta de la cátedra
> Las solicitudes ARP no tienen sentido que pasen de una subred a otra. ¿Puede el alumno justificar esta afirmación?

> [!example] Ejemplo de Proxy ARP
> Un *router* sirve dos LANs distintas, LAN 1 y LAN 2. Si el *Host* A en la LAN 1 quiere enviar un mensaje al *Host* C en LAN 2, no puede resolver su MAC directamente por estar en otra red. El *router* responde al ARP *Request* de A con su **propia MAC**, actuando como "proxy": A le envía el mensaje al *router* y él lo reenvía a C.
> 
> ![[proxy_arp.png|500]]

---
**Volver a:** [[06 - Direcciones IPv4|Direcciones IP]]

**Continuar a:** [[08 - Subredes|Subredes]]
