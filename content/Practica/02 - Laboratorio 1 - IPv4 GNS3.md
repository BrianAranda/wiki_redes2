---
title: Laboratorio N°1 - IPv4 (GNS3)
fuente: "[[A. Laboratorio N°1 IPV4 GNS3.pdf]]"
---
Laboratorio de configuración de un router **MikroTik** en el simulador **GNS3**, para practicar direccionamiento IPv4, DHCP, DNS y NAT sobre una topología virtual. Se relaciona con [[06 - Direcciones IPv4|Direcciones IPv4]], [[08 - Subredes|Subredes]] y [[10 - DHCP|DHCP]].

## Objetivo y topología

La consigna pide interconectar una red simulada con salida a Internet, configurar host (DHCP dinámico y estático) y demostrar [[NAT]]/[[PAT]].

![[topologia-inicial.png]]

El **Mikrotik** hace de *gateway* entre la nube (Internet) y dos switches con PCs. Para tener salida real a Internet desde GNS3 hay dos alternativas de nodo:

> [!info] Cloud vs NAT (nodo GNS3)
> - **Cloud**: conecta directo a una interfaz real del host (por ejemplo `virbr0`, el *bridge* virtual de libvirt). Si se usa `virbr0` la conexión ya queda NATeada por el host; si se usa otra interfaz, la VM toma IP de esa red tal cual.
> - **NAT** (nodo): hace el mismo trabajo que un router ADSL de un ISP — arma dos *sockets* vinculados por una tabla de NAT propia de GNS3. Corre su propio DHCP en `192.168.122.0/24` y requiere que la máquina Linux tenga `libvirt` instalado (es lo que provee la interfaz `virbr0`).

## Armar la topología

Se agrega un nodo **Cloud1** con la interfaz `virbr0` habilitada (activando antes "Show special Ethernet interfaces"), y un router **MikroTik** con 3 adaptadores de red.

![[config-cloud1-virbr0.png]]
![[config-mikrotik-adapters.png]]

Con esos dos nodos armados, la topología completa queda así: `Cloud1` — `ether1` del Mikrotik (WAN), `ether2` a un nodo **debian1** (webserver), y `ether3` a un **Switch1** que reparte a un nodo **Firefox** (con SO tipo Debian y consola gráfica VNC) y dos nodos **VPCS** (PC1 y PC2).

![[topologia-gns3-completa.png]]
![[topology-summary.png]]

## Configurar los nodos finales para DHCP

Cada host final necesita quedar en modo cliente DHCP para que sea el Mikrotik quien le asigne la IP más adelante:

- **debian1**: editar el archivo de interfaces (botón derecho → *edit config*) y descomentar las dos últimas líneas (`auto eth0` / `iface eth0 inet dhcp`), dejando comentada la sección de IP estática.

![[debian1-interfaces-dhcp.png]]

- **Firefox**: se administra por consola gráfica (VNC) en vez de un archivo de texto — en el panel de red de esa VM se tilda "Use DHCP Broadcast? yes".

![[firefox-network-dhcp.png]]

- **PC1 y PC2** (VPCS): editar el `startup.vpc` de cada uno y descomentar la línea `dhcp`.

![[pc1-startup-dhcp.png]]

> [!note] Todavía no van a obtener IP en este punto: el servidor DHCP del lado del Mikrotik recién se configura más adelante (sección "Servidor DHCP" de esta nota).

## Conexión al MikroTik con Winbox

**Winbox** es la utilidad nativa de MikroTik para administrar RouterOS (equivalente a la interfaz web, pero más cómoda). Con la topología corriendo, Winbox detecta el router por *broadcast* y se conecta usando el usuario `admin` sin contraseña (configuración de fábrica).

![[winbox-conectar.png]]

## Direcciones IP y tabla de rutas

Convención: la interfaz WAN (`ether1`) obtiene su propia IP por **DHCP** desde la nube, mientras que las interfaces LAN se configuran a mano, usando por convención la primera dirección de cada red como *gateway*:

