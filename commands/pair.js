const axios = require('axios');
const { sleep } = require('../lib/myfunc');
const isOwnerOrSudo = require('../lib/isOwner');

// Rate limiting: simple in-memory store
const pairRequests = new Map();

function isRateLimited(userId) {
    const now = Date.now();
    const userRequests = pairRequests.get(userId) || [];
    // Keep only requests from last hour
    const recent = userRequests.filter(time => now - time < 60 * 60 * 1000);
    pairRequests.set(userId, recent);
    return recent.length >= 5; // Max 5 per hour
}

function addRequest(userId) {
    const now = Date.now();
    const userRequests = pairRequests.get(userId) || [];
    userRequests.push(now);
    pairRequests.set(userId, userRequests);
}

async function pairCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = message.key.fromMe || isOwnerOrSudo(senderId);

        if (!isOwner) {
            return await sock.sendMessage(chatId, {
                text: "❌ Only the bot owner can generate pairing codes.",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        const text = (message.message?.extendedTextMessage?.text || '').trim();
        const args = text.replace(/^\.pair\s*/i, '').trim().split(/\s+/);

        if (args.length === 0 || args[0] === '') {
            return await sock.sendMessage(chatId, {
                text: "Usage:\n• .pair <phone_number> (e.g., 1234567890)\n• .pair share (generate shareable code)\n\nMax 5 requests per hour.",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        if (isRateLimited(senderId)) {
            return await sock.sendMessage(chatId, {
                text: "⏰ Rate limit exceeded. Max 5 pairing requests per hour. Try again later.",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        const mode = args[0].toLowerCase();

        if (mode === 'share') {
            // Generate a temporary shareable code
            const tempCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            addRequest(senderId);
            return await sock.sendMessage(chatId, {
                text: `🔗 *Shareable Pairing Code*\n\n\`\`\`${tempCode}\`\`\`\n\nValid for 5 minutes. Share this code with others to help them add ZHUSE MD to their WhatsApp.\n\n⚠️ Use within 60 seconds of pairing in WhatsApp.\n\nFor support: ${global.channelLink}`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        // Specific number mode
        const number = args[0].replace(/[^0-9]/g, '');
        if (!number || number.length < 10 || number.length > 15) {
            return await sock.sendMessage(chatId, {
                text: "❌ Invalid phone number. Please provide a valid number (10-15 digits).",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        const whatsappID = number + '@s.whatsapp.net';
        const result = await sock.onWhatsApp(whatsappID);

        if (!result[0]?.exists) {
            return await sock.sendMessage(chatId, {
                text: `❌ That number is not registered on WhatsApp.`,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }

        addRequest(senderId);

        await sock.sendMessage(chatId, {
            text: "⏳ Generating pairing code...",
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'ZHUSE MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });

        try {
            const response = await axios.get(`https://zhuse-md-paircode.onrender.com/code?number=${number}`, { timeout: 10000 });

            if (response.data && response.data.code) {
                const code = response.data.code;
                if (code === "Service Unavailable") {
                    throw new Error('Service Unavailable');
                }

                await sleep(2000);
                await sock.sendMessage(chatId, {
                    text: `✅ *Pairing Code Generated*\n\n📱 Number: +${number}\n🔑 Code: \`\`\`${code}\`\`\`\n\n⚠️ Use this code in WhatsApp within 60 seconds to add ZHUSE MD to your account.\n\nFor support: ${global.channelLink}`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363161513685998@newsletter',
                            newsletterName: 'ZHUSE MD',
                            serverMessageId: -1
                        }
                    }
                }, { quoted: message });
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (apiError) {
            console.error('API Error:', apiError);
            const errorMessage = apiError.code === 'ECONNABORTED'
                ? "⏰ Request timed out. Please try again."
                : apiError.message === 'Service Unavailable'
                ? "🔧 Pairing service is currently unavailable. Please try again later."
                : "❌ Failed to generate pairing code. Please try again later.";

            await sock.sendMessage(chatId, {
                text: errorMessage,
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363161513685998@newsletter',
                        newsletterName: 'ZHUSE MD',
                        serverMessageId: -1
                    }
                }
            }, { quoted: message });
        }
    } catch (error) {
        console.error('Pair command error:', error);
        await sock.sendMessage(chatId, {
            text: "❌ An unexpected error occurred. Please try again later.",
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363161513685998@newsletter',
                    newsletterName: 'ZHUSE MD',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    }
}

module.exports = pairCommand; 