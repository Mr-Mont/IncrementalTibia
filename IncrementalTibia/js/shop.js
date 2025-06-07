import { equipableItems } from './itens.js';
import { player, savePlayer, addItemToInventory } from './player.js';
import { log, updateStats } from './ui.js';

function shopLog(message) {
    log(message, false, 'shop-log');
}

export function setupShop() {
    const shopSection = document.getElementById("shop");
    if (!shopSection) return;

    const shopContent = `
        <div class="shop-tabs">
            <button class="tab-button active" data-tab="potions">Poções</button>
            <button class="tab-button" data-tab="weapons">Armas</button>
            <button class="tab-button" data-tab="shields">Escudos</button>
            <button class="tab-button" data-tab="helmets">Capacetes</button>
            <button class="tab-button" data-tab="boots">Botas</button>
            <button class="tab-button" data-tab="legs">Calças</button>
            <button class="tab-button" data-tab="armors">Armaduras</button>
            <button class="tab-button" data-tab="amulets">Colares</button>
        </div>
        <div class="shop-inventory">
            <div class="tab-content" id="potions-tab">
                <h3>Poções</h3>
                <div class="shop-grid" id="potions-grid"></div>
            </div>
            <div class="tab-content" id="weapons-tab" style="display: none;">
                <h3>Armas</h3>
                <div class="shop-grid" id="weapons-grid"></div>
            </div>
            <div class="tab-content" id="shields-tab" style="display: none;">
                <h3>Escudos</h3>
                <div class="shop-grid" id="shields-grid"></div>
            </div>
            <div class="tab-content" id="helmets-tab" style="display: none;">
                <h3>Capacetes</h3>
                <div class="shop-grid" id="helmets-grid"></div>
            </div>
            <div class="tab-content" id="boots-tab" style="display: none;">
                <h3>Botas</h3>
                <div class="shop-grid" id="boots-grid"></div>
            </div>
            <div class="tab-content" id="legs-tab" style="display: none;">
                <h3>Calças</h3>
                <div class="shop-grid" id="legs-grid"></div>
            </div>
            <div class="tab-content" id="armors-tab" style="display: none;">
                <h3>Armaduras</h3>
                <div class="shop-grid" id="armors-grid"></div>
            </div>
            <div class="tab-content" id="amulets-tab" style="display: none;">
                <h3>Colares</h3>
                <div class="shop-grid" id="amulets-grid"></div>
            </div>
        </div>
    `;

    const logContainer = shopSection.querySelector('.log');
    if (logContainer) {
        shopSection.insertBefore(document.createRange().createContextualFragment(shopContent), logContainer);
    } else {
        shopSection.innerHTML = shopContent + '<div class="log"><div id="shop-log" class="log-container"></div></div>';
    }

    function renderShopItems(category, gridId) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = '';

        if (equipableItems[category]) {
            equipableItems[category].forEach((item) => {
                const slot = document.createElement('div');
                slot.className = 'shop-slot';
                slot.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='assets/images/default.gif'">
                    <div class="item-info">
                        <span>${item.name}</span>
                        <span>Atk: ${item.atk || 0}, Def: ${item.def || 0}${item.attackSpeed ? `, +${item.attackSpeed}% Speed` : ''}</span>
                        <span>Preço: ${item.price} gold</span>
                    </div>
                    <div class="tooltip">${item.name}<br>Atk: ${item.atk || 0}, Def: ${item.def || 0}${item.attackSpeed ? `, Speed: +${item.attackSpeed}%` : ''}<br>Nível: ${item.minLevel || 1}</div>
                    <button class="buy-button" data-item-id="${item.id}" data-category="${category}">Comprar</button>
                `;
                grid.appendChild(slot);
            });
        }

        if (category === 'potions') {
            const potions = [
                { id: 'health-potion', name: 'Health Potion', image: 'assets/images/itens/potions/health_potion.gif', price: 10, type: 'consumable' },
                { id: 'mana-potion', name: 'Mana Potion', image: 'assets/images/itens/potions/mana_potion.gif', price: 10, type: 'consumable' },
                { id: 'strong-health-potion', name: 'Strong Health Potion', image: 'assets/images/itens/potions/strong_health_potion.gif', price: 50, type: 'consumable' },
                { id: 'strong-mana-potion', name: 'Strong Mana Potion', image: 'assets/images/itens/potions/strong_mana_potion.gif', price: 50, type: 'consumable' }
            ];
            potions.forEach((potion) => {
                const slot = document.createElement('div');
                slot.className = 'shop-slot';
                slot.innerHTML = `
                    <img src="${potion.image}" alt="${potion.name}" onerror="this.src='assets/images/default.gif'">
                    <div class="item-info">
                        <span>${potion.name}</span>
                        <span>Preço: ${potion.price} gold</span>
                    </div>
                    <div class="tooltip">${potion.name}<br>Preço: ${potion.price} gold</div>
                    <button class="buy-button" data-item-id="${potion.id}" data-category="${category}">Comprar</button>
                `;
                grid.appendChild(slot);
            });
        }
    }

    renderShopItems('weapons', 'weapons-grid');
    renderShopItems('shields', 'shields-grid');
    renderShopItems('helmets', 'helmets-grid');
    renderShopItems('boots', 'boots-grid');
    renderShopItems('legs', 'legs-grid');
    renderShopItems('armors', 'armors-grid');
    renderShopItems('amulets', 'amulets-grid');
    renderShopItems('potions', 'potions-grid');

    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
            document.getElementById(`${button.dataset.tab}-tab`).style.display = 'block';
        });
    });

    shopSection.addEventListener('click', (e) => {
        const button = e.target.closest('.buy-button');
        if (!button) return;

        const itemId = button.dataset.itemId;
        const category = button.dataset.category;

        let itemToBuy;
        if (category === 'potions') {
            const potions = [
                { id: 'health-potion', name: 'Health Potion', image: 'assets/images/itens/potions/health_potion.gif', price: 10, type: 'consumable' },
                { id: 'mana-potion', name: 'Mana Potion', image: 'assets/images/itens/potions/mana_potion.gif', price: 10, type: 'consumable' },
                { id: 'strong-health-potion', name: 'Strong Health Potion', image: 'assets/images/itens/potions/strong_health_potion.gif', price: 50, type: 'consumable' },
                { id: 'strong-mana-potion', name: 'Strong Mana Potion', image: 'assets/images/itens/potions/strong_mana_potion.gif', price: 50, type: 'consumable' }
            ];
            itemToBuy = potions.find(p => p.id === itemId);
        } else {
            itemToBuy = equipableItems[category].find(item => item.id === itemId);
            itemToBuy.type = 'equipment';
        }

        if (player.gold >= itemToBuy.price) {
            player.gold -= itemToBuy.price;
            const itemToAdd = { ...itemToBuy, quantity: 1 };
            const added = addItemToInventory(itemToAdd);
            if (added) {
                shopLog(`Comprado ${itemToBuy.name}!`);
                updateStats(player);
                savePlayer(player);
            } else {
                shopLog("Inventário cheio! Não foi possível adicionar " + itemToBuy.name);
            }
        } else {
            shopLog("Saldo insuficiente para comprar " + itemToBuy.name + "!");
        }
    });
}