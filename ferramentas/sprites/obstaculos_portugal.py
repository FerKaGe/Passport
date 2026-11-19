"""
Obstáculos de Portugal: azulejo e sardinha.

Gera public/jogo/img/obstaculos/azulejo.gif e sardinha.gif.
Como rodar:  python ferramentas/sprites/obstaculos_portugal.py
"""

from obstaculo_base import gerar_todos

AZULEJO = [
    "AAAAAAAAAAAAAAAA",
    "AWWWWWWWWWWWWWWa",
    "AWLAWWWWWWWWALWa",
    "AWAAAWWWWWWAAAWa",
    "AWWAWKWWWWKWAWWa",
    "AWWWWWKWWKWWWWWa",
    "AWWWWWWWWWWWWWWa",
    "AWWWWWWWWWWWWWWa",
    "AWWWWWWAAWWWWWWa",
    "AWWWWWWWWWWWWWWa",
    "AWWWWKKKKKKWWWWa",
    "AWWAWWWWWWWWAWWa",
    "AWAAAWWWWWWAAAWa",
    "AWLAWWWWWWWWALWa",
    "AWWWWWWWWWWWWWWa",
    "Aaaaaaaaaaaaaaaa",
]

SARDINHA = [
    "....AASS....",
    "...AASSSS...",
    "..AASSSSSS..",
    "..AKSSSSKS..",
    "..AAKSSKSS..",
    "..AASSSSSSC.",
    "..AASSSSSSC.",
    ".AAASSSSSSC.",
    ".AASSKKKSSC.",
    ".AASSSSSSSC.",
    ".AACCCCCCCC.",
    "AAASSSSSSSCC",
    "AALSSLSSLSCC",
    "AAASSSSSSSCC",
    "AASLSSLSSLCC",
    "AAASSSSSSSCC",
    ".AASSLSSLSC.",
    ".AAASSSSSSC.",
    ".AASLSSLSCC.",
    "..AASSSSSC..",
    "..AAASSSCC..",
    "...AASSCC...",
    "...AASCC....",
    "..AAA..CCC..",
    ".AAAA..CCCC.",
    "AAAA....CCCC",
]

OBSTACULOS = [
    {"nome": "azulejo", "mapa": AZULEJO, "olhos": [(5, 6), (9, 6)], "palpebra": "W", "linha": 9},
    {"nome": "sardinha", "mapa": SARDINHA, "olhos": [(3, 5), (7, 5)], "palpebra": "S", "linha": 13},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
