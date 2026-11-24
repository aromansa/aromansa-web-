require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { registerOrderRoutes } = require('./orders-service');
const { createAIResponse } = require('./ai-chat-service');

const app = express();
const PORT = process.env.PORT || 3000;
const WEBSITE_ROOT = path.join(__dirname, '..');
const CONTACT_DATA_DIR = path.join(WEBSITE_ROOT, '.private-contact-data');
const CONTACT_DATA_FILE = path.join(CONTACT_DATA_DIR, 'submissions.jsonl');
const MOOD_SCAN_DATA_FILE = path.join(CONTACT_DATA_DIR, 'mood-scan-submissions.jsonl');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Protect sensitive files from static exposure
app.use((req, res, next) => {
    const p = req.path.toLowerCase();
    if (p.includes('.env') || p.startsWith('/.private-contact-data')) {
        return res.sendStatus(404);
    }
    next();
});

app.use(express.static(WEBSITE_ROOT));

app.post('/api/mood-scan-submissions', async (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'Data formulir tidak valid.' });
    }

    const nickname = typeof body.nickname === 'string' ? body.nickname.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const phoneDigits = phone.replace(/\D/g, '');
    const age = typeof body.age === 'string' ? body.age : '';
    const concerns = body.concerns;
    const stress = body.stress;
    const sleep = typeof body.sleep === 'string' ? body.sleep : '';
    const scents = body.scents;
    const allergies = typeof body.allergies === 'string' ? body.allergies.trim() : '';
    const allowedAges = ['under-18', '18-25', '26-35', '36-45', '46-plus'];
    const allowedConcerns = [
        'stress', 'sleep-deprived', 'anxious', 'tired',
        'unfocused', 'low-mood', 'headache', 'relax'
    ];
    const allowedScents = ['floral', 'citrus', 'woody', 'herbal', 'sweet'];
    const allowedSleep = ['under-4', '4-6', '6-8', 'over-8'];
    const validChoices = (value, allowed) => Array.isArray(value)
        && value.length > 0
        && value.length <= allowed.length
        && value.every(choice => typeof choice === 'string' && allowed.includes(choice))
        && new Set(value).size === value.length;

    if (typeof body.website === 'string' && body.website.trim()) {
        return res.status(400).json({ error: 'Permintaan tidak valid.' });
    }
    if (nickname.length < 2 || nickname.length > 40) {
        return res.status(400).json({ error: 'Nama panggilan harus terdiri dari 2 hingga 40 karakter.' });
    }
    if (!/^[+0-9() .-]{7,30}$/.test(phone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
        return res.status(400).json({ error: 'Masukkan nomor telepon yang valid.' });
    }
    if (!allowedAges.includes(age)) {
        return res.status(400).json({ error: 'Pilih rentang usia yang valid.' });
    }
    if (!validChoices(concerns, allowedConcerns) || !validChoices(scents, allowedScents)) {
        return res.status(400).json({ error: 'Pilih kondisi dan aroma yang valid.' });
    }
    if (!Number.isInteger(stress) || stress < 1 || stress > 10) {
        return res.status(400).json({ error: 'Tingkat stres harus berupa angka dari 1 hingga 10.' });
    }
    if (!allowedSleep.includes(sleep)) {
        return res.status(400).json({ error: 'Pilih durasi tidur yang valid.' });
    }
    if (allergies.length > 160) {
        return res.status(400).json({ error: 'Informasi sensitivitas maksimal 160 karakter.' });
    }
    if (body.dataConsent !== true || body.cameraConsent !== true) {
        return res.status(400).json({ error: 'Persetujuan penyimpanan data dan penggunaan kamera wajib diberikan.' });
    }

    const submission = {
        nickname,
        phone,
        age,
        concerns,
        stress,
        sleep,
        scents,
        allergies,
        dataConsent: true,
        cameraConsent: true,
        submittedAt: new Date().toISOString()
    };

    try {
        await fs.promises.mkdir(CONTACT_DATA_DIR, { recursive: true, mode: 0o700 });
        await fs.promises.chmod(CONTACT_DATA_DIR, 0o700);
        const file = await fs.promises.open(MOOD_SCAN_DATA_FILE, 'a', 0o600);
        try {
            await file.chmod(0o600);
            await file.writeFile(`${JSON.stringify(submission)}\n`, 'utf8');
        } finally {
            await file.close();
        }
    } catch (error) {
        console.error('Unable to save mood scan submission:', error);
        return res.status(500).json({ error: 'Data belum dapat disimpan. Silakan coba kembali nanti.' });
    }

    return res.status(201).json({ message: 'Data Scan Mood AR berhasil disimpan.' });
});

