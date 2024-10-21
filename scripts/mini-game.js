const MiniGame = (function () {
    let gameTime = 10; // 10 секунд для тестирования
    let bees = [];
    let hearts = [];
    let coins = [];
    let heartInterval;
    let coinInterval;
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0; // Это Coin
    let daisyCoins = 0; // Это $Daisy
    let currentLevel = 1;
    let isGamePaused = false; // Новый флаг для паузы
    let flower; // Переменная для цветка
    let isGameRunning = false;
    let ctx;
    let canvas;
    let totalCoinsEarned = 0;
    let tickets = parseInt(localStorage.getItem('tickets')) || 200;
    let isCountdownDone = false;
    let spinCoins = 0; // Глобальная переменная для счётчика монет

    function updateGameCoinCount(count) {
        const gameCoinCountElement = document.getElementById('game-coin-count');
        if (gameCoinCountElement) {
            gameCoinCountElement.textContent = count;
        } else {
            console.error("Элемент game-coin-count не найден.");
        }
    }

    function clearGameObjects() {
        bees = [];
        hearts = [];
        coins = [];
    }

    function init() {
        const startButton = document.getElementById('start-mini-game');
        startButton.addEventListener('click', startGame);

        // Добавлен обработчик кнопки "Назад"
        document.addEventListener('backbutton', handleBackButton, false);
    }

    function handleBackButton() {
        if (isGameRunning) {
            endGame();
            document.querySelector('.game-container').style.display = 'flex';
            document.getElementById('protect-flower-game').style.display = 'none';
    
            // Показать кнопку "Старт" при возврате в игру
            const startButton = document.getElementById('start-mini-game');
            startButton.style.display = 'block';
        } else {
            navigator.app.exitApp();
        }
    }
    const startButton = document.getElementById('start-mini-game');

    // Обновление текста кнопки с отображением количества билетов
    function updateStartButton() {
        startButton.innerHTML = `
            <img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon"> 
            Старт (Билеты: ${tickets})
        `;
    }
    
    // Вызов функции для обновления кнопки
    updateStartButton();
    function startGame() {
        if (isGameRunning) return; // Предотвращаем повторный запуск игры, если она уже запущена
    
        if (currentLevel === 1) {
            // Билет списывается только на первом уровне
            if (tickets <= 0) {
                alert("Недостаточно билетов!");
                return;
            }
            
            tickets -= 1;
            updateTicketCount(); // Обновляем отображение количества билетов
            localStorage.setItem('tickets', tickets); // Сохраняем новое количество билетов
        }
    
        isGameRunning = true;
        isCountdownDone = false;
    
        // Сбрасываем уровень игры до первого
        currentLevel = 1;
    
        // Показываем холст и скрываем кнопку старта
        const gameScreen = document.getElementById('protect-flower-game');
        const startButton = document.getElementById('start-mini-game');
        startButton.style.display = 'none'; // Скрываем кнопку "Старт"
        gameScreen.style.display = 'flex'; // Показываем экран игры
    
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        canvas.width = gameScreen.clientWidth;
        canvas.height = gameScreen.clientHeight;
    
        // Сбрасываем все игровые переменные
        resetGameVariables();
    
        // Сброс таймеров и объектов
        clearGameObjects(); // Очищаем пчёл, сердца и монеты
    
        startCountdown(() => {
            isCountdownDone = true;
            startGameLoop(); // Начинаем основной игровой цикл
        });
    }

    function startGameLoop() {
        function gameLoop() {
            if (!isCountdownDone || isGamePaused) return; // Прерываем цикл, если игра на паузе
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
    
            // Обновляем объекты игры (цветок, пчелы, сердца, монеты)
            flower.draw();
            updateBees(ctx, flower);
            updateHearts();
            updateCoins();
    
            // Запускаем следующий кадр
            requestAnimationFrame(gameLoop);
        }
    
        gameLoop(); // Запуск основного игрового цикла
    }
    

    function resetGameVariables() {
        lives = 3; // Сбрасываем жизни
        bees = [];
        hearts = [];
        coins = [];
        gameTime = 60; // Время для 1-го уровня
        gameCoins = 0;
        daisyCoins = 0;
        updateGameCoinCount(); // Обновляем отображение количества монет
    
        flower = { // Присваиваем объект flower глобальной переменной
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 100,
            height: 100,
            image: new Image(),
            draw: function () {
                ctx.drawImage(
                    this.image,
                    this.x - this.width / 2,
                    this.y - this.height / 2,
                    this.width,
                    this.height
                );
            },
        };
        flower.image.src = 'assets/images/PodsolnuhBEE.webp';
        flower.image.onload = () => {
            flower.draw();
        };
    
        isGamePaused = false; // Сбрасываем флаг паузы
    
        lives = 3;
        updateLives();
    
        bees = [];
        hearts = [];
        coins = [];
        gameTime = 60; // Время для 1-го уровня (для теста)
        gameCoins = 0;
        daisyCoins = 0;
        updateGameCoinCount();
    
        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }
    
        document.getElementById('start-mini-game').style.display = 'none';
        canvas.addEventListener('click', handleCanvasClick);
    
        startCountdown(() => {
            isCountdownDone = true;
            const spawnInterval = currentLevel === 1 ? 1500 : 1000;
            beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);
    
            heartInterval = setInterval(spawnHeart, 20000);
            coinInterval = setInterval(spawnCoin, currentLevel === 1 ? 25000 : 15000);
    
            gameTimerInterval = setInterval(() => {
                gameTime--;
                document.getElementById('game-timer').textContent = formatTime(gameTime);
    
                if (gameTime <= 0) {
                    if (currentLevel === 1) {
                        currentLevel = 2;
                        gameTime = 60; // Время для 2-го уровня (для теста)
                        clearInterval(beeInterval);
                        beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
                        showLevelCompleteModal();
                    } else {
                        endGame();
                    }
                }
            }, 1000);

            let isGamePaused = false; // Новый флаг для паузы

            function gameLoop() {
                if (!isCountdownDone || isGamePaused) return; // Прерываем цикл, если игра на паузе
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                flower.draw();
                updateBees(ctx, flower);
                updateHearts();
                updateCoins();
                requestAnimationFrame(gameLoop);
            }

            gameLoop();
        });
    }

    function startCountdown(callback) {
        const countdown = document.createElement('div');
        countdown.style.position = 'fixed';
        countdown.style.top = '50%';
        countdown.style.left = '50%';
        countdown.style.transform = 'translate(-50%, -50%)';
        countdown.style.fontSize = '72px';
        countdown.style.color = 'white';
        countdown.style.zIndex = '1001';
        countdown.style.textShadow = '2px 2px 4px rgba(0,0,0,0.7)';
        document.body.appendChild(countdown);

        let counter = 3;
        countdown.textContent = counter;

        const countdownInterval = setInterval(() => {
            counter--;
            if (counter > 0) {
                countdown.textContent = counter;
                countdown.classList.add('pulsate');
                setTimeout(() => countdown.classList.remove('pulsate'), 500);
            } else {
                countdown.textContent = 'Поехали!';
                setTimeout(() => {
                    countdown.remove();
                    callback();
                }, 1000);
                clearInterval(countdownInterval);
            }
        }, 1000);
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 60) + 40;
        const speed = level === 1 ? 1 : 1;
        let x, y;
    
        const side = Math.floor(Math.random() * 4);
        switch (side) {
            case 0:
                x = Math.random() * canvas.width;
                y = -size;
                break;
            case 1:
                x = canvas.width + size;
                y = Math.random() * canvas.height;
                break;
            case 2:
                x = Math.random() * canvas.width;
                y = canvas.height + size;
                break;
            case 3:
                x = -size;
                y = Math.random() * canvas.height;
                break;
        }
    
        const bee = {
            x: x,
            y: y,
            width: size,
            height: size,
            speed: speed,
            image: new Image(),
            draw: function () {
                ctx.save();
                const halfScreen = canvas.width / 2;
                
                if (this.x < halfScreen) {
                    // Отражаем пчёл в левой части экрана
                    ctx.scale(-1, 1);
                    ctx.drawImage(this.image, -this.x - this.width, this.y - this.height / 2, this.width, this.height);
                } else {
                    // Обычное отображение пчёл в правой части
                    ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
                }
                ctx.restore();
            },
            move: function (flower) {
                const angle = Math.atan2(flower.y - this.y, flower.x - this.x);
                
                // Пчёлы на обеих сторонах экрана летят к центру
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        };
    
        bee.image.src = level === 1 ? 'assets/images/Bee.webp' : 'assets/images/BeeRed.webp';
        bees.push(bee);
    }

    function spawnHeart() {
        const heart = {
            x: Math.random() * canvas.width,
            y: -50,
            width: 40,
            height: 40,
            speed: 1.5,
            image: new Image(),
            draw: function () {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            },
        };
        heart.image.src = 'assets/images/heart.png';
        heart.image.onload = () => {
            heart.draw();
        };
        hearts.push(heart);
    }

    function spawnCoin() {
        const coin = {
            x: Math.random() * canvas.width,
            y: -50,
            width: 30,
            height: 30,
            speed: 1.5,
            image: new Image(),
            draw: function () {
                ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
            },
        };
        coin.image.src = 'assets/images/goldcoin.webp';
        coin.image.onload = () => {
            coin.draw();
        };
        coins.push(coin);
    }

    function updateHearts() {
        hearts.forEach((heart, index) => {
            heart.y += heart.speed;
            heart.draw();
            if (heart.y > canvas.height) {
                hearts.splice(index, 1);
            }
        });
    }

    function updateCoins() {
        coins.forEach((coin, index) => {
            coin.y += coin.speed;
            coin.draw();
            if (coin.y > canvas.height) {
                coins.splice(index, 1);
            }
        });
    }

    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const xClick = event.clientX - rect.left;
        const yClick = event.clientY - rect.top;

        bees.forEach((bee, index) => {
            if (
                xClick >= bee.x - bee.width / 2 &&
                xClick <= bee.x + bee.width / 2 &&
                yClick >= bee.y - bee.height / 2 &&
                yClick <= bee.y + bee.height / 2
            ) {
                bees.splice(index, 1);
                gameCoins += 1; // Coin
                totalCoinsEarned += 1;
                updateGameCoinCount();
                AudioManager.playBeeKillSound();

                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }

                // Добавляем анимацию взрыва и монетки
                createExplosionAnimation(bee.x, bee.y);
                flyCoinToCounter(bee.x, bee.y);
            }
        });

        coins.forEach((coin, index) => {
            if (
                xClick >= coin.x &&
                xClick <= coin.x + coin.width &&
                yClick >= coin.y &&
                yClick <= coin.y + coin.height
            ) {
                coins.splice(index, 1);
                daisyCoins += 10; // $Daisy
                updateGameCoinCount();
                AudioManager.playMoneySound();

                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        });

        hearts.forEach((heart, index) => {
            if (
                xClick >= heart.x &&
                xClick <= heart.x + heart.width &&
                yClick >= heart.y &&
                yClick <= heart.y + heart.height
            ) {
                hearts.splice(index, 1);
                lives = Math.min(lives + 1, 3);
                updateLives();
                AudioManager.playHeartPlusSound();

                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
            }
        });
    }

    function createExplosionAnimation(x, y) {
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        document.body.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 500); // Время анимации взрыва
    }

    function flyCoinToCounter(x, y) {
        const coin = document.createElement('img');
        coin.src = 'assets/images/goldcoin.webp';
        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        document.body.appendChild(coin);

        const target = document.getElementById('game-coin-count').getBoundingClientRect();
        const targetX = target.left + window.pageXOffset;
        const targetY = target.top + window.pageYOffset;

        // Анимация полёта монетки
        coin.animate([
            { transform: `translate(${targetX - x}px, ${targetY - y}px)` }
        ], {
            duration: 1000,
            easing: 'ease-in-out'
        });

        setTimeout(() => {
            coin.remove();
        }, 1000); // Время полёта монеты
    }

    function updateBees(ctx, flower) {
        for (let i = bees.length - 1; i >= 0; i--) {
            const bee = bees[i];
            bee.move(flower);
            bee.draw();

            if (isColliding(bee, flower)) {
                lives--;
                updateLives();
                bees.splice(i, 1);
                AudioManager.playUdarSound();
                shakeScreen();
                flashFlower();

                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }

                if (lives <= 0) {
                    endGame();
                }
            }

            if (
                bee.x < -bee.width ||
                bee.x > canvas.width + bee.width ||
                bee.y < -bee.height ||
                bee.y > canvas.height
            ) {
                bees.splice(i, 1);
            }
        }
    }

    function isColliding(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width / 2 &&
            obj1.x + obj1.width / 2 > obj2.x &&
            obj1.y < obj2.y + obj2.height / 2 &&
            obj1.y + obj1.height / 2 > obj2.y
        );
    }

    function shakeScreen() {
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.style.animation = 'shake 0.1s';
        setTimeout(() => (gameScreen.style.animation = ''), 100);
    }

    function flashFlower() {
        const flower = document.getElementById('game-canvas');
        flower.style.filter = 'brightness(0.5)';
        setTimeout(() => (flower.style.filter = ''), 100);
    }

    function updateLives() {
        const lifeIcons = document.querySelectorAll('#game-lives .life-icon');
        lifeIcons.forEach((icon, index) => {
            if (index < lives) {
                icon.style.opacity = '1';
            } else {
                icon.style.opacity = '0.3';
            }
        });
    }

    function updateGameCoinCount() {
        // Обновляем счетчики в мини-игре
        document.getElementById('game-coin-count').textContent = gameCoins;
        document.getElementById('game-daisy-count').textContent = daisyCoins;

        // Обновляем счетчики на главном экране
        let totalSpinCoins = parseInt(localStorage.getItem('spinCoins')) || 0;
        let totalDaisyCoins = parseInt(localStorage.getItem('coins')) || 0;

        document.getElementById('spin-coin-count').textContent = totalSpinCoins + gameCoins; // Coin
        document.getElementById('coin-count').textContent = totalDaisyCoins + daisyCoins; // $Daisy

        // Сохраняем обновленные значения в localStorage
        localStorage.setItem('spinCoins', totalSpinCoins + gameCoins);
        localStorage.setItem('coins', totalDaisyCoins + daisyCoins);
    }