- `ether1` (WAN): dinámica, asignada por Cloud1.
- `ether2` (webserver): `172.31.200.1/24`
- `ether3` (LAN): `172.31.100.1/24`

![[dhcp-client-status.png]]
![[topologia-redes-ip.png]]

Para no confundir interfaces conviene comentarlas (`gateway`, `webserver`, `LAN`) antes de asignarles la IP:

![[winbox-new-address-ether2.png]]
![[address-list-final.png]]

Una vez asignadas las tres direcciones, RouterOS arma automáticamente la **tabla de rutas**. La ruta `0.0.0.0/0` (todo destino) sale por `ether1` con distancia 1 hasta el *gateway* — como esa ruta cubre también las IP públicas, el router entiende que esa interfaz es la WAN. Las redes directamente conectadas (LAN, webserver) tienen distancia 0.

![[tabla-rutas.png]]

> [!info]- Siglas de la tabla de rutas
> - **D** = dinámica
> - **A** = activa
> - **S** = estática
> - **C** = conectada

Con la tabla de rutas armada ya hay conectividad de salida desde el propio router:

![[ping-conectividad.png]]

## DNS

El Mikrotik puede actuar como **caché DNS**: reenvía las consultas a los servidores configurados (por ejemplo `8.8.8.8` y `8.8.4.4`) y guarda la respuesta, reduciendo consultas repetidas a un servidor externo.

![[dns-settings.png]]

> [!important] Riesgo de "Allow Remote Requests"
> Si esta opción está habilitada, el router puede resolver DNS para los clientes de la LAN — pero **también** para cualquier conexión que llegue desde la WAN, salvo que el *firewall* bloquee el puerto 53 desde afuera.

## Servidor DHCP

RouterOS separa el servicio DHCP en tres piezas que hay que crear en orden: el **pool** de direcciones, el **servicio** (qué interfaz atiende y con qué pool) y la **red** (gateway y DNS que se entregan al cliente).

**1. Pools** — un rango de IP por cada red que va a tener DHCP propio:
- `lan`: `172.31.100.100` – `172.31.100.200`
- `webserver`: `172.31.200.100` – `172.31.200.200`

![[pools-dhcp.png]]

**2. Servicio DHCP** — uno por interfaz, apuntando al pool correspondiente. El *Lease Time* (10 minutos en este ejemplo) define cada cuánto el cliente debe renovar la asignación.

![[servicio-dhcp-webserver.png]]

**3. Redes DHCP** — asocia cada red con el *gateway* y el DNS a entregar:
- `172.31.100.0/24` → *gateway* y DNS `172.31.100.1`
- `172.31.200.0/24` → *gateway* y DNS `172.31.200.1`

![[redes-dhcp.png]]

## Solicitando la dirección (leases)

Con el servidor armado, cada cliente puede pedir su configuración:

- **VPCS** (PC1/PC2): comando `ip dhcp`, y se verifica con `show ip all`.

![[vpcs-solicitar-ip.png]]

- **Firefox y debian1** (bases Debian): al ya estar en modo DHCP no hace falta ningún comando — el sistema pide la IP solo. Se verifica con `ifconfig` o `ip addr show eth0`.

![[firefox-ifconfig.png]]

Del lado del router, la pestaña **Leases** del servidor DHCP muestra qué IP quedó **arrendada** a cada MAC, y por cuánto tiempo más es válida esa asignación (columna *Expires After*).

## Direcciones estáticas

Las IP entregadas por DHCP son dinámicas — prácticas para hosts que rotan, pero poco convenientes para un servidor al que siempre se quiere llegar por la misma dirección. Por eso conviene "fijar" el *lease* de un servidor:

![[dhcp-lease-make-static.png]]

