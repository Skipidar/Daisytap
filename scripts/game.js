const Game = (function() {
    let coins = 200; // Начальное количество $Daisy
    let spinCoins = 0;
    let energy = 1000;
    let isFlowerClickable = true;
    let boosterCharges = 6;
    let lastClickTime = 0;
    let rotationAngle = 0;
    let lastPredictionTime = 0;

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
            this.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            this.style.transform = `rotate(${rotationAngle}deg)`;

            createSparks(e.clientX, e.clientY);
            animateCoin(e.clientX, e.clientY);
            updateEnergyBar();
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
            startCountdown(6 * 60 * 60); // 6 часов
            createConfetti();

            // Добавляем предсказание в историю
            const date = new Date().toLocaleString();
            predictionHistory.unshift({ prediction, date });
            updatePredictionHistory();

            // Выдача билетиков за предсказание
            const ticketAmount = Math.floor(Math.random() * 7) + 1; // 1-7
            tickets += ticketAmount;
            document.getElementById('ticket-count').textContent = tickets;
            showStickerNotification(ticketAmount);
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
        coin.style.width = '36px'; // Увеличенный размер монетки
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
        const coinCount = document.getElementById('coin-count');
        coinCount.classList.add('pulse');
        setTimeout(() => {
            coinCount.classList.remove('pulse');
        }, 500); // Длительность пульсации
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
        } else {
            chamomile.style.filter = "grayscale(100%)";
            isFlowerClickable = false;
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
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function handleBoosterClick() {
        if (boosterCharges > 0) {
            energy = 1000;
            document.getElementById('energy-count').textContent = energy;
            boosterCharges--;
            updateBoosterTimer();
            updateEnergyBar();
            AudioManager.playClickSound();
        }
    }

    function updateBoosterTimer() {
        const boosterBtn = document.getElementById('booster');
        // Предполагаем, что таймер бустера отсчитывает до следующего бустера
        // Здесь можно добавить реальную логику таймера, если требуется
        boosterBtn.textContent = `Бустер ${boosterCharges}/6 (${formatBoosterTime()})`;
    }

    function formatBoosterTime() {
        // Простая заглушка для времени
        // Реализуйте реальный таймер, если требуется
        return '01:00';
    }

    function updateTicketCount() {
        const ticketCount = document.getElementById('ticket-count');
        ticketCount.textContent = tickets;
    }

    function showStickerNotification(amount) {
        const stickerNotification = document.getElementById('sticker-notification');
        stickerNotification.textContent = `Вы получили ${amount} стикера(ов)!`;
        stickerNotification.style.display = 'block';
        setTimeout(() => {
            stickerNotification.style.display = 'none';
        }, 3000); // Скрыть через 3 секунды
    }

    return {
        init
    };
})();
