document.addEventListener('DOMContentLoaded', function() {
    Modal.init();
    AudioManager.init();
    Shop.init();
    Game.init();
    MiniGame.init();

    initMain();
});

function initMain() {
    setTimeout(() => {
        fadeOutLoadingScreen();
    }, 3000);

    function fadeOutLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            document.querySelector('.game-container').style.display = 'flex';
            animateDaisyLetters();
        }, 1000);
    }

    function animateDaisyLetters() {
        const daisyElement = document.querySelector('.loading-text');
        const spans = daisyElement.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.opacity = '0';
            setTimeout(() => {
                span.style.opacity = '1';
            }, index * 300);
        });
    }
}
