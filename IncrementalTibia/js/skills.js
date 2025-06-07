export function calculateDamage(baseDamage, skillLevel) {
    return Math.floor(baseDamage * (1 + skillLevel * 0.1));
}

export function calculateDamageReduction(damage, shieldingLevel) {
    const reduction = 1 - (shieldingLevel * 0.03);
    return Math.floor(damage * Math.max(reduction, 0.1));
}

export function trainSkill(skill, expGain) {
    skill.xp += expGain;
    while (skill.xp >= skill.xpToLevel) {
        skill.level += 1;
        skill.xp -= skill.xpToLevel;
        skill.xpToLevel = Math.floor(skill.xpToLevel * 1.2);
        return `Parabéns! Sua habilidade ${skill.name} subiu para o nível ${skill.level}!`;
    }
    return null;
}

export function initializeSkills() {
    return {
        sword: { name: 'sword', level: 10, xp: 0, xpToLevel: 100 },
        axe: { name: 'axe', level: 10, xp: 0, xpToLevel: 100 },
        club: { name: 'club', level: 10, xp: 0, xpToLevel: 100 },
        distance: { name: 'distance', level: 10, xp: 0, xpToLevel: 100 },
        shielding: { name: 'shielding', level: 10, xp: 0, xpToLevel: 100 },
        magic: { name: 'magic', level: 0, xp: 0, xpToLevel: 100 }
    };
}