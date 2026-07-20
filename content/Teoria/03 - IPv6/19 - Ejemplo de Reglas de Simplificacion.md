---
title: Ejemplo de reglas de Simplificación
---
Repaso aplicado de las [[06 - Representacion de Direcciones|reglas de compresión]] vistas antes (omitir ceros a la izquierda de cada campo, y reemplazar la secuencia más larga de campos en cero por `::`, una única vez):

![[ejemplo-reglas-simplificacion.png]]

| Dirección original | Dirección comprimida |
| --- | --- |
| `fe80:0000:0000:0000:7895:0eff:fe51:d7f4/64` | `fe80::7895:eff:fe51:d7f4/64` |
| `1230:0000:0000:4561:7ac5:000f:ae51:bff4/64` | `1230::4561:7ac5:f:ae51:bff4/64` |
| `ce93:0000:0eff:0000:7000:0000:0000:a5f1/64` | `ce93:0000:eff:0000:7000::a5f1/64` |
| `fe80:0000:0000:0000:5c6e:dfff:fe74:b0a1/50` | `fe80::5c6e:dfff:fe74:b0a1/50` |

---
**Volver a:** [[18 - Ejemplo de Calculo de Red|Ejemplo de Cálculo de Red]]

**Continuar a:** [[20 - Videos|Videos]]
