// scripts/locale.js
const locales = {
    en: {
        play: "Play",
        shop: "Shop",
        airdrop: "Airdrop",
        rating: "Rating",
        friends: "Friends",
        tasks: "Tasks",
        energy: "Energy",
        booster: "Booster",
        level: "Level",
        next_prediction: "Next prediction in:",
        installed: "Installed",
        // Добавьте остальные строки для перевода
    },
    ru: {
        play: "Играть",
        shop: "Магазин",
        airdrop: "Airdrop",
        rating: "Рейтинг",
        friends: "Друзья",
        tasks: "Задачи",
        energy: "Энергия",
        booster: "Бустер",
        level: "Уровень",
        next_prediction: "До следующего предсказания:",
        installed: "Установлено",
        // Добавьте остальные строки для перевода
    }
};

let currentLocale = 'ru';

function setLocale(locale) {
    currentLocale = locale;
    localStorage.setItem('locale', locale);
    updateTexts();
}

function updateTexts() {
    document.getElementById('play-button').textContent = locales[currentLocale].play;
    // Обновите остальные элементы интерфейса
    document.getElementById('airdrop-btn').textContent = locales[currentLocale].airdrop;
    document.getElementById('rating-btn').textContent = locales[currentLocale].rating;
    document.getElementById('friends-btn').textContent = locales[currentLocale].friends;
    document.getElementById('tasks-btn').textContent = locales[currentLocale].tasks;
    document.getElementById('energy-counter').innerHTML = `${locales[currentLocale].energy}: <span class="energy" id="energy-count">1000</span>`;
    document.getElementById('booster').textContent = `${locales[currentLocale].booster} 6/6 (01:00)`;
    document.querySelector('.level-container span').textContent = `${locales[currentLocale].level}: <span id="player-level">1</span>`;
    document.getElementById('prediction-timer').textContent = `${locales[currentLocale].next_prediction} <span id="prediction-countdown">00:00</span>`;
    // Кнопка переключения языка
    document.getElementById('language-toggle').textContent = currentLocale === 'ru' ? 'EN' : 'RU';
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLocale = localStorage.getItem('locale') || 'ru';
    setLocale(savedLocale);
});
