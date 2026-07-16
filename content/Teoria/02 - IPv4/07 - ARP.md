---
title: ARP
---
**ARP** (Address Resolution Protocol, Protocolo de Resolución de Direcciones) construye una **tabla de dos columnas** que vincula direcciones IP de capa 3 con direcciones físicas (MAC) de capa 1/2.

> [!tip] Analogía de la carta
> Enviar una carta requiere un nombre y una dirección (equivalente a la IP, capa 3), pero el cartero necesita saber *dónde* entregarla físicamente (equivalente a la MAC, capa 2).

![[analogia-carta-arp-capa3-capa2.png]]

Si un host de origen X (IP<sub>x</sub>) quiere contactar a un host de destino Y (IP<sub>y</sub>), conoce la dirección de capa 3, pero para transmitir debe bajar a capa 2 y capa 1 — y en capa 2 no hay dirección IP, solo dirección **MAC**, que no conoce de antemano.

![[modelo-osi-capa-enlace-datos-resaltada.png]]

![[modelo-osi-capa-fisica-resaltada.png]]

ARP es el protocolo que establece la asociación entre IPs y MACs de los equipos, guardándola en una **tabla de caché ARP**. Es una caché porque debe **renovarse cada tanto** (cada 20 minutos): si fuera eterna, y un equipo cambiara de placa de red (y por lo tanto de MAC), la tabla quedaría desactualizada.

## Funcionamiento de ARP

1. El protocolo envía un mensaje de **broadcast** a la red, preguntando por la MAC del host con IP<sub>y</sub>.
2. **Todos** los equipos de la red o segmento leen ese paquete, pero **solo responde** el host IP<sub>y</sub>, con su MAC.
3. El host origen completa su tabla ARP con esa asociación.

![[funcionamiento-arp-tabla-incompleta.png]]

![[ejemplo-red-ips-origen-destino-arp.png]]

![[estructura-solicitud-arp-broadcast.png]]

En una terminal, la tabla ARP se consulta con el comando `arp -a`.

![[tabla-arp-cache-ip-mac.png]]

**Ejemplo:** el equipo con IP `197.15.22.33` quiere llegar a `197.15.22.126` pero no conoce su dirección física. Hace un broadcast enviando un **ARP Request**, y el equipo `197.15.22.126` responde con su MAC. Así, `197.15.22.33` completa la tabla con la asociación IP/MAC del destino, y a partir de ahí pueden comunicarse por capa 3.

![[ubicacion-arp-rarp-pila-tcp-ip.png]]

![[pila-tcp-ip-arp-interfaz-red-resaltado.png]]

> [!question] Pregunta de la cátedra
> Esta tabla ARP no puede ser eterna. ¿Por qué?

## Tramas ARP

ARP se utiliza en cuatro casos referentes a la comunicación entre dos hosts:

- Cuando dos hosts están en la misma red y uno quiere enviar un paquete a otro.
- Cuando dos hosts están sobre redes diferentes y deben usar un gateway o router para alcanzar otro host.
- Cuando un router necesita enviar un paquete a un host a través de otro router.
- Cuando un router necesita enviar un paquete a un host de la misma red.

## Ataques ARP

> [!warning] ARP Spoofing (suplantación de identidad)
> Consiste en enviar mensajes ARP falsos, asociando la MAC de un atacante con una IP ajena. De esta forma el atacante puede recopilar información que se envía a esa dirección IP y controlar el tráfico. Se puede prevenir con **tablas ARP estáticas** (evita la caché dinámica, aunque no siempre es viable). Herramientas típicas: Arpoison, Netcut, Ettercap.

Ataques relacionados:
- **Man in the Middle / ARP Poisoning:** el atacante intercepta todo lo que se envía (contraseñas, datos), ubicándose literalmente en el medio de la comunicación.
- **Secuestro de sesión:** similar al Man-in-the-Middle, pero el atacante captura un número de secuencia TCP genuino o una cookie web de la víctima para asumir su identidad, en vez de reenviar el tráfico. Se inicia en capa 2, pero se explota en capa 4.
- **DoS (Denial of Service):** el atacante envía una gran cantidad de solicitudes para que los sistemas no puedan responder con normalidad, explotando alguna vulnerabilidad del protocolo. Puede escalar a **DDoS**.

> [!note] No confundir
> El ataque de saturación de la tabla de un switch (que asocia puertos del switch a direcciones MAC) **no tiene nada que ver con ARP**.

## Comandos para ARP

En Linux, el comando `arp` manipula o muestra la caché ARP del kernel (`/proc/net/arp`):

| Uso | Comando |
| --- | --- |
| Ver la tabla ARP completa | `arp` / `arp -a` (formato BSD) / `arp -e` (formato Linux, columnas fijas) |
| Ver solo numérico (sin resolver nombres) | `arp -n` |
| Borrar una entrada | `arp -d <IP>` (requiere privilegios de root) |
| Agregar una entrada estática | `arp -s <IP> <MAC>` |
| Agregar entrada proxy ARP para una interfaz propia | `arp -Ds <IP> <interfaz> pub` |

> [!info]- Detalle completo del manual
> `arp` es parte del paquete `net-tools`. Ver manual completo con `man arp` (incluye opciones como `-i` para elegir interfaz, `-H` para el tipo de hardware, `-f` para cargar entradas desde un archivo, típicamente `/etc/ethers`).

## Proxy ARP

En **Proxy ARP**, un router tiene la capacidad de responder a solicitudes ARP en nombre de otros hosts (retransmite). Así es posible establecer comunicación entre dos hosts de subredes diferentes sin modificar los ajustes de red de los dispositivos.

> [!question] Pregunta de la cátedra
> Las solicitudes ARP no tienen sentido que pasen de una subred a otra. ¿Puede el alumno justificar esta afirmación?

**Ejemplo:** un router sirve dos LANs distintas, `10.0.0.0/24` y `10.0.4.0/24`. Si el Host B (en la primera LAN) quiere enviar un mensaje al Host D (en la segunda), no puede resolver su MAC directamente por estar en otra red. El router responde al ARP Request de B con su **propia MAC**, actuando como "proxy": B le envía el mensaje al router, y el router lo reenvía a D.

![[proxy-arp-router-dos-lans.png]]

## Ejercicios

1. Abrir una terminal y ejecutar `arp -a` para ver la tabla ARP del equipo.
2. Consultar la IP de un compañero (`ifconfig` en Linux, `ipconfig` en Windows) y hacerle **ping**.
3. Listar la tabla ARP nuevamente: debería aparecer una entrada nueva con la IP y la MAC del compañero.
4. Ver la tabla de ARP, hacer ping a `1.1.1.1` y verificar si aparece la MAC de ese DNS en la tabla — justificar la respuesta.

---
**Volver a:** [[06 - Direcciones IPv4|Direcciones IP]]

**Continuar a:** [[08 - Subredes|Subredes]]
