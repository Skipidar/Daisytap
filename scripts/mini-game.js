const MiniGame = (function() {
    let gameTime = 60; // 1 минута для уровня
    let bees = [];
    let beeInterval;
    let gameTimerInterval;
    let lives = 3;
    let gameCoins = 0; // Монеты сохраняются между играми
    let currentLevel = 1;
    let isGameRunning = false;
    let totalCoinsEarned = 0; // Всего заработанных монет
    let tickets = 200; // Тестовое количество билетов
    let ctx;
    let canvas;

    function init() {
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

        lives = 3; // Восстановление жизней
        updateLives();

        bees = [];
        gameTime = 60; // Устанавливаем время уровня
        updateGameCoinCount(); // Показываем предыдущий счёт монет

        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }

        beeInterval = setInterval(() => spawnBee(currentLevel), currentLevel === 1 ? 1500 : 1000); // Скорость спавна

        gameTimerInterval = setInterval(() => {
            gameTime--;
            document.getElementById('game-timer').textContent = formatTime(gameTime);

            if (gameTime <= 0) {
                if (currentLevel === 1) {
                    currentLevel = 2;
                    gameTime = 60; 
                    AudioManager.pauseOneLevelMusic();
                    AudioManager.playElectricChaosMusic();
                    clearInterval(beeInterval);
                    beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
                } else {
                    endGame();
                }
            }
        }, 1000);

        function gameLoop() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            flower.draw();
            updateBees(ctx, flower);
            requestAnimationFrame(gameLoop);
        }

        gameLoop();

        const startButton = document.getElementById('start-mini-game');
        startButton.style.display = 'none';

        canvas.addEventListener('click', handleCanvasClick);
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
            if (
                xClick >= bee.x - bee.width / 2 &&
                xClick <= bee.x + bee.width / 2 &&
                yClick >= bee.y - bee.height / 2 &&
                yClick <= bee.y + bee.height / 2
            ) {
                bees.splice(index, 1);
                gameCoins += 1; 
                totalCoinsEarned += 1;
                updateGameCoinCount();
                AudioManager.playClickSound();

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

                if (lives <= 0) {
                    endGame();
                }
                continue;
            }

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

    function endGame() {
        clearInterval(beeInterval);
        clearInterval(gameTimerInterval);
        AudioManager.pauseOneLevelMusic();
        AudioManager.playElectricChaosMusic();

        const resultModal = document.createElement('div');
        resultModal.style.position = 'fixed';
        resultModal.style.top = '50%';
        resultModal.style.left = '50%';
        resultModal.style.transform = 'translate(-50%, -50%)';
        resultModal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        resultModal.style.color = 'white';
        resultModal.style.textAlign = 'center';
        resultModal.style.padding = '20px';
        resultModal.style.borderRadius = '10px'; // Закругленные края окна
        resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы заработали ${totalCoinsEarned} Coin.</p>
            <button class="replay-btn">Повторить (${tickets} <img src="assets/images/Ticket.webp" class="ticket-icon"></button>
            <button class="exit-btn">Домой</button>
        `;
        document.body.appendChild(resultModal);

        const replayButton = resultModal.querySelector('.replay-btn');
        const exitButton = resultModal.querySelector('.exit-btn');
        replayButton.style.margin = '10px';
        exitButton.style.margin = '10px';

        replayButton.addEventListener('click', () => {
            resultModal.remove();
            startGame();
        });

        exitButton.addEventListener('click', () => {
            resultModal.remove();
            const gameScreen = document.getElementById('protect-flower-game');
            gameScreen.style.display = 'none'; 
            document.querySelector('.game-container').style.display = 'flex';
            AudioManager.playBackgroundMusic();
        });

        isGameRunning = false;
    }

    return {
        init
    };
})();
