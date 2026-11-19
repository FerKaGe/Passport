"""
Gera todas as imagens do jogo de uma vez, na ordem certa.
(inicio.py vem por último porque monta cenas com as outras imagens.)

Como rodar:  python ferramentas/sprites/gerar_tudo.py
"""

import carimbos
import fundos
import inicio
import interface
import moldura
import obstaculo_base
import obstaculos_atacama
import obstaculos_espanha
import obstaculos_gibraltar
import obstaculos_mendoza
import obstaculos_mocambique
import obstaculos_orlando
import obstaculos_portugal
import viajante

viajante.gerar()

destinos = [obstaculos_atacama, obstaculos_mendoza, obstaculos_espanha, obstaculos_portugal,
            obstaculos_gibraltar, obstaculos_mocambique, obstaculos_orlando]
for destino in destinos:
    obstaculo_base.gerar_todos(destino.OBSTACULOS)

fundos.atacama()
fundos.mendoza()
fundos.espanha()
fundos.portugal()
fundos.gibraltar()
fundos.mocambique()
fundos.orlando()

moldura.gerar()

for carimbo in carimbos.CARIMBOS:
    carimbos.gerar_carimbo(carimbo)

interface.gerar()

inicio.gerar_previa()
for cartao in inicio.CARTOES:
    inicio.gerar_cartao(cartao)
