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

    // Запуск анимации загрузки
    Main.init();
});
