import { creatures } from './creatures/index.js';
import { player, checkLevelUp, savePlayer, addItemToInventory, resetPlayer } from './player.js';
import { updateStats, log } from './ui.js';
import { fight } from './combat.js';
import { trackMonsterKill, updateTasksUI } from './tasks.js';
import { useConsumable } from './consumables.js';
import { equipableItems, updatePlayerStatsWithEquipment, canEquipItem } from './itens.js';
import { setupShop } from './shop.js';
import { outfits, colorPalette } from './outfits.js';
import { config } from './config.js';

let isFighting = false;
let currentMonster = null;
let selectedMonsterKey = null;
let isTraining = false;
let trainingStartTime = 0;
let trainer = {
    name: 'Trainer',
    hp: 1000000,
    maxHp: 1000000,
    exp: 0,
    gold: 0,
    image: 'assets/images/creatures/trainer.gif'
};
let lastPlayerAttack = 0;

// Função para registrar logs específicos de combate
function combatLog(message) {
    log(message, false, 'combat-log');
}

// Função para registrar logs específicos de treino
function treinoLog(message) {
    log(message, false, 'treino-log');
}

// Função para inicializar as tasks
function initializeTasks() {
    const monsters = ['Rat', 'Troll', 'Rotworm', 'Chicken', 'Dragon Hatchling'];
    const initialTasks = monsters.map(monster => ({
        name: `${monster} 1`,
        monster: monster,
        level: 1,
        requiredKills: 10,
        rewardXp: 50,
        rewardGold: 50,
        kills: 0,
        completed: false
    }));

    if (!player.tasks || player.tasks.length === 0) {
        player.tasks = initialTasks;
        savePlayer(player);
    }
}

