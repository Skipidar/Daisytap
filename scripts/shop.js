const Shop = (function() {
    let coins = 10000; // Начальное количество $Daisy для тестирования
    let spinCoins = 10000; // Начальное количество Coin для тестирования
    let skins = [];

    function init() {
        // Инициализация вкладок магазина
        const shopTabs = document.querySelectorAll('.shop-tab');
        if (shopTabs.length > 0) {
            shopTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    const tabName = this.getAttribute('data-tab');
                    loadShopItems(tabName);
                });
            });
        }

        // Загрузка сохранённых данных скинов
        const savedSkins = JSON.parse(localStorage.getItem('skins'));
        if (savedSkins && savedSkins.length > 0) {
            skins = savedSkins;
        } else {
            // Инициализируем скины, если данных нет
            skins = [
                { name: 'Bubble', basePrice: 100, level: 1, maxLevel: 20, profitPerHour: 10, image: 'assets/images/bubble.webp' },
                { name: 'Rose', basePrice: 200, level: 1, maxLevel: 20, profitPerHour: 20, image: 'assets/images/Rose.webp' },
                { name: 'Pizza', basePrice: 300, level: 1, maxLevel: 20, profitPerHour: 30, image: 'assets/images/pizza.webp' },
                { name: 'Pechenka', basePrice: 400, level: 1, maxLevel: 20, profitPerHour: 40, image: 'assets/images/Pechenka.webp' },
                { name: 'Panda', basePrice: 500, level: 1, maxLevel: 20, profitPerHour: 50, image: 'assets/images/panda.webp' },
                { name: 'Luna', basePrice: 600, level: 1, maxLevel: 20, profitPerHour: 60, image: 'assets/images/luna.webp' }
            ];
            localStorage.setItem('skins', JSON.stringify(skins));
        }

        // Обновляем баланс из localStorage
        coins = parseInt(localStorage.getItem('coins')) || coins;
        spinCoins = parseInt(localStorage.getItem('spinCoins')) || spinCoins;
        updateBalance();
    }

    function openShop() {
        loadShopItems('daisy');
        Modal.open('shop-modal');
    }

    function loadShopItems(tabName) {
        const shopContent = document.getElementById('shop-content');
        if (!shopContent) return;

        shopContent.innerHTML = '';

        let items = [];
        if (tabName === 'daisy') {
            items = skins.filter(skin => skin.basePrice > 0);
        } else if (tabName === 'coin') {
            items = [
                { name: 'Vinyl', price: 1, image: 'assets/images/vinyl.webp' },
                { name: 'Lotus', price: 1, image: 'assets/images/lotus.webp' },
                { name: 'Pingvin', price: 1, image: 'assets/images/pingvin.webp' },
                { name: 'Spinner', price: 1, image: 'assets/images/spinner.webp' },
                { name: 'lpodsolnuh', price: 1, image: 'assets/images/lpodsolnuh.webp' }
            ];
        } else if (tabName === 'premium') {
            items = [
                { name: 'Lion', price: 5000, image: 'assets/images/lion.webp' },
                { name: 'Fish', price: 5000, image: 'assets/images/fish.webp' }
            ];
        }

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'skin-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                <div>${item.name} (Уровень ${item.level || 1}/${item.maxLevel || 'N/A'})</div>
                <div class="skin-price">${item.price || item.basePrice} ${tabName === 'coin' ? 'Coin' : '$Daisy'}</div>
            `;

            if (item.installed) {
                itemDiv.innerHTML += '<div class="installed-label">Установлено</div>';
            }

            itemDiv.addEventListener('click', () => purchaseSkin(item));
            shopContent.appendChild(itemDiv);
        });
    }

    function purchaseSkin(skin) {
        if (skin.level < skin.maxLevel && coins >= skin.basePrice * skin.level) {
            coins -= skin.basePrice * skin.level;
            skin.level++;
            updateBalance();
            localStorage.setItem('skins', JSON.stringify(skins));
            loadShopItems('daisy'); // Обновите отображение магазина
        } else {
            alert('Недостаточно средств или максимальный уровень достигнут!');
        }
    }

    function applySkin(skinImage) {
        const chamomile = document.getElementById('chamomile');
        if (chamomile) {
            chamomile.src = skinImage;
        }
    }

    function updateBalance() {
        const coinCountElem = document.getElementById('coin-count');
        const spinCoinCountElem = document.getElementById('spin-coin-count');

        if (coinCountElem) {
            coinCountElem.textContent = Math.floor(coins);
        }

        if (spinCoinCountElem) {
            spinCoinCountElem.textContent = Math.floor(spinCoins);
        }

        localStorage.setItem('coins', coins);
        localStorage.setItem('spinCoins', spinCoins);
    }

    function startIncomeTimer() {
        setInterval(() => {
            let totalProfit = 0;
            skins.forEach(skin => {
                totalProfit += skin.profitPerHour * skin.level;
            });
            spinCoins += totalProfit / 3600; // Прибыль каждую секунду
            updateBalance();
        }, 1000);
    }

    startIncomeTimer();

    return {
        init,
        updateBalance
    };
})();
