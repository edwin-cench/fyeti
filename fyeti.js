(function() {
    let cart = JSON.parse(localStorage.getItem('alqa_cart')) || [];
    let currentFormData = null;

    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }

    let currentItemName = '';
    window.openModal = function(itemName) {
        currentItemName = itemName;
        document.getElementById('modalItemName').innerText = 'Add to quote: ' + itemName;
        document.getElementById('modalQuantity').value = 1;
        document.getElementById('modalNote').value = '';
        document.getElementById('cartModal').classList.add('active');
    };

    window.closeModal = function() {
        document.getElementById('cartModal').classList.remove('active');
    };

    window.confirmAddToCart = function() {
        const qty = parseInt(document.getElementById('modalQuantity').value) || 1;
        const note = document.getElementById('modalNote').value || '—';
        cart.push({ name: currentItemName, quantity: qty, note: note });
        saveCart();
        closeModal();
    };

    function saveCart() { localStorage.setItem('alqa_cart', JSON.stringify(cart)); updateCartDisplay(); }

    window.removeFromQuote = function(index) { cart.splice(index, 1); saveCart(); };

    window.clearQuote = function() { if (confirm('Remove all items?')) { cart = []; saveCart(); } };

    function updateCartDisplay() {
        const list = document.getElementById('quote-list');
        const area = document.getElementById('quote-area');
        const floatCart = document.getElementById('cart-float');
        const cartCount = document.getElementById('cart-count');
        const sideCount = document.getElementById('sidebar-cart-count');
        const navCount = document.getElementById('nav-cart-count');
        const navCountMobile = document.getElementById('nav-cart-count-mobile');
        const totalSpan = document.getElementById('quote-total');
        if (!list) return;

        list.innerHTML = '';
        if (cart.length === 0) {
            area.style.display = 'none';
            floatCart.style.display = 'none';
            sideCount.innerText = '0';
            if (navCount) navCount.innerText = '0';
            if (navCountMobile) navCountMobile.innerText = '0';
            return;
        }
        area.style.display = 'block';
        floatCart.style.display = 'block';
        cartCount.innerText = cart.length;
        sideCount.innerText = cart.length;
        if (navCount) navCount.innerText = cart.length;
        if (navCountMobile) navCountMobile.innerText = cart.length;

        let totalItems = 0;
        cart.forEach((item, idx) => {
            totalItems += item.quantity;
            const row = document.createElement('div');
            row.className = 'quote-row';
            row.innerHTML = `<div class="quote-details"><span class="quote-name">${item.name}</span><span class="quote-note">${item.note}</span></div>
                             <div style="display:flex; align-items:center; gap:15px;"><span class="quote-qty">x${item.quantity}</span><span class="remove-btn" onclick="removeFromQuote(${idx})">✕</span></div>`;
            list.appendChild(row);
        });
        totalSpan.innerText = `Total items: ${totalItems}`;
    }

    window.sendWhatsAppBusiness = function() {
        const phone = '254794851212';
        let msg = 'Hello alQa Brands, I would like a quote for:\n';
        if (cart.length) {
            cart.forEach(i => { msg += `🔹 ${i.name}  x${i.quantity}  (${i.note})\n`; });
        } else {
            msg += '🔹 Please send me more information about your services.';
        }
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    window.closeChannelModal = function() {
        document.getElementById('channelModal').classList.remove('active');
    };

    window.handleFormSubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const name = form.querySelector('input[placeholder="John Kimani"]').value;
        const company = form.querySelector('input[placeholder="Your Business Ltd"]').value;
        const email = form.querySelector('input[type="email"]').value;
        const service = form.querySelector('select').value;
        const message = form.querySelector('textarea').value;

        currentFormData = { name, company, email, service, message };
        document.getElementById('channelModal').classList.add('active');
    };

    window.sendViaWhatsApp = function() {
        if (!currentFormData) return;
        const { name, company, email, service, message } = currentFormData;
        const phone = '254794851212';
        let whatsappMsg = `New inquiry from ${name} (${company}, ${email})\n`;
        whatsappMsg += `Service: ${service}\nMessage: ${message}\n\n`;
        if (cart.length > 0) {
            whatsappMsg += 'Quote items:\n';
            cart.forEach(i => { whatsappMsg += `🔹 ${i.name} x${i.quantity} (${i.note})\n`; });
        }
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
        document.getElementById('contactForm').reset();
        closeChannelModal();
        showToast('Thank you for contacting us! We\'ll reach back within 24 hours.');
    };

    window.sendViaEmail = function() {
        if (!currentFormData) return;
        const { name, company, email, service, message } = currentFormData;
        const recipient = 'alqabrandscreations@gmail.com';
        let subject = `Inquiry from ${name} (${company})`;
        let body = `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nService: ${service}\nMessage: ${message}\n\n`;
        if (cart.length > 0) {
            body += 'Quote items:\n';
            cart.forEach(i => { body += `- ${i.name} x${i.quantity} (${i.note})\n`; });
        }
        window.open(`mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, '_blank');
        document.getElementById('contactForm').reset();
        closeChannelModal();
        showToast('Thank you for contacting us! We\'ll reach back within 24 hours.');
    };

    // ========== THEME TOGGLE ==========
    window.toggleTheme = function() {
        const html = document.documentElement;
        const current = html.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);

        const mobileBtn = document.getElementById('theme-btn-mobile');
        const desktopBtn = document.getElementById('theme-btn-desktop');
        const newIcon = next === 'light' ? '🌙' : '☀️';
        if (mobileBtn) mobileBtn.innerText = newIcon;
        if (desktopBtn) desktopBtn.innerText = newIcon;
    };

    // Apply saved theme on load
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    const initialIcon = savedTheme === 'light' ? '🌙' : '☀️';
    const mobileBtn = document.getElementById('theme-btn-mobile');
    const desktopBtn = document.getElementById('theme-btn-desktop');
    if (mobileBtn) mobileBtn.innerText = initialIcon;
    if (desktopBtn) desktopBtn.innerText = initialIcon;

    // ========== SIDEBAR & DROPDOWNS ==========
    window.openNav = function() { document.getElementById('mySidebar').style.left = '0'; document.getElementById('overlay').style.display = 'block'; };
    window.closeNav = function() { document.getElementById('mySidebar').style.left = '-300px'; document.getElementById('overlay').style.display = 'none'; };

    document.querySelectorAll('.dropdown-btn').forEach(btn => {
        btn.addEventListener('click', function() { this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'block' ? 'none' : 'block'; });
    });

    // ========== CAROUSEL INIT ==========
    const carousels = {
        design: { index: 0, slides: document.querySelectorAll('#carousel-design .carousel-slide'), container: document.querySelector('#carousel-design .carousel-slides'), dotsContainer: document.getElementById('dots-design') },
        branding: { index: 0, slides: document.querySelectorAll('#carousel-branding .carousel-slide'), container: document.querySelector('#carousel-branding .carousel-slides'), dotsContainer: document.getElementById('dots-branding') },
        printing: { index: 0, slides: document.querySelectorAll('#carousel-printing .carousel-slide'), container: document.querySelector('#carousel-printing .carousel-slides'), dotsContainer: document.getElementById('dots-printing') }
    };

    function updateCarousel(name) {
        const c = carousels[name];
        if (!c || !c.container) return;
        c.container.style.transform = `translateX(-${c.index * 100}%)`;
        if (c.dotsContainer) {
            const dots = c.dotsContainer.children;
            for (let i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === c.index);
            }
        }
    }

    window.changeSlide = function(name, direction) {
        const c = carousels[name];
        if (!c) return;
        c.index = (c.index + direction + c.slides.length) % c.slides.length;
        updateCarousel(name);
    };

    function goToSlide(name, slideIndex) {
        const c = carousels[name];
        if (!c) return;
        c.index = slideIndex;
        updateCarousel(name);
    }

    for (let [name, c] of Object.entries(carousels)) {
        if (c.dotsContainer) {
            for (let i = 0; i < c.slides.length; i++) {
                const dot = document.createElement('span');
                dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
                dot.addEventListener('click', () => goToSlide(name, i));
                c.dotsContainer.appendChild(dot);
            }
        }
        setInterval(() => {
            c.index = (c.index + 1) % c.slides.length;
            updateCarousel(name);
        }, 5000);
    }

    // ========== INIT CART DISPLAY ==========
    updateCartDisplay();

    // ========== MODAL CLICK OUTSIDE ==========
    document.getElementById('cartModal').addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.getElementById('channelModal').addEventListener('click', function(e) {
        if (e.target === this) closeChannelModal();
    });

    // ========== LOADING SCREEN ==========
    function hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen && loadingScreen.style.display !== 'none') {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }
    }

    document.addEventListener('DOMContentLoaded', hideLoadingScreen);
    window.addEventListener('load', hideLoadingScreen);
    setTimeout(hideLoadingScreen, 1500);
})();