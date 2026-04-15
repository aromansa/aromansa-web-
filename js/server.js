const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname)));

// ===== Google Gemini API Configuration =====
const GEMINI_API_KEY = 'AIzaSyBSmd2DBkgVKpZDhfnSHNXKME2f1G0r-NI';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// ===== System Prompt =====
const SYSTEM_PROMPT = `You are an AI aromatherapy and essential oil consultant for Aromansa, a premium essential oils retail brand in Indonesia.

Your expertise includes:
1. Recommending essential oils based on user needs (relaxation, energy, focus, sleep, skincare, etc.)
2. Creating custom essential oil blends and recipes
3. Providing safe usage guidelines and dilution ratios
4. Suggesting aromatherapy techniques (diffusion, topical application, inhalation)
5. Answering questions about essential oil properties and benefits

Popular essential oils and their benefits:
- Lavender: Relaxation, sleep, stress relief, calming (Rp 85,000 - 150,000 / 10ml)
- Tea Tree: Antimicrobial, acne treatment, immune support (Rp 75,000 - 135,000 / 10ml)
- Eucalyptus: Respiratory health, congestion relief, fresh air (Rp 70,000 - 125,000 / 10ml)
- Peppermint: Energy, focus, headache relief, digestion (Rp 80,000 - 145,000 / 10ml)
- Lemon: Uplifting, cleansing, immune support, fresh scent (Rp 65,000 - 120,000 / 10ml)
- Rosemary: Memory, focus, hair growth, circulation (Rp 90,000 - 160,000 / 10ml)
- Frankincense: Meditation, skincare, anti-aging, spiritual (Rp 180,000 - 350,000 / 10ml)
- Ylang Ylang: Mood enhancer, romantic, stress relief (Rp 95,000 - 170,000 / 10ml)
- Chamomile: Calming, sleep, sensitive skin, children (Rp 120,000 - 220,000 / 10ml)
- Sweet Orange: Joy, energy, immune support, uplifting (Rp 70,000 - 130,000 / 10ml)

Carrier oils and accessories:
- Jojoba Oil: Carrier oil, moisturizer (Rp 85,000 / 30ml)
- Coconut Oil: Carrier oil, skin & hair care (Rp 65,000 / 100ml)
- Sweet Almond Oil: Carrier oil, massage, skincare (Rp 75,000 / 30ml)
- Essential Oil Diffuser: Various models (Rp 150,000 - 500,000)
- Roller Bottles: For topical blends (Rp 25,000 - 45,000)

Guidelines:
- Always prioritize safety: recommend patch tests and proper dilution (typically 2-3% for adults)
- Ask about user's specific needs, health conditions, and preferences
- Suggest beginner-friendly options for newcomers
- Provide specific product recommendations with quantities and prices
- Explain the difference between therapeutic grade and regular oils
- Warn about oils that are phototoxic or not safe for children/pregnancy
- Create custom blend recipes with exact drops and ratios
- Be warm, knowledgeable, and passionate about aromatherapy
- Respond in Indonesian (Bahasa Indonesia) or English based on user's language
- Always include a call-to-action to shop at Aromansa for quality products
- Keep responses educational, friendly, and comprehensive

Remember: Essential oils are natural but powerful. Always emphasize responsible usage.`;

// ===== Fallback Response Generator (when API is unavailable) =====
function generateFallbackResponse(userMessage, chatHistory) {
    const message = userMessage.toLowerCase();
    
    let oilType = 'general';
    if (message.includes('relax') || message.includes('sleep') || message.includes('tidur') || message.includes('stress')) oilType = 'relaxation';
    else if (message.includes('energy') || message.includes('focus') || message.includes('energi') || message.includes('konsentrasi')) oilType = 'energy';
    else if (message.includes('skin') || message.includes('kulit') || message.includes('acne') || message.includes('jerawat')) oilType = 'skincare';
    else if (message.includes('headache') || message.includes('sakit kepala') || message.includes('pain')) oilType = 'pain relief';
    else if (message.includes('immune') || message.includes('immunity') || message.includes('kekebalan')) oilType = 'immunity';
    else if (message.includes('diffuser') || message.includes('aromatherapy')) oilType = 'diffuser';
    
    const responses = {
        relaxation: `**🌿 Rekomendasi Aromansa untuk Relaksasi & Tidur Nyenyak**

Terima kasih telah bertanya! Berikut rekomendasi kami:

**✨ Essential Oil Terbaik:**

1. **Lavender** (10ml) - Rp 125.000 - #1 untuk relaksasi & tidur
2. **Chamomile** (10ml) - Rp 185.000 - Menenangkan anxiety
3. **Ylang Ylang** (10ml) - Rp 135.000 - Mood enhancer

**🎁 Paket Relaksasi:** Lavender + Chamomile + Diffuser = Rp 378.000 (Hemat 15%)

**💡 Tips:**
✓ Diffuse 30 menit sebelum tidur
✓ 3 tetes lavender + 10ml jojoba oil untuk minyak pijat
✓ Patch test terlebih dahulu

🛒 WhatsApp: +62 812-3456-7890`,

        energy: `**⚡ Rekomendasi Aromansa untuk Energi & Fokus**

**🌟 Essential Oil Terbaik:**

1. **Peppermint** (10ml) - Rp 110.000 - Instant energy
2. **Lemon** (10ml) - Rp 95.000 - Uplifting & cleansing
3. **Rosemary** (10ml) - Rp 135.000 - Memory & focus

**🎁 Paket Produktivitas:** Rp 310.000 (Hemat 15%)

**💡 Focus Roller Blend:** 3 drops Peppermint + 3 Lemon + 4 Rosemary + Jojoba Oil

🛒 Order: +62 812-3456-7890`,

        skincare: `**🌸 Rekomendasi Aromansa untuk Skincare**

**✨ Essential Oil Terbaik:**

1. **Tea Tree** (10ml) - Rp 105.000 - #1 untuk acne
2. **Lavender** (10ml) - Rp 125.000 - Healing & soothing
3. **Frankincense** (10ml) - Rp 285.000 - Anti-aging

**🎁 Paket Glowing Skin:** Rp 505.000 (Hemat 15%)

**⚠️ Selalu dilute dengan carrier oil! Patch test 24 jam!**

🛒 WhatsApp: +62 812-3456-7890`,

        'pain relief': `**💆 Rekomendasi Aromansa untuk Pain Relief**

**🌟 Essential Oil:**

1. **Peppermint** (10ml) - Rp 110.000 - Headache relief
2. **Eucalyptus** (10ml) - Rp 95.000 - Joint pain
3. **Lavender** (10ml) - Rp 125.000 - Muscle relaxant

**🎁 Paket Pain Relief:** Rp 323.000

🛒 Order: +62 812-3456-7890`,

        immunity: `**🛡️ Rekomendasi Aromansa untuk Immune Support**

**🌟 Essential Oil:**

1. **Tea Tree** (10ml) - Rp 105.000 - Antimicrobial
2. **Lemon** (10ml) - Rp 95.000 - Antioxidants
3. **Eucalyptus** (10ml) - Rp 95.000 - Respiratory

**🎁 Paket Immunity Shield:** Rp 357.000

🛒 WhatsApp: +62 812-3456-7890`,

        diffuser: `**🌈 Panduan Diffuser Aromansa**

**📦 Diffuser:**
• Basic (300ml) - Rp 175.000
• Premium (500ml, timer) - Rp 285.000
• Nebulizing (no water) - Rp 450.000

**🎁 Starter Bundle:** Diffuser + 5 Oils = Rp 658.000 (Hemat 15%)

🛒 Order: +62 812-3456-7890`,

        general: `**🌿 Selamat datang di Aromansa!**

Saya siap membantu! Ceritakan kebutuhan Anda:

• Relaksasi & tidur?
• Energi & fokus?
• Skincare natural?
• Pain relief?
• Immune support?

**🌟 Popular:** Lavender, Lemon, Tea Tree, Peppermint, Eucalyptus

🛒 WhatsApp: +62 812-3456-7890`
    };
    
    return responses[oilType] || responses.general;
}

