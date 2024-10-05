// scripts/game.js
const Game = (function() {
    let coins = parseInt(localStorage.getItem('coins')) || 10000; // Начальное количество $Daisy
    let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000; // Начальное количество Coin
    let energy = 1000;
    let isFlowerClickable = true;
    let boosterCharges = 6;
    let lastClickTime = 0;
    let lastPredictionTime = parseInt(localStorage.getItem('lastPredictionTime')) || 0;
    let isFlowerClickableForPrediction = true;
    let level = parseInt(localStorage.getItem('playerLevel')) || 1;
    let experience = parseInt(localStorage.getItem('playerExperience')) || 0;
    let experienceToNextLevel = level * 100; // Пример расчёта опыта для следующего уровня
    let incomePerHour = parseInt(localStorage.getItem('incomePerHour')) || 0;
    let lastIncomeTime = parseInt(localStorage.getItem('lastIncomeTime')) || Date.now();

    // Переменные билетов
    let tickets = parseInt(localStorage.getItem('tickets')) || 200;

    // Для неповторяющихся предсказаний
    let usedPredictions = JSON.parse(localStorage.getItem('usedPredictions')) || [];
    let predictionHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];

    function init() {
        // Обновление отображения монет и билетов
        document.getElementById('coin-count').textContent = coins;
        document.getElementById('spin-coin-count').textContent = spinCoins;
        document.getElementById('ticket-count').textContent = tickets;

        // Обновление уровня и прогресса
        document.getElementById('level-number').textContent = level;
        updateLevelProgress();

        // Обновление прибыли в час
        document.getElementById('income-per-hour').textContent = incomePerHour;

        // Обработчик клика по ромашке
        const chamomile = document.getElementById('chamomile');
        chamomile.addEventListener('click', handleChamomileClick);

        // Добавление вибро-отклика
        chamomile.addEventListener('click', () => {
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        // Обработчик двойного клика по ромашке (предсказание)
        chamomile.addEventListener('dblclick', handleChamomileDblClick);

        // Инициализация таймера предсказания
        updatePredictionTimer();
        setInterval(updatePredictionTimer, 1000);

        // Запуск пассивного дохода
        calculatePassiveIncome();
        setInterval(calculatePassiveIncome, 60000); // Каждую минуту

        // Обновление энергии
        updateEnergyBar();

        // Запуск восполнения энергии
        setInterval(replenishEnergy, 1000); // Каждую секунду

        // Обновление лейбла билетов при загрузке
        Localization.updateTicketLabel();
    }

    function handleChamomileClick(e) {
        const now = Date.now();
        if (now - lastClickTime >= 500 && energy > 0 && isFlowerClickable) {
            lastClickTime = now;
            AudioManager.playClickSound();
            spinCoins += 1;
            document.getElementById('spin-coin-count').textContent = spinCoins;
            localStorage.setItem('spinCoins', spinCoins);
            energy -= 10;
            document.getElementById('energy-count').textContent = energy;

            // Обновление опыта и уровня
            gainExperience(1);

            // Вращение по часовой стрелке
            rotationAngle += 360 * 1.5 + Math.random() * 360; // Увеличено вращение на 1.5 раза
            this.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            this.style.transform = `rotate(${rotationAngle}deg)`;

            createSparks(e.clientX, e.clientY);
            animateCoin(e.clientX, e.clientY);
            updateEnergyBar();
        }
    }


    function handleChamomileDblClick() {
        const now = Date.now();
        if (isFlowerClickableForPrediction && now - lastPredictionTime >= 6 * 60 * 60 * 1000) {
            lastPredictionTime = now;
            localStorage.setItem('lastPredictionTime', lastPredictionTime);
            AudioManager.playPredictionSound();
            Modal.open('prediction-modal');

            const prediction = getRandomPrediction();
            document.getElementById('prediction-title').textContent = prediction;

            coins += Math.floor(Math.random() * (550 - 250 + 1)) + 250;
            document.getElementById('coin-count').textContent = coins;
            localStorage.setItem('coins', coins);
            startCountdown(6 * 60 * 60);
            createConfetti();

            // Добавляем опыт
            gainExperience(50);

            // Добавляем предсказание в историю
            const date = new Date().toLocaleString();
            predictionHistory.unshift({ prediction, date });
            if (predictionHistory.length > 10) predictionHistory.pop();
            localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
            updatePredictionHistory();

            // Обновление лейбла билетов
            Localization.updateTicketLabel();
        }
    }

    function getRandomPrediction() {
        const predictions = [
            "Сегодня удача улыбнется вам во всех начинаниях. Не упустите свой шанс!",
            "Впереди вас ждет важная встреча, которая может изменить вашу жизнь. Будьте готовы!",
            // Добавьте остальные предсказания...
        ];

        let availablePredictions = predictions.filter(p => !usedPredictions.includes(p));
        if (availablePredictions.length === 0) {
            usedPredictions = [];
            availablePredictions = predictions;
        }
        const randomIndex = Math.floor(Math.random() * availablePredictions.length);
        const prediction = availablePredictions[randomIndex];
        usedPredictions.push(prediction);
        localStorage.setItem('usedPredictions', JSON.stringify(usedPredictions));
        return prediction;
    }

    function updatePredictionHistory() {
        const historyContainer = document.getElementById('predictions-history');
        historyContainer.innerHTML = '<h3 data-localize="prediction_history">История предсказаний:</h3>';
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
        }
    }

    function startCountdown(seconds) {
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        countdownElement.textContent = formatTime(seconds);
        document.querySelector('.game-container').appendChild(countdownElement);

        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            countdownElement.textContent = formatTime(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                countdownElement.remove();
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${h}:${m}:${s}`;
    }

    function updatePredictionTimer() {
        const now = Date.now();
        const remaining = Math.max(0, (lastPredictionTime + 6 * 60 * 60 * 1000 - now) / 1000);
        const predictionTimerElement = document.getElementById('prediction-timer');
        predictionTimerElement.textContent = formatTime(Math.floor(remaining));

        isFlowerClickableForPrediction = remaining <= 0;
    }

    function gainExperience(amount) {
        experience += amount;
        if (experience >= experienceToNextLevel) {
            levelUp();
        }
        updateLevelProgress();
        localStorage.setItem('playerExperience', experience);
    }

    function levelUp() {
        level += 1;
        experience = 0;
        experienceToNextLevel = level * 100;
        document.getElementById('level-number').textContent = level;
        localStorage.setItem('playerLevel', level);
    }

    function updateLevelProgress() {
        const progressPercent = (experience / experienceToNextLevel) * 100;
        document.getElementById('level-progress').style.width = `${progressPercent}%`;
    }

    function calculatePassiveIncome() {
        const now = Date.now();
        const elapsedHours = (now - lastIncomeTime) / (1000 * 60 * 60);
        if (elapsedHours >= 1) {
            const income = Math.floor(elapsedHours * incomePerHour);
            spinCoins += income;
            document.getElementById('spin-coin-count').textContent = spinCoins;
            localStorage.setItem('spinCoins', spinCoins);
            lastIncomeTime = now;
            localStorage.setItem('lastIncomeTime', lastIncomeTime);
        }
    }

    return {
        init
    };
})();
