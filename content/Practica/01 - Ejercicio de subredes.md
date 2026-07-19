---
title: Ejercicio de Subredes
---
> Para el desarrollo de esta practica leer: [[08 - Subredes#Diseño de subredes|Diseño de subredes]] 

> Además queda como herramienta propuesta por la cátedra: [Calculadora de redes](https://www.calculadora-redes.com/)

## Ejercicio 1

Para cada dirección, determinar la máscara de subred, la dirección de *gateway*, y la primera y última dirección utilizable de esa subred:

> [!success]- 172.16.18.10/18
> **Máscara**
> $$
> /18 \longrightarrow 1111\:1111\quad1111\:1111\quad1100\:0000\quad0000\:0000\longrightarrow\boxed{255.255.192.0}
> $$
> 
> Al host le corresponden los bits de la máscara que son cero
>$$
>1010\:1100\quad0001\:0000\quad00\underbrace{01\:0010\quad0000\:1010}_{host}\longrightarrow 172.16.18.10
>$$
>
> **Red**: poniendo a cero todos los bits de *host*
> $$
> 1010\:1100\quad0001\:0000\quad0000\:0000\quad0000\:0000 \longrightarrow \boxed{172.16.0.0/18}
> $$
> 
> **Broadcast**: poniendo a uno todos los bits de *host*
> $$
> 1010\:1100\quad0001\:0000\quad0011\:1111\quad1111\:1111 \longrightarrow \boxed{172.16.63.255}
> $$
> 
> **Rango hosts**: descartando la dirección de red y de broadcast
> $$
> 1010\:1100\quad0001\:0000\quad0000\:0000\quad0000\:0001 \longrightarrow \boxed{172.16.0.1}\longrightarrow\text{Primer dirección}
> $$
> $$
> 1010\:1100\quad0001\:0000\quad0011\:1111\quad1111\:1110 \longrightarrow \boxed{172.16.63.254}\longrightarrow\text{Última dirección}
> $$
>
> ***Gateway***: por convención es la primera dirección utilizable de la subred:
> $$
> \text{Primer dirección}=\text{Gateway}\longrightarrow \boxed{172.16.0.1}
> $$

> [!example]- 172.28.26.12/13
> **Máscara**
> $/13 \longrightarrow 1111\:1111\quad1111\:1000\quad0000\:0000\quad0000\:0000\longrightarrow\boxed{255.248.0.0}$
> 
> Al *host* le corresponden los bits de la máscara que son cero
> $1010\:1100\quad0001\:1\underbrace{100\quad0001\:1010\quad0000\:1100}_{host}\longrightarrow 172.28.26.12$
>
> **Red**: poniendo a cero todos los bits de *host*
> $1010\:1100\quad0001\:1000\quad0000\:0000\quad0000\:0000 \longrightarrow \boxed{172.24.0.0/13}$
> 
> ***Broadcast***: poniendo a uno todos los bits de *host*
> $1010\:1100\quad0001\:1111\quad1111\:1111\quad1111\:1111 \longrightarrow \boxed{172.31.255.255}$
> 
> **Rango *hosts***: descartando la dirección de red y de *broadcast*
> $1010\:1100\quad0001\:1000\quad0000\:0000\quad0000\:0001 \longrightarrow \boxed{172.24.0.1}\longrightarrow\text{Primer dirección}$
> $1010\:1100\quad0001\:1111\quad1111\:1111\quad1111\:1110 \longrightarrow \boxed{172.31.255.254}\longrightarrow\text{Última dirección}$
>
> ***Gateway***: por convención es la primera dirección utilizable de la subred:
> $\text{Primer dirección}=\text{Gateway}\longrightarrow \boxed{172.24.0.1}$

> [!example]- 192.168.200.100/27
> **Máscara**
> $/27 \longrightarrow 1111\:1111\quad1111\:1111\quad1111\:1111\quad1110\:0000\longrightarrow\boxed{255.255.255.224}$
> 
> Al *host* le corresponden los bits de la máscara que son cero
> $1100\:0000\quad1010\:1000\quad1100\:1000\quad011\underbrace{00\:100}_{host}\longrightarrow 192.168.200.100$
>
> **Red**: poniendo a cero todos los bits de *host*
> $1100\:0000\quad1010\:1000\quad1100\:1000\quad0110\:0000 \longrightarrow \boxed{192.168.200.96/27}$
> 
> ***Broadcast***: poniendo a uno todos los bits de *host*
> $1100\:0000\quad1010\:1000\quad1100\:1000\quad0111\:1111 \longrightarrow \boxed{192.168.200.127}$
> 
> **Rango *hosts***: descartando la dirección de red y de *broadcast*
> $1100\:0000\quad1010\:1000\quad1100\:1000\quad0110\:0001 \longrightarrow \boxed{192.168.200.97}\longrightarrow\text{Primer dirección}$
> $1100\:0000\quad1010\:1000\quad1100\:1000\quad0111\:1110 \longrightarrow \boxed{192.168.200.126}\longrightarrow\text{Última dirección}$
>
> ***Gateway***: por convención es la primera dirección utilizable de la subred:
> $\text{Primer dirección}=\text{Gateway}\longrightarrow \boxed{192.168.200.97}$

> [!example]- 10.10.229.130/21
> **Máscara**
> $/21 \longrightarrow 1111\:1111\quad1111\:1111\quad1111\:1000\quad0000\:0000\longrightarrow\boxed{255.255.248.0}$
> 
> Al *host* le corresponden los bits de la máscara que son cero
> $0000\:1010\quad0000\:1010\quad1110\:0\underbrace{101\quad1000\:0010}_{host}\longrightarrow 10.10.229.130$
>
> **Red**: poniendo a cero todos los bits de *host*
> $0000\:1010\quad0000\:1010\quad1110\:0000\quad0000\:0000 \longrightarrow \boxed{10.10.224.0/21}$
> 
> ***Broadcast***: poniendo a uno todos los bits de *host*
> $0000\:1010\quad0000\:1010\quad1110\:0111\quad1111\:1111 \longrightarrow \boxed{10.10.231.255}$
> 
> **Rango *hosts***: descartando la dirección de red y de *broadcast*
> $0000\:1010\quad0000\:1010\quad1110\:0000\quad0000\:0001 \longrightarrow \boxed{10.10.224.1}\longrightarrow\text{Primer dirección}$
> $0000\:1010\quad0000\:1010\quad1110\:0111\quad1111\:1110 \longrightarrow \boxed{10.10.231.254}\longrightarrow\text{Última dirección}$
>
> ***Gateway***: por convención es la primera dirección utilizable de la subred:
> $\text{Primer dirección}=\text{Gateway}\longrightarrow \boxed{10.10.224.1}$

> [!example]- 10.113.30.38/22
> **Máscara**
> $/22 \longrightarrow 1111\:1111\quad1111\:1111\quad1111\:1100\quad0000\:0000\longrightarrow\boxed{255.255.252.0}$
> 
> Al *host* le corresponden los bits de la máscara que son cero
> $0000\:1010\quad0111\:0001\quad0001\:11\underbrace{10\quad0010\:0110}_{host}\longrightarrow 10.113.30.38$
>
> **Red**: poniendo a cero todos los bits de *host*
> $0000\:1010\quad0111\:0001\quad0001\:1100\quad0000\:0000 \longrightarrow \boxed{10.113.28.0/22}$
> 
> ***Broadcast***: poniendo a uno todos los bits de *host*
> $0000\:1010\quad0111\:0001\quad0001\:1111\quad1111\:1111 \longrightarrow \boxed{10.113.31.255}$
> 
> **Rango *hosts***: descartando la dirección de red y de *broadcast*
> $0000\:1010\quad0111\:0001\quad0001\:1100\quad0000\:0001 \longrightarrow \boxed{10.113.28.1}\longrightarrow\text{Primer dirección}$
> $0000\:1010\quad0111\:0001\quad0001\:1111\quad1111\:1110 \longrightarrow \boxed{10.113.31.254}\longrightarrow\text{Última dirección}$
>
> ***Gateway***: por convención es la primera dirección utilizable de la subred:
> $\text{Primer dirección}=\text{Gateway}\longrightarrow \boxed{10.113.28.1}$

## Ejercicio 2

Analizar las siguientes direcciones IPv4 y determinar si son válidas (si no, explicar por qué), a qué clase pertenecen y si son públicas o privadas:

> [!example]- 192.168.1.5 
>- El formato es válido.
>- Al tener el primer octeto en 192 cae dentro del rango de Clase C.
>- Al estar dentro del prefijo 192.168/16 es Clase C privada.

> [!example]- 192.256.5.10
>- El formato es inválido porque el segundo octeto supera el limite máximo definido por 8 bits: $2^{8}-1=255$

> [!example]- 240.1.10.10
>- El formáto es válido
>- 240 en binario corresponde a 1111 0000 por lo que corresponde a Clase E (reservada)

> [!example]- 100.100.15.15
>- Formato válido
>- 100 en binario corresponde a 0110 0100 por lo que es de Clase A
>- Forma parte del rango especial para proveedores ISP

Indicar qué máscaras son válidas y cuáles no, y por qué: 

>[!example]- 255.255.0.0
> Máscara válida, todos los ceros y unos son seguidos sin mezclarse

>[!example]- 255.256.255.0
> Máscara inválida, 256 excede el límite de 8 bits.

>[!example]- 254.255.255.0
> Máscara inválida: el primer octeto es incorrecto al romper la regla de que no se pueden intercalar ceros y unos. 254 es 1111 1110 y el siguiente 255 es 1111 1111 por lo que está mal.

>[!example]- 255.255.0.255
> Máscara inválida, mismo motivo que el anterior.

## Ejercicio 3

Dada la red 149.250.0.0 con máscara 255.255.255.0 ¿Cuántas redes disponibles hay? Indicar la primera y la última red disponible, y las direcciones de broadcast de la primera y la última.

> [!example]- Resolución
>- Al ser 149 el primer octeto cae dentro de la Clase B y tiene 16 bits de red.
>- La máscara al ser 255.255.255.0 es /24 entonces tenemos 24-16=8 bits de subred.
>- Con 8 bits de subred tenemos $2^8=\boxed{256\text{ subredes}}$ posibles.
>- Las subredes se identifican (particularmente en este caso) con el tercer octeto entonces:
>	- Primer subred: $\boxed{149.250.0.0/24}$
>	- Última subred: $\boxed{149.250.255.0/24}$
>- Recordando que la dirección de *broadcast* corresponde a todos los bits de *host* en unos, y que en este caso el cuarto octeto corresponde a dichos bits:
>	- Primer *broadcast*: $\boxed{149.250.0.255}$
>	- Última *broadcast*: $\boxed{149.250.255.255}$

## Ejercicio 4

Dada la dirección 220.120.120.10/27, ¿a qué subred pertenece? 

> [!example]- Resolución
>- Al ser /27 tenemos que fijarnos en el último octeto 1110 0000.
>- Se tienen tres bits de red y cinco de *host*.
>- Siendo el 10 en decimal del último octeto 0000 1010 en binario cae dentro de la subred 0.
>- Entonces pertenece a la subred: $\boxed{220.120.120.0/27}$

Dada 192.255.15.75/28, ¿Cuántas IP para *host* y cuántas subredes como máximo son posibles?

> [!example]- Resolución
>- Al ser /28 tenemos que fijarnos en el último octeto: 1111 0000.
>- Se tienen cuatro bits para red y cuatro para *host*.
>- Son posibles: $2^4=\boxed{16 \text{ subredes}}$
>- Por cada subred podemos tener $2^4-2=14 \text{ host}$ sacando red y *broadcast*.
>- Son posibles: $16 \cdot 14 = \boxed{224 \text{ host}}$ totales.

## Ejercicio 5

Sea la subred 150.214.141.0 con máscara 255.255.255.0. Comprobar cuáles de estas direcciones **no** pertenecen a dicha red

> [!example]- 150.214.141.128
> La máscara 255.255.255.0 es /24 por lo que 128 si está incluido.

> [!example]- 150.214.141.138
> La máscara 255.255.255.0 es /24 por lo que 138 si está incluido.

> [!example]- 150.214.142.23
> No está incluido ya que cambia el tercer octeto de 141 a 142.

## Ejercicio 6

Dada la IP 172.16.45.14/30 ¿Cuál es la dirección de la subred a la que pertenece ese nodo?

> [!example]- Resolución
>- La máscara /30 en el último octeto es 1111 1100.
>- Suponiendo que viene de un Clase C /24 tenemos 6 bits que corresponden a subred.
>- Siendo el decimal 14 del último octeto 0000 1110 vemos que:
> $$
> \underbrace{0000 \: 11}_{\text{subred}}\underbrace{10}_{\text{host}}
> $$
>- Poniendo los bits de *host* en cero tenemos 0000 11**00** que es 12 en decimal.
>- Finalmente entonces la dirección de subred es: $\boxed{172.16.45.12/30}$

## Ejercicio 7

Una organización posee la IP 172.12.0.0. Se necesita dividir en subredes que soporten un máximo de 459 *hosts* por subred, procurando mantener al máximo el número de subredes disponibles. Determinar la máscara a utilizar.

> [!example]- Resolución
>- Para tener como mínimo 469 *host* necesitamos $\lceil log_2(469) \rceil = 9$ bits para *host*.
>	- La simbología $\lceil x \rceil$ es para función techo, osea el entero mas próximo superior. 
>	- Lo anterior tambien se puede hacer al tanteo usando 8 y 9 bits.
>	- Con los 9 bits definidos tenemos $2^9-2=\boxed{510 \text{ host}}$ posibles por subred.
>- La dirección comienza con 172, corresponde a Clase B y se tienen 16 bits de red.
>- De los 16 bits restantes descartamos 9 para los *host* y asegurar el máximo de subredes.
>- Con los 7 que quedan hacemos subredes, quedando un total de $2^7=\boxed{128 \text{ subredes}}$
>- La máscara quedaría $16 \text{ bits de red}+7 \text{ bits de subred}=\boxed{/23}$

## Ejercicio 8

La empresa NATURALIVE es propietaria de 172.50.10.07/16. Se plantearon inicialmente 25 subredes, con un mínimo de 900 hosts por subred, y se proyecta un crecimiento a 55 subredes en los próximos años. Determinar qué máscara de subred se debería utilizar.

> [!example]- Resolución
>- Para hacer 55 subredes es necesario $\lceil log_2(55) \rceil = 6$ bits para subred mínimo.
>- Para tener como mínimo 900 *host* es necesario más de $\lceil log_2(900) \rceil = 10$ bits para *host*.
>- Con los 16 bits de red y los 6 necesarios para subred tenemos una máscara de $\boxed{/22}$
>- Con los 10 bits para *host* tenemos para cubrir 1022 *hosts* por subred.