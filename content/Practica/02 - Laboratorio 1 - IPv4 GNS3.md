---
title: Laboratorio N°1 - IPv4 (GNS3)
fuente: "[[A. Laboratorio N°1 IPV4 GNS3.pdf]]"
---
> Laboratorio de configuración de un *router* **MikroTik** en el simulador **GNS3**, para practicar direccionamiento IPv4, DHCP, DNS y NAT sobre una topología virtual. 

> Se relaciona con [[06 - Direcciones IPv4|Direcciones IPv4]], [[08 - Subredes|Subredes]] y [[10 - DHCP|DHCP]].

> [!important] ¿Qué es GNS3?
> GNS3 en un software libre diseñado para emular, configurar, testear y solucionar problemas en redes. Permite correr en una PC tanto una pequeña topología de red, así como varios dispositivos en múltiples servidores e incluso conectarlos con la nube. Ver mas en: [GNS3](https://www.gns3.com/)
## Objetivos del laboratorio

Se abordaran los siguientes temas:

- Poder interconectar dispositivos de red tanto [[03 - Laboratorio 1 - IPv4 Fisico|físicamente]] como en el simulador.
- Configuración de una PC como *host* y verificar su conexión.
- Configuración de *host* para poder tener salida a la nube.
- Configuración de IP dinámicos y estático.

Objetivos:
- Configurar las IPs para las Redes con la correcta asignación de direcciones en los *host* (DHCP).
- Poder realizar un ping desde *host* hacia www.google.com (NAT y DNS).
- Poder navegar en Internet con las PCs.
- Demostrar el uso de NAT/PAT.

## Armado de la topología

La topología a utilizar en este laboratorio es la siguiente:

![[topologia.png|500]]

> Antes de conectar el *Cloud* y *Router* hay que preconfigurarlos

### Preconfiguración de *Cloud*

Para tener salida real a Internet desde GNS3 hay dos alternativas de nodo:

> [!info] Nodos Cloud vs NAT de GNS3
> - **Cloud**: conecta directo a una interfaz real del host (por ejemplo `virbr0`, el *bridge* virtual de libvirt). Si se usa `virbr0` la conexión ya queda NATeada por el host; si se usa otra interfaz, la VM toma IP de esa red tal cual.
> - **NAT**: hace el mismo trabajo que un router ADSL de un ISP, arma dos *sockets* vinculados por una tabla de NAT propia de GNS3. Corre su propio DHCP en `192.168.122.0/24` y requiere que la máquina Linux tenga `libvirt` instalado (es lo que provee la interfaz `virbr0`).

> Para el desarrollo del resto del laboratorio voy a utilizar *Cloud*

Se agrega un nodo *Cloud* con la interfaz `virbr0` habilitada:
1. Abrir la configuración del *Cloud*.
2. Activar "*Show special Ethernet interfaces*" abajo a la izquierda.
3. En el panel desplegable seleccionar virbr0.
4. Agregarlo y aplicar los cambios.

![[Pasted image 20260719095446.png]]

> [!note]- Nodo NAT
> La otra opción es NAT, propiamente hace un Nateo tal como lo haría un *router* ADLS de un ISP. Se generan dos Sockets vinculados por la tabla de NAT. El nodo NAT requiere la máquina virtual GNS3 o la computadora Linux tenga la libraría libvirt instalado. Esa librería es necesaria para crear una interfaz virbr0 para que este nodo funcione. El Nodo NAT corre un DHCP en el rango  192.168.122.0/24.

### Preconfiguración Router

Para poder conectar varios dispositivos al *router* hay que aumentarle la cantidad de conexiones posibles. Se agrega el nodo y en la pestaña de `Network` se cambia el número de `Adapters`:

![[Pasted image 20260719095705.png]]

> Capaz no hace falta, algunos nodos vienen por defecto con ocho.

### Añadir Debian/Webserver

> Yo no lo hago porque ya lo tengo. Me acuerdo que fue un re quilombo en clase para agregarlo, pídanle ayuda directamente a los profesores.

Si no contamos con el modulo debian o webserver, podemos agregarlo de la siguiente manera:
1. Nos dirigimos al menú `edit`, luego `preferences`.
2. En las opciones de la izquierda, la ultima opción: `docker containers`.
3. Clic en `New` y elegimos `webserver latest`, seguimos los pasos y tenemos agregado el modulo.

### Conexiones de la topología

Una vez preconfigurado el *Cloude* y *router* la conexión final sería la siguiente:

> Notar que las conexiones corresponden a puertos eth específicos, ciertas partes del laboratorio respetan estas elecciones así que conviene seguirlas. Especialmente para el *router*.

![[Pasted image 20260719100103.png|500]]

## Configurar Clientes DHCP

Cada host final necesita quedar en modo cliente DHCP para que sea el *router* Mikrotik quien le asigne la IP más adelante. Todavía no van a obtener IP en este punto porque el servidor DHCP no está configurado.

### Debian y webterm

Hay que editar el archivo de interfaces (clic derecho → *edit config*) y descomentar las dos últimas líneas (`auto eth0` / `iface eth0 inet dhcp`), dejando comentada la sección de IP estática.

![[Pasted image 20260719100911.png]]

### PCs

Hay que editar el `startup.vpc` de cada uno y descomentar la línea `dhcp`.

> No me acuerdo si era con doble clic o entrando don clic derecho a config

![[Pasted image 20260719101130.png]]

![[Pasted image 20260719101102.png]]

### Firefox

> Este subtitulo es solo informativo, yo no utilice el nodo Firefox.

Se administra por consola gráfica (VNC) en vez de un archivo de texto, en el panel de red de esa VM se tilda "Use DHCP Broadcast? yes".

> [!warning] No es webterm
> No es lo mismo el nodo Firefox de la guiá con el nodo Webterm. Este último se configura como el nodo Debian. Dejo esto como informativo si alguien llega a tener este nodo.

![[firefox-network-dhcp.png]]

## Winbox

**Winbox** es la utilidad nativa de MikroTik para administrar RouterOS (equivalente a la interfaz web, pero más cómoda). Con la topología corriendo, Winbox detecta el router por *broadcast*.

Una vez corriendo la topología en el GNS3 abrimos el Winbox que está en la carpeta descargas.

> Cuando se corre la topología puede saturar la CPU y RAM, esperar que se estabilice.

![[Pasted image 20260719101340.png]]

>[!important] Usuario y contraseña del router
>Inicialmente el router por *default* se conecta usando el usuario `admin` y sin contraseña. En algún punto si se ingresa a la terminal o alguna configuración específica solicita cambiar la contraseña, recomiendo poner `admin`, si no se corre el riesgo de perder el acceso y tener que hacer toda la configuración nuevamente del nodo.

![[Pasted image 20260719101640.png|500]]

### Clientes DHCP

Vamos a configurar el cliente DHCP para tener salida hacia la nube.

![[Pasted image 20260719101754.png]]

Si tenemos la configuración por defecto del Mikrotik y la red conectada a eth1 veremos que esta activo el cliente DHCP y nos ha tenido que asignar una dirección dentro de la red de la facultad. 

En el caso de que no tengamos asignada una dirección o queramos cambiar de puerto podemos agregar el cliente DCHP haciendo clic en `New` y seleccionando la interfaz `eth1`

> Cambia la IP respecto al Aula Virtual porque no lo realizo desde la facultad.

Haciendo doble clic sobre la interfaz podemos ver su estado.

![[Pasted image 20260719102159.png]]

### Esquema de direccionamiento

Vamos a realizar el siguiente esquema de direccionamiento:

![[topologia-redes-ip.png]]

Convención: la interfaz WAN (`ether1`) obtiene su propia IP por **DHCP** desde la nube, mientras que las interfaces LAN y Webserver se configuran a mano, usando por convención la primera dirección de cada red como *gateway*:

- `ether1` (WAN): dinámica, asignada por Cloud1.
- `ether2` (webserver): `172.31.200.1/24`
- `ether3` (LAN): `172.31.100.1/24`

Para no confundir interfaces conviene comentarlas (`gateway`, `webserver`, `LAN`) antes de asignarles la IP:

> Lo que dice es agregarle un comentario haciendo clic sobre la intefraz y despues agregar un nombre representativo en el campo `comment`. No es necesario si se guia con los eth.

![[Pasted image 20260719102611.png]]

### Asignación de direcciones

Vamos a trabajar en IP/Addresses

![[Pasted image 20260719102847.png]]

Donde por defecto deberíamos tener únicamente la de eth1 dinámica:

![[Pasted image 20260719102931.png]]

Agregamos las dos faltantes de Webserver y LAN:

![[Pasted image 20260719103225.png|500]]

![[Pasted image 20260719103307.png|500]]

Quedando finalemente:

![[Pasted image 20260719103523.png]]

### Tabla de rutas

Esto lo podemos ver en IP/Routes

![[Pasted image 20260719103505.png]]

Una vez asignadas las tres direcciones, el *router* arma automáticamente la tabla de rutas. La ruta `0.0.0.0/0` (todo destino) sale por `ether1` con distancia 1 hasta el *gateway*, como esa ruta cubre también las IP públicas, el *router* entiende que esa interfaz es la WAN. Las redes directamente conectadas (LAN, *webserver*) tienen distancia 0.

> [!info]- Siglas de la tabla de rutas
> - **D** = dinámica · **A** = activa · **S** = estática · **C** = conectada
> - **U** = inalcanzable (*unreachable*) · **I** = inválida (*invalid*)
Con la tabla de rutas armada ya hay conectividad de salida desde el propio router:

![[Pasted image 20260719103739.png]]

### Prueba de ping

Debemos tener en cuenta que nuestra maquina virtual debe estar conectada a internet. La configuración adecuada es en modo NAT, O modo puente y seleccionada la interfaz desde la cual proviene la conexión, inalámbrica o física.

> No conectarse en el anfitrión al wifi Unam Libre, ya que no funciona en la simulación.

> Al usar la terminal por primer vez pide cambiar la contraseña.

Vemos que ya tenemos conectividad a internet

![[Pasted image 20260719104151.png]]

También hay una herramienta ping en el menú `Tools` pero si usamos `www.google.com` quiere resolver por IPv6, entonces usamos la dirección que nos muestra en al terminal anterior para demostrar la herramienta, permite configurar muchos mas parámetros.

![[Pasted image 20260719104355.png]]

### DNS

El Mikrotik puede actuar como **caché DNS**: reenvía las consultas a los servidores configurados (por ejemplo `8.8.8.8` y `8.8.4.4`) y guarda la respuesta, reduciendo consultas repetidas a un servidor externo.

Esto es en IP/DNS

![[Pasted image 20260719104703.png]]

> [!warning] Riesgo de "*Allow Remote Requests*"
> Si esta opción está habilitada, el router puede resolver DNS para los clientes de la LAN, pero **también** para cualquier conexión que llegue desde la WAN, salvo que el *firewall* bloquee el puerto 53 desde afuera.

### Servidor DHCP

> Los *routers* MikroTik tienen un asistente para configurar el servidor DHCP pero por cuestiones didácticas lo vamos a realizar manualmente

RouterOS separa el servicio DHCP en tres piezas que hay que crear en orden: el **pool** de direcciones, el **servicio** (qué interfaz atiende y con qué pool) y la **red** (gateway y DNS que se entregan al cliente).

#### Pools

Las **pools** son un rango de IP por cada red que va a tener DHCP propio:
- `lan`: `172.31.100.100` – `172.31.100.200`
- `webserver`: `172.31.200.100` – `172.31.200.200`

![[Pasted image 20260719104802.png]]

![[Pasted image 20260719105153.png|600]]

![[Pasted image 20260719105258.png|600]]

![[Pasted image 20260719105326.png|600]]

#### Servicio DHCP

Vamos a configurar un **servicio DHCP** por interfaz, apuntando al pool correspondiente. El *Lease Time* define cada cuánto el cliente debe renovar la asignación.

![[Pasted image 20260719105410.png]]

![[Pasted image 20260719105555.png]]

![[Pasted image 20260719105814.png]]

![[Pasted image 20260719105909.png]]

#### Redes DHCP

Vamos a configurar una **red DHCP** asocia a cada red con el *gateway* y el DNS a entregar:
- `172.31.100.0/24` → *gateway* y DNS `172.31.100.1`
- `172.31.200.0/24` → *gateway* y DNS `172.31.200.1`

Vamos a IP/DHCP Server/Networks (es una pestaña)

![[Pasted image 20260719110215.png]]

![[Pasted image 20260719110315.png]]

## *Leases*

### Verificación inicial

Si vamos a IP/DHCP Server/Leases vamos a ver que todavía no tenemos ninguna dirección asignada, esto puesto que lo configuramos el Servidor DHCP pero los Clientes aún no la solicitaron.

> Las direcciones que aparecen como dinámicas corresponden a los nodos que automáticamente solicitan direcciones como Clientes DHCP: el Webserver y el Webterm

![[Pasted image 20260719110628.png]]

### Solicitando direcciones

Tenemos que volver al esquema de GNS3 y pedir las  direcciones.

Para las **VPCS** (PC1/PC2) el comando es `ip dhcp`, y se verifica con `show ip all`.

> A las VPCs se puede entrar a la consola con doble clic, si no clic derecho y consola

> Puede que tarde en hacer el ip dhcp unos segundos

Vemos que al hacer el show ip all antes del ip dhcp no se tiene ip, máscara, gateway ni dns

Para PC1:

![[Pasted image 20260719110956.png]]

Para PC2:

![[Pasted image 20260719111120.png]]

 En **Firefox y debian** al ya estar en modo DHCP no hace falta ningún comando (Aclaración de arriba) el sistema pide la IP solo. Se verifica con `ifconfig` o `ip addr show eth0`.

> Clic derecho y *Auxiliary console*

Para Webterm:

![[Pasted image 20260719111918.png]]

Para Webserver:

![[Pasted image 20260719111942.png]]

### Verificación final

Del lado del router, la pestaña **Leases** del servidor DHCP muestra qué IP quedó **arrendada** a cada MAC, y por cuánto tiempo más es válida esa asignación (columna *Expires After*).

![[Pasted image 20260719112108.png]]

### Direcciones estáticas

Las IP entregadas por DHCP son dinámicas, prácticas para hosts que rotan, pero poco convenientes para un servidor al que siempre se quiere llegar por la misma dirección. Por eso conviene "fijar" el *lease* de un servidor:

![[Pasted image 20260719112242.png]]

Una vez marcado como estático (**Make Static**) desaparece la "D" de dinámica en esa fila, y a partir de ahí se puede editar la IP a mano. El nodo sigue respondiendo a su IP anterior hasta que se le renueve la configuración (por expiración del *lease* o manualmente).

![[Pasted image 20260719112439.png]]

## Nateo

MikroTik distingue dos tipos de NAT:
- ***Source* NAT**: la comunicación se origina en la red NATeada (la LAN local), es el caso típico de salida a Internet.
- ***Destination* NAT**: la comunicación llega desde la WAN buscando un destino que está detrás del NAT (ver sección siguiente).

### *Source* NAT (*Masquerade*)

Las direcciones privadas (como `172.31.x.x`) no se enrutan en Internet. Para que un host de la LAN pueda salir a la web, el *router* tiene que traducir esa IP privada a su propia IP pública: eso es **NAT**. Si probamos realizar un ping hacia internet (8.8.8.8 en esta prueba) vemos que no funciona:

Desde VPC1 o 2:

![[Pasted image 20260719112709.png]]

Desde Webserver:

![[Pasted image 20260719112740.png]]

Utilizamos ***Masquerade*** que es un Source NAT especial pensado para cuando la IP pública puede cambiar (el caso típico de un ADSL con IP dinámica): en vez de fijar una IP de traducción, toma la que tenga la interfaz de salida en ese momento.

En Winbox vamos a IP/Firewall/NAT

![[Pasted image 20260719112918.png]]

Allí vamos a crear la regla de srcnat en la eth1:

![[Pasted image 20260719113029.png]]

> Se pueden plegar las opciones

Además en la parte inferior realizamos la acción de *masquerade*:

![[Pasted image 20260719113154.png]]

Si probamos ya debería funcionar el ping a internet:

Desde VPC1 o 2:

![[Pasted image 20260719113325.png]]

Desde Webserver:

![[Pasted image 20260719113413.png]]

### *Destination* NAT (*Port Forwarding*)

El nodo **debian1** corre un servidor web en el puerto 80 (`172.31.200.254` en este ejemplo). Desde la LAN se llega sin problema, porque el Mikrotik conoce la ruta hacia esa red:

> Desde el Webterm, no Webserver. Abre solo un Firefox con doble clic


![[Pasted image 20260719113629.png]]

Pero desde la nube (un host fuera de la topología GNS3, del otro lado de Cloud1) la conexión falla: esa red externa no tiene ninguna ruta hacia `172.31.200.0/24`, solo conoce la IP del propio *router*.

![[Pasted image 20260719113833.png]]

> [!warning] Cuidado con la siguiente dirección IP
> No es 192.169.122.**156** como figura en el Aula Virtual, esto porque cambia al ser dinámica al conectarse por primera vez. En las capturas de la cátedra usan esa dirección como fija pero puede variar. Debe ser la que tiene el eth1 en IP/Addresses
>
> ![[Pasted image 20260719123536.png]]

Si además se intenta acceder a la IP del *router* (la de la imagen de arriba) desde afuera, lo único que se obtiene es la propia interfaz web de administración del Mikrotik, porque el router también escucha en el puerto 80:

![[Pasted image 20260719114320.png]]

Para exponer el servidor interno hacia la WAN se necesita una regla de ***Destination* NAT** (también llamado *Port Forwarding*): redirige el tráfico que llega al puerto 80 del router hacia la IP interna real del servidor.

![[Pasted image 20260719114605.png]]

![[Pasted image 20260719114715.png]]

> [!warning] Problema en el *Destination* NAT
> A mi lo anterior no me funciono, me mostraba la página del *router* o directamente no funcionaba. Fijandome el Webserver (a donde queremos realizar el Port Forwarding) no estaba reconociendo la dirección estática .254, si no que usaba la dinámica:
> 
> ![[Pasted image 20260719123803.png]]
>
> Por lo que hay que arreglar el `action` de la regla:  
>
> ![[Pasted image 20260719123837.png|500]]

Con la regla activa, acceder a la IP pública del router desde la nube llega efectivamente al servidor web interno:

![[Pasted image 20260719123431.png]]

> [!question] Tarea de la cátedra
> 
> Enumerar la configuración necesaria para exponer un segundo servidor web desde la WAN si se agrega un segundo nodo `debian2` (con su propio `Switch2` en la red *webserver*).
>
> ![[topologia-dos-servidores.png]]
>
> **Respuesta:** el segundo servidor necesita su propia IP fija dentro de `172.31.200.0/24` (arrendamiento marcado como estático, igual que `debian1`). Como ambos servidores comparten el puerto 80 y el router solo tiene una IP pública, hay que **diferenciar el puerto externo**: se agrega una segunda regla `dstnat` con un `Dst. Port` distinto (por ejemplo 8080) que apunte con `To Addresses` a la IP del segundo servidor y `To Ports` 80. Así, `192.168.122.156:80` llega a `debian1` y `192.168.122.156:8080` llega a `debian2`.

---
**Volver a:** [[01 - Ejercicio de subredes|Ejercicios de Subredes]]

**Continuar a:** [[03 - Laboratorio 1 - IPv4 Fisico|Laboratorio N°1 - IPv4 (Físico)]]
