---
title: DHCP
---
**DHCPv4** (*Dynamic Host Configuration Protocol* v4) asigna direcciones IPv4 y otra información de configuración de red de forma **dinámica**. Normalmente el equipo que cumple este rol es el *router*/*gateway*, aunque no tiene por qué serlo.

> [!important] El servidor DHCPv4 asigna:
> 1. Dirección IPv4.
>2. Máscara de red (*Subnet Mask*).
>3. Puerta de enlace predeterminada (*Default Gateway*).
>4. Servidores DNS (*Domain Name System*).
>5. Duración del arrendamiento (*Lease Time*).

> [!info]- Opcionales de DHCPv4
> - **NTP *Server*** (Opción 42): servidor de hora.
> - **TFTP *Server*** (Opciones 66 y 150): servidor para descargar configuraciones o *firmware*.
> - **PXE *Boot Server*** (Opción 67): para arrancar sistemas operativos por red.
> - **VoIP *Server*** (Opciones 66 y 150): para teléfonos IP.
> - ***Domain Name*** (Opción 15): nombre de dominio de la red local.

## Mecanismos de asignación

- **Manual** (para servidores, impresoras, etc.): el administrador asigna una IP preasignada al cliente; DHCP **solo comunica** esa dirección.
- **Automática:** DHCP asigna automáticamente una IP **estática** de forma permanente, seleccionada de un conjunto disponible (sin arrendamiento).
- **Dinámica**: DHCP arrienda una IP de un conjunto de direcciones por un **período limitado**, elegido por el servidor o hasta que el cliente ya no la necesite.

El mecanismo mas utilizado es el **dinámico**, con una duración de arrendamiento típico de 24 horas a una semana o más. Al caducar, el cliente solicita otra dirección (generalmente la misma).

## Proceso de arrendamiento

Cuando el cliente arranca o quiere unirse a una red debe pasar por:

> [!important] Los cuatro pasos de DHCP
> 1. Descubrimiento de DHCP o **DHCP *Discover*** (DHCPDISCOVER)
> 2. Oferta de DHCP o **DHCP *Offer*** (DHCPOFFER)
> 3. Solicitud de DHCP o **DHCP *Request*** (DHCPREQUEST)
> 4. Acuse de recibo DHCP**DHCP *Acknowledgment*** (DHCPACK)

![[dhcp_proceso.png]]

> [!note]- Difusión y unidifusión en el arrendamiento
> - ***Discover*** (cliente → todos) es de **difusión** porque el cliente no tiene IP propia (`0.0.0.0`) ni sabe la IP de ningún servidor DHCP, no hay a quién unicastear, así que difunde al segmento entero.
> - ***Offer*** (servidor → cliente) es de **unidifusión** porque el servidor ya conoce la MAC del cliente (la sacó del *Discover*), así que le responde directo a esa dirección.
> - ***Request*** (cliente → todos) es de  **difusión** ya que aunque el cliente ya sabe qué servidor eligió, este mensaje cumple una doble función: confirma la aceptación al servidor elegido y, a la vez, le avisa a los **demás** servidores que hayan ofertado que su oferta fue rechazada, para que liberen la IP que tenían reservada.
> - **ACK** (servidor → cliente) es de **unidifusión** como confirmación final, directa al cliente.

### Renovación del arrendamiento

Antes de que expire el arrendamiento, el cliente inicia un proceso más corto:

> [!important] Proceso de renovación DHCP
> 1. Solicitud de DHCP o **DHCP *Request*** (DHCPREQUEST)
> 2. Acuse de recibo DHCP**DHCP *Acknowledgment*** (DHCPACK)

![[dhcp_renovar.png|600]]

> [!note]- Unidifusión en la renovación
> A diferencia del arrendamiento inicial, la renovación es unicast en ambos sentidos
> - El ***Request* de renovación** (cliente → servidor) puede ser de **unidifusión** ya tiene se una IP válida y funcionando (la que está renovando), y ya sabe con certeza a qué servidor renovarle. No hay ambigüedad de direcciones ni terceros a quienes avisar, así que habla directo con su servidor.
> - **ACK** (servidor → cliente) es de **unidifusión** porque el servidor ya conoce la IP del cliente (la misma que le había asignado), así que responde directo, sin necesidad de difusión.

## ¿En qué capa funciona DHCP?

DHCP opera principalmente en la **capa de Aplicación**, pero gestiona direcciones de capa 3 y usa UDP (capa 4) para transportarse:

- **Capa de Transporte (4):** usa UDP, puertos 67 y 68.
- **Capa de Red (3):** configura direcciones IP.
- **Capa de Enlace de Datos (2):** usa direcciones MAC para la comunicación inicial, antes de obtener una IP.

> [!note] Independencia entre capas
> Este comportamiento de DHCP muestra que **no existe independencia total entre las capas** en el modelo TCP/IP: un protocolo de aplicación termina condicionando el trabajo de capas inferiores.

## Formato del mensaje DHCP

Los mensajes DHCPv4 están en la capa de **Aplicación** (capa 5) y se envían sobre **UDP** (capa 4): el cliente usa el puerto origen 68 y destino 67; el servidor los mismos puertos pero invertidos entre origen y destino.

![[dhcp_mensaje.png]]

| Campo                                 | Descripción                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Código de operación (OP)**          | Tipo de mensaje general: 1 = solicitud, 2 = respuesta.                                                 |
| **Tipo de hardware**                  | Tipo de red (1 = Ethernet, 15 = Frame Relay, 20 = línea serial). Mismos códigos que ARP.               |
| **Longitud de dirección de hardware** | Longitud de la dirección física.                                                                       |
| **Saltos**                            | Controla el reenvío; el cliente lo pone en 0 antes de transmitir.                                      |
| **Identificador de transacción**      | Usado por el cliente para emparejar su solicitud con la respuesta del servidor.                        |
| **Segundos**                          | Segundos transcurridos desde que el cliente empezó a intentar adquirir/renovar el arrendamiento.       |
| **Indicadores**                       | Bit de difusión: si vale 1, le indica al servidor/relay que la respuesta debe enviarse como broadcast. |
| **Dirección IP del cliente**          | La usa el cliente durante la renovación, si ya tiene una IP válida; si no, va en `0.0.0.0`.            |
| **Su dirección IP**                   | La usa el servidor para asignar la IP al cliente.                                                      |
| **Dirección IP del servidor**         | Identifica al servidor a usar en el próximo paso del proceso "bootstrap" (BOOTP).                      |
| **Dirección IP del gateway**          | Enruta mensajes DHCP cuando intervienen agentes de retransmisión, entre subredes distintas.            |
| **Dirección de hardware del cliente** | La capa física del cliente.                                                                            |
| **Nombre del servidor**               | Opcional, apodo o nombre DNS del servidor que envía un Offer o Ack.                                    |
| **Nombre del archivo de arranque**    | Opcional, usado en procesos de arranque por red.                                                       |
| **Opciones de DHCP**                  | Longitud variable; parámetros adicionales requeridos para el funcionamiento básico.                    |

Cómo ejemplo de envió de mensajes DHCP tenemos la siguiente imagen con *Discover* y *Offer*:

![[dhcp_envios.png]]

> [!note] APIPA
> Si un sistema Windows no encuentra un servidor DHCP, inicia **APIPA** (*Automatic Private Internet Protocol Addressing*): asigna automáticamente una IP privada de clase B en el rango `169.254.0.0/16`, con máscara `255.255.0.0`.

---
**Volver a:** [[09 - Localhost|Localhost]]

**Continuar a:** [[11 - Zeroconf|Zeroconf]]
