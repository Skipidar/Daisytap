// scripts/game.js
const Game = (function() {
    let energy = 1000;
    let isFlowerClickable = true;
    let boosterCharges = 6;
    let lastClickTime = 0;
    let rotationAngle = 0;
    let lastPredictionTime = 0;
    let playerLevel = 1;
    let playerExperience = 0;

    // Для неповторяющихся предсказаний
    let usedPredictions = [];
    let predictionHistory = [];

    // Переменные билетов
    let tickets = 200; // Начальное количество билетов для теста
    let lastTicketClaim = 0;

    function init() {
        // Обновление начальных значений билетов
        updateTicketCount();

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

        // Инициализация получения новых бустеров каждый час
        setInterval(() => {
            if (boosterCharges < 6) {
                boosterCharges++;
                updateBoosterTimer();
            }
        }, 60 * 60 * 1000); // Каждый час

        // Обновление энергии
        updateEnergyBar();

        // Запуск восполнения энергии
        setInterval(replenishEnergy, 1000); // Каждую секунду

        // Обработчик кнопки "Играть"
        const playButton = document.getElementById('play-button');
        playButton.addEventListener('click', () => {
            Modal.open('protect-flower-game');
        });

        // Запуск таймера до следующего предсказания
        startPredictionCountdown();

        // Обработчик кнопки "назад" на телефоне
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || event.key === 'Backspace') {
                if (isGameRunning) {
                    endGame();
                    document.getElementById('protect-flower-game').style.display = 'none';
                    document.querySelector('.game-container').style.display = 'block';
                }
            }
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

            // Добавляем опыт за клик по ромашке
            addExperience(50); // Например, 50 опыта за клик

            if (navigator.vibrate) navigator.vibrate(100);
        }
    }

    function handleChamomileDblClick() {
        const now = Date.now();
        if (isFlowerClickable && now - lastPredictionTime >= 6 * 60 * 60 * 1000) {
            lastPredictionTime = now;
            AudioManager.playPredictionSound();
            Modal.open('prediction-modal');

            const prediction = getRandomPrediction();
            document.getElementById('prediction-title').textContent = prediction;

            coins += Math.floor(Math.random() * (550 - 250 + 1)) + 250;
            document.getElementById('coin-count').textContent = coins;
            startPredictionCountdown();
            createConfetti();

            // Добавляем предсказание в историю
            const date = new Date().toLocaleString();
            predictionHistory.unshift({ prediction, date });
            updatePredictionHistory();

            // Выдача билетиков за предсказание
            const ticketAmount = Math.floor(Math.random() * 5) + 1; // 1-5
            tickets += ticketAmount;
            document.getElementById('ticket-count').textContent = tickets;
            showTicketNotification(ticketAmount);
        }
    }

    function getRandomPrediction() {
        const predictions = [
            "Сегодня удача улыбнется вам во всех начинаниях. Не упустите свой шанс!",
            "Впереди вас ждет важная встреча, которая может изменить вашу жизнь. Будьте готовы!",
            "Улыбайтесь чаще, и мир улыбнется вам в ответ. Позитивный настрой - ключ к успеху!",
            "Удача будет сопровождать вас весь день. Смело беритесь за новые проекты!",
            "Сегодня вы найдете решение давней проблемы. Доверьтесь своей интуиции!",
            "Неожиданная хорошая новость поднимет вам настроение и вдохновит на новые свершения.",
            "Приятный сюрприз ожидает вас сегодня. Будьте внимательны к мелочам!",
            "Вас ждет неожиданное, но очень приятное событие. Готовьтесь к приятным переменам!",
            "Встреча с давним другом принесет не только радость, но и новые возможности.",
            "Терпение и труд все перетрут. Сегодня ваше упорство будет вознаграждено!",
            "Важный разговор, которого вы ждали, наконец состоится. Будьте честны и открыты.",
            "Сегодня ваш день! Все будет складываться наилучшим образом.",
            "Ваши усилия не пройдут даром. Скоро вы увидите плоды своего труда.",
            "Любовь витает в воздухе. Будьте открыты для новых отношений или укрепления существующих.",
            "Путешествие, о котором вы мечтали, скоро станет реальностью. Начинайте планировать!",
            "Сегодня лучше не торопиться. Всему своё время, и ваше время придёт совсем скоро.",
            "Завтрашний день принесет ещё больше возможностей. Готовьтесь к ним уже сегодня!",
            "Сохраняйте спокойствие и уверенность, даже если всё идет не по плану. Это ключ к успеху.",
            "Романтический вечер не за горами. Приготовьтесь к незабываемым моментам!",
            "Приятный сюрприз ждет вас за ближайшим углом. Будьте внимательны и не пропустите его!"
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
        }
    }

    function startPredictionCountdown() {
        const countdownElement = document.getElementById('prediction-countdown');
        if (!countdownElement) {
            console.error('Элемент с id prediction-countdown не найден');
            return; // Останавливаем выполнение, если элемента нет
        }

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
        }
    }

    function updateBoosterTimer() {
        const boosterBtn = document.getElementById('booster');
        boosterBtn.textContent = `Бустер ${boosterCharges}/6 (01:00)`;
    }

    function updateTicketCount() {
        const ticketCount = document.getElementById('ticket-count');
        ticketCount.textContent = tickets;
    }

    function declensionTickets(amount) {
        amount = Math.abs(amount);
        if (amount % 100 >= 11 && amount % 100 <= 19) {
            return 'билетов';
        } else {
            switch (amount % 10) {
                case 1: return 'билет';
                case 2:
                case 3:
                case 4: return 'билета';
                default: return 'билетов';
            }
        }
    }

    function showTicketNotification(amount) {
        const ticketNotification = document.getElementById('ticket-notification');
        ticketNotification.innerHTML = `Поздравляем! Ваш подарок: <span id="ticket-amount">${amount}</span> ${declensionTickets(amount)}.`;
        ticketNotification.style.display = 'block';
    }

    function addExperience(amount) {
        playerExperience += amount;
        const experienceToLevelUp = playerLevel * 1000;
        if (playerExperience >= experienceToLevelUp) {
            playerExperience -= experienceToLevelUp;
            playerLevel++;

            // Проверка наличия элемента
            const playerLevelElement = document.getElementById('player-level');
            if (playerLevelElement) {
                playerLevelElement.textContent = playerLevel;
            }
        }
        updateProgressBar();
    }

    function updateProgressBar() {
        const experienceToLevelUp = playerLevel * 1000;
        const progressPercent = (playerExperience / experienceToLevelUp) * 100;

        // Проверка наличия элемента
        const progressBarElement = document.getElementById('level-progress');
        if (progressBarElement) {
            progressBarElement.style.width = progressPercent + '%';
        }
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
