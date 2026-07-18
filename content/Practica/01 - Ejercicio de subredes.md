---
title: Ejercicio de Subredes
---
> Para el desarrollo de esta practica leer: [[08 - Subredes#Diseño de subredes|Diseño de subredes]] 
> 
> Además queda como herramienta propuesta por la cátedra: [Calculadora de redes](https://www.calculadora-redes.com/)

## Ejercicio 1

Para cada dirección, determinar la máscara de subred, la dirección de gateway (GW), y la primera y última dirección utilizable de esa subred:

1. `172.16.18.10/18`
2. `172.28.26.12/13`
3. `192.168.200.100/27`
4. `10.10.229.130/21`
5. `10.113.30.38/22`

## Ejercicio 2

a) Analizar las siguientes direcciones IPv4 y determinar si son válidas, a qué clase pertenecen y si son públicas o privadas (si no es válida, explicar por qué): `192.168.1.5`, `192.256.5.10`, `240.1.10.10`, `100.100.15.15`.
b) Indicar qué máscaras son válidas y cuáles no, y por qué: `255.255.0.0`, `255.256.255.0`, `254.255.255.0`, `255.255.0.255`.

## Ejercicio 3

Dada la red `149.250.0.0` con máscara `255.255.255.0`: ¿cuántas redes disponibles hay? Indicar la primera y la última red disponible, y las direcciones de broadcast de la primera y la última.

## Ejercicio 4

Dada la dirección `220.120.120.10/27`, ¿a qué subred pertenece? Dada `192.255.15.75/28`, ¿cuántas IP para host y cuántas subredes como máximo son posibles?

## Ejercicio 5

Sea la subred `150.214.141.0` con máscara `255.255.255.0`. Comprobar cuáles de estas direcciones **no** pertenecen a dicha red: `150.214.141.128`, `150.214.141.138`, `150.214.142.23`.

## Ejercicio 6

Dada la IP `172.16.45.14/30`, ¿cuál es la dirección de la subred a la que pertenece ese nodo?

## Ejercicio 7

Una organización posee la IP `172.12.0.0`. Se necesita dividir en subredes que soporten un máximo de 459 hosts por subred, procurando mantener al máximo el número de subredes disponibles. Determinar la máscara a utilizar.

## Ejercicio 8

La empresa NATURALIVE es propietaria de `172.50.10.07/16`. Se plantearon inicialmente 25 subredes, con un mínimo de 900 hosts por subred, y se proyecta un crecimiento a 55 subredes en los próximos años. Determinar qué máscara de subred se debería utilizar.