---
title: Direcciones IP
---
Los campos dirección origen y destino de la cabecera IP contienen cada uno una **dirección de Internet global de 32 bits**, que generalmente consta de un identificador de red y un identificador de computador (host).

## Clases de red

La dirección está codificada para permitir una asignación variable de bits entre red y computador — esquema conocido como **Classful**. Existen tres clases principales:

- **Clase A:** pocas redes, cada una con muchos computadores.
- **Clase B:** un número medio de redes, con un número medio de computadores cada una.
- **Clase C:** muchas redes, cada una con pocos computadores.

Las clases D y E están reservadas para fines experimentales y de multidifusión, respectivamente.

![[clases-red-a-b-c-d-e-bytes.png]]

![[figura-18-7-formatos-direccion-ip-bits-clase.png]]

> [!important] Identificación de la clase por los primeros bits
> - **Clase A:** empieza con `0` binario. El primer octeto va de 1 a 126 (0 y 127 están reservados). $2^{8-1} = 128$ redes, $2^{24}$ hosts.
> - **Clase B:** empieza con `10`. Primer octeto entre 128 y 191. $2^{16}-2 = 16.384$ redes, $2^{16}$ hosts.
> - **Clase C:** empieza con `110`. Primer octeto entre 192 y 223. $2^{24-3} = 2.097.152$ redes, $2^8 = 256$ hosts.
>
> Como regla práctica, la ubicación del **primer bit en cero** determina la clase de red (A, B o C).

![[tabla-rangos-clases-a-b-c-bits-red-host.png]]

Las direcciones IP se escriben en **notación decimal con punto**, usando un número decimal por cada uno de los 4 octetos de 32 bits. Por ejemplo, `11000000 11100100 00010001 00111001` se escribe `192.228.17.57`.

![[ejemplo-conversion-bits-decimal-punteado.png]]

## Redes privadas

Inicialmente todas las asignaciones de direcciones fueron **públicas** (como un número de teléfono, único en el mundo). Rápidamente surgieron problemas: no todos los equipos se conectan directamente a Internet, no todos se conectan a Internet, y podrían faltar direcciones IPv4. Esto llevó a definir direcciones **privadas**.

> [!important] Público vs. privado
> - **IP pública:** se asigna a cualquier dispositivo que se conecta directamente a Internet (ej. el router de casa, un servidor web). Es visible desde Internet.
> - **IP privada:** se asigna a cada dispositivo dentro de una red privada/doméstica (el router/módem la asigna). No es accesible desde Internet y no cambia salvo asignación manual. Varios dispositivos de una red comparten la misma IP pública.

![[diagrama-ip-privada-publica-modem.png]]

> [!tip] Analogía
> Como los números de teléfono internos de una empresa: hay un teléfono con número público al que se puede llamar desde la red telefónica, pero puertas adentro los internos son privados — y hasta pueden repetirse entre distintas empresas.

![[analogia-central-telefonica-ip-privada-publica.png]]

Según el **RFC 1918**, se destinaron los siguientes rangos de IPs privadas:

![[rangos-redes-privadas-rfc1918.png]]

> [!warning] Ojo con las máscaras
> La IP privada de clase B **no es /16**, sino **/12**. La IP privada de clase C **no es /24**, sino **/16**.

> [!question] Pregunta de la cátedra
> ¿Sería usted capaz de decir a qué corresponde este rango de IPs: `169.254.0.0` – `169.254.255.255`? ¿Dónde se podría ver?

### Redes privadas para proveedores ISP

Existe un espacio de direcciones compartido para las comunicaciones entre un proveedor de servicios y sus suscriptores, cuando se usa un NAT de nivel de operador: **`100.64.0.0/10`** (de `100.64.0.0` a `100.127.255.255`). Al ser una dirección /10, tiene 22 bits para direcciones IP en cada subred ($2^{10}=1024$ subredes posibles, cada una con $2^{22}=4.194.304$ direcciones).

## Pros y Contras de Direcciones Privadas

**Ventajas:**
- Conserva el espacio de direcciones globalmente único, al no requerir unicidad global donde no hace falta.
- Da flexibilidad de diseño de red (más espacio de direcciones disponible que el que se obtendría del pool público).
- Permite esquemas de direccionamiento administrativamente convenientes y caminos de crecimiento más fáciles.
- Es una opción segura para empresas que aún no se conectaron a Internet y usaron IPs sin asignación de IANA, evitando choques al conectarse después.

**Desventajas:**
- Puede reducir la flexibilidad de una empresa para acceder a Internet, requiriendo mecanismos adicionales: [[09 - DHCP|DHCP]], mapeo de puertos, [[NAT]], [[PAT]], Port Forwarding, etc.

---
**Volver a:** [[04 - Cabecera IP|Cabecera IP]]

**Continuar a:** [[06 - ARP|ARP]]
