---
title: Organización de Internet
fuente:
  - "[IANA](https://www.iana.org/numbers)"
---
De manera simplificada, así se organiza Internet a nivel institucional:

![[organigrama.png|500]]

> [!important] Organismos y de qué se encargan
> - **ICANN** (*Internet Corporation for Assigned Names and Numbers*): administra la coordinación general y el desarrollo de políticas para nombres de dominio, direcciones IP y parámetros de protocolo. Supervisa también la función de la IANA.
> - **IANA** (*Internet Assigned Numbers Authority*, parte de ICANN desde 1998): administra la asignación real de direcciones IP, nombres de dominio y parámetros de protocolo, de acuerdo a los estándares desarrollados por IETF y las políticas de ICANN.
> - **IETF** (*Internet Engineering Task Force*): desarrolla y estandariza los protocolos y estándares técnicos que definen cómo funciona Internet.
> - **RFC** (*Request for Comments*): documento numérico que describe y define protocolos, conceptos, métodos y programas de Internet.

## RIRs (Registros Regionales de Internet)

Los **RIR** son organizaciones que administran la asignación y el registro de direcciones IP y números de sistemas autónomos dentro de una región específica. Hay 5 a nivel mundial, cada uno con sus propias políticas de asignación:

![[mapa-rirs-mundial.png]]

> [!important] RIRs y a qué región corresponden
> 1. **AfriNIC**: África.
> 2. **APNIC**:  Asia/Pacífico.
> 3. **ARIN**:  América del Norte.
> 4. **LACNIC**:  América Latina y el Caribe.
> 5. **RIPE NCC**:  Europa, Medio Oriente y Asia Central.

El organismo IANA distribuye las IPs entre los RIRs y estos, a su vez, a los **ISP** (*Internet Service Provider*), que las entregan a los usuarios finales. A modo de ejemplo jerárquico: 
- La IANA le signa cierto rango de direcciones a la LACNIC.
- La LACNIC le da cierto rango dentro del suyo a la CELO y otro a Obercom.
- CELO y Obercom ofrecen IPs y sus propios servicios a los usuarios finales

## Jerarquía de ISPs (Tier)

Los ISP se designan mediante una jerarquía basada en su nivel de conectividad al *backbone* de Internet. Cada nivel inferior obtiene conectividad al *backbone* conectándose a un ISP de nivel superior:

![[jerarquia-isp-tier-1-2-3.png]]

| TIer | Significado                                                              | Ejemplos                                                    |
| ---- | ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| 1    | ISP con alcance global, no paga tránsito a nadie, solo hace **peering**. | Level 3/Lumen, NTT, Telia, AT&T, GTT, Tata, Cogent, Verizon |
| 2    | ISP regional que paga a un Tier 1 para conectarse al resto de Internet.  | Internexa, IFX, Silica Networks                             |
| 3    | ISP local o de acceso final.                                             | Telecom Argentina, Claro, Telecentro, etc.                  |

> [!tip] Definición de *Peering*
> Interconexión voluntaria entre dos redes de Internet independientes para intercambiar tráfico directamente, sin pasar por terceros.

### Ejemplo aplicado al contexto argentino

- **Tier 1 (internacional):** Level 3/Lumen, Telefónica International Wholesale, Tata Communications, NTT, Cogent, etc. (dueños o copropietarios de los cables submarinos que conectan América con Europa y EE.UU.)
- **Tier 2 (regional):** proveedores con red propia sudamericana, como Internexa, IFX, Silica Networks.
- **Tier 3 (locales):** Telecom Argentina, Claro, Telecentro, etc., que compran tránsito a los Tier 1 o Tier 2.

---
**Volver a:** [[01 - Historia de TCP-IP e IPv4|Historia de TCP-IP e IPv4]]

**Continuar a:** [[03 - Introduccion a IPv4|Introducción al Protocolo IP]]
