---
title: Arquitectura de Direcciones IPv6
fuente: "[RFC 4291](https://www.rfc-editor.org/rfc/rfc4291) — IP Version 6 Addressing Architecture"
---
Este capítulo se basa en el **RFC 4291**, que trata sobre *IP Version 6 Addressing Architecture*. También se usaron imágenes e información de *"IPv6 Fundamentals: A Straightforward Approach to Understanding IPv6"*, Second Edition, autor Rick Graziani.

## Datagrama IPv6

![[datagrama-ipv6.png]]

- **128 bits** para direccionamiento.
- Cabecera base **simplificada**.
- Cabeceras de extensión (*Extension Headers*):
  - Son opcionales y puede haber varias.
  - Proveen información adicional.
  - Hay una cantidad limitada de Extension Headers.
  - Se ubican entre la cabecera IPv6 y la cabecera de la capa superior.
  - Tienen que estar declaradas en la cabecera anterior.
  - Son para el host destino.
  - Se deben procesar en orden.
- Identificación de flujo de datos (QoS).
- Mecanismos de **IPsec** incorporados al protocolo.
  - IPsec (*Internet Protocol security*) es un conjunto de protocolos cuya función es asegurar las comunicaciones sobre el Protocolo de Internet (IP) autenticando y/o cifrando cada paquete IP en un flujo de datos. IPsec también incluye protocolos para el establecimiento de claves de cifrado.
- **Fragmentación solo en origen** y re-ensamblado en destino.
- **No requiere el uso de NAT**, permitiendo conexiones punto a punto.
- Mecanismos que facilitan la configuración de las redes.

### Campos del datagrama

- **Versión (4 bits):** número de la versión del protocolo Internet; el valor es 6.
- **Clase de tráfico (8 bits):** disponible para su uso por el nodo origen y/o los dispositivos de encaminamiento para identificar y distinguir entre clases o prioridades de paquete IPv6.
- **Etiqueta de flujo (20 bits):** se puede utilizar por un computador para etiquetar aquellos paquetes para los que requiere un tratamiento especial en los dispositivos de encaminamiento dentro de la red. Sería algo como identificar el flujo que requiera una QoS para darle prioridad.
- **Longitud de la carga útil (16 bits):** longitud del resto del paquete IPv6 excluida la cabecera, en octetos. En otras palabras, representa la longitud de todas las cabeceras de extensión más los datos de la capa de transporte.
- **Cabecera siguiente (8 bits):** identifica el tipo de cabecera que sigue inmediatamente a la cabecera IPv6; se puede tratar tanto de una cabecera de extensión IPv6 como de una cabecera de la capa superior, como TCP o UDP.
- **Límite de saltos (8 bits):** número restante de saltos permitidos para este paquete. El límite de saltos se establece por la fuente a algún valor máximo deseado y se decrementa en 1 en cada nodo que reenvía el paquete. El paquete se descarta si el límite de saltos se hace cero. El consenso fue que el esfuerzo extra de contabilizar los intervalos de tiempo no añadía un valor significativo al protocolo; de hecho, y como regla general, los dispositivos de encaminamiento en IPv4 tratan el campo tiempo de vida como un límite de saltos.
- **Dirección origen (128 bits):** dirección del productor del paquete.
- **Dirección destino (128 bits):** dirección de destino deseado del paquete. Puede que este no sea en realidad el último destino deseado si está presente la cabecera de encaminamiento.

> [!note] Observación
> Notar que **NO existe FCS ni CRC**.

### Extension Headers (no figuran en la imagen del datagrama)

- Son opcionales y puede haber varios.
- Proveen información adicional.
- Hay una cantidad limitada de Extension Headers.
- Se ubican entre la cabecera IPv6 y la cabecera de la capa superior.
- Tienen que estar declaradas en la cabecera anterior.
- Son para el host destino.
- Se deben procesar en orden.
- **MTU mínimo de 1280 octetos** (¡importante!).
- Se recomienda mínimo 1500 octetos, para tunelizado con IPv4.
- IPv6 **no soporta fragmentación** en el camino.
- Si un enlace no puede transmitir 1280 octetos, debe encargarse de la fragmentación en una capa inferior.
- Carga útil máxima de 64KB. *Jumbo Payload option* (RFC 2675): 4GB.

### IPv4 vs IPv6: campos eliminados y renombrados

![[campos-eliminados-cambiados-ipv4-ipv6.png]]

