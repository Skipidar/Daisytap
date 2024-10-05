// scripts/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize audio
    if (AudioManager && typeof AudioManager.init === 'function') {
        AudioManager.init();
    } else {
        console.error('AudioManager is not initialized or missing.');
    }

    // Initialize localization
    if (Localization && typeof Localization.init === 'function') {
        Localization.init();
    } else {
        console.error('Localization is not initialized or missing.');
    }

    // Initialize modals
    if (Modal && typeof Modal.init === 'function') {
        Modal.init();
    } else {
        console.error('Modal is not initialized or missing.');
    }

    // Initialize shop
    if (Shop && typeof Shop.init === 'function') {
        Shop.init();
    } else {
        console.error('Shop is not initialized or missing.');
    }

    // Initialize game
    if (Game && typeof Game.init === 'function') {
        Game.init();
    } else {
        console.error('Game is not initialized or missing.');
    }

    // Initialize mini-game
    if (MiniGame && typeof MiniGame.init === 'function') {
        MiniGame.init();
    } else {
        console.error('MiniGame is not initialized or missing.');
    }

    // Start loading animation and initialize main screen
    initMain();
});

function initMain() {
    // Loading animation
    setTimeout(() => {
        fadeOutLoadingScreen();
    }, 3000); // 3 seconds loading

    // Function to smoothly fade out the loading screen
    function fadeOutLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const gameContainer = document.querySelector('.game-container');
                if (gameContainer) {
                    gameContainer.style.display = 'flex';
                    animateDaisyLetters();
                } else {
                    console.error('Element with class "game-container" not found in DOM.');
                }
            }, 1000); // Duration of fade-out animation
        } else {
            console.error('Element with id="loading-screen" not found in DOM.');
        }
    }

    // Function to animate the appearance of the word "Daisy" letter by letter
    function animateDaisyLetters() {
        const daisyElement = document.querySelector('.loading-text');
        if (daisyElement) {
            const spans = daisyElement.querySelectorAll('span');
            spans.forEach((span, index) => {
                span.style.opacity = '0';
                setTimeout(() => {
                    span.style.opacity = '1';
                }, index * 300); // 0.3s delay between letters
            });
        } else {
            console.error('Element with class "loading-text" not found in DOM.');
        }
    }
}
