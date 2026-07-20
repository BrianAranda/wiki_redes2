---
title: Anycast
---
- Se asignan a **MÁS DE UNA INTERFAZ**, típicamente de distintos nodos.
- Notar que la parte de "interface ID" son **CEROS** (no está asociada a una sola interfaz).
- Tienen la propiedad de que un paquete con esta dirección de anycast es dirigido a la interfaz **MÁS CERCANA**; para ello usan el "subnet prefix" que identifica un enlace o *link* específico.
- Los paquetes enviados a esa dirección IP se reenvían al servidor más cercano.
- Todos los enrutadores deben admitir las direcciones anycast de Subred-Router para las subredes a las que tienen interfaces.
- Son direcciones que se ubican en el espacio de direcciones de Unicast.
- Se usan para comunicarse con un grupo o conjunto de routers.

![[anycast-diagrama.png]]

> [!note] Nota del docente
> Podemos decir que Anycast sería un subconjunto de Unicast; la diferencia está en que la parte de "interface ID" son CEROS.

**Beneficios:**
- **Redundancia:** el servicio no depende de un único servidor, de modo que si un equipo falla, los demás asumen sus funciones y el servicio sigue disponible.
- **Balanceo de carga:** los distintos servidores se reparten el trabajo de modo que no haya un equipo sobrecargado (con la consiguiente merma de rendimiento) y otro inactivo.
- **Eficiencia:** la gran ventaja del "Anycasting" es que simplifica la búsqueda del servidor más apropiado (que suele ser el más cercano).

> [!info]- Uso típico: DNS
> Los servidores de [[DNS]] usan este método, para ubicar el servidor de DNS más cercano a donde lo solicitan.
>
> El emisor NO tiene control sobre la interfaz de destino (id de interfaz es cero), así que el/los routers toman la decisión del destino.

![[arbol-tipos-direcciones-anycast.png]]

La dirección anycast del enrutador de subred está predefinida. Su formato es como sigue:

```
|         n bits         |        128-n bits          |
+-------------------------+-----------------------------+
|      subnet prefix      |     00000000000000 (ceros)  |
+-------------------------+-----------------------------+
```

El prefijo de subred de esta dirección de anycast es un prefijo que identifica un link o enlace específico.

Notar que esta dirección anycast es sintácticamente lo mismo que una dirección de unidifusión para una interfaz en el enlace con el identificador de interfaz establecido en cero.

Los paquetes enviados a esta dirección van a ser distribuidos al router o a la subred. Todos los enrutadores deben admitir las Direcciones anycast de Subred-Router para las subredes a las que tienen interfaces.

> [!question] ¿Cuántas IPs se necesitan en IPv6 para un enlace punto a punto entre dos routers?
> La primer respuesta sería `/127`. Pero tomando en cuenta esta dirección de anycast de subred de router, vemos que debería ser `/126` (visto en [[09 - Unicast#9.3. Subnet ID|Subnet ID]]).

---
**Volver a:** [[09 - Unicast|Unicast]]

**Continuar a:** [[11 - Multicast FF02|Multicast FF02]]
