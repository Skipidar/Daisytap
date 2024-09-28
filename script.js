
document.addEventListener('DOMContentLoaded', function() {
    let tgUser = null;
    let isTelegram = false;

    // Инициализация Telegram SDK
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tgUser = tg.initDataUnsafe.user;
        isTelegram = true;
        console.log(`Добро пожаловать, ${tgUser.first_name}!`);
    } else {
        tgUser = { id: 123456789, first_name: 'TestUser', username: 'testuser' };
    }

    // Инициализация игры
    initGame();

    function initGame() {
        let coins = 200;
        let energy = 1000;
        let tickets = 1; // Количество билетов

        const coinCount = document.getElementById('coin-count');
        const ticketCount = document.getElementById('ticket-count');
        const chamomile = document.getElementById('chamomile');

        ticketCount.textContent = tickets; // Отображаем билеты

        // Анимация конфетти
        function createConfetti() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        // Автозапуск музыки
        const backgroundMusic = new Audio('assets/sounds/backgroundmusic.mp3');
        backgroundMusic.loop = true;
        backgroundMusic.play();

        // Клик по ромашке
        chamomile.addEventListener('click', function() {
            const coin = document.createElement('img');
            coin.src = 'assets/images/silvercoin.webp';
            coin.className = 'coin-icon';
            coin.style.transform = 'scale(2)'; // Увеличенная монета
            document.body.appendChild(coin);

            coinCount.textContent = ++coins; // Увеличиваем счетчик монет

            // Анимация пульсации счета
            coinCount.style.animation = 'pulse 0.5s ease-in-out';
        });

        // Мини-игра
        document.getElementById('play-button').addEventListener('click', function() {
            if (tickets > 0) {
                startMiniGame();
                tickets--;
                ticketCount.textContent = tickets; // Обновляем количество билетов
            } else {
                alert('У вас нет билетов!');
            }
        });
    }

    // Функция запуска мини-игры
    function startMiniGame() {
        // Логика мини-игры
    }
});
