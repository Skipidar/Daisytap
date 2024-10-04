// scripts/localization.js
const Localization = (function() {
    let currentLanguage = 'ru'; // Текущий язык по умолчанию

    // Переводы для разных языков
    const translations = {
        'ru': {
            'play_button': 'Играть',
            'airdrop': 'Airdrop',
            'rating': 'Рейтинг',
            'shop': 'Магазин',
            'friends': 'Друзья',
            'tasks': 'Задачи',
            'congratulations': 'Поздравляем!',
            'gift_tickets': 'Ваш подарок: {amount} билетов.',
            'prediction_today': 'Ваше предсказание на сегодня:',
            'share': 'Поделиться с друзьями',
            'publish': 'Опубликовать историю',
            'tasks_title': 'Задачи',
            'tasks_info': 'Выполняйте задания и зарабатывайте больше $Daisy Coin'
        },
        'en': {
            'play_button': 'Play',
            'airdrop': 'Airdrop',
            'rating': 'Rating',
            'shop': 'Shop',
            'friends': 'Friends',
            'tasks': 'Tasks',
            'congratulations': 'Congratulations!',
            'gift_tickets': 'Your gift: {amount} tickets.',
            'prediction_today': 'Your prediction for today:',
            'share': 'Share with friends',
            'publish': 'Publish story',
            'tasks_title': 'Tasks',
            'tasks_info': 'Complete tasks to earn more $Daisy Coin'
        }
    };

    // Функция для смены языка
    function switchLanguage() {
        currentLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
        applyTranslations();
    }

    // Применение переводов к элементам страницы
    function applyTranslations() {
        document.getElementById('play-button').textContent = translations[currentLanguage]['play_button'];
        document.getElementById('airdrop-btn').textContent = translations[currentLanguage]['airdrop'];
        document.getElementById('rating-btn').textContent = translations[currentLanguage]['rating'];
        document.getElementById('shop-btn').innerHTML = `<img src="assets/images/shop.webp" alt="Shop" class="icon"> ${translations[currentLanguage]['shop']}`;
        document.getElementById('friends-btn').textContent = translations[currentLanguage]['friends'];
        document.getElementById('tasks-btn').textContent = translations[currentLanguage]['tasks'];

        // Модальные окна и прочий контент
        document.querySelector('#skin-purchase-modal h2').textContent = translations[currentLanguage]['congratulations'];
        document.getElementById('gift-amount').textContent = translations[currentLanguage]['gift_tickets'].replace('{amount}', '0');
        document.querySelector('#prediction-modal h2').textContent = translations[currentLanguage]['prediction_today'];
        document.querySelector('.share-btn').textContent = translations[currentLanguage]['share'];
        document.querySelector('.publish-btn').textContent = translations[currentLanguage]['publish'];
        document.querySelector('#tasks-modal h2').textContent = translations[currentLanguage]['tasks_title'];
        document.querySelector('#tasks-modal p:nth-of-type(1)').textContent = translations[currentLanguage]['tasks_info'];
    }

    // Инициализация
    function init() {
        document.getElementById('language-toggle').addEventListener('click', switchLanguage);
        applyTranslations(); // Применение переводов при загрузке страницы
    }

    return {
        init
    };
})();

document.addEventListener('DOMContentLoaded', Localization.init);
