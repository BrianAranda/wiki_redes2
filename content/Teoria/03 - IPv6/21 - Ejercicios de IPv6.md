---
title: Ejercicios de IPv6
---
## 1) Identificar según tipo las siguientes direcciones IPv6

1. `0000:00AA:ABCD:0000:A1B2:EEEE:1111:2222`
2. `FE80:0001:0000:FEAD:0005:5555:87AC:3CE1`
3. `2018:000A:DDED:4444:FF5E:00FE:0000:1245`
4. `FE80:0000:0000:0000:0005:4175:BBBB:0101`
5. `000F:0000:0000:0000:0000:AAAA:BBBB:CCCC`
6. `0FFF:0000:0000:FFFF:0000:1111:DCBA:0001`
7. `FFF1:0000:A000:B000:C000:D000:E000:F000`

## 2) Identificar cuáles de las direcciones IPv6 son correctas

1. `FE80::CAFE`
2. `4F00::0A01:1`
3. `::1`
4. `FE80::AC04::0012`
5. `2001:DB8:1:ACAD::FE55:0:0001`
6. `FEAA:0001:0:1:FFEA:1001:000E`
7. `2001:101::ABC0`

## 3) Comprimir las siguientes direcciones IPv6

1. `FE80:0001:0000:FEAD:0500:5555:87AC:3CE1`
2. `0000:0001:0000:0000:A000:0002:1111:BA01`
3. `2001:0DB8:0004:ACAD:0000:0000:FE00:0002`
4. `2001:0030:0001:ACAD:0000:330E:10C2:32BF`
5. `FE80:0000:0000:0001:0000:60BB:008E:7402`

## 4) Obtener información a partir del prefijo de red de la siguiente dirección IPv6

`2000:1111:aaaa:0:50a5:8a35:a5bb:66e1/64`

### Resolución

De izquierda a derecha, la porción de red de una dirección IPv6 unicast global tiene una estructura jerárquica que proporcionará la siguiente información:

1. **Número de enrutamiento global de IANA** (los tres primeros bits binarios se fijan en `001`): `200::/12`
2. **Prefijo del registro regional de Internet (RIR)** (bits del /12 al /23): `2001:0D::/23` (el carácter D hexadecimal es 1101 en sistema binario. Los bits del 21 al 23 son 110, y el último bit es parte del prefijo del ISP).
3. **Prefijo del proveedor de servicios de Internet (ISP)** (bits hasta el /32): `2001:0DB8::/32`
4. **Prefijo de sitio o agregador de nivel de sitio (SLA)**, que el ISP asigna al cliente (bits hasta el /48): `2001:0DB8:0001::/48`
5. **Prefijo de subred** (asignado por el cliente; bits hasta el /64): `2001:0DB8:0001:ACAD::/64`
6. **ID de interfaz** (el host se identifica por los últimos 64 bits en la dirección): `2001:DB8:0001:ACAD:8D4F:4F4D:3237:95E2/64`

---
**Volver a:** [[20 - Videos|Videos]]

**Continuar a:** [[22 - Preguntas y Respuestas|Preguntas y Respuestas]]