// ===== API Endpoint =====
app.post('/api/ai-chat', async (req, res) => {
    try {
        const { message, chatHistory = [] } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Build conversation context from chat history
        const contents = [];

        // Add system prompt as first message
        contents.push({
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT }]
        });
        contents.push({
            role: 'model',
            parts: [{ text: 'I understand. I will help users with personalized essential oil recommendations from Aromansa.' }]
        });

        // Add chat history (last 10 messages for context)
        const recentHistory = chatHistory.slice(-10);
        for (const msg of recentHistory) {
            if (msg.role === 'user') {
                contents.push({
                    role: 'user',
                    parts: [{ text: msg.content }]
                });
            } else if (msg.role === 'ai') {
                contents.push({
                    role: 'model',
                    parts: [{ text: msg.content }]
                });
            }
        }

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: message }]
        });

        const requestBody = {
            contents: contents,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                topK: 40,
                topP: 0.95
            }
        };

        console.log('Calling Gemini API...');

        let aiResponse;
        let isDemoMode = false;
        
        try {
            // Retry logic with exponential backoff
            const maxRetries = 2;
            let lastError = null;
            
            for (let attempt = 0; attempt <= maxRetries; attempt++) {
                try {
                    const response = await axios.post(
                        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
                        requestBody,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            timeout: 30000
                        }
                    );

                    console.log('Gemini API response received');
                    aiResponse = response.data.candidates[0].content.parts[0].text;
                    break; // Success, exit retry loop
                } catch (apiError) {
                    lastError = apiError;
                    
                    // Check if it's a quota/rate limit error
                    const isQuotaError = apiError.response?.data?.error?.message?.includes('quota') ||
                                         apiError.response?.data?.error?.message?.includes('rate limit') ||
                                         apiError.response?.status === 429 ||
                                         apiError.response?.status === 403;
                    
                    if (isQuotaError) {
                        console.warn(`⚠️  Gemini API quota exceeded on attempt ${attempt + 1}/${maxRetries + 1}`);
                        
                        // If we have retries left, wait and try again
                        if (attempt < maxRetries) {
                            const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s
                            console.log(`⏳ Waiting ${waitTime}ms before retry...`);
                            await new Promise(resolve => setTimeout(resolve, waitTime));
                            continue;
                        }
                        
                        // All retries exhausted, use fallback
                        console.warn('💡 All retries exhausted. Using fallback response generator.');
                        console.warn('💡 To fix permanently: Update your Google Cloud billing or get a new API key');
                        
                        aiResponse = generateFallbackResponse(message, chatHistory);
                        isDemoMode = true;
                        break;
                    } else {
                        // Not a quota error, re-throw immediately
                        throw apiError;
                    }
                }
            }
        } catch (error) {
            // Unexpected error (not quota-related)
            console.error('Unexpected API error:', error.response?.data || error.message);
            throw error;
        }

        res.json({ response: aiResponse, isDemoMode: isDemoMode });

    } catch (error) {
        console.error('Error calling Gemini API:', error.response?.data || error.message);
        
        // More detailed error logging
        if (error.response?.data) {
            console.error('API Error Details:', JSON.stringify(error.response.data, null, 2));
        }

        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: error.response?.data?.error?.message || error.message
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Proxy server is running' });
});

// Serve the website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-personalization.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`\n==========================================`);
    console.log(`Aromansa AI Server running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
    console.log(`==========================================\n`);
});
