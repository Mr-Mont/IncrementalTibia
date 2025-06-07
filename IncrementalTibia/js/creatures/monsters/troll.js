export default {
    name: 'Troll',
    hp: 50,
    maxHp: 50,
    exp: 20,
    defense: 10,
    armor: 6,
    skills: [
        {
            name: 'melee',
            type: 'physical',
            minDamage: 0,
            maxDamage: 10,
            cooldown: 1000,
            chance: 100,
        },
    ],
    loot: {
        gold: { min: 0, max: 12 },
    },
};