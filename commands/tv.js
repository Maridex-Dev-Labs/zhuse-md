async function tvCommand(sock, chatId, message) {
    try {
        const tvUrl = 'https://nexus-tv-global-iptv-platform.vercel.app/';
        const response = `📺 *Stream TV*\n\nClick here to launch:\n${tvUrl}\n\n(If your WhatsApp client supports link previews, it will open in browser.)`;
        await sock.sendMessage(chatId, { text: response }, { quoted: message });
    } catch (error) {
        console.error('Error in tv command:', error);
        await sock.sendMessage(chatId, { text: '❌ Unable to open TV stream link right now.' });
    }
}

module.exports = tvCommand;
