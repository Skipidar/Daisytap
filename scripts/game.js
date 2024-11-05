const Game = (function() {
    const levelData = [
        { level: 1, totalExp: 700, expPerTap: 1, coinsPerTap: 1, maxCoins: 700 },
        { level: 2, totalExp: 1400, expPerTap: 2, coinsPerTap: 2, maxCoins: 1400 },
        { level: 3, totalExp: 2100, expPerTap: 3, coinsPerTap: 3, maxCoins: 2100 },
        { level: 4, totalExp: 2800, expPerTap: 4, coinsPerTap: 4, maxCoins: 2800 },
        { level: 5, totalExp: 3500, expPerTap: 5, coinsPerTap: 5, maxCoins: 3500 },
        { level: 6, totalExp: 4200, expPerTap: 6, coinsPerTap: 6, maxCoins: 4200 },
        { level: 7, totalExp: 4900, expPerTap: 7, coinsPerTap: 7, maxCoins: 4900 },
        { level: 8, totalExp: 5600, expPerTap: 8, coinsPerTap: 8, maxCoins: 5600 },
        { level: 9, totalExp: 6300, expPerTap: 9, coinsPerTap: 9, maxCoins: 6300 },
        { level: 10, totalExp: 7000, expPerTap: 10, coinsPerTap: 10, maxCoins: 7000 },
        { level: 11, totalExp: 8470, expPerTap: 11, coinsPerTap: 11, maxCoins: 8470 },
        { level: 12, totalExp: 10080, expPerTap: 12, coinsPerTap: 12, maxCoins: 10080 },
        { level: 13, totalExp: 11830, expPerTap: 13, coinsPerTap: 13, maxCoins: 11830 },
        { level: 14, totalExp: 13720, expPerTap: 14, coinsPerTap: 14, maxCoins: 13720 },
        { level: 15, totalExp: 15750, expPerTap: 15, coinsPerTap: 15, maxCoins: 15750 },
        { level: 16, totalExp: 17920, expPerTap: 16, coinsPerTap: 16, maxCoins: 17920 },
        { level: 17, totalExp: 20230, expPerTap: 17, coinsPerTap: 17, maxCoins: 20230 },
        { level: 18, totalExp: 22680, expPerTap: 18, coinsPerTap: 18, maxCoins: 22680 },
        { level: 19, totalExp: 25270, expPerTap: 19, coinsPerTap: 19, maxCoins: 25270 },
        { level: 20, totalExp: 28000, expPerTap: 20, coinsPerTap: 20, maxCoins: 28000 },
        { level: 21, totalExp: 30870, expPerTap: 21, coinsPerTap: 21, maxCoins: 30870 },
        { level: 22, totalExp: 33880, expPerTap: 22, coinsPerTap: 22, maxCoins: 33880 },
        { level: 23, totalExp: 37030, expPerTap: 23, coinsPerTap: 23, maxCoins: 37030 },
        { level: 24, totalExp: 40320, expPerTap: 24, coinsPerTap: 24, maxCoins: 40320 },
        { level: 25, totalExp: 43750, expPerTap: 25, coinsPerTap: 25, maxCoins: 43750 },
        { level: 26, totalExp: 47320, expPerTap: 26, coinsPerTap: 26, maxCoins: 47320 },
        { level: 27, totalExp: 51030, expPerTap: 27, coinsPerTap: 27, maxCoins: 51030 },
        { level: 28, totalExp: 54880, expPerTap: 28, coinsPerTap: 28, maxCoins: 54880 },
        { level: 29, totalExp: 58870, expPerTap: 29, coinsPerTap: 29, maxCoins: 58870 },
        { level: 30, totalExp: 63000, expPerTap: 30, coinsPerTap: 30, maxCoins: 63000 },
        { level: 31, totalExp: 67270, expPerTap: 31, coinsPerTap: 31, maxCoins: 67270 },
        { level: 32, totalExp: 71680, expPerTap: 32, coinsPerTap: 32, maxCoins: 71680 },
        { level: 33, totalExp: 76230, expPerTap: 33, coinsPerTap: 33, maxCoins: 76230 },
        { level: 34, totalExp: 80920, expPerTap: 34, coinsPerTap: 34, maxCoins: 80920 },
        { level: 35, totalExp: 85750, expPerTap: 35, coinsPerTap: 35, maxCoins: 85750 },
        { level: 36, totalExp: 90720, expPerTap: 36, coinsPerTap: 36, maxCoins: 90720 },
        { level: 37, totalExp: 95830, expPerTap: 37, coinsPerTap: 37, maxCoins: 95830 },
        { level: 38, totalExp: 101080, expPerTap: 38, coinsPerTap: 38, maxCoins: 101080 },
        { level: 39, totalExp: 106470, expPerTap: 39, coinsPerTap: 39, maxCoins: 106470 },
        { level: 40, totalExp: 112000, expPerTap: 40, coinsPerTap: 40, maxCoins: 112000 },
        { level: 41, totalExp: 117670, expPerTap: 41, coinsPerTap: 41, maxCoins: 117670 },
        { level: 42, totalExp: 123480, expPerTap: 42, coinsPerTap: 42, maxCoins: 123480 },
        { level: 43, totalExp: 129430, expPerTap: 43, coinsPerTap: 43, maxCoins: 129430 },
        { level: 44, totalExp: 135520, expPerTap: 44, coinsPerTap: 44, maxCoins: 135520 },
        { level: 45, totalExp: 141750, expPerTap: 45, coinsPerTap: 45, maxCoins: 141750 },
        { level: 46, totalExp: 148120, expPerTap: 46, coinsPerTap: 46, maxCoins: 148120 },
        { level: 47, totalExp: 154630, expPerTap: 47, coinsPerTap: 47, maxCoins: 154630 },
        { level: 48, totalExp: 161280, expPerTap: 48, coinsPerTap: 48, maxCoins: 161280 },
        { level: 49, totalExp: 168070, expPerTap: 49, coinsPerTap: 49, maxCoins: 168070 },
        { level: 50, totalExp: 175000, expPerTap: 50, coinsPerTap: 50, maxCoins: 175000 },
        { level: 51, totalExp: 182070, expPerTap: 51, coinsPerTap: 51, maxCoins: 182070 },
        { level: 52, totalExp: 189280, expPerTap: 52, coinsPerTap: 52, maxCoins: 189280 },
        { level: 53, totalExp: 196630, expPerTap: 53, coinsPerTap: 53, maxCoins: 196630 },
        { level: 54, totalExp: 204120, expPerTap: 54, coinsPerTap: 54, maxCoins: 204120 },
        { level: 55, totalExp: 211750, expPerTap: 55, coinsPerTap: 55, maxCoins: 211750 },
        { level: 56, totalExp: 219520, expPerTap: 56, coinsPerTap: 56, maxCoins: 219520 },
        { level: 57, totalExp: 227430, expPerTap: 57, coinsPerTap: 57, maxCoins: 227430 },
        { level: 58, totalExp: 235480, expPerTap: 58, coinsPerTap: 58, maxCoins: 235480 },
        { level: 59, totalExp: 243670, expPerTap: 59, coinsPerTap: 59, maxCoins: 243670 },
        { level: 60, totalExp: 252000, expPerTap: 60, coinsPerTap: 60, maxCoins: 252000 },
        { level: 61, totalExp: 260470, expPerTap: 61, coinsPerTap: 61, maxCoins: 260470 },
        { level: 62, totalExp: 269080, expPerTap: 62, coinsPerTap: 62, maxCoins: 269080 },
        { level: 63, totalExp: 277830, expPerTap: 63, coinsPerTap: 63, maxCoins: 277830 },
        { level: 64, totalExp: 286720, expPerTap: 64, coinsPerTap: 64, maxCoins: 286720 },
        { level: 65, totalExp: 295750, expPerTap: 65, coinsPerTap: 65, maxCoins: 295750 },
        { level: 66, totalExp: 304920, expPerTap: 66, coinsPerTap: 66, maxCoins: 304920 },
        { level: 67, totalExp: 314230, expPerTap: 67, coinsPerTap: 67, maxCoins: 314230 },
        { level: 68, totalExp: 323680, expPerTap: 68, coinsPerTap: 68, maxCoins: 323680 },
        { level: 69, totalExp: 333270, expPerTap: 69, coinsPerTap: 69, maxCoins: 333270 },
        { level: 70, totalExp: 343000, expPerTap: 70, coinsPerTap: 70, maxCoins: 343000 },
        { level: 71, totalExp: 352870, expPerTap: 71, coinsPerTap: 71, maxCoins: 352870 },
        { level: 72, totalExp: 362880, expPerTap: 72, coinsPerTap: 72, maxCoins: 362880 },
        { level: 73, totalExp: 373030, expPerTap: 73, coinsPerTap: 73, maxCoins: 373030 },
        { level: 74, totalExp: 383320, expPerTap: 74, coinsPerTap: 74, maxCoins: 383320 },
        { level: 75, totalExp: 393750, expPerTap: 75, coinsPerTap: 75, maxCoins: 393750 },
        { level: 76, totalExp: 404320, expPerTap: 76, coinsPerTap: 76, maxCoins: 404320 },
        { level: 77, totalExp: 415030, expPerTap: 77, coinsPerTap: 77, maxCoins: 415030 },
        { level: 78, totalExp: 425880, expPerTap: 78, coinsPerTap: 78, maxCoins: 425880 },
        { level: 79, totalExp: 436870, expPerTap: 79, coinsPerTap: 79, maxCoins: 436870 },
        { level: 80, totalExp: 448000, expPerTap: 80, coinsPerTap: 80, maxCoins: 448000 },
        { level: 81, totalExp: 459270, expPerTap: 81, coinsPerTap: 81, maxCoins: 459270 },
        { level: 82, totalExp: 470680, expPerTap: 82, coinsPerTap: 82, maxCoins: 470680 },
        { level: 83, totalExp: 482230, expPerTap: 83, coinsPerTap: 83, maxCoins: 482230 },
        { level: 84, totalExp: 493920, expPerTap: 84, coinsPerTap: 84, maxCoins: 493920 },
        { level: 85, totalExp: 505750, expPerTap: 85, coinsPerTap: 85, maxCoins: 505750 },
        { level: 86, totalExp: 517720, expPerTap: 86, coinsPerTap: 86, maxCoins: 517720 },
        { level: 87, totalExp: 529830, expPerTap: 87, coinsPerTap: 87, maxCoins: 529830 },
        { level: 88, totalExp: 542080, expPerTap: 88, coinsPerTap: 88, maxCoins: 542080 },
        { level: 89, totalExp: 554470, expPerTap: 89, coinsPerTap: 89, maxCoins: 554470 },
        { level: 90, totalExp: 567000, expPerTap: 90, coinsPerTap: 90, maxCoins: 567000 },
        { level: 91, totalExp: 579670, expPerTap: 91, coinsPerTap: 91, maxCoins: 579670 },
        { level: 92, totalExp: 592480, expPerTap: 92, coinsPerTap: 92, maxCoins: 592480 },
        { level: 93, totalExp: 605430, expPerTap: 93, coinsPerTap: 93, maxCoins: 605430 },
        { level: 94, totalExp: 618520, expPerTap: 94, coinsPerTap: 94, maxCoins: 618520 },
        { level: 95, totalExp: 631750, expPerTap: 95, coinsPerTap: 95, maxCoins: 631750 },
        { level: 96, totalExp: 645120, expPerTap: 96, coinsPerTap: 96, maxCoins: 645120 },
        { level: 97, totalExp: 658630, expPerTap: 97, coinsPerTap: 97, maxCoins: 658630 },
        { level: 98, totalExp: 672280, expPerTap: 98, coinsPerTap: 98, maxCoins: 672280 },
        { level: 99, totalExp: 686070, expPerTap: 99, coinsPerTap: 99, maxCoins: 686070 },
        { level: 100, totalExp: 700000, expPerTap: 100, coinsPerTap: 100, maxCoins: 700000 }
    ];
    
    function formatNumber(value) {
        if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
        if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
        if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
        return value.toString();
    }

    let coins = parseInt(localStorage.getItem('coins')) || 10000;
    let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000;
    let isFlowerClickable = true;
    let lastClickTime = 0;
    let rotationAngle = 0; // Для вращения ромашки
    let lastPredictionTime = parseInt(localStorage.getItem('lastPredictionTime')) || 0;
    let isFlowerClickableForPrediction = true;
    let level = parseInt(localStorage.getItem('playerLevel')) || 1;
    let experience = parseInt(localStorage.getItem('playerExperience')) || 0;
    let experienceToNextLevel = level * 100;
    let incomePerHour = parseInt(localStorage.getItem('incomePerHour')) || 0;
    let lastIncomeTime = parseInt(localStorage.getItem('lastIncomeTime')) || Date.now();
    let tickets = parseInt(localStorage.getItem('tickets')) || 200;
    let currentXP = 150; // Пример текущего опыта
    let xpForNextLevel = 300; // Пример опыта для следующего уровня
    let usedPredictions = JSON.parse(localStorage.getItem('usedPredictions')) || [];
    let predictionHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
    let chamomile;

    function init() {
        coins = parseInt(localStorage.getItem('coins')) || 10000;
        spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000;

        // Запретить выделение значка настроек
        const settingsButton = document.getElementById('settings-button');
        if (settingsButton) {
            settingsButton.style.userSelect = 'none';
            settingsButton.style.webkitUserSelect = 'none';
            settingsButton.style.mozUserSelect = 'none';
            settingsButton.style.msUserSelect = 'none';
            settingsButton.style.cursor = 'pointer'; // Курсор указателя
        }

        // Разрешить нажатие на картинки в меню выбора игр
        const game1Thumbnail = document.getElementById('game1-thumbnail');
        const game2Thumbnail = document.getElementById('game2-thumbnail');

        if (game1Thumbnail) {
            game1Thumbnail.addEventListener('click', () => {
                document.getElementById('start-game-1').click(); // Запуск первой игры
            });
        }

        if (game2Thumbnail) {
            game2Thumbnail.addEventListener('click', () => {
                const startGame2Button = document.getElementById('start-game-2');
                if (startGame2Button && !startGame2Button.disabled) {
                    startGame2Button.click(); // Запуск второй игры, если кнопка активна
                }
            });
        }

        chamomile = document.getElementById('chamomile');
        if (!chamomile) {
            console.error('Элемент с id="chamomile" не найден в DOM.');
            return;
        }

        // Отключение контекстного меню и длительного нажатия
        chamomile.addEventListener('contextmenu', function (e) {
            e.preventDefault();
        }, false);

        chamomile.addEventListener('pointerdown', function (e) {
            if (e.pointerType === 'touch') {
                e.preventDefault();
            }
        }, false);

        // Обновление начального состояния
        updateEnergyBar();

        // Обновление отображения монет и билетов
        updateElementText('coin-count', coins);
        updateElementText('spin-coin-count', spinCoins);
        updateElementText('ticket-count', tickets);
        updateElementText('energy-count', window.energy); // Обновляем отображение энергии

        // Обновление уровня и прогресса
        updateElementText('level-number', level);
        updateLevelProgress();

        // Обновление прибыли в час
        updateElementText('income-per-hour', incomePerHour);

        // Обработчики кликов по ромашке
        chamomile.addEventListener('click', handleChamomileClick);
        chamomile.addEventListener('click', () => {
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        });
        chamomile.addEventListener('dblclick', handleChamomileDblClick);

        // Инициализация таймеров
        updatePredictionTimer();
        setInterval(updatePredictionTimer, 1000);
        calculatePassiveIncome();
        setInterval(calculatePassiveIncome, 60000); // Каждую минуту

        // Инициализация магазина
        Shop.updateBalance(coins, spinCoins);
    }

    function updateElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            const formattedValue = (id === 'coin-count' || id === 'spin-coin-count') ? formatNumber(value) : value;
            element.textContent = formattedValue;
        } else {
            console.error(`Элемент с id="${id}" не найден в DOM.`);
        }
    }

    let glowTimeout;

    function handleChamomileClick(e) {
        const now = Date.now();
        if (now - lastClickTime >= 100 && window.energy > 0 && isFlowerClickable) {
            lastClickTime = now;
            AudioManager.playClickSound();
    
            // Получаем данные для текущего уровня
            const levelInfo = levelData[level - 1];
    
            // Начисляем монеты, если не достигли лимита монет на уровне
            if (spinCoins < levelInfo.maxCoins) {
                spinCoins += levelInfo.coinsPerTap;
                updateElementText('spin-coin-count', spinCoins);
                localStorage.setItem('spinCoins', spinCoins);
            }
    
        // Отображаем количество начисленных монет (динамическое значение вместо "+1")
        showPlusOne(e.clientX, e.clientY, levelInfo.coinsPerTap);
    
            const chamomileContainer = document.querySelector('.chamomile-container');
            const glowElement = chamomileContainer.querySelector('.chamomile-glow');
            
            // Добавляем "активный" класс для эффекта свечения
            glowElement.classList.add('active');
    
            // Сбрасываем таймер, если клики продолжаются
            clearTimeout(glowTimeout);
            glowTimeout = setTimeout(() => {
                glowElement.classList.remove('active'); // Убираем эффект только после затухания
            }, 1000);
    
            // Уменьшаем энергию
            window.energy -= 10;
            if (window.energy < 0) window.energy = 0;
            updateElementText('energy-count', window.energy);
            localStorage.setItem('energy', window.energy);
    
            updateEnergyBar();
    
            // Добавляем опыт в зависимости от текущего уровня
            experience += levelInfo.expPerTap;
            gainExperience(); // Начисляем опыт за тап
    
            rotationAngle += 360 * 4.5 + Math.random() * 360;
            chamomile.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
            chamomile.style.transform = `rotate(${rotationAngle}deg)`;
            createSparks(e.clientX, e.clientY);
            animateCoin(e.clientX, e.clientY);
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
            updateElementText('prediction-title', prediction);
            Modal.savePrediction(prediction);
    
            const earnedCoins = Math.floor(Math.random() * (550 - 250 + 1)) + 250;
            coins += earnedCoins;
            updateElementText('coin-count', coins);
            localStorage.setItem('coins', coins);
            startCountdown(6 * 60 * 60);
            createConfetti();
    
            gainExperience(50);
    
            const date = new Date().toLocaleString();
            predictionHistory.unshift({ prediction, date });
            if (predictionHistory.length > 10) predictionHistory.pop();
            localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));
            updatePredictionHistory();
    
            const ticketAmount = 3;  
            tickets += ticketAmount;
            updateElementText('ticket-count', tickets);
            localStorage.setItem('tickets', tickets);
            showTicketNotification(ticketAmount);
        }
    }

    function updateEnergyBar() {
        if (window.energy >= 10) {
            chamomile.style.filter = "none";
            chamomile.style.pointerEvents = 'auto';
            isFlowerClickable = true;
        } else {
            chamomile.style.filter = "grayscale(100%)";
            chamomile.style.pointerEvents = 'none';
            isFlowerClickable = false;
        }
    }

    function getRandomPrediction() {
        const predictions = [
            "Сегодня удача улыбнется вам во всех начинаниях. Не упустите свой шанс!",
            "Впереди вас ждет важная встреча, которая может изменить вашу жизнь. Будьте готовы!",
            "Сегодня отличный день для новых начинаний. Действуйте смело!",
            "Вас ожидает приятный сюрприз. Будьте наготове!",
            "Ваши усилия скоро принесут плоды. Терпение - ключ к успеху."
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
        if (!historyContainer) {
            console.error('Элемент с id="predictions-history" не найден в DOM.');
            return;
        }
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

    // Проверка и создание canvas для конфетти
    let confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) {
        confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confetti-canvas';
        confettiCanvas.style.position = 'fixed';
        confettiCanvas.style.top = '0';
        confettiCanvas.style.left = '0';
        confettiCanvas.style.width = '100vw';
        confettiCanvas.style.height = '100vh';
        confettiCanvas.style.pointerEvents = 'none';
        confettiCanvas.style.zIndex = '1000';
        document.body.appendChild(confettiCanvas);
    }

    // Функция для запуска конфетти
    function createConfetti() {
        const confettiCanvas = document.getElementById('confetti-canvas');
        const confettiInstance = confetti.create(confettiCanvas, { resize: true });
        confettiInstance({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
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
        if (coinCount) {
            coinCount.classList.add('pulse');
            setTimeout(() => {
                coinCount.classList.remove('pulse');
            }, 500);
        } else {
            console.error('Элемент с id="spin-coin-count" не найден в DOM.');
        }
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

    function showPlusOne(x, y, coinsPerTap) {
        const plusOne = document.createElement('div');
        plusOne.className = 'plus-one';
        plusOne.textContent = `+${coinsPerTap}`; // Отображаем текущее значение coinsPerTap
        document.body.appendChild(plusOne);
    
        // Устанавливаем начальное положение "+coinsPerTap"
        plusOne.style.left = `${x}px`;
        plusOne.style.top = `${y}px`;
    
        // Получаем координаты счётчика `spin-coin-count`
        const target = document.getElementById('spin-coin-count').getBoundingClientRect();
    
        // Анимация полета к счётчику монет
        plusOne.animate([
            { transform: 'translate(0, 0)', opacity: 1 },
            { transform: `translate(${target.left - x}px, ${target.top - y}px)`, opacity: 0 }
        ], {
            duration: 1000,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    
        // Удаляем элемент после завершения анимации
        setTimeout(() => plusOne.remove(), 1000);
    }

    function startCountdown(seconds) {
        const countdownElement = document.getElementById('prediction-timer');
        if (!countdownElement) {
            console.error('Таймер не найден');
            return;
        }
    
        countdownElement.textContent = formatTime(seconds);
    
        let remaining = seconds;
        const interval = setInterval(() => {
            remaining--;
            countdownElement.textContent = formatTime(remaining);
            if (remaining <= 0) {
                clearInterval(interval);
                countdownElement.textContent = '00:00:00';
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
        if (predictionTimerElement) {
            predictionTimerElement.textContent = formatTime(Math.floor(remaining));
        } else {
            console.error('Элемент с id="prediction-timer" не найден в DOM.');
        }

        isFlowerClickableForPrediction = remaining <= 0;
    }

    function gainExperience() {
        const levelInfo = levelData[level - 1]; // Получаем данные текущего уровня
    
        if (experience >= levelInfo.totalExp) {
            levelUp(); // Если накоплено достаточно опыта, повышаем уровень
        }
    
        updateLevelProgress(); // Обновляем отображение прогресса на уровне
        localStorage.setItem('playerExperience', experience); // Сохраняем опыт


    // Запускаем анимацию звездочек
    animateRocketStarTrail();
    }

    function animateRocketStarTrail() {
        const progressBar = document.getElementById('level-progress');
        const progressBarContainer = progressBar.parentElement;
        const progressBarWidth = progressBarContainer.offsetWidth;
    
        // Устанавливаем CSS-переменную для ширины анимации
        progressBarContainer.style.setProperty('--progress-bar-width', `${progressBarWidth}px`);
    
        // Создаем основную "головную" звезду
        const mainStar = document.createElement('div');
        mainStar.className = 'star-main';
        mainStar.textContent = '⭐';
        mainStar.style.left = '0px';
        mainStar.style.top = '30%'; // Поднимаем звезду выше полоски
    
        // Добавляем основную звезду в контейнер полоски
        progressBarContainer.appendChild(mainStar);
    
        // Создаем хвост из маленьких звезд
        const trailInterval = setInterval(() => {
            const trailStar = document.createElement('div');
            trailStar.className = 'star-trail';
            trailStar.textContent = '★';
    
            // Позиционируем хвостовую звезду на текущей позиции основной звезды
            const mainStarRect = mainStar.getBoundingClientRect();
            const progressBarRect = progressBarContainer.getBoundingClientRect();
    
            trailStar.style.left = `${mainStarRect.left - progressBarRect.left}px`;
            trailStar.style.top = '30%'; // Совпадает с позицией основной звезды
            trailStar.style.transform = 'translateY(-50%)';
    
            // Добавляем хвостовую звезду в контейнер полоски
            progressBarContainer.appendChild(trailStar);
    
            // Плавное исчезновение хвостовой звезды
            setTimeout(() => {
                trailStar.style.opacity = '0';
            }, 100);
    
            // Удаляем хвостовую звезду после завершения анимации
            setTimeout(() => {
                trailStar.remove();
            }, 500);
        }, 150);
    
        // Остановка генерации хвоста и удаление основной звезды после завершения анимации
        setTimeout(() => {
            clearInterval(trailInterval);
            mainStar.remove();
        }, 1000);
    }

    function addTickets(amount) {
        let currentTickets = parseInt(localStorage.getItem('tickets')) || 0;
        currentTickets += amount;
        localStorage.setItem('tickets', currentTickets);
        updateTicketCount('main-ticket-count'); // Обновляем после добавления
        updateTicketCount('mini-game-ticket-count'); // Обновляем для мини-игры
    }
    
    function useTickets(amount) {
        let currentTickets = parseInt(localStorage.getItem('tickets')) || 0;
        if (currentTickets >= amount) {
            currentTickets -= amount;
            localStorage.setItem('tickets', currentTickets);
            updateTicketCount('main-ticket-count'); // Обновляем после использования
            updateTicketCount('mini-game-ticket-count'); // Обновляем для мини-игры
        } else {
            console.log("Недостаточно билетов.");
        }
    }

    function levelUp() {
        level += 1;
        experience = 0;
        const levelInfo = levelData[level - 1]; // Новый уровень
        experienceToNextLevel = levelInfo.totalExp;
    
        updateElementText('level-number', level);
        localStorage.setItem('playerLevel', level);
    
        // Начисляем билеты
        addTickets(2);
    
        // Отображаем модальное окно уровня
        showLevelUpModal(level);
    }

    function updateLevelProgress() {
        const levelInfo = levelData[level - 1];
        const progressPercent = (experience / levelInfo.totalExp) * 100;
        const levelProgressElement = document.getElementById('level-progress');
        const xpDisplayElement = document.getElementById('xp-display');
    
        if (levelProgressElement && xpDisplayElement) {
            levelProgressElement.style.width = `${progressPercent}%`;
            xpDisplayElement.textContent = `${experience} / ${levelInfo.totalExp} XP`;
        }
    }

    function gainXP(amount) {
        currentXP += amount;
        
        if (currentXP >= xpForNextLevel) {
            currentXP = currentXP - xpForNextLevel;
            xpForNextLevel += 100;
            document.getElementById('level-number').textContent = parseInt(document.getElementById('level-number').textContent) + 1;
        }

        updateLevelProgress();
    }

    function calculatePassiveIncome() {
        const now = Date.now();
        const elapsedHours = (now - lastIncomeTime) / (1000 * 60 * 60);
        if (elapsedHours >= 1) {
            const income = Math.floor(elapsedHours * incomePerHour);
            spinCoins += income;
            updateElementText('spin-coin-count', spinCoins);
            localStorage.setItem('spinCoins', spinCoins);
            lastIncomeTime = now;
            localStorage.setItem('lastIncomeTime', lastIncomeTime);
        }
    }

    function showTicketNotification(ticketAmount) {
        const ticketNotification = document.getElementById('ticket-notification');
        if (ticketNotification) {
            ticketNotification.innerHTML = `
                <img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon">
                <span>Ваш подарок: ${ticketAmount} билета(ов)</span>
            `;
            
            // Показываем уведомление
            ticketNotification.classList.add('show');
            
            // Скрываем через 5 секунд
            setTimeout(() => {
                ticketNotification.classList.remove('show');
            }, 5000);
        } else {
            console.error('Элемент с id="ticket-notification" не найден.');
        }
    }

    // Функция для отображения модального окна уровня
    function showLevelUpModal(level) {
        const modal = document.getElementById('level-up-modal');
        const levelSpan = document.getElementById('new-level');
        const ticketsSpan = document.getElementById('tickets-earned');
    
        // Обновляем текст уровня и количество билетов
        levelSpan.textContent = level;
        ticketsSpan.textContent = 2;
    
        // Воспроизведение звука и конфетти
        AudioManager.playLevelUpSound();
        createConfetti();
    
        // Показываем модальное окно
        modal.classList.add('show');
    
        // Автоматическое скрытие окна через 5 секунд
        setTimeout(() => {
            modal.classList.remove('show');
        }, 5000);
    }

    return {
        init,
        updateEnergyBar, 
        addTickets,      // Экспортируем функцию addTickets
        useTickets        // Экспортируем функцию useTickets
    };
})();
