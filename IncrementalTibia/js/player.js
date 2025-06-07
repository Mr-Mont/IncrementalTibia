import { getExpForLevel } from './exptable.js';
import { initializeSkills } from './skills.js';
import { updatePlayerStatsWithEquipment } from './itens.js';

export let player = null;

// Função para carregar ou inicializar o jogador
function loadPlayer() {
    const savedPlayer = localStorage.getItem('tibiaPlayer');
    let initializedPlayer;
    if (savedPlayer) {
        initializedPlayer = JSON.parse(savedPlayer);
        // Garante que slots e equipment existam
        if (!initializedPlayer.inventory) {
            initializedPlayer.inventory = {
                slots: Array(20).fill(null),
                equipment: {
                    amulet: null,
                    helmet: null,
                    backpack: null,
                    weapon: null,
                    armor: null,
                    shield: null,
                    ring: null,
                    legs: null,
                    arrow: null,
                    boots: null
                }
            };
        }
        // Garante que os slots de equipamento existam
        const equipmentKeys = ['amulet', 'helmet', 'backpack', 'weapon', 'armor', 'shield', 'ring', 'legs', 'arrow', 'boots'];
        equipmentKeys.forEach(key => {
            if (!initializedPlayer.inventory.equipment[key]) {
                initializedPlayer.inventory.equipment[key] = null;
            }
        });
        // Garante que os slots da mochila tenham o tamanho correto
        if (!initializedPlayer.inventory.slots || initializedPlayer.inventory.slots.length !== 20) {
            initializedPlayer.inventory.slots = Array(20).fill(null);
        }
        // Inicializa tasks se não existirem
        if (!initializedPlayer.tasks) {
            initializedPlayer.tasks = [];
        }
        // Remove consumables se existir
        if (initializedPlayer.consumables) {
            delete initializedPlayer.consumables;
        }
        // Garante que outfit exista
        if (!initializedPlayer.outfit) {
            initializedPlayer.outfit = {
                id: 'citizen',
                gender: 'male', // Pode ser 'male' ou 'female'
                colors: {
                    head: '#FFFFFF',
                    primary: '#FFD7D7',
                    secondary: '#FFAFD7',
                    detail: '#FF87D7'
                }
            };
        }
    } else {
        initializedPlayer = {
            level: 1,
            xp: 0,
            hp: 150,
            maxHp: 150,
            mp: 50,
            maxMp: 50,
            gold: 0,
            vocacao: '',
            skills: initializeSkills(),
            damage: 5,
            defense: 0,
            attackSpeed: 100,
            inventory: {
                slots: Array(20).fill(null),
                equipment: {
                    amulet: null,
                    helmet: null,
                    backpack: null,
                    weapon: null,
                    armor: null,
                    shield: null,
                    ring: null,
                    legs: null,
                    arrow: null,
                    boots: null
                }
            },
            tasks: [],
            outfit: {
                id: 'citizen',
                gender: 'male',
                colors: {
                    head: '#FFFFFF',
                    primary: '#FFD7D7',
                    secondary: '#FFAFD7',
                    detail: '#FF87D7'
                }
            }
        };
    }
    // Atualiza os stats do jogador com base nos itens equipados
    updatePlayerStatsWithEquipment(initializedPlayer);
    return initializedPlayer;
}

// Inicializa o jogador
player = loadPlayer();

// Função para salvar o jogador no localStorage
export function savePlayer(player) {
    localStorage.setItem('tibiaPlayer', JSON.stringify(player));
}

// Função para adicionar um item ao inventário
export function addItemToInventory(item) {
    // Primeiro, verifica se o item já existe no inventário e é empilhável
    const existingSlotIndex = player.inventory.slots.findIndex(slot => 
        slot && slot.id === item.id && slot.quantity < 100 && slot.type === item.type
    );

    if (existingSlotIndex !== -1) {
        // Se o item já existe e é empilhável, aumenta a quantidade
        player.inventory.slots[existingSlotIndex].quantity += item.quantity || 1;
        savePlayer(player);
        return true;
    }

    // Se não existe ou não é empilhável, procura um slot vazio
    const emptySlotIndex = player.inventory.slots.findIndex(slot => !slot);
    if (emptySlotIndex !== -1) {
        player.inventory.slots[emptySlotIndex] = { ...item, quantity: item.quantity || 1 };
        savePlayer(player);
        return true;
    }

    return false; // Inventário cheio
}

// Função para verificar se o jogador subiu de nível
export function checkLevelUp(log) {
    while (player.xp >= getExpForLevel(player.level + 1)) {
        player.level += 1;
        const hpGain = player.level >= 9 ? 10 : 5;
        const mpGain = 5;
        player.maxHp += hpGain;
        player.hp = player.maxHp;
        player.maxMp += mpGain;
        player.mp = player.maxMp;

        // Promoção para Knight no nível 8
        if (player.level === 8 && !player.vocacao) {
            player.vocacao = 'Knight';
            log('Parabéns! Você foi promovido a Knight!', true);
        }

        log(`Parabéns! Você subiu para o nível ${player.level}!`, true);
        savePlayer(player);
    }
}

// Função para resetar o jogador
export function resetPlayer() {
    localStorage.removeItem('tibiaPlayer');
    player = loadPlayer();
}