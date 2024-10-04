// scripts/mini-game.js
const MiniGame = (function () {
    let gameTime = 60; // 1 минута для уровня
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
    let isGameRunning = false;
    let ctx;
    let canvas;
    let totalCoinsEarned = 0;
    let tickets = 200;
    let isCountdownDone = false;

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

        tickets -= 1;
        updateTicketCount();

        isGameRunning = true;
        isCountdownDone = false;

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

        lives = 3;
        updateLives();

        bees = [];
        hearts = [];
        coins = [];
        gameTime = 60;
        gameCoins = 0;
        daisyCoins = 0;
        updateGameCoinCount();

        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }

        startCountdown(() => {
            isCountdownDone = true;
            const spawnInterval = currentLevel === 1 ? 1500 : 1000;
            beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);

            heartInterval = setInterval(spawnHeart, 20000);
            coinInterval = setInterval(spawnCoin, 25000);

            gameTimerInterval = setInterval(() => {
                gameTime--;
                document.getElementById('game-timer').textContent = formatTime(gameTime);

                if (gameTime <= 0) {
                    if (currentLevel === 1) {
                        currentLevel = 2;
                        gameTime = 60;
                        clearInterval(beeInterval);
                        beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
                        showLevelCompleteModal();
                    } else {
                        endGame();
                    }
                }
            }, 1000);

            function gameLoop() {
                if (!isCountdownDone) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                flower.draw();
                updateBees(ctx, flower);
                updateHearts();
                updateCoins();
                requestAnimationFrame(gameLoop);
            }

            gameLoop();
        });

        document.getElementById('start-mini-game').style.display = 'none';
        canvas.addEventListener('click', handleCanvasClick);
    }

    function startCountdown(callback) {
        const countdown = document.createElement('div');
        countdown.style.position = 'fixed';
        countdown.style.top = '50%';
        countdown.style.left = '50%';
        countdown.style.transform = 'translate(-50%, -50%)';
        countdown.style.fontSize = '48px';
        countdown.style.color = 'white';
        countdown.style.zIndex = '1001';
        document.body.appendChild(countdown);

        let counter = 3;
        const countdownInterval = setInterval(() => {
            if (counter > 0) {
                countdown.textContent = counter;
                counter--;
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
        const speed = level === 1 ? 2 : 3.5;
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
                ctx.drawImage(
                    this.image,
                    this.x - this.width / 2,
                    this.y - this.height / 2,
                    this.width,
                    this.height
                );
            },
            move: function (flower) {
                const angle = Math.atan2(flower.y - this.y, flower.x - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            },
        };
        bee.image.src = 'assets/images/Bee.webp';
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
            }
        });

        coins.forEach((coin, index) => {
            if (
                xClick >= coin.x - coin.width / 2 &&
                xClick <= coin.x + coin.width / 2 &&
                yClick >= coin.y - coin.height / 2 &&
                yClick <= coin.y + coin.height / 2
            ) {
                coins.splice(index, 1);
                daisyCoins += 10; // $Daisy
                updateGameCoinCount();
                AudioManager.playMoneySound();
            }
        });

        hearts.forEach((heart, index) => {
            if (
                xClick >= heart.x - heart.width / 2 &&
                xClick <= heart.x + heart.width / 2 &&
                yClick >= heart.y - heart.height / 2 &&
                yClick <= heart.y + heart.height / 2
            ) {
                hearts.splice(index, 1);
                lives = Math.min(lives + 1, 3);
                updateLives();
                AudioManager.playHeartPlusSound();
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

            if (
                bee.x < -bee.width ||
                bee.x > canvas.width + bee.width ||
                bee.y < -bee.height ||
                bee.y > canvas.height + bee.height
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

        // Обновляем счетчики на главном экране
        document.getElementById('spin-coin-count').textContent = gameCoins; // Coin
        document.getElementById('coin-count').textContent = daisyCoins; // $Daisy
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
        resultModal.innerHTML = `
            <h2>Уровень завершен!</h2>
            <p>Переход на следующий уровень.</p>
            <button class="next-level-btn">Далее</button>
        `;

        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.appendChild(resultModal);

        const nextLevelButton = resultModal.querySelector('.next-level-btn');
        nextLevelButton.addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();

        // Обновляем счетчики на главном экране после окончания игры
        updateGameCoinCount();

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
            <p>Вы заработали ${gameCoins} Coin и ${daisyCoins} $Daisy.</p>
            <button class="replay-btn" style="width: 120px; margin: 5px;">
                <img src="assets/images/Ticket.webp" alt="Ticket" class="ticket-icon"> Повторим? (${tickets} Tickets)
            </button>
            <button class="exit-btn" style="width: 120px; margin: 5px;">Домой</button>
        `;

        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.appendChild(resultModal);

        const replayButton = resultModal.querySelector('.replay-btn');
        const exitButton = resultModal.querySelector('.exit-btn');

        replayButton.addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });

        exitButton.addEventListener('click', () => {
            resultModal.remove();
            gameScreen.style.display = 'none';
            document.querySelector('.game-container').style.display = 'block';
            totalCoinsEarned = 0;
            daisyCoins = 0;
            currentLevel = 1;
            updateGameCoinCount();
        });

        isGameRunning = false;
    }

    return {
        init,
    };
})();

// Добавляем анимации
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