function updateGameUI(monster, player) {
    try {
        updateStats(player);
        const saldoElement = document.getElementById('saldo');
        if (saldoElement) saldoElement.textContent = player.gold;

        const characterName = document.getElementById('character-name');
        if (characterName && player.nickname) characterName.textContent = player.nickname;

        const monsterTitle = document.getElementById('monster-title');
        const monsterHp = document.getElementById('monster-hp');
        const monsterMaxHp = document.getElementById('monster-max-hp');
        const monsterImageContainer = document.getElementById('monster-image-container');
        const combatHp = document.getElementById('combat-hp');
        const combatMaxHp = document.getElementById('combat-max-hp');
        const combatMp = document.getElementById('combat-mp');
        const combatMaxMp = document.getElementById('combat-max-mp');
        const combatHpBar = document.getElementById('combat-hp-bar');
        const combatMpBar = document.getElementById('combat-mp-bar');
        const monsterHpBar = document.getElementById('monster-hp-bar');
        const trainerHp = document.getElementById('trainer-hp');
        const trainerMaxHp = document.getElementById('trainer-max-hp');
        const trainerHpBar = document.getElementById('trainer-hp-bar');
        const trainerImageContainer = document.getElementById('trainer-image-container');

        if (monster && monster.name !== 'Trainer') {
            if (monsterTitle) monsterTitle.textContent = monster.name;
            if (monsterHp) monsterHp.textContent = monster.hp;
            if (monsterMaxHp) monsterMaxHp.textContent = monster.maxHp;
            if (monsterImageContainer) {
                monsterImageContainer.innerHTML = `<img src="${monster.image || `assets/images/creatures/${selectedMonsterKey || 'default'}.gif`}" alt="${monster.name}" onerror="this.src='assets/images/creatures/default.gif'">`;
            }
            if (monsterHpBar) {
                monsterHpBar.style.width = (monster.hp / monster.maxHp) * 100 + '%';
            }
        } else {
            if (monsterTitle) monsterTitle.textContent = '-';
            if (monsterHp) monsterHp.textContent = '-';
            if (monsterMaxHp) monsterMaxHp.textContent = '-';
            if (monsterImageContainer) monsterImageContainer.innerHTML = '';
            if (monsterHpBar) monsterHpBar.style.width = '0%';
        }

        if (combatHp) combatHp.textContent = player.hp;
        if (combatMaxHp) combatMaxHp.textContent = player.maxHp;
        if (combatMp) combatMp.textContent = player.mp;
        if (combatMaxMp) combatMaxMp.textContent = player.maxMp;
        if (combatHpBar) combatHpBar.style.width = (player.hp / player.maxHp) * 100 + '%';
        if (combatMpBar) combatMpBar.style.width = (player.mp / player.maxMp) * 100 + '%';

        if (trainerHp && trainerMaxHp && trainerHpBar && isTraining) {
            trainerHp.textContent = trainer.hp;
            trainerMaxHp.textContent = trainer.maxHp;
            trainerImageContainer.innerHTML = `<img src="${trainer.image}" alt="Trainer">`;
            trainerHpBar.style.width = (trainer.hp / trainer.maxHp) * 100 + '%';
        }

        // Renderiza os botões de poções dinamicamente
        const potionButtons = document.querySelector('.potion-buttons');
        if (potionButtons) {
            potionButtons.innerHTML = '';

            const potions = [
                { id: 'health-potion', name: 'Health Potion', image: 'assets/images/itens/potions/health_potion.gif' },
                { id: 'mana-potion', name: 'Mana Potion', image: 'assets/images/itens/potions/mana_potion.gif' },
                { id: 'strong-health-potion', name: 'Strong Health Potion', image: 'assets/images/itens/potions/strong_health_potion.gif' },
                { id: 'strong-mana-potion', name: 'Strong Mana Potion', image: 'assets/images/itens/potions/strong_mana_potion.gif' }
            ];

            potions.forEach(potion => {
                const count = player.inventory.slots.reduce((sum, slot) => {
                    return sum + (slot && slot.id === potion.id && slot.type === 'consumable' ? (slot.quantity || 1) : 0);
                }, 0);

                if (count > 0) {
                    const button = document.createElement('button');
                    button.id = `use-${potion.id}`;
                    button.innerHTML = `<img src="${potion.image}" alt="${potion.name}" width="20"> Usar <span class="potion-count">x${count}</span>`;
                    button.addEventListener('click', () => {
                        const slotIndex = player.inventory.slots.findIndex(slot => slot && slot.id === potion.id && slot.type === 'consumable');
                        if (slotIndex !== -1) {
                            const message = useConsumable(player, potion.id, slotIndex);
                            combatLog(message);
                            updateGameUI(monster || trainer, player);
                            updateStats(player);
                            savePlayer(player);
                        }
                    });
                    potionButtons.appendChild(button);
                }
            });
        }

        // Renderiza os itens equipados nos slots de equipamento
        const equipmentSlots = document.querySelectorAll('.inventory-slot');
        equipmentSlots.forEach(slot => {
            const slotName = slot.getAttribute('data-index');
            const item = player.inventory.equipment[slotName] || null;
            const slotNumber = slot.getAttribute('data-slot');
            const formattedSlotNumber = slotNumber.padStart(2, '0');
            slot.innerHTML = item ? `<img src="${item.image}" alt="${item.name}" title="${item.name}" draggable="true">` : `<img src="assets/images/itens/inventory/${formattedSlotNumber}.gif" alt="${slotName}" onerror="this.src='assets/images/itens/inventory/01.gif'" draggable="false">`;
        });

        // Renderiza o outfit do personagem
        updateOutfitUI(player);
    } catch (error) {
        console.error('Erro ao atualizar a UI do jogo:', error);
    }
}

// Função para atualizar a UI do outfit
function updateOutfitUI(player) {
    const outfitSprite = document.getElementById('outfit-sprite');
    const outfitName = document.getElementById('outfit-name');
    const maleButton = document.getElementById('gender-male');
    const femaleButton = document.getElementById('gender-female');

    if (outfitSprite && outfitName) {
        const currentOutfit = outfits.find(o => o.id === player.outfit.id);
        outfitSprite.src = player.outfit.gender === 'male' ? currentOutfit.maleSprite : currentOutfit.femaleSprite;
        outfitName.textContent = currentOutfit.name;

        const headColor = player.outfit.colors.head;
        const primaryColor = player.outfit.colors.primary;
        const secondaryColor = player.outfit.colors.secondary;
        const detailColor = player.outfit.colors.detail;
        outfitSprite.style.filter = `hue-rotate(${getHueFromColor(primaryColor)}deg)`;
    }

    if (maleButton && femaleButton) {
        maleButton.classList.toggle('active', player.outfit.gender === 'male');
        femaleButton.classList.toggle('active', player.outfit.gender === 'female');
    }

    document.querySelectorAll('.color-grid').forEach(grid => {
        const part = grid.dataset.part;
        grid.innerHTML = '';
        colorPalette.forEach(color => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color;
            swatch.classList.toggle('selected', player.outfit.colors[part] === color);
            swatch.addEventListener('click', () => {
                player.outfit.colors[part] = color;
                savePlayer(player);
                updateOutfitUI(player);
            });
            grid.appendChild(swatch);
        });
    });
}

