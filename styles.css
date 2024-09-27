/* Общие стили */
body {
    margin: 0;
    padding: 0;
    background-color: #000000;
    font-family: 'Press Start 2P', cursive; /* Аркадный шрифт */
    color: #FFD700;
    overflow: hidden;
}

.game-container {
    width: 100%;
    height: 100vh;
    background: radial-gradient(circle at center, #000000 0%, #4B0082 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.counters {
    display: flex;
    justify-content: space-between;
    width: 90%;
    padding: 10px;
    font-size: 16px; /* Уменьшил размер шрифта для аркадного шрифта */
    font-weight: bold;
}

.counter {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    padding: 10px;
    display: flex;
    align-items: center;
}

.coin-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

.secondary-coin {
    font-size: 16px;
    margin-left: 5px;
}

.energy {
    font-size: 16px;
}

.chamomile-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(75,0,130,0.8) 100%);
    border-radius: 50%;
}

#chamomile {
    width: 100%;
    height: 100%;
    transition: transform 3s cubic-bezier(0.25, 0.1, 0.25, 1);
    cursor: pointer;
    position: absolute;
}

.spark {
    position: absolute;
    font-size: 24px;
    animation: sparkAnimation 1s ease-out;
    pointer-events: none;
}

@keyframes sparkAnimation {
    0% {
        opacity: 1;
        transform: translate(0, 0) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50px, -100px) scale(2);
    }
}

#timer {
    font-size: 18px;
    text-align: center;
    margin-top: 10px;
}

footer {
    display: flex;
    justify-content: space-around;
    width: 90%;
    padding: 10px;
    background-color: rgba(138, 43, 226, 0.8);
    border-radius: 0 0 25px 25px;
}

footer button {
    background: none;
    border: none;
    font-size: 14px; /* Уменьшил размер шрифта для аркадного стиля */
    font-weight: bold;
    color: #FFD700;
    cursor: pointer;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
}

footer .icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

/* Кнопка "Играть" */
#play-button {
    background-color: #32CD32;
    color: white;
    padding: 20px 40px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 16px; /* Уменьшил размер шрифта для аркадного стиля */
    margin-top: 20px;
    margin-bottom: 20px;
    animation: pulsePlayButton 2s infinite;
    transition: background-color 0.3s;
}

#play-button:hover {
    background-color: #28a428;
}

@keyframes pulsePlayButton {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

/* Бустер */
#booster {
    background-color: #32CD32;
    color: white;
    padding: 15px 30px; /* Увеличил размер для соответствия новым требованиям */
    border-radius: 10px;
    border: none;
    cursor: pointer;
    font-size: 14px; /* Уменьшил размер шрифта для аркадного стиля */
    margin-top: 20px;
    margin-bottom: 20px;
    transition: background-color 0.3s;
    position: relative;
}

#booster:hover {
    background-color: #28a428;
}

/* Модальные окна */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    justify-content: center;
    align-items: center;
    z-index: 100;
}

.modal-content {
    background-color: rgba(255, 255, 255, 0.1);
    padding: 20px;
    border-radius: 15px;
    width: 90%;
    height: 90%;
    max-width: 600px;
    overflow-y: auto;
    position: relative;
    animation: modalAppear 0.3s ease-out;
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

@keyframes modalAppear {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    font-size: 36px;
    color: white;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

#prediction-modal .modal-content {
    background-image: url('assets/images/prediction-background.png');
    background-size: cover;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    color: #fff;
    text-align: center;
    padding: 40px;
}

#prediction-title {
    font-family: 'Press Start 2P', cursive; /* Используем аркадный шрифт */
    font-size: 24px; /* Уменьшил размер шрифта для лучшей читаемости */
    font-weight: bold;
    margin-top: 20px;
    color: #FFD700;
    text-shadow: 3px 3px 6px rgba(0,0,0,0.7);
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
    100% {
        transform: scale(1);
    }
}

.prediction-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 30px;
}

.share-btn, .publish-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    color: white;
    font-size: 14px; /* Уменьшил размер шрифта для аркадного стиля */
    cursor: pointer;
    transition: background-color 0.3s;
}

.share-btn {
    background-color: #4CAF50;
}

.publish-btn {
    background-color: #008CBA;
}

.share-btn:hover, .publish-btn:hover {
    opacity: 0.8;
}

#predictions-history {
    margin-top: 50px;
    padding: 20px;
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
}

.history-item {
    margin-bottom: 15px;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 5px;
}

.history-date {
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #aaa;
}

/* Анимация загрузки */
#loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #000000;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 200;
}

#loading-screen img {
    width: 70%; /* Подогнано для 9:16 */
    max-width: 300px;
    height: auto; /* Избежим искажения */
}

/* Кнопка отключения звука на уровне бустера */
#sound-toggle {
    position: absolute;
    bottom: 20px; /* Подгоняем под уровень бустера */
    right: 20px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 150;
    transform: scale(1.5); /* Увеличиваем размер кнопки */
}

#sound-toggle img {
    width: 60px;
    height: 60px;
}

