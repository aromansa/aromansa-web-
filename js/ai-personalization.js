(function () {
    'use strict';

    // ===== OpenRouter Configuration =====
    const API_KEY = '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';

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

    // ===== DOM Elements =====
    const chatMessages = document.getElementById('chatMessages');
    const chatInput = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearChatBtn = document.getElementById('clearChatBtn');
    const toggleFullscreenBtn = document.getElementById('toggleFullscreenBtn');
    const quickActionBtns = document.querySelectorAll('.quick-btn-modern');
    const aiChatContainer = document.getElementById('chatContainer');

    // ===== Chat History =====
    let chatHistory = [];
    let isDemoMode = false;

    // ===== Initialize =====
    function init() {
        loadChatHistory();
        setupEventListeners();
        autoResizeTextarea();
    }

    // ===== Event Listeners =====
    function setupEventListeners() {
        sendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        clearChatBtn.addEventListener('click', clearChat);
        if (toggleFullscreenBtn && aiChatContainer) {
            toggleFullscreenBtn.addEventListener('click', function () {
                aiChatContainer.classList.toggle('chat-fullscreen');
                document.body.classList.toggle('chat-fullscreen-active');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.className = aiChatContainer.classList.contains('chat-fullscreen')
                        ? 'fa fa-compress'
                        : 'fa fa-expand';
                }
            });
        }

        quickActionBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const prompt = this.getAttribute('data-prompt');
                chatInput.value = prompt;
                sendMessage();
            });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && aiChatContainer && aiChatContainer.classList.contains('chat-fullscreen')) {
                aiChatContainer.classList.remove('chat-fullscreen');
                document.body.classList.remove('chat-fullscreen-active');
                if (toggleFullscreenBtn) {
                    const icon = toggleFullscreenBtn.querySelector('i');
                    if (icon) icon.className = 'fa fa-expand';
                }
            }
        });
    }

    // ===== Auto-resize Textarea =====
    function autoResizeTextarea() {
        chatInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 150) + 'px';
        });
    }

    // ===== Send Message =====
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addUserMessage(message);
        chatInput.value = '';
        chatInput.style.height = 'auto';

        // Show typing indicator
        showTypingIndicator();

        try {
            // Call OpenRouter API
            const response = await callOpenRouterAPI(message);
            removeTypingIndicator();

            // Add AI response to chat
            addAIMessage(response);

            // Update chat history
            chatHistory.push({ role: 'user', content: message });
            chatHistory.push({ role: 'ai', content: response });
            saveChatHistory();
        } catch (error) {
            removeTypingIndicator();
            
            // If API fails, use fallback response generator
            console.warn('API failed, using fallback response:', error.message);
            const fallbackResponse = generateFallbackResponse(message);
            addAIMessage(fallbackResponse);
            
            // Still save to chat history
            chatHistory.push({ role: 'user', content: message });
            chatHistory.push({ role: 'ai', content: fallbackResponse });
            saveChatHistory();
        }
    }

    // ===== Fallback Response Generator =====
    function generateFallbackResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        let oilType = 'general';
        if (message.includes('single oil') || message.includes('single-oils')) oilType = 'single-oils';
        else if (message.includes('roll-on') || message.includes('roll on')) oilType = 'roll-on';
        else if (message.includes('spray')) oilType = 'spray';
        else if (message.includes('relax') || message.includes('sleep') || message.includes('tidur') || message.includes('stress')) oilType = 'relaxation';
        else if (message.includes('energy') || message.includes('focus') || message.includes('energi') || message.includes('konsentrasi')) oilType = 'energy';
        else if (message.includes('skin') || message.includes('kulit') || message.includes('acne') || message.includes('jerawat')) oilType = 'skincare';
        else if (message.includes('headache') || message.includes('sakit kepala') || message.includes('pain')) oilType = 'pain relief';
        else if (message.includes('immune') || message.includes('immunity') || message.includes('kekebalan')) oilType = 'immunity';
        else if (message.includes('diffuser') || message.includes('aromatherapy')) oilType = 'diffuser';
        
        const responses = {
            'single-oils': `**🧪 Aromansa Single Oil Collection**

Berikut koleksi **Single Essential Oil** kami - 100% pure & therapeutic grade!

━━━━━━━━━━━━━━━━━━━━

**💜 Lavender Essential Oil**
▸ Size: 10ml
▸ Price: **Rp65.000**
▸ Benefits: Relaxation, sleep, stress relief, calming

**🌱 Peppermint Essential Oil**
▸ Size: 10ml
▸ Price: **Rp55.000**
▸ Benefits: Energy, focus, headache relief, digestion

**🍊 Sweet Orange Essential Oil**
▸ Size: 10ml
▸ Price: **Rp45.000**
▸ Benefits: Uplifting, immune support, fresh scent

**🌺 Frangipani Essential Oil**
▸ Size: 10ml
▸ Price: **Rp75.000**
▸ Benefits: Exotic relaxation, spa treatments, luxury aroma

**🍋 Lemon Essential Oil**
▸ Size: 10ml
▸ Price: **Rp45.000**
▸ Benefits: Cleansing, mood booster, air purifier

**🌾 Palmarosa Essential Oil**
▸ Size: 10ml
▸ Price: **Rp75.000**
▸ Benefits: Skincare, moisture balance, calming

**🌿 Lemongrass Essential Oil**
▸ Size: 10ml
▸ Price: **Rp45.000**
▸ Benefits: Deodorizer, insect repellent, digestive

**🍃 Spearmint Essential Oil**
▸ Size: 10ml
▸ Price: **Rp55.000**
▸ Benefits: Mild minty freshness, children-safe, digestion

**💨 Eucalyptus Essential Oil**
▸ Size: 10ml
▸ Price: **Rp40.000**
▸ Benefits: Respiratory health, congestion relief, fresh air

**🌸 Ylang-Ylang Essential Oil**
▸ Size: 10ml
▸ Price: **Rp70.000**
▸ Benefits: Mood enhancer, romantic, stress relief

━━━━━━━━━━━━━━━━━━━━

**💡 Best Sellers:**
🥇 Lavender - #1 for relaxation
🥈 Peppermint - #1 for energy
🥉 Lemon - Best value!

**🛒 Ready to order?**
📱 WhatsApp: +62 857-8290-9266
🛍️ Shopee: https://shopee.co.id/aromansa_id`,

            'roll-on': `**💧 Aromansa Roll-On Collection**

Praktis & siap pakai! Perfect untuk on-the-go wellness.

━━━━━━━━━━━━━━━━━━━━

**🌿 Gandapura Roll-On**
▸ Size: 10ml
▸ Price: **Rp30.000**
▸ Benefits: Muscle relief, joint pain, targeted application
▸ Usage: Roll on sore muscles, neck, shoulders

**🍃 Peppermint Roll-On**
▸ Size: 10ml
▸ Price: **Rp30.000**
▸ Benefits: Headache relief, energy boost, focus
▸ Usage: Roll on temples, wrists, back of neck

━━━━━━━━━━━━━━━━━━━━

**✨ Roll-On Advantages:**
✅ Pre-diluted - ready to use
✅ No mess application
✅ Portable & travel-friendly
✅ Targeted relief
✅ Perfect for beginners

**💡 How to Use:**
1. Shake well before use
2. Roll onto desired area
3. Gently massage into skin
4. Reapply as needed

**🛒 Get yours now!**
📱 WhatsApp: +62 857-8290-9266
🛍️ Shopee: https://shopee.co.id/aromansa_id`,

            'spray': `**✨ Aromansa Spray Collection**

Pre-mixed & ready to spray! Perfect untuk room freshener & linen spray.

━━━━━━━━━━━━━━━━━━━━

**💜 Lavender Spray**
▸ Size: 100ml
▸ Price: **Rp45.000**
▸ Benefits: Pillow mist, room freshener, relaxation
▸ Usage: Spray on pillows, linens, bedroom

**🍃 Peppermint Spray**
▸ Size: 100ml
▸ Price: **Rp45.000**
▸ Benefits: Air freshener, energizing, odor elimination
▸ Usage: Spray in rooms, office, car

━━━━━━━━━━━━━━━━━━━━

**✨ Spray Advantages:**
✅ Pre-diluted formula
✅ Wide coverage area
✅ Perfect for large spaces
✅ Easy to use
✅ Family-friendly

**💡 How to Use:**
1. Shake well before spraying
2. Hold 20-30cm from surface
3. Spray 2-3 times
4. Enjoy the aroma!

**🛒 Order now!**
📱 WhatsApp: +62 857-8290-9266
🛍️ Shopee: https://shopee.co.id/aromansa_id`,

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

🛒 Belanja di Shopee: https://shopee.co.id/aromansa_id`,

            energy: `**⚡ Rekomendasi Aromansa untuk Energi & Fokus**

**🌟 Essential Oil Terbaik:**

1. **Peppermint** (10ml) - Rp 110.000 - Instant energy
2. **Lemon** (10ml) - Rp 95.000 - Uplifting & cleansing
3. **Rosemary** (10ml) - Rp 135.000 - Memory & focus

**🎁 Paket Produktivitas:** Rp 310.000 (Hemat 15%)

**💡 Focus Roller Blend:** 3 drops Peppermint + 3 Lemon + 4 Rosemary + Jojoba Oil

🛒 Order di Shopee: https://shopee.co.id/aromansa_id`,

            skincare: `**🌸 Rekomendasi Aromansa untuk Skincare**

**✨ Essential Oil Terbaik:**

1. **Tea Tree** (10ml) - Rp 105.000 - #1 untuk acne
2. **Lavender** (10ml) - Rp 125.000 - Healing & soothing
3. **Frankincense** (10ml) - Rp 285.000 - Anti-aging

**🎁 Paket Glowing Skin:** Rp 505.000 (Hemat 15%)

**⚠️ Selalu dilute dengan carrier oil! Patch test 24 jam!**

🛒 Belanja di Shopee: https://shopee.co.id/aromansa_id`,

            'pain relief': `**💆 Rekomendasi Aromansa untuk Pain Relief**

**🌟 Essential Oil:**

1. **Peppermint** (10ml) - Rp 110.000 - Headache relief
2. **Eucalyptus** (10ml) - Rp 95.000 - Joint pain
3. **Lavender** (10ml) - Rp 125.000 - Muscle relaxant

**🎁 Paket Pain Relief:** Rp 323.000

🛒 Order di Shopee: https://shopee.co.id/aromansa_id`,

            immunity: `**🛡️ Rekomendasi Aromansa untuk Immune Support**

**🌟 Essential Oil:**

1. **Tea Tree** (10ml) - Rp 105.000 - Antimicrobial
2. **Lemon** (10ml) - Rp 95.000 - Antioxidants
3. **Eucalyptus** (10ml) - Rp 95.000 - Respiratory

**🎁 Paket Immunity Shield:** Rp 357.000

🛒 Belanja di Shopee: https://shopee.co.id/aromansa_id`,

            diffuser: `**🌈 Panduan Diffuser Aromansa**

**📦 Diffuser:**
• Basic (300ml) - Rp 175.000
• Premium (500ml, timer) - Rp 285.000
• Nebulizing (no water) - Rp 450.000

**🎁 Starter Bundle:** Diffuser + 5 Oils = Rp 658.000 (Hemat 15%)

🛒 Order di Shopee: https://shopee.co.id/aromansa_id`,

            general: `**🌿 Selamat datang di Aromansa!**

Saya siap membantu! Ceritakan kebutuhan Anda:

• Relaksasi & tidur?
• Energi & fokus?
• Skincare natural?
• Pain relief?
• Immune support?

**🌟 Popular:** Lavender, Lemon, Tea Tree, Peppermint, Eucalyptus

🛒 WhatsApp: +62 857-8290-9266`
        };
        
        return responses[oilType] || responses.general;
    }

    // ===== Call OpenRouter API =====
    async function callOpenRouterAPI(userMessage) {
        // Build conversation context
        const messages = [];

        // Add system prompt
        messages.push({
            role: 'system',
            content: SYSTEM_PROMPT
        });

        // Add chat history (last 10 messages for context)
        const recentHistory = chatHistory.slice(-10);
        for (const msg of recentHistory) {
            if (msg.role === 'user') {
                messages.push({
                    role: 'user',
                    content: msg.content
                });
            } else if (msg.role === 'ai') {
                messages.push({
                    role: 'assistant',
                    content: msg.content
                });
            }
        }

        // Add current message
        messages.push({
            role: 'user',
            content: userMessage
        });

        const requestBody = {
            model: 'meta-llama/llama-3-8b-instruct:free',
            messages: messages,
            temperature: 0.7,
            max_tokens: 2048
        };

        console.log('Calling OpenRouter API...');

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.origin,
                'X-Title': 'Aromansa AI Consultant'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('OpenRouter DeepSeek response:', data);
        
        return data.choices[0].message.content;
    }

    // ===== Show Demo Mode Notification =====
    function showDemoModeNotification() {
        // Check if notification already exists
        if (document.getElementById('demoModeNotification')) {
            return;
        }

        const notification = document.createElement('div');
        notification.id = 'demoModeNotification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 15px 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: start; gap: 10px;">
                <div style="font-size: 24px;">ℹ️</div>
                <div style="flex: 1;">
                    <h5 style="margin: 0 0 5px 0; color: #856404; font-weight: 600;">Demo Mode Active</h5>
                    <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.4;">
                        AI API quota exceeded. Using demo mode with pre-built responses. 
                        All features still work!
                    </p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: none; border: none; cursor: pointer; font-size: 18px; color: #856404; padding: 0; line-height: 1;">
                    ×
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 10000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===== Add User Message =====
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user-message';
        messageDiv.innerHTML = `
            <div class="message-content-modern">
                <div class="message-avatar-modern">
                    <i class="fa fa-user"></i>
                </div>
                <div class="message-bubble">${escapeHtml(message)}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // ===== Add AI Message =====
    function addAIMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message ai-message';
        messageDiv.innerHTML = `
            <div class="message-content-modern">
                <div class="message-avatar-modern">
                    <i class="fa fa-robot"></i>
                </div>
                <div class="message-bubble">${formatMessage(message)}</div>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // ===== Show Typing Indicator =====
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator-modern';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar-modern">
                <i class="fa fa-robot"></i>
            </div>
            <div class="typing-dots-modern">
                <span class="typing-dot-modern"></span>
                <span class="typing-dot-modern"></span>
                <span class="typing-dot-modern"></span>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // ===== Remove Typing Indicator =====
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // ===== Format Message =====
    function formatMessage(text) {
        // Convert markdown-like syntax to HTML
        let formatted = escapeHtml(text);

        // Bold: **text** or __text__
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Italic: *text* or _text_
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');

        // Line breaks
        formatted = formatted.replace(/\n/g, '<br>');

        // Bullet points
        formatted = formatted.replace(/•/g, '&bull;');
        formatted = formatted.replace(/▸/g, '&rarr;');

        // Horizontal rules
        formatted = formatted.replace(/─{3,}/g, '<hr style="margin: 15px 0; border: none; border-top: 1px solid rgba(102, 126, 234, 0.2);">');

        // Numbered lists
        formatted = formatted.replace(/(\d+)\.\s/g, '<br>$1. ');

        return formatted;
    }

    // ===== Escape HTML =====
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== Scroll to Bottom =====
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ===== Clear Chat =====
    function clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            chatHistory = [];
            localStorage.removeItem('aiChatHistory');

            // Remove all messages
            chatMessages.innerHTML = '';

            // Add welcome message again
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'chat-message ai-message';
            welcomeDiv.innerHTML = `
                <div class="message-content-modern">
                    <div class="message-avatar-modern">
                        <i class="fa fa-robot"></i>
                    </div>
                    <div class="message-bubble">
                        <p>Chat history cleared! How can I help you with your essential oil journey?</p>
                    </div>
                </div>
            `;
            chatMessages.appendChild(welcomeDiv);
        }
    }

    // ===== Save Chat History =====
    function saveChatHistory() {
        try {
            localStorage.setItem('aiChatHistory', JSON.stringify(chatHistory));
        } catch (e) {
            console.error('Failed to save chat history:', e);
        }
    }

    // ===== Load Chat History =====
    function loadChatHistory() {
        try {
            const saved = localStorage.getItem('aiChatHistory');
            if (saved) {
                chatHistory = JSON.parse(saved);
                
                // Recreate messages in DOM
                chatHistory.forEach(msg => {
                    if (msg.role === 'user') {
                        addUserMessage(msg.content);
                    } else if (msg.role === 'ai') {
                        addAIMessage(msg.content);
                    }
                });
            }
        } catch (e) {
            console.error('Failed to load chat history:', e);
            chatHistory = [];
        }
    }

    // ===== Initialize on DOM ready =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
