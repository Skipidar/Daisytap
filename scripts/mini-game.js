const MiniGame = (function() {
    let gameTime = 60; // Уровень длится 1 минуту
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0; // Монеты $Daisy и Coin не обнуляются между играми
    let daisyCoins = 0;
    let currentLevel = 1;
    let isGameRunning = false;
    let totalCoinsEarned = 0;
    let ctx;
    let canvas;
    let tickets = 200;

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

        tickets -= 1; // Списываем 1 билет за игру
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
        flower.image.onload = () => flower.draw();

        lives = 3;
        updateLives();
        bees = [];
        gameTime = 60;
        daisyCoins = 0;
        updateGameCoinCount();

        showCountdown(() => {
            AudioManager.playOneLevelMusic();

            const spawnInterval = currentLevel === 1 ? 1500 : 1000;
            beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);

            gameTimerInterval = setInterval(() => {
                gameTime--;
                document.getElementById('game-timer').textContent = formatTime(gameTime);

                if (gameTime <= 0) {
                    if (currentLevel === 1) {
                        showLevelCompleteModal();
                    } else {
                        endGame();
                    }
                }
            }, 1000);
        });
    }

    function showCountdown(callback) {
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        document.body.appendChild(countdownElement);

        let count = 3;
        countdownElement.textContent = count;
        const interval = setInterval(() => {
            count--;
            countdownElement.textContent = count > 0 ? count : "Поехали!";
            countdownElement.style.opacity = "1";
            setTimeout(() => countdownElement.style.opacity = "0", 500); // Исчезает плавно

            if (count < 0) {
                clearInterval(interval);
                countdownElement.remove();
                callback();
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

    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const xClick = event.clientX - rect.left;
        const yClick = event.clientY - rect.top;

        bees.forEach((bee, index) => {
            if (xClick >= bee.x - bee.width / 2 && xClick <= bee.x + bee.width / 2 &&
                yClick >= bee.y - bee.height / 2 && yClick <= bee.y + bee.height / 2) {
                bees.splice(index, 1);
                gameCoins += 1;
                totalCoinsEarned += 1;
                updateGameCoinCount();
                AudioManager.playSound('assets/sounds/beekill.mp3');

                if (navigator.vibrate) navigator.vibrate(100);
            }
        });
    }

    function updateBees(ctx, flower) {
        bees.forEach((bee, index) => {
            bee.move(flower);
            bee.draw();

            if (isColliding(bee, flower)) {
                lives--;
                updateLives();
                bees.splice(index, 1);
                AudioManager.playSound('assets/sounds/udar.mp3');
                shakeScreen();
                flashFlower();

                if (lives <= 0) endGame();
            }
        });
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

    function updateTicketCount() {
        document.getElementById('ticket-count').textContent = tickets;
    }

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function showLevelCompleteModal() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.playSound('assets/sounds/1levelcomplete.mp3');

        const levelCompleteModal = document.createElement('div');
        levelCompleteModal.className = 'modal-content';
        levelCompleteModal.innerHTML = `
            <h2>Уровень завершён!</h2>
            <button class="next-level-btn">Переход на 2 уровень</button>
            <button class="exit-btn">Забрать выигрыш</button>
        `;
        document.body.appendChild(levelCompleteModal);

        document.querySelector('.next-level-btn').addEventListener('click', () => {
            levelCompleteModal.remove();
            currentLevel = 2;
            gameTime = 60;
            startGame();
        });

        document.querySelector('.exit-btn').addEventListener('click', () => {
            levelCompleteModal.remove();
            document.getElementById('protect-flower-game').style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
        });
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.playSound('assets/sounds/Electric Chaos.mp3');

        const resultModal = document.createElement('div');
        resultModal.className = 'modal-content';
        resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы заработали ${totalCoinsEarned} Coin и ${daisyCoins} $Daisy.</p>
            <button class="replay-btn">
                <img src="assets/images/Ticket.webp" alt="Ticket" class="ticket-icon"> Повторим? (${tickets} Tickets)
            </button>
            <button class="exit-btn">Домой</button>
        `;
        document.body.appendChild(resultModal);

        document.querySelector('.replay-btn').addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });

        document.querySelector('.exit-btn').addEventListener('click', () => {
            resultModal.remove();
            document.getElementById('protect-flower-game').style.display = 'none';
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
