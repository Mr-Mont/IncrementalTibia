import { useConsumable } from './consumables.js';
import { getTasksProgress } from './tasks.js';
import { getExpForLevel } from './exptable.js';

export function updateStats(player) {
    if (!player) return;

    document.getElementById('level').textContent = player.level;
    document.getElementById('hp').textContent = player.hp;
    document.getElementById('max-hp').textContent = player.maxHp;
    document.getElementById('mp').textContent = player.mp;
    document.getElementById('max-mp').textContent = player.maxMp;
    document.getElementById('xp').textContent = player.xp;
    document.getElementById('xp-to-level').textContent = getExpForLevel(player.level + 1);
    document.getElementById('magic-level').textContent = player.magicLevel;
    document.getElementById('magic-xp').textContent = player.magicXp;
    document.getElementById('sword-level').textContent = player.skills.sword.level;
    document.getElementById('sword-xp').textContent = player.skills.sword.xp;
    document.getElementById('axe-level').textContent = player.skills.axe.level;
    document.getElementById('axe-xp').textContent = player.skills.axe.xp;
    document.getElementById('club-level').textContent = player.skills.club.level;
    document.getElementById('club-xp').textContent = player.skills.club.xp;
    document.getElementById('distance-level').textContent = player.skills.distance.level;
    document.getElementById('distance-xp').textContent = player.skills.distance.xp;
    document.getElementById('shielding-level').textContent = player.skills.shielding.level;
    document.getElementById('shielding-xp').textContent = player.skills.shielding.xp;

    const hpBar = document.getElementById('hp-bar');
    const mpBar = document.getElementById('mp-bar');
    const xpBar = document.getElementById('xp-bar');
    const magicLevelBar = document.getElementById('magic-level-bar');
    const swordBar = document.getElementById('sword-bar');
    const axeBar = document.getElementById('axe-bar');
    const clubBar = document.getElementById('club-bar');
    const distanceBar = document.getElementById('distance-bar');
    const shieldingBar = document.getElementById('shielding-bar');

    if (hpBar) hpBar.style.width = (player.hp / player.maxHp) * 100 + '%';
    if (mpBar) mpBar.style.width = (player.mp / player.maxMp) * 100 + '%';
    if (xpBar) xpBar.style.width = (player.xp / getExpForLevel(player.level + 1)) * 100 + '%';
    if (magicLevelBar) magicLevelBar.style.width = (player.magicXp / ((player.magicLevel + 1) * 100)) * 100 + '%';
    if (swordBar) swordBar.style.width = (player.skills.sword.xp / player.skills.sword.xpToLevel) * 100 + '%';
    if (axeBar) axeBar.style.width = (player.skills.axe.xp / player.skills.axe.xpToLevel) * 100 + '%';
    if (clubBar) clubBar.style.width = (player.skills.club.xp / player.skills.club.xpToLevel) * 100 + '%';
    if (distanceBar) distanceBar.style.width = (player.skills.distance.xp / player.skills.distance.xpToLevel) * 100 + '%';
    if (shieldingBar) shieldingBar.style.width = (player.skills.shielding.xp / player.skills.shielding.xpToLevel) * 100 + '%';

    const backpackSlots = document.querySelectorAll('.backpack-slot');
    backpackSlots.forEach((slot, index) => {
        const existingClickHandler = slot._clickHandler;
        if (existingClickHandler) {
            slot.removeEventListener('click', existingClickHandler);
        }
        slot.innerHTML = '';

        const item = player.inventory && player.inventory.slots && player.inventory.slots[index] ? player.inventory.slots[index] : null;
        if (item) {
            slot.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <span class="item-count">x${item.quantity}</span>
                <div class="tooltip">${item.name}<br>Atk: ${item.atk || 0}, Def: ${item.def || 0}${item.attackSpeed ? `, Speed: +${item.attackSpeed}%` : ''}<br>Nível: ${item.minLevel || 1}</div>
            `;
            const clickHandler = () => {
                if (item.type === 'consumable') {
                    const message = useConsumable(player, item.id, index);
                    log(message, false, 'personagem-log');
                    updateStats(player);
                }
            };
            slot.addEventListener('click', clickHandler);
            slot._clickHandler = clickHandler;
        }

        slot.setAttribute('draggable', true);
        slot.setAttribute('data-index', index);
    });

    const equipmentSlots = document.querySelectorAll('.inventory-slot');
    equipmentSlots.forEach(slot => {
        const slotName = slot.getAttribute('data-index');
        const item = player.inventory.equipment[slotName];
        const slotNumber = slot.getAttribute('data-slot');
        const formattedSlotNumber = slotNumber.padStart(2, '0');
        slot.innerHTML = item ? 
            `<img src="${item.image}" alt="${item.name}">
             <div class="tooltip">${item.name}<br>Atk: ${item.atk || 0}, Def: ${item.def || 0}${item.attackSpeed ? `, Speed: +${item.attackSpeed}%` : ''}<br>Nível: ${item.minLevel || 1}</div>` : 
            `<img src="assets/images/itens/inventory/${formattedSlotNumber}.gif" alt="${slotName}">`;
    });
}

export function log(message, success = false, logType = 'log-container') {
    const logContainer = document.getElementById(logType);
    if (!logContainer) {
        console.warn(`Container de log '${logType}' não encontrado no DOM.`);
        return;
    }
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.textContent = `${new Date().toLocaleTimeString()} - ${message}`;
    if (success) logEntry.className += ' success';
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}