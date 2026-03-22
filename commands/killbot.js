let removedBotsPerGroup = {};

function sanitizeId(id) {
    return id && id.endsWith('@s.whatsapp.net') ? id : `${id}@s.whatsapp.net`;
}

async function killbotCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, { text: 'This command only works in group chats.' }, { quoted: message });
        }

        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants || [];

        const botCandidates = participants.filter(p => {
            const id = p.id || '';
            const name = (p.notify || p.subject || '').toLowerCase();
            return id !== sock.user?.id && (id.toLowerCase().includes('bot') || name.includes('bot'));
        });

        if (!botCandidates.length) {
            return await sock.sendMessage(chatId, { text: 'No other bots detected in this group.' }, { quoted: message });
        }

        const kicked = [];

        for (const bot of botCandidates) {
            try {
                await sock.groupParticipantsUpdate(chatId, [bot.id], 'remove');
                kicked.push(bot.id);
            } catch (e) {
                console.warn('Could not remove bot', bot.id, e.message); // may need admin rights
            }
        }

        if (kicked.length > 0) {
            removedBotsPerGroup[chatId] = kicked;
            await sock.sendMessage(chatId, { text: `✅ Killed ${kicked.length} bot(s):\n${kicked.join('\n')}` }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: 'Could not remove detected bots. Ensure the bot has admin rights.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in killbot command:', error);
        await sock.sendMessage(chatId, { text: '❌ Error while executing killbot.' });
    }
}

async function risebotsCommand(sock, chatId, message) {
    try {
        if (!chatId.endsWith('@g.us')) {
            return await sock.sendMessage(chatId, { text: 'This command only works in group chats.' }, { quoted: message });
        }

        const bots = removedBotsPerGroup[chatId] || [];
        if (!bots.length) {
            return await sock.sendMessage(chatId, { text: 'No bots in recovery list for this group.' }, { quoted: message });
        }

        const restored = [];
        for (const botId of bots) {
            try {
                await sock.groupParticipantsUpdate(chatId, [sanitizeId(botId)], 'add');
                restored.push(botId);
            } catch (e) {
                console.warn('Could not re-add bot', botId, e.message);
            }
        }

        removedBotsPerGroup[chatId] = [];

        if (restored.length) {
            await sock.sendMessage(chatId, { text: `✅ Restored ${restored.length} bot(s):\n${restored.join('\n')}` }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: 'Could not re-add bots (maybe they left permanently).' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in risebots command:', error);
        await sock.sendMessage(chatId, { text: '❌ Error while executing risebots.' });
    }
}

module.exports = { killbotCommand, risebotsCommand };
