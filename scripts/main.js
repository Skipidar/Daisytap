// scripts/main.js
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

    // Добавление кнопки переключения языка
    initLanguageToggle();
});

function initMain() {
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
            navigator.vibrate(200); // Вибро-отклик при загрузке
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

// Функция для инициализации кнопки переключения языка
function initLanguageToggle() {
    const languageToggle = document.getElementById('language-toggle');
    languageToggle.addEventListener('click', () => {
        const currentLanguage = document.documentElement.lang;
        if (currentLanguage === 'ru') {
            setLanguage('en');
        } else {
            setLanguage('ru');
        }
    });
}

// Функция установки языка
function setLanguage(lang) {
    document.documentElement.lang = lang;
    const elementsToTranslate = document.querySelectorAll('[data-i18n]');
    elementsToTranslate.forEach(el => {
        const key = el.dataset.i18n;
        el.textContent = translations[lang][key] || el.textContent;
    });
}

// Оптимизация экрана загрузки под формат 9:16
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.style.width = '100%';
    loadingScreen.style.height = '100%';

    // Добавление бликов на экран загрузки
    const sunGlare = document.createElement('div');
    sunGlare.className = 'sun-glare';
    loadingScreen.appendChild(sunGlare);
});