app.post('/api/contact-submissions', async (req, res) => {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'Data formulir tidak valid.' });
    }

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';
    const allowedSubjects = [
        'product-inquiry',
        'wholesale-order',
        'wellness-consultation',
        'general-question'
    ];

    if (typeof body.website === 'string' && body.website.trim()) {
        return res.status(400).json({ error: 'Permintaan tidak valid.' });
    }
    if (name.length < 2 || name.length > 100) {
        return res.status(400).json({ error: 'Nama harus terdiri dari 2 hingga 100 karakter.' });
    }
    if (!/^[+0-9() .-]{7,30}$/.test(phone) || phone.replace(/\D/g, '').length < 7) {
        return res.status(400).json({ error: 'Masukkan nomor telepon yang valid.' });
    }
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Masukkan alamat email yang valid.' });
    }
    if (!allowedSubjects.includes(subject)) {
        return res.status(400).json({ error: 'Pilih topik pesan yang valid.' });
    }
    if (!message || message.length > 5000) {
        return res.status(400).json({ error: 'Pesan wajib diisi dan maksimal 5000 karakter.' });
    }
    if (body.consent !== true) {
        return res.status(400).json({ error: 'Persetujuan penyimpanan data wajib diberikan.' });
    }

    const submission = {
        name,
        phone,
        email,
        subject,
        message,
        consent: true,
        submittedAt: new Date().toISOString()
    };

    try {
        await fs.promises.mkdir(CONTACT_DATA_DIR, { recursive: true, mode: 0o700 });
        await fs.promises.chmod(CONTACT_DATA_DIR, 0o700);
        const file = await fs.promises.open(CONTACT_DATA_FILE, 'a', 0o600);
        try {
            await file.chmod(0o600);
            await file.writeFile(`${JSON.stringify(submission)}\n`, 'utf8');
        } finally {
            await file.close();
        }
    } catch (error) {
        console.error('Unable to save contact submission:', error);
        return res.status(500).json({ error: 'Pesan belum dapat disimpan. Silakan coba kembali nanti.' });
    }

    return res.status(201).json({ message: 'Pesan berhasil disimpan.' });
});

