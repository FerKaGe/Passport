"""
Obstáculos de Orlando (Estados Unidos): jacaré e cone de obra.

Gera public/jogo/img/obstaculos/jacare.gif e cone.gif.
Como rodar:  python ferramentas/sprites/obstaculos_orlando.py
"""

from obstaculo_base import gerar_todos

JACARE = [
    "......GGG.........",
    ".....GGGGG.....gG.",
    "..GGGGGGGGGG..gGG.",
    "GGGGGGGGGGGGGGGGG.",
    "GVGVGGGGGVGGVGGGg.",
    "WGWGWGGGGGGGGGGgg.",
    "...NNNNGGGGGGGGgg.",
    "WGWGWRRGGGGGGGgg..",
    "GGGGGGGGGYYYYYgg..",
    ".GGGGGGYYYYYYYg...",
    "...gGGGgggggGGg...",
    "...GGg.....GGg....",
    "...GGg.....GGg....",
    "..WGWg....WGWg....",
]

CONE = [
    ".....OOOO.....",
    ".....OOOO.....",
    "....OOOOOo....",
    "....OOOOOo....",
    "...WWWWWWWw...",
    "...WWWWWWWw...",
    "...OKOOOOKo...",
    "..OOOKOOKOOo..",
    "..OOOOOOOOOo..",
    "..OOOOOOOOOo..",
    ".WWWWWWWWWWWw.",
    ".WWWWKKKKWWWw.",
    ".WWWWWWWWWWWw.",
    ".OOOOOOOOOOOo.",
    "OOOOOOOOOOOOoo",
    "OOOOOOOOOOOOoo",
    "OOOOOOOOOOOOoo",
    "OOOOOOOOOOOOoo",
    "DDDDDDDDDDDDDD",
    "DDDDDDDDDDDDDD",
]

OBSTACULOS = [
    {"nome": "jacare", "mapa": JACARE, "olhos": [(6, 1)], "palpebra": "G", "linha": 9},
    {"nome": "cone", "mapa": CONE, "olhos": [(4, 8), (8, 8)], "palpebra": "O", "linha": 15},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
