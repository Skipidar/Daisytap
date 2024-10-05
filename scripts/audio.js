// scripts/audio.js
const AudioManager = (function() {
    const sounds = {
        click: new Audio('assets/audio/click.mp3'),
        prediction: new Audio('assets/audio/prediction.mp3'),
        beeKill: new Audio('assets/audio/beeKill.mp3'),
        money: new Audio('assets/audio/money.mp3'),
        heartPlus: new Audio('assets/audio/heartPlus.mp3'),
        udar: new Audio('assets/audio/udar.mp3'),
        oneLevelMusic: new Audio('assets/audio/oneLevelMusic.mp3'),
        electricChaosMusic: new Audio('assets/audio/electricChaosMusic.mp3'),
        backgroundMusic: new Audio('assets/audio/backgroundMusic.mp3'),
    };

    let isMuted = localStorage.getItem('isMuted') === 'true' || false;

    function init() {
        // Установка громкости и состояния звука
        for (let key in sounds) {
            sounds[key].volume = 0.5;
            sounds[key].loop = key === 'backgroundMusic' || key === 'oneLevelMusic' || key === 'electricChaosMusic';
        }

        if (!isMuted) {
            playBackgroundMusic();
        }

        // Обработчик кнопки звука
        const soundToggle = document.getElementById('sound-toggle');
        soundToggle.addEventListener('click', toggleSound);
        updateSoundIcon();
    }

    function playSound(name) {
        if (!isMuted && sounds[name]) {
            sounds[name].currentTime = 0;
            sounds[name].play();
        }
    }

    function playClickSound() {
        playSound('click');
    }

    function playPredictionSound() {
        playSound('prediction');
    }

    function playBeeKillSound() {
        playSound('beeKill');
    }

    function playMoneySound() {
        playSound('money');
    }

    function playHeartPlusSound() {
        playSound('heartPlus');
    }

    function playUdarSound() {
        playSound('udar');
    }

    function playOneLevelMusic() {
        if (!isMuted) {
            sounds['oneLevelMusic'].play();
            pauseBackgroundMusic();
        }
    }

    function playElectricChaosMusic() {
        if (!isMuted) {
            sounds['electricChaosMusic'].play();
            pauseBackgroundMusic();
        }
    }

    function playBackgroundMusic() {
        if (!isMuted) {
            sounds['backgroundMusic'].play();
        }
    }

    function pauseOneLevelMusic() {
        sounds['oneLevelMusic'].pause();
    }

    function pauseElectricChaosMusic() {
        sounds['electricChaosMusic'].pause();
    }

    function pauseBackgroundMusic() {
        sounds['backgroundMusic'].pause();
    }

    function toggleSound() {
        isMuted = !isMuted;
        localStorage.setItem('isMuted', isMuted);
        if (isMuted) {
            pauseAllSounds();
        } else {
            playBackgroundMusic();
        }
        updateSoundIcon();
    }

    function pauseAllSounds() {
        for (let key in sounds) {
            sounds[key].pause();
        }
    }

    function updateSoundIcon() {
        const soundIcon = document.getElementById('sound-icon');
        if (isMuted) {
            soundIcon.src = 'assets/images/off.webp';
            soundIcon.alt = 'Звук выключен';
        } else {
            soundIcon.src = 'assets/images/on.webp';
            soundIcon.alt = 'Звук включен';
        }
    }

    return {
        init,
        playClickSound,
        playPredictionSound,
        playBeeKillSound,
        playMoneySound,
        playHeartPlusSound,
        playUdarSound,
        playOneLevelMusic,
        playElectricChaosMusic,
        playBackgroundMusic,
        pauseOneLevelMusic,
        pauseElectricChaosMusic,
        pauseBackgroundMusic,
    };
})();

document.addEventListener('DOMContentLoaded', AudioManager.init);
