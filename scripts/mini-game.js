const MiniGame = (function () {
    let gameTime = 60; // 10 секунд для тестирования
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
    let activeCoins = []; // Массив для отслеживания активных монет
    let allCoins = []; // Массив для всех монет
    let allDeadBees = []; // Массив для всех мертвых пчел
    let timeouts = []; // Для хранения всех активных таймаутов
    let currentLevel = 1;
    let isGamePaused = false; // Новый флаг для паузы
    let flower; // Переменная для цветка
    let isGameRunning = false;
    let ctx;
    let canvas;
    let totalCoinsEarned = 0;
    let tickets = parseInt(localStorage.getItem('tickets')) || 200;
    let isCountdownDone = false;
    let spinCoins = 0; // Глобальная переменная для счётчика монет
    let dpr;

    function init() {
        dpr = window.devicePixelRatio || 1;
    }

    function clearGameObjects() {
        // Очищаем все таймауты
        timeouts.forEach(timeout => clearTimeout(timeout));
        timeouts = []; // Обнуляем массив таймаутов
    
        // Очистка массива пчел
        bees.forEach(bee => {
            bee.element && bee.element.remove();
        });
        bees = [];
    
        // Очистка массива монет
        coins.forEach(coin => {
            coin.element && coin.element.remove();
        });
        coins = [];
    
        // Очистка активных монет и удаление их из DOM
        activeCoins.forEach(coin => {
            if (coin.element) {
                coin.element.remove();
            }
        });
        activeCoins = [];
    
        // Очистка всех созданных монет
        allCoins.forEach(coin => {
            coin && coin.remove();
        });
        allCoins = [];
    
        // Очистка мертвых пчел
        allDeadBees.forEach(bee => {
            bee && bee.remove();
        });
        allDeadBees = [];

        isGamePaused = true;
    }

    function handleBackButton() {
        if (isGameRunning) {
            endGame();
            document.getElementById('protect-flower-game').style.display = 'none'; // Скрыть экран мини-игры
            document.querySelector('.game-container').style.display = 'flex'; // Показать главное меню
        } else {
            navigator.app.exitApp();
        }
    }
    const startButton = document.getElementById('start-mini-game');

    // Обновление текста кнопки с отображением количества билетов
    function updateStartButton() {
    }
    
    // Вызов функции для обновления кнопки
    updateStartButton();
    function startGame() {
        if (isGameRunning) return; // Предотвращаем повторный запуск игры, если она уже запущена
    
        if (currentLevel === 1) {
            // Билет списывается только на первом уровне
            if (tickets <= 0) {
                alert("Недостаточно билетов!");
                return;
            }
            
            tickets -= 1;
            updateTicketCount(); // Обновляем отображение количества билетов
            localStorage.setItem('tickets', tickets); // Сохраняем новое количество билетов
        }
    
        isGameRunning = true;
        isCountdownDone = false;
    
        // Сбрасываем уровень игры до первого
        currentLevel = 1;
    
        // Показываем холст и скрываем кнопку старта
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.style.display = 'flex'; // Показываем экран игры
    
        canvas = document.getElementById('game-canvas');
        ctx = canvas.getContext('2d');
    
        const dpr = window.devicePixelRatio || 1;
    
        canvas.width = gameScreen.clientWidth * dpr;
        canvas.height = gameScreen.clientHeight * dpr;

        // Устанавливаем размеры canvas с учетом dpr
                canvas.width = canvas.clientWidth * dpr;
                canvas.height = canvas.clientHeight * dpr;
    
        ctx.scale(dpr, dpr);
    
        // Включаем сглаживание
        ctx.imageSmoothingEnabled = true;
        


// Определяем объект flower, который будет содержать этот элемент
    // Инициализируем цветок
    const flowerElement = document.getElementById('flower'); // Убедитесь, что у вас есть элемент с id 'flower'
    const flower = {
        x: canvas.width / 2,  // Центр по X
        y: canvas.height / 2, // Центр по Y
        width: 70,           // Ширина
        height: 70,          // Высота
        image: flowerElement  // Само изображение цветка
    };

        // Сбрасываем все игровые переменные
        resetGameVariables();
    
        // Сброс таймеров и объектов
        clearGameObjects(); // Очищаем пчёл, сердца и монеты
    
        startCountdown(() => {
            isCountdownDone = true;
            startGameLoop(); // Начинаем основной игровой цикл
        });
    }

    function startGameLoop() {
    }
    

    function resetGameVariables() {
        lives = 3; // Сбрасываем жизни
        bees = [];
        hearts = [];
        coins = [];
        gameTime = 60; // Время для 1-го уровня
        gameCoins = 0;
        daisyCoins = 0;
        updateGameCoinCount(); // Обновляем отображение количества монет
        const dpr = window.devicePixelRatio || 1;
    
    // Инициализируем цветок
    const boevoySmileImage = new Image();
    boevoySmileImage.src = 'assets/images/boevoysmile.webp';

    flower = {
        x: canvas.width / (2 * dpr),
        y: canvas.height / (2 * dpr),
        width: 70,
        height: 70,
        angle: 0,
        image: new Image(),
        draw: function () {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.drawImage(
                this.image,
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            );
            ctx.restore();

            if (boevoySmileImage.complete) {
                const smileWidth = this.width * 0.7;
                const smileHeight = this.height * 0.7;
                ctx.drawImage(
                    boevoySmileImage,
                    this.x - smileWidth / 2,
                    this.y - smileHeight / 2,
                    smileWidth,
                    smileHeight
                );
            }
        },
    };

// Устанавливаем источник для изображения цветка
flower.image.src = 'assets/images/blasterdaisy.webp';
        flower.image.onload = () => {
            flower.draw();
        };

        isGamePaused = false; // Сбрасываем флаг паузы
    
        lives = 3;
        updateLives();
    
        bees = [];
        hearts = [];
        coins = [];
        gameTime = 60; // Время для 1-го уровня (для теста)
        gameCoins = 0;
        daisyCoins = 0;
        updateGameCoinCount();
    
        if (currentLevel === 1) {
            AudioManager.playOneLevelMusic();
        } else {
            AudioManager.playElectricChaosMusic();
        }
    
        canvas.addEventListener('click', handleCanvasClick);
    
        startCountdown(() => {
            isCountdownDone = true;
            const spawnInterval = currentLevel === 1 ? 1500 : 1000;
            beeInterval = setInterval(() => spawnBee(currentLevel), spawnInterval);
    
            heartInterval = setInterval(spawnHeart, 20000);
            coinInterval = setInterval(spawnCoin, currentLevel === 1 ? 25000 : 10000);
    
            gameTimerInterval = setInterval(() => {
                gameTime--;
                document.getElementById('game-timer').textContent = formatTime(gameTime);
    
                if (gameTime <= 0) {
                    if (currentLevel === 1) {
                        currentLevel = 2;
                        gameTime = 60; // Время для 2-го уровня (для теста)
                        clearInterval(beeInterval);
                        beeInterval = setInterval(() => spawnBee(currentLevel), 800);
                        showLevelCompleteModal();
                    } else {
                        endGame();
                    }
                }
            }, 1000);

            let isGamePaused = false; // Новый флаг для паузы

            function gameLoop() {
                if (!isCountdownDone || isGamePaused) return; // Прерываем цикл, если игра на паузе
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                flower.draw();
                updateBees(ctx, flower);
                updateHearts();
                updateCoins();
                requestAnimationFrame(gameLoop);
            }

            gameLoop();
        });
    }

    function startCountdown(callback) {
        const countdownContainer = document.createElement('div');
        countdownContainer.style.position = 'fixed';
        countdownContainer.style.top = '0';
        countdownContainer.style.left = '0';
        countdownContainer.style.width = '100%';
        countdownContainer.style.height = '100%';
        countdownContainer.style.display = 'flex';
        countdownContainer.style.justifyContent = 'center';
        countdownContainer.style.alignItems = 'center';
        countdownContainer.style.zIndex = '1001';
        document.body.appendChild(countdownContainer);
    
        const countdownNumber = document.createElement('div');
        countdownNumber.style.fontSize = '50px';
        countdownNumber.style.color = '#fff';
        countdownNumber.style.textShadow = '0 0 5px rgba(0, 0, 0, 0.7)'; 
        countdownNumber.style.webkitTextStroke = '1px black'; 
        countdownNumber.style.opacity = '0'; // Начальная прозрачность
        countdownNumber.style.transition = 'opacity 0.2s ease, transform 0.6s ease'; // Плавное появление и масштабирование
        countdownContainer.appendChild(countdownNumber);
    
        let counter = 3;
        countdownNumber.textContent = counter;
    
        const countdownInterval = setInterval(() => {
            // Анимация появления цифр с увеличением и исчезновением вверх
            countdownNumber.style.opacity = '0'; // Скрываем перед сменой цифры
            countdownNumber.style.transform = 'scale(0.5)'; // Уменьшаем перед началом анимации
            setTimeout(() => {
                countdownNumber.style.opacity = '1'; // Плавное появление новой цифры
                countdownNumber.style.transform = 'scale(1.5) translateY(-20px)'; // Увеличение и подъем вверх
            }, 50);
    
            if (counter > 0) {
                applyGlitchEffect(countdownNumber); // Применяем глитч к каждой цифре
                countdownNumber.textContent = counter;
                counter--;
            } else {
                countdownNumber.textContent = 'Поехали!';
                clearInterval(countdownInterval);
                applyGlitchEffect(countdownNumber); // Применяем глитч к "Поехали!"
                createEnhancedParticlesEffect(countdownContainer, countdownNumber); // Эффект разлетающихся частиц
    
                // Эффект для "Поехали!"
                setTimeout(() => {
                    countdownNumber.style.transition = 'transform 1.2s ease, opacity 1s ease'; // Плавный выход вверх
                    countdownNumber.style.transform = 'scale(2) translateY(-100px)'; // Большое увеличение и исчезновение вверх
                    countdownNumber.style.opacity = '0'; // Исчезновение
                    setTimeout(() => {
                        countdownContainer.remove();
                        callback();
                    }, 1500);
                }, 1000); // Показывается 1 секунду перед исчезновением
            }
        }, 1000);
    }
    
    // Функция для эффекта глитча
    function applyGlitchEffect(element) {
        const glitchAnimation = [
            { transform: 'translate(4px, 0)', textShadow: '4px 4px #ff00ff' },
            { transform: 'translate(-4px, 0)', textShadow: '-4px -4px #00ffff' },
            { transform: 'translate(2px, -2px)', textShadow: '2px -2px #ff00ff' },
            { transform: 'translate(0px, 0)', textShadow: '0px 0px #ffffff' }
        ];
    
        // Применяем случайную анимацию глитча на короткое время
        glitchAnimation.forEach((style, index) => {
            setTimeout(() => {
                element.style.transform = style.transform;
                element.style.textShadow = style.textShadow;
            }, index * 50);
        });
    
        setTimeout(() => {
            element.style.transform = 'none';
            element.style.textShadow = '0 0 10px rgba(0, 0, 0, 0.7)';
        }, 400);
    }
    
    // Функция для разлетающихся частиц
    function createEnhancedParticlesEffect(container, element) {
        const textRect = element.getBoundingClientRect();
        const particleCount = 120; // Увеличено количество частиц
    
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = '6px'; // Увеличен размер частиц
            particle.style.height = '6px';
            particle.style.backgroundColor = `rgba(255, 255, 255, ${Math.random()})`;
            particle.style.borderRadius = '50%';
            particle.style.left = `${textRect.left + Math.random() * textRect.width}px`;
            particle.style.top = `${textRect.top + Math.random() * textRect.height}px`;
            particle.style.opacity = '1';
            particle.style.transition = `transform 1.5s ease, opacity 1.5s ease`;
            particle.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.6)'; 
    
            container.appendChild(particle);
    
            setTimeout(() => {
                particle.style.transform = `translate(${Math.random() * 300 - 150}px, ${Math.random() * 300 - 150}px)`;
                particle.style.opacity = '0';
            }, 100);
    
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }
    
    
    
    
    
    
    function spawnBee(level) {
        const size = Math.floor(Math.random() * 60) + 40;
        const speed = level === 1 ? 0.8 : 1.1;
        let x, y;
        let isFromLeft = false;
    
        // Определяем сторону появления пчелы
        const side = Math.random() < 0.5 ? 'left' : 'right';
        
        if (side === 'left') {
            // Пчела появляется слева, с небольшим смещением от верхней и нижней границ экрана
            x = -size;
            y = Math.random() * (canvas.height - 100) + 50; // Отступы в 50px сверху и снизу
            isFromLeft = true;
        } else {
            // Пчела появляется справа
            x = canvas.width + size;
            y = Math.random() * (canvas.height - 100) + 50;
        }
    
        const bee = {
            x: x,
            y: y,
            width: size,
            height: size,
            speed: speed,
            image: new Image(),
            isFromLeft: isFromLeft,
            draw: function () {
                ctx.save();
                ctx.translate(this.x, this.y);
                
                // Отражение по горизонтали для пчёл слева
                if (this.isFromLeft) {
                    ctx.scale(-1, 1);
                }
    
                ctx.drawImage(
                    this.image,
                    -this.width / 2,
                    -this.height / 2,
                    this.width,
                    this.height
                );
                ctx.restore();
            },
            move: function (flower) {
                const angle = Math.atan2(flower.y - this.y, flower.x - this.x);
                this.x += Math.cos(angle) * this.speed;
                this.y += Math.sin(angle) * this.speed;
            }
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
            speed: 0.8, // Замедляем скорость падения с 1.5 до 1
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
            width: 50, // Увеличиваем ширину с 30 до 50 пикселей
            height: 50, // Увеличиваем высоту с 30 до 50 пикселей
            speed: 1, // Замедляем скорость падения с 1.5 до 1
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
    
        // Увеличиваем хитбокс пчелы
        const hitboxPadding = 60; // Увеличиваем область клика на 50 пикселей с каждой стороны
    
        bees.forEach((bee, index) => {
            if (
                xClick >= bee.x - bee.width / 2 - hitboxPadding &&
                xClick <= bee.x + bee.width / 2 + hitboxPadding &&
                yClick >= bee.y - bee.height / 2 - hitboxPadding &&
                yClick <= bee.y + bee.height / 2 + hitboxPadding
            ) {
                // Поворачиваем цветок к пчеле
                rotateFlowerToBee(bee.x, bee.y);
    
                // Стреляем лазером в пчелу
                shootBee(bee.x, bee.y);
    
                // Удаляем пчелу из массива
                bees.splice(index, 1);
                gameCoins += 10; // Coin
                totalCoinsEarned += 10;
    
                // Сохраняем направление пчелы (слева или справа)
                const direction = bee.x < canvas.width / 2 ? 'left' : 'right';
    
                // Добавляем эффект электрического удара перед смертью
                addElectricShockEffect(bee.x, bee.y, bee.width, bee.height, bee.isFromLeft);
    
                updateGameCoinCount();
                AudioManager.playBeeKillSound();
    
                // Добавляем звук SHOKBOOM.mp3 после лазера с небольшой задержкой
                setTimeout(() => {
                    AudioManager.playShokBoomSound();
                }, 30); // Задержка в миллисекундах (настройте по необходимости)
    
                if (navigator.vibrate) {
                    navigator.vibrate(100);
                }
    
                // Вызов функции появления поджаренной пчелы через 1.5 секунды
                setTimeout(() => {
                    handleBeeDeath(bee.x, bee.y, bee.isFromLeft);
                }, 1500);
    
                // Добавляем анимацию взрыва и монетки
                createExplosionAnimation(bee.x, bee.y);
                flyCoinToCounter(bee.x, bee.y);
            }
        });

        // Функция выстрела
        function rotateFlowerToBee(targetX, targetY) {
            const distanceX = targetX - flower.x;
            const distanceY = targetY - flower.y;
            const angle = Math.atan2(distanceY, distanceX);
            flower.angle = angle + Math.PI / 2; // Добавляем 90 градусов для корректной ориентации
        }
        
        function shootBee(targetX, targetY) {
            // Получаем позицию canvas относительно окна
            const canvasRect = canvas.getBoundingClientRect();
        
            // Вычисляем угол между цветком и пчелой
            const angle = Math.atan2(targetY - flower.y, targetX - flower.x);
        
            // Радиус цветка (предполагаем, что он круглый)
            const flowerRadius = (flower.width + flower.height) / 4;
        
            // Начальные координаты лазера на краю цветка
            const startX = canvasRect.left + window.pageXOffset + flower.x + Math.cos(angle) * flowerRadius;
            const startY = canvasRect.top + window.pageYOffset + flower.y + Math.sin(angle) * flowerRadius;
        
            // Координаты цели (пчелы) на экране
            const targetScreenX = canvasRect.left + window.pageXOffset + targetX;
            const targetScreenY = canvasRect.top + window.pageYOffset + targetY;
        
            // Создаем элемент лазера
            const laser = document.createElement('div');
            laser.classList.add('laser');
        
            // Устанавливаем позицию лазера
            laser.style.left = `${startX}px`;
            laser.style.top = `${startY}px`;
        
            // Корректируем угол поворота лазера
            laser.style.transform = `rotate(${angle - Math.PI / 2}rad)`;
        
            // Вычисляем расстояние до пчелы от стартовой точки
            const distance = Math.hypot(targetScreenX - startX, targetScreenY - startY);
        
            // Устанавливаем высоту лазера в зависимости от расстояния до пчелы
            laser.style.height = `${distance}px`;
        
            // Добавляем лазер в документ
            document.body.appendChild(laser);
        
            // Анимируем лазер (опционально)
            laser.animate([
                { height: '0px' },
                { height: `${distance}px` }
            ], {
                duration: 200,
                easing: 'linear',
                fill: 'forwards'
            });
        
            // Удаляем лазер после завершения анимации
            setTimeout(() => {
                laser.remove();
            }, 200);
        }
        function addElectricShockEffect(x, y, width, height, isFromLeft) {
            const beeShock = document.createElement('img');
            beeShock.src = 'assets/images/Bee.webp'; // Изображение пчелы
            beeShock.style.position = 'absolute';
            beeShock.style.left = `${x - width / 2}px`;
            beeShock.style.top = `${y - height / 2}px`;
            beeShock.style.width = `${width}px`;
            beeShock.style.height = `${height}px`;
            beeShock.style.zIndex = '1000';
        
            // Настройка направления для пчел: жестко задаем без применения scaleX
            if (isFromLeft) {
                beeShock.style.transform = 'scaleX(-1)'; // Отражаем только тех, кто летел слева
            } else {
                beeShock.style.transform = 'scaleX(1)'; // Указываем положительный масштаб для пчел справа, чтобы точно не было отражения
            }
        
            beeShock.classList.add('electric-shock'); // Добавляем класс для анимации
            document.body.appendChild(beeShock);
        
            // Анимация тряски
            const shakeKeyframes = [
                { transform: `translate(0px, 0px) scaleX(${isFromLeft ? -1 : 1})` },
                { transform: `translate(-5px, 5px) scaleX(${isFromLeft ? -1 : 1})` },
                { transform: `translate(5px, -5px) scaleX(${isFromLeft ? -1 : 1})` },
                { transform: `translate(0px, 0px) scaleX(${isFromLeft ? -1 : 1})` }
            ];
        
            beeShock.animate(shakeKeyframes, {
                duration: 50, // Продолжительность одного цикла
                iterations: 4, // Количество повторов (тряска длится 1 сек)
                easing: 'ease-in-out',
            });
        
            // Удаляем после завершения
            setTimeout(() => {
                beeShock.remove();
                addSmokeEffect(x, y, width, height, () => {
                    handleBeeDeath(x, y, isFromLeft);
                });
            }, 300);
        }

        // Функция для добавления анимации дыма
function addSmokeEffect(x, y, width, height, callback) {
    const smoke = document.createElement('img');
    smoke.src = 'assets/images/smoke.gif'; // Пусть к анимации дыма
    smoke.style.position = 'absolute';
    smoke.style.left = `${x - width / 3}px`;
    smoke.style.top = `${y - height / 3}px`;
    smoke.style.width = `${width}px`;
    smoke.style.height = `${height}px`;
    smoke.style.zIndex = '1000';
    document.body.appendChild(smoke);

    // Удаляем анимацию дыма через 0.5 секунды и вызываем колбэк
    setTimeout(() => {
        smoke.remove();
        if (callback) {
            callback(); // Вызываем колбэк после завершения эффекта дыма
        }
    }, 1200); // Время анимации дыма
}
        

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

    

    function createExplosionAnimation(x, y) {
        const explosion = document.createElement('div');
        explosion.classList.add('explosion');
        explosion.style.left = `${x}px`;
        explosion.style.top = `${y}px`;
        document.body.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 500); // Время анимации взрыва
    }

    function flyCoinToCounter(x, y) {
        const coin = document.createElement('img');
        coin.src = 'assets/images/goldcoin.webp';
        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        document.body.appendChild(coin);

        const target = document.getElementById('game-coin-count').getBoundingClientRect();
        const targetX = target.left + window.pageXOffset;
        const targetY = target.top + window.pageYOffset;

        // Анимация полёта монетки
        coin.animate([
            { transform: `translate(${targetX - x}px, ${targetY - y}px)` }
        ], {
            duration: 1000,
            easing: 'ease-in-out'
        });

        setTimeout(() => {
            coin.remove();
        }, 1000); // Время полёта монеты
    }

    function updateBees(ctx, flower) {
        for (let i = bees.length - 1; i >= 0; i--) {
            const bee = bees[i];
    
            if (bee) {
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
                    continue; // Переходим к следующей итерации цикла
                }
    
                if (
                    bee.x < -bee.width ||
                    bee.x > canvas.width + bee.width ||
                    bee.y < -bee.height ||
                    bee.y > canvas.height
                ) {
                    bees.splice(i, 1);
                    continue; // Переходим к следующей итерации цикла
                }
            } else {
                console.error(`Пчела с индексом ${i} не существует`);
                bees.splice(i, 1); // Удаляем неопределенную пчелу из массива
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
        let totalSpinCoins = parseInt(localStorage.getItem('spinCoins')) || 0;
        let totalDaisyCoins = parseInt(localStorage.getItem('coins')) || 0;

        document.getElementById('spin-coin-count').textContent = totalSpinCoins + gameCoins; // Coin
        document.getElementById('coin-count').textContent = totalDaisyCoins + daisyCoins; // $Daisy

        // Сохраняем обновленные значения в localStorage
        localStorage.setItem('spinCoins', totalSpinCoins + gameCoins);
        localStorage.setItem('coins', totalDaisyCoins + daisyCoins);
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
        // Останавливаем игровой процесс
        isGamePaused = true;
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
    
        clearGameObjects(); // Скрываем все объекты
    
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
        resultModal.style.borderRadius = '20px';
        resultModal.innerHTML = `
            <h2>Уровень завершен!</h2>
            <p>Вы собрали:</p>
            <ul style="list-style: none; padding: 0;">
                <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
            </ul>
            <button class="delayed-button continue-btn">Перейти на 2-й уровень</button>
            <button class="delayed-button endGameButton">Домой</button>
        `;
        
        document.body.appendChild(resultModal);
    
        // Задержка появления кнопок
        setTimeout(() => {
            const buttons = document.querySelectorAll('.delayed-button');
            buttons.forEach(button => button.classList.add('visible'));
        }, 1500); // Задержка 3 секунды
    
        
        const gameScreen = document.getElementById('protect-flower-game');
        gameScreen.appendChild(resultModal);
        
        const continueButton = resultModal.querySelector('.continue-btn');
        const endGameButton = resultModal.querySelector('.endGameButton'); // ИСПРАВЛЕНО
        
        // Проверяем, если кнопка существует перед добавлением обработчика событий
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                resultModal.remove();
                currentLevel = 2;
                gameTime = 60; // Время для 2-го уровня
                AudioManager.playElectricChaosMusic(); // Музыка для 2-го уровня
                startCountdown(() => {
                    isCountdownDone = true;
                    beeInterval = setInterval(() => spawnBee(currentLevel), 1000);
                    heartInterval = setInterval(spawnHeart, 20000);
                    coinInterval = setInterval(spawnCoin, 10000);
                    gameTimerInterval = setInterval(() => {
                        gameTime--;
                        document.getElementById('game-timer').textContent = formatTime(gameTime);
        
                        if (gameTime <= 0) {
                            endLevel(2); // Завершение второго уровня
                        }
                    }, 1000);
                });
            });
        }
        
    
        if (endGameButton) {
        resultModal.querySelector('.endGameButton').addEventListener('click', () => {
            resultModal.remove(); // Убираем модальное окно
            endGame(); // Возвращаемся на главный экран
            });
        }
    }
    

    function endLevel(level) {
        // Останавливаем игровой цикл
        isGamePaused = true; // Ставим игру на паузу

        // Очищаем интервалы
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);

        clearGameObjects(); // Скрываем все объекты

        // Создаём модальное окно для завершения уровня
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
        resultModal.style.borderRadius = '20px'; // Закругляем края
        if (level === 1 && lives > 0) {
            // Если прошли первый уровень, показываем модальное окно с предложением перейти на следующий уровень
            resultModal.innerHTML = `
            <h2>Уровень 1 завершен!</h2>
            <p>Вы собрали:</p>
            <ul style="list-style: none; padding: 0;">
                <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
            </ul>
            <button class="next-level-btn" style="background-color: yellow;">Перейти на 2 уровень</button>
            <button class="home-btn" style="background-color: red;">Забрать монеты и закончить</button>
        `;

    } else if (level === 2 && lives > 0) {
        // Если прошли второй уровень, показываем поздравление
        resultModal.innerHTML = `
        <div style="
            position: fixed; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%) scale(1.1);
            width: 100vw; 
            height: 100vh; 
            display: flex; 
            justify-content: center; 
            align-items: center;
            background: radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(111,24,164,1) 100%);
            z-index: 1000; 
            color: white; 
            padding: 0; 
            margin: 0;
            text-align: center;
        ">
        <div id="victory-animation" style="display: none;">
        <canvas id="space"></canvas>
    </div>
            <div style="width: 90%; max-width: 400px;">
                <h2 class="gradient-text first-line">Поздравляем!</h2>
                <h2 class="gradient-text second-line">Ромашка спасена!</h2>
                <p>Вы собрали:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                    <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
                </ul>
    
                <!-- Кнопки снизу -->
                <div class="modal-buttons">
                    <button class="victory-button delayed-button play">Играть <img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon">(${tickets})</button>
                    <button class="victory-button delayed-button share">Поделиться</button>
                    <button class="victory-button delayed-button home">Выход</button>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => {
        const buttons = resultModal.querySelectorAll('.delayed-button');
        buttons.forEach(button => button.classList.add('visible'));
    }, 1500); // Задержка 3 секунды
        
    // Вставляем модальное окно на экран
    const gameScreen = document.getElementById('protect-flower-game');
    gameScreen.appendChild(resultModal);

    // Добавляем анимацию жёлтых полосок
    showVictoryAnimation(); // Убедись, что ты вызываешь именно эту функцию!

    // Обработка кликов по кнопкам
    resultModal.querySelector('.victory-button.play').addEventListener('click', () => {
        resultModal.remove(); // Удаляем модальное окно
        currentLevel = 1; // Сбрасываем уровень на первый
        gameCoins = 0; // Сбрасываем количество монет
        daisyCoins = 0; // Сбрасываем $Daisy
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
        clearGameObjects(); // Очищаем все объекты
    // Сбрасываем состояние игры и перезапускаем игру
         isGamePaused = false;
         isCountdownDone = false; // Не забывай сбросить этот флаг, иначе таймер не начнётся
         isGameRunning = false;

        startGame(); // Перезапуск игры
    });

    resultModal.querySelector('.victory-button.share').addEventListener('click', () => {
        alert('Функция "Поделиться" в разработке.');
    });

    resultModal.querySelector('.victory-button.home').addEventListener('click', () => {
        resultModal.remove(); // Убираем модальное окно
        endGame(); // Возвращаемся на главный экран
    });
        // Функция для генерации жёлтых полосок (добавляем после showLevelCompleteModal)
        function showVictoryAnimation() {
            const canvas = document.getElementById("space");
            const c = canvas.getContext("2d");
            document.getElementById("victory-animation").style.display = 'block';
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        
            let numStars = 1900;
            let focalLength = canvas.width * 2;
            let centerX = canvas.width / 2;
            let centerY = canvas.height / 2;
        
            // Функция для генерации случайного цвета
            function getRandomColor() {
                const colors = [
                    "rgba(209, 255, 255, ", // голубовато-белый
                    "rgba(255, 223, 186, ", // светло-оранжевый
                    "rgba(255, 192, 203, ", // светло-розовый
                    "rgba(173, 216, 230, ", // светло-голубой
                    "rgba(144, 238, 144, "  // светло-зеленый
                ];
                return colors[Math.floor(Math.random() * colors.length)];
            }
        
            // Создаем массив звезд с дополнительными параметрами для плавного появления и случайного цвета
            let stars = Array.from({ length: numStars }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                z: Math.random() * canvas.width,
                maxZ: canvas.width,
                opacity: 0,
                color: getRandomColor(), // Случайный цвет для каждой звезды
                rotation1: Math.random() * 2 * Math.PI,
                rotation2: Math.random() * 2 * Math.PI,
                rotationSpeed1: (Math.random() * 0.1) + 0.05,
                rotationSpeed2: -((Math.random() * 0.1) + 0.05),
                moveSpeed: (Math.random() * 0.3) + 0.1
            }));
        
            // Функция для движения звезд и обновления прозрачности
            function moveStars() {
                stars.forEach(star => {
                    star.z -= star.moveSpeed;
                    if (star.z <= 0) {
                        star.z = star.maxZ;
                        star.opacity = 0;
                        star.color = getRandomColor(); // Новый случайный цвет при перезапуске звезды
                    } else {
                        // Увеличиваем прозрачность для плавного появления
                        star.opacity = Math.min(1, (star.maxZ - star.z) / star.maxZ);
                    }
                    star.rotation1 += star.rotationSpeed1;
                    star.rotation2 += star.rotationSpeed2;
                });
            }
        
            // Функция для рисования шестиконечной звезды (звезды Давида)
            function drawStarOfDavid(ctx, x, y, size, rotation1, rotation2, color, opacity) {
                const radius = size;
        
                ctx.save();
                ctx.translate(x, y);
        
                // Рисуем первый треугольник
                ctx.rotate(rotation1);
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    const angle = i * (2 * Math.PI / 3);
                    const pointX = Math.cos(angle) * radius;
                    const pointY = Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(pointX, pointY);
                    } else {
                        ctx.lineTo(pointX, pointY);
                    }
                }
                ctx.closePath();
                ctx.fillStyle = `${color}${opacity})`; // Используем цвет звезды и ее текущую прозрачность
                ctx.fill();
        
                // Рисуем второй треугольник
                ctx.rotate(rotation2 - rotation1);
                ctx.beginPath();
                for (let i = 0; i < 3; i++) {
                    const angle = i * (2 * Math.PI / 3) + Math.PI;
                    const pointX = Math.cos(angle) * radius;
                    const pointY = Math.sin(angle) * radius;
                    if (i === 0) {
                        ctx.moveTo(pointX, pointY);
                    } else {
                        ctx.lineTo(pointX, pointY);
                    }
                }
                ctx.closePath();
                ctx.fill();
        
                ctx.restore();
            }
        
            // Функция для отрисовки всех звезд
            function drawStars() {
                if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
                    canvas.width = window.innerWidth;
                    canvas.height = window.innerHeight;
                    centerX = canvas.width / 2;
                    centerY = canvas.height / 2;
                    focalLength = canvas.width * 2;
                    stars = Array.from({ length: numStars }, () => ({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        z: Math.random() * canvas.width,
                        maxZ: canvas.width,
                        opacity: 0,
                        color: getRandomColor(),
                        rotation1: Math.random() * 2 * Math.PI,
                        rotation2: Math.random() * 2 * Math.PI,
                        rotationSpeed1: (Math.random() * 0.1) + 0.05,
                        rotationSpeed2: -((Math.random() * 0.1) + 0.05),
                        moveSpeed: (Math.random() * 0.3) + 0.1
                    }));
                }
        
                c.clearRect(0, 0, canvas.width, canvas.height);
        
                stars.forEach(star => {
                    const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX;
                    const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY;
                    const pixelRadius = 1 * (focalLength / star.z);
        
                    drawStarOfDavid(c, pixelX, pixelY, pixelRadius, star.rotation1, star.rotation2, star.color, star.opacity);
                });
            }
        
            // Функция для запуска анимации
            function animate() {
                moveStars();
                drawStars();
                requestAnimationFrame(animate);
            }
        
            animate();
        }
        
        
        
    } else {
            // Если игрок проиграл, предлагаем начать с первого уровня
            resultModal.innerHTML = `
            <h2>Игра окончена!</h2>
            <p>Вы собрали:</p>
            <ul style="list-style: none; padding: 0;">
                <li><img src="assets/images/silvercoin.webp" alt="Coin" width="20"> Coin: ${gameCoins}</li>
                <li><img src="assets/images/goldcoin.webp" alt="$Daisy" width="20"> $Daisy: ${daisyCoins}</li>
            </ul>
            <p>Вы потеряли все жизни. Начать заново?</p>
            <div class="button-container">
                <button class="replay-btn delayed-button"><img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon">Играть</button>
                <button class="home-btn delayed-button">Домой</button>
            </div>
        `;
        
        // Задержка появления кнопок
        setTimeout(() => {
            const buttons = resultModal.querySelectorAll('.delayed-button');
            buttons.forEach(button => button.classList.add('visible'));
        }, 1500); // Задержка 3 секунды
        }

        document.body.appendChild(resultModal);

        // Кнопка для перехода на следующий уровень
        const nextLevelButton = resultModal.querySelector('.next-level-btn');
        const homeButton = resultModal.querySelector('.home-btn');
        const replayButton = resultModal.querySelector('.replay-btn');
        const replayButtons = document.querySelectorAll('.replay-btn');

// Обновление текста для каждой кнопки "Играть"
replayButtons.forEach(button => {
    button.innerHTML = `
    <p>Играть</p><img src="assets/images/Ticket.webp" alt="Билет" class="ticket-icon"> 
    (${tickets})
