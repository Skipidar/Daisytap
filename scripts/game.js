// scripts/game.js
const Game = (function() {
    let energy = 1000;
    let isFlowerClickable = true;
    let boosterCharges = 6;
    let lastClickTime = 0;
    let rotationAngle = 0;
    let lastPredictionTime = parseInt(localStorage.getItem('lastPredictionTime')) || 0;
    let playerLevel = parseInt(localStorage.getItem('playerLevel')) || 1;
    let playerExperience = parseInt(localStorage.getItem('playerExperience')) || 0;

    // Для неповторяющихся предсказаний
    let usedPredictions = JSON.parse(localStorage.getItem('usedPredictions')) || [];
    let predictionHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];

    // Переменные билетов
    let tickets = parseInt(localStorage.getItem('tickets')) || 10000;
    let coins = parseInt(localStorage.getItem('coins')) || 10000;
    let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000;

    function init() {
        // Обновление начальных значений билетов и монет
        updateTicketCount();
        updateBalance();

        // Обновление уровня и опыта
        document.getElementById('player-level').textContent = playerLevel;
        updateProgressBar();

        // Обработчик клика по ромашке
        const chamomile = document.getElementById('chamomile');
        chamomile.addEventListener('click', handleChamomileClick);

        // Обработчик двойного клика по ромашке (предсказание)
        chamomile.addEventListener('dblclick', handleChamomileDblClick);

        // Инициализация кнопки бустера
        const boosterBtn = document.getElementById('booster');
        boosterBtn.addEventListener('click', handleBoosterClick);
        updateBoosterTimer();
        setInterval(updateBoosterTimer, 1000); // Обновление таймера каждую секунду

        // Обновление энергии
        updateEnergyBar();

        // Запуск восполнения энергии
        setInterval(replenishEnergy, 1000); // Каждую секунду

        // Запуск таймера до следующего предсказания
        startPredictionCountdown();

        // Обработчик кнопки переключения языка
        const languageToggle = document.getElementById('language-toggle');
        languageToggle.addEventListener('click', () => {
            const newLocale = currentLocale === 'ru' ? 'en' : 'ru';
            setLocale(newLocale);
        });
    }

    function handleChamomileClick(e) {
        const now = Date.now();
        if (now - lastClickTime >= 500 && energy > 0 && isFlowerClickable) {
            lastClickTime = now;
            AudioManager.playClickSound();
            spinCoins += 1;
            document.getElementById('spin-coin-count').textContent = spinCoins;
            energy -= 10;
            document.getElementById('energy-count').textContent = energy;

            // Вращение по часовой стрелке
            rotationAngle += 360 * 1.5 + Math.random() * 360; // Увеличено вращение на 1.5 раза
            chamomile.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            chamomile.style.transform = `rotate(${rotationAngle}deg)`;

            createSparks(e.clientX, e.clientY);
            animateCoin(e.clientX, e.clientY);
            updateEnergyBar();

            if (navigator.vibrate) navigator.vibrate(50);

            // Сохранение монет и энергии
            updateBalance();
            localStorage.setItem('energy', energy);
        }
    }

    function handleChamomileDblClick() {
        const now = Date.now();
        if (isFlowerClickable && now - lastPredictionTime >= 6 * 60 * 60 * 1000) {
            lastPredictionTime = now;
            localStorage.setItem('lastPredictionTime', lastPredictionTime);
            AudioManager.playPredictionSound();
            Modal.open('prediction-modal');

            const prediction = getRandomPrediction();
            document.getElementById('prediction-title').textContent = prediction;

            coins += Math.floor(Math.random() * (550 - 250 + 1)) + 250;
            document.getElementById('coin-count').textContent = coins;
            updateBalance();
            startPredictionCountdown();
            createConfetti();

            // Добавляем предсказание в историю
            const date = new Date().toLocaleString();
            predictionHistory.unshift({ prediction, date });
            updatePredictionHistory();

            // Сохраняем историю и использованные предсказания
            localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
            localStorage.setItem('usedPredictions', JSON.stringify(usedPredictions));

            // Выдача билетиков за предсказание
            const ticketAmount = Math.floor(Math.random() * 5) + 1; // 1-5
            tickets += ticketAmount;
            document.getElementById('ticket-count').textContent = tickets;
            showTicketNotification(ticketAmount);
            localStorage.setItem('tickets', tickets);
        }
    }

    function getRandomPrediction() {
        const predictions = [
            // ... ваши предсказания ...
        ];
        let availablePredictions = predictions.filter(p => !usedPredictions.includes(p));
        if (availablePredictions.length === 0) {
            usedPredictions = [];
            availablePredictions = predictions;
        }
        const randomIndex = Math.floor(Math.random() * availablePredictions.length);
        const prediction = availablePredictions[randomIndex];
        usedPredictions.push(prediction);
        return prediction;
    }

    function updatePredictionHistory() {
        const historyContainer = document.getElementById('predictions-history');
        historyContainer.innerHTML = '<h3>История предсказаний:</h3>';
        predictionHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p>${item.prediction}</p>
                <p class="history-date">${item.date}</p>
            `;
            historyContainer.appendChild(historyItem);
        });
    }

    function createConfetti() {
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    function animateCoin(x, y) {
        const coin = document.createElement('img');
        coin.src = 'assets/images/silvercoin.webp';
        coin.className = 'coin-icon coin-animation';
        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.transition = 'all 1s linear';
        coin.style.width = '36px';
        coin.style.height = '36px';
        document.body.appendChild(coin);

        const target = document.getElementById('spin-coin-count').getBoundingClientRect();

        setTimeout(() => {
            coin.style.left = `${target.left + target.width / 2}px`;
            coin.style.top = `${target.top + target.height / 2}px`;
            coin.style.width = '0px';
            coin.style.height = '0px';
            coin.style.opacity = '0';
        }, 10);

        // Добавление анимации пульсации к счетчику монет
        coin.addEventListener('transitionend', () => {
            if (coin.style.opacity === '0') {
                coin.remove();
                pulseCoinCount();
            }
        });

        setTimeout(() => coin.remove(), 1000);
    }

    function pulseCoinCount() {
        const coinCount = document.getElementById('spin-coin-count');
        coinCount.classList.add('pulse');
        setTimeout(() => {
            coinCount.classList.remove('pulse');
        }, 500);
    }

    function createSparks(x, y) {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.left = `${x}px`;
        spark.style.top = `${y}px`;
        spark.textContent = '+1';
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 1000);
    }

    function updateEnergyBar() {
        const chamomile = document.getElementById('chamomile');
        if (energy > 0) {
            chamomile.style.filter = "none";
            isFlowerClickable = true;
        } else {
            chamomile.style.filter = "grayscale(100%)";
            isFlowerClickable = false;
        }
    }

    function replenishEnergy() {
        if (energy < 1000) {
            energy += 1; // Восполнение по 1 единице каждую секунду
            document.getElementById('energy-count').textContent = energy;
            updateEnergyBar();
            localStorage.setItem('energy', energy);
        }
    }

    function startPredictionCountdown() {
        const countdownElement = document.getElementById('prediction-countdown');
        const interval = setInterval(() => {
            const now = Date.now();
            const remainingTime = (lastPredictionTime + 6 * 60 * 60 * 1000) - now;
            if (remainingTime > 0) {
                countdownElement.textContent = formatTime(Math.floor(remainingTime / 1000));
            } else {
                countdownElement.textContent = 'Можно предсказывать!';
                clearInterval(interval);
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function handleBoosterClick() {
        if (boosterCharges > 0) {
            energy = 1000;
            document.getElementById('energy-count').textContent = energy;
            boosterCharges--;
            updateBoosterTimer();
            updateEnergyBar();
            localStorage.setItem('energy', energy);
            localStorage.setItem('boosterCharges', boosterCharges);
        }
    }

    function updateBoosterTimer() {
        const boosterBtn = document.getElementById('booster');
        boosterBtn.textContent = `Бустер ${boosterCharges}/6`;
    }

    function updateTicketCount() {
        const ticketCount = document.getElementById('ticket-count');
        ticketCount.textContent = tickets;
    }

    function showTicketNotification(amount) {
        const ticketNotification = document.getElementById('ticket-notification');
        ticketNotification.innerHTML = `Поздравляем! Ваш подарок: <span id="ticket-amount">${amount}</span> билетов.`;
        ticketNotification.style.display = 'block';
    }

    function addExperience(amount) {
        playerExperience += amount;
        const experienceToLevelUp = playerLevel * 1000;
        if (playerExperience >= experienceToLevelUp) {
            playerExperience -= experienceToLevelUp;
            playerLevel++;
            document.getElementById('player-level').textContent = playerLevel;
            localStorage.setItem('playerLevel', playerLevel);
        }
        updateProgressBar();
        localStorage.setItem('playerExperience', playerExperience);
    }

    function updateProgressBar() {
        const experienceToLevelUp = playerLevel * 1000;
        const progressPercent = (playerExperience / experienceToLevelUp) * 100;
        document.getElementById('level-progress').style.width = progressPercent + '%';
    }

    function updateBalance() {
        localStorage.setItem('coins', coins);
        localStorage.setItem('spinCoins', spinCoins);
        document.getElementById('coin-count').textContent = coins;
        document.getElementById('spin-coin-count').textContent = spinCoins;
    }

    return {
        init
    };
})();