function updateTicketCount() {
    document.getElementById('ticket-count').textContent = tickets;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function showLevelCompleteModal() {
        // Останавливаем игровой процесс
        isGamePaused = true;
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
    
        clearGameObjects(); // Скрываем все объекты
    
        const resultModal = document.createElement('div');
        resultModal.style.position = 'fixed';
        resultModal.style.top = '50%';
        resultModal.style.left = '50%';
        resultModal.style.transform = 'translate(-50%, -50%)';
        resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        resultModal.style.color = 'white';
        resultModal.style.textAlign = 'center';
        resultModal.style.padding = '20px';
        resultModal.style.zIndex = '1000';
        resultModal.style.borderRadius = '20px'; // Закругляем края
        resultModal.innerHTML = `
        <h2>Уровень завершен!</h2>
        <p>Вы собрали:</p>
        <ul style="list-style: none; padding: 0;">
            <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
            <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
        </ul>
        <button class="continue-btn">Перейти на 2-й уровень</button>
        <button class="endGameButton">Домой</button>
        `;
        
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.appendChild(resultModal);
        
        const continueButton = resultModal.querySelector('.continue-btn');
        const endGameButton = resultModal.querySelector('.endGameButton'); // ИСПРАВЛЕНО
        
        // Проверяем, если кнопка существует перед добавлением обработчика событий
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                resultModal.remove();
                currentLevel = 2;
                gameTime = 60; // Время для 2-го уровня
                AudioManager.playElectricChaosMusic(); // Музыка для 2-го уровня
                startCountdown(() => {
                    isCountdownDone = true;
                    beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
                    heartInterval = setInterval(spawnHeart, 20000);
                    coinInterval = setInterval(spawnCoin, 15000);
                    gameTimerInterval = setInterval(() => {
                        gameTime--;
                        document.getElementById('game-timer').textContent = formatTime(gameTime);
        
                        if (gameTime <= 0) {
                            endLevel(2); // Завершение второго уровня
                        }
                    }, 1000);
                });
            });
        }
        
        if (endGameButton) {
            endGameButton.addEventListener('click', () => { // ИСПРАВЛЕНО
                resultModal.remove(); // Убираем модальное окно
                endGame(); // Возвращаемся на главный экран
            });
        }
        
    
        if (endGameButton) {
        resultModal.querySelector('.endGameButton').addEventListener('click', () => {
            resultModal.remove(); // Убираем модальное окно
            endGame(); // Возвращаемся на главный экран
            });
        }
    }
    

    function endLevel(level) {
        // Останавливаем игровой цикл
        isGamePaused = true; // Ставим игру на паузу

        // Очищаем интервалы
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);

        clearGameObjects(); // Скрываем все объекты

        // Создаём модальное окно для завершения уровня
        const resultModal = document.createElement('div');
        resultModal.style.position = 'fixed';
        resultModal.style.top = '50%';
        resultModal.style.left = '50%';
        resultModal.style.transform = 'translate(-50%, -50%)';
        resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        resultModal.style.color = 'white';
        resultModal.style.textAlign = 'center';
        resultModal.style.padding = '20px';
        resultModal.style.zIndex = '1000';
        resultModal.style.borderRadius = '20px'; // Закругляем края
        if (level === 1 && lives > 0) {
            // Если прошли первый уровень, показываем модальное окно с предложением перейти на следующий уровень
            resultModal.innerHTML = `
            <h2>Уровень 1 завершен!</h2>
            <p>Вы собрали:</p>
            <ul style="list-style: none; padding: 0;">
                <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
            </ul>
            <button class="next-level-btn" style="background-color: yellow;">Перейти на 2 уровень</button>
            <button class="home-btn" style="background-color: red;">Забрать монеты и закончить</button>
        `;
        function showLevelCompleteModal() {
            
            // Останавливаем игровой процесс
            isGamePaused = true;
            clearInterval(beeInterval);
            clearInterval(coinInterval);
            clearInterval(heartInterval);
            clearInterval(gameTimerInterval);
        
            clearGameObjects(); // Скрываем все объекты
        
            const resultModal = document.createElement('div');
            resultModal.style.position = 'fixed';
            resultModal.style.top = '0';
            resultModal.style.left = '0';
            resultModal.style.width = '100%';
            resultModal.style.height = '100%';
            resultModal.style.display = 'flex';
            resultModal.style.justifyContent = 'center';
            resultModal.style.alignItems = 'center';
            resultModal.style.background = 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(111,24,164,1) 100%)'; // Чёрный в центре, фиолетовый по краям
            resultModal.style.zIndex = '1000';
            resultModal.style.color = 'white';
            resultModal.style.padding = '20px';
        
            // Вставляем модальное окно на экран
            const gameScreen = document.getElementById('protect-flower-game');
            gameScreen.appendChild(resultModal);
        
            // Обработка кликов по кнопкам
            resultModal.querySelector('.victory-button.play').addEventListener('click', () => {
                resultModal.remove(); // Удаляем модальное окно
                currentLevel = 1; // Сбрасываем уровень на первый
                gameCoins = 0; // Сбрасываем количество монет
                daisyCoins = 0; // Сбрасываем $Daisy
                clearInterval(beeInterval);
                clearInterval(coinInterval);
                clearInterval(heartInterval);
                clearInterval(gameTimerInterval);
                clearGameObjects(); // Очищаем все объекты
        
                // Сбрасываем флаг паузы и перезапускаем игру
                isGamePaused = false;
                isGameRunning = false; // Сбрасываем флаг, что игра закончена
                startGame(); // Запускаем игру заново
            });

            resultModal.querySelector('.victory-button.share').addEventListener('click', () => {
                alert('Функция "Поделиться" в разработке.');
            });
        
            resultModal.querySelector('.victory-button.home').addEventListener('click', () => {
                resultModal.remove(); // Убираем модальное окно
                endGame(); // Возвращаемся на главный экран
            });
        }
    } else if (level === 2 && lives > 0) {
        // Если прошли второй уровень, показываем поздравление
        resultModal.innerHTML = `
        <div style="
        position: fixed; 
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%) scale(1.1);
        width: 100vw; 
        height: 100vh; 
        display: flex; 
        justify-content: center; 
        align-items: center;
        background: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(111,24,164,1) 100%);
        z-index: 1000; 
        color: white; 
        padding: 0; 
        margin: 0;
        text-align: center;
    ">
    <div class="yellow-stripes-container"></div> <!-- Контейнер для полосок -->
        <div style="width: 90%; max-width: 400px;">
        <h2 class="gradient-text first-line">Поздравляем!</h2>
        <h2 class="gradient-text second-line">Ромашка спасена!</h2>
                <p>Вы собрали:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                    <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
                </ul>
    
                <!-- Кнопки снизу -->
                <div class="modal-buttons">
                <button class="victory-button play">Играть <img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon">(${tickets})</button>
                <button class="victory-button share">Поделиться</button>
                <button class="victory-button home">Выход</button>
            </div>
            </div>
        `;
        
    // Вставляем модальное окно на экран
    const gameScreen = document.getElementById('protect-flower-game');
    gameScreen.appendChild(resultModal);

    // Добавляем анимацию жёлтых полосок
    createFlashAnimation(); // Убедись, что ты вызываешь именно эту функцию!

    // Обработка кликов по кнопкам
    resultModal.querySelector('.victory-button.play').addEventListener('click', () => {
        resultModal.remove(); // Удаляем модальное окно
        currentLevel = 1; // Сбрасываем уровень на первый
        gameCoins = 0; // Сбрасываем количество монет
        daisyCoins = 0; // Сбрасываем $Daisy
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
        clearGameObjects(); // Очищаем все объекты
    // Сбрасываем состояние игры и перезапускаем игру
         isGamePaused = false;
         isCountdownDone = false; // Не забывай сбросить этот флаг, иначе таймер не начнётся
         isGameRunning = false;

        startGame(); // Перезапуск игры
    });

    resultModal.querySelector('.victory-button.share').addEventListener('click', () => {
        alert('Функция "Поделиться" в разработке.');
    });

    resultModal.querySelector('.victory-button.home').addEventListener('click', () => {
        resultModal.remove(); // Убираем модальное окно
        endGame(); // Возвращаемся на главный экран
    });
        // Функция для генерации жёлтых полосок (добавляем после showLevelCompleteModal)
        function createFlashAnimation() {
            const container = document.querySelector('.yellow-stripes-container');
            const numStripes = 100; // Увеличенное количество линий
            const targetRadius = 100; // Радиус невидимого круга в центре
        
            for (let i = 0; i < numStripes; i++) {
                const stripe = document.createElement('div');
                stripe.classList.add('stripe');
        
                // Чередование коротких и длинных линий
                const isShort = i % 2 === 0; // Чередование короткой и длинной линии
                const stripeHeight = isShort ? Math.random() * 30 + 10 : Math.random() * 60 + 30; // Короткие 20px-50px, длинные 60px-160px
                stripe.style.height = `${stripeHeight}px`;
        
                // Расчет угла для каждой линии
                const angle = (i / numStripes) * 360;
                const radians = angle * (Math.PI / 180); // Конвертация угла в радианы
        
                // Расчет начальных координат за пределами экрана
                const startX = window.innerWidth / 2 + Math.cos(radians) * (window.innerWidth / 2 + 100);
                const startY = window.innerHeight / 2 + Math.sin(radians) * (window.innerHeight / 2 + 100);
        
                stripe.style.left = `${startX}px`;
                stripe.style.top = `${startY}px`;
        
                // Поворот линии под нужным углом
                stripe.style.transform = `rotate(${angle - 90}deg)`; // Поворот на 90 градусов для правильного направления
        
                // Анимация движения линий к невидимому кругу
                const moveDistanceX = Math.cos(radians) * -(window.innerWidth / 2 - targetRadius);
                const moveDistanceY = Math.sin(radians) * -(window.innerHeight / 2 - targetRadius);
        
                stripe.animate([
                    { transform: `translate(0, 0) rotate(${angle - 90}deg)`, opacity: 1 },  // Начальная точка
                    { transform: `translate(${moveDistanceX}px, ${moveDistanceY}px) rotate(${angle - 90}deg)`, opacity: 0 }  // Финиш
                ], {
                    duration: Math.random() * 1400 + 1000,  // Быстрая анимация
                    easing: 'ease-out',
                    iterations: Infinity,  // Бесконечная анимация
                    delay: Math.random() * 500  // Случайная задержка до 2 секунд
                });
        
                container.appendChild(stripe);
            }
        }
        
    } else {
            // Если игрок проиграл, предлагаем начать с первого уровня
            resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы собрали:</p>
            <ul style="list-style: none; padding: 0;">
                <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
            </ul>
            <p>Вы потеряли все жизни. Начать заново?</p>
            <div class="button-container">
            <button class="replay-btn"><img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon">Играть</button>
            <button class="home-btn">Домой</button>
            </div>
        `;
        }

        document.body.appendChild(resultModal);

        // Кнопка для перехода на следующий уровень
        const nextLevelButton = resultModal.querySelector('.next-level-btn');
        const homeButton = resultModal.querySelector('.home-btn');
        const replayButton = resultModal.querySelector('.replay-btn');
        const replayButtons = document.querySelectorAll('.replay-btn');

// Обновление текста для каждой кнопки "Играть"
replayButtons.forEach(button => {
    button.innerHTML = `
    <p>Играть</p><img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon"> 
    (${tickets})
`;
});

        if (nextLevelButton) {
            nextLevelButton.addEventListener('click', () => {
                resultModal.remove();
                isGamePaused = false; // Снимаем игру с паузы
                currentLevel = 2;
                startGame(); // Запускаем 2 уровень
            });
        }

        // Кнопка для завершения игры и возврата на главный экран
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                resultModal.remove();
                endGame(); // Завершаем игру и возвращаемся на главный экран
            });
        }

        if (replayButton) {
            replayButton.addEventListener('click', () => {
                resultModal.remove(); // Удаляем модальное окно
                currentLevel = 1; // Сбрасываем уровень на первый
                gameCoins = 0; // Сбрасываем количество монет
                daisyCoins = 0; // Сбрасываем $Daisy
                clearInterval(beeInterval);
                clearInterval(coinInterval);
                clearInterval(heartInterval);
                clearInterval(gameTimerInterval);
                clearGameObjects(); // Очищаем все объекты
        
                // Сбрасываем флаг паузы и перезапускаем игру
                isGamePaused = false;
                isGameRunning = false; // Сбрасываем флаг, что игра закончена
                startGame(); // Запускаем игру заново
            });
        }
    }

    function endGame() {
        isGamePaused = true;
        isGameRunning = false; // Сбрасываем флаг
        
        // Очищаем все таймеры
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
        
        clearGameObjects(); // Скрываем все объекты

        // Переключаемся обратно на главный экран
        document.querySelector('.game-container').style.display = 'flex';
        document.getElementById('protect-flower-game').style.display = 'none';
    
        // Показать кнопку "Старт" снова для перезапуска игры
        const startButton = document.getElementById('start-mini-game');
        startButton.style.display = 'block';
    
        // Обновляем количество монет на главном экране
        updateGameCoinCount();
    
        // Останавливаем музыку мини-игры и включаем фоновую музыку
        AudioManager.pauseOneLevelMusic();
        AudioManager.pauseElectricChaosMusic();
        AudioManager.playBackgroundMusic();
    }

    // Проверка на проигрыш
    function isGameOver() {
        if (lives <= 0) {
            endLevel(currentLevel); // Заканчиваем уровень, если жизни кончились
        }
    }

    // Добавляем вызов проверки на проигрыш в местах, где игрок теряет жизни
    function updateBees(ctx, flower) {
        for (let i = bees.length - 1; i >= 0; i--) {
            const bee = bees[i];
            bee.move(flower);
            bee.draw();

            if (isColliding(bee, flower)) {
                lives--;
                updateLives();
                bees.splice(i, 1);
                AudioManager.playUdarSound();
                shakeScreen();
                flashFlower();

                if (navigator.vibrate) {
                    navigator.vibrate(200);
                }

                isGameOver(); // Проверяем, проиграл ли игрок после удара
            }

            if (bee.x < -bee.width || bee.x > canvas.width + bee.width || bee.y < -bee.height || bee.y > canvas.height) {
                bees.splice(i, 1);
            }
        }
    }

    return {
        init,
    };
})();