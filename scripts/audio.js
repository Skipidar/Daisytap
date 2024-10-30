// scripts/audio.js
const AudioManager = (function() {
    let backgroundMusic;
    let oneLevelMusic;
    let electricChaosMusic;
    let clickSound;
    let predictionSound;
    let udarSound;
    let heartPlusSound;
    let moneySound;
    let levelCompleteSound;
    let beeKillSound;
    let shokBoomSound; 
    let levelUpSound; // Новый звук для уровня

    let soundEnabled = JSON.parse(localStorage.getItem('soundEnabled'));
    if (soundEnabled === null) soundEnabled = true;

    function init() {
        backgroundMusic = new Audio('assets/sounds/backgroundmusic.mp3');
        oneLevelMusic = new Audio('assets/sounds/Onelevel.mp3');
        electricChaosMusic = new Audio('assets/sounds/Electric Chaos.mp3');
        clickSound = new Audio('assets/sounds/click.mp3');
        predictionSound = new Audio('assets/sounds/prediction.mp3');
        udarSound = new Audio('assets/sounds/udar.mp3');
        heartPlusSound = new Audio('assets/sounds/heartplus.mp3');
        moneySound = new Audio('assets/sounds/moneyi.mp3');
        levelCompleteSound = new Audio('assets/sounds/1levelcomplete.mp3');
        beeKillSound = new Audio('assets/sounds/BeeKill.wav');
        shokBoomSound = new Audio('assets/sounds/SHOKBOOM.mp3');
        levelUpSound = new Audio('assets/sounds/levelUpSound.mp3'); // Звук для уровня

        // Установка громкости
        backgroundMusic.volume = 0.25;
        oneLevelMusic.volume = 0.25;
        electricChaosMusic.volume = 0.25;
        clickSound.volume = 0.1; 
        predictionSound.volume = 0.1;
        udarSound.volume = 0.1;
        heartPlusSound.volume = 0.2;
        moneySound.volume = 0.2;
        levelCompleteSound.volume = 0.3;
        beeKillSound.volume = 0.2;
        shokBoomSound.volume = 0.3; 
        levelUpSound.volume = 0.3; 

        backgroundMusic.loop = true;
        oneLevelMusic.loop = true;
        electricChaosMusic.loop = true;

        if (soundEnabled) {
            backgroundMusic.play().catch(error => {
                console.warn('Автоматическое воспроизведение музыки заблокировано:', error);
            });
        }

        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('click', toggleSound);

        updateSoundIcon();
    }

    function toggleSound() {
        soundEnabled = !soundEnabled;
        localStorage.setItem('soundEnabled', soundEnabled);
        updateSoundIcon();

        if (soundEnabled) {
            backgroundMusic.play();
            if (!oneLevelMusic.paused) oneLevelMusic.play();
            if (!electricChaosMusic.paused) electricChaosMusic.play();
        } else {
            backgroundMusic.pause();
            oneLevelMusic.pause();
            electricChaosMusic.pause();
            clickSound.pause();
            predictionSound.pause();
            udarSound.pause();
            heartPlusSound.pause();
            moneySound.pause();
            levelCompleteSound.pause();
            beeKillSound.pause();
            shokBoomSound.pause();
            levelUpSound.pause();
        }
    }

    function updateSoundIcon() {
        const soundIcon = document.getElementById('sound-icon');
        if (soundEnabled) {
            soundIcon.src = 'assets/images/on.webp';
        } else {
            soundIcon.src = 'assets/images/off.webp';
        }
    }

    function playClickSound() {
        if (soundEnabled) {
            clickSound.currentTime = 0;
            clickSound.play();
        }
    }

    function playPredictionSound() {
        if (soundEnabled) {
            predictionSound.currentTime = 0;
            predictionSound.play();
        }
    }

    function playUdarSound() {
        if (soundEnabled) {
            udarSound.currentTime = 0;
            udarSound.play();
        }
    }

    function playHeartPlusSound() {
        if (soundEnabled) {
            heartPlusSound.currentTime = 0;
            heartPlusSound.play();
        }
    }

    function playMoneySound() {
        if (soundEnabled) {
            moneySound.currentTime = 0;
            moneySound.play();
        }
    }

    function playLevelCompleteSound() {
        if (soundEnabled) {
            levelCompleteSound.currentTime = 0;
            levelCompleteSound.play();
        }
    }

    function playBeeKillSound() {
        if (soundEnabled) {
            beeKillSound.currentTime = 0;
            beeKillSound.play();
        }
    }

    function playShokBoomSound() {
        if (soundEnabled) {
            shokBoomSound.currentTime = 0;
            shokBoomSound.play();
        }
    }

    function playLevelUpSound() {
        if (soundEnabled) {
            levelUpSound.currentTime = 0;
            levelUpSound.play();
        }
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
    }

    function playBackgroundMusic() {
        if (soundEnabled && backgroundMusic.paused) {
            backgroundMusic.play();
        }
    }

    return {
        init,
        toggleSound,
        playClickSound,
        playPredictionSound,
        playUdarSound,
        playHeartPlusSound,
        playMoneySound,
        playLevelCompleteSound,
        playBeeKillSound,
        playShokBoomSound,
        playLevelUpSound, // Новый метод для уровня
        playOneLevelMusic,
        pauseOneLevelMusic,
        playElectricChaosMusic,
        pauseElectricChaosMusic,
        playBackgroundMusic
    };
})();
