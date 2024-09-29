const MiniGame = (function() {
    let gameTime = 120; // 2 минуты для уровня
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0; // Монеты не будут обнуляться между играми
    let currentLevel = 1;
    let isGameRunning = false;
    let tickets = 200; // Начальное количество билетов для теста
    let ctx;
    let canvas;
    let totalCoinsEarned = 0; // Всего заработанных монет за игру

    function init() {
        // Обработчик кнопки "Старт" внутри мини-игры
        const startButton = document.getElementById('start-mini-game');
        startButton.addEventListener('click', startGame);
    }

    function startGame() {
        if (isGameRunning) return; // Предотвращение повторного запуска
        if (tickets <= 0) {
            alert("Недостаточно билетов!");
            return;
        }

        tickets -= 1; // Списываем 1 Ticket за игру
        updateTicketCount();

        isGameRunning = true;

        const gameScreen = document.getElementById('protect-flower-game');
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        canvas.width = gameScreen.clientWidth;
        canvas.height = gameScreen.clientHeight;

        const flower = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 100,
            height: 100,
            image: new Image(),
            draw: function() {
                ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            }
        };
        flower.image.src = 'assets/images/PodsolnuhBEE.webp';
        flower.image.onload = () => {
            flower.draw();
        };

        // Восстанавливаем жизни
        lives = 3;
        updateLives();

        bees = [];
        gameTime = 120; // Сбрасываем время
        updateGameCoinCount(); // Показываем предыдущий счёт монет

        // Запускаем музыку и игровой цикл
        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }

        // Спавн пчёл для текущего уровня
        const spawnInterval = currentLevel === 1 ? 1500 : 1000; // Скорость спавна увеличена на 2 уровне
        beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);

        // Таймер игры
        gameTimerInterval = setInterval(() => {
            gameTime--;
            document.getElementById('game-timer').textContent = formatTime(gameTime);

            if (gameTime <= 0) {
                if (currentLevel === 1) {
                    // Переход на второй уровень
                    currentLevel = 2;
                    gameTime = 120; // 2 минуты для второго уровня
                    AudioManager.pauseOneLevelMusic();
                    AudioManager.playElectricChaosMusic();
                    clearInterval(beeInterval);
                    beeInterval = setInterval(() => spawnBee(currentLevel), 1000); // Быстрее спавн на 2 уровне
                } else {
                    endGame();
                }
            }
        }, 1000);

        // Основной игровой цикл
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            flower.draw();
            updateBees(ctx, flower);
            requestAnimationFrame(gameLoop);
        }

        gameLoop();

        // Скрыть кнопку "Старт" после начала игры
        const startButton = document.getElementById('start-mini-game');
        startButton.style.display = 'none';

        // Добавляем обработчик кликов по канвасу
        canvas.addEventListener('click', handleCanvasClick);
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 30) + 20; // Размер пчел (20-50px)
        const speed = level === 1 ? 2 : 3.5; // Скорость пчел зависит от уровня
        let x, y;

        // Спавн пчел с разных сторон
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0: // Верх
                x = Math.random() * canvas.width;
                y = -size;
                break;
            case 1: // Право
                x = canvas.width + size;
                y = Math.random() * canvas.height;
                break;
            case 2: // Низ
                x = Math.random() * canvas.width;
                y = canvas.height + size;
                break;
            case 3: // Лево
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
            draw: function() {
                ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            },
            move: function(flower) {
                // Вращение к ромашке
                const angle = Math.atan2(flower.y - this.y, flower.x - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        };
        bee.image.src = 'assets/images/Bee.webp';
        bees.push(bee);
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
                // Убиваем пчелу
                bees.splice(index, 1); // Удаляем пчелу из массива
                gameCoins += 1; // За каждую убитую пчелу 1 Coin
                totalCoinsEarned += 1; // Обновляем общую сумму заработанных монет
                updateGameCoinCount();
                AudioManager.playClickSound();
            }
        });
    }

    function updateBees(ctx, flower) {
        for (let i = bees.length - 1; i >= 0; i--) {
            const bee = bees[i];
            bee.move(flower);
            bee.draw();

            // Проверка столкновения с ромашкой
            if (isColliding(bee, flower)) {
                lives--;
                updateLives();
                bees.splice(i, 1);
                AudioManager.playUdarSound();

                if (lives <= 0) {
                    endGame();
                }
                continue;
            }

            // Удаление пчел, вышедших за пределы экрана
            if (bee.x < -bee.width || bee.x > canvas.width + bee.width || bee.y < -bee.height || bee.y > canvas.height + bee.height) {
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
        document.getElementById('game-coin-count').textContent = gameCoins;
    }

    function updateTicketCount() {
        document.getElementById('ticket-count').textContent = tickets;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();

        // Модальное окно с результатами
        const resultModal = document.createElement('div');
        resultModal.className = 'modal-content'; // Оформление модального окна
        resultModal.style.display = 'flex';
        resultModal.style.flexDirection = 'column';
        resultModal.style.justifyContent = 'center';
        resultModal.style.alignItems = 'center';
        resultModal.style.padding = '20px';
        resultModal.innerHTML = `
            <h2>Игра закончена!</h2>
            <p>Вы собрали ${totalCoinsEarned} Coin.</p>
            <button class="replay-btn">Повторить</button>
            <button class="exit-btn">В главное меню</button>
        `;
        document.body.appendChild(resultModal);

        // Центрируем кнопки
        const replayButton = resultModal.querySelector('.replay-btn');
        replayButton.style.margin = '10px';
        const exitButton = resultModal.querySelector('.exit-btn');
        exitButton.style.margin = '10px';

        // Обработчик кнопки "Повторить"
        replayButton.addEventListener('click', () => {
            resultModal.remove(); // Удаляем окно с результатами
            startGame(); // Перезапуск игры
        });

        // Обработчик кнопки "В главное меню"
        exitButton.addEventListener('click', () => {
            resultModal.remove(); // Удаляем окно с результатами
            const gameScreen = document.getElementById('protect-flower-game');
            gameScreen.style.display = 'none'; // Закрываем мини-игру
            document.querySelector('.game-container').style.display = 'flex';
            AudioManager.playBackgroundMusic();
        });

        isGameRunning = false;
    }

    return {
        init
    };
})();
