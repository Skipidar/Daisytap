const Modal = (function() {
    function init() {
        // Закрытие модальных окон при нажатии на крестик
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                closeModal(this.closest('.modal'));
            });
        });

        // Закрытие модальных окон при клике вне контента
        window.addEventListener('click', function(event) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (event.target === modal) {
                    closeModal(modal);
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
        const playButton = document.getElementById('play-button');
        if (playButton) {
            playButton.addEventListener('click', function() {
                document.querySelector('.game-container').style.display = 'none';
                document.getElementById('protect-flower-game').style.display = 'flex';
            });
        }
    }

    function open(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
        }

        // Уменьшаем z-index кнопок смены языка и звука
        adjustLanguageAndSoundButtonsZIndex(true);

        // Если открывается модальное окно предсказаний, обновляем историю
        if (modalId === 'prediction-modal') {
            updatePredictionHistory();  // Вызов функции обновления истории предсказаний
        }
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        // Возвращаем исходный z-index кнопок смены языка и звука
        adjustLanguageAndSoundButtonsZIndex(false);
    }

    function adjustLanguageAndSoundButtonsZIndex(lower) {
        const languageToggle = document.getElementById('language-toggle');
        const soundToggle = document.getElementById('sound-toggle');
        const zIndex = lower ? '50' : '150';
        if (languageToggle) {
            languageToggle.style.zIndex = zIndex;
        }
        if (soundToggle) {
            soundToggle.style.zIndex = zIndex;
        }
    }

    function setupPredictionModal() {
        const predictionModal = document.getElementById('prediction-modal');
        if (predictionModal) {
            const shareBtn = predictionModal.querySelector('.share-btn');
            const publishBtn = predictionModal.querySelector('.publish-btn');
            
            if (shareBtn) {
                shareBtn.addEventListener('click', () => {
                    alert('Поделиться с друзьями: Функция в разработке.');
                });
            }

            if (publishBtn) {
                publishBtn.addEventListener('click', () => {
                    alert('Опубликовать историю: Функция в разработке.');
                });
            }
        }
    }

    function setupAirdropModal() {
        const airdropBtn = document.getElementById('airdrop-btn');
        if (airdropBtn) {
            airdropBtn.addEventListener('click', () => {
                open('airdrop-modal');
            });
        }
    }

    function setupRatingModal() {
        const ratingBtn = document.getElementById('rating-btn');
        if (ratingBtn) {
            ratingBtn.addEventListener('click', () => {
                open('rating-modal');
            });
        }
    }

    function setupShopModal() {
        const shopBtn = document.getElementById('shop-btn');
        if (shopBtn) {
            shopBtn.addEventListener('click', () => {
                open('shop-modal');
            });
        }
    }

    function setupFriendsModal() {
        const friendsBtn = document.getElementById('friends-btn');
        if (friendsBtn) {
            friendsBtn.addEventListener('click', () => {
                open('friends-modal');
            });
        }
    }

    function setupTasksModal() {
        const tasksBtn = document.getElementById('tasks-btn');
        if (tasksBtn) {
            tasksBtn.addEventListener('click', () => {
                open('tasks-modal');
            });
        }
    }

    function setupGiftModal() {
        const closeGiftBtn = document.getElementById('close-gift-btn');
        if (closeGiftBtn) {
            closeGiftBtn.addEventListener('click', () => {
                closeModal(document.getElementById('skin-purchase-modal'));
            });
        }
    }

    function updatePredictionHistory() {
        const predictionHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
        const historyContainer = document.getElementById('predictions-history');
        if (historyContainer) {
            historyContainer.innerHTML = '<h3>История предсказаний:</h3>';
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
    }

    function savePrediction(prediction) {
        let predictionHistory = JSON.parse(localStorage.getItem('predictionHistory')) || [];
        let date = new Date().toLocaleDateString();  // Получаем текущую дату
        predictionHistory.push({ prediction: prediction, date: date });  // Добавляем предсказание и дату в историю
        localStorage.setItem('predictionHistory', JSON.stringify(predictionHistory));  // Сохраняем историю в localStorage
    }
    
    return {
        init,
        open,
        updatePredictionHistory,  // Экспортируем функцию обновления истории
        savePrediction  // Экспортируем функцию сохранения предсказания
    };
})();

document.addEventListener('DOMContentLoaded', Modal.init);
