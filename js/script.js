document.addEventListener('DOMContentLoaded', () => {
    const cart = {};
    const cartContainer = document.querySelector('.cart-items-container');
    const cartTotalDisplay = document.createElement('div');
    const checkoutButton = document.createElement('a');
    const cartButton = document.querySelector('#cart-btn');

    cartTotalDisplay.classList.add('cart-total');
    checkoutButton.classList.add('btn');
    checkoutButton.textContent = 'Checkout Now';
    
    // Define your URL map
    const urlMap = {
        '0-0-0-0': 'https://www.example.com/checkout?product1=0&product2=0&product3=0&product4=0',
        '1-0-0-0': 'https://www.example.com/checkout?product1=1&product2=0&product3=0&product4=0',
        // Add all necessary combinations
        '10-10-10-10': 'https://www.example.com/checkout?product1=10&product2=10&product3=10&product4=10'
    };

    function generateCartKey(cart) {
        const products = ['product1', 'product2', 'product3', 'product4'];
        const quantities = products.map(id => (cart[id] ? cart[id].quantity : 0));
        return quantities.join('-'); // Generate a key like '1-0-0-0'
    }

    function getCheckoutURL(cart) {
        const key = generateCartKey(cart);
        return urlMap[key] || 'https://www.example.com/checkout'; // Fallback URL
    }

    checkoutButton.addEventListener('click', () => {
        const checkoutURL = getCheckoutURL(cart);
        window.location.href = checkoutURL; // Redirect to the selected URL
    });

    // Add a click event to toggle the cart visibility
    cartButton.addEventListener('click', () => {
        cartContainer.classList.toggle('active');
    });

    document.querySelectorAll('.btn-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-product-id');
            const productElement = e.target.closest('.product');
            const productName = productElement.querySelector('h3').innerText;
            const productPrice = parseInt(productElement.querySelector('p').innerText.replace('$', '').replace('.', ''));
            const productImg = productElement.querySelector('img').src;

            if (cart[productId]) {
                delete cart[productId];
                e.target.textContent = 'Añadir al Carrito';
            } else {
                cart[productId] = {
                    name: productName,
                    price: productPrice,
                    img: productImg,
                    quantity: 1
                };
                e.target.textContent = 'Eliminar del Carrito';
            }

            renderCartItems();

            // Open cart container automatically when a product is added
            cartContainer.classList.add('active');
        });
    });

    function renderCartItems() {
        cartContainer.innerHTML = ''; // Clear existing items

        for (const id in cart) {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <span class="fas fa-times" data-id="${id}"></span>
                <img src="${cart[id].img}" alt="">
                <div class="content">
                    <h3 style="font-size: 18px;">${cart[id].name}</h3>
                    <div class="price">$${cart[id].price.toLocaleString()}</div>
                    <div class="quantity">
                        <button class="quantity-btn" data-id="${id}" data-action="decrease" style="font-size: 18px;">-</button>
                        <span style="font-size: 18px;">${cart[id].quantity}</span>
                        <button class="quantity-btn" data-id="${id}" data-action="increase" style="font-size: 18px;">+</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(cartItem);
        }

        // Update and display cart total
        updateCartTotal();

        // Append the total display and checkout button to the cart
        cartContainer.appendChild(cartTotalDisplay);
        cartContainer.appendChild(checkoutButton);

        // Add event listeners to the remove buttons
        document.querySelectorAll('.cart-item .fa-times').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                delete cart[productId];
                document.querySelector(`.btn-cart[data-product-id="${productId}"]`).textContent = 'Añadir al Carrito';
                renderCartItems();
            });
        });

        // Add event listeners to the quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-id');
                const action = e.target.getAttribute('data-action');

                if (action === 'increase' && cart[productId].quantity < 10) {
                    cart[productId].quantity += 1;
                } else if (action === 'decrease' && cart[productId].quantity > 1) {
                    cart[productId].quantity -= 1;
                }

                renderCartItems();
            });
        });
    }

    function updateCartTotal() {
        let total = 0;

        for (const id in cart) {
            total += cart[id].price * cart[id].quantity;
        }

        cartTotalDisplay.textContent = `Total: $${total.toLocaleString()}`;
    }
});