> [!warning] En el datagrama IPv6 NO EXISTE
> - **Header Checksum.**
> - **ID de datagrama.**
>
> Al eliminar el checksum de la cabecera en IPv6, el router puede decrementar el "Hop Limit" y reenviar el paquete sin tener que realizar cálculos complejos, lo que resulta en un encaminamiento más rápido y eficiente.
> En IPv6 NO se fragmenta en el camino, por lo que no es necesario tener un ID de datagrama: cada datagrama es único.

| IPv6 | IPv4 |
| --- | --- |
| Largo mínimo del header del datagrama: 40 bytes (320 bits) | Largo mínimo del header del datagrama: 20 bytes (160 bits) |
| Campo de direcciones: 128 bits (4 x 32) | Campo de direcciones: 32 bits |
| 1er campo del datagrama es la Versión | 1er campo del datagrama es la Versión |
| Clase de Tráfico | Tipo de Tráfico (se utiliza muy poco) |
| Etiqueta de Flujo | — |
| Longitud de la Carga Útil | — |
| Cabecera Siguiente | — |
| Límite de Saltos | Tiempo de Vida |

## Próximo Header (informativo)

A modo informativo, se mencionan los posibles valores de la cabecera siguiente (*Next Header*):

| Valor decimal | Extensión |
| --- | --- |
| 0 | **Hop-by-Hop options:** permite añadir valores adicionales a tener en cuenta por los enrutadores |
| 60 | **Destinations Options for IPv6:** permite establecer opciones adicionales para el nodo destino |
| 43 | **Routing Header for IPv6:** establece opciones adicionales sobre el enrutamiento a aplicar en el paquete IP |
| 44 | **Fragment Header for IPv6:** el paquete IPv6 no pudo ser fragmentado por los enrutadores intermedios, pero el dispositivo que genera el paquete lo puede fragmentar |
| 51 | **Authentication Header:** similar a la que propone IPSEC para IPv4, pero en IPv6 ya está incluida dentro del mismo protocolo |
| 50 | **Encap Security Payload:** igual que la cabecera anterior, forma parte de IPSEC y en IPv6 está incluida dentro del protocolo |
| 6 | TCP |
| 17 | UDP |
| 58 | ICMP for IPv6 (se resalta porque es algo que se verá más adelante) |

## Cantidad de IPs por metro cuadrado

> [!note] Nota
> Vamos a asumir que el reparto "uniforme por área" es una suposición para el cálculo; en la práctica, la asignación de IPv6 no sigue un criterio geográfico "por metro cuadrado". Aun así, sirve para dimensionar la **enorme** magnitud de $2^{128}$.

Dado que el espacio de direcciones IPv6 tiene tamaño $2^{128}$, y asumiendo (solo para el ejercicio) que las direcciones se reparten uniformemente sobre la superficie de la Tierra:

- Radio de la Tierra: $R = 6.371\ km = 6.371.000\ m$
- Diámetro: $D \approx 12.742\ km$
- Superficie esférica: $A = 4\pi R^2$

**Se pide:**
1. Calcular cuántas direcciones IPv6 "tocarían" por cada metro cuadrado de la superficie terrestre.
2. Un edificio tiene 10 pisos y una planta rectangular de 10 m × 20 m. ¿Cuántas direcciones le "tocarían" al edificio completo (sumando todos los pisos)?
3. ¿Cuántas direcciones le "tocarían" a cada uno de los 10 pisos?

## Solución

**Paso 1: Superficie de la Tierra**

$$A = 4\pi R^2 = 4\pi(6.371.000\ m)^2 \approx 5{,}1006\times10^{14}\ m^2$$

**Paso 2: Direcciones IPv6 totales**

$$2^{128} \approx 3{,}4028\times10^{38}$$

1. **Direcciones por metro cuadrado:**
   $2^{128} / A = 3{,}4028\times10^{38} / 5{,}1006\times10^{14} \approx 6{,}671\times10^{23}$ direcciones/m²

2. **Edificio completo (10 pisos):**
   Área total = 10 pisos × (10×20 m²) = 2000 m²
   Direcciones = $6{,}671\times10^{23} \times 2000 \approx 1{,}334\times10^{27}$

3. **Cada piso (200 m²):**
   Direcciones = $6{,}671\times10^{23} \times 200 \approx 1{,}334\times10^{26}$

**Concluyendo:**
- Por m² de Tierra: ≈ $6{,}671\times10^{23}$
- Edificio completo (2000 m²): ≈ $1{,}334\times10^{27}$
- Cada piso (200 m²): ≈ $1{,}334\times10^{26}$

---
**Volver a:** [[03 - Solucion IPv6|Solución IPv6]]

**Continuar a:** [[05 - IPv6 Addressing|IPv6 Addressing]]