// ===== Groq API Configuration =====
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const GROQ_FALLBACK_MODEL = 'qwen/qwen3.8-27b';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ===== Aromansa Grounded Database & Knowledge Base =====
const SYSTEM_PROMPT = `Anda adalah Konsultan Aromansa, brand aromaterapi botani murni asal Cianjur, Jawa Barat, Indonesia.
Tugas Anda: Menjawab pertanyaan pelanggan, memberikan rekomendasi aroma yang akurat, membuatkan resep racikan blend, dan memberikan panduan cara pakai yang aman berdasarkan data resmi Aromansa.

=== PRINSIP UTAMA & KEAMANAN (WAJIB DIIKUTI) ===
1. Aromaterapi mendukung kenyamanan suasana, relaksasi, dan fokus. BUKAN pengobatan atau obat penyembuh penyakit. DILARANG memakai kata "menyembuhkan" atau "mengobati".
2. Jangan memberikan klaim medis absolut. Bila pengguna menyampaikan keluhan medis serius, sarankan periksa ke tenaga medis/dokter.
3. Keamanan Kulit: Minyak esensial murni (dropper 10ml) konsentrasinya tinggi, TIDAK BOLEH dioleskan langsung ke kulit tanpa minyak pembawa (carrier oil seperti jojoba/almond/coconut oil).
   - Rasio dilusi dewasa sehat: 1% - 2% (3-6 tetes per 10ml carrier oil).
   - Selalu anjurkan uji tempel (patch test) 24 jam sebelum pemakaian rutin.
4. Jangan menelan essential oil (tidak untuk diminum).
5. Aturan Khusus:
   - Lemon: Jika dioleskan ke kulit, hindari sinar matahari langsung minimal 12 jam (fototoksik).
   - Peppermint & Eucalyptus: Mengandung mentol/sineol tinggi; jangan dioleskan dekat area wajah/hidung bayi atau anak di bawah 5 tahun. Pada malam hari kurangi karena aromanya membangunkan kesegaran.
   - Lemongrass: Hindari pada ibu hamil.
   - Gandapura: Mengandung metil salisilat, khusus untuk pegal otot dan persendian badan, BUKAN untuk sakit kepala atau mood.

=== DATABASE PRODUK LENGKAP AROMANSA ===
1. Single Essential Oil (Botol Kaca Dropper 10 ml):
   - Lavender Essential Oil (10ml, Rp65.000) — Floral lembut, sedikit herbal. Rekomendasi #1 untuk relaksasi, melepas stres, dan menemani tidur malam yang lelap.
   - Peppermint Essential Oil (10ml, Rp55.000) — Mint herbal dingin tajam. Segar untuk kepala berat, penat, dan menjaga fokus kerja.
   - Sweet Orange Essential Oil (10ml, Rp45.000) — Citrus manis hangat. Mencerahkan suasana hati (mood booster), membangkitkan keceriaan ruang keluarga.
   - Lemon Essential Oil (10ml, Rp45.000) — Citrus bersih segar. Menetralkan bau ruangan dan membangkitkan energi pagi.
   - Eucalyptus Essential Oil (10ml, Rp40.000) — Uap herbal hangat menyegarkan. Sensasi lega di pernapasan saat hidung tersumbat atau cuaca dingin.
   - Spearmint Essential Oil (10ml, Rp55.000) — Mint manis yang lebih ramah & lembut dibanding peppermint untuk kesegaran pikiran.
   - Lemongrass Essential Oil (10ml, Rp45.000) — Sulingan serai wangi segar tajam. Menghilangkan bau apek ruangan dan membantu menghalau nyamuk.
   - Palmarosa Essential Oil (10ml, Rp75.000) — Perpaduan wangi rumput botanikal & mawar lembut. Nyaman untuk ritual spa sore dan relaksasi alami.
   - Ylang-Ylang Essential Oil (10ml, Rp70.000) — Ekstrak bunga kenanga eksotis pekat. Membantu meredakan ketegangan emosi mendalam di penghujung hari.
   - Frangipani Essential Oil (10ml, Rp75.000) — Harum bunga kamboja tropis anggun. Menghadirkan nuansa spa alami mewah di kamar tidur.

2. Roll-On Siap Oles (10 ml):
   - Peppermint Roll-On (10ml, Rp30.000) — Kemasan roll-on saku praktis untuk dioleskan di pelipis dan tengkuk saat butuh kesegaran instan atau kepala tegang.
   - Gandapura Roll-On (10ml, Rp30.000) — Formula hangat untuk pundak pegal, leher kaku, dan persendian (bukan untuk sakit kepala/mood).

3. Linen & Room Spray (100 ml):
   - Lavender Linen Deep Sleep Spray (100ml, Rp60.000) — Semprotan praktis beraroma lavender untuk bantal dan sprei agar istirahat malam lebih tenang.
   - Peppermint Linen & Room Spray (100ml, Rp60.000) — Semprotan ruangan beraroma peppermint segar untuk menjernihkan udara ruang kerja.

=== RESEP RACIKAN BLEND POPULER AROMANSA ===
- Deep Sleep (Tidur Pulas): 3 tetes Lavender + 2 tetes Sweet Orange di diffuser 30 menit sebelum tidur.
- Work Focus (Fokus Kerja): 2 tetes Peppermint + 3 tetes Lemon di diffuser ruang kerja.
- Stress Relief (Pelepas Penat): 2 tetes Ylang-Ylang + 3 tetes Lavender + 1 tetes Sweet Orange.
- Breathe Easy (Napas Lega): 3 tetes Eucalyptus + 2 tetes Peppermint di mangkuk air hangat atau diffuser.

=== CARA PEMBELIAN DI AROMANSA ===
- Pembelian langsung di Web: Pengunjung bisa klik tombol "+ Keranjang" di katalog produk atau hasil Scan Mood AR, lalu checkout dengan Pembayaran QRIS (disetujui langsung oleh Admin Aromansa).
- Toko Resmi Shopee: shopee.co.id/aromansa_id
- Toko Resmi Tokopedia: tokopedia.com/aromansa
- WhatsApp Admin: +62 857-8290-9266
- Lokasi & Pengiriman: Cianjur, Jawa Barat, Indonesia.

GAYA JAWABAN:
Gunakan Bahasa Indonesia yang ramah, hangat, luwes, to-the-point, dan berstandar profesional (bebas bahasa robotik AI). Sebutkan nama produk, ukuran, dan harga secara spesifik saat merekomendasikan.`;

