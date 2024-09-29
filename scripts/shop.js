const Shop = (function() {
    let coins = 200; // Начальное количество $Daisy
    let spinCoins = 0;

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
            items = [
                { name: 'Bubble', price: 100, image: 'assets/images/bubble.webp' },
                { name: 'Rose', price: 200, image: 'assets/images/Rose.webp' },
                { name: 'Pizza', price: 300, image: 'assets/images/pizza.webp' },
                { name: 'Pechenka', price: 400, image: 'assets/images/Pechenka.webp' },
                { name: 'Panda', price: 500, image: 'assets/images/panda.webp' },
                { name: 'Luna', price: 600, image: 'assets/images/luna.webp' }
            ];
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
                <div>${item.name}</div>
                <div class="skin-price">${item.price} ${tabName === 'coin' ? 'Coin' : '$Daisy'}</div>
            `;
            itemDiv.addEventListener('click', () => purchaseItem(item, tabName));
            shopContent.appendChild(itemDiv);
        });
    }

    function purchaseItem(item, tabName) {
        const coinCount = document.getElementById('coin-count');
        const spinCoinCount = document.getElementById('spin-coin-count');

        if ((tabName === 'daisy' && coins >= item.price) || (tabName === 'coin' && spinCoins >= item.price)) {
            if (tabName === 'daisy') {
                coins -= item.price;
                coinCount.textContent = coins;
            } else {
                spinCoins -= item.price;
                spinCoinCount.textContent = spinCoins;
            }
            applySkin(item.image);
            showSkinPurchaseModal(item.name);
        } else {
            alert('Недостаточно средств!');
        }
    }

    function applySkin(skinImage) {
        const chamomile = document.getElementById('chamomile');
        chamomile.src = skinImage;
    }

    function showSkinPurchaseModal(skinName) {
        const skinPurchaseModal = document.getElementById('skin-purchase-modal');
        skinPurchaseModal.style.display = 'flex';

        const giftAmount = Math.floor(Math.random() * 5) + 1; // Выдача 1-5 билетов
        document.getElementById('gift-amount').textContent = giftAmount;

        let tickets = parseInt(document.getElementById('ticket-count').textContent, 10);
        tickets += giftAmount;
        document.getElementById('ticket-count').textContent = tickets;
    }

    return {
        init
    };
})();
