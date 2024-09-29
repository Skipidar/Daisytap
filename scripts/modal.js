// scripts/modal.js
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
        setupShopModal();
        setupFriendsModal();
        setupTasksModal();
        setupGiftModal();
    }

    function open(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    function setupPredictionModal() {
        const predictionModal = document.getElementById('prediction-modal');
        const shareBtn = predictionModal.querySelector('.share-btn');
        const publishBtn = predictionModal.querySelector('.publish-btn');
        const ticketNotification = document.getElementById('ticket-notification');

        shareBtn.addEventListener('click', () => {
            // Логика для поделиться с друзьями
            alert('Поделиться с друзьями: Функция в разработке.');
        });

        publishBtn.addEventListener('click', () => {
            // Логика для опубликовать историю
            alert('Опубликовать историю: Функция в разработке.');
        });

        // Оповещение о получении билетов
        const observer = new MutationObserver(function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    if (predictionModal.style.display === 'flex') {
                        // Показать оповещение о билетах
                        ticketNotification.style.display = 'block';
                    }
                }
            }
        });

        observer.observe(predictionModal, { childList: true, subtree: true });

        // Не скрывать уведомление
    }

    function setupAirdropModal() {
        const airdropBtn = document.getElementById('airdrop-btn');
        airdropBtn.addEventListener('click', () => {
            Modal.open('airdrop-modal');
        });
    }

    function setupRatingModal() {
        const ratingBtn = document.getElementById('rating-btn');
        ratingBtn.addEventListener('click', () => {
            Modal.open('rating-modal');
        });
    }

    function setupShopModal() {
        const shopBtn = document.getElementById('shop-btn');
        shopBtn.addEventListener('click', () => {
            Modal.open('shop-modal');
        });
    }

    function setupFriendsModal() {
        const friendsBtn = document.getElementById('friends-btn');
        friendsBtn.addEventListener('click', () => {
            Modal.open('friends-modal');
        });
    }

    function setupTasksModal() {
        const tasksBtn = document.getElementById('tasks-btn');
        tasksBtn.addEventListener('click', () => {
            Modal.open('tasks-modal');
        });
    }

    function setupGiftModal() {
        const closeGiftBtn = document.getElementById('close-gift-btn');
        if (closeGiftBtn) {
            closeGiftBtn.addEventListener('click', () => {
                document.getElementById('skin-purchase-modal').style.display = 'none';
            });
        }
    }

    return {
        init,
        open
    };
})();
