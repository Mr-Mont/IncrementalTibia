export default {
    name: 'Rat',
    hp: 20,
    maxHp: 20,
    exp: 5,
    defense: 5,
    armor: 1,
    skills: [
        {
            name: 'melee',
            type: 'physical',
            minDamage: 0,
            maxDamage: 8,
            cooldown: 1000,
            chance: 100,
        },
    ],
    loot: {
        gold: { min: 0, max: 4 },
    },
};