function getHueFromColor(hexColor) {
    const r = parseInt(hexColor.slice(1, 3), 16) / 255;
    const g = parseInt(hexColor.slice(3, 5), 16) / 255;
    const b = parseInt(hexColor.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let hue = 0;

    if (max === min) {
        hue = 0;
    } else if (max === r) {
        hue = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max === g) {
        hue = (60 * ((b - r) / (max - min)) + 120);
    } else if (max === b) {
        hue = (60 * ((r - g) / (max - min)) + 240);
    }

    return hue;
}

function spawnMonster() {
    if (selectedMonsterKey && isFighting) {
        currentMonster = { ...creatures[selectedMonsterKey], hp: creatures[selectedMonsterKey].maxHp, lastSkillUse: {} };
        if (!currentMonster.image) {
            currentMonster.image = `assets/images/creatures/${selectedMonsterKey}.gif`;
        }
        combatLog(`Um novo ${currentMonster.name} apareceu!`);
        updateGameUI(currentMonster, player);
    }
}

function combatLoop() {
    try {
        if (!isFighting && !isTraining) return;

        const currentTime = Date.now();

        if (isFighting) {
            const attackInterval = 1000 / (player.attackSpeed / 100);
            if (currentTime - lastPlayerAttack >= attackInterval) {
                const monsterKilled = fight(player, currentMonster, combatLog);
                lastPlayerAttack = currentTime;
                if (monsterKilled) {
                    trackMonsterKill(currentMonster.name, combatLog);
                    checkLevelUp(combatLog);
                    currentMonster = null;
                    savePlayer(player);
                    setTimeout(() => {
                        if (isFighting) spawnMonster();
                    }, 2000);
                } else if (player.hp <= 0) {
                    combatLog("Você morreu! Reiniciando...");
                    player.hp = player.maxHp;
                    player.mp = player.maxMp;
                    isFighting = false;
                    const huntButton = document.getElementById("hunt-button");
                    const stopButton = document.getElementById("stop-button");
                    const dropdownButton = document.getElementById("dropdown-button");
                    if (huntButton) huntButton.disabled = true;
                    if (stopButton) stopButton.disabled = true;
                    if (dropdownButton) dropdownButton.textContent = "Escolha um monstro";
                    selectedMonsterKey = null;
                    savePlayer(player);
                    updateGameUI(currentMonster, player);
                } else {
                    updateGameUI(currentMonster, player);
                }
            }
        }

        if (isTraining) {
            if (Date.now() - trainingStartTime >= config.trainingDuration) {
                treinoLog("O tempo de treinamento acabou!");
                isTraining = false;
                const startTrainingButton = document.getElementById("start-training");
                const stopTrainingButton = document.getElementById("stop-training");
                if (startTrainingButton) startTrainingButton.disabled = false;
                if (stopTrainingButton) stopTrainingButton.disabled = true;
                savePlayer(player);
                updateGameUI(trainer, player);
                return;
            }

            const attackInterval = 1000 / (player.attackSpeed / 100);
            if (currentTime - lastPlayerAttack >= attackInterval) {
                const damage = Math.max(1, Math.floor(player.damage / 2));
                trainer.hp = Math.max(0, trainer.hp - damage);
                lastPlayerAttack = currentTime;

                const equippedWeapon = player.inventory.equipment.weapon;
                let skillToTrain = player.skills.sword;
                if (equippedWeapon) {
                    if (equippedWeapon.id.includes('axe')) skillToTrain = player.skills.axe;
                    else if (equippedWeapon.id.includes('club')) skillToTrain = player.skills.club;
                    else if (equippedWeapon.id.includes('sword') || equippedWeapon.id.includes('dagger') || equippedWeapon.id.includes('katana')) skillToTrain = player.skills.sword;
                }

                const skillIncrease = Math.floor(damage * config.skillXpMultiplier);
                const skillMessage = trainSkill(skillToTrain, skillIncrease);
                if (skillMessage) treinoLog(skillMessage);

                if (player.inventory.equipment.shield) {
                    const shieldIncrease = Math.floor(damage * config.skillXpMultiplier * 0.5);
                    const shieldMessage = trainSkill(player.skills.shielding, shieldIncrease);
                    if (shieldMessage) treinoLog(shieldMessage);
                }

                if (trainer.hp <= 0) {
                    treinoLog("O Trainer foi derrotado! Treinamento concluído.");
                    isTraining = false;
                    const startTrainingButton = document.getElementById("start-training");
                    const stopTrainingButton = document.getElementById("stop-training");
                    if (startTrainingButton) startTrainingButton.disabled = false;
                    if (stopTrainingButton) stopTrainingButton.disabled = true;
                }

                player.hp = Math.min(player.maxHp, player.hp + 5);
                savePlayer(player);
                updateGameUI(trainer, player);
            }
        }
    } catch (error) {
        console.error('Erro no loop de combate:', error);
    }
}

function startHunting() {
    if (!isFighting && selectedMonsterKey) {
        isFighting = true;
        lastPlayerAttack = 0;
        spawnMonster();
        combatLog(`Você começou a caçar ${creatures[selectedMonsterKey].name}s!`);
        const huntButton = document.getElementById("hunt-button");
        const stopButton = document.getElementById("stop-button");
        if (huntButton) huntButton.disabled = true;
        if (stopButton) stopButton.disabled = false;
    }
}

function stopHunting() {
    if (isFighting) {
        isFighting = false;
        currentMonster = null;
        selectedMonsterKey = null;
        const huntButton = document.getElementById("hunt-button");
        const stopButton = document.getElementById("stop-button");
        const dropdownButton = document.getElementById("dropdown-button");
        if (huntButton) huntButton.disabled = true;
        if (stopButton) stopButton.disabled = true;
        if (dropdownButton) dropdownButton.textContent = "Escolha um monstro";
        combatLog("Você parou de caçar.");
        savePlayer(player);
        updateGameUI(currentMonster, player);
    }
}

function startTraining() {
    if (!isTraining && player.vocacao && player.gold >= config.trainingCost) {
        player.gold -= config.trainingCost;
        isTraining = true;
        trainingStartTime = Date.now();
        trainer.hp = trainer.maxHp;
        treinoLog(`Você pagou ${config.trainingCost} gold e começou a treinar como ${player.vocacao}!`);
        const startTrainingButton = document.getElementById("start-training");
        const stopTrainingButton = document.getElementById("stop-training");
        if (startTrainingButton) startTrainingButton.disabled = true;
        if (stopTrainingButton) stopTrainingButton.disabled = false;
        updateGameUI(trainer, player);
    } else if (!player.vocacao) {
        treinoLog("Você precisa escolher uma vocação para treinar!");
    } else {
        treinoLog(`Você precisa de ${config.trainingCost} gold para treinar!`);
    }
}

function stopTraining() {
    if (isTraining) {
        isTraining = false;
        treinoLog("Você parou de treinar.");
        const startTrainingButton = document.getElementById("start-training");
        const stopTrainingButton = document.getElementById("stop-training");
        if (startTrainingButton) startTrainingButton.disabled = false;
        if (stopTrainingButton) stopTrainingButton.disabled = true;
        savePlayer(player);
        updateGameUI(trainer, player);
    }
}

function setupMonsterSelection() {
    const dropdownButton = document.getElementById("dropdown-button");
    const monsterList = document.getElementById("monster-list");
    if (!dropdownButton || !monsterList) {
        console.error("Elementos do dropdown não encontrados!");
        return;
    }
    Object.entries(creatures).forEach(([key, monster]) => {
        const option = document.createElement("div");
        option.className = "monster-option";
        option.innerHTML = `<img src="assets/images/creatures/${key}.gif" alt="${monster.name}" onerror="this.src='assets/images/creatures/default.gif'"><span>${monster.name}</span>`;
        option.addEventListener("click", () => {
            selectedMonsterKey = key;
            currentMonster = null;
            combatLog(`Você escolheu caçar ${monster.name}s!`);
            const huntButton = document.getElementById("hunt-button");
            const stopButton = document.getElementById("stop-button");
            if (huntButton) huntButton.disabled = false;
            if (stopButton) stopButton.disabled = false;
            dropdownButton.textContent = monster.name;
            monsterList.classList.remove("show");
            updateGameUI(currentMonster, player);
        });
        monsterList.appendChild(option);
    });
    dropdownButton.addEventListener("click", () => monsterList.classList.toggle("show"));
    document.addEventListener("click", (e) => {
        if (!dropdownButton.contains(e.target) && !monsterList.contains(e.target)) monsterList.classList.remove("show");
    });
}

function showNicknameModal() {
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) gameContainer.style.display = 'none';

    const modal = document.createElement('div');
    modal.id = 'nickname-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Escolha seu Apelido</h2>
            </div>
            <div class="modal-body">
                <input type="text" id="nickname-input" placeholder="Digite seu apelido" maxlength="20">
            </div>
            <div class="modal-footer">
                <button id="save-nickname">Confirmar</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('save-nickname').addEventListener('click', () => {
        const nickname = document.getElementById('nickname-input').value.trim();
        if (nickname) {
            player.nickname = nickname;
            const characterName = document.getElementById('character-name');
            if (characterName) characterName.textContent = nickname;
            savePlayer(player);
            modal.remove();
            if (gameContainer) gameContainer.style.display = 'flex';
            updateGameUI(currentMonster || trainer, player);
            enableTrainingButton();
        } else {
            alert('Por favor, insira um apelido válido!');
        }
    });
}

