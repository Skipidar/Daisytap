const MiniGame = (function() {
    let gameTime = 120; // 2 минуты
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0;
    let currentLevel = 1;
    let isGameRunning = false;
    let tickets = 200; // Начальное количество билетов для теста
    let ctx; // Добавляем ctx для контекста канваса

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
        const canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d'); // Инициализация контекста канваса
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

        bees = [];
        currentLevel = 1;
        gameTime = 120;
        lives = 3;
        gameCoins = 0;
        updateLives();
        updateGameCoinCount();

        AudioManager.pauseOneLevelMusic();
        AudioManager.playOneLevelMusic();

        // Спавн пчёл (замедлили скорость)
        beeInterval = setInterval(() => spawnBee(currentLevel), 1500);

        // Таймер игры
        gameTimerInterval = setInterval(() => {
            gameTime--;
            document.getElementById('game-timer').textContent = formatTime(gameTime);

            if (gameTime <= 0) {
                endGame();
            }
        }, 1000);

        // Основной игровой цикл
        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем канвас перед каждым кадром
            flower.draw();
            updateBees(ctx, flower);
            requestAnimationFrame(gameLoop);
        }

        gameLoop();

        // Скрыть кнопку "Старт" после начала игры
        const startButton = document.getElementById('start-mini-game');
        startButton.style.display = 'none';
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 30) + 20; // Размер пчел (20-50px)
        const speed = (1.5 + Math.random() * 2 + (level === 2 ? 1 : 0)); // Скорость пчелы уменьшена
        let x, y;

        // Спавн пчел с разных сторон
        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0: // Верх
                x = Math.random() * window.innerWidth;
                y = -size;
                break;
            case 1: // Право
                x = window.innerWidth + size;
                y = Math.random() * window.innerHeight;
                break;
            case 2: // Низ
                x = Math.random() * window.innerWidth;
                y = window.innerHeight + size;
                break;
            case 3: // Лево
                x = -size;
                y = Math.random() * window.innerHeight;
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

        // Добавляем обработчик клика по канвасу для каждой пчелы
        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const xClick = event.clientX - rect.left;
            const yClick = event.clientY - rect.top;

            if (
                xClick >= bee.x - bee.width / 2 &&
                xClick <= bee.x + bee.width / 2 &&
                yClick >= bee.y - bee.height / 2 &&
                yClick <= bee.y + bee.height / 2
            ) {
                // Убиваем пчелу
                bees = bees.filter(b => b !== bee); // Удаляем пчелу из массива
                gameCoins += 10; // За каждую убитую пчелу 10 Coin
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
            if (bee.x < -bee.width || bee.x > window.innerWidth + bee.width || bee.y < -bee.height || bee.y > window.innerHeight + bee.height) {
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

        alert(`Игра закончена! Вы собрали ${gameCoins} Coin.`);

        // Добавляем кнопку "Повторим?" по центру
        const replayButton = document.createElement('button');
        replayButton.textContent = 'Повторим?';
        replayButton.className = 'replay-btn'; // Добавляем класс для стилизации кнопки
        replayButton.style.position = 'absolute';
        replayButton.style.left = '50%';
        replayButton.style.top = '50%';
        replayButton.style.transform = 'translate(-50%, -50%)';
        replayButton.style.padding = '10px 20px';
        replayButton.style.backgroundColor = '#32CD32';
        replayButton.style.color = '#fff';
        replayButton.style.borderRadius = '10px';
        replayButton.style.cursor = 'pointer';

        document.body.appendChild(replayButton);

        // Логика перезапуска игры
        replayButton.addEventListener('click', () => {
            replayButton.remove(); // Удаляем кнопку
            startGame(); // Перезапуск игры
        });
    }

    return {
        init
    };
})();
