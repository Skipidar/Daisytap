let coins = 10000; // Начальное количество $Daisy для тестирования
let spinCoins = 10000; // Начальное количество Coin для тестирования

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация модальных окон
    Modal.init();

    // Инициализация аудио
    AudioManager.init();

    // Инициализация магазина
    Shop.init();

    // Инициализация игры
    Game.init();

    // Инициализация мини-игры
    MiniGame.init();

    // Запуск анимации загрузки и инициализация главного экрана
    initMain();
});

function initMain() {
    // Загрузка монет из localStorage
    coins = parseInt(localStorage.getItem('coins')) || coins;
    spinCoins = parseInt(localStorage.getItem('spinCoins')) || spinCoins;
    document.getElementById('coin-count').textContent = coins;
    document.getElementById('spin-coin-count').textContent = spinCoins;

    // Анимация загрузки
    setTimeout(() => {
        fadeOutLoadingScreen();
    }, 4000); // 4 секунды загрузки

    // Функция плавного исчезновения экрана загрузки
    function fadeOutLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            animateDaisyLetters();
        }, 1000); // Длительность анимации fade-out
    }

    // Функция анимации появления слова "Daisy" по буквам
    function animateDaisyLetters() {
        const daisyElement = document.querySelector('.loading-text');
        const spans = daisyElement.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.opacity = '0';
            setTimeout(() => {
                span.style.opacity = '1';
            }, index * 300); // Задержка 0.3s между буквами
        });
    }
}
