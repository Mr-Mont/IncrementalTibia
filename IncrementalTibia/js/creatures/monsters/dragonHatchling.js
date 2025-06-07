export default {
    name: 'Dragon Hatchling',
    hp: 380,
    maxHp: 380,
    exp: 185,
    defense: 10,
    armor: 15,
    skills: [
        {
            name: 'melee',
            type: 'physical',
            minDamage: 0,
            maxDamage: 10,
            cooldown: 1000,
            chance: 100,
        },
        {
            name: 'fire ball',
            type: 'fire',
            minDamage: 30,
            maxDamage: 55,
            cooldown: 2000,
            chance: 15,
        },
        {
            name: 'fire wave',
            type: 'fire',
            minDamage: 60,
            maxDamage: 90,
            cooldown: 2000,
            chance: 10,
        },
    ],
    loot: {
        gold: { min: 0, max: 55 },
    },
};