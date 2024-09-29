const AudioManager = (function() {
    let backgroundMusic;
    let oneLevelMusic;
    let electricChaosMusic;
    let clickSound;
    let predictionSound;
    let udarSound;

    let soundEnabled = true;

    function init() {
        backgroundMusic = new Audio('assets/sounds/backgroundmusic.mp3');
        oneLevelMusic = new Audio('assets/sounds/Onelevel.mp3');
        electricChaosMusic = new Audio('assets/sounds/Electric Chaos.mp3');
        clickSound = new Audio('assets/sounds/click.mp3');
        predictionSound = new Audio('assets/sounds/prediction.mp3');
        udarSound = new Audio('assets/sounds/udar.mp3');

        // Установка громкости (уменьшено на 50%)
        backgroundMusic.volume = 0.25;
        oneLevelMusic.volume = 0.25;
        electricChaosMusic.volume = 0.25;
        clickSound.volume = 0.2;
        predictionSound.volume = 0.2;
        udarSound.volume = 0.2;

        backgroundMusic.loop = true;
        oneLevelMusic.loop = true;
        electricChaosMusic.loop = true;

        // Автоматическое воспроизведение фоновой музыки
        backgroundMusic.play().catch(error => {
            console.warn('Автоматическое воспроизведение музыки заблокировано:', error);
        });

        // Обработка кнопки отключения звука
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('click', toggleSound);
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        const soundIcon = document.getElementById('sound-icon');
        if (soundEnabled) {
            soundIcon.src = 'assets/images/on.webp';
            backgroundMusic.play();
            if (!oneLevelMusic.paused) oneLevelMusic.play();
            if (!electricChaosMusic.paused) electricChaosMusic.play();
        } else {
            soundIcon.src = 'assets/images/off.webp';
            backgroundMusic.pause();
            oneLevelMusic.pause();
            electricChaosMusic.pause();
        }
    }

    function playClickSound() {
        if (soundEnabled) clickSound.play();
    }

    function playPredictionSound() {
        if (soundEnabled) predictionSound.play();
    }

    function playUdarSound() {
        if (soundEnabled) udarSound.play();
    }

    function playOneLevelMusic() {
        if (soundEnabled) {
            backgroundMusic.pause();
            electricChaosMusic.pause();
            oneLevelMusic.play();
        }
    }

    function pauseOneLevelMusic() {
        oneLevelMusic.pause();
        backgroundMusic.play();
    }

    function playElectricChaosMusic() {
        if (soundEnabled) {
            backgroundMusic.pause();
            oneLevelMusic.pause();
            electricChaosMusic.play();
        }
    }

    function pauseElectricChaosMusic() {
        electricChaosMusic.pause();
        backgroundMusic.play();
    }

    return {
        init,
        toggleSound,
        playClickSound,
        playPredictionSound,
        playUdarSound,
        playOneLevelMusic,
        pauseOneLevelMusic,
        playElectricChaosMusic,
        pauseElectricChaosMusic
    };
})();
