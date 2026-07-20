---
title: Laboratorio N°1 - IPv4 (Físico)
fuente: "[[B. Laboratorio N°1 IPV4 Fisico.pdf]]"
---
> **Nota:** Obvio no tengo los equipos necesarios para realizar este laboratorio, pero las configuraciones son practicamente las mismas que el Laboratorio anterior. Recomiendo no seguir esta guía porque no la pase en limpio.

Versión con hardware real del [[02 - Laboratorio 1 - IPv4 GNS3|laboratorio de IPv4 en GNS3]]: mismo objetivo de configurar un router **MikroTik** (direccionamiento, DHCP, DNS y NAT), pero armado con un MikroTik **RB2011** físico, switches y notebooks reales en vez de nodos simulados. Se relaciona con [[06 - Direcciones IPv4|Direcciones IPv4]], [[08 - Subredes|Subredes]] y [[10 - DHCP|DHCP]].

## Consigna

Se abordarán los siguientes temas:
- Poder interconectar dispositivos de red tanto físicamente como en el simulador.
- Configuración de una PC como *host*, verificación de la conexión.
- Configuración de *host* para poder tener salida a la nube.
- Configuración de IP dinámicos y estáticos.

![[topologia-lab-fisico.png]]

Objetivos:
- Configurar las IPs para las redes según se indica en la topología, con la correcta asignación de direcciones en los *host* (DHCP).
- Poder realizar un ping desde un *host* hacia www.google.com (NAT y DNS).
- Poder navegar en Internet con las PCs.
- Demostrar el uso de NAT/PAT.

## Reseteando dispositivos

Como primera medida se resetea el Mikrotik, para borrar toda configuración que pueda molestar o si no se tienen los datos para ingresar al mismo. Se puede hacer de dos maneras:

**Reseteo mediante pantalla:** se realiza en la pantalla táctil del dispositivo Mikrotik si tuviese (la pantalla es del tipo resistivo, por lo que se puede emplear algún objeto para navegar de forma más práctica). En la pantalla principal se busca "Reset Configuration" → la contraseña de administrador por defecto es `1234`. Luego se aprieta *enter* (parte superior derecha) y cuando se pregunta *"Reset all configuration?"*, se responde *"Yes"*.

![[foto-pantalla-tactil-reset.png]]

**Reseteo por hardware:** para el Mikrotik RB2011 se ubica en la parte trasera del equipo el pulsador de *Reset*. El dispositivo debe encontrarse **sin energía**. Hay que mantener presionado el pulsador de reset, luego conectar la energía. Esperar, y cuando la pantalla parpadee hay que soltarlo — no debe llegar a aparecer el mensaje "ether boot".

![[foto-boton-reset-fisico.png]]

> [!warning] Presionar levemente el pulsador — si no, se puede romper.

## Configuración mediante Winbox

Para configurar el Mikrotik se utiliza **WinBox**, una utilidad de MikroTik para efectuar las configuraciones del dispositivo — prácticamente lo mismo que la interfaz web, pero con ventajas adicionales y mayor comodidad.

> [!note] WinBox en Linux
> WinBox es una utilidad de Windows, pero corre en Linux sin problemas mediante Wine; también existe ya una versión Beta nativa para Linux.

Al abrir Winbox aparecen los distintos dispositivos detectados en la red, en la pestaña **Neighbors**.

> [!tip] Conectarse por IP o por MAC
> - Si se hace clic en la **dirección IP** de la lista de *Neighbors*, esa IP se carga como dispositivo a conectar en "Connect To". Si el Mikrotik no tiene IP en la misma red (o no tiene IP asignada, `0.0.0.0`), no se puede conectar por esta vía.
> - Si en cambio se hace clic en la **dirección MAC** del dispositivo, se puede conectar directamente por MAC sin necesidad de pertenecer a la misma red que el Mikrotik.
> - Para encontrar el dispositivo más fácil en la lista, conviene fijarse en el tiempo que llevan online (si se conectó recién, es fácil de identificar) o guiarse por el número de MAC si hay acceso físico fácil al router.
> - La MAC que figura debajo del dispositivo varía según el puerto/interfaz por el que se está conectado (suma un bit a la MAC base).

