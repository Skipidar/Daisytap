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
    // Анимация загрузки
    setTimeout(() => {
        fadeOutLoadingScreen();
    }, 3000); // 3 секунды загрузки

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
        const text = daisyElement.textContent;
        daisyElement.textContent = '';
        text.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.opacity = '0';
            span.style.transition = `opacity 0.5s ease ${index * 0.3}s`;
            daisyElement.appendChild(span);
            setTimeout(() => {
                span.style.opacity = '1';
            }, 100);
        });
    }
}
