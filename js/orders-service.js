const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const WEBSITE_ROOT = path.join(__dirname, '..');
const CONTACT_DATA_DIR = path.join(WEBSITE_ROOT, '.private-contact-data');
const ORDERS_FILE = path.join(CONTACT_DATA_DIR, 'orders.json');
const PROOFS_DIR = path.join(CONTACT_DATA_DIR, 'payment-proofs');
const SESSIONS_FILE = path.join(CONTACT_DATA_DIR, 'admin-sessions.json');

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'aromansa2026';

// In-memory sessions map
const activeAdminSessions = new Map();

// Initialize storage directories
async function ensureStorage() {
    await fs.promises.mkdir(CONTACT_DATA_DIR, { recursive: true, mode: 0o700 });
    await fs.promises.mkdir(PROOFS_DIR, { recursive: true, mode: 0o700 });
    try {
        await fs.promises.chmod(CONTACT_DATA_DIR, 0o700);
        await fs.promises.chmod(PROOFS_DIR, 0o700);
    } catch (_) {}

    // Load active sessions if file exists
    try {
        if (fs.existsSync(SESSIONS_FILE)) {
            const data = await fs.promises.readFile(SESSIONS_FILE, 'utf8');
            const entries = JSON.parse(data || '[]');
            const now = Date.now();
            entries.forEach(([token, sess]) => {
                if (sess.expiresAt > now) {
                    activeAdminSessions.set(token, sess);
                }
            });
        }
    } catch (err) {
        console.warn('Could not restore admin sessions:', err.message);
    }
}

async function persistSessions() {
    try {
        const entries = Array.from(activeAdminSessions.entries());
        await fs.promises.writeFile(SESSIONS_FILE, JSON.stringify(entries), { mode: 0o600 });
    } catch (err) {
        console.warn('Could not persist admin sessions:', err.message);
    }
}

async function getOrders() {
    try {
        if (!fs.existsSync(ORDERS_FILE)) {
            return [];
        }
        const data = await fs.promises.readFile(ORDERS_FILE, 'utf8');
        return JSON.parse(data || '[]');
    } catch (err) {
        console.error('Error reading orders file:', err.message);
        return [];
    }
}

async function saveOrders(orders) {
    await fs.promises.mkdir(CONTACT_DATA_DIR, { recursive: true, mode: 0o700 });
    const tempFile = ORDERS_FILE + '.tmp';
    await fs.promises.writeFile(tempFile, JSON.stringify(orders, null, 2), { mode: 0o600 });
    await fs.promises.rename(tempFile, ORDERS_FILE);
}

function generateOrderId() {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `ARO-${day}${month}-${randomHex}`;
}

function requireAdminAuth(req, res, next) {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : (req.query.token || '');

    if (!token) {
        return res.status(401).json({ error: 'Akses ditolak. Sesi admin diperlukan.' });
    }

    const session = activeAdminSessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
        if (session) {
            activeAdminSessions.delete(token);
            persistSessions();
        }
        return res.status(401).json({ error: 'Sesi login telah berakhir. Silakan login kembali.' });
    }

    req.admin = session;
    next();
}

