// scripts/modal.js
const Modal = (function() {
    function init() {
        // Close modals on close button click
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.closest('.modal').style.display = 'none';
            });
        });

        // Close modals when clicking outside modal content
        window.addEventListener('click', function(event) {
            document.querySelectorAll('.modal').forEach(modal => {
                if (event.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });

        // Set up other modal-specific buttons and interactions
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
        if (modal) {
            modal.style.display = 'flex';
        } else {
            console.error(`Modal with id="${modalId}" not found.`);
        }
    }

    function setupPredictionModal() {
        const predictionModal = document.getElementById('prediction-modal');
        if (predictionModal) {
            const shareBtn = predictionModal.querySelector('.share-btn');
            const publishBtn = predictionModal.querySelector('.publish-btn');
            shareBtn.addEventListener('click', () => {
                alert(Localization.getTranslation('share_with_friends'));
            });
            publishBtn.addEventListener('click', () => {
                alert(Localization.getTranslation('publish_story'));
            });
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
        const giftModal = document.getElementById('skin-purchase-modal');
        if (giftModal) {
            const closeGiftBtn = giftModal.querySelector('.close-btn');
            if (closeGiftBtn) {
                closeGiftBtn.addEventListener('click', () => {
                    giftModal.style.display = 'none';
                });
            }
        }
    }

    return {
        init,
        open
    };
})();

document.addEventListener('DOMContentLoaded', Modal.init);
