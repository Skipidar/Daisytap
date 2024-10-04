// scripts/loading.js

document.addEventListener("DOMContentLoaded", () => {
    // Анимация появления слова "Daisy" по буквам
    const loadingTextSpans = document.querySelectorAll(".loading-text span");
    loadingTextSpans.forEach((span, index) => {
        span.style.animationDelay = `${index * 0.3}s`;
    });

    // Анимация загрузочной полоски
    const loadingBar = document.querySelector(".loading-bar");
    const loadingGlint = document.querySelector(".loading-glint");
    if (loadingBar && loadingGlint) {
        loadingBar.style.animation = "load 3s forwards";
        loadingGlint.style.animation = "glint 3s infinite linear";
    }

    // Удаление экрана загрузки и запуск игры
    setTimeout(() => {
        document.getElementById("loading-screen").classList.add("fade-out");
        setTimeout(() => {
            document.getElementById("loading-screen").style.display = "none";
            document.querySelector(".game-container").style.display = "flex";
        }, 1000);
    }, 3000); // 3 секунды для загрузки
});
