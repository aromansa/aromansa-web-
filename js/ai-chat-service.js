const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_FALLBACK_MODEL = 'qwen/qwen3.8-27b';

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

async function createAIResponse(message, chatHistory = []) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.warn('GROQ_API_KEY tidak ditemukan. Menggunakan respons fallback.');
        return { response: generateFallbackResponse(message), isFallback: true };
    }

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    if (Array.isArray(chatHistory)) {
        for (const item of chatHistory.slice(-8)) {
            if (!item || !item.content) continue;
            messages.push({
                role: item.role === 'user' ? 'user' : 'assistant',
                content: String(item.content)
            });
        }
    }
    messages.push({ role: 'user', content: message.trim() });

    const primaryModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
    const models = [...new Set([primaryModel, GROQ_FALLBACK_MODEL])];

    for (const model of models) {
        try {
            const result = await axios.post(
                GROQ_API_URL,
                { model, messages, temperature: 0.6, max_tokens: 1200 },
                {
                    headers: {
                        Authorization: `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 25000
                }
            );
            const response = result.data?.choices?.[0]?.message?.content;
            if (typeof response === 'string' && response.trim()) {
                return { response: response.trim(), model, isFallback: false };
            }
            console.warn(`Groq model ${model} returned an empty response.`);
        } catch (error) {
            console.warn(
                `Groq model ${model} failed:`,
                error.response?.data?.error?.message || error.message
            );
        }
    }

    console.warn('All Groq models failed. Using grounded fallback response.');
    return { response: generateFallbackResponse(message), isFallback: true };
}

module.exports = { createAIResponse };
