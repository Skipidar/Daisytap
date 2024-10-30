// Глобальные переменные
let maxEnergy = 1000;  // Максимальная энергия
window.energy = parseInt(localStorage.getItem('energy')) || maxEnergy;  // Текущая энергия

let boosterCharges = parseInt(localStorage.getItem('boosterCharges')) || 6;
let boosterLastUsed = parseInt(localStorage.getItem('boosterLastUsed')) || Date.now();
let boosterTimerInterval = null;

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех элементов интерфейса и модулей
    initializeGame();
    
    // Обработчик для кнопки "Играть"
    const playButton = document.getElementById('play-button');
    playButton.addEventListener('click', function() {
        console.log('Кнопка "Играть" нажата. Открываем экран выбора мини-игры.');
        // Скрываем главное меню
        document.querySelector('.game-container').style.display = 'none';
    
        // Показываем экран выбора мини-игры
        updateTicketCount('mini-game-ticket-count'); // Обновляем количество билетов при открытии экрана
        document.getElementById('mini-game-selection').style.display = 'flex';
    });

    // Открытие описания игры при клике на картинку
    const game1Thumbnail = document.querySelector('img[alt="Защитись от пчёл"]');
    game1Thumbnail.addEventListener('click', function() {
        document.getElementById('game-description-modal').style.display = 'block';
    });

    // Закрытие описания игры
    const closeGameDescription = document.getElementById('close-game-description');
    closeGameDescription.addEventListener('click', function() {
        document.getElementById('game-description-modal').style.display = 'none';
    });

    // Запуск игры из окна описания
    const startGameFromDescription = document.getElementById('start-game-from-description');
    startGameFromDescription.addEventListener('click', function() {
        document.getElementById('game-description-modal').style.display = 'none';
        document.getElementById('mini-game-selection').style.display = 'none';
        document.getElementById('protect-flower-game').style.display = 'flex';
        MiniGame.startGame();
    });

    // Добавление обработчика для крестика закрытия окна выбора мини-игры
    const closeMiniGameButton = document.getElementById('close-mini-game');
    if (closeMiniGameButton) {
        closeMiniGameButton.addEventListener('click', () => {
            document.getElementById('mini-game-selection').style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            updateTicketCount('main-ticket-count'); // Обновляем количество билетов на главном экране
        });
    }

    // Обработчик для кнопки "Старт" первой игры
    const startGameButton = document.getElementById('start-game-1');
    startGameButton.addEventListener('click', function() {
        console.log('Кнопка "Старт" первой игры нажата. Запускаем мини-игру.');
        document.getElementById('mini-game-selection').style.display = 'none';
        document.getElementById('protect-flower-game').style.display = 'flex';
        MiniGame.startGame();
    });

    // Запуск основной логики
    initMain();
});

function initializeGame() {
    // Инициализация всех модулей
    AudioManager.init();
    Localization.init();
    Modal.init();
    Shop.init();
    Game.init();
    MiniGame.init();

    // Обновление интерфейса при загрузке
    document.getElementById('energy-count').textContent = window.energy;

    // Обновляем UI бустера
    updateBoosterUI();

    // Запуск таймеров восстановления
    setInterval(replenishBooster, 1000 * 60 * 10);  // Восстановление бустера каждые 10 минут
    setInterval(replenishEnergy, 1000);  // Восстановление энергии каждую секунду

    // Запуск анимации монет
    setInterval(rotateCoins, 10000);  // Запускаем анимацию каждые 10 секунд

    // Обновление количества билетов
    updateTicketCount('main-ticket-count'); // Обновляем на главном экране при загрузке
}

function updateTicketCount(elementId) {
    const ticketCountElement = document.getElementById(elementId);
    const currentTickets = parseInt(localStorage.getItem('tickets')) || 0;
    if (ticketCountElement) {
        ticketCountElement.textContent = `${currentTickets}`;
    }
}

function replenishEnergy() {
    if (window.energy < maxEnergy) {
        window.energy += 1;
        document.getElementById('energy-count').textContent = window.energy;
        localStorage.setItem('energy', window.energy);
        Game.updateEnergyBar();
    }
}

