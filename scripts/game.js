const Game = (function() {
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
            spinCoins += 1;
            updateElementText('spin-coin-count', spinCoins);
            localStorage.setItem('spinCoins', spinCoins);
    
            showPlusOne(e.clientX, e.clientY);
    
            const chamomileContainer = document.querySelector('.chamomile-container');
            const glowElement = chamomileContainer.querySelector('.chamomile-glow');
            
            // Добавляем "активный" класс для эффекта свечения
            glowElement.classList.add('active');
    
            // Сбрасываем таймер, если клики продолжаются
            clearTimeout(glowTimeout);
            glowTimeout = setTimeout(() => {
                glowElement.classList.remove('active'); // Убираем эффект только после затухания
            }, 1000);
    
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

    function showPlusOne(x, y) {
        const plusOne = document.createElement('div');
        plusOne.className = 'plus-one';
        plusOne.textContent = "+1";
        document.body.appendChild(plusOne);
    
        // Устанавливаем начальное положение "+1"
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

    function gainExperience(amount) {
        experience += amount;
        if (experience >= experienceToNextLevel) {
            levelUp();
        }
        updateLevelProgress();
        localStorage.setItem('playerExperience', experience);
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
        level += 1;  // Повышение уровня
        experience = 0;
        experienceToNextLevel = level * 100;
        updateElementText('level-number', level);
        localStorage.setItem('playerLevel', level);
    
        // Добавляем билеты и обновляем интерфейс
        addTickets(2); // Добавляет 2 билета и сохраняет в локальное хранилище
        updateTicketCount('ticket-count');  // Обновляем счетчик на главном экране
    
        // Отображаем модальное окно уровня
        showLevelUpModal(level, 2);  // 2 — количество билетов, отобразится в модальном окне
    }

    function updateLevelProgress() {
        const progressPercent = (experience / experienceToNextLevel) * 100;
        const levelProgressElement = document.getElementById('level-progress');
        const xpDisplayElement = document.getElementById('xp-display');

        if (levelProgressElement && xpDisplayElement) {
            levelProgressElement.style.width = `${progressPercent}%`;
            xpDisplayElement.textContent = `${experience} / ${experienceToNextLevel} XP`;
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