Una vez marcado como estático (**Make Static**) desaparece la "D" de dinámica en esa fila, y a partir de ahí se puede editar la IP a mano. El nodo sigue respondiendo a su IP anterior hasta que se le renueve la configuración (por expiración del *lease* o manualmente).

![[dhcp-lease-estatica.png]]

## NAT: Source NAT (Masquerade)

Las direcciones privadas (como `172.31.x.x`) no se enrutan en Internet. Para que un host de la LAN pueda salir a la web, el router tiene que traducir esa IP privada a su propia IP pública — eso es **NAT**.

![[nat-pat-diagrama.png]]

MikroTik distingue dos tipos de NAT:
- **Source NAT**: la comunicación se origina en la red NATeada (la LAN local) — es el caso típico de salida a Internet.
- **Destination NAT**: la comunicación llega desde la WAN buscando un destino que está detrás del NAT (ver sección siguiente).

**Masquerade** es un Source NAT especial pensado para cuando la IP pública puede cambiar (el caso típico de un ADSL con IP dinámica): en vez de fijar una IP de traducción, toma la que tenga la interfaz de salida en ese momento.

La regla se crea en `IP → Firewall → NAT`, cadena (*chain*) `srcnat`, con interfaz de salida `ether1` (la WAN):

![[nat-regla-srcnat-general.png]]
![[nat-regla-srcnat-action.png]]

El efecto se ve directo al repetir el ping desde `debian1`: sin la regla no hay respuesta (la IP privada se pierde en el camino), con la regla el paquete vuelve traducido:

![[ping-sin-con-nat.png]]

## NAT: Destination NAT (Port Forwarding)

El nodo **debian1** corre un servidor web en el puerto 80 (`172.31.200.254` en este ejemplo). Desde la LAN se llega sin problema, porque el Mikrotik conoce la ruta hacia esa red:

![[exito-webserver-lan.png]]

Pero desde la nube (un host fuera de la topología GNS3, del otro lado de Cloud1) la conexión falla: esa red externa no tiene ninguna ruta hacia `172.31.200.0/24`, solo conoce la IP del propio router.

![[falla-acceso-nube.png]]

Si además se intenta acceder a la IP del router desde afuera, lo único que se obtiene es la propia interfaz web de administración del Mikrotik (WebFig) — porque el router también escucha en el puerto 80:

![[webfig-router-desde-nube.png]]

Para exponer el servidor interno hacia la WAN se necesita una regla de **Destination NAT** (también llamado *Port Forwarding*): redirige el tráfico que llega al puerto 80 del router hacia la IP interna real del servidor.

![[nat-regla-dstnat-general.png]]
![[nat-regla-dstnat-action.png]]

Con la regla activa, acceder a la IP pública del router (`192.168.122.156` en este ejemplo) desde la nube llega efectivamente al servidor web interno:

![[exito-dstnat-nube.png]]

> [!question] Tarea de la cátedra: enumerar la configuración necesaria para exponer un segundo servidor web desde la WAN
> Se agrega un segundo nodo `debian2` (con su propio `Switch2` en la red *webserver*).
>
> ![[topologia-dos-servidores.png]]
>
> **Respuesta:** el segundo servidor necesita su propia IP fija dentro de `172.31.200.0/24` (arrendamiento marcado como estático, igual que `debian1`). Como ambos servidores comparten el puerto 80 y el router solo tiene una IP pública, hay que **diferenciar el puerto externo**: se agrega una segunda regla `dstnat` con un `Dst. Port` distinto (por ejemplo 8080) que apunte con `To Addresses` a la IP del segundo servidor y `To Ports` 80. Así, `192.168.122.156:80` llega a `debian1` y `192.168.122.156:8080` llega a `debian2`.

---
**Volver a:** [[01 - Ejercicio de subredes|Ejercicios de Subredes]]

**Continuar a:** [[03 - Laboratorio 1 - IPv4 Fisico|Laboratorio N°1 - IPv4 (Físico)]]
