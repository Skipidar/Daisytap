// shop.js
const Shop = (function() {
    let coins = 10000; // Начальное количество $Daisy для тестирования
    let spinCoins = 10000; // Начальное количество Coin для тестирования
    let skins = [];

    function init() {
        // Инициализация кнопки магазина (пока скрываем кнопку, если она не нужна)
        // document.getElementById('shop-btn').addEventListener('click', openShop);

        // Инициализация вкладок магазина
        document.querySelectorAll('.shop-tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                loadShopItems(tabName);
            });
        });

        // Загрузка сохранённых данных скинов
        const savedSkins = JSON.parse(localStorage.getItem('skins'));
        if (savedSkins) {
            skins = savedSkins;
        } else {
            // Инициализируем скины, если данных нет
            skins = [
                {
                    name: 'Chamomile',
                    level: 1,
                    maxLevel: 20,
                    basePrice: 100,
                    profitPerHour: 10,
                    image: 'assets/images/chamomile.webp',
                    installed: true
                },
                // Добавьте остальные скины
            ];
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
        shopContent.innerHTML = '';

        let items = [];
        if (tabName === 'daisy') {
            items = skins.filter(skin => skin.basePrice > 0);
        } else if (tabName === 'coin') {
            // Добавьте скины, доступные за Coin
        } else if (tabName === 'premium') {
            // Добавьте премиум-скины
        }

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'skin-item';
            itemDiv.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="shop-item-image">
                <div>${item.name} (Уровень ${item.level}/${item.maxLevel})</div>
                <div class="skin-price">${item.basePrice * item.level} $Daisy</div>
                <div class="skin-profit">Прибыль: ${item.profitPerHour * item.level} Coin/час</div>
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
            // Сохраните уровень скина в localStorage
            localStorage.setItem('skins', JSON.stringify(skins));
            loadShopItems('daisy'); // Обновите отображение магазина
        } else {
            alert('Недостаточно средств или максимальный уровень достигнут!');
        }
    }

    function applySkin(skinImage) {
        const chamomile = document.getElementById('chamomile');
        chamomile.src = skinImage;
    }

    // Функции для обновления баланса
    function updateBalance() {
        document.getElementById('coin-count').textContent = coins;
        document.getElementById('spin-coin-count').textContent = spinCoins;
        localStorage.setItem('coins', coins);
        localStorage.setItem('spinCoins', spinCoins);
    }

    // Начисление прибыли в час
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

    // Запуск таймера прибыли при загрузке
    startIncomeTimer();

    return {
        init,
        updateBalance
    };
})();
