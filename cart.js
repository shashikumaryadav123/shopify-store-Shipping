// Cart state management
let cart = JSON.parse(localStorage.getItem('zenSpaceCart')) || [];

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartUI();
    alert(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartUI();
}

function updateQuantity(productId, delta) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('zenSpaceCart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.forEach(el => el.textContent = totalItems);
}

function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 50px;">Your cart is currently empty.</p>';
        document.getElementById('cart-total').textContent = '$0.00';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div class="cart-item" style="display: flex; gap: 1.5rem; padding: 1.5rem 0; border-bottom: 1px solid #eee; align-items: center;">
                <div style="width: 80px; height: 80px; background-image: url('${item.image}'); background-size: cover; border-radius: 8px;"></div>
                <div style="flex: 1;">
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${item.name}</h3>
                    <p style="color: var(--text-muted);">$${item.price.toFixed(2)}</p>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid #ddd; padding: 0.3rem 0.5rem; border-radius: 6px;">
                    <button onclick="updateQuantity('${item.id}', -1)" style="border: none; background: none; cursor: pointer;">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity('${item.id}', 1)" style="border: none; background: none; cursor: pointer;">+</button>
                </div>
                <div style="text-align: right; min-width: 80px;">
                    <p style="font-weight: 600;">$${itemTotal.toFixed(2)}</p>
                    <button onclick="removeFromCart('${item.id}')" style="font-size: 0.75rem; color: #888; background: none; border: none; cursor: pointer; text-decoration: underline;">Remove</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    renderCart();
});
