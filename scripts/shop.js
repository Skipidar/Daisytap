const Shop = (function() {
    let coins = parseInt(localStorage.getItem('coins')) || 10000;
    let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000;
    let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || {'chamomile': {level: 1, equipped: true}}; // Ромашка установлена по умолчанию
    let incomePerHour = parseInt(localStorage.getItem('incomePerHour')) || 0;

    const skinsData = {
        // Скины доступные в магазине
        'chamomile': {name: 'Chamomile', price: 0, currency: '$Daisy', image: 'assets/images/chamomile.webp', income: 1},
        'bubble': {name: 'Bubble', price: 100, currency: '$Daisy', image: 'assets/images/bubble.webp', income: 2},
        'rose': {name: 'Rose', price: 200, currency: '$Daisy', image: 'assets/images/Rose.webp', income: 3},
        'pizza': {name: 'Pizza', price: 300, currency: '$Daisy', image: 'assets/images/pizza.webp', income: 4},
        'pechenka': {name: 'Pechenka', price: 400, currency: '$Daisy', image: 'assets/images/Pechenka.webp', income: 5},
        'panda': {name: 'Panda', price: 500, currency: '$Daisy', image: 'assets/images/panda.webp', income: 6},
        'luna': {name: 'Luna', price: 600, currency: '$Daisy', image: 'assets/images/luna.webp', income: 7},
        'vinyl': {name: 'Vinyl', price: 1000, currency: 'Coin', image: 'assets/images/vinyl.webp', income: 1},
        'lotus': {name: 'Lotus', price: 1000, currency: 'Coin', image: 'assets/images/lotus.webp', income: 1},
        'pingvin': {name: 'Pingvin', price: 1000, currency: 'Coin', image: 'assets/images/pingvin.webp', income: 1},
        'spinner': {name: 'Spinner', price: 1000, currency: 'Coin', image: 'assets/images/spinner.webp', income: 1},
        'lpodsolnuh': {name: 'Lpodsolnuh', price: 1000, currency: 'Coin', image: 'assets/images/lpodsolnuh.webp', income: 1},
        'lion': {name: 'Lion', price: 5000, currency: '$Daisy', image: 'assets/images/lion.webp', income: 10},
        'fish': {name: 'Fish', price: 5000, currency: '$Daisy', image: 'assets/images/fish.webp', income: 10}
    };

    function formatNumber(value) {
        if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
        if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
        if (value >= 1e3) return (value / 1e3).toFixed(1) + 'K';
        return value.toString();
    }

    function init() {
        document.getElementById('shop-btn').addEventListener('click', openShop);

        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                loadShopItems(tabName);
            });
        });

        const lastTab = localStorage.getItem('lastShopTab') || 'daisy';
        loadShopItems(lastTab);
        
        calculateIncomePerHour();
        document.getElementById('income-per-hour').textContent = formatNumber(incomePerHour);
        localStorage.setItem('incomePerHour', incomePerHour);
        
        setEquippedSkin();
    }

    function openShop() {
        const lastTab = localStorage.getItem('lastShopTab') || 'daisy';
        loadShopItems(lastTab);
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('data-tab') === lastTab) {
                tab.classList.add('active');
            }
        });
        Modal.open('shop-modal');
    }

    function loadShopItems(tabName) {
        const shopContent = document.getElementById('shop-content');
        shopContent.innerHTML = '';

        localStorage.setItem('lastShopTab', tabName);

        let items = [];
        for (let key in skinsData) {
            const skin = skinsData[key];
            if (tabName === 'daisy' && skin.currency === '$Daisy' && skin.price < 5000) {
                items.push({...skin, id: key});
            } else if (tabName === 'coin' && skin.currency === 'Coin') {
                items.push({...skin, id: key});
            } else if (tabName === 'premium' && skin.price >= 5000) {
                items.push({...skin, id: key});
            }
        }

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'skin-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                <div>${item.name}</div>
                <div class="skin-price">${formatNumber(item.price)} ${item.currency}</div>
                <div class="skin-level">${getSkinStatus(item.id)}</div>
            `;
            itemDiv.addEventListener('click', () => purchaseOrUpgradeItem(item));
            shopContent.appendChild(itemDiv);
        });
    }

    function getSkinStatus(skinId) {
        if (ownedSkins[skinId]) {
            if (ownedSkins[skinId].equipped) {
                return 'Установлено';
            } else {
                return `Уровень ${ownedSkins[skinId].level}`;
            }
        } else {
            return '';
        }
    }

    function purchaseOrUpgradeItem(item) {
        if (ownedSkins[item.id]) {
            showSkinOptions(item);
        } else {
            purchaseItem(item);
        }
    }

    function showSkinOptions(item) {
        const options = confirm(`Скин "${item.name}" уже куплен. Хотите улучшить уровень или установить его?\nOK - Улучшить\nОтмена - Установить`);
        if (options) {
            upgradeSkin(item);
        } else {
            applySkin(item.id);
            alert(`Скин "${item.name}" установлен.`);
            loadShopItems(document.querySelector('.shop-tab.active').getAttribute('data-tab'));
        }
    }

    function purchaseItem(item) {
        if ((item.currency === '$Daisy' && coins >= item.price) || (item.currency === 'Coin' && spinCoins >= item.price)) {
            if (item.currency === '$Daisy') {
                coins -= item.price;
                document.getElementById('coin-count').textContent = formatNumber(coins);
                localStorage.setItem('coins', coins);
            } else {
                spinCoins -= item.price;
                document.getElementById('spin-coin-count').textContent = formatNumber(spinCoins);
                localStorage.setItem('spinCoins', spinCoins);
            }
            ownedSkins[item.id] = {level: 1, equipped: false};
            localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
            calculateIncomePerHour();
            applySkin(item.id);
            loadShopItems(document.querySelector('.shop-tab.active').getAttribute('data-tab'));
            showSkinPurchaseModal(item.name);
        } else {
            alert('Недостаточно средств!');
        }
    }

    function upgradeSkin(item) {
        const skin = ownedSkins[item.id];
        if (skin.level >= 20) {
            alert('Максимальный уровень достигнут!');
            return;
        }
        const upgradeCost = calculateUpgradeCost(item, skin.level);
        if ((item.currency === '$Daisy' && coins >= upgradeCost) || (item.currency === 'Coin' && spinCoins >= upgradeCost)) {
            if (item.currency === '$Daisy') {
                coins -= upgradeCost;
                document.getElementById('coin-count').textContent = formatNumber(coins);
                localStorage.setItem('coins', coins);
            } else {
                spinCoins -= upgradeCost;
                document.getElementById('spin-coin-count').textContent = formatNumber(spinCoins);
                localStorage.setItem('spinCoins', spinCoins);
            }
            skin.level += 1;
            ownedSkins[item.id] = skin;
            localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
            calculateIncomePerHour();
            loadShopItems(document.querySelector('.shop-tab.active').getAttribute('data-tab'));
            alert(`Скин "${item.name}" улучшен до уровня ${skin.level}!`);
        } else {
            alert('Недостаточно средств для улучшения!');
        }
    }

    function calculateUpgradeCost(item, currentLevel) {
        // Формула увеличения стоимости с каждым уровнем
        return Math.floor(item.price * (currentLevel + 1) * 1.5);
    }

    function calculateIncomePerHour() {
        incomePerHour = 0;
        for (let skinId in ownedSkins) {
            const skin = ownedSkins[skinId];
            const skinData = skinsData[skinId];
            incomePerHour += skinData.income * skin.level;
        }
        // Используем форматирование перед обновлением
        document.getElementById('income-per-hour').textContent = formatNumber(incomePerHour);
        localStorage.setItem('incomePerHour', incomePerHour);
    }

    function applySkin(skinId) {
        // Снимаем предыдущий скин
        for (let id in ownedSkins) {
            ownedSkins[id].equipped = false;
        }
        // Устанавливаем новый скин
        ownedSkins[skinId].equipped = true;
        localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));

        const chamomile = document.getElementById('chamomile');
        chamomile.style.backgroundImage = `url('${skinsData[skinId].image}')`; // Устанавливаем фоновое изображение
    }
    
    function setEquippedSkin() {
        for (let skinId in ownedSkins) {
            if (ownedSkins[skinId].equipped) {
                const chamomile = document.getElementById('chamomile');
                chamomile.style.backgroundImage = `url('${skinsData[skinId].image}')`; // Устанавливаем фоновое изображение
                break;
            }
        }
    }

    function showSkinPurchaseModal(skinName) {
        const skinPurchaseModal = document.getElementById('skin-purchase-modal');
        skinPurchaseModal.style.display = 'flex';

        const giftAmount = Math.floor(Math.random() * 5) + 1; // Выдача 1-5 билетов
        document.getElementById('gift-amount').textContent = giftAmount;

        // Обновление баланса билетов
        let tickets = parseInt(document.getElementById('ticket-count').textContent, 10);
        tickets += giftAmount;
        document.getElementById('ticket-count').textContent = formatNumber(tickets); // Используем форматирование
        localStorage.setItem('tickets', tickets);
    }

    // Функции для обновления баланса из других модулей
    function updateBalance(newCoins, newSpinCoins) {
        coins = newCoins;
        spinCoins = newSpinCoins;
        document.getElementById('coin-count').textContent = formatNumber(coins); // Используем форматирование
        document.getElementById('spin-coin-count').textContent = formatNumber(spinCoins); // Используем форматирование
    }

    return {
        init,
        updateBalance
    };
})();
