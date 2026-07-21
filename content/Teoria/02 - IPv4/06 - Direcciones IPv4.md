---
title: Direcciones IPv4
fuente:
  - "[RFC 790](https://www.rfc-editor.org/info/rfc790/)"
  - "[RFC 1918](https://www.rfc-es.org/rfc/rfc1918-es.txt)"
---
Los campos de dirección origen y destino de la [[04 - Cabecera IPv4#Direcciones de Origen y Destino|Cabecera IPv4]] contienen cada uno una dirección de Internet **global** de 32 bits, que generalmente consta de un identificador de red y un identificador de computador (*host*).

## Representar direcciones IPv4
### Notación decimal con punto

Las direcciones IP se escriben en **notación decimal con punto**, usando un número decimal por cada uno de los 4 octetos (o bytes) de 32 bits. Por ejemplo:

$$
\underbrace{
\underbrace{11000000}_{\large192}
\quad \underbrace{11100100}_{\large228} 
\quad \underbrace{00010001}_{\large17} 
\quad \underbrace{00111001}_{\large57}
}_{\boxed{\Large192.228.17.57}}
$$

### Prefijo o máscaras red

Es el número que indica cuántos bits de una dirección IP corresponden a la red, y cuántos quedan libres para identificar *hosts* dentro de ella. Se escribe como `/n` (por ejemplo, `/24`) o como una máscara en notación decimal (`255.255.255.0`), y ambas formas dicen exactamente lo mismo: los primeros `n` bits son fijos (la red), el resto son variables (el host).

El número `n` indica cuantos bits en 1 estarán en la máscara desde el MSB (desde la izquierda)

$$
/8 \longrightarrow 1111 \: 1111 \quad 0000 \: 0000 \quad 0000 \: 0000 \quad 0000 \: 0000 \longrightarrow 255.0.0.0
$$
## Redes con Clases

Si bien **ya no se usan para asignar ni rutear direcciones**, el sistema de clases fue el esquema original de 1981 (RFC 791) y quedó obsoleto en 1993 reemplazado por CIDR (RFC 1519). La dirección está codificada para permitir una asignación variable de bits entre red y computador, esquema conocido como ***Classful***. 

> [!important] Los problemas de *Classful*
> 1.  **Falta de direcciones IP:** al principio unos pocos pidieron muchas IPs.
> 2.  **Crecimiento de las tablas de ruteo:** el router tenía una lista cada vez más grande para saber a qué red mandar un paquete. 

Existen tres clases principales:

- **Clase A:** pocas redes, cada una con muchos computadores.
- **Clase B:** un número medio de redes, con un número medio de computadores cada una.
- **Clase C:** muchas redes, cada una con pocos computadores.

Las clases D y E están reservadas para fines experimentales y de multidifusión, respectivamente.

![[clases.png]]

> [!important] Identificar la clase por el primer octeto
> La ubicación del **primer bit en cero** determina la clase de red (A, B o C).
> - **Clase A:** empieza con 0 binario. El primer octeto va de 1 a 126 (0 y 127 están reservados).
> - **Clase B:** empieza con 10. Primer octeto entre 128 y 191.
> - **Clase C:** empieza con 110. Primer octeto entre 192 y 223. 

> [!question] ¿Cuántas redes y host puede tener cada clase?
> Para la cantidad de redes se toman la cantidad de bits correspondientes de red y se le restan los bits fijos por clase. La cantidad de *host* corresponde a su cantidad de bytes asignados.
> - **Clase A:** $2^{8-1} = 128$ redes, $2^{24}$ *hosts*.
> - **Clase B:**  $2^{16-2} = 16.384$ redes, $2^{16}$ *hosts*.
> - **Clase C:**  $2^{24-3} = 2.097.152$ redes, $2^8 = 256$ *hosts*.

## Redes privadas

Inicialmente todas las asignaciones de direcciones fueron **públicas** (como un número de teléfono, único en el mundo). Rápidamente surgieron problemas: no todos los equipos se conectan directamente a Internet, no todos se conectan a Internet, y podrían faltar direcciones IPv4. Esto llevó a definir direcciones **privadas** lo que le dio mas tiempo de vida a IPv4.

> [!important] Público vs. Privado
> - **IP pública:** se asigna a cualquier dispositivo que se conecta **directamente** a Internet (ej. el *router* de casa, un servidor web). Es visible desde Internet.
> - **IP privada:** se asigna a cada dispositivo dentro de una red privada/doméstica (el *router*/módem la asigna). No es accesible desde Internet y no cambia salvo asignación manual. Varios dispositivos de una red **comparten la misma IP pública**.

![[modem.png|500]]

> [!tip] Analogía con los teléfonos
> Como los números de teléfono internos de una empresa: hay un teléfono *con* número público al que se puede llamar desde la red telefónica, pero puertas adentro los internos son privados, y hasta pueden repetirse entre distintas empresas.

![[telefono.png|500]]

Dado el **RFC 1918**, la Autoridad de Números Asignados en Internet ([[02 - Organizacion de Internet|IANA]]) reservo los tres siguientes bloques de direcciones IP para el uso en internets privadas:

| Inicio de rango | Fin de rango        | Prefijo    | Bloque de | Clase privada   |
| --------------- | ------------------- | ---------- | --------- | --------------- |
| **10**.0.0.0    | **10**.255.255.255  | 10/8       | 24 bits   | Clase A privada |
| **172**.16.0.0  | **172**.31.255.255  | 172.16/12  | 20 bits   | Clase B privada |
| **192.168**.0.0 | **192.168**.255.255 | 192.168/16 | 16 bits   | Clase C privada |

> [!warning] Confusión con las máscaras
> La IP privada de clase B **no es /16**, sino **/12** y la de clase C **no es /24**, sino **/16**. Esto es así porque una sola red de cada clase resulta en un rango privado pequeño, por lo tanto, se reservaron 16 redes clase B y 256 redes clase C.
> 
> El prefijo privado no describe "una red de esa clase", describe **cuántas redes de esa clase entran en el bloque reservado**. Cuanto más chica es la red individual de esa clase (clase C tiene solo 256 hosts), más redes hace falta agrupar para que el bloque privado sea **útil** en la práctica

Una organización que decida usar direcciones IPs privadas puede hacerlo sin tener que coordinarse con la IANA o con un registro de Internet. De esta manera el mismo espacio de direcciones puede ser usado por muchas organizaciones y sólo serán únicas dentro de ella.

> [!question] ¿A qué corresponde el rango 169.254.0.0 – 169.254.255.255 y dónde se podría ver?
>  No es un rango que "usa" nadie a propósito de forma permanente, es la señal de que **el mecanismo normal de asignación de IP ([[10 - DHCP|DHCP]]) no funcionó**, y el sistema operativo activó su plan de emergencia (IPv4LL) para no quedarse sin dirección alguna.

### Redes privadas para proveedores ISP

Existe un espacio de direcciones compartido para las comunicaciones entre un proveedor de servicios y sus suscriptores, cuando se usa un NAT de nivel de operador: **100.64.0.0/10** (que abarca desde 100.64.0.0 hasta 100.127.255.255). Al ser una dirección /10, tiene 22 bits para direcciones IP en cada subred ($2^{10}=1024$ subredes posibles, cada una con $2^{22}=4.194.304$ direcciones).

## Pros y Contras de Direcciones Privadas

**Ventajas:**
- Conserva el espacio de direcciones globalmente único, al no requerir unicidad global donde no hace falta.
- Da flexibilidad de diseño de red (más espacio de direcciones disponible que el que se obtendría del pool público).
- Permite esquemas de direccionamiento administrativamente convenientes y caminos de crecimiento más fáciles.
- Es una opción segura para empresas que aún no se conectaron a Internet y usaron IPs sin asignación de IANA, evitando choques al conectarse después.

**Desventajas:**
- Puede reducir la flexibilidad de una empresa para acceder a Internet, requiriendo mecanismos adicionales: [[10 - DHCP|DHCP]], mapeo de puertos, [[NAT]], [[PAT]], Port Forwarding, etc.

---
**Volver a:** [[05 - Fragmentacion|Fragmentación y reensamblado]]

**Continuar a:** [[07 - ARP|ARP]]
