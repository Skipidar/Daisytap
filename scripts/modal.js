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
        setupStartMiniGameButton();
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
                        setTimeout(() => {
                            ticketNotification.style.display = 'none';
                        }, 3000); // Скрыть через 3 секунды
                    }
                }
            }
        });

        observer.observe(predictionModal, { childList: true, subtree: true });
    }

    function setupStartMiniGameButton() {
        const startButton = document.getElementById('start-mini-game');
        if (startButton) {
            startButton.addEventListener('click', () => {
                MiniGame.startGame();
            });
        }
    }

    return {
        init,
        open
    };
})();
