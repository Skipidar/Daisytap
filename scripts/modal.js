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
        const modal = document.getElementById(modalId);
        modal.style.display = 'flex';

        if (modalId === 'prediction-modal') {
            updatePredictionHistory();
        }
    }

    function setupPredictionModal() {
        const predictionModal = document.getElementById('prediction-modal');
        const shareBtn = predictionModal.querySelector('.share-btn');
        const publishBtn = predictionModal.querySelector('.publish-btn');
        const ticketNotification = document.getElementById('ticket-notification');

        shareBtn.addEventListener('click', () => {
            alert(Localization.currentLanguage === 'ru' ? 'Поделиться с друзьями: Функция в разработке.' : 'Share with friends: Feature under development.');
        });

        publishBtn.addEventListener('click', () => {
            alert(Localization.currentLanguage === 'ru' ? 'Опубликовать историю: Функция в разработке.' : 'Publish story: Feature under development.');
        });
    }

    function setupAirdropModal() {
        const airdropBtn = document.getElementById('airdrop-btn');
        airdropBtn.addEventListener('click', () => {
            open('airdrop-modal');
        });
    }

    function setupRatingModal() {
        const ratingBtn = document.getElementById('rating-btn');
        ratingBtn.addEventListener('click', () => {
            open('rating-modal');
        });
    }

    function setupShopModal() {
        const shopBtn = document.getElementById('shop-btn');
        shopBtn.addEventListener('click', () => {
            open('shop-modal');
        });
    }

    function setupFriendsModal() {
        const friendsBtn = document.getElementById('friends-btn');
        friendsBtn.addEventListener('click', () => {
            open('friends-modal');
        });
    }

    function setupTasksModal() {
        const tasksBtn = document.getElementById('tasks-btn');
        tasksBtn.addEventListener('click', () => {
            open('tasks-modal');
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

    function updatePredictionHistory() {
        const predictionHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
        const historyContainer = document.getElementById('predictions-history');
        historyContainer.innerHTML = `<h3 data-localize="prediction_history">${Localization.currentLanguage === 'ru' ? 'История предсказаний:' : 'Prediction history:'}</h3>`;
        predictionHistory.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <p>${item.prediction}</p>
                <p class="history-date">${item.date}</p>
            `;
            historyContainer.appendChild(historyItem);
        });
    }

    return {
        init,
        open
    };
})();

document.addEventListener('DOMContentLoaded', Modal.init);
