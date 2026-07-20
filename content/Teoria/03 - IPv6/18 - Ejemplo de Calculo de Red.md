---
title: Ejemplo de Cálculo de Red
---
## Consigna

Supongamos que el Internet Service Provider nos da la IPv6 Unicast Global siguiente: `2001:db8:cad::/48`.

Escribir las direcciones necesarias para la Red, Sub Red y de Interfaces de la LAN.

## Resolución

El prefijo de Red me permite saber qué parte de la dirección será utilizada para Red.

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2001 | 0db8 | 0cad | 0000 | 000 | 0000 | 0000 | 0000 |

Si escribimos según la regla [[09 - Unicast#9.1. Global Unicast Address (GUA)|3-1-4]] se vería:

- **3** → `2001:0db8:0cad` — 48 bits para RED.
- **1** → `0000` — 16 bits para Subred.
- **4** → `0000:0000:0000:0000` — 64 bits para ID de Interfaces.

Tomemos una como ID de Interfaz `:0000:0000:0000:0009` a modo de ejemplo:

- La IPv6 Unicast Global para una interfaz sería: **`2001:db8:cad::9/64`**
- Dirección de Loopback: **`::1/128`**
- Dirección de local link: **`fe80::9/64`**
- Dirección Unicast sin especificar: **`::/128`** (todos ceros)

---
**Volver a:** [[17 - ping6|ping6]]

**Continuar a:** [[19 - Ejemplo de Reglas de Simplificacion|Ejemplo de Reglas de Simplificación]]
