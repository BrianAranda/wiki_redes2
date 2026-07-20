---
title: Representación de Direcciones
---
Hay tres formas de representar una dirección de IPv6.

## 1. Forma preferida

`x:x:x:x:x:x:x:x` donde `x` es un valor de cuatro dígitos hexadecimales (0,1,2,3...8,9,A,B,C,D,E,F). Cada dígito hexadecimal tiene 4 bits ⇒ `x` tiene 4 valores hexadecimales ⇒ 16 bits (4×4).

Ejemplos:
- `FEDC:BA98:7654:3210:FEDC:BA98:7654:3210`
- `1080:0:0:0:8:800:200C:417A`

> [!note] Nota
> Tenga en cuenta que no es necesario escribir los **ceros iniciales** (a la izquierda) en un campo individual, pero debe haber al menos un número en cada campo (excepto el caso descrito a continuación).

## 2. Forma comprimida

En algunas direcciones de IPv6 pueden existir varios campos seguidos de ceros; se pueden **reemplazar por un solo `::`** (una única vez en toda la dirección):

- `1080:0:0:0:8:800:200C:417A` se escribe `1080::8:800:200C:417A` (a unicast address)
- `FF01:0:0:0:0:0:0:101` se escribe `FF01::101` (a multicast address)
- `0:0:0:0:0:0:0:1` se escribe `::1` (the loopback address)
- `0:0:0:0:0:0:0:0` se escribe `::` (unspecified addresses)

## 3. Forma alternativa (entornos mixtos IPv4/IPv6)

En entornos mixtos de IPv4 e IPv6, se suele usar una notación del siguiente tipo:

`x:x:x:x:x:x:d.d.d.d`

Donde las `x` son los valores hexadecimales de las seis partes de 16 bits de orden superior de la dirección, y las `d` son los valores decimales de las cuatro piezas de 8 bits de orden inferior de la dirección (representación IPv4 estándar).

Ejemplo:
- `0:0:0:0:0:0:13.1.68.3`
- `0:0:0:0:0:FFFF:129.144.52.38`

que en formato comprimido sería:
- `::13.1.68.3`
- `::FFFF:129.144.52.38`

## Direcciones IPv6 en URLs

> [!note] Nota
> Ver que en IPv6 se usa `:` (dos puntos); esto en IPv4 se correspondería con un puerto de TCP, por eso en algunas ocasiones al momento de presentar una dirección IPv6 (como una dirección en un navegador, por ejemplo) se la pone **entre corchetes** para evitar esa confusión.
>
> En una dirección URL, las direcciones IPv6 se muestran entre corchetes. Ejemplo:
> `http://[2001:0db8:83a3:08d3::0380:7344]/`
>
> Los números de los puertos se escriben detrás de los corchetes de cierre separados por dos puntos. Ejemplo:
> `http://[2001:0db8:83a3:08d3::0380:7344]:8080/`
>
> En algunas ocasiones se podría ver el signo de porcentaje (`%`), que se sigue utilizando para identificar la codificación de caracteres hexadecimales en las URL. Dentro de la URL, el signo de porcentaje se sustituirá por su propio código hexadecimal `%25` ([RFC 6874](https://www.rfc-editor.org/rfc/rfc6874)). Esto es necesario si se desea forzar la conexión a través de una interfaz específica.

![[winbox-conexion-link-local.png]]

---
**Volver a:** [[05 - IPv6 Addressing|IPv6 Addressing]]

**Continuar a:** [[07 - Prefijos de Direcciones|Prefijos de Direcciones]]
