---
title: Prefijos de Direcciones
---
Los prefijos de IPv6 son similares a los de IPv4.

Un prefijo se representa: `ipv6-address/prefix-length`, donde:

- **ipv6-address:** es la notación de IPv6.
- **prefix-length:** valores decimales de bits contiguos a la izquierda que componen el prefijo.

**Ejemplo:**
- `12AB:0000:0000:CD30:0000:0000:0000:0000/60`
- `12AB::CD30:0:0:0:0/60` (alternativa 1)
- `12AB:0:0:CD30::/60` (alternativa 2)

**Ejemplos NO válidos:**
- `12AB:0:0:CD3/60` → no puedo eliminar ceros finales
- `12AB::CD30/60` ⇒ `12AB:0000:0000:0000:0000:000:0000:CD30` → no puedo eliminar ceros finales
- `12AB::CD3/60` ⇒ `12AB:0000:0000:0000:0000:000:0000:0CD3` → no puedo eliminar ceros finales

---
**Volver a:** [[06 - Representacion de Direcciones|Representación de Direcciones]]

**Continuar a:** [[08 - Identificacion de Direcciones|Identificación de Direcciones]]
