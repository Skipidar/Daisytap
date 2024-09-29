const MiniGame = (function() {
    let gameTime = 120; // 2 минуты
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0;
    let currentLevel = 1;

    function init() {
        // Обработчик кнопки "Играть" уже настроен в `Game.js`
    }

    function startProtectFlowerGame() {
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.style.display = 'flex';

        // Добавляем анимацию отсчёта 3..2..1.. Защити ромашку!
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        countdownElement.textContent = '3';
        gameScreen.appendChild(countdownElement);

        let countdown = 3;
        const countdownInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownElement.textContent = countdown;
            } else if (countdown === 0) {
                countdownElement.textContent = 'Защити ромашку!';
            } else {
                clearInterval(countdownInterval);
                countdownElement.remove();
                startGame();
            }
        }, 1000);
    }

    function startGame() {
        const canvas = document.getElementById('game-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const flower = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            width: 300,
            height: 300,
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

        // Спавн пчёл
        beeInterval = setInterval(() => spawnBee(currentLevel), 1000);

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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            flower.draw();
            updateBees(ctx, flower);
            requestAnimationFrame(gameLoop);
        }

        gameLoop();
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 30) + 20; // Размер пчел (20-50px)
        const speed = 3 + Math.random() * 3 + (level === 2 ? 2 : 0); // Скорость пчелы, быстрее на втором уровне
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
                // Пульсирование ромашки
                document.getElementById('chamomile').classList.add('pulsate');
                setTimeout(() => {
                    document.getElementById('chamomile').classList.remove('pulsate');
                }, 500);

                if (lives <= 0) {
                    endGame();
                }
                continue;
            }

            // Удаление пчел, вышедших за пределы экрана
            if (bee.x < -bee.width || bee.x > window.innerWidth + bee.width || bee.y < -bee.height || bee.y > window.innerHeight + bee.height) {
                bees.splice(i, 1);
                // За каждую пропущенную пчелу получаем монету
                gameCoins += 1;
                updateGameCoinCount();
                animateGameCoin();
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

    function animateGameCoin() {
        const coin = document.createElement('img');
        coin.src = 'assets/images/silvercoin.webp';
        coin.className = 'coin-icon coin-animation';
        coin.style.position = 'absolute';
        coin.style.left = `${Math.random() * window.innerWidth}px`;
        coin.style.top = `${Math.random() * window.innerHeight}px`;
        coin.style.transition = 'all 1s linear';
        coin.style.width = '36px'; // Увеличенный размер монетки
        coin.style.height = '36px';
        document.body.appendChild(coin);

        const target = document.getElementById('game-coins').getBoundingClientRect();

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
                pulseGameCoinCount();
            }
        });

        setTimeout(() => coin.remove(), 1000);
    }

    function pulseGameCoinCount() {
        const gameCoinCount = document.getElementById('game-coin-count');
        gameCoinCount.classList.add('pulse');
        setTimeout(() => {
            gameCoinCount.classList.remove('pulse');
        }, 500); // Длительность пульсации
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();

        alert(`Игра закончена! Вы собрали ${gameCoins} Coin.`);

        // Добавляем кнопки "Повторим?" и "Выйти"
        const gameScreen = document.getElementById('protect-flower-game');

        const replayBtn = document.createElement('button');
        replayBtn.textContent = 'Повторим?';
        replayBtn.style.backgroundColor = '#32CD32';
        replayBtn.style.color = '#fff';
        replayBtn.style.padding = '10px 20px';
        replayBtn.style.border = 'none';
        replayBtn.style.borderRadius = '10px';
        replayBtn.style.cursor = 'pointer';
        replayBtn.className = 'replay-btn';
        replayBtn.style.animation = 'pulseReplay 2s infinite';

        const exitBtn = document.createElement('button');
        exitBtn.textContent = 'Выйти';
        exitBtn.style.backgroundColor = '#FF0000';
        exitBtn.style.color = '#fff';
        exitBtn.style.padding = '10px 20px';
        exitBtn.style.border = 'none';
        exitBtn.style.borderRadius = '10px';
        exitBtn.style.cursor = 'pointer';
        exitBtn.className = 'exit-btn';

        const replayContainer = document.createElement('div');
        replayContainer.style.position = 'absolute';
        replayContainer.style.bottom = '50px';
        replayContainer.style.display = 'flex';
        replayContainer.style.justifyContent = 'center';
        replayContainer.style.width = '100%';
        replayContainer.appendChild(replayBtn);
        replayContainer.appendChild(exitBtn);

        gameScreen.appendChild(replayContainer);

        replayBtn.addEventListener('click', () => {
            replayBtn.remove();
            exitBtn.remove();
            startProtectFlowerGame();
        });

        exitBtn.addEventListener('click', () => {
            replayBtn.remove();
            exitBtn.remove();
            gameScreen.style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
        });
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    return {
        init
    };
})();
