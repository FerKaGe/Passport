"""
Obstáculos de Mendoza (Argentina): barril de vinho e cacho de uvas.

Gera public/jogo/img/obstaculos/barril.gif e uvas.gif.
Como rodar:  python ferramentas/sprites/obstaculos_mendoza.py
"""

from obstaculo_base import gerar_todos

BARRIL = [
    "...MMMMMMMMMMMM...",
    "..MBBBBBBBBBBBBM..",
    ".CCCCCCCCCCCCCCCC.",
    ".BMBBMBBBMBBBMBBm.",
    "BBMBBMBBBMBBBMBBmm",
    "BBMKBMBBBMBKBMBBmm",
    "BBMBKMBBBMKBBMBBmm",
    "BBMBBMBBBBBBBMBBmm",
    "BBMBBMBBBBBBBMBBmm",
    "CCCCCCCCCCCCCCCCCc",
    "BBMBBMBBBMBBBMBBmm",
    "BBMBBKKKKKBBBMBBmm",
    "BBMBBMBBBMBBBMBBmm",
    "BBMBBMBUUMBBBMBBmm",
    "BBMBBMBUUMBBBMBBmm",
    "CCCCCCCCCCCCCCCCCc",
    ".BMBBMBBUMBBBMBBm.",
    ".BMBBMBBBMBBBMBBm.",
    ".CCCCCCCCCCCCCCCC.",
    "..mmmmmmmmmmmmmm..",
]

UVAS = [
    ".......mm.......",
    "......mm........",
    "..GGG.mm.GGGG...",
    ".GVVGGmmGGVVGG..",
    ".GVGGGGGGGGVGg..",
    "..GGgUXUuUXUg...",
    ".UXUuUUUuUUUuXU.",
    "UUUUuuuuuuuuuUUu",
    "UUUuUXUUUUXUuUUu",
    "uuuUKUUUUUUKUuuu",
    ".UXUUKUUUUKUUXU.",
    "UUUUUUUUUUUUUUUu",
    "UUUuUUUUUUUUuUUu",
    "uuuuUUUUUUUUuuuu",
    ".UXUuUKKKKUuUXU.",
    ".UUUuuuuuuuuUUu.",
    "..uuUXUuUXUuuu..",
    "..UXuUUuUUUuXu..",
    "..UUUuuuuuuUUu..",
    "...uUXUuUXUuu...",
    "....UUUuUUUu....",
    "....uuUXUuuu....",
    "......UUUu......",
    "......uuu.......",
]

OBSTACULOS = [
    {"nome": "barril", "mapa": BARRIL, "olhos": [(3, 7), (10, 7)], "palpebra": "B", "linha": 12},
    {"nome": "uvas", "mapa": UVAS, "olhos": [(4, 11), (10, 11)], "palpebra": "U", "linha": 18},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