function setupDragAndDrop() {
    const slots = document.querySelectorAll('.backpack-slot, .inventory-slot, .trash-slot, .sell-slot');
    let draggedItem = null;

    slots.forEach(slot => {
        slot.addEventListener('dragstart', (e) => {
            draggedItem = slot;
            const index = slot.getAttribute('data-index');
            const isEquipmentSlot = slot.classList.contains('inventory-slot');
            let item;

            if (isEquipmentSlot) {
                item = player.inventory.equipment[index];
            } else {
                const backpackIndex = parseInt(index);
                item = player.inventory.slots[backpackIndex];
            }

            if (item) {
                e.dataTransfer.setData('text/plain', index);
                e.dataTransfer.setData('item', JSON.stringify(item));
                e.dataTransfer.setData('from', isEquipmentSlot ? 'equipment' : 'backpack');
            } else {
                e.preventDefault();
            }
        });

        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.classList.add('drag-over');
        });

        slot.addEventListener('dragleave', () => {
            slot.classList.remove('drag-over');
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.classList.remove('drag-over');
            const fromIndex = e.dataTransfer.getData('text/plain');
            const itemData = JSON.parse(e.dataTransfer.getData('item'));
            const fromType = e.dataTransfer.getData('from');
            const toSlot = slot.classList;

            if (toSlot.contains('trash-slot')) {
                if (fromType === 'backpack') {
                    player.inventory.slots[fromIndex] = null;
                } else if (fromType === 'equipment') {
                    player.inventory.equipment[fromIndex] = null;
                    updatePlayerStatsWithEquipment(player);
                }
                combatLog(`Item ${itemData.name} foi deletado!`);
            } else if (toSlot.contains('sell-slot') && itemData.price) {
                const sellPrice = Math.floor(itemData.price / 3);
                player.gold += sellPrice;
                if (fromType === 'backpack') {
                    player.inventory.slots[fromIndex] = null;
                } else if (fromType === 'equipment') {
                    player.inventory.equipment[fromIndex] = null;
                    updatePlayerStatsWithEquipment(player);
                }
                combatLog(`Item ${itemData.name} vendido por ${sellPrice} gold!`);
            } else if (toSlot.contains('backpack-slot') && fromType === 'equipment') {
                const toIndex = parseInt(slot.getAttribute('data-index'));
                if (player.inventory.slots[toIndex] === null) {
                    player.inventory.slots[toIndex] = itemData;
                    player.inventory.equipment[fromIndex] = null;
                    updatePlayerStatsWithEquipment(player);
                    combatLog(`Você desequipou ${itemData.name}!`);
                } else {
                    combatLog(`Slot ${toIndex + 1} da mochila já está ocupado!`);
                }
            } else if (toSlot.contains('inventory-slot') && fromType === 'backpack') {
                const toIndex = slot.getAttribute('data-index');
                if (itemData.slot === toIndex && canEquipItem(player, itemData)) {
                    if (player.inventory.equipment[toIndex]) {
                        addItemToInventory(player.inventory.equipment[toIndex]);
                    }
                    player.inventory.equipment[toIndex] = itemData;
                    player.inventory.slots[fromIndex] = null;
                    updatePlayerStatsWithEquipment(player);
                    combatLog(`Você equipou ${itemData.name}!`);
                } else if (itemData.slot !== toIndex) {
                    combatLog(`O item ${itemData.name} não pode ser equipado no slot ${toIndex}!`);
                } else {
                    combatLog(`Você precisa do nível ${itemData.minLevel} para equipar ${itemData.name}!`);
                }
            } else if (toSlot.contains('backpack-slot') && fromType === 'backpack') {
                const toIndex = parseInt(slot.getAttribute('data-index'));
                const temp = player.inventory.slots[toIndex];
                player.inventory.slots[toIndex] = itemData;
                player.inventory.slots[fromIndex] = temp;
            }

            savePlayer(player);
            updateGameUI(currentMonster || trainer, player);
        });

        slot.addEventListener('dragend', () => {
            draggedItem = null;
        });
    });
}

