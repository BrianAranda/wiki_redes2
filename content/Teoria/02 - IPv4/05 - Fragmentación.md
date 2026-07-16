---
title: Fragmentación y reensamblado
fuente:
  - https://www.rfc-es.org/rfc/rfc0791-es.txt
---
En IPv4, la fragmentación y el reensamblado permiten dividir un paquete IP grande en fragmentos más pequeños cuando debe atravesar redes con distinto MTU (*Maximum Transmission Unit*).

## Cuando ocurre

Ocurre cuando el datagrama se origina en una red local que permite un tamaño de paquete grande y debe atravesar una red local que limita los paquetes a un tamaño inferior para llegar a su destino. Cada enlace físico tiene un tamaño máximo de paquete que puede transportar:

| Enlace | MTU típica |
| --- | --- |
| Ethernet | 1500 bytes |
| PPPoE | 1492 bytes |
| Wi-Fi | 2304 bytes |

Si un paquete IP es más grande que el MTU del siguiente enlace, debe fragmentarse o si no será descartado, dado que no puede llegar a destino.

## Donde ocurre

Ocurre en algún punto del camino (en capa 3), donde el *router* determina que el MTU de la interfaz de salida es menor que el de la interfaz de entrada. Para lograrlo se modifican ciertos campos del datagrama.

### Campos implicados en el proceso

- El **ID** que identifica a qué datagrama original pertenece el fragmento, por lo tanto todos los fragmentos del mismo paquete tienen el mismo valor.
- Las ***Flags*** (DF y MF respectivamente) que indican si es posible fragmentar o no y, si es posible, si existen mas fragmentos respecto al recibido.
- El ***Fragment Offset*** que indica la posición del fragmento dentro del datagrama original, en unidades de 8 bytes.

> [!info]  Campos que cambian entre fragmentos
> Dado que fragmentar implica dividir la información de los datos **pueden** verse afectados los siguientes campos: Opciones, *Flags* (MF), *Fragment Offset*, Longitud de cabecera, Longitud total y Suma de control de cabecera.

## Como ocurre

### Fragmentación

Recordando que al datagrama de tamaño máximo que se puede transmitir a través de la **siguiente** red se le llama la unidad de transmisión máxima (MTU, *Maximun Transmission Unit*).

Si la longitud total a transmitir es **menor o igual** la MTU entonces pasar este datagrama al siguiente paso de procesamiento; **sino** partir el datagrama en dos fragmentos, siendo el primero de tamaño máximo, y el segundo el  resto del datagrama. El primer fragmento es pasado al siguiente paso en el procesamiento, mientras que el segundo fragmento se pasa otra vez a este procedimiento en caso de ser todavía demasiado grande.

Tener en cuenta que cada fragmento lleva su propio encabezado con el mismo ID y que se debe recalcular el FCS luego de generar el fragmento.

> [!example] Ejemplo numérico de fragmentación
> Un datagrama IP con 4000 bytes de carga útil debe atravesar una red con MTU 1500. Cada fragmento debe ser ≤ 1500 bytes incluyendo el encabezado IP (20 bytes), es decir, máximo **1480 bytes de datos** por fragmento, en múltiplos de 8 (por el offset).
> 
| Fragmento | Datos      | Offset       | MF |
| --------- | ---------- | ------------ | ------ |
| 1         | 1480 bytes | 0            | 1      |
| 2         | 1480 bytes | 185 (1480/8) | 1      |
| 3         | 1040 bytes | 370 (2960/8) | 0      |

### Reensamblado

En el **receptor final** (nunca los *routers* intermedios) se hace el trabajo de:
1. Recibir los fragmentos.
2. Ordenarlos según el offset.
3. Reconocer el último framento (MF = 0).
4. Reconstruir el datagrama original concatenando los datos.

Si falta algún fragmento o no llega a tiempo, se **descarta todo el datagrama**.

Para cada datagrama en el reensamblado se utiliza un **identificador de *buffer*** que se calcula como la concatenación de los campos de origen, destino, protocolo e  identificación. Si se trata de un datagrama completo (es decir, *Fragment Offset* y MF cero), entonces todos los recursos de reensamblaje asociados con este identificador son liberados y el datagrama se pasa al siguiente paso en el procesamiento.

Los **recursos de reensamblaje** consisten en un *buffer* de datos, un *buffer* de cabecera, una tabla de bits de bloque de fragmento, un campo de longitud total de datos, y un temporizador. Los datos contenidos en el fragmento se guardan en su *buffer* de acuerdo con su posición de fragmento y longitud.

Si el **temporizador** se agota, se liberan todos los recursos de reensamblaje para este identificador de *buffer*. El valor inicial del temporizador es un límite inferior del tiempo de espera de reensamblaje. Esto es así porque el tiempo de espera será incrementado si el TTL del fragmento recién llegado es mayor que el valor actual del temporizador, pero no será decrementado si es menor.

> [!warning] Problemas comunes de la fragmentación
> - **Retransmisión costosa:** si se pierde un fragmento, hay que reenviar todo el datagrama.
> - **Ataques de fragmentación:** pueden usarse para evadir cortafuegos o IDS.
> - **Mayor carga de procesamiento** en el receptor y en cada router.
>
> Por eso hoy se prefiere evitarla usando ***Path* MTU *Discovery*** (en IPv6), donde el emisor detecta el MTU más bajo del camino y ajusta el tamaño de los paquetes.

---
**Volver a:** [[04 - Cabecera IPv4|Cabecera IPv4]]

**Continuar a:** [[06 - Direcciones IPv4|Direcciones IPv4]]
