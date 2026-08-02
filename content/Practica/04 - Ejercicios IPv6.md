---
title: Ejercicios IPv6
---
> Ver los temas de [[03 - Direcciones IPv6|Direcciones IPv6]], [[04 - Unicast|Unicast]], [[05 - Anycast y Multicast|Anycast y Multicast]]

## Ejercicio 1 

Identificar según tipo las siguientes direcciones IPv6:

> [!example]- Como resolver
> Se identifica el tipo comparando el prefijo (los primeros bits/*nibbles*) contra los rangos reservados por la IANA/IETF:
> 1. **`2000::/3`** (primer *nibble* `2` o `3`) → **Global Unicast (GUA)**.
> 2. **`FE80::/10`** (arranca `FE8`) → **Link-Local Unicast**.
> 3. **`FC00::/7`** (arranca `FC` o `FD`) → **Unique Local (ULA)**.
> 4. **`FF00::/8`** (primer byte `FF`) → **Multicast**.
> 5. **`::`** (todos los bits en cero) → **Unspecified**; **`::1`** → **Loopback**.
> 6. Cualquier otro prefijo (por ejemplo, arrancando en `0`, `1`, o entre `4` y `D`) no cae en ninguno de los rangos anteriores → **reservada por el IETF para uso futuro**, no es Global Unicast aunque no empiece con `FE`/`FF`/`FC`/`FD`.

> [!success]- 0000:00AA:ABCD:0000:A1B2:EEEE:1111:2222
> Con el primer hexteto en `0000`: 
> - Primer byte `00`. 
> - No arranca con `2`/`3` (no es GUA), ni `FE8`, ni `FC`/`FD`, ni `FF`. 
> - No es la dirección _unspecified_ `::` porque no todos los bits son cero.
> - Cae en el bloque `0000::/8` por lo que es **reservada**.

> [!success]- FE80:0001:0000:FEAD:0005:5555:87AC:3CE1
> Primer hexteto en `FE80`, cae dentro de `FE80::/10` por lo que es ***LinkLocal Unicast***.

> [!success]- 2018:000A:DDED:4444:FF5E:00FE:0000:1245
>  Por el primer nibble `2`, cae dentro de `2000::/3` por lo que es ***Global Unicast* (GUA).**

> [!success]- FE80:0000:0000:0000:0005:4175:BBBB:0101
> Por el primer hexteto `FE80` es ***Link Local Unicast***.

> [!success]- 000F:0000:0000:0000:0000:AAAA:BBBB:CCCC
> Al igual que la primer dirección es **reservada**.

> [!success]- 0FFF:0000:0000:FFFF:0000:1111:DCBA:0001
> Primeros tres bits 0 entonces es **reservada**.

> [!success]- FFF1:0000:A000:B000:C000:D000:E000:F000
> El primer byte `FF`, cae dentro de `FF00::/8` entonces es ***Multicast***.

## Ejercicio 2

Identificar cuáles de las direcciones IPv6 son correctas:

> [!example]- Como resolver
> Debe respetar las reglas de escritura de una dirección IPv6. Las reglas a chequear son:
> 1. **8 grupos de 16 bits** (4 dígitos hexadecimales cada uno, ceros a la izquierda opcionales), separados por `:`.
> 2. **`::` aparece como máximo UNA vez** en toda la dirección, porque representa "uno o más grupos de ceros", y si aparece dos veces sería ambiguo cuántos ceros va cada una.
> 3. Si **no hay `::`**, tienen que estar los **8 grupos completos explícitos**, no se puede omitir ninguno sin compresión.
> 4. Cada grupo debe tener entre 1 y 4 dígitos hexadecimales válidos (`0-9`, `A-F`).

> [!success]- FE80::CAFE
> Es correcta, no incumple ninguna regla de escritura.

> [!success]- 4F00::0A01:1
> Tres grupos explícitos y los demás simplificados, es correcto.

> [!success]- ::1
> Un grupo explícito y una simplificación `::` es correcto.

> [!success]- FE80::AC04::0012
> Aparece la simplificación `::` dos veces, es ambiguo, por lo que es incorrecto.

> [!success]- 2001:DB8:1:ACAD::FE55:0:0001
> 7 grupos específicos y una simplificación, es correcta.

> [!success]- FEAA:0001:0:1:FFEA:1001:000E
> 7 grupos definidos y ninguna simplificación, no es correcta.

> [!success]- 2001:101::ABC0
> Tres grupos explícitos y una simplificación `::` es correcta. 

## Ejercicio 3 

Comprimir las siguientes direcciones IPv6:

> [!example]- Como resolver
> Para comprimir una dirección IPv6 se aplican dos reglas, en este orden:
> 1. **Quitar ceros a la izquierda dentro de cada grupo** (cada grupo de 16 bits se puede escribir con menos de 4 dígitos). Ej: `0500` → `500`, `0001` → `1`. Un grupo que es enteramente cero (`0000`) queda como un solo `0`, salvo que se use la regla 2 sobre él.
> 2. **Reemplazar la secuencia más larga de uno o más grupos consecutivos en cero por `::`**, una única vez en toda la dirección.
>     - Si hay dos secuencias de igual longitud, se comprime la que aparece primero (más a la izquierda).
>     - Una secuencia de **un solo** grupo en cero normalmente **no conviene comprimirla** con `::` (se dejaría como `0` simple), porque `::` está pensado para ahorrar espacio en secuencias más largas y usarlo en un único grupo no es un error pero no es la convención más common.
>     - `::` solo puede aparecer **una vez** en la dirección (si hay dos secuencias de ceros separadas, se comprime solo la más larga; la otra se deja como `0` o `00...0` explícito).

> [!success]- FE80:0001:0000:FEAD:0500:5555:87AC:3CE1
> $$
> FE80 \quad \cancel{000}1 \quad \cancel{000}0 \quad FEAD \quad \cancel{0}500 \quad 5555 \quad 87AC \quad 3CE1
> $$
> $$
> \boxed{FE80 \quad 1 \quad 0 \quad FEAD \quad 500 \quad 5555 \quad 87AC \quad 3CE1}
> $$

> [!success]- 0000:0001:0000:0000:A000:0002:1111:BA01
> $$
> \cancel{000}0 \quad \cancel{000}1 \quad \left[0000 \quad 0000\right] \quad A000 \quad \cancel{000}2 \quad 1111 \quad BA01
> $$
> $$
> \boxed{0 \quad 1 \quad :: \quad A000 \quad 2 \quad 1111 \quad BA01}
> $$

> [!success]- 2001:0DB8:0004:ACAD:0000:0000:FE00:0002
> $$
> 2001 \quad \cancel{0}DB8 \quad \cancel{000}4 \quad ACAD \quad [0000 \quad 0000] \quad FE00 \quad \cancel{000}2
> $$
> $$
> \boxed{2001 \quad DB8 \quad 4 \quad ACAD \quad :: \quad FE00 \quad 2}
> $$

> [!success]- 2001:0030:0001:ACAD:0000:330E:10C2:32BF
> $$
> 2001 \quad \cancel{00}30 \quad \cancel{000}1 \quad ACAD \quad \cancel{000}0 \quad 330E \quad 10C2 \quad 32BF
> $$
> $$
> \boxed{2001 \quad 30 \quad 1 \quad ACAD \quad 0 \quad 330E \quad 10C2 \quad 32BF}
> $$

> [!success]- FE80:0000:0000:0001:0000:60BB:008E:7402
> $$
> FE80 \quad [0000 \quad 0000] \quad \cancel{000}1 \quad \cancel{000}0 \quad 60BB \quad \cancel{00}8E \quad 7402
> $$
> $$
> \boxed{FE80 \quad :: \quad 1 \quad 0 \quad 60BB \quad 8E \quad 7402}
> $$

## Ejercicio 4 

Obtener información a partir del prefijo de red de la siguiente dirección IPv6:

> [!example]- Como resolver
> El prefijo de red de una GUA se interpreta con la **regla 3-1-4**:
> - Los primeros **3 hextetos** (48 bits) son el ***Global Routing Prefix*** que asigna el ISP.
> - El **1 hexteto** siguiente (16 bits) es el ***Subnet ID*** que asigna el sitio/cliente.
> - Los últimos **4 hextetos** (64 bits) son el ***Interface ID*** que identifica al host.
> 
> Con longitud de prefijo `/64`, el límite entre "red" e "interfaz" cae justo entre el 4to y 5to hexteto: los primeros 4 hextetos (*Global Routing Prefix* + *Subnet* ID) son la porción de red, y los últimos 4 son el *Interface* ID.

> [!success]- 2000:1111:AAAA:0:50A5:8A35:A5BB:66E1/64
> Dividiendo según la regla 3-1-4:
> $$
> 2000 \quad 1111 \quad AAAA \qquad 0 \qquad 50A5 \quad 8A35 \quad A5BB \quad 66E1 \quad /64
> $$
> - **Global Routing Prefix** (3 hextetos, asignado por el ISP): `2000:1111:AAAA::/48`
> - **Subnet ID** (1 hexteto, asignado por el sitio): `0` → junto con el Global Routing Prefix forma el prefijo de red completo: `2000:1111:AAAA:0::/64`
> - **Interface ID** (últimos 4 hextetos, identifica al *host*): `50A5:8A35:A5BB:66E1`
