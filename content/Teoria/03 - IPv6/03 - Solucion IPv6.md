---
title: Solución IPv6
---
Apenas en 1990, antes de que se comenzara a explotar comercialmente Internet, ya un grupo visionario vio el problema en el horizonte y se comenzaron a trabajar alternativas. Estas aparecieron en 1992.

1. En 1992 el IETF crea el Grupo **ROAD** (ROuting ADdressing) que comienza a estudiar posibles soluciones.
2. ✅ **CIDR** (RFC 4632): dejar de usar clases. *Classless Inter-Domain Routing* se introdujo en 1993 por el IETF y representa la última mejora. Su introducción permitió una mayor flexibilidad al dividir rangos de direcciones IP en redes separadas. De esta manera permitió:
   - Un uso más eficiente de las cada vez más escasas direcciones IPv4.
   - Un mayor uso de la jerarquía de direcciones (agregación de prefijos de red), disminuyendo la sobrecarga de los enrutadores principales de Internet para realizar el encaminamiento.
   - Bloques de direcciones de tamaño apropiado a las necesidades y usos.
   - Dirección de red = prefijo/longitud.
3. ✅ Agregación de rutas + DHCP:
   - NAT + RFC 1918 (ver [[06 - Direcciones IPv4#Redes privadas|Redes privadas]]).
   - En el año 1995 se comienza a usar NAT + CIDR, lo que permite usar una única dirección IP pública para toda una red. Sin embargo, el acceso y su implementación resultó **insuficiente** por sí sola para frenar el agotamiento.

> [!note] Observación de la cátedra
> Es indudable que las medidas de los puntos 2 y 3 fueron tan buenas que la tasa de sobrevida de IPv4 se extendió más allá de lo esperado; el problema de falta de direcciones se comenzó a tratar en 1990, apenas 9 años desde la implementación de IPv4 en 1980.

## Terminología

Se utiliza la siguiente terminología a lo largo de toda la unidad:

- **Router**: nodo que reenvía paquetes IP que no son para él mismo.
- **Host**: cualquier nodo que no es router.
- **Nodo**: dispositivo que implementa IP (router o host).
- **Enlace** (*link*): medio o facilidad que comunica a los nodos.
- **Interfase**: lo que usa el nodo para conectarse al enlace.

---
**Volver a:** [[02 - IoT|IoT]]

**Continuar a:** [[04 - Arquitectura Direcciones IPv6|Arquitectura de Direcciones IPv6]]
