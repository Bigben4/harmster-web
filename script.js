/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Reveal animations on scroll
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
    
    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    animatedElements.forEach(el => {
        appearOnScroll.observe(el);
    });

    // Cart Logic
    let cart = JSON.parse(localStorage.getItem('hamsterCart')) || [];
    const cartCountEl = document.getElementById('cart-count');
    
    function updateCartCount() {
        if(cartCountEl) {
            cartCountEl.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }
    updateCartCount();

    // Add to cart buttons
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.hamster-card');
            const id = card.dataset.id;
            const name = card.querySelector('.hamster-name').textContent;
            const priceText = card.querySelector('.price').textContent;
            const price = parseFloat(priceText.replace('$', ''));

            const existingItem = cart.find(item => item.id === id);
            if (existingItem) {
                alert('This specific hamster is already in your cart!');
            } else {
                cart.push({ id, name, price, quantity: 1 });
                localStorage.setItem('hamsterCart', JSON.stringify(cart));
                updateCartCount();
                
                // Button animation
                const originalText = e.target.textContent;
                e.target.textContent = 'Added!';
                e.target.style.backgroundColor = '#4CAF50';
                e.target.style.color = 'white';
                e.target.style.borderColor = '#4CAF50';
                
                setTimeout(() => {
                    e.target.textContent = originalText;
                    e.target.style.backgroundColor = '';
                    e.target.style.color = '';
                    e.target.style.borderColor = '';
                }, 2000);
            }
        });
    });

    // Mobile nav toggle
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.getElementById('menu-toggle');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navLinks.classList.contains('open')) {
                    navLinks.classList.remove('open');
                }
            });
        });
    }

    // Cart Modal
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCart = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');

    if(cartBtn && cartModal) {
        cartBtn.addEventListener('click', () => {
            renderCart();
            cartModal.classList.remove('hidden');
            // Fix the checkout button
            const checkoutBtn = cartModal.querySelector('.checkout-btn');
            if (checkoutBtn) {
                checkoutBtn.textContent = 'Go to Checkout Page';
                checkoutBtn.onclick = () => {
                    window.location.href = 'cart.html';
                };
            }
        });

        if(closeCart) {
            closeCart.addEventListener('click', () => {
                cartModal.classList.add('hidden');
            });
        }

        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === cartModal) {
                cartModal.classList.add('hidden');
            }
        });
    }

    function renderCart() {
        if(!cartItemsContainer) return;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const div = document.createElement('div');
                div.className = 'cart-item';
                div.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>$${item.price.toFixed(2)}</p>
                    </div>
                    <button class="cart-item-remove" data-index="${index}">Remove</button>
                `;
                cartItemsContainer.appendChild(div);
            });
        }

        if(cartTotalEl) {
            cartTotalEl.textContent = total.toFixed(2);
        }

        if (cart.length > 0) {
            // No need to add button here, it's fixed in the modal click
        }

        // Add remove listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = e.target.dataset.index;
                cart.splice(idx, 1);
                localStorage.setItem('hamsterCart', JSON.stringify(cart));
                updateCartCount();
                renderCart();
            });
        });
    }

    function renderCartPage() {
        const cartContent = document.getElementById('page-cart-items');
        const cartTotalPage = document.getElementById('page-cart-total');
        if (!cartContent || !cartTotalPage) return;

        cartContent.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartContent.innerHTML = '<p>Your cart is empty. Add hamsters from the catalog.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const itemRow = document.createElement('div');
                itemRow.className = 'cart-item';
                itemRow.style.marginBottom = '1rem';
                itemRow.innerHTML = `<strong>${item.name}</strong> - $${item.price.toFixed(2)} <button class="cart-item-remove" data-index="${index}">Remove</button>`;
                cartContent.appendChild(itemRow);
            });

            document.querySelectorAll('.cart-item-remove').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = Number(e.target.dataset.index);
                    cart.splice(idx, 1);
                    localStorage.setItem('hamsterCart', JSON.stringify(cart));
                    updateCartCount();
                    renderCartPage();
                });
            });
        }

        cartTotalPage.textContent = total.toFixed(2);
    }

    // Contact form
    const form = document.getElementById('contact-form');
    if(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for contacting us! We will get back to you soon.');
            form.reset();
        });
    }

    // Smooth scroll for nav links targeting sections on the same page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if(target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Cart page (checkout form with WhatsApp order link)
    const cartPage = document.getElementById('checkout-cart');
    if (cartPage) {
        renderCartPage();

        const deliveryForm = document.getElementById('delivery-form');
        deliveryForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('delivery-name').value.trim();
            const phone = document.getElementById('delivery-phone').value.trim();
            const address = document.getElementById('delivery-address').value.trim();
            const note = document.getElementById('delivery-note').value.trim();

            if (!name || !phone || !address) {
                alert('Please fill in your name, phone, and address.');
                return;
            }

            const cartString = cart.map(item => `- ${item.name} ($${item.price.toFixed(2)})`).join('\n');
            const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
            const whatsappNumber = '237671807750'; // Use full business number with country code, e.g. 671807750
            let messageText = `Hello, I would like to order from Happy Paws Hamstery.\n\n`;
            messageText += `Customer name: ${name}\n`;
            messageText += `Phone: ${phone}\n`;
            messageText += `Address: ${address}\n`;
            if (note) messageText += `Note: ${note}\n`;
            messageText += `\nCart items:\n${cartString}\n\nTotal: $${total}`;

            const encodedText = encodeURIComponent(messageText);
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedText}`;
            window.open(whatsappUrl, '_blank');
        });
    }
});