function setupOutfitControls() {
    const prevOutfitButton = document.getElementById('prev-outfit');
    const nextOutfitButton = document.getElementById('next-outfit');
    const maleButton = document.getElementById('gender-male');
    const femaleButton = document.getElementById('gender-female');

    if (prevOutfitButton && nextOutfitButton) {
        prevOutfitButton.addEventListener('click', () => {
            const currentIndex = outfits.findIndex(o => o.id === player.outfit.id);
            const newIndex = (currentIndex - 1 + outfits.length) % outfits.length;
            player.outfit.id = outfits[newIndex].id;
            savePlayer(player);
            updateOutfitUI(player);
        });

        nextOutfitButton.addEventListener('click', () => {
            const currentIndex = outfits.findIndex(o => o.id === player.outfit.id);
            const newIndex = (currentIndex + 1) % outfits.length;
            player.outfit.id = outfits[newIndex].id;
            savePlayer(player);
            updateOutfitUI(player);
        });
    }

    if (maleButton && femaleButton) {
        maleButton.addEventListener('click', () => {
            player.outfit.gender = 'male';
            savePlayer(player);
            updateOutfitUI(player);
        });

        femaleButton.addEventListener('click', () => {
            player.outfit.gender = 'female';
            savePlayer(player);
            updateOutfitUI(player);
        });
    }
}