function replenishBooster() {
    const now = Date.now();
    const elapsedTime = now - boosterLastUsed;
    const oneHour = 60 * 60 * 1000;

    if (elapsedTime >= oneHour) {
        const hoursPassed = Math.floor(elapsedTime / oneHour);
        boosterCharges = Math.min(6, boosterCharges + hoursPassed);
        boosterLastUsed = now;
        localStorage.setItem('boosterCharges', boosterCharges);
        localStorage.setItem('boosterLastUsed', boosterLastUsed);
        updateBoosterUI();

        if (boosterCharges === 6 && boosterTimerInterval) {
            clearInterval(boosterTimerInterval);
            document.getElementById('booster').textContent = 'Бустер восполнен!';
        }
    }
}

function updateBoosterUI() {
    const boosterButton = document.getElementById('booster');
    boosterButton.innerHTML = `<span style="color: #FFD700;">Бустер</span> 
                               <span style="color: #FFFFFF; font-weight: bold;">${boosterCharges}/6</span>`;
    boosterButton.disabled = boosterCharges === 0;
}

// Обработчик кликов по кнопке бустера
document.getElementById('booster').addEventListener('click', function() {
    if (boosterCharges > 0) {
        boosterCharges -= 1;
        boosterLastUsed = Date.now();

        // Восстанавливаем энергию до максимального значения
        window.energy = maxEnergy;
        document.getElementById('energy-count').textContent = window.energy;
        localStorage.setItem('energy', window.energy);

        // Вызываем функцию для обновления состояния ромашки
        Game.updateEnergyBar();

        // Сохраняем бустер и обновляем UI
        localStorage.setItem('boosterCharges', boosterCharges);
        localStorage.setItem('boosterLastUsed', boosterLastUsed);
        updateBoosterUI();

        // Запускаем таймер восстановления
        if (boosterTimerInterval) clearInterval(boosterTimerInterval);
        boosterTimerInterval = setInterval(updateBoosterTimer, 1000);
    } else {
        console.log("Нет зарядов бустера");
    }
});

function updateBoosterTimer() {
    const now = Date.now();
    const remainingTime = (boosterLastUsed + 60 * 60 * 1000) - now;
    const boosterButton = document.getElementById('booster');
    
    if (remainingTime > 0) {
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        boosterButton.innerHTML = `<span style="color: #FFD700;">Бустер</span> 
                                   <span style="color: #FFFFFF; font-weight: bold;">${boosterCharges}/6</span> 
                                   <span style="color: #FFFFFF; font-weight: bold;">(${minutes}:${seconds})</span>`;
    } else {
        boosterButton.innerHTML = '<span style="color: #FFD700;">Бустер восполнен!</span>';
        replenishBooster();
    }
}

function rotateCoins() {
    const goldCoins = document.querySelectorAll('img[src="assets/images/goldcoin.webp"]');
    const silverCoins = document.querySelectorAll('img[src="assets/images/silvercoin.webp"]');
    const allCoins = [...goldCoins, ...silverCoins];

    allCoins.forEach(coin => {
        coin.classList.add('spin-animation');
        setTimeout(() => {
            coin.classList.remove('spin-animation');
        }, 1000);
    });
}

function initMain() {
    setTimeout(() => {
        fadeOutLoadingScreen();
    }, 3000);
}

function fadeOutLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('fade-out');
    setTimeout(() => {
        loadingScreen.style.display = 'none';
        document.querySelector('.game-container').style.display = 'flex';
        animateDaisyLetters();
    }, 1000);
}

function animateDaisyLetters() {
    const daisyElement = document.querySelector('.loading-text');
    const spans = daisyElement.querySelectorAll('span');
    spans.forEach((span, index) => {
        span.style.opacity = '0';
        setTimeout(() => {
            span.style.opacity = '1';
        }, index * 300);
    });
}

// Обработчики настроек
document.getElementById('settings-button').addEventListener('click', function() {
    document.getElementById('settings-menu').classList.add('open');
});

document.getElementById('close-settings').addEventListener('click', function() {
    document.getElementById('settings-menu').classList.remove('open');
});

document.getElementById('language-toggle').addEventListener('click', function() {
    // Логика переключения языка
});

document.getElementById('sound-toggle').addEventListener('click', function() {
    // Логика переключения звука
});
