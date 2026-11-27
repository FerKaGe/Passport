"""
Obstáculos de Gibraltar: macaco do Rochedo e cabine telefônica vermelha.

Gera public/jogo/img/obstaculos/macaco.gif e cabine.gif.
Como rodar:  python ferramentas/sprites/obstaculos_gibraltar.py
"""

from obstaculo_base import gerar_todos

MACACO = [
    "....TTTTTTTT....",
    "...TTTTTTTTTT...",
    "..TTTPPPPPPTTT..",
    ".tTTPPPPPPPPTTt.",
    "tPTPKPPPPPPKPTPt",
    "tPTPPKPPPPKPPTPt",
    ".tTPPPPPPPPPPTt.",
    "..TPPPPPPPPPPT..",
    "..TTPPPNNPPPTT..",
    "..TTPPPPPPPPTT..",
    "...TTPKKKKPTT...",
    "...TTTPPPPTTT...",
    "..TTTTTTTTTTTT..",
    ".TTTTBBBBBBTTTT.",
    "TTTTBBBBBBBBTTTT",
    "TTtTBBBBBBBBTtTT",
    "TTtTBBBBBBBBTtTT",
    "TTtTBBBBBBBBTtTT",
    "TTtTTBBBBBBTTtTT",
    "PPtTTTBBBBTTTtPP",
    ".tTTTTTTTTTTTTt.",
    ".TTTTt....tTTTT.",
    "TTTTt......tTTTT",
    "PPPPt......tPPPP",
]

CABINE = [
    "...RRRRRR...",
    "..RRRRRRRR..",
    ".RRYRRRRYRR.",
    "RRRRRRRRRRRr",
    "RWWWWWWWWWWr",
    "RRRRRRRRRRRr",
    "RLLLLRRLLLLr",
    "RKLLLRRLLLKr",
    "RLKLLRRLLKLr",
    "RLLLLRRLLLLr",
    "RLLLLRRLLLLr",
    "RRRRRRRRRRRr",
    "RLLLLRRLLLLr",
    "RLLLLRRLLLLr",
    "RLLKKKKKKLLr",
    "RLLLLRRLLLLr",
    "RRRRRRRRRRRr",
    "RLLLLRRLLLLr",
    "RLLLLRRLLLLr",
    "RLLLLRRLLLLr",
    "RLLLLRRLLLLr",
    "RRRRRRRRRRRr",
    "RRRRRRRRRRRr",
    "RRRRRRRRRYRr",
    "RRRRRRRRRRRr",
    "RRRRRRRRRRRr",
    "rrrrrrrrrrrr",
    "cccccccccccc",
]

OBSTACULOS = [
    {"nome": "macaco", "mapa": MACACO, "olhos": [(4, 6), (10, 6)], "palpebra": "P", "linha": 16},
    {"nome": "cabine", "mapa": CABINE, "olhos": [(2, 9), (8, 9)], "palpebra": "L", "linha": 19},
]

if __name__ == "__main__":
    gerar_todos(OBSTACULOS)
