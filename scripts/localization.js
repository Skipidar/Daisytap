// scripts/localization.js
const Localization = (function() {
    let currentLanguage = localStorage.getItem('currentLanguage') || 'ru'; // Default language

    // Translations for different languages
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
            'tasks_info': 'Выполняйте задания и зарабатывайте больше $Daisy Coin',
            'next_prediction_in': 'До следующего предсказания:',
            'player_level': 'Уровень игрока:',
            'income_per_hour': 'Прибыль в час:',
            'start': 'Старт',
            'your_prediction': 'Ваше предсказание на сегодня:',
            'share_with_friends': 'Поделиться с друзьями',
            'publish_story': 'Опубликовать историю',
            'congratulations_ticket': 'Поздравляем! Ваш подарок: <span id="ticket-amount">{amount}</span> билетов.',
            'prediction_history': 'История предсказаний:',
            'airdrop_info': 'Что такое airdrop: Это бесплатная раздача токенов или монет пользователям криптовалютного проекта.',
            'airdrop_update': 'В данный момент игра находится на этапе добычи монет. Следите за обновлениями!',
            'player_rating': 'Рейтинг игроков',
            'rating_soon': 'Тестовый рейтинг скоро будет доступен.',
            'shop_daisy': 'За $Daisy',
            'shop_coin': 'За Coin',
            'shop_premium': 'Премиум',
            'invite_friends': 'Приглашайте друзей! Вы и ваш друг получите бонус в виде монет. Для Telegram друзей с Telegram Premium - особые условия!',
            'friends_soon': 'Тестовый список друзей скоро будет доступен.',
            'tasks_soon': 'Задания скоро появятся...',
            'your_gift': 'Поздравляем с приобретением <span id="gift-amount">{skinName}</span>!',
            'close': 'Закрыть',
            'upgrade': 'Улучшить',
            'equip_skin': 'Установить скин',
            'skin_equipped': 'Скин установлен!',
            'skin_equipped_status': 'Установлено',
            'skin_level': 'Уровень',
            'skin_upgraded': 'Скин улучшен до уровня',
            'to_level': '',
            'insufficient_funds': 'Недостаточно средств!',
            'insufficient_funds_for_upgrade': 'Недостаточно средств для улучшения!',
            'max_level_reached': 'Максимальный уровень достигнут!',
            'congratulations_purchase': 'Поздравляем с приобретением',
            'skin_equipped_alert': 'Скин установлен!'
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
            'tasks_info': 'Complete tasks to earn more $Daisy Coin',
            'next_prediction_in': 'Next prediction in:',
            'player_level': 'Player Level:',
            'income_per_hour': 'Income per hour:',
            'start': 'Start',
            'your_prediction': 'Your prediction for today:',
            'share_with_friends': 'Share with friends',
            'publish_story': 'Publish story',
            'congratulations_ticket': 'Congratulations! Your gift: <span id="ticket-amount">{amount}</span> tickets.',
            'prediction_history': 'Prediction history:',
            'airdrop_info': 'What is an airdrop: It is a free distribution of tokens or coins to users of a cryptocurrency project.',
            'airdrop_update': 'Currently, the game is in the coin mining stage. Stay tuned for updates!',
            'player_rating': 'Player Ratings',
            'rating_soon': 'Test rating will be available soon.',
            'shop_daisy': 'For $Daisy',
            'shop_coin': 'For Coin',
            'shop_premium': 'Premium',
            'invite_friends': 'Invite friends! You and your friend will receive a bonus in the form of coins. Special conditions for Telegram friends with Telegram Premium!',
            'friends_soon': 'Test friend list will be available soon.',
            'tasks_soon': 'Tasks will be available soon...',
            'your_gift': 'Congratulations on acquiring <span id="gift-amount">{skinName}</span>!',
            'close': 'Close',
            'upgrade': 'Upgrade',
            'equip_skin': 'Equip Skin',
            'skin_equipped': 'Skin equipped!',
            'skin_equipped_status': 'Equipped',
            'skin_level': 'Level',
            'skin_upgraded': 'Skin upgraded to level',
            'to_level': '',
            'insufficient_funds': 'Insufficient funds!',
            'insufficient_funds_for_upgrade': 'Insufficient funds for upgrade!',
            'max_level_reached': 'Maximum level reached!',
            'congratulations_purchase': 'Congratulations on acquiring',
            'skin_equipped_alert': 'Skin equipped!'
        }
    };

    // Function to switch language
    function switchLanguage() {
        currentLanguage = currentLanguage === 'ru' ? 'en' : 'ru';
        localStorage.setItem('currentLanguage', currentLanguage);
        applyTranslations();
        updateLanguageIcon();
    }

    // Update language icon
    function updateLanguageIcon() {
        const languageIcon = document.querySelector('#language-toggle img');
        if (languageIcon) {
            if (currentLanguage === 'ru') {
                languageIcon.src = 'assets/images/ru.svg';
            } else {
                languageIcon.src = 'assets/images/en.svg';
            }
        } else {
            console.error('Language toggle image not found.');
        }
    }

    // Apply translations to page elements
    function applyTranslations() {
        const elements = document.querySelectorAll('[data-localize]');
        elements.forEach(element => {
            const key = element.getAttribute('data-localize');
            if (translations[currentLanguage][key]) {
                element.innerHTML = translations[currentLanguage][key];
            }
        });
    }

    // Get translation for a specific key
    function getTranslation(key, params = {}) {
        let translation = translations[currentLanguage][key] || key;
        for (let param in params) {
            translation = translation.replace(`{${param}}`, params[param]);
        }
        return translation;
    }

    // Initialize localization
    function init() {
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', switchLanguage);
        } else {
            console.error('Language toggle element not found.');
        }
        applyTranslations(); // Apply translations on page load
        updateLanguageIcon();
    }

    return {
        init,
        getTranslation
    };
})();

document.addEventListener('DOMContentLoaded', Localization.init);
