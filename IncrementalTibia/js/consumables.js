// consumables.js
import { savePlayer } from './player.js';

export function initializeConsumables() {
    return {
        healthPotions: 0,
        manaPotions: 0,
        strongHealthPotions: 0,
        strongManaPotions: 0
    };
}

export function useConsumable(player, itemId, slotIndex) {
    const slot = player.inventory.slots[slotIndex];
    if (!slot || slot.id !== itemId || slot.quantity <= 0) {
        return `Sem ${itemId === 'health-potion' ? 'Health Potions' : 
                itemId === 'mana-potion' ? 'Mana Potions' : 
                itemId === 'strong-health-potion' ? 'Strong Health Potions' : 'Strong Mana Potions'} suficientes!`;
    }

    let message = '';
    if (itemId === 'health-potion') {
        const healAmount = Math.floor(Math.random() * (200 - 150 + 1)) + 150;
        const newHp = Math.min(player.hp + healAmount, player.maxHp);
        message = `Você usou uma Health Potion e recuperou ${newHp - player.hp} HP!`;
        player.hp = newHp;
    } else if (itemId === 'mana-potion') {
        const manaAmount = Math.floor(Math.random() * (130 - 70 + 1)) + 70;
        const newMp = Math.min(player.mp + manaAmount, player.maxMp);
        message = `Você usou uma Mana Potion e recuperou ${newMp - player.mp} MP!`;
        player.mp = newMp;
    } else if (itemId === 'strong-health-potion') {
        const healAmount = Math.floor(Math.random() * (325 - 275 + 1)) + 275; // Cura mais forte
        const newHp = Math.min(player.hp + healAmount, player.maxHp);
        message = `Você usou uma Strong Health Potion e recuperou ${newHp - player.hp} HP!`;
        player.hp = newHp;
    } else if (itemId === 'strong-mana-potion') {
        const manaAmount = Math.floor(Math.random() * (165 - 135 + 1)) + 135; // Mana mais forte
        const newMp = Math.min(player.mp + manaAmount, player.maxMp);
        message = `Você usou uma Strong Mana Potion e recuperou ${newMp - player.mp} MP!`;
        player.mp = newMp;
    }

    // Decrementa a quantidade do item
    slot.quantity -= 1;
    if (slot.quantity <= 0) {
        player.inventory.slots[slotIndex] = null;
    }
    savePlayer(player);
    return message;
}