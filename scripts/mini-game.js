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
    let tickets = parseInt(localStorage.getItem('tickets')) || 200;
    let isCountdownDone = false;

    function init() {
        const startButton = document.getElementById('start-mini-game');
        startButton.addEventListener('click', startGame);

        // Обработчик кнопки "Назад"
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' || event.key === 'Backspace') {
                if (isGameRunning) {
                    endGame();
                    document.querySelector('.game-container').style.display = 'flex';
                    document.getElementById('protect-flower-game').style.display = 'none';
                }
            }
        });

        // Добавляем обработчик для кнопки "Играть"
        document.getElementById('play-button').addEventListener('click', () => {
            document.querySelector('.game-container').style.display = 'none';
            document.getElementById('protect-flower-game').style.display = 'flex';
        });
    }

    function startGame() {
        if (isGameRunning) return;
        if (tickets <= 0) {
            alert("Недостаточно билетов!");
            return;
        }

        tickets -= 1;
        updateTicketCount();
        localStorage.setItem('tickets', tickets);

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

        document.getElementById('start-mini-game').style.display = 'none';
        canvas.addEventListener('click', handleCanvasClick);

        startCountdown(() => {
            isCountdownDone = true;
            const spawnInterval = currentLevel === 1 ? 1500 : 1000;
            beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);

            heartInterval = setInterval(spawnHeart, 20000);
            coinInterval = setInterval(spawnCoin, currentLevel === 1 ? 25000 : 15000);

            gameTimerInterval = setInterval(gameTimerTick, 1000);

            function gameLoop() {
                if (!isCountdownDone) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                flower.draw();
                updateBees(ctx, flower);
                updateHearts();
                updateCoins();
                if (isGameRunning) {
                    requestAnimationFrame(gameLoop);
                }
            }

            gameLoop();
        });
    }

    function gameTimerTick() {
        gameTime--;
        if (gameTime <= 0) {
            clearInterval(gameTimerInterval);
            if (currentLevel === 1) {
                currentLevel = 2;
                showNextLevelModal();
            } else {
                endGame();
            }
        }
        document.getElementById('game-timer').textContent = formatTime(gameTime);
    }

    function showNextLevelModal() {
        const nextLevelModal = document.createElement('div');
        nextLevelModal.className = 'modal';
        nextLevelModal.innerHTML = `
            <div class="modal-content">
                <h2>Готов к 2 уровню?</h2>
                <button id="next-level-btn">Поехали</button>
            </div>
        `;
        document.body.appendChild(nextLevelModal);

        document.getElementById('next-level-btn').addEventListener('click', () => {
            nextLevelModal.remove();
            startLevel2();
        });
    }

    function startLevel2() {
        gameTime = 60;
        isCountdownDone = false;
        startCountdown(() => {
            isCountdownDone = true;
            beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
        });
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();
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
        document.getElementById('game-daisy-count').textContent = daisyCoins;

        // Обновляем счетчики на главном экране
        // Не обновляем здесь, обновление происходит при завершении игры
    }

    function updateTicketCount() {
        document.getElementById('ticket-count').textContent = tickets;
        Localization.updateTicketLabel();
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
        isGameRunning = false;
        isCountdownDone = false;

        canvas.removeEventListener('click', handleCanvasClick);
        document.getElementById('start-mini-game').style.display = 'block';

        AudioManager.pauseOneLevelMusic();
        AudioManager.pauseElectricChaosMusic();
        AudioManager.playBackgroundMusic();

        // Обновляем счетчики на главном экране после окончания игры
        let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000;
        let coins = parseInt(localStorage.getItem('coins')) || 10000;
        spinCoins += gameCoins;
        coins += daisyCoins;
        localStorage.setItem('spinCoins', spinCoins);
        localStorage.setItem('coins', coins);
        document.getElementById('spin-coin-count').textContent = spinCoins;
        document.getElementById('coin-count').textContent = coins;

        const resultModal = document.createElement('div');
        resultModal.className = 'modal';
        resultModal.innerHTML = `
            <div class="modal-content">
                <h2>Игра окончена!</h2>
                <p>Вы заработали ${gameCoins} Coin и ${daisyCoins} $Daisy.</p>
                <p>У вас осталось ${tickets} ${Localization.pluralizeTickets(tickets)}.</p>
                <button class="replay-btn">Повторить</button>
                <button class="exit-btn">Домой</button>
            </div>
        `;
        document.body.appendChild(resultModal);

        const replayButton = resultModal.querySelector('.replay-btn');
        const exitButton = resultModal.querySelector('.exit-btn');

        replayButton.addEventListener('click', () => {
            resultModal.remove();
            currentLevel = 1;
            startGame();
        });

        exitButton.addEventListener('click', () => {
            resultModal.remove();
            currentLevel = 1;
            document.getElementById('protect-flower-game').style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            totalCoinsEarned = 0;
            daisyCoins = 0;
            gameCoins = 0;
            updateGameCoinCount();
        });
    }

    return {
        init,
    };
})();

document.addEventListener('DOMContentLoaded', MiniGame.init);