// ===== Fallback Generator (jika API Groq offline/timeout) =====
function generateFallbackResponse(userMessage) {
    const message = (userMessage || '').toLowerCase();
    
    if (message.includes('tidur') || message.includes('sleep') || message.includes('insomnia') || message.includes('lelap')) {
        return `🌿 **Rekomendasi Aromansa untuk Istirahat & Tidur Tenang:**\n\n1. **Lavender Essential Oil (10ml - Rp65.000)** — Pilihan utama untuk meredakan ketegangan dan menemani waktu istirahat.\n2. **Lavender Linen Deep Sleep Spray (100ml - Rp60.000)** — Praktis disemprotkan ke bantal 15 menit sebelum tidur.\n3. **Sweet Orange Essential Oil (10ml - Rp45.000)** — Cocok dipadukan dengan lavender (3 tetes lavender + 2 tetes orange) untuk suasana kamar yang hangat dan menenangkan.\n\n🛒 Anda bisa memesan langsung via Keranjang Belanja web Aromansa atau toko resmi kami di Shopee & Tokopedia.`;
    }
    
    if (message.includes('fokus') || message.includes('kerja') || message.includes('ngantuk') || message.includes('energi') || message.includes('segar')) {
        return `⚡ **Rekomendasi Aromansa untuk Fokus Kerja & Kesegaran:**\n\n1. **Peppermint Essential Oil (10ml - Rp55.000)** — Aroma mint dingin tajam yang menyegarkan pikiran dan membantu menjaga konsentrasi.\n2. **Peppermint Roll-On (10ml - Rp30.000)** — Praktis dioleskan di pelipis atau tengkuk saat kepala terasa penat di kantor.\n3. **Lemon Essential Oil (10ml - Rp45.000)** — Padukan 2 tetes peppermint + 3 tetes lemon di diffuser untuk ruang kerja yang berenergi.\n\n🛒 Bisa langsung klik "+ Keranjang" di website kami atau WhatsApp ke +62 857-8290-9266.`;
    }

    if (message.includes('pegal') || message.includes('otot') || message.includes('sendi') || message.includes('kaku')) {
        return `💆 **Rekomendasi Aromansa untuk Pegal Otot & Sendi:**\n\n• **Gandapura Roll-On (10ml - Rp30.000)** — Formula minyak gandapura asli yang memberikan sensasi hangat meresap untuk pundak pegal, leher kaku, dan persendian.\n• Oleskan secukupnya pada area tubuh yang membutuhkan (bukan untuk sakit kepala atau area wajah).\n\n🛒 Tersedia di katalog web Aromansa dan Toko Shopee/Tokopedia.`;
    }

    return `🌿 **Halo, selamat datang di Aromansa!**\n\nSaya Konsultan Aromansa. Ceritakan apa yang sedang Anda butuhkan hari ini:\n• Membantu rileks & istirahat tidur lelap (Lavender, Ylang-Ylang)?\n• Menjaga fokus kerja & mengusir kantuk (Peppermint, Lemon)?\n• Meredakan pegal otot (Gandapura Roll-On)?\n• Melegakan pernapasan saat flu (Eucalyptus)?\n\nSilakan ceritakan aroma favorit atau suasana yang ingin Anda hadirkan!`;
}

