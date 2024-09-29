const MiniGame = (function() {
    let gameTime = 60; // 1 minute per level
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0;
    let daisyCoins = 0; // Daisy coins collected
    let currentLevel = 1;
    let isGameRunning = false;
    let totalCoinsEarned = 0; // Total coins earned
    let tickets = 200; // Initial tickets
    let ctx;
    let canvas;

    function init() {
        const startButton = document.getElementById('start-mini-game');
        startButton.addEventListener('click', startGame);
    }

    function startGame() {
        if (isGameRunning) return;

        // Ticket check and deduction
        if (tickets <= 0) {
            alert("Not enough tickets!");
            return;
        }
        tickets -= 1;
        updateTicketCount();

        isGameRunning = true;
        const gameScreen = document.getElementById('protect-flower-game');
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
        canvas.width = gameScreen.clientWidth;
        canvas.height = gameScreen.clientHeight;

        // Reset game variables
        bees = [];
        gameTime = 60;
        lives = 3;
        daisyCoins = 0;
        updateLives();
        updateGameCoinCount();

        // Start countdown before game begins
        showCountdown(() => {
            // Start spawning bees
            beeInterval = setInterval(() => spawnBee(currentLevel), currentLevel === 1 ? 1500 : 1000);

            // Game timer
            gameTimerInterval = setInterval(() => {
                gameTime--;
                document.getElementById('game-timer').textContent = formatTime(gameTime);
                if (gameTime <= 0) {
                    if (currentLevel === 1) {
                        moveToNextLevel();
                    } else {
                        endGame();
                    }
                }
            }, 1000);
        });
    }

    function spawnBee(level) {
        const size = Math.floor(Math.random() * 60) + 40;
        const speed = level === 1 ? 2 : 3.5;
        const side = Math.floor(Math.random() * 4);
        let x, y;

        // Random spawn logic
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
                // Remove bee and update coins
                bees.splice(index, 1);
                gameCoins += 1;
                totalCoinsEarned += 1;
                updateGameCoinCount();
                AudioManager.playClickSound();
                if (navigator.vibrate) navigator.vibrate(100);
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

    function moveToNextLevel() {
        currentLevel = 2;
        gameTime = 60;
        clearInterval(beeInterval);
        AudioManager.playElectricChaosMusic();
    }

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.playElectricChaosMusic();

        // Show modal window
        showResultModal();
        isGameRunning = false;
    }

    function showCountdown(callback) {
        const countdownElement = document.createElement('div');
        countdownElement.className = 'countdown';
        document.body.appendChild(countdownElement);

        let count = 3;
        countdownElement.textContent = count;
        const interval = setInterval(() => {
            count--;
            countdownElement.textContent = count > 0 ? count : "Go!";
            if (count < 0) {
                clearInterval(interval);
                countdownElement.remove();
                callback(); // Start the game
            }
        }, 1000);
    }

    function showResultModal() {
        const resultModal = document.createElement('div');
        resultModal.className = 'modal-content';
        resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы заработали ${totalCoinsEarned} Coin и ${daisyCoins} $Daisy.</p>
            <button class="replay-btn">Повторим?</button>
            <button class="exit-btn">В главное меню</button>
        `;
        document.body.appendChild(resultModal);

        // Replay logic
        document.querySelector('.replay-btn').addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });

        // Exit logic
        document.querySelector('.exit-btn').addEventListener('click', () => {
            resultModal.remove();
            document.getElementById('protect-flower-game').style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            AudioManager.playBackgroundMusic();
        });
    }

    return { init };
})();