function registerOrderRoutes(app) {
    ensureStorage();

    // Page routes
    app.get('/admin', (req, res) => {
        res.sendFile(path.join(WEBSITE_ROOT, 'admin.html'));
    });

    app.get('/order-status', (req, res) => {
        res.sendFile(path.join(WEBSITE_ROOT, 'order-status.html'));
    });

    // Create Order
    app.post('/api/orders', async (req, res) => {
        try {
            const body = req.body || {};
            const { customer, items, paymentProof } = body;

            if (!customer || typeof customer !== 'object') {
                return res.status(400).json({ error: 'Data pemesan tidak lengkap.' });
            }

            const name = typeof customer.name === 'string' ? customer.name.trim() : '';
            const phone = typeof customer.phone === 'string' ? customer.phone.trim() : '';
            const address = typeof customer.address === 'string' ? customer.address.trim() : '';
            const city = typeof customer.city === 'string' ? customer.city.trim() : '';
            const notes = typeof customer.notes === 'string' ? customer.notes.trim() : '';

            if (name.length < 2) {
                return res.status(400).json({ error: 'Nama penerima minimal 2 karakter.' });
            }
            if (phone.replace(/\D/g, '').length < 7) {
                return res.status(400).json({ error: 'Nomor WhatsApp / telepon tidak valid.' });
            }
            if (address.length < 5) {
                return res.status(400).json({ error: 'Alamat pengiriman harus diisi lengkap.' });
            }

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'Keranjang belanja masih kosong.' });
            }

            // Sanitize items & calculate totals
            let subtotal = 0;
            let totalItems = 0;
            const cleanItems = [];

            for (const item of items) {
                const qty = parseInt(item.quantity, 10);
                const price = parseInt(item.price, 10);
                if (!item.name || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
                    return res.status(400).json({ error: 'Item dalam keranjang tidak valid.' });
                }
                const itemSubtotal = qty * price;
                subtotal += itemSubtotal;
                totalItems += qty;
                cleanItems.push({
                    id: String(item.id || ''),
                    name: String(item.name).trim(),
                    size: String(item.size || ''),
                    price: price,
                    quantity: qty,
                    subtotal: itemSubtotal,
                    image: String(item.image || '')
                });
            }

            const orderId = generateOrderId();
            const now = new Date().toISOString();

            let proofData = null;
            let status = 'pending_payment';

            // Optional immediate payment proof
            if (paymentProof && typeof paymentProof.image === 'string' && paymentProof.image.length > 50) {
                const savedFile = await saveProofBase64(orderId, paymentProof.image);
                if (savedFile) {
                    proofData = {
                        file: savedFile,
                        uploadedAt: now,
                        senderNote: typeof paymentProof.senderNote === 'string' ? paymentProof.senderNote.trim() : ''
                    };
                    status = 'pending_verification';
                }
            }

            const newOrder = {
                id: orderId,
                createdAt: now,
                customer: {
                    name,
                    phone,
                    address,
                    city,
                    notes
                },
                items: cleanItems,
                totalItems,
                subtotal,
                shippingFee: 0,
                totalAmount: subtotal,
                paymentMethod: 'QRIS',
                qrisNmid: 'ID1025428805408',
                status: status, // pending_payment | pending_verification | approved | rejected
                paymentProof: proofData,
                adminNotes: '',
                verifiedAt: null,
                verifiedBy: null
            };

            const orders = await getOrders();
            orders.unshift(newOrder);
            await saveOrders(orders);

            res.status(201).json({
                success: true,
                orderId: newOrder.id,
                status: newOrder.status,
                totalAmount: newOrder.totalAmount,
                order: newOrder
            });
        } catch (err) {
            console.error('Error creating order:', err);
            res.status(500).json({ error: 'Gagal memproses pesanan. Silakan coba lagi.' });
        }
    });

    // Upload Payment Proof for Order
    app.post('/api/orders/:id/payment-proof', async (req, res) => {
        try {
            const orderId = req.params.id;
            const body = req.body || {};
            const { image, senderNote } = body;

            if (!image || typeof image !== 'string' || image.length < 50) {
                return res.status(400).json({ error: 'File bukti pembayaran tidak valid atau kosong.' });
            }

            const orders = await getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
            }

            const savedFile = await saveProofBase64(orderId, image);
            if (!savedFile) {
                return res.status(400).json({ error: 'Format gambar tidak didukung (gunakan JPG, PNG, atau WebP).' });
            }

            const now = new Date().toISOString();
            orders[orderIndex].paymentProof = {
                file: savedFile,
                uploadedAt: now,
                senderNote: typeof senderNote === 'string' ? senderNote.trim() : ''
            };
            orders[orderIndex].status = 'pending_verification';

            await saveOrders(orders);

            res.json({
                success: true,
                message: 'Bukti pembayaran berhasil diunggah. Menunggu konfirmasi admin.',
                status: orders[orderIndex].status,
                orderId: orderId
            });
        } catch (err) {
            console.error('Error uploading payment proof:', err);
            res.status(500).json({ error: 'Gagal mengunggah bukti pembayaran.' });
        }
    });

    // Public Order Status Check
    app.get('/api/orders/:id', async (req, res) => {
        try {
            const orderId = req.params.id;
            const orders = await getOrders();
            const order = orders.find(o => o.id === orderId);

            if (!order) {
                return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
            }

            // Return safe public tracking payload
            res.json({
                id: order.id,
                createdAt: order.createdAt,
                status: order.status,
                items: order.items,
                totalItems: order.totalItems,
                subtotal: order.subtotal,
                shippingFee: order.shippingFee,
                totalAmount: order.totalAmount,
                customer: {
                    name: order.customer.name,
                    phone: maskPhone(order.customer.phone),
                    city: order.customer.city,
                    address: order.customer.address
                },
                hasProof: Boolean(order.paymentProof),
                proofUploadedAt: order.paymentProof ? order.paymentProof.uploadedAt : null,
                verifiedAt: order.verifiedAt,
                adminNotes: order.adminNotes
            });
        } catch (err) {
            console.error('Error getting order status:', err);
            res.status(500).json({ error: 'Gagal mengambil status pesanan.' });
        }
    });

    // Admin Login
    app.post('/api/admin/login', (req, res) => {
        const { username, password } = req.body || {};

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const token = crypto.randomBytes(32).toString('hex');
            const expiresAt = Date.now() + (7 * 24 * 60 * 60 * 1000); // 7 days

            activeAdminSessions.set(token, {
                username: ADMIN_USERNAME,
                createdAt: Date.now(),
                expiresAt
            });
            persistSessions();

            return res.json({
                success: true,
                token,
                admin: {
                    username: ADMIN_USERNAME
                }
            });
        }

        return res.status(401).json({ error: 'Nama pengguna atau kata sandi admin salah.' });
    });

    // Admin Logout
    app.post('/api/admin/logout', requireAdminAuth, (req, res) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : (req.query.token || '');
        if (token) {
            activeAdminSessions.delete(token);
            persistSessions();
        }
        res.json({ success: true, message: 'Berhasil keluar.' });
    });

    // Admin Check Session
    app.get('/api/admin/me', requireAdminAuth, (req, res) => {
        res.json({
            authenticated: true,
            username: req.admin.username
        });
    });

    // Admin List Orders & Stats
    app.get('/api/admin/orders', requireAdminAuth, async (req, res) => {
        try {
            const orders = await getOrders();

            const totalOrders = orders.length;
            let pendingVerificationCount = 0;
            let pendingPaymentCount = 0;
            let approvedCount = 0;
            let rejectedCount = 0;
            let totalRevenueApproved = 0;

            orders.forEach(o => {
                if (o.status === 'pending_verification') pendingVerificationCount++;
                else if (o.status === 'pending_payment') pendingPaymentCount++;
                else if (o.status === 'approved') {
                    approvedCount++;
                    totalRevenueApproved += (o.totalAmount || 0);
                } else if (o.status === 'rejected') rejectedCount++;
            });

            res.json({
                success: true,
                stats: {
                    totalOrders,
                    pendingVerificationCount,
                    pendingPaymentCount,
                    approvedCount,
                    rejectedCount,
                    totalRevenueApproved
                },
                orders
            });
        } catch (err) {
            console.error('Error in admin get orders:', err);
            res.status(500).json({ error: 'Gagal mengambil data pesanan.' });
        }
    });

    // Admin Update Order Status (Approve / Reject)
    app.patch('/api/admin/orders/:id/status', requireAdminAuth, async (req, res) => {
        try {
            const orderId = req.params.id;
            const { status, adminNotes } = req.body || {};

            if (!['approved', 'rejected', 'pending_verification', 'pending_payment'].includes(status)) {
                return res.status(400).json({ error: 'Status tidak valid.' });
            }

            const orders = await getOrders();
            const orderIndex = orders.findIndex(o => o.id === orderId);

            if (orderIndex === -1) {
                return res.status(404).json({ error: 'Pesanan tidak ditemukan.' });
            }

            const now = new Date().toISOString();
            orders[orderIndex].status = status;
            if (typeof adminNotes === 'string') {
                orders[orderIndex].adminNotes = adminNotes.trim();
            }

            if (status === 'approved') {
                orders[orderIndex].verifiedAt = now;
                orders[orderIndex].verifiedBy = req.admin.username;
            } else if (status === 'rejected') {
                orders[orderIndex].verifiedAt = null;
            }

            await saveOrders(orders);

            res.json({
                success: true,
                message: status === 'approved' ? 'Pembayaran berhasil disetujui.' : 'Status pesanan berhasil diperbarui.',
                order: orders[orderIndex]
            });
        } catch (err) {
            console.error('Error updating order status:', err);
            res.status(500).json({ error: 'Gagal memperbarui status pesanan.' });
        }
    });

    // Admin View / Download Proof Image
    app.get('/api/admin/proofs/:filename', (req, res, next) => {
        // Allow token in query string so <img> tags can render directly
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : (req.query.token || '');

        const session = activeAdminSessions.get(token);
        if (!session || session.expiresAt < Date.now()) {
            return res.status(401).send('Akses tidak diizinkan. Silakan login admin.');
        }

        const safeFilename = path.basename(req.params.filename);
        const filePath = path.join(PROOFS_DIR, safeFilename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).send('Bukti pembayaran tidak ditemukan.');
        }

        res.sendFile(filePath);
    });
}

// Save base64 image helper
async function saveProofBase64(orderId, base64String) {
    try {
        await fs.promises.mkdir(PROOFS_DIR, { recursive: true, mode: 0o700 });
        let extension = 'png';
        let rawData = base64String;

        const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
            const mime = matches[1].toLowerCase();
            if (mime.includes('jpeg') || mime.includes('jpg')) extension = 'jpg';
            else if (mime.includes('png')) extension = 'png';
            else if (mime.includes('webp')) extension = 'webp';
            rawData = matches[2];
        }

        const buffer = Buffer.from(rawData, 'base64');
        const filename = `${orderId}.${extension}`;
        const filePath = path.join(PROOFS_DIR, filename);

        await fs.promises.writeFile(filePath, buffer, { mode: 0o600 });
        return filename;
    } catch (err) {
        console.error('Error saving proof image:', err);
        return null;
    }
}

function maskPhone(phone) {
    if (!phone || phone.length < 5) return phone || '';
    const clean = phone.trim();
    const visibleStart = clean.slice(0, 4);
    const visibleEnd = clean.slice(-3);
    return `${visibleStart}****${visibleEnd}`;
}

module.exports = {
    registerOrderRoutes
};
