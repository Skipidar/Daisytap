document.addEventListener('DOMContentLoaded', function() {
    let tgUser = null;
    let isTelegram = false;

    // Проверяем, доступен ли Telegram Web Apps SDK
    if (window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const tg = window.Telegram.WebApp;
        tgUser = tg.initDataUnsafe.user;
        isTelegram = true;
        console.log(`Добро пожаловать, ${tgUser.first_name}!`);
        // Инициализируем игру
        initGame();
    } else {
        console.log('Игра запущена вне Telegram.');
        // Для локального тестирования создаем тестового пользователя
        tgUser = {
            id: 123456789,
            first_name: 'TestUser',
            username: 'testuser'
        };
        isTelegram = false;
        // Инициализируем игру
        initGame();
    }

    function initGame() {
        // Переменные игры
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

        // Элементы DOM
        const chamomile = document.getElementById('chamomile');
        const coinCount = document.getElementById('coin-count');
        const spinCoinCount = document.getElementById('spin-coin-count');
        const energyCount = document.getElementById('energy-count');
        const predictionModal = document.getElementById('prediction-modal');
        const predictionTitle = document.getElementById('prediction-title');
        const timer = document.getElementById('timer');
        const boosterBtn = document.getElementById('booster');
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.querySelector('.game-container');
        const playButton = document.getElementById('play-button');
        const soundToggle = document.getElementById('sound-toggle');

        // Аудио
        const clickSound = new Audio('assets/sounds/click.mp3');
        const predictionSound = new Audio('assets/sounds/prediction.mp3');
        const backgroundMusic = new Audio('assets/sounds/backgroundmusic.mp3');
        backgroundMusic.loop = true;
        let soundEnabled = true;

        // Анимация загрузки
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            gameContainer.style.display = 'flex';
            backgroundMusic.play();
        }, 3000); // 3 секунды

        // Обработчик кнопки отключения звука
        soundToggle.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            if (soundEnabled) {
                soundToggle.querySelector('img').src = 'assets/images/on.webp';
                backgroundMusic.play();
            } else {
                soundToggle.querySelector('img').src = 'assets/images/off.webp';
                backgroundMusic.pause();
            }
        });

        // Обработчик кнопки "Играть"
        playButton.addEventListener('click', () => {
            startProtectFlowerGame();
        });

        // Обработчик клика по ромашке
        chamomile.addEventListener('click', function(e) {
            const now = Date.now();
            if (now - lastClickTime >= 500 && energy > 0) {
                lastClickTime = now;
                if (soundEnabled) clickSound.play();
                spinCoins += 1;
                spinCoinCount.textContent = spinCoins;
                energy -= 10;
                energyCount.textContent = energy;

                // Вращение по часовой стрелке
                rotationAngle += 360 * 5 + Math.random() * 360;
                this.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
                this.style.transform = `rotate(${rotationAngle}deg)`;

                createSparks(e.clientX, e.clientY);
                animateCoin(e.clientX, e.clientY);
                updateEnergyBar();

                if (energy <= 0) {
                    chamomile.style.filter = "grayscale(100%)";
                    isFlowerClickable = false;
                }
            }
        });

        // Создание искр
        function createSparks(x, y) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.textContent = '+1';
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }

        // Анимация монеты к счетчику
        function animateCoin(x, y) {
            const coin = document.createElement('img');
            coin.src = 'assets/images/silvercoin.webp';
            coin.className = 'coin-icon';
            coin.style.position = 'absolute';
            coin.style.left = `${x}px`;
            coin.style.top = `${y}px`;
            coin.style.transition = 'all 1s linear';
            document.body.appendChild(coin);

            const target = document.getElementById('secondary-coin-counter').getBoundingClientRect();

            setTimeout(() => {
                coin.style.left = `${target.left + target.width / 2}px`;
                coin.style.top = `${target.top + target.height / 2}px`;
                coin.style.width = '0px';
                coin.style.height = '0px';
                coin.style.opacity = '0';
            }, 10);

            setTimeout(() => coin.remove(), 1000);
        }

        // Обновление энергии
        function updateEnergyBar() {
            if (energy > 0) {
                chamomile.style.filter = "none";
            } else {
                chamomile.style.filter = "grayscale(100%)";
            }
        }

        // Обработчик двойного клика по ромашке (предсказание)
        chamomile.addEventListener('dblclick', function() {
            const now = Date.now();
            if (isFlowerClickable && now - lastPredictionTime >= 6 * 60 * 60 * 1000) {
                lastPredictionTime = now;
                if (soundEnabled) predictionSound.play();
                predictionModal.style.display = 'flex';

                const prediction = getRandomPrediction();
                predictionTitle.textContent = prediction;

                coins += Math.floor(Math.random() * (550 - 250 + 1)) + 250;
                coinCount.textContent = coins;
                startCountdown(6 * 60 * 60); // 6 часов
                createConfetti();

                // Добавляем предсказание в историю
                const date = new Date().toLocaleString();
                predictionHistory.unshift({ prediction, date });
                updatePredictionHistory();
            }
        });

        // Получение случайного предсказания
        function getRandomPrediction() {
            const predictions = [
                // Ваши предсказания
                "Сегодня удача улыбнется вам во всех начинаниях. Не упустите свой шанс!",
                // ... (остальные предсказания)
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

        // Обновление истории предсказаний
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

        // Создание конфетти
        function createConfetti() {
            const confettiCanvas = document.getElementById('confetti-canvas');
            const confetti = new ConfettiGenerator({ target: confettiCanvas });
            confetti.render();
            setTimeout(() => confetti.clear(), 5000);
        }

        // Обновление таймера бустера
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

        // Обработчик бустера
        boosterBtn.addEventListener('click', function() {
            if (boosterCharges > 0) {
                energy = 1000;
                energyCount.textContent = energy;
                boosterCharges--;
                updateBoosterTimer();
                updateEnergyBar();
            }
        });

        // Обработчики модальных окон
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Обработчики кнопок меню
        document.getElementById('airdrop-btn').addEventListener('click', () => document.getElementById('airdrop-modal').style.display = 'flex');

        document.getElementById('rating-btn').addEventListener('click', () => {
            const ratingModal = document.getElementById('rating-modal');
            const ratingList = document.getElementById('rating-list');
            ratingList.innerHTML = '';
            for (let i = 0; i < 10; i++) {
                const li = document.createElement('div');
                li.className = 'rating-item';
                li.textContent = `Игрок ${i + 1}: ${Math.floor(Math.random() * 10000)} $Daisy`;
                ratingList.appendChild(li);
            }
            ratingModal.style.display = 'flex';
        });

        // Обработчик магазина
        document.getElementById('shop-btn').addEventListener('click', () => {
            const shopModal = document.getElementById('shop-modal');
            const shopContent = document.getElementById('shop-content');
            shopContent.innerHTML = '';
            // По умолчанию открываем вкладку "За $Daisy"
            loadShopItems('daisy');
            shopModal.style.display = 'flex';
        });

        // Обработчики вкладок магазина
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.getAttribute('data-tab');
                loadShopItems(tabName);
            });
        });

        function loadShopItems(tabName) {
            const shopContent = document.getElementById('shop-content');
            shopContent.innerHTML = '';

            let items = [];
            if (tabName === 'daisy') {
                items = [
                    { name: 'Bubble', price: 100, image: 'assets/images/bubble.webp' },
                    // ... (остальные предметы)
                ];
            } else if (tabName === 'coin') {
                items = [
                    { name: 'Vinyl', price: 1, image: 'assets/images/vinyl.webp' },
                    // ... (остальные предметы)
                ];
            } else if (tabName === 'premium') {
                items = [
                    { name: 'Lion', price: 5000, image: 'assets/images/lion.webp' },
                    // ... (остальные предметы)
                ];
            }

            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'skin-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                    <div>${item.name}</div>
                    <div class="skin-price">${item.price} ${tabName === 'coin' ? 'Coin' : '$Daisy'}</div>
                `;
                itemDiv.addEventListener('click', () => {
                    if ((tabName === 'daisy' && coins >= item.price) || (tabName === 'coin' && spinCoins >= item.price)) {
                        if (tabName === 'daisy') {
                            coins -= item.price;
                            coinCount.textContent = coins;
                        } else {
                            spinCoins -= item.price;
                            spinCoinCount.textContent = spinCoins;
                        }
                        alert(`Вы купили ${item.name}!`);
                    } else {
                        alert('Недостаточно средств!');
                    }
                });
                shopContent.appendChild(itemDiv);
            });
        }

        // Обработчики других кнопок
        document.getElementById('friends-btn').addEventListener('click', () => {
            const friendsList = document.getElementById('friends-list');
            friendsList.innerHTML = '';
            const friends = ['Вася', 'Степа', 'Наташа', 'Ира', 'Ольга', 'Роман', 'Валентина', 'Александр', 'Мария', 'Иван', 'Елена', 'Дмитрий', 'Анна', 'Сергей', 'Татьяна'];
            friends.forEach(friend => {
                const li = document.createElement('div');
                li.className = 'friend-item';
                li.textContent = friend;
                friendsList.appendChild(li);
            });
            document.getElementById('friends-modal').style.display = 'flex';
        });

        document.getElementById('tasks-btn').addEventListener('click', () => document.getElementById('tasks-modal').style.display = 'flex');

        // Фоновая музыка
        backgroundMusic.play();

        // Загрузка начального состояния
        updateBoosterTimer();
        updateEnergyBar();

        // Функции мини-игры "Защити цветок"
        function startProtectFlowerGame() {
            // Проверяем наличие билета
            if (playerHasTicket()) {
                // Запускаем игру
                console.log('Запуск игры "Защити цветок"');
                // Здесь будет реализация игры
            } else {
                alert('У вас нет билетов для входа в игру. Попробуйте позже.');
            }
        }

        function playerHasTicket() {
            // Проверка наличия билета
            // Для примера вернем true
            return true;
        }

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

        // Кнопки в модальном окне предсказания
        document.querySelector('.share-btn').addEventListener('click', function() {
            alert('Функция поделиться с друзьями пока не реализована');
        });

        document.querySelector('.publish-btn').addEventListener('click', function() {
            alert('Функция опубликовать историю пока не реализована');
        });
    }
});
