/**
 * Aromansa Shopping Cart & QRIS Checkout System
 * Clean, lightweight, anti-slop implementation
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'aromansa_cart';
    const CHECKOUT_STATE_KEY = 'aromansa_active_checkout_v1';
    const QRIS_IMAGE_PATH = 'img/qris-aromansa.png';
    const QRIS_NMID = 'ID1025428805408';
    const WA_ADMIN = '6285782909266';

    // Intercept Live Server reload WebSocket message if active checkout is open
    // This prevents VS Code Live Server from abruptly reloading the page when an order is written to disk
    if (typeof window !== 'undefined' && window.WebSocket) {
        try {
            const NativeWebSocket = window.WebSocket;
            window.WebSocket = function (...args) {
                const ws = new NativeWebSocket(...args);
                const originalAddEventListener = ws.addEventListener.bind(ws);

                ws.addEventListener = function (type, listener, options) {
                    if (type === 'message') {
                        const wrappedListener = function (event) {
                            if (event && event.data === 'reload') {
                                const modal = document.getElementById('checkout-modal-wrapper');
                                if (modal && modal.classList.contains('is-open')) {
                                    console.warn('[LiveServer Reload Suppressed] Checkout modal is currently open.');
                                    return;
                                }
                            }
                            return listener.apply(this, arguments);
                        };
                        return originalAddEventListener(type, wrappedListener, options);
                    }
                    return originalAddEventListener(type, listener, options);
                };

                let onMsg = null;
                Object.defineProperty(ws, 'onmessage', {
                    get() { return onMsg; },
                    set(fn) {
                        if (typeof fn === 'function') {
                            onMsg = function (event) {
                                if (event && event.data === 'reload') {
                                    const modal = document.getElementById('checkout-modal-wrapper');
                                    if (modal && modal.classList.contains('is-open')) {
                                        console.warn('[LiveServer Reload Suppressed] Checkout modal is currently open.');
                                        return;
                                    }
                                }
                                return fn.apply(this, arguments);
                            };
                        } else {
                            onMsg = fn;
                        }
                    }
                });

                return ws;
            };
            window.WebSocket.prototype = NativeWebSocket.prototype;
        } catch (e) {
            console.warn('Could not wrap WebSocket for Live Server reload protection:', e);
        }
    }

    function getApiBaseUrl() {
        if (typeof window !== 'undefined') {
            const { protocol, hostname, port } = window.location;
            if (protocol === 'file:') return 'http://localhost:3000';
            if (hostname === 'localhost' || hostname === '127.0.0.1') {
                if (port && port !== '3000') {
                    return `http://${hostname}:3000`;
                }
            }
        }
        return '';
    }

    let cart = [];
    let activeOrderId = null;
    let activeOrderData = null;
    let selectedProofBase64 = null;

    function saveActiveCheckout(orderId, orderData, step) {
        try {
            sessionStorage.setItem(CHECKOUT_STATE_KEY, JSON.stringify({
                orderId: orderId,
                orderData: orderData,
                step: step || 2,
                savedAt: Date.now()
            }));
        } catch (e) {
            console.warn('Could not save active checkout:', e);
        }
    }

    function clearActiveCheckout() {
        try {
            sessionStorage.removeItem(CHECKOUT_STATE_KEY);
        } catch (e) {
            console.warn('Could not clear active checkout:', e);
        }
    }

    function restoreActiveCheckoutIfAny() {
        try {
            const raw = sessionStorage.getItem(CHECKOUT_STATE_KEY);
            if (!raw) return;
            const state = JSON.parse(raw);
            if (!state || !state.orderId || !state.orderData) return;

            // Expire after 3 hours
            if (Date.now() - (state.savedAt || 0) > 3 * 60 * 60 * 1000) {
                clearActiveCheckout();
                return;
            }

            activeOrderId = state.orderId;
            activeOrderData = state.orderData;

            if (state.step === 3) {
                renderCheckoutStep3();
            } else {
                renderCheckoutStep2();
            }

            const modalWrapper = document.getElementById('checkout-modal-wrapper');
            if (modalWrapper) {
                modalWrapper.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }
        } catch (e) {
            console.warn('Could not restore checkout state:', e);
        }
    }

    // Sanitize price (heals legacy values that absorbed "10ml" or "100ml", e.g. 6500010 -> 65000)
    function sanitizePrice(price) {
        let p = parseInt(price, 10) || 50000;
        if (p > 500000) {
            const s = String(p);
            if (s.endsWith('100')) {
                p = parseInt(s.slice(0, -3), 10) || 45000;
            } else if (s.endsWith('10')) {
                p = parseInt(s.slice(0, -2), 10) || 55000;
            } else {
                p = Math.round(p / 100);
            }
        }
        return p;
    }

    // Load cart from storage
    function loadCart() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            cart = raw ? JSON.parse(raw) : [];
            if (!Array.isArray(cart)) cart = [];
            // Auto-heal prices and quantities
            let changed = false;
            cart.forEach(item => {
                const cleanP = sanitizePrice(item.price);
                if (cleanP !== item.price) {
                    item.price = cleanP;
                    changed = true;
                }
                item.quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
            });
            if (changed) {
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch(_) {}
            }
        } catch (_) {
            cart = [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch (_) {}
        updateBadges();
    }

    function formatRupiah(number) {
        return 'Rp' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }

    // Public API
    window.aromansaCart = {
        addItem: function (item) {
            if (!item || !item.id) return;
            const existing = cart.find(i => i.id === item.id);
            if (existing) {
                existing.quantity += (item.quantity || 1);
            } else {
                cart.push({
                    id: String(item.id),
                    name: String(item.name || 'Produk Aromansa'),
                    size: String(item.size || '10ml'),
                    price: sanitizePrice(item.price),
                    quantity: parseInt(item.quantity, 10) || 1,
                    image: String(item.image || '')
                });
            }
            saveCart();
            renderDrawerItems();
            window.aromansaCart.showToast(`${item.name} ditambahkan ke keranjang`);
        },

        removeItem: function (id) {
            cart = cart.filter(i => i.id !== id);
            saveCart();
            renderDrawerItems();
        },

        updateQty: function (id, delta) {
            const item = cart.find(i => i.id === id);
            if (!item) return;
            item.quantity += delta;
            if (item.quantity <= 0) {
                window.aromansaCart.removeItem(id);
            } else {
                saveCart();
                renderDrawerItems();
            }
        },

        clearCart: function () {
            cart = [];
            saveCart();
            renderDrawerItems();
        },

        getItemCount: function () {
            return cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        getTotal: function () {
            return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        },

        openCart: function () {
            const waDropup = document.querySelector('.aromansa-dropup.active');
            if (waDropup) waDropup.classList.remove('active');
            const waFab = document.querySelector('.aromansa-fab-trigger.active');
            if (waFab) waFab.classList.remove('active');

            renderDrawerItems();
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-backdrop');
            if (drawer && backdrop) {
                backdrop.classList.add('is-active');
                drawer.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }
        },

        closeCart: function () {
            const drawer = document.getElementById('cart-drawer');
            const backdrop = document.getElementById('cart-backdrop');
            if (drawer && backdrop) {
                drawer.classList.remove('is-open');
                backdrop.classList.remove('is-active');
                document.body.style.overflow = '';
            }
        },

        openCheckout: function () {
            window.aromansaCart.closeCart();
            if (activeOrderId && activeOrderData && activeOrderData.status === 'pending_payment') {
                renderCheckoutStep2();
            } else {
                renderCheckoutStep1();
            }
            const modalWrapper = document.getElementById('checkout-modal-wrapper');
            if (modalWrapper) {
                modalWrapper.classList.add('is-open');
                document.body.style.overflow = 'hidden';
            }
        },

        closeCheckout: function (force) {
            if (!force && activeOrderId && activeOrderData && activeOrderData.status === 'pending_payment') {
                const ok = window.confirm('Pesanan Anda #' + activeOrderId + ' sedang dalam proses pembayaran QRIS.\n\nApakah Anda yakin ingin menutup tampilan ini? Anda dapat membukanya kembali kapan saja.');
                if (!ok) return;
            }
            const modalWrapper = document.getElementById('checkout-modal-wrapper');
            if (modalWrapper) {
                modalWrapper.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        },

        showToast: function (msg) {
            let toast = document.getElementById('cart-toast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'cart-toast';
                toast.className = 'cart-toast';
                document.body.appendChild(toast);
            }
            toast.innerHTML = `<i class="fa fa-check-circle" aria-hidden="true"></i> <span>${msg}</span>`;
            toast.classList.add('is-show');
            setTimeout(() => {
                toast.classList.remove('is-show');
            }, 3000);
        }
    };

    // DOM Injections
    function injectUI() {
        if (document.getElementById('cart-drawer')) return;

        // 1. Floating trigger button
        const floatingBtn = document.createElement('button');
        floatingBtn.type = 'button';
        floatingBtn.id = 'floating-cart-trigger';
        floatingBtn.className = 'floating-cart-trigger';
        floatingBtn.setAttribute('aria-label', 'Buka Keranjang Belanja');
        floatingBtn.innerHTML = `
            <i class="fa fa-shopping-bag" aria-hidden="true"></i>
            <span class="label">Keranjang</span>
            <span class="floating-cart-count" id="floating-cart-count">0</span>
        `;
        floatingBtn.addEventListener('click', window.aromansaCart.openCart);
        document.body.appendChild(floatingBtn);

        // 2. Backdrop
        const backdrop = document.createElement('div');
        backdrop.id = 'cart-backdrop';
        backdrop.className = 'cart-backdrop';
        backdrop.addEventListener('click', () => {
            window.aromansaCart.closeCart();
        });
        document.body.appendChild(backdrop);

        // 3. Cart Drawer
        const drawer = document.createElement('div');
        drawer.id = 'cart-drawer';
        drawer.className = 'cart-drawer';
        drawer.innerHTML = `
            <div class="cart-drawer-header">
                <h3>Keranjang Belanja <span id="cart-header-count">(0 item)</span></h3>
                <button type="button" class="cart-close-btn" id="cart-close-btn" aria-label="Tutup keranjang">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
            <div class="cart-drawer-body" id="cart-drawer-body"></div>
            <div class="cart-drawer-footer" id="cart-drawer-footer">
                <div class="cart-summary-row">
                    <span>Subtotal</span>
                    <span id="cart-subtotal-val">Rp0</span>
                </div>
                <div class="cart-summary-row total">
                    <span>Total Pembayaran</span>
                    <span id="cart-total-val">Rp0</span>
                </div>
                <button type="button" class="btn-checkout" id="btn-proceed-checkout">
                    Lanjut ke Pembayaran <i class="fa fa-arrow-right" aria-hidden="true" style="margin-left:6px"></i>
                </button>
            </div>
        `;
        document.body.appendChild(drawer);

        document.getElementById('cart-close-btn').addEventListener('click', window.aromansaCart.closeCart);
        document.getElementById('btn-proceed-checkout').addEventListener('click', window.aromansaCart.openCheckout);

        // 4. Checkout Modal Wrapper
        const checkoutWrapper = document.createElement('div');
        checkoutWrapper.id = 'checkout-modal-wrapper';
        checkoutWrapper.className = 'checkout-modal-wrapper';
        checkoutWrapper.innerHTML = `
            <div class="checkout-modal" id="checkout-modal">
                <button type="button" class="checkout-modal-close" id="checkout-modal-close" aria-label="Tutup checkout">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
                <div id="checkout-step-container"></div>
            </div>
        `;
        checkoutWrapper.addEventListener('click', (e) => {
            if (e.target === checkoutWrapper) {
                window.aromansaCart.closeCheckout();
            }
        });
        document.body.appendChild(checkoutWrapper);

        document.getElementById('checkout-modal-close').addEventListener('click', () => {
            window.aromansaCart.closeCheckout();
        });

        // Connect any existing navbar button
        const navBtn = document.getElementById('open-cart-btn');
        if (navBtn) {
            navBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.aromansaCart.openCart();
            });
        }
    }

    function updateBadges() {
        const count = window.aromansaCart.getItemCount();
        const floatCount = document.getElementById('floating-cart-count');
        const headerCount = document.getElementById('cart-header-count');
        const navBadge = document.getElementById('cart-badge');

        if (floatCount) floatCount.textContent = count;
        if (headerCount) headerCount.textContent = `(${count} item)`;
        if (navBadge) navBadge.textContent = count;

        const floatBtn = document.getElementById('floating-cart-trigger');
        if (floatBtn) {
            floatBtn.style.display = count > 0 ? 'inline-flex' : 'none';
        }
    }

    function renderDrawerItems() {
        const body = document.getElementById('cart-drawer-body');
        const footer = document.getElementById('cart-drawer-footer');
        if (!body) return;

        updateBadges();

        if (cart.length === 0) {
            body.innerHTML = `
                <div class="cart-empty-state">
                    <i class="fa fa-shopping-basket" aria-hidden="true"></i>
                    <p>Keranjang belanja Anda masih kosong.</p>
                    <a href="equipment.html" class="btn-explore" onclick="window.aromansaCart.closeCart()">Lihat Koleksi Aroma</a>
                </div>
            `;
            if (footer) footer.style.display = 'none';
            return;
        }

        if (footer) footer.style.display = 'block';

        body.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image || 'img/aromansa-logo-baru.png'}" alt="${item.name}" class="cart-item-img" onerror="this.src='img/aromansa-logo-baru.png'">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-meta">${item.size} · ${formatRupiah(item.price)}</p>
                    <div class="cart-item-bottom">
                        <div class="cart-qty-control">
                            <button type="button" class="cart-qty-btn" onclick="window.aromansaCart.updateQty('${item.id}', -1)" aria-label="Kurangi jumlah">-</button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button type="button" class="cart-qty-btn" onclick="window.aromansaCart.updateQty('${item.id}', 1)" aria-label="Tambah jumlah">+</button>
                        </div>
                        <span class="cart-item-price">${formatRupiah(item.price * item.quantity)}</span>
                        <button type="button" class="cart-item-remove" onclick="window.aromansaCart.removeItem('${item.id}')" aria-label="Hapus item">
                            <i class="fa fa-trash-alt" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = window.aromansaCart.getTotal();
        const subtotalEl = document.getElementById('cart-subtotal-val');
        const totalEl = document.getElementById('cart-total-val');
        if (subtotalEl) subtotalEl.textContent = formatRupiah(total);
        if (totalEl) totalEl.textContent = formatRupiah(total);
    }

    // Step 1: Customer Form
    function renderCheckoutStep1() {
        const container = document.getElementById('checkout-step-container');
        if (!container) return;

        const total = window.aromansaCart.getTotal();
        const itemCount = window.aromansaCart.getItemCount();

        const itemsList = cart.map(i => `${i.name} (${i.quantity}x)`).join(', ');

        container.innerHTML = `
            <div class="checkout-modal-header">
                <p class="eyebrow">LANGKAH 1 DARI 2</p>
                <h3>Informasi Pengiriman</h3>
            </div>
            <div class="checkout-mini-summary">
                <div class="checkout-mini-summary-header">
                    <span>Ringkasan Pesanan (${itemCount} item)</span>
                    <strong>${formatRupiah(total)}</strong>
                </div>
                <div class="checkout-mini-items">${itemsList}</div>
            </div>
            <form id="checkout-customer-form">
                <div class="checkout-form-group">
                    <label for="cust-name">Nama Penerima <span class="req">*</span></label>
                    <input type="text" id="cust-name" placeholder="Nama lengkap penerima" required autocomplete="name">
                </div>
                <div class="checkout-form-group">
                    <label for="cust-phone">Nomor WhatsApp / HP <span class="req">*</span></label>
                    <input type="tel" id="cust-phone" placeholder="Contoh: 081234567890" required autocomplete="tel">
                    <small style="color:var(--cart-muted);font-size:11px;margin-top:3px;display:block">Digunakan untuk konfirmasi pesanan dan resi pengiriman.</small>
                </div>
                <div class="checkout-form-group">
                    <label for="cust-address">Alamat Pengiriman Lengkap <span class="req">*</span></label>
                    <textarea id="cust-address" placeholder="Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan" required></textarea>
                </div>
                <div class="checkout-form-row">
                    <div class="checkout-form-group">
                        <label for="cust-city">Kota / Kabupaten <span class="req">*</span></label>
                        <input type="text" id="cust-city" placeholder="Contoh: Bandung" required>
                    </div>
                    <div class="checkout-form-group">
                        <label for="cust-notes">Catatan (Opsional)</label>
                        <input type="text" id="cust-notes" placeholder="Contoh: Titip satpam">
                    </div>
                </div>
                <button type="submit" class="btn-checkout" id="btn-submit-step1">
                    Lanjut ke Pembayaran QRIS <i class="fa fa-qrcode" aria-hidden="true" style="margin-left:6px"></i>
                </button>
            </form>
        `;

        document.getElementById('checkout-customer-form').addEventListener('submit', handleCustomerFormSubmit);
    }

    async function handleCustomerFormSubmit(e) {
        e.preventDefault();
        const submitBtn = document.getElementById('btn-submit-step1');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Membuat pesanan...';
        }

        const name = document.getElementById('cust-name').value.trim();
        const phone = document.getElementById('cust-phone').value.trim();
        const address = document.getElementById('cust-address').value.trim();
        const city = document.getElementById('cust-city').value.trim();
        const notes = document.getElementById('cust-notes').value.trim();

        const payload = {
            customer: { name, phone, address, city, notes },
            items: cart
        };

        try {
            const apiBase = getApiBaseUrl();
            const res = await fetch(`${apiBase}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            if (!res.ok || !data.success) {
                alert(data.error || 'Gagal membuat pesanan. Silakan coba kembali.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Lanjut ke Pembayaran QRIS <i class="fa fa-qrcode" aria-hidden="true" style="margin-left:6px"></i>';
                }
                return;
            }

            activeOrderId = data.orderId;
            activeOrderData = data.order;
            saveActiveCheckout(activeOrderId, activeOrderData, 2);
            renderCheckoutStep2();
        } catch (err) {
            console.error('Error submitting order:', err);
            alert('Terjadi kendala koneksi ke server. Pastikan server aktif lalu coba lagi.');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Lanjut ke Pembayaran QRIS <i class="fa fa-qrcode" aria-hidden="true" style="margin-left:6px"></i>';
            }
        }
    }

    // Step 2: QRIS Display & Payment Proof Upload
    function renderCheckoutStep2() {
        const container = document.getElementById('checkout-step-container');
        if (!container || !activeOrderData) return;

        selectedProofBase64 = null;

        container.innerHTML = `
            <div class="checkout-modal-header">
                <p class="eyebrow">LANGKAH 2 DARI 2</p>
                <h3>Pembayaran QRIS</h3>
            </div>
            <div class="qris-display-card">
                <span class="qris-amount-badge">Tagihan: <strong>${formatRupiah(activeOrderData.totalAmount)}</strong></span>
                <p style="margin:0 0 10px;font-size:12px;color:var(--cart-muted)">ID Pesanan: <strong>#${activeOrderId}</strong></p>
                <div class="qris-image-container">
                    <img src="${QRIS_IMAGE_PATH}" alt="QRIS Aromansa NMID ${QRIS_NMID}">
                </div>
                <div class="qris-details-list">
                    <p><strong>Merchant:</strong> AROMANSA</p>
                    <p><strong>NMID:</strong> ${QRIS_NMID}</p>
                    <p>Bisa dibayar lewat m-Banking (BCA, Mandiri, BRI, BNI) atau e-Wallet (GoPay, OVO, Dana, ShopeePay).</p>
                </div>
            </div>

            <div class="proof-upload-section">
                <p style="font-size:13px;font-weight:600;margin:0 0 8px;color:var(--cart-text)">Unggah Bukti Transfer QRIS <span class="req" style="color:var(--cart-danger)">*</span></p>
                <div class="proof-dropzone" id="proof-dropzone">
                    <input type="file" id="proof-file" class="proof-file-input" accept="image/png, image/jpeg, image/webp" required>
                    <i class="fa fa-cloud-upload-alt" aria-hidden="true"></i>
                    <p>Klik atau seret screenshot / foto struk transfer di sini</p>
                    <small>Mendukung format JPG, PNG, atau WebP (maks. 10MB)</small>
                </div>
                <div id="proof-preview-container"></div>

                <div class="checkout-form-group" style="margin-top:14px">
                    <label for="sender-note">Keterangan Pengirim (Opsional)</label>
                    <input type="text" id="sender-note" placeholder="Contoh: BCA a/n Budi Santoso">
                </div>

                <button type="button" class="btn-checkout" id="btn-submit-proof">
                    Kirim Bukti Pembayaran <i class="fa fa-check" aria-hidden="true" style="margin-left:6px"></i>
                </button>
                <div style="text-align:center;margin-top:12px">
                    <button type="button" class="btn-cancel-active-order" id="btn-cancel-active-order" style="background:none;border:none;color:var(--cart-muted);font-size:12.5px;text-decoration:underline;cursor:pointer;padding:4px 8px">
                        Batalkan pesanan ini &amp; ubah rincian
                    </button>
                </div>
            </div>
        `;

        setupProofUploadHandlers();
    }

    function setupProofUploadHandlers() {
        const fileInput = document.getElementById('proof-file');
        const dropzone = document.getElementById('proof-dropzone');
        const previewContainer = document.getElementById('proof-preview-container');
        const submitBtn = document.getElementById('btn-submit-proof');
        const cancelBtn = document.getElementById('btn-cancel-active-order');

        if (!fileInput) return;

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                if (window.confirm('Batalkan sesi pesanan #' + activeOrderId + ' dan ubah rincian data pemesan?')) {
                    clearActiveCheckout();
                    activeOrderId = null;
                    activeOrderData = null;
                    selectedProofBase64 = null;
                    renderCheckoutStep1();
                }
            });
        }

        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                handleFileSelected(this.files[0]);
            }
        });

        // Drag & drop
        ['dragenter', 'dragover'].forEach(name => {
            dropzone.addEventListener(name, (e) => {
                e.preventDefault();
                dropzone.classList.add('is-dragover');
            });
        });
        ['dragleave', 'drop'].forEach(name => {
            dropzone.addEventListener(name, (e) => {
                e.preventDefault();
                dropzone.classList.remove('is-dragover');
            });
        });
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelected(e.dataTransfer.files[0]);
            }
        });

        function handleFileSelected(file) {
            if (!file.type.startsWith('image/')) {
                alert('Silakan pilih file gambar (JPG, PNG, atau WebP).');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('Ukuran file maksimal 10MB.');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (e) {
                selectedProofBase64 = e.target.result;
                previewContainer.innerHTML = `
                    <div class="proof-preview-wrapper">
                        <img src="${selectedProofBase64}" class="proof-preview-img" alt="Preview bukti transfer">
                        <div class="proof-preview-info">
                            <strong>${file.name}</strong><br>
                            <small>${(file.size / 1024).toFixed(1)} KB · Siap dikirim</small>
                        </div>
                        <button type="button" class="proof-preview-remove" id="btn-remove-proof" title="Hapus gambar">
                            <i class="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                `;
                document.getElementById('btn-remove-proof').addEventListener('click', function () {
                    selectedProofBase64 = null;
                    previewContainer.innerHTML = '';
                    fileInput.value = '';
                });
            };
            reader.readAsDataURL(file);
        }

        submitBtn.addEventListener('click', async function () {
            if (!selectedProofBase64) {
                alert('Silakan pilih dan unggah foto/screenshot bukti transfer terlebih dahulu.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Mengirim bukti transfer...';

            const senderNote = document.getElementById('sender-note') ? document.getElementById('sender-note').value.trim() : '';

            try {
                const apiBase = getApiBaseUrl();
                const res = await fetch(`${apiBase}/api/orders/${activeOrderId}/payment-proof`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        image: selectedProofBase64,
                        senderNote: senderNote
                    })
                });
                const data = await res.json();

                if (!res.ok || !data.success) {
                    alert(data.error || 'Gagal mengirim bukti pembayaran.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Kirim Bukti Pembayaran';
                    return;
                }

                // Clear cart on success
                window.aromansaCart.clearCart();
                clearActiveCheckout();
                renderCheckoutStep3();
            } catch (err) {
                console.error('Error uploading proof:', err);
                alert('Gagal mengirim bukti. Pastikan koneksi internet aktif.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Kirim Bukti Pembayaran';
            }
        });
    }

    // Step 3: Confirmation
    function renderCheckoutStep3() {
        clearActiveCheckout();
        const container = document.getElementById('checkout-step-container');
        if (!container || !activeOrderData) return;

        const customerName = activeOrderData.customer ? activeOrderData.customer.name : 'Pelanggan';
        const total = formatRupiah(activeOrderData.totalAmount);
        const orderId = activeOrderId;

        const waText = encodeURIComponent(
            `Halo Admin Aromansa, saya ${customerName}. Saya sudah melakukan pembayaran QRIS untuk pesanan #${orderId} sebesar ${total}. Mohon bantuannya untuk verifikasi dan konfirmasi pengiriman ya. Terima kasih!`
        );
        const waLink = `https://wa.me/${WA_ADMIN}?text=${waText}`;

        container.innerHTML = `
            <div class="order-success-card">
                <div class="order-success-icon">
                    <i class="fa fa-check" aria-hidden="true"></i>
                </div>
                <h4>Bukti Pembayaran Diterima</h4>
                <p>Terima kasih, <strong>${customerName}</strong>! Pembayaran pesanan Anda sedang kami teruskan ke admin.</p>
                
                <div class="order-status-pill">
                    <i class="fa fa-clock" aria-hidden="true"></i>
                    Status: <strong>Menunggu Persetujuan Admin</strong>
                </div>

                <div style="background:#f9fafb;border:1px solid var(--cart-border);border-radius:8px;padding:14px;text-align:left;font-size:13px;line-height:1.7;margin-bottom:16px">
                    <p style="margin:0"><strong>ID Pesanan:</strong> #${orderId}</p>
                    <p style="margin:0"><strong>Total:</strong> ${total}</p>
                    <p style="margin:0"><strong>Metode:</strong> QRIS Aromansa</p>
                    <p style="margin:0;color:var(--cart-muted);font-size:12px">Admin Aromansa akan memeriksa pembayaran dan menyiapkan paket Anda.</p>
                </div>

                <div class="order-action-links">
                    <a href="order-status.html?id=${orderId}" class="btn-track-order" target="_blank">
                        <i class="fa fa-receipt" aria-hidden="true"></i> Pantau Status Pesanan Ini
                    </a>
                    <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="btn-wa-confirm">
                        <i class="fab fa-whatsapp" aria-hidden="true"></i> Hubungi Admin via WhatsApp
                    </a>
                    <button type="button" class="btn-checkout" style="background:#f3f4f6;color:var(--cart-text);border:1px solid #d1d5db;margin-top:6px" onclick="window.aromansaCart.closeCheckout()">
                        Selesai &amp; Tutup
                    </button>
                </div>
            </div>
        `;
    }

    // Global listener for data-add-to-cart buttons
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('[data-add-to-cart]');
        if (!btn) return;
        e.preventDefault();
        const id = btn.getAttribute('data-product-id');
        const name = btn.getAttribute('data-product-name');
        const price = sanitizePrice(btn.getAttribute('data-product-price'));
        const size = btn.getAttribute('data-product-size') || '10 ml';
        const image = btn.getAttribute('data-product-image') || '';
        window.aromansaCart.addItem({
            id: id,
            name: name,
            price: price,
            size: size,
            quantity: 1,
            image: image
        });
    });

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadCart();
            injectUI();
            updateBadges();
            restoreActiveCheckoutIfAny();
        });
    } else {
        loadCart();
        injectUI();
        updateBadges();
        restoreActiveCheckoutIfAny();
    }
})();
