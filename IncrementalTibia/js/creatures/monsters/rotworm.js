export default {
    name: 'Rotworm',
    hp: 65,
    maxHp: 65,
    exp: 40,
    defense: 10,
    armor: 8,
    skills: [
        {
            name: 'melee',
            type: 'physical',
            minDamage: 0,
            maxDamage: 40,
            cooldown: 1000,
            chance: 100,
        },
    ],
    loot: {
        gold: { min: 0, max: 17 },
    },
};