/* Магазин */
.shop-tabs {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.shop-tab {
    padding: 10px 20px;
    background-color: rgba(255, 215, 0, 0.3);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: 'Press Start 2P', cursive; /* Аркадный шрифт */
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
}

.shop-tab.active, .shop-tab:hover {
    background-color: rgba(255, 215, 0, 0.6);
}

.shop-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
}

.skin-item {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%; /* Делает изображение круговым */
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.skin-item:hover {
    transform: scale(1.05);
}

.skin-item img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 50%; /* Убедимся, что изображения круговые */
}

.skin-price {
    margin-top: 5px;
    font-weight: bold;
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
}

/* Специальные стили для скина 'lpodsolnuh.webp' */
.skin-item img[src="assets/images/lpodsolnuh.webp"] {
    width: 180px; /* Увеличиваем размер изображения в 3 раза */
    height: 180px;
}

/* Мини-игра "Защити цветок" */
.game-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('assets/images/gamepole.webp') no-repeat center center;
    background-size: cover;
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game-canvas {
    width: 100%;
    height: 100%;
}

#game-timer {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #FFFFFF;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

#game-lives {
    position: absolute;
    top: 10px;
    right: 10px;
}

.life-icon {
    width: 40px;
    height: 40px;
    margin-left: 5px;
}

#game-coins {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    font-size: 18px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #FFFFFF;
}

#game-coins .coin-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

/* Кнопка "Начать игру" */
#start-game-button {
    position: absolute;
    bottom: 50px;
    padding: 15px 30px;
    background-color: #FF4500;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    animation: pulseStartButton 2s infinite;
    transition: background-color 0.3s;
}

#start-game-button:hover {
    background-color: #e03e00;
}

@keyframes pulseStartButton {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Анимация конфетти */
#confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 250;
}

/* Дополнительные стили для мини-игры */
.pulsate {
    animation: pulsate 0.5s ease-out;
}

@keyframes pulsate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.replay-btn, .exit-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px; /* Уменьшил размер шрифта для аркадного стиля */
    margin: 10px;
}

.replay-btn {
    background-color: #32CD32;
    color: white;
    animation: pulseReplay 2s infinite;
}

.exit-btn {
    background-color: #FF0000;
    color: white;
}

@keyframes pulseReplay {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Оптимизация под 9:16 */
@media (orientation: portrait) {
    .game-container, .game-screen {
        width: 100vw;
        height: 177.78vh; /* 9:16 соотношение */
    }

    #loading-screen img {
        width: 70%; /* Подогнано для 9:16 */
        max-width: 300px;
    }
}

@media (orientation: landscape) {
    .game-container, .game-screen {
        width: 177.78vw; /* 16:9 перевёрнутое */
        height: 100vh;
    }

    #loading-screen img {
        width: 50%; /* Подогнано для 16:9 */
        max-width: 300px;
    }
}

/* Пульсация счетчика монет */
.coin-counter-pulse {
    animation: pulseCounter 0.5s;
}

@keyframes pulseCounter {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

/* Кнопка отключения звука на уровне бустера */
#sound-toggle {
    position: absolute;
    bottom: 20px; /* Подгоняем под уровень бустера */
    right: 20px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 150;
    transform: scale(1.5); /* Увеличиваем размер кнопки */
}

#sound-toggle img {
    width: 60px;
    height: 60px;
}

/* Магазин */
.shop-tabs {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.shop-tab {
    padding: 10px 20px;
    background-color: rgba(255, 215, 0, 0.3);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: 'Press Start 2P', cursive; /* Аркадный шрифт */
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
}

.shop-tab.active, .shop-tab:hover {
    background-color: rgba(255, 215, 0, 0.6);
}

.shop-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
}

.skin-item {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%; /* Делает изображение круговым */
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.skin-item:hover {
    transform: scale(1.05);
}

.skin-item img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 50%; /* Убедимся, что изображения круговые */
}

.skin-price {
    margin-top: 5px;
    font-weight: bold;
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
}

/* Специальные стили для скина 'lpodsolnuh.webp' */
.skin-item img[src="assets/images/lpodsolnuh.webp"] {
    width: 180px; /* Увеличиваем размер изображения в 3 раза */
    height: 180px;
}

/* Мини-игра "Защити цветок" */
.game-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('assets/images/gamepole.webp') no-repeat center center;
    background-size: cover;
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game-canvas {
    width: 100%;
    height: 100%;
}

#game-timer {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #FFFFFF;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

#game-lives {
    position: absolute;
    top: 10px;
    right: 10px;
}

.life-icon {
    width: 40px;
    height: 40px;
    margin-left: 5px;
}

#game-coins {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    font-size: 18px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #FFFFFF;
}

#game-coins .coin-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

/* Кнопка "Начать игру" */
#start-game-button {
    position: absolute;
    bottom: 50px;
    padding: 15px 30px;
    background-color: #FF4500;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    animation: pulseStartButton 2s infinite;
    transition: background-color 0.3s;
}

#start-game-button:hover {
    background-color: #e03e00;
}

@keyframes pulseStartButton {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Анимация конфетти */
#confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 250;
}

/* Дополнительные стили для мини-игры */
.pulsate {
    animation: pulsate 0.5s ease-out;
}

