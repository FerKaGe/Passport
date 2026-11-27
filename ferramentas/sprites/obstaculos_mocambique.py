"""
Obstáculos de Moçambique: coqueiro e caranguejo.

Gera public/jogo/img/obstaculos/coqueiro.gif e caranguejo.gif.
Como rodar:  python ferramentas/sprites/obstaculos_mocambique.py
"""

from obstaculo_base import gerar_todos

COQUEIRO = [
    "....GG....GGG.....",
    "..GGVVG..GVVGGG...",
    ".GVVGGGGGGVGGGGG..",
    "GVGG.GGVVGGG..GGG.",
    "GG..GGVGGVGGG..GGg",
    "G..GGVGGGGVGGG..Gg",
    "..GGVGGmmGGVGGG..g",
    ".GGVGGmMMmGGVGG...",
    ".GVGG.mMMm.GGVGg..",
    ".GGG..BBBBBB.GGg..",
    ".Gg...BBMBBm..Gg..",
    "......KBBBBK......",
    "......BKBBKm......",
    "......BBBBBB......",
    "......BBBBBB......",
    "......MMMMMm......",
    "......BKKKKm......",
    "......BBBBBm......",
    "......MMMMMm......",
    "......BBBBBm......",
    "......BBBBBm......",
    "......MMMMMm......",
    "......BBBBBm......",
    "......BBBBBm......",
    ".....MMMMMMmm.....",
    ".....BBBBBBBm.....",
    "....BBBBBBBBmm....",
    "....mmmmmmmmmm....",
]

CARANGUEJO = [
    "RR.RR.RR..RR.RR.RR",
    "RRRRr.RR..RR.RRRRr",
    ".RRr..rR..Rr..RRr.",
    "..Rr.RRRRRRRR.Rr..",
    "..RRRRPRRRRPRRRr..",
    "...RRRRRRRRRRRRr..",
    "..RRRRRRRRRRRRRRr.",
    "..RRRRKKKKKKRRRRr.",
    "..RRRRRRRRRRRRRrr.",
    ".R.rRRRRRRRRRRr.R.",
    "R..R.rrrrrrrr.R..R",
    "R.R............R.R",
]

OBSTACULOS = [
    {"nome": "coqueiro", "mapa": COQUEIRO, "olhos": [(6, 13), (10, 13)], "palpebra": "B", "linha": 20},
    {"nome": "caranguejo", "mapa": CARANGUEJO, "olhos": [(6, 0), (10, 0)], "palpebra": "R", "linha": 8},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
