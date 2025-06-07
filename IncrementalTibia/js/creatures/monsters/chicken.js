export default {
    name: 'Chicken',
    hp: 20,
    maxHp: 20,
    exp: 1,
    defense: 1,
    armor: 1,
    skills: [
        {
            name: 'melee',
            type: 'physical',
            minDamage: 0,
            maxDamage: 1,
            cooldown: 1000,
            chance: 100,
        },
    ],
    loot: {
        gold: { min: 50, max: 150 },
    },
};