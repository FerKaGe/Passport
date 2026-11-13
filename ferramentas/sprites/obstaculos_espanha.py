"""
Obstáculos da Espanha: touro e oliveira.

Gera public/jogo/img/obstaculos/touro.gif e oliveira.gif.
Como rodar:  python ferramentas/sprites/obstaculos_espanha.py
"""

from obstaculo_base import gerar_todos

TOURO = [
    "W................W",
    "WW..............WW",
    ".WW..DDDDDDDD..WW.",
    "..WWDDDDDDDDDDWW..",
    "...DDDDDDDDDDDD...",
    "..DDKDDDDDDDDKDD..",
    "..DDDKDDDDDDKDDD..",
    "..DDDDDDDDDDDDDD..",
    "..DDDDDDDDDDDDDD..",
    "..DDPPPPPPPPPPDD..",
    "..DPPNPPPPPPNPPD..",
    "..DPPPPYYYYPPPPD..",
    "...DPPPYPPYPPPD...",
    "..DDDDDDYYDDDDDD..",
    ".DDDDDDDDDDDDDDDD.",
    ".DDDDdDDDDDDdDDDD.",
    ".DDDd.dDDDDd.dDDD.",
    ".ccc...cccc...ccc.",
]

OLIVEIRA = [
    ".....EEEEEEE......",
    "...EEEEVEEEEEE....",
    "..EEVEEEEEEVEEEE..",
    ".EEEEEENEEEEEEEEe.",
    ".EVEEEEEEEEENEEEe.",
    "EEEEKEEEEEEKEEEEee",
    "EENEEKEEEEKEEEVEee",
    "EEEEEEEEEEEEEEEEee",
    "EEEEEEEEEEEEEEEEee",
    "EVEEEEEEEEEEENEEee",
    ".EEEEEKKKKKEEEEEe.",
    ".EENEEEEEEEEEEEee.",
    "..EEEEEVEEEEEEee..",
    "...eeEEEEEEEeee...",
    "......MBBMm.......",
    "......MBBMm.......",
    ".....MBBMMm.......",
    ".....MBMBMm.......",
    "......MBBMmm......",
    "......MBBBMm......",
    ".......MBBMm......",
    "......MBBMMm......",
    ".....MBBMBMm......",
    "....MMBBMBMmm.....",
    "...MMBBMMBBMmm....",
    "..mmmmmmmmmmmmm...",
]

OBSTACULOS = [
    {"nome": "touro", "mapa": TOURO, "olhos": [(4, 7), (12, 7)], "palpebra": "D", "linha": 14},
    {"nome": "oliveira", "mapa": OLIVEIRA, "olhos": [(4, 7), (10, 7)], "palpebra": "E", "linha": 19},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
