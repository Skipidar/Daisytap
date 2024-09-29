const MiniGame = (function() {
    let gameTime = 60; // 1 минута для уровня
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let heartInterval;
    let lives = 3;
    let gameCoins = 0; // Монеты не будут обнуляться между играми
    let daisyCoins = 0; // Отдельный счётчик для $Daisy
    let currentLevel = 1;
    let isGameRunning = false;
    let ctx;
    let canvas;
    let totalCoinsEarned = 0; // Всего заработанных монет за игру
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
        updateTicketCount(); // Теперь функция определена

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
        gameTime = 60; // 1 минута
        updateGameCoinCount();
        updateDaisyCoinCount();

        // Музыка и спавн пчел в зависимости от уровня
        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }

        // Анимация "3...2...1...Поехали!"
        showCountdown(() => {
            startBeeAndHeartSpawns();
            startGameTimer();
        });
    }

    function updateTicketCount() {
        document.getElementById('ticket-count').textContent = tickets; // Обновление количества билетов на экране
    }

    function startBeeAndHeartSpawns() {
        const spawnInterval = currentLevel === 1 ? 1500 : 1000;
        beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);

        // Спавн сердец для восстановления жизни
        heartInterval = setInterval(spawnHeart, 15000); // Каждые 15 секунд
    }

    function startGameTimer() {
        gameTimerInterval = setInterval(() => {
            gameTime--;
            document.getElementById('game-timer').textContent = formatTime(gameTime);

            if (gameTime <= 0) {
                if (currentLevel === 1) {
                    // Переход на второй уровень
                    currentLevel = 2;
                    gameTime = 60; // 1 минута для второго уровня
                    AudioManager.pauseOneLevelMusic();
                    AudioManager.playElectricChaosMusic();
                    clearInterval(beeInterval);
                    clearInterval(heartInterval);
                    startBeeAndHeartSpawns();
                } else {
                    endGame();
                }
            }
        }, 1000);
    }

    function showCountdown(callback) {
        const countdownElement = document.createElement('div');
        countdownElement.style.position = 'fixed';
        countdownElement.style.top = '50%';
        countdownElement.style.left = '50%';
        countdownElement.style.transform = 'translate(-50%, -50%)';
        countdownElement.style.fontSize = '48px';
        countdownElement.style.color = 'white';
        countdownElement.style.zIndex = '1000';
        countdownElement.style.textAlign = 'center';
        document.body.appendChild(countdownElement);

        let count = 3;
        countdownElement.innerHTML = count;

        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownElement.innerHTML = count;
            } else {
                countdownElement.innerHTML = 'Поехали!';
                setTimeout(() => {
                    countdownElement.remove();
                    clearInterval(countdownInterval);
                    callback();
                }, 1000);
            }
        }, 1000);
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 60) + 40;
        const speed = level === 1 ? 2 : 3.5;
        let x, y;

        const side = Math.floor(Math.random() * 4);
        switch (side) {
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

    function spawnHeart() {
        const size = 40; // Размер сердца
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;

        const heart = {
            x: x,
            y: y,
            width: size,
            height: size,
            image: new Image(),
            draw: function() {
                ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
            }
        };
        heart.image.src = 'assets/images/heart.png';
        heart.image.onload = () => {
            heart.draw();
        };

        canvas.addEventListener('click', (event) => {
            const rect = canvas.getBoundingClientRect();
            const xClick = event.clientX - rect.left;
            const yClick = event.clientY - rect.top;

            if (
                xClick >= heart.x - heart.width / 2 &&
                xClick <= heart.x + heart.width / 2 &&
                yClick >= heart.y - heart.height / 2 &&
                yClick <= heart.y + heart.height / 2
            ) {
                // Поймали сердце, восстанавливаем жизнь
                if (lives < 3) {
                    lives++;
                    updateLives();
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

            if (bee.x < -bee.width || bee.x > canvas.width + bee.width ||
                bee.y < -bee.height || bee.y > canvas.height + bee.height) {
                bees.splice(i, 1);
            }
        }
    }

    function shakeScreen() {
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.style.animation = 'shake 0.1s';
        setTimeout(() => gameScreen.style.animation = '', 100);
    }

    function flashFlower() {
        const flower = document.getElementById('game-canvas');
        flower.style.filter = 'brightness(0.5)';
        setTimeout(() => flower.style.filter = '', 100);
    }

    function isColliding(obj1, obj2) {
        return (
            obj1.x < obj2.x + obj2.width / 2 &&
            obj1.x + obj1.width / 2 > obj2.x &&
            obj1.y < obj2.y + obj2.height / 2 &&
            obj1.y + obj2.height / 2 > obj2.y
        );
    }

    function updateLives() {
        const lifeIcons = document.querySelectorAll('#game-lives .life-icon');
        lifeIcons.forEach((icon, index) => {
            icon.style.opacity = index < lives ? '1' : '0.3';
        });
    }

    function updateGameCoinCount() {
        document.getElementById('game-coin-count').textContent = gameCoins;
    }

    function updateDaisyCoinCount() {
        document.getElementById('daisy-coin-count').textContent = daisyCoins;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        clearInterval(heartInterval);
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();

        showResultModal();
    }

    function showResultModal() {
        const resultModal = document.createElement('div');
        resultModal.style.position = 'fixed';
        resultModal.style.top = '50%';
        resultModal.style.left = '50%';
        resultModal.style.transform = 'translate(-50%, -50%)';
        resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        resultModal.style.color = 'white';
        resultModal.style.textAlign = 'center';
        resultModal.style.padding = '20px';
        resultModal.style.borderRadius = '15px';
        resultModal.style.zIndex = '2000';
        resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы заработали ${gameCoins} Coin и ${daisyCoins} $Daisy.</p>
            <button class="replay-btn">Повторим? (осталось ${tickets} Ticket)</button>
            <button class="exit-btn">Домой</button>
        `;
        document.body.appendChild(resultModal);

        const replayButton = resultModal.querySelector('.replay-btn');
        const exitButton = resultModal.querySelector('.exit-btn');

        replayButton.addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });

        exitButton.addEventListener('click', () => {
            resultModal.remove();
            const gameScreen = document.getElementById('protect-flower-game');
            gameScreen.style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            totalCoinsEarned = 0;
            currentLevel = 1;
        });

        isGameRunning = false;
    }

    return {
        init
    };
})();

// Добавляем анимации для тряски экрана
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -2px) rotate(-1deg); }
    20% { transform: translate(-3px, 0px) rotate(1deg); }
    30% { transform: translate(3px, 2px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 2px) rotate(-1deg); }
    60% { transform: translate(-3px, 1px) rotate(0deg); }
    70% { transform: translate(3px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 2px) rotate(0deg); }
    100% { transform: translate(1px, -2px) rotate(-1deg); }
}
`;
document.head.appendChild(style);
