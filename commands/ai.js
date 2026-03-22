const axios = require('axios');
const fetch = require('node-fetch');
const settings = require('../settings');

async function aiCommand(sock, chatId, message) {
    try {
        const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
        
        if (!text) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide a question after .gpt or .gemini\n\nExample: .gpt write a basic html code"
            }, {
                quoted: message
            });
        }

        const parts = text.split(' ');
        const command = parts[0].toLowerCase();
        const query = parts.slice(1).join(' ').trim();

        if (!query) {
            return await sock.sendMessage(chatId, { 
                text: "Please provide a question after .gpt or .gemini"
            }, {quoted:message});
        }

        await sock.sendMessage(chatId, {
            react: { text: '*', key: message.key }
        });

        if (command === '.gpt') {
            if (!settings.aiApiKey) {
                return await sock.sendMessage(chatId, {
                    text: 'AI API key is not configured yet. Set it in settings or use .chatbot setkey <key>'.
                }, { quoted: message });
            }

            const payload = {
                model: settings.aiModel,
                messages: [
                    { role: 'system', content: settings.aiSystemPrompt },
                    { role: 'user', content: query }
                ],
                temperature: 0.7,
                max_tokens: 700
            };

            try {
                const response = await axios.post(settings.aiEndpoint, payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${settings.aiApiKey}`
                    }
                });

                const aiText = response.data?.choices?.[0]?.message?.content || response.data?.choices?.[0]?.text;
                if (!aiText) throw new Error('No content from AI');

                return await sock.sendMessage(chatId, { text: aiText.trim() }, { quoted: message });

            } catch (err) {
                console.error('GPT API Error:', err.message);
                return await sock.sendMessage(chatId, { text: 'Unable to contact AI Service. Check API key, model, and internet.' }, { quoted: message });
            }
        }

        if (command === '.gemini') {
            const apis = [
                `https://vapis.my.id/api/gemini?q=${encodeURIComponent(query)}`,
                `https://api.siputzx.my.id/api/ai/gemini-pro?content=${encodeURIComponent(query)}`,
                `https://api.ryzendesu.vip/api/ai/gemini?text=${encodeURIComponent(query)}`,
                `https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(query)}`,
                `https://api.giftedtech.my.id/api/ai/geminiai?apikey=gifted&q=${encodeURIComponent(query)}`,
                `https://api.giftedtech.my.id/api/ai/geminiaipro?apikey=gifted&q=${encodeURIComponent(query)}`
            ];

            for (const api of apis) {
                try {
                    const response = await fetch(api);
                    const data = await response.json();

                    if (data.message || data.data || data.answer || data.result) {
                        const answer = data.message || data.data || data.answer || data.result;
                        await sock.sendMessage(chatId, { text: answer }, { quoted: message });
                        return;
                    }
                } catch (e) {
                    continue;
                }
            }
            throw new Error('All Gemini APIs failed');
        }

        await sock.sendMessage(chatId, { text: 'Unknown AI command. Use .gpt or .gemini' }, { quoted: message });

    } catch (error) {
        console.error('AI Command Error:', error);
        await sock.sendMessage(chatId, {
            text: "An error occurred while processing AI command. Please try again later.",
            contextInfo: {
                mentionedJid: [message.key.participant || message.key.remoteJid],
                quotedMessage: message.message
            }
        }, { quoted: message });
    }
}

module.exports = aiCommand;