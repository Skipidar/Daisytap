// scripts/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация аудио
    if (AudioManager && typeof AudioManager.init === 'function') {
        AudioManager.init();
    } else {
        console.error('AudioManager не инициализирован или отсутствует.');
    }

    // Инициализация локализации
    if (Localization && typeof Localization.init === 'function') {
        Localization.init();
    } else {
        console.error('Localization не инициализирован или отсутствует.');
    }

    // Инициализация модальных окон
    if (Modal && typeof Modal.init === 'function') {
        Modal.init();
    } else {
        console.error('Modal не инициализирован или отсутствует.');
    }

    // Инициализация магазина
    if (Shop && typeof Shop.init === 'function') {
        Shop.init();
    } else {
        console.error('Shop не инициализирован или отсутствует.');
    }

    // Инициализация игры
    if (Game && typeof Game.init === 'function') {
        Game.init();
    } else {
        console.error('Game не инициализирован или отсутствует.');
    }

    // Инициализация мини-игры
    if (MiniGame && typeof MiniGame.init === 'function') {
        MiniGame.init();
    } else {
        console.error('MiniGame не инициализирован или отсутствует.');
    }

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
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.style.display = 'flex';
                    animateDaisyLetters();
                } else {
                    console.error('Элемент с классом "game-container" не найден в DOM.');
                }
            }, 1000); // Длительность анимации fade-out
        } else {
            console.error('Элемент с id="loading-screen" не найден в DOM.');
        }
    }

    // Функция анимации появления слова "Daisy" по буквам
    function animateDaisyLetters() {
        const daisyElement = document.querySelector('.loading-text');
        if (daisyElement) {
            const spans = daisyElement.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.opacity = '0';
                setTimeout(() => {
                    span.style.opacity = '1';
                }, index * 300); // Задержка 0.3s между буквами
            });
        } else {
            console.error('Элемент с классом "loading-text" не найден в DOM.');
        }
    }
}
