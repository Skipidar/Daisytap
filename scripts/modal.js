const Modal = (function() {
    function init() {
        // Закрытие модальных окон при нажатии на крестик
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Закрытие модальных окон при клике вне контента
        window.addEventListener('click', function(event) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Обработчики кнопок в модальных окнах
        setupPredictionModal();
        setupAirdropModal();
        setupRatingModal();
        setupFriendsModal();
        setupTasksModal();
        setupGiftModal();

        // Локализация
        setupLocalization();
    }

    function open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    function setupPredictionModal() {
        const predictionModal = document.getElementById('prediction-modal');
        if (predictionModal) {
            const shareBtn = predictionModal.querySelector('.share-btn');
            const publishBtn = predictionModal.querySelector('.publish-btn');
            const ticketNotification = document.getElementById('ticket-notification');

            if (shareBtn) {
                shareBtn.addEventListener('click', () => {
                    // Логика для поделиться с друзьями
                    alert('Поделиться с друзьями: Функция в разработке.');
                });
            }

            if (publishBtn) {
                publishBtn.addEventListener('click', () => {
                    // Логика для опубликовать историю
                    alert('Опубликовать историю: Функция в разработке.');
                });
            }
        }
    }

    function setupAirdropModal() {
        const airdropBtn = document.getElementById('airdrop-btn');
        if (airdropBtn) {
            airdropBtn.addEventListener('click', () => {
                Modal.open('airdrop-modal');
            });
        }
    }

    function setupRatingModal() {
        const ratingBtn = document.getElementById('rating-btn');
        if (ratingBtn) {
            ratingBtn.addEventListener('click', () => {
                Modal.open('rating-modal');
            });
        }
    }

    function setupShopModal() {
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                Modal.open('shop-modal');
            });
        }
    }

    function setupFriendsModal() {
        const friendsBtn = document.getElementById('friends-btn');
        if (friendsBtn) {
            friendsBtn.addEventListener('click', () => {
                Modal.open('friends-modal');
            });
        }
    }

    function setupTasksModal() {
        const tasksBtn = document.getElementById('tasks-btn');
        if (tasksBtn) {
            tasksBtn.addEventListener('click', () => {
                Modal.open('tasks-modal');
            });
        }
    }

    function setupGiftModal() {
        const closeGiftBtn = document.getElementById('close-gift-btn');
        if (closeGiftBtn) {
            closeGiftBtn.addEventListener('click', () => {
                const skinPurchaseModal = document.getElementById('skin-purchase-modal');
                if (skinPurchaseModal) {
                    skinPurchaseModal.style.display = 'none';
                }
            });
        }
    }

    function setupLocalization() {
        const locales = {
            en: {
                play: "Play",
                shop: "Shop",
                airdrop: "Airdrop",
                rating: "Rating",
                friends: "Friends",
                tasks: "Tasks",
                spinChamomile: "Spin Chamomile",
                // Добавьте остальные строки для перевода
            },
            ru: {
                play: "Играть",
                shop: "Магазин",
                airdrop: "Airdrop",
                rating: "Рейтинг",
                friends: "Друзья",
                tasks: "Задачи",
                spinChamomile: "Крутить ромашку",
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
            const shopBtn = document.getElementById('shop-btn');
            if (shopBtn) shopBtn.textContent = locales[currentLocale].shop;
            document.getElementById('airdrop-btn').textContent = locales[currentLocale].airdrop;
            document.getElementById('rating-btn').textContent = locales[currentLocale].rating;
            document.getElementById('friends-btn').textContent = locales[currentLocale].friends;
            document.getElementById('tasks-btn').textContent = locales[currentLocale].tasks;
            document.getElementById('language-toggle').textContent = currentLocale === 'ru' ? 'EN' : 'RU';
            document.getElementById('start-mini-game').textContent = locales[currentLocale].play;
            document.getElementById('chamomile').alt = locales[currentLocale].spinChamomile;
            // Обновите остальные элементы интерфейса
        }

        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => {
                const newLocale = currentLocale === 'ru' ? 'en' : 'ru';
                setLocale(newLocale);
            });
        }

        // При загрузке страницы
        document.addEventListener('DOMContentLoaded', () => {
            const savedLocale = localStorage.getItem('locale') || 'ru';
            setLocale(savedLocale);
        });
    }

    return {
        init,
        open
    };
})();
