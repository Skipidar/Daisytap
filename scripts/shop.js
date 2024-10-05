// scripts/shop.js
const Shop = (function() {
    let coins = parseInt(localStorage.getItem('coins')) || 10000;
    let spinCoins = parseInt(localStorage.getItem('spinCoins')) || 10000;
    let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins')) || {'chamomile': {level: 1, equipped: true}}; // Chamomile is equipped by default
    let incomePerHour = parseInt(localStorage.getItem('incomePerHour')) || 0;

    const skinsData = {
        // Skins available in the shop
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

    function init() {
        // Initialize shop button
        const shopButton = document.getElementById('shop-btn');
        if (shopButton) {
            shopButton.addEventListener('click', openShop);
        } else {
            console.error('Element with id="shop-btn" not found in DOM.');
        }

        // Initialize shop tabs
        const shopTabs = document.querySelectorAll('.shop-tab');
        shopTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                shopTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                const tabName = this.getAttribute('data-tab');
                loadShopItems(tabName);
            });
        });

        // Update passive income
        calculateIncomePerHour();
        const incomeElement = document.getElementById('income-per-hour');
        if (incomeElement) {
            incomeElement.textContent = incomePerHour;
        }

        localStorage.setItem('incomePerHour', incomePerHour);

        // Set equipped skin
        setEquippedSkin();
    }

    function openShop() {
        loadShopItems('daisy');
        Modal.open('shop-modal');
    }

    function loadShopItems(tabName) {
        const shopContent = document.getElementById('shop-content');
        if (!shopContent) {
            console.error('Element with id="shop-content" not found in DOM.');
            return;
        }
        shopContent.innerHTML = '';

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
                <div class="skin-name">${item.name}</div>
                <div class="skin-price">${item.price} ${item.currency}</div>
                <div class="skin-income">${item.income}/час</div>
                <div class="skin-level">${getSkinStatus(item.id)}</div>
                <div class="action-buttons">
                    ${ownedSkins[item.id] ? `
                        <button class="upgrade-btn" data-skin-id="${item.id}" data-localize="upgrade">Upgrade</button>
                        <button class="equip-btn" data-skin-id="${item.id}" data-localize="equip_skin">Equip Skin</button>
                    ` : ''}
                </div>
            `;
            itemDiv.addEventListener('click', (event) => {
                // Prevent click from triggering when clicking on buttons
                if (event.target.classList.contains('upgrade-btn') || event.target.classList.contains('equip-btn')) {
                    return;
                }
                purchaseOrUpgradeItem(item);
            });

            // Add event listeners for upgrade and equip buttons
            const upgradeBtn = itemDiv.querySelector('.upgrade-btn');
            if (upgradeBtn) {
                upgradeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const skinId = upgradeBtn.getAttribute('data-skin-id');
                    const skin = skinsData[skinId];
                    upgradeSkin(skin);
                });
            }

            const equipBtn = itemDiv.querySelector('.equip-btn');
            if (equipBtn) {
                equipBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const skinId = equipBtn.getAttribute('data-skin-id');
                    applySkin(skinId);
                    alert(Localization.getTranslation('skin_equipped', skinId));
                });
            }

            shopContent.appendChild(itemDiv);
        });
    }

    function getSkinStatus(skinId) {
        if (ownedSkins[skinId]) {
            if (ownedSkins[skinId].equipped) {
                return Localization.getTranslation('skin_equipped_status'); // "Equipped" / "Установлено"
            } else {
                return `${Localization.getTranslation('skin_level')}: ${ownedSkins[skinId].level}`; // "Level: X" / "Уровень: X"
            }
        } else {
            return '';
        }
    }

    function purchaseOrUpgradeItem(item) {
        if (ownedSkins[item.id]) {
            // If skin is already purchased, do nothing here since buttons handle actions
            return;
        } else {
            // Else, prompt to purchase
            purchaseItem(item);
        }
    }

    function purchaseItem(item) {
        if ((item.currency === '$Daisy' && coins >= item.price) || (item.currency === 'Coin' && spinCoins >= item.price)) {
            if (item.currency === '$Daisy') {
                coins -= item.price;
                const coinCountElement = document.getElementById('coin-count');
                if (coinCountElement) {
                    coinCountElement.textContent = coins;
                }
                localStorage.setItem('coins', coins);
            } else {
                spinCoins -= item.price;
                const spinCoinCountElement = document.getElementById('spin-coin-count');
                if (spinCoinCountElement) {
                    spinCoinCountElement.textContent = spinCoins;
                }
                localStorage.setItem('spinCoins', spinCoins);
            }
            ownedSkins[item.id] = {level: 1, equipped: false};
            localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
            calculateIncomePerHour();
            loadShopItems(document.querySelector('.shop-tab.active').getAttribute('data-tab'));
            showSkinPurchaseModal(item.name);
        } else {
            alert(Localization.getTranslation('insufficient_funds'));
        }
    }

    function upgradeSkin(item) {
        const skin = ownedSkins[item.id];
        if (skin.level >= 20) {
            alert(Localization.getTranslation('max_level_reached'));
            return;
        }
        const upgradeCost = calculateUpgradeCost(item, skin.level);
        if ((item.currency === '$Daisy' && coins >= upgradeCost) || (item.currency === 'Coin' && spinCoins >= upgradeCost)) {
            if (item.currency === '$Daisy') {
                coins -= upgradeCost;
                const coinCountElement = document.getElementById('coin-count');
                if (coinCountElement) {
                    coinCountElement.textContent = coins;
                }
                localStorage.setItem('coins', coins);
            } else {
                spinCoins -= upgradeCost;
                const spinCoinCountElement = document.getElementById('spin-coin-count');
                if (spinCoinCountElement) {
                    spinCoinCountElement.textContent = spinCoins;
                }
                localStorage.setItem('spinCoins', spinCoins);
            }
            skin.level += 1;
            ownedSkins[item.id] = skin;
            localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));
            calculateIncomePerHour();
            loadShopItems(document.querySelector('.shop-tab.active').getAttribute('data-tab'));
            alert(`${Localization.getTranslation('skin_upgraded')} ${item.name} ${Localization.getTranslation('to_level')} ${skin.level}!`);
        } else {
            alert(Localization.getTranslation('insufficient_funds_for_upgrade'));
        }
    }

    function calculateUpgradeCost(item, currentLevel) {
        // Formula for increasing cost with each level
        return Math.floor(item.price * (currentLevel + 1) * 1.5);
    }

    function calculateIncomePerHour() {
        incomePerHour = 0;
        for (let skinId in ownedSkins) {
            const skin = ownedSkins[skinId];
            const skinData = skinsData[skinId];
            incomePerHour += skinData.income * skin.level;
        }
        const incomeElement = document.getElementById('income-per-hour');
        if (incomeElement) {
            incomeElement.textContent = incomePerHour;
        }
        localStorage.setItem('incomePerHour', incomePerHour);
    }

    function applySkin(skinId) {
        // Unequip all skins
        for (let id in ownedSkins) {
            ownedSkins[id].equipped = false;
        }
        // Equip the selected skin
        ownedSkins[skinId].equipped = true;
        localStorage.setItem('ownedSkins', JSON.stringify(ownedSkins));

        const chamomile = document.getElementById('chamomile');
        if (chamomile) {
            chamomile.src = skinsData[skinId].image;
        } else {
            console.error('Element with id="chamomile" not found in DOM.');
        }
    }

    function setEquippedSkin() {
        for (let skinId in ownedSkins) {
            if (ownedSkins[skinId].equipped) {
                const chamomile = document.getElementById('chamomile');
                if (chamomile) {
                    chamomile.src = skinsData[skinId].image;
                }
                break;
            }
        }
    }

    function showSkinPurchaseModal(skinName) {
        const skinPurchaseModal = document.getElementById('skin-purchase-modal');
        if (!skinPurchaseModal) {
            console.error('Element with id="skin-purchase-modal" not found in DOM.');
            return;
        }
        skinPurchaseModal.style.display = 'flex';

        const giftAmountElement = document.getElementById('gift-amount');
        if (giftAmountElement) {
            giftAmountElement.textContent = skinName;
        }

        // Update text in the modal
        const congratulationsElement = skinPurchaseModal.querySelector('h2');
        if (congratulationsElement) {
            congratulationsElement.textContent = Localization.getTranslation('congratulations_purchase', skinName);
        }

        const yourGiftElement = skinPurchaseModal.querySelector('p');
        if (yourGiftElement) {
            yourGiftElement.innerHTML = Localization.getTranslation('your_gift', { skinName });
        }
    }

    // Functions to update balance from other modules
    function updateBalance(newCoins, newSpinCoins) {
        coins = newCoins;
        spinCoins = newSpinCoins;
        const coinCountElement = document.getElementById('coin-count');
        if (coinCountElement) {
            coinCountElement.textContent = coins;
        }
        const spinCoinCountElement = document.getElementById('spin-coin-count');
        if (spinCoinCountElement) {
            spinCoinCountElement.textContent = spinCoins;
        }
    }

    return {
        init,
        updateBalance
    };
})();

document.addEventListener('DOMContentLoaded', Shop.init);
