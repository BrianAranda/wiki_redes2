---
title: Laboratorio N°1 - IPv4 (Físico)
fuente: "[[B. Laboratorio N°1 IPV4 Fisico.pdf]]"
---
> **Nota:** Obvio no tengo los equipos necesarios para realizar este laboratorio, pero las configuraciones son practicamente las mismas que el Laboratorio anterior. Recomiendo no seguir esta guía porque no la pase en limpio.

Versión con hardware real del [[02 - Laboratorio 1 - IPv4 GNS3|laboratorio de IPv4 en GNS3]]: mismo objetivo de configurar un router **MikroTik** (direccionamiento, DHCP, DNS y NAT), pero armado con un MikroTik **RB2011** físico, switches y notebooks reales en vez de nodos simulados. Se relaciona con [[06 - Direcciones IPv4|Direcciones IPv4]], [[08 - Subredes|Subredes]] y [[10 - DHCP|DHCP]].

## Objetivo y topología

![[topologia-lab-fisico.png]]

El Mikrotik conecta hacia Internet (la red de la facultad) por `ether1`, y reparte dos LAN independientes por switch: `LAN1` y `LAN2`. No hace falta tener las cuatro PC físicamente conectadas a la vez — alcanza con ir probando la notebook propia en cada puerto para verificar la asignación de IP y la salida a Internet.

## Reseteando el dispositivo

Antes de configurar conviene partir de cero, por si el equipo traía una configuración previa que estorbe o cuyas credenciales se desconocen. Hay dos formas de resetear un MikroTik físico:

- **Por pantalla** (si el equipo tiene pantalla táctil resistiva): menú → *Reset Configuration* → contraseña de administrador por defecto `1234` → confirmar *"Reset all configuration?"*.

![[foto-pantalla-tactil-reset.png]]

- **Por hardware**: con el equipo **sin energía**, mantener presionado el botón de *reset* de la parte trasera y recién ahí conectar la alimentación; soltar el botón cuando parpadea la pantalla (no debe llegar a aparecer el mensaje "ether boot").

![[foto-boton-reset-fisico.png]]

> [!important] Presionar el botón de reset con cuidado — es frágil y se puede romper.

## Configuración mediante Winbox

Al conectarse por primera vez luego de un reset, RouterOS ofrece una configuración por defecto (bridge de LAN, DHCP client en el puerto WAN, firewall y NAT ya habilitados). Para este laboratorio conviene descartarla (**Remove Configuration**) y armar todo a mano, ya que trae de fábrica una interfaz *wireless* y un *bridge* entre puertos que no se van a usar.

![[dialogo-configuracion-default.png]]

Si por error se confirmó esa configuración por defecto, se puede resetear igual desde el propio Winbox (`System → Reset Configuration`, tildando *No Default Configuration*):

![[reset-configuration-winbox.png]]

> [!tip] Conectar por dirección MAC
> `ether1` va a quedar reservado para la WAN (el cable hacia la red de la facultad). Para administrar el router hay que conectarse por cualquier **otro** puerto — y como en RouterOS el acceso por MAC está habilitado en todos los puertos por defecto, Winbox puede conectarse usando la dirección MAC del router aunque la PC no comparta la misma red IP que él (útil cuando el Mikrotik todavía no tiene ninguna IP asignada).

## Armando la topología física

- **Mikrotik – Nube**: se conecta un cable de la red de la facultad al puerto `ether1`.
- **Switches**: cada switch va a una interfaz libre del Mikrotik (`ether2` y `ether3`). Es necesario que estén los switches de por medio para que la asignación de IP a los hosts funcione correctamente.
- **PCs**: no hace falta tenerlas todas conectadas — alcanza con probar la notebook propia puerto por puerto.

## DHCP Client (WAN)

Igual que en la versión simulada, `ether1` se configura como cliente DHCP para que el Mikrotik obtenga IP de la red de la facultad automáticamente.

![[menu-ip-dhcp-client.png]]
![[dhcp-client-status.png]]

Con eso ya hay salida hacia la nube desde el propio router:

![[ping-conectividad.png]]

## Direcciones IP y tabla de rutas

- `ether1` (WAN): dinámica, asignada por la facultad.
- `ether2` (LAN1): `192.168.0.1/24`
- `ether3` (LAN2): `172.31.100.1/24`

![[topologia-ips-asignadas.png]]

Conviene comentar cada interfaz (`gateway`, `LAN1`, `LAN2`) para no confundirlas — en el router físico van a aparecer *todas* las interfaces disponibles (incluida la *wireless*, si el modelo la tiene), a diferencia del entorno simulado donde solo existen las que se agregaron a mano.

