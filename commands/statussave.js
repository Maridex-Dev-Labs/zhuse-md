const fs = require('fs');
const path = require('path');
const isOwnerOrSudo = require('../lib/isOwner');

const STATUS_DATA_PATH = path.join(__dirname, '../data/statusSaver.json');

function loadStatusData() {
    try {
        if (fs.existsSync(STATUS_DATA_PATH)) {
            return JSON.parse(fs.readFileSync(STATUS_DATA_PATH));
        }
        return { statuses: [] };
    } catch (error) {
        console.error('Error loading status data:', error);
        return { statuses: [] };
    }
}

function saveStatusData(data) {
    try {
        fs.writeFileSync(STATUS_DATA_PATH, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving status data:', error);
        return false;
    }
}

async function statusSaveCommand(sock, chatId, message, args) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        
        // Load status data
        const data = loadStatusData();
        
        // Check if user has admin-level access
        let isSenderAdmin = false;
        if (isGroup) {
            try {
                const adminCheck = require('../lib/isAdmin');
                const result = await adminCheck(sock, chatId, senderId);
                isSenderAdmin = result.isSenderAdmin;
            } catch (error) {
                isSenderAdmin = false;
            }
        }

        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!args || args.length === 0) {
            const guide = `*STATUS SAVER GUIDE*\n\n` +
                `[*] COMMANDS:\n` +
                `• .statussave add <text> - Save a new status\n` +
                `• .statussave list - View all saved statuses\n` +
                `• .statussave remove <number> - Delete a status\n` +
                `• .statussave clear - Clear all statuses\n\n` +
                `[*] EXAMPLES:\n` +
                `• .statussave add Coding is life\n` +
                `• .statussave list\n` +
                `• .statussave remove 1`;
            
            return await sock.sendMessage(chatId, {
                text: guide,
                ...getChannelInfo()
            }, { quoted: message });
        }

        const command = args[0].toLowerCase();
        const params = args.slice(1);

        switch (command) {
            case 'add': {
                if (!isSenderAdmin && !isOwner && isGroup) {
                    return await sock.sendMessage(chatId, {
                        text: 'You need admin privileges to add statuses.',
                        ...getChannelInfo()
                    }, { quoted: message });
                }
                
                const statusText = params.join(' ').trim();
                if (!statusText) {
                    return await sock.sendMessage(chatId, {
                        text: 'Usage: .statussave add <text>',
                        ...getChannelInfo()
                    }, { quoted: message });
                }

                data.statuses.push({
                    id: Date.now(),
                    text: statusText,
                    addedBy: senderId,
                    addedAt: new Date().toISOString()
                });

                saveStatusData(data);
                return await sock.sendMessage(chatId, {
                    text: `*[•] Status saved!*\n\n"${statusText}"`,
                    ...getChannelInfo()
                }, { quoted: message });
            }

            case 'list': {
                if (data.statuses.length === 0) {
                    return await sock.sendMessage(chatId, {
                        text: '*No statuses saved yet*',
                        ...getChannelInfo()
                    }, { quoted: message });
                }

                let listText = '*SAVED STATUSES*\n\n';
                data.statuses.forEach((status, idx) => {
                    listText += `[${idx + 1}] ${status.text}\n`;
                });
                listText += `\n*Total:* ${data.statuses.length} status(es)`;

                return await sock.sendMessage(chatId, {
                    text: listText,
                    ...getChannelInfo()
                }, { quoted: message });
            }

            case 'remove': {
                if (!isSenderAdmin && !isOwner && isGroup) {
                    return await sock.sendMessage(chatId, {
                        text: 'You need admin privileges to remove statuses.',
                        ...getChannelInfo()
                    }, { quoted: message });
                }

                const idx = parseInt(params[0]) - 1;
                if (isNaN(idx) || idx < 0 || idx >= data.statuses.length) {
                    return await sock.sendMessage(chatId, {
                        text: `Invalid status number. Use .statussave list to view all.`,
                        ...getChannelInfo()
                    }, { quoted: message });
                }

                const removed = data.statuses.splice(idx, 1)[0];
                saveStatusData(data);

                return await sock.sendMessage(chatId, {
                    text: `*[•] Status deleted!*\n\n"${removed.text}"`,
                    ...getChannelInfo()
                }, { quoted: message });
            }

            case 'clear': {
                if (!isOwner && !isSenderAdmin && isGroup) {
                    return await sock.sendMessage(chatId, {
                        text: 'You need admin privileges to clear all statuses.',
                        ...getChannelInfo()
                    }, { quoted: message });
                }

                const count = data.statuses.length;
                data.statuses = [];
                saveStatusData(data);

                return await sock.sendMessage(chatId, {
                    text: `*[•] Cleared!*\n\nRemoved ${count} status(es)`,
                    ...getChannelInfo()
                }, { quoted: message });
            }

            default: {
                return await sock.sendMessage(chatId, {
                    text: 'Unknown command. Use .statussave to see available commands.',
                    ...getChannelInfo()
                }, { quoted: message });
            }
        }

    } catch (error) {
        console.error('Error in statusSave command:', error);
        await sock.sendMessage(chatId, {
            text: `Error: ${error.message}`,
            ...getChannelInfo()
        }, { quoted: message });
    }
}

function getChannelInfo() {
    return {
        contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363161513685998@newsletter',
                newsletterName: 'ZHUSE MD',
                serverMessageId: -1
            }
        }
    };
}

module.exports = statusSaveCommand;