`;
});

        if (nextLevelButton) {
            nextLevelButton.addEventListener('click', () => {
                resultModal.remove();
                isGamePaused = false; // Снимаем игру с паузы
                currentLevel = 2;
                startGame(); // Запускаем 2 уровень
            });
        }

        // Кнопка для завершения игры и возврата на главный экран
        if (homeButton) {
            homeButton.addEventListener('click', () => {
                resultModal.remove();
                endGame(); // Завершаем игру и возвращаемся на главный экран
            });
        }

        if (replayButton) {
            replayButton.addEventListener('click', () => {
                resultModal.remove(); // Удаляем модальное окно
                currentLevel = 1; // Сбрасываем уровень на первый
                gameCoins = 0; // Сбрасываем количество монет
                daisyCoins = 0; // Сбрасываем $Daisy
                clearInterval(beeInterval);
                clearInterval(coinInterval);
                clearInterval(heartInterval);
                clearInterval(gameTimerInterval);
                clearGameObjects(); // Очищаем все объекты
        
                // Сбрасываем флаг паузы и перезапускаем игру
                isGamePaused = false;
                isGameRunning = false; // Сбрасываем флаг, что игра закончена
                startGame(); // Запускаем игру заново
            });
        }
    }

    function endGame() {
        isGamePaused = true;
        isGameRunning = false; // Сбрасываем флаг
    
        // Очищаем все таймеры
        clearInterval(beeInterval);
        clearInterval(coinInterval);
        clearInterval(heartInterval);
        clearInterval(gameTimerInterval);
    
        clearGameObjects(); // Скрываем все объекты
    
        // Возвращаемся на экран выбора мини-игры
        document.querySelector('.game-container').style.display = 'flex';
        document.getElementById('protect-flower-game').style.display = 'none';
    
        // Обновляем количество монет на главном экране
        updateGameCoinCount();
    
        // Останавливаем музыку мини-игры и включаем фоновую музыку
        AudioManager.pauseOneLevelMusic();
        AudioManager.pauseElectricChaosMusic();
        AudioManager.playBackgroundMusic();
    }

    // Проверка на проигрыш
    function isGameOver() {
        if (lives <= 0) {
            endLevel(currentLevel); // Заканчиваем уровень, если жизни кончились
        }
    }

    // Добавляем вызов проверки на проигрыш в местах, где игрок теряет жизни
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

                isGameOver(); // Проверяем, проиграл ли игрок после удара
            }

            if (bee.x < -bee.width || bee.x > canvas.width + bee.width || bee.y < -bee.height || bee.y > canvas.height) {
                bees.splice(i, 1);
            }
        }
    }

    function handleBeeDeath(x, y, isFromLeft) {
        const burnedBee = document.createElement('img');
        burnedBee.src = 'assets/images/laserassbee.webp';
        burnedBee.style.position = 'absolute';
        burnedBee.style.left = `${x}px`;
        burnedBee.style.top = `${y}px`;
        burnedBee.style.width = '50px';
        burnedBee.style.height = '50px';
        burnedBee.style.zIndex = '999';
        burnedBee.style.pointerEvents = 'none';
    
        if (isFromLeft) {
            burnedBee.style.transform = 'scaleX(-1)';
        }
    
        document.body.appendChild(burnedBee);
        allDeadBees.push(burnedBee);
    
        burnedBee.style.animation = 'electricShock 1.5s ease-in-out infinite';
    
        const deathTimeout = setTimeout(() => {
            burnedBee.animate([
                { transform: `translateY(0)`, opacity: 1 },
                { transform: `translateY(${window.innerHeight - y}px)`, opacity: 1 }
            ], {
                duration: 3000,
                easing: 'ease-in-out',
                fill: 'forwards'
            });
    
            const fallTimeout = setTimeout(() => {
                burnedBee.remove();
            }, 3000);
            timeouts.push(fallTimeout);
    
            let numCoins = Math.floor(Math.random() * 3) + 1;
            let coinCreated = false;
    
            for (let i = 0; i < numCoins; i++) {
                const coinTimeout = setTimeout(() => {
                    if (!coinCreated && Math.random() < 0.1) {
                        spawnGoldCoin(x + 40, y);
                        coinCreated = true;
                    } else {
                        spawnCollectibleCoin(x, y + (i * 50));
                    }
                }, i * 500);
                timeouts.push(coinTimeout); // Добавляем таймаут для каждой монеты
            }
        }, 1500);
        timeouts.push(deathTimeout); // Добавляем таймаут для задержки смерти
    }
    
    function spawnCollectibleCoin(x, y) {
        if (isPositionOccupied(x, y)) {
            x += Math.floor(Math.random() * 50) - 25;
            y += Math.floor(Math.random() * 50) - 25;
        }
    
        const coin = document.createElement('img');
        coin.src = 'assets/images/silvercoin.webp';
        coin.style.position = 'absolute';
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;
        coin.style.width = '25px';
        coin.style.height = '25px';
        coin.style.zIndex = '998';
        coin.classList.add('collectible-coin');
    
        activeCoins.push({ x, y, width: 25, height: 25 });
        allCoins.push(coin);
    
        const handleClick = () => {
            if (coin.classList.contains('collected')) return;
            coin.classList.add('collected');
            coin.style.pointerEvents = 'none';
            coin.style.filter = 'brightness(2) drop-shadow(0 0 10px rgba(255, 223, 0, 1))';
            animateCoinToCounter(coin);
            gameCoins += 10;
            updateGameCoinCount();
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        };
    
        coin.addEventListener('click', handleClick);
        document.body.appendChild(coin);
    
        const coinRemovalTimeout = setTimeout(() => {
            coin.remove();
            activeCoins = activeCoins.filter(c => c.x !== x || c.y !== y);
        }, 3000);
        timeouts.push(coinRemovalTimeout); // Добавляем таймаут для удаления монеты
    }
    
    function spawnGoldCoin(x, y) {
        if (isPositionOccupied(x, y)) {
            x += Math.floor(Math.random() * 50) - 25;
            y += Math.floor(Math.random() * 50) - 25;
        }
    
        const goldCoin = document.createElement('img');
        goldCoin.src = 'assets/images/goldcoin.webp';
        goldCoin.style.position = 'absolute';
        goldCoin.style.left = `${x + 20}px`;
        goldCoin.style.top = `${y}px`;
        goldCoin.style.width = '30px';
        goldCoin.style.height = '30px';
        goldCoin.style.zIndex = '998';
        goldCoin.classList.add('collectible-coin');
    
        activeCoins.push({ x: x + 20, y, width: 30, height: 30 });
        allCoins.push(goldCoin);
    
        const handleClick = () => {
            if (goldCoin.classList.contains('collected')) return;
            goldCoin.classList.add('collected');
            goldCoin.style.pointerEvents = 'none';
            goldCoin.style.filter = 'brightness(2) drop-shadow(0 0 10px rgba(255, 223, 0, 1))';
            animateCoinToCounter(goldCoin);
            daisyCoins += 10;
            updateGameCoinCount();
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        };
    
        goldCoin.addEventListener('click', handleClick);
        document.body.appendChild(goldCoin);
    
        const goldCoinRemovalTimeout = setTimeout(() => {
            goldCoin.remove();
            activeCoins = activeCoins.filter(c => c.x !== x + 20 || c.y !== y);
        }, 3000);
        timeouts.push(goldCoinRemovalTimeout); // Добавляем таймаут для удаления золотой монеты
    }
    
    
    function animateCoinToCounter(coin) {
        const coinRect = coin.getBoundingClientRect();
        const counter = document.getElementById('game-coin-count');
        const counterRect = counter.getBoundingClientRect();
    
        const deltaX = counterRect.left - coinRect.left;
        const deltaY = counterRect.top - coinRect.top;
    
        // Устанавливаем стили для анимации полета (ускоренный полет)
        coin.style.transition = 'transform 0.3s ease-out, opacity 0.3s ease-out';
        coin.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.3)`; // Уменьшаем размер в пути
    
        // Удаляем монетку после анимации
        setTimeout(() => {
            coin.remove();
        }, 300);
    }
    
    function isPositionOccupied(x, y) {
        for (let coin of activeCoins) {
            const distanceX = Math.abs(coin.x - x);
            const distanceY = Math.abs(coin.y - y);
            if (distanceX < 30 && distanceY < 30) { // Проверка на минимальную дистанцию
                return true;
            }
        }
        return false;
    }
    
    return {
        init,
    startGame, // Добавляем эту строку
    };
})();