**Para este laboratorio se deja la interfaz `ether1` para la red WAN**, conectada a un cable de la red de la FIO para tener salida hacia la nube. Para conectarse al Mikrotik se usa cualquiera de los otros puertos, y luego se conecta por su dirección MAC (el acceso por MAC está habilitado por defecto en todos los puertos).

> [!note] Si el MikroTik ya tiene IP de la facultad
> En el caso de no poder acceder desde alguna de las otras interfaces, y que el MK haya obtenido su dirección IP desde el servidor DHCP de la facultad, también se puede conectar estando dentro de la red de la facultad (por cable o inalámbrica) usando esa IPv4 asignada.

Al abrir el dispositivo por primera vez con Winbox, luego del reinicio, aparece el siguiente diálogo que avisa que se cargó una configuración por defecto (muestra los parámetros configurados, con opción de descargar el script para verlos en detalle):

![[dialogo-configuracion-default.png]]

Si no se quiere esa configuración por defecto (por ejemplo, trae una interfaz WLAN y un *bridge* entre varios puertos que acá no hacen falta), se hace clic en **Remove Configuration**. Si en cambio se planea configurar el Mikrotik vía WLAN, se puede hacer clic en **OK** para mantenerla, aunque después haya que modificarla.

Si por error se confirmó esa configuración por defecto, también se puede resetear fácil desde el propio Winbox:

![[reset-configuration-winbox.png]]

### Anexo: crear un servidor DHCP para conectarse

