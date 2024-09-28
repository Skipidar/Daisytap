document.addEventListener('DOMContentLoaded', function() {
    let tgUser = null;
    let isTelegram = false;

    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initDataUnsafe && window.Telegram.WebApp.initDataUnsafe.user) {
        const tg = window.Telegram.WebApp;
        tgUser = tg.initDataUnsafe.user;
        isTelegram = true;
        console.log(`Добро пожаловать, ${tgUser.first_name}!`);
    } else {
        console.log('Игра запущена вне Telegram.');
        tgUser = {
            id: 123456789,
            first_name: 'TestUser',
            username: 'testuser'
        };
        isTelegram = false;
    }

    initGame();

    function initGame() {
        let coins = 200; // Начальное количество $Daisy
        let spinCoins = 0;
        let energy = 1000;
        let isFlowerClickable = true;
        let boosterCharges = 6;
        let lastClickTime = 0;
        let rotationAngle = 0;
        let lastPredictionTime = 0;

        let usedPredictions = [];
        let predictionHistory = [];

        const chamomile = document.getElementById('chamomile');
        const coinCount = document.getElementById('coin-count');
        const spinCoinCount = document.getElementById('spin-coin-count');
        const energyCount = document.getElementById('energy-count');
        const predictionModal = document.getElementById('prediction-modal');
        const predictionTitle = document.getElementById('prediction-title');
        const timer = document.getElementById('timer');
        const boosterBtn = document.getElementById('booster');
        const loadingScreen = document.getElementById('loading-screen');
        const gameContainer = document.querySelector('.game-container');
        const playButton = document.getElementById('play-button');
        const soundToggle = document.getElementById('sound-toggle');
        const soundIcon = document.getElementById('sound-icon');

        const clickSound = new Audio('assets/sounds/click.mp3');
        const predictionSound = new Audio('assets/sounds/prediction.mp3');
        const backgroundMusic = new Audio('assets/sounds/backgroundmusic.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.5;

        const oneLevelMusic = new Audio('assets/sounds/Onelevel.mp3');
        const udarSound = new Audio('assets/sounds/udar.mp3');
        oneLevelMusic.volume = 0.5;

        clickSound.volume = 0.4;

        // Воспроизведение фоновой музыки после загрузки
        setTimeout(() => {
            backgroundMusic.play().catch(error => console.warn('Автоматическое воспроизведение музыки заблокировано:', error));
        }, 3000); // 3 секунды загрузки

        // Кнопка включения/выключения звука
        soundToggle.addEventListener('click', () => {
            const soundEnabled = backgroundMusic.volume > 0;
            if (soundEnabled) {
                soundIcon.src = 'assets/images/off.webp';
                backgroundMusic.pause();
                oneLevelMusic.pause();
            } else {
                soundIcon.src = 'assets/images/on.webp';
                backgroundMusic.play();
            }
        });

        playButton.addEventListener('click', () => {
            if (playerHasTicket()) {
                if (backgroundMusic.paused) {
                    backgroundMusic.play();
                }
                startProtectFlowerGame();
            } else {
                alert('У вас нет билетов для входа в мини-игру. Попробуйте позже.');
            }
        });

        function playerHasTicket() {
            return true; // Проверка наличия билета
        }

        chamomile.addEventListener('click', function(e) {
            const now = Date.now();
            if (now - lastClickTime >= 500 && energy > 0 && isFlowerClickable) {
                lastClickTime = now;
                clickSound.play();
                spinCoins += 1;
                spinCoinCount.textContent = spinCoins;
                energy -= 10;
                energyCount.textContent = energy;

                rotationAngle += 360 * 5 + Math.random() * 360;
                this.style.transition = 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)';
                this.style.transform = `rotate(${rotationAngle}deg)`;

                createSparks(e.clientX, e.clientY);
                animateCoin(e.clientX, e.clientY);
                updateEnergyBar();

                if (energy <= 0) {
                    chamomile.style.filter = "grayscale(100%)";
                    isFlowerClickable = false;
                }
            }
        });

        function createSparks(x, y) {
            const spark = document.createElement('div');
            spark.className = 'spark';
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.textContent = '+1';
            document.body.appendChild(spark);
            setTimeout(() => spark.remove(), 1000);
        }

        function animateCoin(x, y) {
            const coin = document.createElement('img');
            coin.src = 'assets/images/silvercoin.webp';
            coin.className = 'coin-icon';
            coin.style.position = 'absolute';
            coin.style.width = '50px';  // Увеличенный размер монетки
            coin.style.height = '50px';
            coin.style.left = `${x}px`;
            coin.style.top = `${y}px`;
            coin.style.transition = 'all 1s linear';
            document.body.appendChild(coin);

            const target = document.getElementById('secondary-coin-counter').getBoundingClientRect();

            setTimeout(() => {
                coin.style.left = `${target.left + target.width / 2}px`;
                coin.style.top = `${target.top + target.height / 2}px`;
                coin.style.width = '0px';
                coin.style.height = '0px';
                coin.style.opacity = '0';
                document.getElementById('coin-count').classList.add('pulse');
            }, 10);

            setTimeout(() => {
                coin.remove();
                document.getElementById('coin-count').classList.remove('pulse');
            }, 1000);
        }

        function updateEnergyBar() {
            if (energy > 0) {
                chamomile.style.filter = "none";
            } else {
                chamomile.style.filter = "grayscale(100%)";
            }
        }

        chamomile.addEventListener('dblclick', function() {
            const now = Date.now();
            if (isFlowerClickable && now - lastPredictionTime >= 6 * 60 * 60 * 1000) {
                lastPredictionTime = now;
                predictionSound.play();
                predictionModal.style.display = 'flex';

                const prediction = getRandomPrediction();
                predictionTitle.textContent = prediction;

                coins += Math.floor(Math.random() * (550 - 250 + 1)) + 250;
                coinCount.textContent = coins;
                startCountdown(6 * 60 * 60); // 6 часов
                createConfetti();

                const date = new Date().toLocaleString();
                predictionHistory.unshift({ prediction, date });
                updatePredictionHistory();
            }
        });

        function getRandomPrediction() {
            const predictions = [
                "Сегодня удача улыбнется вам во всех начинаниях. Не упустите свой шанс!",
                "Впереди вас ждет важная встреча, которая может изменить вашу жизнь. Будьте готовы!",
                "Улыбайтесь чаще, и мир улыбнется вам в ответ. Позитивный настрой - ключ к успеху!",
                "Удача будет сопровождать вас весь день. Смело беритесь за новые проекты!",
                "Сегодня вы найдете решение давней проблемы. Доверьтесь своей интуиции!",
                "Неожиданная хорошая новость поднимет вам настроение и вдохновит на новые свершения.",
                "Приятный сюрприз ожидает вас сегодня. Будьте внимательны к мелочам!",
                "Вас ждет неожиданное, но очень приятное событие. Готовьтесь к приятным переменам!",
                "Встреча с давним другом принесет не только радость, но и новые возможности.",
                "Терпение и труд все перетрут. Сегодня ваше упорство будет вознаграждено!",
                "Важный разговор, которого вы ждали, наконец состоится. Будьте честны и открыты.",
                "Сегодня ваш день! Все будет складываться наилучшим образом.",
                "Ваши усилия не пройдут даром. Скоро вы увидите плоды своего труда.",
                "Любовь витает в воздухе. Будьте открыты для новых отношений или укрепления существующих.",
                "Путешествие, о котором вы мечтали, скоро станет реальностью. Начинайте планировать!",
                "Сегодня лучше не торопиться. Всему свое время, и ваше время придет совсем скоро.",
                "Завтрашний день принесет еще больше возможностей. Готовьтесь к ним уже сегодня!",
                "Сохраняйте спокойствие и уверенность, даже если все идет не по плану. Это ключ к успеху.",
                "Романтический вечер не за горами. Приготовьтесь к незабываемым моментам!",
                "Приятный сюрприз ждет вас за ближайшим углом. Будьте внимательны и не пропустите его!"
            ];
            let availablePredictions = predictions.filter(p => !usedPredictions.includes(p));
            if (availablePredictions.length === 0) {
                usedPredictions = [];
                availablePredictions = predictions;
            }
            const randomIndex = Math.floor(Math.random() * availablePredictions.length);
            const prediction = availablePredictions[randomIndex];
            usedPredictions.push(prediction);
            return prediction;
        }

        function updatePredictionHistory() {
            const historyContainer = document.getElementById('predictions-history');
            historyContainer.innerHTML = '<h3>История предсказаний:</h3>';
            predictionHistory.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.innerHTML = `
                    <p>${item.prediction}</p>
                    <p class="history-date">${item.date}</p>
                `;
                historyContainer.appendChild(historyItem);
            });
        }

        function createConfetti() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        function updateBoosterTimer() {
            const now = new Date();
            const minutes = 59 - now.getMinutes();
            const seconds = 59 - now.getSeconds();
            boosterBtn.textContent = `Бустер ${boosterCharges}/6 (${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`;
        }

        setInterval(updateBoosterTimer, 1000);

        setInterval(() => {
            if (boosterCharges < 6) {
                boosterCharges++;
                updateBoosterTimer();
            }
        }, 60 * 60 * 1000); // Каждый час

        boosterBtn.addEventListener('click', function() {
            if (boosterCharges > 0) {
                energy = 1000;
                energyCount.textContent = energy;
                boosterCharges--;
                updateBoosterTimer();
                updateEnergyBar();
                chamomile.style.filter = "none";
                isFlowerClickable = true;
            }
        });

        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        document.getElementById('airdrop-btn').addEventListener('click', () => {
            document.getElementById('airdrop-modal').style.display = 'flex';
        });

        document.getElementById('rating-btn').addEventListener('click', () => {
            const ratingModal = document.getElementById('rating-modal');
            const ratingList = document.getElementById('rating-list');
            ratingList.innerHTML = '';
            for (let i = 0; i < 10; i++) {
                const li = document.createElement('div');
                li.className = 'rating-item';
                li.textContent = `Игрок ${i + 1}: ${Math.floor(Math.random() * 10000)} $Daisy`;
                ratingList.appendChild(li);
            }
            ratingModal.style.display = 'flex';
        });

        document.getElementById('shop-btn').addEventListener('click', () => {
            const shopModal = document.getElementById('shop-modal');
            const shopContent = document.getElementById('shop-content');
            shopContent.innerHTML = '';
            loadShopItems('daisy');
            shopModal.style.display = 'flex';
        });

        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                loadShopItems(tabName);
            });
        });

        function loadShopItems(tabName) {
            const shopContent = document.getElementById('shop-content');
            shopContent.innerHTML = '';

            let items = [];
            if (tabName === 'daisy') {
                items = [
                    { name: 'Bubble', price: 100, image: 'assets/images/bubble.webp' },
                    { name: 'Rose', price: 200, image: 'assets/images/Rose.webp' },
                    { name: 'Pizza', price: 300, image: 'assets/images/pizza.webp' },
                    { name: 'Pechenka', price: 400, image: 'assets/images/Pechenka.webp' },
                    { name: 'Panda', price: 500, image: 'assets/images/panda.webp' },
                    { name: 'Luna', price: 600, image: 'assets/images/luna.webp' }
                ];
            } else if (tabName === 'coin') {
                items = [
                    { name: 'Vinyl', price: 1, image: 'assets/images/vinyl.webp' },
                    { name: 'Lotus', price: 1, image: 'assets/images/lotus.webp' },
                    { name: 'Pingvin', price: 1, image: 'assets/images/pingvin.webp' },
                    { name: 'Spinner', price: 1, image: 'assets/images/spinner.webp' },
                    { name: 'Lpodsolnuh', price: 1, image: 'assets/images/lpodsolnuh.webp' }
                ];
            } else if (tabName === 'premium') {
                items = [
                    { name: 'Lion', price: 5000, image: 'assets/images/lion.webp' },
                    { name: 'Fish', price: 5000, image: 'assets/images/fish.webp' }
                ];
            }

            items.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'skin-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                    <div>${item.name}</div>
                    <div class="skin-price">${item.price} ${tabName === 'coin' ? 'Coin' : '$Daisy'}</div>
                `;
                itemDiv.addEventListener('click', () => {
                    if ((tabName === 'daisy' && coins >= item.price) || (tabName === 'coin' && spinCoins >= item.price)) {
                        if (tabName === 'daisy') {
                            coins -= item.price;
                            coinCount.textContent = coins;
                        } else {
                            spinCoins -= item.price;
                            spinCoinCount.textContent = spinCoins;
                        }
                        applySkin(item.image);
                        showSkinPurchaseModal(item.image);
                    } else {
                        alert('Недостаточно средств!');
                    }
                });
                shopContent.appendChild(itemDiv);
            });
        }

        function applySkin(skinImage) {
            chamomile.src = skinImage;
        }

        document.getElementById('friends-btn').addEventListener('click', () => {
            const friendsList = document.getElementById('friends-list');
            friendsList.innerHTML = '';
            const friends = ['Вася', 'Степа', 'Наташа', 'Ира', 'Ольга', 'Роман', 'Валентина', 'Александр', 'Мария', 'Иван', 'Елена', 'Дмитрий', 'Анна', 'Сергей', 'Татьяна'];
            friends.forEach(friend => {
                const li = document.createElement('div');
                li.className = 'friend-item';
                li.textContent = friend;
                friendsList.appendChild(li);
            });
            document.getElementById('friends-modal').style.display = 'flex';
        });

        document.getElementById('tasks-btn').addEventListener('click', () => {
            document.getElementById('tasks-modal').style.display = 'flex';
        });

        function createConfetti() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        document.querySelector('.share-btn').addEventListener('click', function() {
            alert('Функция поделиться с друзьями пока не реализована');
        });

        document.querySelector('.publish-btn').addEventListener('click', function() {
            alert('Функция опубликовать историю пока не реализована');
        });

        updateBoosterTimer();
        updateEnergyBar();

        function showSkinPurchaseModal(skinImage) {
            const modal = document.getElementById('skin-purchase-modal');
            modal.style.display = 'flex';

            document.getElementById('apply-skin-btn').addEventListener('click', function() {
                chamomile.src = skinImage;
                modal.style.display = 'none';
            });

            document.getElementById('cancel-skin-btn').addEventListener('click', function() {
                modal.style.display = 'none';
            });
        }

        function startProtectFlowerGame() {
            gameContainer.style.display = 'none';
            document.getElementById('protect-flower-game').style.display = 'flex';
            startProtectFlowerCountdown();
            initProtectFlowerGame();
            backgroundMusic.pause();
            if (!oneLevelMusic.playing) oneLevelMusic.play();
            oneLevelMusic.loop = true;
        }

        function startProtectFlowerCountdown() {
            let countdown = 3;
            playButton.textContent = countdown;
            const countdownInterval = setInterval(() => {
                countdown--;
                if (countdown > 0) {
                    playButton.textContent = countdown;
                } else {
                    clearInterval(countdownInterval);
                    playButton.textContent = 'Играть';
                    startProtectFlowerLevel();
                }
            }, 1000);
        }

        function initProtectFlowerGame() {
            const canvas = document.getElementById('game-canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const flower = {
                x: canvas.width / 2,
                y: canvas.height / 2 + 100,
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

            let bees = [];
            let beeInterval;
            let gameTime = 120;
            let gameTimerInterval;
            let lives = 3;
            let gameCoins = 0;
            const gameCoinCount = document.getElementById('game-coin-count');
            const gameLives = document.getElementById('game-lives');
            const gameTimer = document.getElementById('game-timer');

            const hitSound = new Audio('assets/sounds/udar.mp3');

            function spawnBee() {
                const size = 50;
                const speed = 2 + Math.random() * 3;
                let x, y;

                const side = Math.floor(Math.random() * 4);
                switch(side) {
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
                    move: function() {
                        const angle = Math.atan2(flower.y - this.y, flower.x - this.x);
                        this.x += Math.cos(angle) * this.speed;
                        this.y += Math.sin(angle) * this.speed;
                    }
                };
                bee.image.src = 'assets/images/Bee.webp';
                bees.push(bee);
            }

            function updateBees() {
                bees.forEach((bee, index) => {
                    bee.move();
                    bee.draw();

                    if (isColliding(bee, flower)) {
                        lives--;
                        updateLives();
                        bees.splice(index, 1);
                        hitSound.play();
                        chamomile.classList.add('pulsate');
                        setTimeout(() => chamomile.classList.remove('pulsate'), 500);
                        if (lives <= 0) {
                            endProtectFlowerGame();
                        }
                    }

                    if (bee.x < -bee.width || bee.x > canvas.width + bee.width || bee.y < -bee.height || bee.y > canvas.height + bee.height) {
                        bees.splice(index, 1);
                        gameCoins += 1;
                        gameCoinCount.textContent = gameCoins;
                        animateGameCoin();
                    }
                });
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

            function animateGameCoin() {
                const coin = document.createElement('img');
                coin.src = 'assets/images/silvercoin.webp';
                coin.className = 'coin-icon';
                coin.style.position = 'absolute';
                coin.style.left = `${Math.random() * canvas.width}px`;
                coin.style.top = `${Math.random() * canvas.height}px`;
                coin.style.transition = 'all 1s linear';
                document.body.appendChild(coin);

                const target = document.getElementById('game-coins').getBoundingClientRect();

                setTimeout(() => {
                    coin.style.left = `${target.left + target.width / 2}px`;
                    coin.style.top = `${target.top + target.height / 2}px`;
                    coin.style.width = '0px';
                    coin.style.height = '0px';
                    coin.style.opacity = '0';
                }, 10);

                setTimeout(() => coin.remove(), 1000);
            }

            function endProtectFlowerGame() {
                const gameScreen = document.getElementById('protect-flower-game');
                gameScreen.style.display = 'none';
                gameContainer.style.display = 'flex';
                oneLevelMusic.pause();
                backgroundMusic.play();
                alert(`Игра закончена! Вы собрали ${gameCoins} Coin.`);

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
                });
            }

            function startProtectFlowerLevel() {
                beeInterval = setInterval(spawnBee, 1000);

                gameTimerInterval = setInterval(() => {
                    gameTime--;
                    const minutes = Math.floor(gameTime / 60);
                    const seconds = gameTime % 60;
                    gameTimer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                    if (gameTime <= 0) {
                        clearInterval(beeInterval);
                        clearInterval(gameTimerInterval);
                        endProtectFlowerGame();
                    }
                }, 1000);

                function gameLoop() {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    flower.draw();
                    updateBees();
                    requestAnimationFrame(gameLoop);
                }

                gameLoop();
            }
        }
    }

    function giveDailyTicket() {
        const tickets = Math.floor(Math.random() * 7) + 1;
        alert(`Ваш подарок на сегодня — билетик в количестве ${tickets} штук!`);
        document.getElementById('ticket-count').textContent = parseInt(document.getElementById('ticket-count').textContent) + tickets;
    }

    giveDailyTicket();
});