@keyframes pulsate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.replay-btn, .exit-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px; /* Уменьшил размер шрифта для аркадного стиля */
    margin: 10px;
}

.replay-btn {
    background-color: #32CD32;
    color: white;
    animation: pulseReplay 2s infinite;
}

.exit-btn {
    background-color: #FF0000;
    color: white;
}

@keyframes pulseReplay {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Оптимизация под 9:16 и 16:9 */
@media (orientation: portrait) {
    .game-container, .game-screen {
        width: 100vw;
        height: 177.78vh; /* 9:16 соотношение */
    }

    #loading-screen img {
        width: 70%; /* Подогнано для 9:16 */
        max-width: 300px;
    }
}

@media (orientation: landscape) {
    .game-container, .game-screen {
        width: 177.78vw; /* 16:9 перевёрнутое */
        height: 100vh;
    }

    #loading-screen img {
        width: 50%; /* Подогнано для 16:9 */
        max-width: 300px;
    }
}

/* Пульсация счетчика монет */
.coin-counter-pulse {
    animation: pulseCounter 0.5s;
}

@keyframes pulseCounter {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

/* Кнопка отключения звука на уровне бустера */
#sound-toggle {
    position: absolute;
    bottom: 20px; /* Подгоняем под уровень бустера */
    right: 20px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 150;
    transform: scale(1.5); /* Увеличиваем размер кнопки */
}

#sound-toggle img {
    width: 60px;
    height: 60px;
}

/* Магазин */
.shop-tabs {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 20px;
}

.shop-tab {
    padding: 10px 20px;
    background-color: rgba(255, 215, 0, 0.3);
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-family: 'Press Start 2P', cursive; /* Аркадный шрифт */
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
}

.shop-tab.active, .shop-tab:hover {
    background-color: rgba(255, 215, 0, 0.6);
}

.shop-content {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 20px;
}

.skin-item {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%; /* Делает изображение круговым */
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.2s;
    width: 120px;
    height: 120px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.skin-item:hover {
    transform: scale(1.05);
}

.skin-item img {
    width: 60px;
    height: 60px;
    object-fit: contain;
    border-radius: 50%; /* Убедимся, что изображения круговые */
}

.skin-price {
    margin-top: 5px;
    font-weight: bold;
    font-size: 12px; /* Уменьшил размер шрифта для аркадного стиля */
}

/* Специальные стили для скина 'lpodsolnuh.webp' */
.skin-item img[src="assets/images/lpodsolnuh.webp"] {
    width: 180px; /* Увеличиваем размер изображения в 3 раза */
    height: 180px;
}

/* Мини-игра "Защити цветок" */
.game-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('assets/images/gamepole.webp') no-repeat center center;
    background-size: cover;
    z-index: 300;
    display: flex;
    justify-content: center;
    align-items: center;
}

#game-canvas {
    width: 100%;
    height: 100%;
}

#game-timer {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #FFFFFF;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
}

#game-lives {
    position: absolute;
    top: 10px;
    right: 10px;
}

.life-icon {
    width: 40px;
    height: 40px;
    margin-left: 5px;
}

#game-coins {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    align-items: center;
    font-size: 18px; /* Уменьшил размер шрифта для аркадного стиля */
    color: #FFFFFF;
}

#game-coins .coin-icon {
    width: 24px;
    height: 24px;
    margin-right: 5px;
}

/* Кнопка "Начать игру" */
#start-game-button {
    position: absolute;
    bottom: 50px;
    padding: 15px 30px;
    background-color: #FF4500;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    animation: pulseStartButton 2s infinite;
    transition: background-color 0.3s;
}

#start-game-button:hover {
    background-color: #e03e00;
}

@keyframes pulseStartButton {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Анимация конфетти */
#confetti-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 250;
}

/* Дополнительные стили для мини-игры */
.pulsate {
    animation: pulsate 0.5s ease-out;
}

@keyframes pulsate {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}

.replay-btn, .exit-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px; /* Уменьшил размер шрифта для аркадного стиля */
    margin: 10px;
}

.replay-btn {
    background-color: #32CD32;
    color: white;
    animation: pulseReplay 2s infinite;
}

.exit-btn {
    background-color: #FF0000;
    color: white;
}

@keyframes pulseReplay {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}

/* Оптимизация под 9:16 и 16:9 */
@media (orientation: portrait) {
    .game-container, .game-screen {
        width: 100vw;
        height: 177.78vh; /* 9:16 соотношение */
    }

    #loading-screen img {
        width: 70%; /* Подогнано для 9:16 */
        max-width: 300px;
    }
}

@media (orientation: landscape) {
    .game-container, .game-screen {
        width: 177.78vw; /* 16:9 перевёрнутое */
        height: 100vh;
    }

    #loading-screen img {
        width: 50%; /* Подогнано для 16:9 */
        max-width: 300px;
    }
}

/* Пульсация счетчика монет */
.coin-counter-pulse {
    animation: pulseCounter 0.5s;
}

@keyframes pulseCounter {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.2);
    }
    100% {
        transform: scale(1);
    }
}
