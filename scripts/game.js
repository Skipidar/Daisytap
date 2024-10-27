const Game = (function() {
    let coins = parseInt(localStorage.getItem('coins')) || 10000; // Начальное количество $Daisy
    let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000; // Начальное количество Coin
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
        chamomile = document.getElementById('chamomile');
        if (!chamomile) {
            console.error('Элемент с id="chamomile" не найден в DOM.');
            return;
        }
    
        // Обновляем начальное состояние ромашки
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

        // Обработчик клика по ромашке
        chamomile.addEventListener('click', handleChamomileClick);

        // Добавление вибро-отклика
        chamomile.addEventListener('click', () => {
            if (navigator.vibrate) {
                navigator.vibrate(10);
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

        // Инициализация магазина
        Shop.updateBalance(coins, spinCoins);
    }

    function handleChamomileClick(e) {
        const now = Date.now();
        if (now - lastClickTime >= 100 && window.energy > 0 && isFlowerClickable) {
            lastClickTime = now;
            AudioManager.playClickSound();
            spinCoins += 1;
            updateElementText('spin-coin-count', spinCoins);
            localStorage.setItem('spinCoins', spinCoins);
    
            showPlusOne(e.clientX, e.clientY);
    
            const chamomileContainer = document.querySelector('.chamomile-container');
            const glowElement = chamomileContainer.querySelector('.chamomile-glow');
            glowElement.classList.add('active');
            console.log('Added active class to chamomile-glow');
    
            setTimeout(() => {
                glowElement.classList.remove('active');
                console.log('Removed active class from chamomile-glow');
            }, 100); // Соответствует длительности анимации 0.1s
    
    
            window.energy -= 10;
            if (window.energy < 0) window.energy = 0;
            updateElementText('energy-count', window.energy);
            localStorage.setItem('energy', window.energy);
    
            updateEnergyBar();
            gainExperience(1);
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
            Modal.savePrediction(prediction);  // Вызов через объект Modal
    
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
    
            const ticketAmount = Math.floor(Math.random() * 5) + 1;
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
    confettiCanvas.style.zIndex = '1000'; // Высокий z-index для поверх всех окон
    document.body.appendChild(confettiCanvas);
}

// Функция для запуска конфетти
function createConfetti() {
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

    function showPlusOne(x, y) {
        const plusOne = document.createElement('div');
        plusOne.textContent = '+1';
        plusOne.style.position = 'absolute';
        plusOne.style.left = `${x}px`;
        plusOne.style.top = `${y}px`;
        plusOne.style.transform = 'translate(-50%, -50%)'; // Центрируем по точке клика
        plusOne.style.color = '#FFD700'; // Желтый цвет
        plusOne.style.fontSize = '1.5rem';
        plusOne.style.fontWeight = 'bold';
        plusOne.style.pointerEvents = 'none';
        plusOne.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        plusOne.style.opacity = '1';
        
        document.body.appendChild(plusOne);
        
        // Анимация: движение вверх и исчезновение
        setTimeout(() => {
            plusOne.style.transform = 'translate(-50%, -100%)'; // Сместим вверх
            plusOne.style.opacity = '0';
        }, 50);
        
        // Удаление элемента после анимации
        setTimeout(() => {
            plusOne.remove();
        }, 550);
    }

    function startCountdown(seconds) {
        // Находим или создаем элемент таймера только для "До следующего предсказания"
        const countdownElement = document.getElementById('prediction-timer');
        if (!countdownElement) {
            console.error('Таймер не найден');
            return;
        }
    
        // Обновляем текст таймера
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
        updateElementText('level-number', level);
        localStorage.setItem('playerLevel', level);
    }

// Обновляем текст и прогресс XP
function updateLevelProgress() {
    const progressPercent = (experience / experienceToNextLevel) * 100;
    const levelProgressElement = document.getElementById('level-progress');
    const xpDisplayElement = document.getElementById('xp-display'); // Элемент для отображения XP

    if (levelProgressElement && xpDisplayElement) {
        // Обновляем ширину прогресс-бара
        levelProgressElement.style.width = `${progressPercent}%`;

        // Обновляем текст внутри полоски прогресса
        xpDisplayElement.textContent = `${experience} / ${experienceToNextLevel} XP`;
    }
}

// Функция для получения опыта (пример)
function gainXP(amount) {
    currentXP += amount;
    
    // Если текущий опыт больше или равен опыту для следующего уровня
    if (currentXP >= xpForNextLevel) {
        currentXP = currentXP - xpForNextLevel; // Обнулить лишний опыт
        xpForNextLevel += 100; // Увеличить требуемый опыт для следующего уровня (пример)
        document.getElementById('level-number').textContent = parseInt(document.getElementById('level-number').textContent) + 1;
    }

    // Обновляем прогресс
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

    function showTicketNotification() {
        const ticketNotification = document.getElementById('ticket-notification');
        if (ticketNotification) {
            ticketNotification.innerHTML = `
                <p>Поздравляем! Ваш подарок: <span id="ticket-amount">3</span> билета</p>
                <img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon">
            `;
            
            // Показываем уведомление с задержкой после конфетти
            setTimeout(() => {
                ticketNotification.classList.add('show');
    
                // Убираем уведомление через 5 секунд
                setTimeout(() => {
                    ticketNotification.classList.remove('show');
                }, 5000);
            }, 1000);
        } else {
            console.error('Элемент с id="ticket-notification" не найден в DOM.');
        }
    }

    function updateElementText(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        } else {
            console.error(`Элемент с id="${id}" не найден в DOM.`);
        }
    }

    return {
        init,
        updateEnergyBar
    };
})();

document.addEventListener('DOMContentLoaded', Game.init);
