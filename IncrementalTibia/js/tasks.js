// tasks.js
import { player, savePlayer } from './player.js';

// Função para registrar a morte de um monstro e atualizar as tasks
export function trackMonsterKill(monsterName, log) {
    const task = player.tasks.find(t => t.monster === monsterName && t.level === getCurrentTaskLevel(monsterName) && !t.completed);
    if (task) {
        task.kills = (task.kills || 0) + 1;
        log(`Você matou ${task.kills}/${task.requiredKills} ${monsterName}s para a task ${task.name}!`);
        
        // Atualiza a barra de progresso e o contador
        updateQuestProgress(task);

        if (task.kills >= task.requiredKills) {
            log(`Task ${task.name} concluída! Você ganhou ${task.rewardXp} XP e ${task.rewardGold} gold!`, true);
            player.xp += task.rewardXp;
            player.gold += task.rewardGold;
            task.completed = true;

            // Adiciona a próxima task (ex.: Rats 1 → Rats 2)
            const currentLevel = task.level;
            if (currentLevel < 10) { // Limite de 10 níveis
                const nextLevel = currentLevel + 1;
                const nextRequiredKills = task.requiredKills * 2; // Dobra o número de kills
                const nextRewardXp = Math.floor(task.rewardXp * 1.5); // +50% da recompensa base
                const nextRewardGold = Math.floor(task.rewardGold * 1.5); // +50% da recompensa base
                player.tasks.push({
                    name: `${monsterName} ${nextLevel}`,
                    monster: monsterName,
                    level: nextLevel,
                    requiredKills: nextRequiredKills,
                    rewardXp: nextRewardXp,
                    rewardGold: nextRewardGold,
                    kills: 0,
                    completed: false
                });
                log(`Nova task disponível: ${monsterName} ${nextLevel} - Matar ${nextRequiredKills} ${monsterName}s!`);
            }

            savePlayer(player);
            updateTasksUI(); // Atualiza a UI das tasks
        }
    }
}

// Função para obter o nível atual de uma task para um monstro
function getCurrentTaskLevel(monsterName) {
    const tasksForMonster = player.tasks.filter(t => t.monster === monsterName && t.completed);
    return tasksForMonster.length + 1; // Próximo nível disponível
}

// Função para atualizar a barra de progresso e o contador
function updateQuestProgress(task) {
    const taskElement = document.querySelector(`#tasks-list [data-task="${task.name}"]`);
    if (taskElement) {
        // Atualiza a barra de progresso
        const progressBar = taskElement.querySelector('.progress');
        if (progressBar) {
            const progress = (task.kills / task.requiredKills) * 100;
            progressBar.style.width = `${Math.min(100, progress)}%`;
        }

        // Atualiza o texto do contador
        const counterElement = taskElement.querySelector('.task-counter');
        if (counterElement) {
            counterElement.textContent = `${task.kills || 0}/${task.requiredKills}`;
        }
    }
}

// Função para atualizar a UI das tasks
function updateTasksUI() {
    const tasksList = document.getElementById('tasks-list');
    if (!tasksList) return;

    tasksList.innerHTML = ''; // Limpa a lista atual
    player.tasks.forEach(task => {
        if (!task.completed) { // Mostra apenas tasks não completadas
            const li = document.createElement('li');
            li.setAttribute('data-task', task.name);
            li.innerHTML = `${task.name}: <span class="task-counter">${task.kills || 0}/${task.requiredKills}</span> <div class="progress-bar"><div class="progress" style="width: ${((task.kills || 0) / task.requiredKills) * 100}%"></div></div>`;
            tasksList.appendChild(li);
        }
    });
}

// Função para obter o progresso das tasks (compatibilidade com ui.js)
export function getTasksProgress() {
    return player.tasks.map(task => ({
        name: task.name,
        progress: task.kills || 0,
        goal: task.requiredKills,
        completed: task.completed
    }));
}

export { updateTasksUI }; // Exporta para uso no game.js