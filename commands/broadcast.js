const settings = require('../settings');

async function broadcastCommand(sock, chatId, message) {
    try {
        const content = (message.message?.extendedTextMessage?.text || '').trim();
        const textBody = message.message?.extendedTextMessage?.text || '';
        const userMessage = textBody.replace(/^\.broadcast\s*/i, '').trim();

        if (!userMessage) {
            await sock.sendMessage(chatId, { text: 'Usage: .broadcast <message> | <number1,number2,...> (max 30 recipients)' });
            return;
        }

        const parts = userMessage.split('|');
        if (parts.length < 2) {
            await sock.sendMessage(chatId, { text: 'Please provide text and recipient numbers, separated by |.' });
            return;
        }

        const broadcastText = parts[0].trim();
        const rawNumbers = parts[1].trim();
        const recipients = rawNumbers.split(',').map(n => n.replace(/[^0-9]/g, '').trim()).filter(Boolean);

        if (!broadcastText || recipients.length === 0) {
            await sock.sendMessage(chatId, { text: 'Invalid broadcast format.' });
            return;
        }

        if (recipients.length > 30) {
            await sock.sendMessage(chatId, { text: 'Maximum 30 recipients allowed.' });
            return;
        }

        const sentReport = [];

        for (const num of recipients) {
            const target = `${num}@s.whatsapp.net`;
            try {
                await sock.sendMessage(target, { text: `📣 Broadcast from *${settings.botName}*:\n\n${broadcastText}` });
                sentReport.push(`${num}: ✅`);
            } catch (e) {
                sentReport.push(`${num}: ❌`);
            }
        }

        await sock.sendMessage(chatId, { text: `Broadcast complete:\n${sentReport.join('\n')}` }, { quoted: message });
    } catch (error) {
        console.error('Error in broadcast command:', error);
        await sock.sendMessage(chatId, { text: '❌ Broadcast failed.' });
    }
}

module.exports = broadcastCommand;
