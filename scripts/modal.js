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

        // Обработчик кнопки "Играть"
        document.getElementById('play-button').addEventListener('click', function() {
            document.querySelector('.game-container').style.display = 'none';
            document.getElementById('protect-flower-game').style.display = 'flex';
        });

        // Обновление лейбла билетов при загрузке
        Localization.updateTicketLabel();
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

        shareBtn.addEventListener('click', () => {
            alert('Поделиться с друзьями: Функция в разработке.');
        });

        publishBtn.addEventListener('click', () => {
            alert('Опубликовать историю: Функция в разработке.');
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
        historyContainer.innerHTML = '<h3 data-localize="prediction_history">История предсказаний:</h3>';
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
