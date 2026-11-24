const { createAIResponse } = require('../js/ai-chat-service');

module.exports = async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).json({ error: 'Method tidak diizinkan.' });
    }

    const { message, chatHistory = [] } = req.body || {};
    if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Pesan pertanyaan tidak boleh kosong.' });
    }

    try {
        const result = await createAIResponse(message, chatHistory);
        return res
            .status(result.isFallback ? 503 : 200)
            .json({ ...result, success: !result.isFallback });
    } catch (error) {
        console.error('Unexpected error in Vercel /api/ai-chat:', error);
        return res.status(500).json({ error: 'Gagal memproses jawaban AI.' });
    }
};
