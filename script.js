document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, доступен ли Telegram Web Apps SDK
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const tg = window.Telegram.WebApp;
        const tgUser = tg.initDataUnsafe.user;
        console.log(`Добро пожаловать, ${tgUser.first_name}!`);
        // Здесь можете использовать tgUser для идентификации игрока
        initGame(tgUser);
    } else {
        console.log('Игра запущена вне Telegram.');
        // Для локального тестирования создадим тестового пользователя
        const tgUser = {
            id: 123456789,
            first_name: 'TestUser',
            username: 'testuser'
        };
        initGame(tgUser);
    }
});


    // Основной код игры начинается здесь

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
        "Сегодня лучше не торопиться. Всему свое время, и ваше время придет совсем скоро.",
        "Завтрашний день принесет еще больше возможностей. Готовьтесь к ним уже сегодня!",
        "Сохраняйте спокойствие и уверенность, даже если все идет не по плану. Это ключ к успеху.",
        "Романтический вечер не за горами. Приготовьтесь к незабываемым моментам!",
        "Приятный сюрприз ждет вас за ближайшим углом. Будьте внимательны и не пропустите его!"
    ];

    let coins = 0;
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

    const chamomile = document.getElementById('chamomile');
    const coinCount = document.getElementById('coin-count');
    const spinCoinCount = document.getElementById('spin-coin-count');
    const energyCount = document.getElementById('energy-count');
    const predictionModal = document.getElementById('prediction-modal');
    const predictionTitle = document.getElementById('prediction-title');
    const timer = document.getElementById('timer');
    const boosterBtn = document.getElementById('booster');

    // Подключение аудио
    const clickSound = new Audio('assets/sounds/click.mp3');
    const predictionSound = new Audio('assets/sounds/prediction.mp3');

    function getRandomPrediction() {
        let availablePredictions = predictions.filter(p => !usedPredictions.includes(p));
        if (availablePredictions.length === 0) {
            usedPredictions = []; // Сбрасываем использованные, если все уже были
            availablePredictions = predictions;
        }
        const randomIndex = Math.floor(Math.random() * availablePredictions.length);
        const prediction = availablePredictions[randomIndex];
        usedPredictions.push(prediction);
        return prediction;
    }

    function updateBoosterTimer() {
        const now = new Date();
        const minutes = 59 - now.getMinutes();
        const seconds = 59 - now.getSeconds();
        boosterBtn.textContent = `Бустер ${boosterCharges}/6 (${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
    }

    setInterval(updateBoosterTimer, 1000);

    setInterval(() => {
        if (boosterCharges < 6) {
            boosterCharges++;
            updateBoosterTimer();
        }
    }, 60 * 60 * 1000); // Каждый час

    chamomile.addEventListener('click', function(e) {
        const now = Date.now();
        if (now - lastClickTime >= 500 && energy > 0) {
            lastClickTime = now;
            clickSound.play();
            spinCoins += 1;
            spinCoinCount.textContent = spinCoins;
            energy -= 10;
            energyCount.textContent = energy;

            // Минимум 5 оборотов + случайное положение
            rotationAngle += 360 * 5 + Math.random() * 360;
            this.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            this.style.transform = `rotate(${rotationAngle}deg)`;

            createSparks();
            updateEnergyBar();

            if (energy <= 0) {
                chamomile.style.filter = "grayscale(100%)";
                isFlowerClickable = false;
            }
        }
    });

    function createSparks() {
        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${Math.random() * 100}%`;
            spark.style.top = `${Math.random() * 100}%`;
            spark.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            chamomile.parentNode.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }
    }

    function createFirework() {
        for (let i = 0; i < 50; i++) {
            const firework = document.createElement('div');
            firework.className = 'firework';
            firework.style.left = `${Math.random() * 100}%`;
            firework.style.top = `${Math.random() * 100}%`;
            firework.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
            document.body.appendChild(firework);
            setTimeout(() => firework.remove(), 1000);
        }
    }

    chamomile.addEventListener('dblclick', function() {
        const now = Date.now();
        if (isFlowerClickable && now - lastPredictionTime >= 6 * 60 * 60 * 1000) {
            lastPredictionTime = now;
            predictionSound.play();
            predictionModal.style.display = 'flex';

            const prediction = getRandomPrediction();
            predictionTitle.textContent = prediction;

            coins += Math.floor(Math.random() * (550 - 250 + 1)) + 250;
            coinCount.textContent = coins;
            startCountdown(6 * 60 * 60); // 6 часов
            createFirework();

            // Добавляем предсказание в историю
            const date = new Date().toLocaleString();
            predictionHistory.unshift({ prediction, date });
            updatePredictionHistory();
        }
    });

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

    function updateEnergyBar() {
        const energyPercentage = (energy / 1000) * 100;
        const energyCounter = document.getElementById('energy-counter');
        energyCounter.style.backgroundPosition = `${100 - energyPercentage}% 0`;
        if (energyPercentage > 50) {
            energyCounter.classList.remove('low', 'empty');
        } else if (energyPercentage > 0) {
            energyCounter.classList.add('low');
            energyCounter.classList.remove('empty');
        } else {
            energyCounter.classList.add('empty');
        }
    }

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    function startCountdown(seconds) {
        const endTime = Date.now() + seconds * 1000;
        const countdown = setInterval(function() {
            const remainingTime = Math.max(0, endTime - Date.now());
            if (remainingTime === 0) {
                clearInterval(countdown);
                isFlowerClickable = true;
                chamomile.style.filter = "none";
                timer.textContent = "";
            } else {
                const hours = Math.floor(remainingTime / (1000 * 60 * 60));
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                timer.textContent = `Следующее предсказание через: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }

    boosterBtn.addEventListener('click', function() {
        if (boosterCharges > 0) {
            energy = 1000;
            energyCount.textContent = energy;
            boosterCharges--;
            updateBoosterTimer();
            updateEnergyBar();
        }
    });

    // Модальные окна
    document.getElementById('airdrop-btn').addEventListener('click', () => document.getElementById('airdrop-modal').style.display = 'flex');
    document.getElementById('rating-btn').addEventListener('click', () => {
        const ratingModal = document.getElementById('rating-modal');
        const ratingList = document.getElementById('rating-list');
        ratingList.innerHTML = '';
        for (let i = 0; i < 10; i++) {
            const li = document.createElement('li');
            li.className = 'rating-item';
            li.textContent = `Игрок ${i + 1}: ${Math.floor(Math.random() * 10000)} $Cham`;
            ratingList.appendChild(li);
        }
        ratingModal.style.display = 'flex';
    });
    document.getElementById('skins-btn').addEventListener('click', () => {
        const skinsGrid = document.getElementById('skins-grid');
        skinsGrid.innerHTML = '';
        const prices = [100, 500, 1000, 5000, 10000, 25000, 50000, 100000, 250000];
        const profits = [1.5, 5, 10, 25, 50, 100, 250];
        for (let i = 0; i < 27; i++) {
            const skinItem = document.createElement('div');
            skinItem.className = 'skin-item';
            skinItem.innerHTML = `
                <div>Скин ${i + 1}</div>
                <div class="skin-price">${prices[i % 9]} $Cham</div>
                <div>${profits[i % 7]} $Cham/час</div>
            `;
            skinItem.addEventListener('click', () => {
                if (coins >= prices[i % 9]) {
                    coins -= prices[i % 9];
                    coinCount.textContent = coins;
                    alert(`Вы купили скин ${i + 1}!`);
                } else {
                    alert('Недостаточно монет!');
                }
            });
            skinsGrid.appendChild(skinItem);
        }
        document.getElementById('skins-modal').style.display = 'flex';
    });
    document.getElementById('friends-btn').addEventListener('click', () => {
        const friendsList = document.getElementById('friends-list');
        friendsList.innerHTML = '';
        const friends = ['Вася (1000 $Cham)', 'Степа (500 $Cham)', 'Наташа (750 $Cham)', 'Ира (300 $Cham)', 'Ольга (850 $Cham)', 'Роман (400 $Cham)', 'Валентина (600 $Cham)', 'Александр (700 $Cham)', 'Мария (200 $Cham)', 'Иван (900 $Cham)', 'Елена (450 $Cham)', 'Дмитрий (800 $Cham)', 'Анна (150 $Cham)', 'Сергей (1100 $Cham)', 'Татьяна (550 $Cham)'];
        friends.forEach(friend => {
            const li = document.createElement('li');
            li.className = 'friend-item';
            li.textContent = friend;
            friendsList.appendChild(li);
        });
        document.getElementById('friends-modal').style.display = 'flex';
    });
    document.getElementById('tasks-btn').addEventListener('click', () => document.getElementById('tasks-modal').style.display = 'flex');

    // Кнопки в модальном окне предсказания
    document.querySelector('.share-btn').addEventListener('click', function() {
        alert('Функция поделиться с друзьями пока не реализована');
    });

    document.querySelector('.publish-btn').addEventListener('click', function() {
        alert('Функция опубликовать историю пока не реализована');
    });

    // Загрузка начального состояния
    updateBoosterTimer();
    updateEnergyBar();
});
