const MiniGame = (function() {
    let gameTime = 120; // 2 минуты для уровня
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0;
    let totalCoinsEarned = 0; // Всего заработанных монет за игру
    let currentLevel = 1;
    let isGameRunning = false;
    let ctx;
    let canvas;
    let tickets = 200; // Начальное количество билетов для теста

    function init() {
        const startButton = document.getElementById('start-mini-game');
        startButton.addEventListener('click', startGame);
    }

    function startGame() {
        if (isGameRunning) return;
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

        // Устанавливаем цвет поля на втором уровне
        if (currentLevel === 2) {
            gameScreen.style.background = 'linear-gradient(to bottom, rgba(255, 0, 0, 0.5), transparent), url("assets/images/gamepole.webp") no-repeat center center';
            gameScreen.style.backgroundSize = 'cover';
        } else {
            gameScreen.style.background = 'url("assets/images/gamepole.webp") no-repeat center center';
            gameScreen.style.backgroundSize = 'cover';
        }

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
        gameTime = 120;
        updateGameCoinCount();

        // Запуск музыки
        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }

        // Анимация перед стартом
        startCountdown(() => {
            beeInterval = setInterval(() => spawnBee(currentLevel), currentLevel === 1 ? 1500 : 1000);
            gameTimerInterval = setInterval(updateGameTimer, 1000);
        });
    }

    function startCountdown(callback) {
        const countdownOverlay = document.createElement('div');
        countdownOverlay.style.position = 'fixed';
        countdownOverlay.style.top = '50%';
        countdownOverlay.style.left = '50%';
        countdownOverlay.style.transform = 'translate(-50%, -50%)';
        countdownOverlay.style.fontSize = '48px';
        countdownOverlay.style.color = 'white';
        countdownOverlay.style.zIndex = '500';
        document.body.appendChild(countdownOverlay);

        let countdown = 3;
        countdownOverlay.textContent = countdown;

        const interval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                countdownOverlay.textContent = countdown;
            } else {
                countdownOverlay.textContent = 'Поехали!';
                setTimeout(() => {
                    document.body.removeChild(countdownOverlay);
                    callback();
                }, 500);
                clearInterval(interval);
            }
        }, 1000);
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 60) + 40; // Увеличенный размер пчел
        const speed = level === 1 ? 2 : 3.5;
        let x, y;

        const side = Math.floor(Math.random() * 4);
        switch(side) {
            case 0: x = Math.random() * canvas.width; y = -size; break;
            case 1: x = canvas.width + size; y = Math.random() * canvas.height; break;
            case 2: x = Math.random() * canvas.width; y = canvas.height + size; break;
            case 3: x = -size; y = Math.random() * canvas.height; break;
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
                const angle = Math.atan2(flower.y - this.y, flower.x - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
        };
        bee.image.src = 'assets/images/Bee.webp';
        bees.push(bee);
    }

    function updateGameTimer() {
        gameTime--;
        document.getElementById('game-timer').textContent = formatTime(gameTime);

        if (gameTime <= 0) {
            if (currentLevel === 1) {
                currentLevel = 2;
                gameTime = 120; // Время для второго уровня
                AudioManager.pauseOneLevelMusic();
                AudioManager.playElectricChaosMusic();
                clearInterval(beeInterval);
                beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
            } else {
                endGame();
            }
        }
    }

    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const xClick = event.clientX - rect.left;
        const yClick = event.clientY - rect.top;

        bees.forEach((bee, index) => {
            if (xClick >= bee.x - bee.width / 2 && xClick <= bee.x + bee.width / 2 &&
                yClick >= bee.y - bee.height / 2 && yClick <= bee.y + bee.height / 2) {
                bees.splice(index, 1); // Убиваем пчелу
                gameCoins += 1; 
                totalCoinsEarned += 1; 
                updateGameCoinCount();
                AudioManager.playClickSound();
                if (navigator.vibrate) {
                    navigator.vibrate(100); // Вибрация 100 мс
                }
            }
        });
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

                if (lives <= 0) {
                    endGame();
                }
            }
        }
    }

    function shakeScreen() {
        document.getElementById('protect-flower-game').style.animation = 'shake 0.1s';
        setTimeout(() => {
            document.getElementById('protect-flower-game').style.animation = '';
        }, 100);
    }

    function flashFlower() {
        const flower = document.getElementById('game-canvas');
        flower.style.filter = 'brightness(0.5)';
        setTimeout(() => {
            flower.style.filter = '';
        }, 100);
    }

    function isColliding(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width / 2 &&
            obj1.x + obj1.width / 2 > obj2.x &&
            obj1.y < obj2.y + obj2.height / 2 &&
            obj1.y + obj1.height / 2 > obj2.y
        );
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();

        // Модальное окно с результатами
        const resultModal = document.createElement('div');
        resultModal.style.position = 'fixed';
        resultModal.style.top = '50%';
        resultModal.style.left = '50%';
        resultModal.style.transform = 'translate(-50%, -50%)';
        resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        resultModal.style.color = 'white';
        resultModal.style.textAlign = 'center';
        resultModal.style.padding = '20px';
        resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы заработали ${totalCoinsEarned} Coin.</p>
            <button class="replay-btn">
                <img src="assets/images/Ticket.webp" alt="Ticket" class="ticket-icon"> Повторим? (${tickets} Tickets)
            </button>
            <button class="exit-btn">Домой</button>
        `;
        document.body.appendChild(resultModal);

        // Центрируем кнопки
        const replayButton = resultModal.querySelector('.replay-btn');
        const exitButton = resultModal.querySelector('.exit-btn');
        replayButton.style.margin = '10px';
        exitButton.style.margin = '10px';

        // Обработчик кнопки "Повторить"
        replayButton.addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });

        // Обработчик кнопки "Домой"
        exitButton.addEventListener('click', () => {
            resultModal.remove();
            const gameScreen = document.getElementById('protect-flower-game');
            gameScreen.style.display = 'none'; // Закрываем мини-игру
            document.querySelector('.game-container').style.display = 'flex';
            AudioManager.playBackgroundMusic();
            totalCoinsEarned = 0; // Сбрасываем счетчик монет
            currentLevel = 1; // Возвращаем на первый уровень
        });

        isGameRunning = false;
    }

    return {
        init
    };
})();

// Добавление виброотклика при клике на пчел
canvas.addEventListener('click', handleCanvasClick);
