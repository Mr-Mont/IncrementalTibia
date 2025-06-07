// Tabela de experiência oficial do Tibia (valores fornecidos do nível 1 ao 100)
export const expTable = [
    0,      // Nível 1
    100,    // Nível 2
    200,    // Nível 3
    400,    // Nível 4
    800,    // Nível 5
    1500,   // Nível 6
    2600,   // Nível 7
    4200,   // Nível 8
    6400,   // Nível 9
    9300,   // Nível 10
    13000,  // Nível 11
    17600,  // Nível 12
    23200,  // Nível 13
    29900,  // Nível 14
    37800,  // Nível 15
    47000,  // Nível 16
    57600,  // Nível 17
    69700,  // Nível 18
    83400,  // Nível 19
    98800,  // Nível 20
    116000, // Nível 21
    135100, // Nível 22
    156200, // Nível 23
    179400, // Nível 24
    204800, // Nível 25
    232500, // Nível 26
    262600, // Nível 27
    295200, // Nível 28
    330400, // Nível 29
    368300, // Nível 30
    409000, // Nível 31
    452600, // Nível 32
    499200, // Nível 33
    548900, // Nível 34
    601800, // Nível 35
    658000, // Nível 36
    717600, // Nível 37
    780700, // Nível 38
    847400, // Nível 39
    917800, // Nível 40
    992000, // Nível 41
    1070100,// Nível 42
    1152200,// Nível 43
    1238400,// Nível 44
    1328800,// Nível 45
    1423500,// Nível 46
    1522600,// Nível 47
    1626200,// Nível 48
    1734400,// Nível 49
    1847300,// Nível 50
    1965000,// Nível 51
    2087600,// Nível 52
    2215200,// Nível 53
    2347900,// Nível 54
    2485800,// Nível 55
    2629000,// Nível 56
    2777600,// Nível 57
    2931700,// Nível 58
    3091400,// Nível 59
    3256800,// Nível 60
    3428000,// Nível 61
    3605100,// Nível 62
    3788200,// Nível 63
    3977400,// Nível 64
    4172800,// Nível 65
    4374500,// Nível 66
    4582600,// Nível 67
    4797200,// Nível 68
    5018400,// Nível 69
    5246300,// Nível 70
    5481000,// Nível 71
    5722600,// Nível 72
    5971200,// Nível 73
    6226900,// Nível 74
    6489800,// Nível 75
    6760000,// Nível 76
    7037600,// Nível 77
    7322700,// Nível 78
    7615400,// Nível 79
    7915800,// Nível 80
    8224000,// Nível 81
    8540100,// Nível 82
    8864200,// Nível 83
    9196400,// Nível 84
    9536800,// Nível 85
    9885500,// Nível 86
    10242600,// Nível 87
    10608200,// Nível 88
    10982400,// Nível 89
    11365300,// Nível 90
    11757000,// Nível 91
    12157600,// Nível 92
    12567200,// Nível 93
    12985900,// Nível 94
    13413800,// Nível 95
    13851000,// Nível 96
    14297600,// Nível 97
    14753700,// Nível 98
    15219400,// Nível 99
    15694800 // Nível 100
];

// Função para obter a experiência necessária para um nível específico
export function getExpForLevel(level) {
    const maxLevelInTable = expTable.length; // 100
    if (level <= 1) return 0; // Nível 1 começa com 0 XP
    if (level <= maxLevelInTable) return expTable[level - 1]; // Índice começa em 0, então ajustamos subtraindo 1
    // Para níveis acima de 100, usamos a diferença média entre os últimos níveis como base
    const lastTwoLevelsDiff = expTable[maxLevelInTable - 1] - expTable[maxLevelInTable - 2];
    const baseExp = expTable[maxLevelInTable - 1];
    const levelsAbove = level - maxLevelInTable;
    return Math.floor(baseExp + (lastTwoLevelsDiff * levelsAbove * 1.1)); // Aumenta 10% por nível acima de 100
}