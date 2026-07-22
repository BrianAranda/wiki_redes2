---
title: Herramientas y Ejemplos Prácticos
---
## ping6

DNS de Google IPv4: `8.8.8.8` como servidor principal y `8.8.4.4` como el secundario.
DNS de Google IPv6: `2001:4860:4860::8888` como servidor principal y `2001:4860:4860::8844` como el secundario.

Se puede usar `ping6` o `ping -6` desde la terminal de Linux.

`ping` usa el datagrama obligatorio `ECHO_REQUEST` del protocolo ICMP para obtener una respuesta `ICMP ECHO_RESPONSE` de un host o gateway. `ping` funciona tanto con IPv4 como con IPv6; forzar el uso de una sola de ellas se puede hacer especificando `-4` o `-6`.

`ping` también puede enviar *IPv6 Node Information Queries* ([RFC 4620](https://www.rfc-editor.org/rfc/rfc4620)). Los saltos intermedios pueden no estar permitidos, porque el enrutamiento de origen (*source routing*) de IPv6 fue declarado obsoleto ([RFC 5095](https://www.rfc-editor.org/rfc/rfc5095)).

> [!note] Nota histórica
> A partir de la versión `s20150815` de `iputils`, el binario `ping6` ya no existe: fue fusionado dentro de `ping`. Crear un enlace simbólico llamado `ping6` que apunte a `ping` da la misma funcionalidad que antes.

### Opciones más relevantes

| Opción | Descripción |
| --- | --- |
| `-4` | Usar solo IPv4. |
| `-6` | Usar solo IPv6. |
| `-c count` | Detener después de enviar `count` paquetes `ECHO_REQUEST`. |
| `-i interval` | Esperar `interval` segundos entre el envío de cada paquete (por defecto 1 segundo). |
| `-I interface` | Interfaz de origen: puede ser una dirección, un nombre de interfaz o un nombre de VRF. Para IPv6, al hacer ping a una dirección de alcance link-local, se puede usar la notación `%` en el destino, o esta opción, para indicar la interfaz. |
| `-n` | Salida solo numérica; no intenta resolver nombres simbólicos para las direcciones de host. |
| `-q` | Salida silenciosa (*quiet*). No se muestra nada excepto las líneas de resumen al inicio y al finalizar. |
| `-s packetsize` | Especifica el número de bytes de datos a enviar. Por defecto 56, que se traduce en 64 bytes de datos ICMP al sumar los 8 bytes de la cabecera ICMP. |
| `-t ttl` | (solo ping) Establece el Time to Live IP. |
| `-w deadline` | Especifica un tiempo límite, en segundos, antes de que `ping` finalice sin importar cuántos paquetes se hayan enviado o recibido. |
| `-W timeout` | Tiempo a esperar por una respuesta, en segundos. |
| `-f` | Flood ping: por cada `ECHO_REQUEST` enviado se imprime un `.`, y por cada `ECHO_REPLY` recibido se imprime un backspace. Solo el superusuario puede usar esta opción con intervalo cero. |
| `-a` | Ping audible. |
| `-b` | Permite hacer ping a una dirección de broadcast. |
| `-R` | (solo ping) Incluye la opción `RECORD_ROUTE` en el paquete `ECHO_REQUEST` y muestra el buffer de ruta en los paquetes devueltos. |

### Uso para diagnóstico

Cuando se usa `ping` para aislar fallas, primero debería ejecutarse en el host local, para verificar que la interfaz de red local está activa y funcionando. Luego, se debe hacer ping a hosts y gateways cada vez más lejanos. Se calculan los tiempos de ida y vuelta (*round-trip*) y las estadísticas de pérdida de paquetes.

Si se reciben paquetes duplicados, no se incluyen en el cálculo de pérdida de paquetes, aunque el tiempo de ida y vuelta de estos paquetes sí se usa al calcular los números de tiempo mínimo/promedio/máximo/mdev.

**Desviación estándar poblacional (mdev):** esencialmente un promedio de cuán lejos está cada RTT de ping de la media. Cuanto más alto es mdev, más variable es el RTT (a lo largo del tiempo). Con una alta variabilidad de RTT, se tendrán problemas de velocidad en transferencias masivas (tomarán más tiempo del estrictamente necesario, ya que la variabilidad eventualmente hará esperar por ACKs) y se tendrá una calidad de VoIP mediocre o pobre.

Cuando se ha enviado (y recibido) el número especificado de paquetes, o si el programa se termina con una señal `SIGINT`, se muestra un resumen breve. Si `ping` no recibe ningún paquete de respuesta, termina con código 1. Si se especifican tanto el conteo de paquetes como el `deadline`, y se reciben menos paquetes que el conteo cuando se cumple el `deadline`, también termina con código 1. En cualquier otro error, termina con código 2. De lo contrario, termina con código 0. Esto permite usar el código de salida para ver si un host está vivo o no.

> [!warning] Uso responsable
> Este programa está pensado para pruebas, medición y gestión de red. Debido a la carga que puede imponer en la red, no es recomendable usar `ping` durante operaciones normales o desde scripts automatizados.

## Ejemplo de Cálculo de Red

### Consigna

Supongamos que el Internet Service Provider nos da la IPv6 Unicast Global siguiente: `2001:db8:cad::/48`.

Escribir las direcciones necesarias para la Red, Sub Red y de Interfaces de la LAN.

### Resolución

El prefijo de Red me permite saber qué parte de la dirección será utilizada para Red.

| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 2001 | 0db8 | 0cad | 0000 | 000 | 0000 | 0000 | 0000 |

Si escribimos según la regla [[04 - Unicast#Global Unicast Address (GUA)|3-1-4]] se vería:

- **3** → `2001:0db8:0cad` — 48 bits para RED.
- **1** → `0000` — 16 bits para Subred.
- **4** → `0000:0000:0000:0000` — 64 bits para ID de Interfaces.

Tomemos una como ID de Interfaz `:0000:0000:0000:0009` a modo de ejemplo:

- La IPv6 Unicast Global para una interfaz sería: **`2001:db8:cad::9/64`**
- Dirección de Loopback: **`::1/128`**
- Dirección de local link: **`fe80::9/64`**
- Dirección Unicast sin especificar: **`::/128`** (todos ceros)

## Ejemplo de reglas de Simplificación

Repaso aplicado de las [[03 - Direcciones IPv6#Representación de Direcciones|reglas de compresión]] vistas antes (omitir ceros a la izquierda de cada campo, y reemplazar la secuencia más larga de campos en cero por `::`, una única vez):

![[ejemplo-reglas-simplificacion.png]]

| Dirección original | Dirección comprimida |
| --- | --- |
| `fe80:0000:0000:0000:7895:0eff:fe51:d7f4/64` | `fe80::7895:eff:fe51:d7f4/64` |
| `1230:0000:0000:4561:7ac5:000f:ae51:bff4/64` | `1230::4561:7ac5:f:ae51:bff4/64` |
| `ce93:0000:0eff:0000:7000:0000:0000:a5f1/64` | `ce93:0000:eff:0000:7000::a5f1/64` |
| `fe80:0000:0000:0000:5c6e:dfff:fe74:b0a1/50` | `fe80::5c6e:dfff:fe74:b0a1/50` |

---
**Volver a:** [[09 - Migracion IPv4 a IPv6|Migración IPv4 a IPv6]]

**Continuar a:** [[11 - Complementos|Complementos]]
