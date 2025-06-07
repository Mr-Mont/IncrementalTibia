import { calculateDamage, calculateDamageReduction, trainSkill } from './skills.js';
import { config } from './config.js';

export function fight(player, currentMonster, log) {
    if (!currentMonster) return false;

    currentMonster.armor = currentMonster.armor || 0;
    currentMonster.skills = currentMonster.skills || [{ name: 'Ataque Básico', minDamage: 1, maxDamage: 5, chance: 100, cooldown: 1000 }];
    currentMonster.loot = currentMonster.loot || { gold: { min: 0, max: 0 } };
    currentMonster.loot.gold = currentMonster.loot.gold || { min: 0, max: 0 };
    currentMonster.lastSkillUse = currentMonster.lastSkillUse || {};

    const equippedWeapon = player.inventory.equipment.weapon;
    let skillLevel = player.skills.sword.level;
    if (equippedWeapon) {
        if (equippedWeapon.id.includes('axe')) skillLevel = player.skills.axe.level;
        else if (equippedWeapon.id.includes('club')) skillLevel = player.skills.club.level;
        else if (equippedWeapon.id.includes('sword') || equippedWeapon.id.includes('dagger') || equippedWeapon.id.includes('katana')) skillLevel = player.skills.sword.level;
    }
    const baseDamage = player.damage || 5;
    const damageToMonster = calculateDamage(baseDamage, skillLevel);
    const damageAfterArmor = Math.max(damageToMonster - (currentMonster.armor || 0), 1);
    currentMonster.hp -= damageAfterArmor;
    log(`Você causou ${damageAfterArmor} de dano ao ${currentMonster.name}. HP dele: ${currentMonster.hp}`);

    const skillToTrain = equippedWeapon ? 
        (equippedWeapon.id.includes('axe') ? player.skills.axe :
         equippedWeapon.id.includes('club') ? player.skills.club : player.skills.sword) : player.skills.sword;
    const swordExp = Math.floor(currentMonster.exp * config.skillXpMultiplier);
    const swordMessage = trainSkill(skillToTrain, swordExp);
    if (swordMessage) log(swordMessage);

    if (player.inventory.equipment.shield) {
        const shieldExp = Math.floor(currentMonster.exp * config.skillXpMultiplier * 0.5);
        const shieldMessage = trainSkill(player.skills.shielding, shieldExp);
        if (shieldMessage) log(shieldMessage);
    }

    if (currentMonster.hp <= 0) {
        player.xp += Math.floor(currentMonster.exp * config.expMultiplier);
        const goldDrop = getRandomInt(currentMonster.loot.gold.min, currentMonster.loot.gold.max);
        player.gold += goldDrop;
        log(`Você matou o ${currentMonster.name}! Ganhou ${Math.floor(currentMonster.exp * config.expMultiplier)} XP e ${goldDrop} gold.`, true);
        return true;
    } else {
        const now = Date.now();
        const skill = chooseMonsterSkill(currentMonster.skills, currentMonster.lastSkillUse);
        if (skill) {
            const baseDamageToPlayer = getRandomInt(skill.minDamage, skill.maxDamage);
            const damageToPlayer = calculateDamageReduction(baseDamageToPlayer, player.skills.shielding.level);
            player.hp -= damageToPlayer;
            player.mp = Math.max(0, player.mp - 1);
            log(`${currentMonster.name} usou ${skill.name} e causou ${damageToPlayer} de dano a você. Seu HP: ${player.hp}`);
            currentMonster.lastSkillUse[skill.name] = now;
        }
        return false;
    }
}

function getRandomInt(min, max) {
    min = Math.max(0, min || 0);
    max = Math.max(min, max || 0);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function chooseMonsterSkill(skills, lastSkillUse) {
    const now = Date.now();
    for (const skill of skills) {
        const lastUse = lastSkillUse[skill.name] || 0;
        if (now - lastUse >= skill.cooldown && Math.random() * 100 < (skill.chance || 100)) {
            return skill;
        }
    }
    return skills[0];
}