// ===== API Endpoint AI Chat (Groq API) =====
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message, chatHistory = [] } = req.body;

        if (!message || typeof message !== 'string' || !message.trim()) {
            return res.status(400).json({ error: 'Pesan pertanyaan tidak boleh kosong.' });
        }

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT }
        ];

        // Append recent conversation context
        if (Array.isArray(chatHistory)) {
            const recent = chatHistory.slice(-8);
            for (const item of recent) {
                if (!item || !item.content) continue;
                const role = (item.role === 'user') ? 'user' : 'assistant';
                messages.push({ role, content: String(item.content) });
            }
        }

        // Add user message
        messages.push({ role: 'user', content: message.trim() });

        if (!GROQ_API_KEY) {
            console.warn('Groq API Key tidak ditemukan di environment. Menggunakan fallback generator.');
            return res.status(503).json({ response: generateFallbackResponse(message), isFallback: true });
        }

        let aiResponse = null;
        let isFallback = false;
        let usedModel = GROQ_MODEL;

        try {
            console.log(`Calling Groq API with model: ${GROQ_MODEL}...`);
            const groqRes = await axios.post(
                GROQ_API_URL,
                {
                    model: GROQ_MODEL,
                    messages: messages,
                    temperature: 0.6,
                    max_tokens: 1200
                },
                {
                    headers: {
                        'Authorization': `Bearer ${GROQ_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000
                }
            );

            aiResponse = groqRes.data?.choices?.[0]?.message?.content;
        } catch (apiErr) {
            console.warn(`Groq primary model (${GROQ_MODEL}) error:`, apiErr.response?.data?.error?.message || apiErr.message);

            // Attempt fallback model
            try {
                console.log(`Trying Groq fallback model: ${GROQ_FALLBACK_MODEL}...`);
                usedModel = GROQ_FALLBACK_MODEL;
                const fallbackRes = await axios.post(
                    GROQ_API_URL,
                    {
                        model: GROQ_FALLBACK_MODEL,
                        messages: messages,
                        temperature: 0.6,
                        max_tokens: 1200
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${GROQ_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 20000
                    }
                );
                aiResponse = fallbackRes.data?.choices?.[0]?.message?.content;
            } catch (fallbackErr) {
                console.error('Groq fallback model also failed:', fallbackErr.response?.data?.error?.message || fallbackErr.message);
            }
        }

        if (!aiResponse) {
            console.warn('All Groq attempts failed, using grounded fallback response.');
            aiResponse = generateFallbackResponse(message);
            isFallback = true;
        }

        res.status(isFallback ? 503 : 200).json({
            response: aiResponse,
            model: usedModel,
            success: !isFallback,
            isFallback
        });

    } catch (error) {
        console.error('Unexpected error in /api/ai-chat:', error);
        res.status(500).json({
            error: 'Gagal memproses jawaban AI.',
            details: error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Proxy server is running' });
});

// Serve the website
app.get('/', (req, res) => {
    res.sendFile(path.join(WEBSITE_ROOT, 'index.html'));
});

// Orders and Admin routes
registerOrderRoutes(app);

// Start server
app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`Aromansa AI Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`==========================================\n`);
});