Como alternativa, se puede dejar un puerto específico con un servidor DHCP para conectarse a administración, así como deshabilitar el acceso por MAC en todos los puertos para mayor seguridad. Ver la guía de MikroTik: [First Time Configuration](https://help.mikrotik.com/docs/display/ROS/First+Time+Configuration).

## Armando la topología física

Recordando la topología de la consigna:

- **Mikrotik – Nube**: en este caso la nube es el servidor de la facultad, para tener salida a la WAN. Se conecta en el puerto `ether1` un cable de red de alguna computadora cercana.
- **Switch**: se conecta el switch en su puerto 0 a una interfaz libre del Mikrotik — en este caso `Switch1` va a la interfaz `ether2` y el otro switch a la interfaz `ether3`. *Es necesario contar con los switch para que la asignación de IP funcione correctamente.*
- **PC1, PC2, PC3, PC4**: no es necesario que estén todas realmente presentes — se puede probar cada puerto conectando la PC/notebook con la que se está configurando en cada puerto individual, para verificar las asignaciones de IP y la salida hacia Internet.

## DHCP Client

Se configura el cliente DHCP para que el Mikrotik obtenga su IP desde la red de la facultad.

![[menu-ip-dhcp-client.png]]

Con la configuración por defecto del Mikrotik y la red conectada a `eth1`, el cliente DHCP ya está activo y debería habernos asignado una dirección dentro de la red de la facultad. En el caso de no tener asignada una dirección, o de querer cambiar de puerto, se puede agregar el cliente DHCP haciendo clic en el botón `+` y seleccionando la interfaz (`eth1` u otra). Haciendo doble clic sobre la interfaz se ve su estado:

![[dhcp-client-status.png]]

## Probando la conectividad del router

Con el botón **"New Terminal"** se abre una consola donde se puede ejecutar `ping`. Si todo es correcto, significa que el MikroTik tiene una IP asignada y salida hacia la nube.

![[ping-conectividad.png]]

> [!tip] También hay una herramienta de ping accesible desde el menú **Tools**.

## Direcciones IP y tabla de rutas

Se establecen las direcciones IP de las interfaces del router. Se acostumbra usar la primera dirección de la red para el *gateway* — para ambas LAN, el *gateway* es el router:

- `ether1` (WAN): obtiene su IP del servidor DHCP de la nube (ver en `IP → DHCP Client`).
- `ether2` (LAN1): `192.168.0.1/24`
- `ether3` (LAN2): `172.31.100.1/24`

![[topologia-ips-asignadas.png]]

Para evitar confusiones conviene identificar las interfaces con un comentario descriptivo: `gateway`, `LAN1`, `LAN2`. En el router físico van a figurar **todas** las interfaces disponibles (a diferencia del entorno simulado, donde solo existen las que se agregaron a mano) — si se deshabilita alguna, esa fila queda en gris. En la captura de la guía, por ejemplo, está habilitada la interfaz inalámbrica.

![[interface-list-comentarios.png]]

Ahora se agregan las direcciones IP — la interfaz `ether1` ya tiene la suya (con una "D" de dinámica a la izquierda, por DHCP). Una vez agregadas las tres direcciones queda la siguiente tabla:

![[winbox-new-address.png]]

Con las tres direcciones cargadas, RouterOS arma la tabla de rutas automáticamente. Si una interfaz LAN no tiene nada conectado (o hay algún problema), la letra de esa fila es **U** y la ruta figura en rojo (inalcanzable).

![[tabla-rutas.png]]

Se aprecia que a la dirección `0.0.0.0/0` (todo destino) se llega a través de `ether1`, con una distancia de 1 salto hasta el *gateway* — como esa dirección incluye también las IP públicas, el router entiende que esa interfaz es la WAN y se convierte en el *gateway* de la topología. Las interfaces locales tienen distancia 0.

> [!info]- Siglas de la tabla de rutas
> - **D** = dinámica · **A** = activa · **S** = estática · **C** = conectada
> - **U** = inalcanzable (*unreachable*) · **I** = inválida (*invalid*)

## DNS

Opcionalmente se puede habilitar la caché DNS: de esta manera se reducen las consultas a un servidor externo y se minimizan los tiempos de resolución.

![[dns-settings.png]]

> [!important] Riesgo de "*Allow Remote Requests*"
> Si esta opción está habilitada, el router puede usarse como servidor DNS por los clientes de las redes conectadas — pero también tendrán acceso las conexiones desde la WAN. Conviene protegerlo, por ejemplo con una regla de *firewall* que niegue las conexiones WAN al puerto 53 (DNS).

## Servidor DHCP

Los routers MikroTik tienen un asistente para configurar el servidor DHCP, pero por cuestiones didácticas se va a hacer manualmente en tres pasos: crear los *pools*, crear los servicios DHCP y crear las redes.

### Pools

Primero se crean los conjuntos de direcciones a usar en cada red (*pool*):
- `lan1`: rango `192.168.0.100` – `192.168.0.200`
- `lan2`: rango `172.31.100.100` – `172.31.100.200`

> Por simplicidad se restringen los *pools* al rango 100-200, pero se podría asignar casi todo el rango 2-254, dejando la `.1` para el *gateway* y la `.255` para *broadcast*.

![[pools-dhcp.png]]

### Servicio DHCP

Se crea un servicio para cada una de las redes locales. Las configuraciones asignadas van a ser válidas por 10 minutos (*Lease Time*) — pasado ese período, el nodo deberá solicitar una nueva configuración (el IP se renueva).

![[servicio-dhcp.png]]

> [!warning] No olvidar activar (**Enable**) el servidor DHCP recién creado.

### Redes DHCP

Por último se crean las 2 redes para el servidor DHCP:
- `172.31.100.0/24` → *gateway* y DNS `172.31.100.1`
- `192.168.0.0/24` → *gateway* y DNS `192.168.0.1`

![[redes-dhcp.png]]

## Leases (arrendamientos)

En la configuración del servidor DHCP del Mikrotik, pestaña **Leases**, se pueden ver las direcciones IP asignadas. Si una PC no obtiene dirección, puede que esté mal hecha alguna configuración, o que no tenga habilitado el cliente DHCP (ver el apartado siguiente).

![[leases-dhcp.png]]

> [!tip] Si se tiene conectada una máquina y se hacen cambios en el MikroTik, es buena práctica desconectar el cable de red y volver a conectarlo luego de unos segundos, para que se reinicie la interfaz de la PC.

Para que un host efectivamente pida IP por DHCP hay que revisar su configuración de red:

### DHCP en Windows

Para verificar que el host tenga por defecto la opción de obtener IP automáticamente: botón derecho sobre el menú de Inicio → *Conexiones de red* → *Ethernet* → *Cambiar opciones del adaptador*. Doble clic en la interfaz → *Propiedades* → *Protocolo de Internet versión 4 (TCP/IPv4)* → *Propiedades* → tildar **Obtener una dirección IP automáticamente**.

![[windows-dhcp-navegacion.png]]
![[windows-dhcp-propiedades.png]]

### DHCP en Linux

Depende de la distribución, pero en general hay que ir al gestor de conexiones de red, elegir la interfaz cableada (*wired*) y verificar que el método sea DHCP y no estático/manual.

En **KDE**: botón derecho sobre el ícono del gestor de red → *configurar conexiones de red*.

![[linux-dhcp-kde.png]]

En **Linux Mint**:

![[linux-dhcp-mint.png]]

## Direcciones estáticas

Como se vio en la tabla de *leases*, las direcciones arrendadas son dinámicas (la "D" a la izquierda de cada fila) — práctico para reutilizar direcciones a medida que se recambian los dispositivos, pero no conviene para servidores, a los que siempre se quiere acceder con la misma IP. Por eso conviene asignarles una IP fija: se hace doble clic sobre la dirección arrendada y se la marca como estática.

![[dhcp-lease-make-static.png]]

Una vez marcada como estática ya no figura la "D" de dinámica, y de ahí en más se puede escribir directamente sobre el campo de dirección para cambiar la IP. El nodo sigue respondiendo a su IP anterior hasta que expire el *lease time* y pida una nueva configuración, o hasta que se le cambie manualmente.

![[dhcp-lease-estatica.png]]

## NAT

Este tema se ve en detalle más adelante, pero por ahora se configura lo necesario para poder navegar. Si se intenta hacer *ping* desde algún host de la LAN no se llega a un destino en Internet — esto pasa porque las direcciones privadas no se enrutan en Internet (más en general, no se deben enrutar en ninguna WAN). Para convertir direcciones privadas en públicas se usa **NAT**.

MikroTik tiene un tipo especial de *Source NAT* pensado para cuando la IP pública puede cambiar — el caso típico de un ADSL con direcciones públicas dinámicas. Para crear la regla se va a `IP → Firewall`, pestaña **NAT**.

Como la comunicación se inicia en una zona privada, se trata de una *source nat* (`chain: srcnat`), y la comunicación va a salir por la interfaz `ether1`, que es la que está conectada al *gateway*:

![[nat-regla-srcnat-general.png]]

Por último se define la acción de la regla: **masquerade**.

![[nat-regla-srcnat-action.png]]

Con la regla creada, se repite el *ping* desde la PC hacia Internet y ahora sí funciona:

![[ping-sin-con-nat.png]]

## Pruebas

Una vez hechas todas las conexiones, hay que poder verificar correctamente:
- Ping desde algún host de las LAN hacia Internet (`ping 8.8.8.8`).
- Ping de los hosts dentro de su propia LAN.
- Ping entre hosts de **distintas** LAN.

> [!note] Para este último punto, el MikroTik rutea todos los paquetes hacia la red que corresponde sin problema — pero por defecto, el **firewall de Windows** bloquea los paquetes que vienen de una red distinta a la propia del equipo. Si se usan hosts Windows, hay que desactivar el firewall momentáneamente o modificar sus reglas para esta prueba.

---
**Volver a:** [[02 - Laboratorio 1 - IPv4 GNS3|Laboratorio N°1 - IPv4 (GNS3)]]
