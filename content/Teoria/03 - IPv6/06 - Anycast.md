---
title: Anycast
---
Una dirección *anycast* de IPv6 es una dirección que se asigna a **más de una interfaz** (que suelen pertenecer a nodos diferentes), con la propiedad de que un paquete enviado a una dirección *anycast* se enruta a la interfaz **más cercana** que tenga esa dirección, según la medida de distancia establecida por los protocolos de enrutamiento.

![[anycast.png|500]]

Las direcciones *anycast* se asignan a partir del espacio de direcciones *unicast*, utilizando cualquiera de sus formatos. Por lo tanto, las direcciones de *anycast* son sintácticamente indistinguibles de las direcciones de unidifusión. Cuando una dirección de unidifusión se asigna a más de una interfaz, convirtiéndola así en una dirección de *anycast*, los nodos a los que se asigna la dirección deben configurarse explícitamente para que sepan que se trata de una dirección de *anycast*.

La dirección *anycast* **del enrutador** de subred está predefinida y su formato es el siguiente:

```
|                      n bits                    |   128-n bits   |
+------------------------------------------------+----------------+
|                   subnet prefix                | 00000000000000 |
+------------------------------------------------+----------------+
```

El `subnet prefix` de una dirección *anycast* es el prefijo que identifica un enlace específico. Esta dirección es sintácticamente idéntica a una dirección *unicast* de una interfaz del enlace con el *interface* ID establecido en cero.

Los paquetes enviados a la dirección de *anycast* *Subnet-Router* se entregarán a un *router* de la subred. Todos los *routers* deben ser compatibles con las direcciones de *anycast* *Subnet-Router* de las subredes a las que tienen interfaces. Esta dirección está pensada para utilizarse en aplicaciones en las que un nodo necesita comunicarse con cualquiera de los *routers* del conjunto.

> [!important] Beneficios de las direcciones *anycast*
> - **Redundancia:** el servicio no depende de un único servidor, de modo que si un equipo falla, los demás asumen sus funciones y el servicio sigue disponible.
> - **Balanceo de carga:** los distintos servidores se reparten el trabajo de modo que no haya un equipo sobrecargado (con la consiguiente merma de rendimiento) y otro inactivo.
> - **Eficiencia:** simplifica la búsqueda del servidor más apropiado (suele ser el más cercano).

> [!info]- Uso típico: DNS
> Los servidores de [[DNS]] usan este método, para ubicar el servidor de DNS más cercano a donde lo solicitan. El emisor no tiene control sobre la interfaz de destino, así que el/los *routers* toman la decisión del destino.

## IPv6 necesarias

### En *hosts*

1. Dirección GUA.
2. Dirección ULA.
3. Dirección LLA para cada interfaz
4. Dirección de *Loopback*.
5. Dirección de *Multicast* de todos los nodos.
6. Dirección de *Multicast* de todos los *routers*.

### En *routers*

1. Dirección GUA.
2. Dirección LLA para cada interfaz
3. Dirección de *Loopback*.
4. Dirección de *Multicast* de todos los nodos.
5. Dirección de *Multicast* de todos los *routers*.

A modo de resumen final tenemos:

![[resumen_direcciones.png|700]]

---
**Volver a:** [[05 - Multicast|Multicast]]

**Continuar a:** [[07 - ICMPv6|ICMPv6]]
