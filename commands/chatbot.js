const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const settings = require('../settings');

const USER_GROUP_DATA = path.join(__dirname, '../data/userGroupData.json');
const CHATBOT_CONFIG = path.join(__dirname, '../data/chatbotConfig.json');

// In-memory storage for chat history and user info
const chatMemory = {
    messages: new Map(), // Stores last 20 messages per user
    userInfo: new Map()  // Stores user information
};

function loadChatbotConfig() {
    try {
        const data = JSON.parse(fs.readFileSync(CHATBOT_CONFIG));
        return {
            apiKey: data.apiKey || settings.aiApiKey,
            provider: data.provider || settings.aiProvider,
            model: data.model || settings.aiModel,
            systemPrompt: data.systemPrompt || settings.aiSystemPrompt,
            endpoint: data.endpoint || settings.aiEndpoint
        };
    } catch (error) {
        return {
            apiKey: settings.aiApiKey,
            provider: settings.aiProvider,
            model: settings.aiModel,
            systemPrompt: settings.aiSystemPrompt,
            endpoint: settings.aiEndpoint
        };
    }
}

function saveChatbotConfig(config) {
    try {
        fs.writeFileSync(CHATBOT_CONFIG, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('❌ Error saving chatbot config:', error.message);
        return false;
    }
}

// Load user group data
function loadUserGroupData() {
    try {
        return JSON.parse(fs.readFileSync(USER_GROUP_DATA));
    } catch (error) {
        console.error('❌ Error loading user group data:', error.message);
        return { groups: [], chatbot: {} };
    }
}

// Save user group data
function saveUserGroupData(data) {
    try {
        fs.writeFileSync(USER_GROUP_DATA, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Error saving user group data:', error.message);
    }
}

// Add random delay between 2-5 seconds
function getRandomDelay() {
    return Math.floor(Math.random() * 3000) + 2000;
}

// Add typing indicator
async function showTyping(sock, chatId) {
    try {
        await sock.presenceSubscribe(chatId);
        await sock.sendPresenceUpdate('composing', chatId);
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
    } catch (error) {
        console.error('Typing indicator error:', error);
    }
}

// Extract user information from messages
function extractUserInfo(message) {
    const info = {};
    
    // Extract name
    if (message.toLowerCase().includes('my name is')) {
        info.name = message.split('my name is')[1].trim().split(' ')[0];
    }
    
    // Extract age
    if (message.toLowerCase().includes('i am') && message.toLowerCase().includes('years old')) {
        info.age = message.match(/\d+/)?.[0];
    }
    
    // Extract location
    if (message.toLowerCase().includes('i live in') || message.toLowerCase().includes('i am from')) {
        info.location = message.split(/(?:i live in|i am from)/i)[1].trim().split(/[.,!?]/)[0];
    }
    
    return info;
}

async function handleChatbotCommand(sock, chatId, message, match) {
    const config = loadChatbotConfig();

    if (!match) {
        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, {
            text: `*CHATBOT CONTROLS*\n\n.chatbot on\n.chatbot off\n.chatbot setkey <api_key>\n.chatbot setmodel <model>\n.chatbot setprompt <system_prompt>\n.chatbot showconfig\n.chatbot status`,
            quoted: message
        });
    }

    const data = loadUserGroupData();

    const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
    const senderId = message.key.participant || message.participant || message.pushName || message.key.remoteJid;
    const isOwner = senderId === botNumber;

    if (isOwner && match.startsWith('setkey ')) {
        const apiKey = match.slice(7).trim();
        if (!apiKey) return sock.sendMessage(chatId, { text: '*Usage:* .chatbot setkey <api_key>', quoted: message });
        config.apiKey = apiKey;
        saveChatbotConfig(config);
        return sock.sendMessage(chatId, { text: '*AI key saved successfully!*', quoted: message });
    }

    if (isOwner && match.startsWith('setmodel ')) {
        const model = match.slice(9).trim();
        if (!model) return sock.sendMessage(chatId, { text: '*Usage:* .chatbot setmodel <model>', quoted: message });
        config.model = model;
        saveChatbotConfig(config);
        return sock.sendMessage(chatId, { text: `*AI model set to:* ${model}`, quoted: message });
    }

    if (isOwner && match.startsWith('setprompt ')) {
        const promptText = match.slice(10).trim();
        if (!promptText) return sock.sendMessage(chatId, { text: '*Usage:* .chatbot setprompt <system_prompt>', quoted: message });
        config.systemPrompt = promptText;
        saveChatbotConfig(config);
        return sock.sendMessage(chatId, { text: '*AI system prompt updated!*', quoted: message });
    }

    if (isOwner && match === 'showconfig') {
        return sock.sendMessage(chatId, { text: `*Chatbot Config*\nProvider: ${config.provider}\nModel: ${config.model}\nAPI Key: ${config.apiKey ? 'set' : 'not set'}\nSystem Prompt: ${config.systemPrompt}`, quoted: message });
    }

    if (match === 'status') {
        const statusText = data.chatbot[chatId] ? 'enabled' : 'disabled';
        return sock.sendMessage(chatId, { text: `*Chatbot is:* ${statusText}`, quoted: message });
    }

    let isAdmin = false;
    if (chatId.endsWith('@g.us')) {
        try {
            const groupMetadata = await sock.groupMetadata(chatId);
            isAdmin = groupMetadata.participants.some(p => p.id === senderId && (p.admin === 'admin' || p.admin === 'superadmin'));
        } catch (e) {
            console.warn('Unable to fetch group metadata for chatbot command.');
        }
    }

    if (!isAdmin && !isOwner) {
        await showTyping(sock, chatId);
        return sock.sendMessage(chatId, { text: 'You must be group admin or owner to manage chatbot.', quoted: message });
    }

    if (match === 'on') {
        data.chatbot[chatId] = true;
        saveUserGroupData(data);
        return sock.sendMessage(chatId, { text: '*Chatbot enabled for this group*', quoted: message });
    }

    if (match === 'off') {
        delete data.chatbot[chatId];
        saveUserGroupData(data);
        return sock.sendMessage(chatId, { text: '*Chatbot disabled for this group*', quoted: message });
    }

    await showTyping(sock, chatId);
    return sock.sendMessage(chatId, { text: '*Invalid .chatbot command.*', quoted: message });
}

async function handleChatbotResponse(sock, chatId, message, userMessage, senderId) {
    const data = loadUserGroupData();
    if (!data.chatbot[chatId]) return;

    try {
        // Get bot's ID - try multiple formats
        const botId = sock.user.id;
        const botNumber = botId.split(':')[0];
        const botLid = sock.user.lid; // Get the actual LID from sock.user
        const botJids = [
            botId,
            `${botNumber}@s.whatsapp.net`,
            `${botNumber}@whatsapp.net`,
            `${botNumber}@lid`,
            botLid, // Add the actual LID
            `${botLid.split(':')[0]}@lid` // Add LID without session part
        ];

        // Check for mentions and replies
        let isBotMentioned = false;
        let isReplyToBot = false;

        // Check if message is a reply and contains bot mention
        if (message.message?.extendedTextMessage) {
            const mentionedJid = message.message.extendedTextMessage.contextInfo?.mentionedJid || [];
            const quotedParticipant = message.message.extendedTextMessage.contextInfo?.participant;
            
            // Check if bot is mentioned in the reply
            isBotMentioned = mentionedJid.some(jid => {
                const jidNumber = jid.split('@')[0].split(':')[0];
                return botJids.some(botJid => {
                    const botJidNumber = botJid.split('@')[0].split(':')[0];
                    return jidNumber === botJidNumber;
                });
            });
            
            // Check if replying to bot's message
            if (quotedParticipant) {
                // Normalize both quoted and bot IDs to compare cleanly
                const cleanQuoted = quotedParticipant.replace(/[:@].*$/, '');
                isReplyToBot = botJids.some(botJid => {
                    const cleanBot = botJid.replace(/[:@].*$/, '');
                    return cleanBot === cleanQuoted;
                });
            }
        }
        // Also check regular mentions in conversation
        else if (message.message?.conversation) {
            isBotMentioned = userMessage.includes(`@${botNumber}`);
        }

        if (!isBotMentioned && !isReplyToBot) return;

        // Clean the message
        let cleanedMessage = userMessage;
        if (isBotMentioned) {
            cleanedMessage = cleanedMessage.replace(new RegExp(`@${botNumber}`, 'g'), '').trim();
        }

        // Initialize user's chat memory if not exists
        if (!chatMemory.messages.has(senderId)) {
            chatMemory.messages.set(senderId, []);
            chatMemory.userInfo.set(senderId, {});
        }

        // Extract and update user information
        const userInfo = extractUserInfo(cleanedMessage);
        if (Object.keys(userInfo).length > 0) {
            chatMemory.userInfo.set(senderId, {
                ...chatMemory.userInfo.get(senderId),
                ...userInfo
            });
        }

        // Add message to history (keep last 5 messages)
        const messages = chatMemory.messages.get(senderId);
        messages.push(cleanedMessage);
        if (messages.length > 20) {
            messages.shift();
        }
        chatMemory.messages.set(senderId, messages);

        // Show typing indicator
        await showTyping(sock, chatId);

        // Get AI response with context
        const response = await getAIResponse(cleanedMessage, {
            messages: chatMemory.messages.get(senderId),
            userInfo: chatMemory.userInfo.get(senderId)
        });

        if (!response) {
            await sock.sendMessage(chatId, { 
                text: "Hmm, let me think about that... 🤔\nI'm having trouble processing your request right now.",
                quoted: message
            });
            return;
        }

        // Add human-like delay before sending response
        await new Promise(resolve => setTimeout(resolve, getRandomDelay()));

        // Send response as a reply with proper context
        await sock.sendMessage(chatId, {
            text: response
        }, {
            quoted: message
        });

    } catch (error) {
        console.error('❌ Error in chatbot response:', error.message);
        
        // Handle session errors - don't try to send error messages
        if (error.message && error.message.includes('No sessions')) {
            console.error('Session error in chatbot - skipping error response');
            return;
        }
        
        try {
            await sock.sendMessage(chatId, { 
                text: "Oops! 😅 I got a bit confused there. Could you try asking that again?",
                quoted: message
            });
        } catch (sendError) {
            console.error('Failed to send chatbot error message:', sendError.message);
        }
    }
}

async function getAIResponse(userMessage, userContext) {
    try {
        const chatbotConfig = loadChatbotConfig();

        const systemPrompt = chatbotConfig.systemPrompt || settings.aiSystemPrompt;
        const conversationSeed = userContext.messages.slice(-10).map((m, idx) => `User${idx + 1}: ${m}`).join('\n');

        // Fallback: use existing public endpoint if no API key exists
        if (!chatbotConfig.apiKey) {
            const prompt = `${systemPrompt}\n\nConversation:\n${conversationSeed}\nUser: ${userMessage}`;
            const fallbackResponse = await fetch(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(prompt)}`);
            if (!fallbackResponse.ok) throw new Error('Fallback API call failed');
            const fallbackData = await fallbackResponse.json();
            return fallbackData.result?.trim() || null;
        }

        // OpenAI-compatible payload for any model
        if (chatbotConfig.provider === 'openai' || chatbotConfig.provider === 'gpt') {
            const payload = {
                model: chatbotConfig.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...userContext.messages.map((msg) => ({ role: 'user', content: msg })),
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.75,
                max_tokens: 500
            };

            const response = await fetch(chatbotConfig.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chatbotConfig.apiKey}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenAI request failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            const aiText = result?.choices?.[0]?.message?.content || result?.choices?.[0]?.text || result?.answer || result?.data;
            if (!aiText) throw new Error('No response text from AI');

            return aiText.toString().trim();
        }

        // For other provider types, use fallback endpoint too
        const fallbackResponse = await fetch(`https://zellapi.autos/ai/chatbot?text=${encodeURIComponent(userMessage)}`);
        if (!fallbackResponse.ok) throw new Error('Fallback API call failed');
        const fallbackData = await fallbackResponse.json();
        return fallbackData.result?.trim() || null;
    } catch (error) {
        console.error('AI API error:', error);
        return null;
    }
}

module.exports = {
    handleChatbotCommand,
    handleChatbotResponse
}; 