![[interface-list-comentarios.png]]
![[winbox-new-address.png]]

Con las tres direcciones cargadas, RouterOS arma la tabla de rutas automáticamente. Acá aparece un caso adicional al del laboratorio en GNS3: si una interfaz LAN no tiene nada conectado (o hay algún problema), su ruta figura en rojo con la letra **U** (*unreachable*) en vez de **C** (conectada).

![[tabla-rutas.png]]



## DNS

Igual que en la versión GNS3, se puede habilitar la caché DNS del Mikrotik para reducir consultas repetidas a un servidor externo.

![[dns-settings.png]]

> [!important] Si "Allow Remote Requests" queda habilitado, hay que proteger el puerto 53 con una regla de *firewall* para conexiones que lleguen desde la WAN.

## Servidor DHCP

Mismos tres pasos que en la versión simulada — pool, servicio y red — pero ahora con dos LAN físicas en vez de LAN + *webserver*:

**1. Pools:**
- `lan1`: `192.168.0.100` – `192.168.0.200`
- `lan2`: `172.31.100.100` – `172.31.100.200`

(Se deja el rango acotado a 100-200 por prolijidad, pero podría usarse casi todo el rango 2-254, reservando la `.1` para el *gateway* y la `.255` para *broadcast*.)

![[pools-dhcp.png]]

**2. Servicio DHCP** por interfaz, con *Lease Time* de 10 minutos:

![[servicio-dhcp.png]]

**3. Redes DHCP** — *gateway* y DNS entregados a cada cliente:
- `172.31.100.0/24` → `172.31.100.1`
- `192.168.0.0/24` → `192.168.0.1`

![[redes-dhcp.png]]

## Leases y clientes

La pestaña **Leases** muestra qué IP quedó arrendada a cada host conectado.

![[leases-dhcp.png]]

> [!tip] Si una PC no obtiene IP, antes de sospechar de la configuración del Mikrotik conviene desconectar y reconectar el cable de red del lado del host, para forzar que su interfaz vuelva a pedir DHCP desde cero.

Para que un host efectivamente pida IP por DHCP hay que revisar su configuración de red:

- **Windows**: *Conexiones de red* → *Ethernet* → *Cambiar opciones del adaptador* → propiedades de la interfaz → *Protocolo de Internet versión 4 (TCP/IPv4)* → **Obtener una dirección IP automáticamente**.

![[windows-dhcp-navegacion.png]]
![[windows-dhcp-propiedades.png]]

- **Linux**: depende de la distribución, pero en general hay que ir al gestor de conexiones de red, elegir la interfaz cableada y verificar que el método sea **Automático (DHCP)** y no estático/manual.

![[linux-dhcp-kde.png]]
![[linux-dhcp-mint.png]]

## Direcciones estáticas

Igual que en la versión GNS3: para un servidor conviene "fijar" su *lease* para no depender de que la IP dinámica se mantenga estable en el tiempo.

![[dhcp-lease-make-static.png]]
![[dhcp-lease-estatica.png]]

## NAT (Source NAT - Masquerade)

Sin una regla de NAT, un host de la LAN no llega a Internet porque las direcciones privadas no se enrutan en la WAN.

La regla se crea en `IP → Firewall → NAT`, cadena `srcnat`, con salida por `ether1`, acción `masquerade` (Source NAT especial para cuando la IP pública de salida puede cambiar, como en un ADSL):

![[nat-regla-srcnat-general.png]]
![[nat-regla-srcnat-action.png]]

El resultado se verifica repitiendo el mismo ping antes y después de aplicar la regla:

![[ping-sin-con-nat.png]]

## Pruebas finales

La consigna pide poder verificar:
- Ping desde algún host de cada LAN hacia Internet (`ping 8.8.8.8`).
- Ping entre hosts dentro de la misma LAN.
- Ping entre hosts de **distintas** LAN.

> [!note] Para el último punto, el Mikrotik rutea sin problema el tráfico entre `192.168.0.0/24` y `172.31.100.0/24` (son redes directamente conectadas al mismo router). Si el ping igualmente falla con hosts Windows, lo más probable es que el **firewall de Windows** esté bloqueando por defecto los paquetes que llegan desde una red distinta a la propia — hay que desactivarlo momentáneamente o ajustar sus reglas para esta prueba.

---
**Volver a:** [[02 - Laboratorio 1 - IPv4 GNS3|Laboratorio N°1 - IPv4 (GNS3)]]
