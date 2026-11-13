"""
Obstáculos do Atacama (Chile): cacto e pedra vulcânica.

Gera public/jogo/img/obstaculos/cacto.gif e pedra-vulcanica.gif.
Como rodar:  python ferramentas/sprites/obstaculos_atacama.py
"""

from obstaculo_base import gerar_todos

CACTO = [
    "......PP......",
    ".....PYYP.....",
    "....GVGGGg....",
    "....GVGGGg....",
    "....GVGGGg....",
    "....GVGGGg.GVg",
    "....GVGGGg.GVg",
    "GVg.GVGGGg.GVg",
    "GVg.GVGGGg.GVg",
    "GVg.GVGGGg.GVg",
    "GVg.GVGGGgGGGg",
    "GVg.GVGGGgggg.",
    "GVGGGVGGGg....",
    ".gggGVGGGg....",
    "....GVGGGg....",
    "....KVGGGK....",
    "....GKGGKg....",
    "....GGGGGG....",
    "....GGGGGG....",
    "....GVGGGg....",
    "....GVKKGg....",
    "....GVGGGg....",
    "....GVGGGg....",
    "....GVGVGg....",
    "....GVGGGg....",
    "....GVGGGg....",
    "....GVGVGg....",
    "....GVGGGg....",
]

PEDRA_VULCANICA = [
    "......DDDDDD......",
    "....DDDCCDDDDD....",
    "...DDCCDDDDDDDD...",
    "..DDCDDDDDDDODDD..",
    ".DDKDDDDDKDDOYDDd.",
    ".DDDKDDDKDDDDODDd.",
    "DDDDDDDDDDDDDOODdd",
    "DDDDDDDDDDDDDDODdd",
    "DDDDDDDDDDDDDOODdd",
    "DDDDKKKKKDDDOYDDdd",
    "DODDDDDDDDDDODDddd",
    "DOYDDDDDDDDOODdddd",
    "dDOOddddddddOddddd",
    ".dddddddddddddddd.",
]

OBSTACULOS = [
    {"nome": "cacto", "mapa": CACTO, "olhos": [(4, 17), (8, 17)], "palpebra": "G", "linha": 22},
    {"nome": "pedra-vulcanica", "mapa": PEDRA_VULCANICA, "olhos": [(3, 6), (8, 6)], "palpebra": "D", "linha": 8},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
