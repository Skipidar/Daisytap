// Глобальные переменные
let maxEnergy = 1000;  // Глобальная переменная для максимальной энергии
window.energy = parseInt(localStorage.getItem('energy')) || maxEnergy;  // Глобальная переменная для текущей энергии

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация аудио, локализации и игры
    AudioManager.init();
    Localization.init();
    Modal.init();
    Shop.init();
    Game.init();
    MiniGame.init();

    // Обновление интерфейса при загрузке
    document.getElementById('energy-count').textContent = window.energy;

    document.getElementById('play-button').addEventListener('click', function () {
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.style.display = 'flex';
        
        // Показать кнопку "Старт" для начала игры
        const startButton = document.getElementById('start-mini-game');
        startButton.style.display = 'block';
        
        // Скрыть главное меню
        document.querySelector('.game-container').style.display = 'none';
    });
    

    // Запуск основной логики
    initMain();
});

function initMain() {
    setTimeout(() => {
        fadeOutLoadingScreen();
    }, 3000); // 3 секунды загрузки

    function fadeOutLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            animateDaisyLetters();
        }, 1000); // Длительность анимации fade-out
    }

    function animateDaisyLetters() {
        const daisyElement = document.querySelector('.loading-text');
        const spans = daisyElement.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.opacity = '0';
            setTimeout(() => {
                span.style.opacity = '1';
            }, index * 300); // Задержка 0.3s между буквами
        });
    }

    let boosterCharges = parseInt(localStorage.getItem('boosterCharges')) || 6;
    let boosterLastUsed = parseInt(localStorage.getItem('boosterLastUsed')) || Date.now();
    let boosterTimerInterval = null;

    // Обработчик кликов по кнопке бустера
    document.getElementById('booster').addEventListener('click', function() {
        if (boosterCharges > 0) {
            boosterCharges -= 1;
            boosterLastUsed = Date.now();
    
            // Восстанавливаем энергию до максимального значения
            window.energy = maxEnergy;
            document.getElementById('energy-count').textContent = window.energy;
            localStorage.setItem('energy', window.energy);

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

    // Обновление UI бустера
    function updateBoosterUI() {
        document.getElementById('booster').textContent = `Бустер ${boosterCharges}/6`;
        document.getElementById('booster').disabled = boosterCharges === 0;
    }

    // Восстановление бустера
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

    // Обновление таймера восстановления бустера
    function updateBoosterTimer() {
        const now = Date.now();
        const remainingTime = (boosterLastUsed + 60 * 60 * 1000) - now;

        if (remainingTime > 0) {
            const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

            document.getElementById('booster').textContent = `Бустер ${boosterCharges}/6 (${minutes}:${seconds})`;
        } else {
            document.getElementById('booster').textContent = 'Бустер восполнен!';
            replenishBooster();
        }
    }

    // Восстанавливаем энергию каждую секунду
    function replenishEnergy() {
        if (window.energy < maxEnergy) {
            window.energy += 1;
            document.getElementById('energy-count').textContent = window.energy;
            localStorage.setItem('energy', window.energy);
        }
    }

    updateBoosterUI();
    setInterval(replenishBooster, 1000 * 60 * 10);  // Восстановление бустера каждые 10 минут
    setInterval(replenishEnergy, 1000);  // Восстановление энергии каждую секунду

    document.getElementById('next-prediction-timer').addEventListener('click', function() {
        Modal.open('prediction-modal');
        Modal.updatePredictionHistory();
    });
}
function rotateCoins() {
    // Находим все элементы монет goldcoin и silvercoin
    const goldCoins = document.querySelectorAll('img[src="assets/images/goldcoin.webp"]');
    const silverCoins = document.querySelectorAll('img[src="assets/images/silvercoin.webp"]');
    
    // Объединяем оба набора монет в один массив
    const allCoins = [...goldCoins, ...silverCoins];
    
    // Применяем к каждой монете анимацию
    allCoins.forEach(coin => {
        // Добавляем класс для анимации
        coin.classList.add('spin-animation');

        // Удаляем класс через 1 секунду (время анимации)
        setTimeout(() => {
            coin.classList.remove('spin-animation');
        }, 1000);
    });
}

document.getElementById('settings-button').addEventListener('click', function() {
    document.getElementById('settings-menu').classList.add('open');
});

document.getElementById('close-settings').addEventListener('click', function() {
    document.getElementById('settings-menu').classList.remove('open');
});
document.getElementById('language-toggle').addEventListener('click', function() {
    alert('Переключение языка'); // Заменить на реальную логику переключения языка
});

document.getElementById('sound-toggle').addEventListener('click', function() {
    alert('Переключение звука'); // Заменить на реальную логику включения/выключения звука
});

// Запускаем анимацию каждые 10 секунд
setInterval(rotateCoins, 10000);
