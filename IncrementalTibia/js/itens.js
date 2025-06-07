export const equipableItems = {
    weapons: [
        { id: 'wooden_sword', name: 'Wooden Sword', slot: 'weapon', atk: 7, def: 7, image: 'assets/images/itens/weapons/wooden_sword.gif', price: 5, minLevel: 1 },
        { id: 'dagger', name: 'Dagger', slot: 'weapon', atk: 8, def: 6, image: 'assets/images/itens/weapons/dagger.gif', price: 50, minLevel: 1 },
        { id: 'katana', name: 'Katana', slot: 'weapon', atk: 16, def: 13, image: 'assets/images/itens/weapons/katana.gif', price: 200, minLevel: 2 },
        { id: 'broadsword', name: 'Broadsword', slot: 'weapon', atk: 26, def: 23, image: 'assets/images/itens/weapons/broadsword.gif', price: 800, minLevel: 5 },
        { id: 'crystal_sword', name: 'Crystal Sword', slot: 'weapon', atk: 35, def: 26, image: 'assets/images/itens/weapons/crystal_sword.gif', price: 7000, minLevel: 8 },
        { id: 'assassin_dagger', name: 'Assassin Dagger', slot: 'weapon', atk: 40, def: 10, image: 'assets/images/itens/weapons/assassin_dagger.gif', price: 40000, minLevel: 10 },
        { id: 'nightmare_blade', name: 'Nightmare Blade', slot: 'weapon', atk: 46, def: 20, image: 'assets/images/itens/weapons/nightmare_blade.gif', price: 60000, minLevel: 12 }
    ],
    shields: [
        { id: 'wooden_shield', name: 'Wooden Shield', slot: 'shield', def: 14, image: 'assets/images/itens/shields/wooden_shield.gif', price: 50, minLevel: 1 },
        { id: 'copper_shield', name: 'Copper Shield', slot: 'shield', def: 19, image: 'assets/images/itens/shields/copper_shield.gif', price: 200, minLevel: 2 },
        { id: 'dwarven_shield', name: 'Dwarven Shield', slot: 'shield', def: 26, image: 'assets/images/itens/shields/dwarven_shield.gif', price: 800, minLevel: 5 },
        { id: 'dragon_shield', name: 'Dragon Shield', slot: 'shield', def: 31, image: 'assets/images/itens/shields/dragon_shield.gif', price: 7000, minLevel: 8 },
        { id: 'demon_shield', name: 'Demon Shield', slot: 'shield', def: 35, image: 'assets/images/itens/shields/demon_shield.gif', price: 50000, minLevel: 10 }
    ],
    helmets: [
        { id: 'leather_helmet', name: 'Leather Helmet', slot: 'helmet', def: 1, image: 'assets/images/itens/helmets/leather_helmet.gif', price: 50, minLevel: 1 },
        { id: 'legion_helmet', name: 'Legion Helmet', slot: 'helmet', def: 4, image: 'assets/images/itens/helmets/legion_helmet.gif', price: 200, minLevel: 2 },
        { id: 'steel_helmet', name: 'Steel Helmet', slot: 'helmet', def: 6, image: 'assets/images/itens/helmets/steel_helmet.gif', price: 800, minLevel: 5 },
        { id: 'warrior_helmet', name: 'Warrior Helmet', slot: 'helmet', def: 8, image: 'assets/images/itens/helmets/warrior_helmet.gif', price: 7000, minLevel: 8 },
        { id: 'demon_helmet', name: 'Demon Helmet', slot: 'helmet', def: 10, image: 'assets/images/itens/helmets/demon_helmet.gif', price: 45000, minLevel: 10 }
    ],
    boots: [
        { id: 'leather_boots', name: 'Leather Boots', slot: 'boots', def: 1, image: 'assets/images/itens/boots/leather_boots.gif', price: 50, minLevel: 1 },
        { id: 'steel_boots', name: 'Steel Boots', slot: 'boots', def: 3, image: 'assets/images/itens/boots/steel_boots.gif', price: 200, minLevel: 2 },
        { id: 'boots_of_haste', name: 'Boots of Haste', slot: 'boots', def: 0, attackSpeed: 20, image: 'assets/images/itens/boots/boots_of_haste.gif', price: 7000, minLevel: 5 }
    ],
    legs: [
        { id: 'leather_legs', name: 'Leather Legs', slot: 'legs', def: 1, image: 'assets/images/itens/legs/leather_legs.gif', price: 50, minLevel: 1 },
        { id: 'studded_legs', name: 'Studded Legs', slot: 'legs', def: 2, image: 'assets/images/itens/legs/studded_legs.gif', price: 200, minLevel: 2 },
        { id: 'plate_legs', name: 'Plate Legs', slot: 'legs', def: 7, image: 'assets/images/itens/legs/plate_legs.gif', price: 800, minLevel: 5 },
        { id: 'knight_legs', name: 'Knight Legs', slot: 'legs', def: 8, image: 'assets/images/itens/legs/knight_legs.gif', price: 7000, minLevel: 8 },
        { id: 'golden_legs', name: 'Golden Legs', slot: 'legs', def: 9, image: 'assets/images/itens/legs/golden_legs.gif', price: 45000, minLevel: 10 }
    ],
    armors: [
        { id: 'leather_armor', name: 'Leather Armor', slot: 'armor', def: 4, image: 'assets/images/itens/chestplates/leather_armor.gif', price: 50, minLevel: 1 },
        { id: 'chain_armor', name: 'Chain Armor', slot: 'armor', def: 6, image: 'assets/images/itens/chestplates/chain_armor.gif', price: 200, minLevel: 2 },
        { id: 'plate_armor', name: 'Plate Armor', slot: 'armor', def: 10, image: 'assets/images/itens/chestplates/plate_armor.gif', price: 800, minLevel: 5 },
        { id: 'knight_armor', name: 'Knight Armor', slot: 'armor', def: 12, image: 'assets/images/itens/chestplates/knight_armor.gif', price: 7000, minLevel: 8 },
        { id: 'magic_plate_armor', name: 'Magic Plate Armor', slot: 'armor', def: 17, image: 'assets/images/itens/chestplates/magic_plate_armor.gif', price: 60000, minLevel: 10 }
    ],
    amulets: [
        { id: 'platinum_amulet', name: 'Platinum Amulet', slot: 'amulet', def: 2, image: 'assets/images/itens/amulets/platinum_amulet.gif', price: 50, minLevel: 1 },
        { id: 'beetle_necklace', name: 'Beetle Necklace', slot: 'amulet', def: 0, attackSpeed: 2, image: 'assets/images/itens/amulets/beetle_necklace.gif', price: 7000, minLevel: 5 }
    ]
};

// Função para calcular os stats do jogador com base nos itens equipados
export function updatePlayerStatsWithEquipment(player) {
    player.damage = 5; // Base damage
    player.defense = 0; // Base defense
    player.attackSpeed = 100; // Base attack speed (100% = normal speed)

    const equipment = player.inventory.equipment;
    for (const slot in equipment) {
        const item = equipment[slot];
        if (item) {
            player.damage += item.atk || 0; // Adiciona ataque se existir (apenas armas)
            player.defense += item.def || 0; // Adiciona defesa de qualquer item
            player.attackSpeed += item.attackSpeed || 0; // Adiciona attack speed (em percentual)
        }
    }
    // Garante que attack speed não seja negativo
    player.attackSpeed = Math.max(100, player.attackSpeed); // Mínimo de 100%
}

// Função para verificar se o jogador pode equipar um item
export function canEquipItem(player, item) {
    return player.level >= (item.minLevel || 1); // Verifica minLevel, com 1 como padrão
}