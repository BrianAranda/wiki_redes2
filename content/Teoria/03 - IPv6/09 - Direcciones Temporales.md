---
title: Direcciones Temporales
---
Una dirección temporal en IPv6 es una dirección generada de manera **aleatoria** y **cambiada periódicamente** para mejorar la privacidad del usuario. Se utiliza en dispositivos que se conectan a Internet para evitar el rastreo de la dirección IP fija por parte de sitios web o servicios en línea.

El uso de direcciones temporales es opcional y configurable pero están habilitadas por defecto. Tienen una vida útil corta, normalmente horas o días y es común tener varias para asegurarse de que las conexiones existentes puedan continuar mientras se crea una nueva.

> [!tip] ¿Cuándo usar direcciones temporales?
> Es útil en dispositivos personales para proteger la privacidad al navegar en Internet.
> 
> No recomendable para servidores o dispositivos que necesitan direcciones estáticas para funcionar, como impresoras, *routers* o servidores web.

Objetivos principales de las direcciones temporales en IPv6:

1. **Mejorar la privacidad:** al cambiar frecuentemente, dificulta que terceros rastreen la actividad de un dispositivo en la red.
2. **Evitar identificación a largo plazo:** a diferencia de las direcciones EUI-64 (basadas en la MAC del dispositivo), las temporales no revelan información del hardware.
3. **Seguridad contra ataques de seguimiento:** algunos atacantes pueden usar direcciones IPv6 estáticas para crear perfiles de actividad de usuarios.

Se generan utilizando el mecanismo de privacidad definido en el RFC 8981 (antes RFC 4941):

1. **Obtención del prefijo IPv6:** el dispositivo recibe un prefijo de red mediante SLAAC o DHCPv6.
2. **Generación del identificador de interfaz aleatorio:** se usa un número aleatorio para generar la parte del *host* y cambia cada cierto tiempo.
3. **Asignación y uso de la dirección temporal:** se usa para conexiones salientes y se mantiene activa solo por un tiempo definido antes de generar una nueva.
4. **Eliminación de direcciones viejas:** cuando se genera una nueva dirección temporal, la anterior se marca como "*deprecated*" y deja de usarse en nuevas conexiones, pero sigue funcionando hasta que las conexiones activas finalicen.

## Tiempos de vida

> Esta sección es meramente informativa

Las direcciones IPv6 tienen distintos tiempos de vida; el tratamiento en profundidad de este tema escapa a la materia y se puede profundizar en el [RFC 4862](https://www.rfc-editor.org/rfc/rfc4862).

- **Direcciones tentativas:** las que están en proceso de verificación.
- **Dirección preferida:** se verificó que la dirección es única.
- **Dirección en desuso (*deprecated*):** la dirección todavía es válida pero no lo será en el futuro.
- **Dirección válida:** la dirección es una dirección preferida o en desuso.
- **Dirección inválida:** una dirección que se volvió inválida al terminar su vida útil.

![[tiempodevida.png|600]]

- **Vida útil preferida:** este es el período de tiempo en el que se prefiere una dirección válida hasta que queda obsoleta. Cuando expira la dirección pasa a ser obsoleta.
- **Vida útil válida:** este es el período de tiempo que una dirección permanece en el estado válido. Debe ser mayor o igual a la vida preferida. Cuando expira la dirección deja de ser válida.

> [!tip] "Forever" no es tan literal
> Las IPv6 que no son temporales aparecen con la etiqueta `forever`, esto no quiere decir que sean para siempre. A modo de ejemplo, dos capturas del mismo host `ip -6 addr show` en momentos distintos muestran que la Link-Local (`fe80::.../64`) es "forever" pero cambia entre una captura y otra, por el principio de *Privacy Extensions for* SLAAC.

---
**Volver a:** [[08 - Neighbor Discovery|Neighbor Discovery ND]]

**Continuar a:** [[10 - Direcciones Dinamicas|Direcciones Dinámicas]]