function enableTrainingButton() {
    const startTrainingButton = document.getElementById("start-training");
    if (startTrainingButton) {
        startTrainingButton.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('DOM carregado, iniciando jogo...');
        if (!player.nickname) showNicknameModal();
        
        initializeTasks();
        
        setInterval(combatLoop, 100);
        setupMonsterSelection();
        setupShop();
        setupDragAndDrop();
        setupOutfitControls();

        const huntButton = document.getElementById('hunt-button');
        const stopButton = document.getElementById('stop-button');
        if (huntButton) huntButton.addEventListener('click', startHunting);
        if (stopButton) stopButton.addEventListener('click', stopHunting);

        const startTrainingButton = document.getElementById('start-training');
        const stopTrainingButton = document.getElementById('stop-training');
        if (startTrainingButton) startTrainingButton.addEventListener('click', startTraining);
        if (stopTrainingButton) stopTrainingButton.addEventListener('click', stopTraining);

        const confirmResetButton = document.getElementById('confirm-reset');
        if (confirmResetButton) {
            confirmResetButton.addEventListener('click', () => {
                localStorage.clear();
                resetPlayer();
                showNicknameModal();
                log("Jogo resetado com sucesso!", true, 'reset-log');
                savePlayer(player);
                updateGameUI(currentMonster || trainer, player);
                updateTasksUI();
                initializeTasks();
            });
        }

        enableTrainingButton();
        updateGameUI(currentMonster || trainer, player);
        updateTasksUI();
    } catch (error) {
        console.error('Erro ao inicializar o jogo:', error);
    }
});