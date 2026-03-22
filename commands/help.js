const settings = require('../settings');
const fs = require('fs');
const path = require('path');

// Menu style options
const MENU_STYLES = {
    modern: (version, owner, link) => `
╔══════════════════════════════╗
║    *✨ ZHUSE MD COMMAND HUB ✨*    
║    Version: *${version}*     
║    Owner: *${owner}*    
║    Status: *Online*    
║    Channel: ${link}
╚══════════════════════════════╝

[🚀] Available command categories:`,
    
    elegant: (version, owner, link) => `
*═══════════════════════════════════*
    ✨ ZHUSE MD COMMAND HUB ✨
*═══════════════════════════════════*

Version: ${version}
Owner: ${owner}
Status: 🟢 Online
Channel: ${link}

*Available Commands:*`,
    
    minimal: (version, owner, link) => `*ZHUSE MD - COMMAND MENU*

Version: ${version}
Owner: ${owner}
Status: Online
Channel: ${link}

*Commands:*`,
    
    gaming: (version, owner, link) => `
╔════════════════════════════════╗
║  🎮 ZHUSE MD COMMAND REPOSITORY 🎮
║  
║  ⚡ Version: ${version}
║  👤 Owner: ${owner}
║  🟢 Status: ONLINE
║  📱 Channel: ${link}
╚════════════════════════════════╝

*🎯 COMMAND CATEGORIES:*`,
    
    neon: (version, owner, link) => `
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃ 💫 ZHUSE MD ✧ COMMAND HUB 💫
┃ Version: ${version}
┃ Owner: ${owner}
┃ Status: 🟢 ONLINE
┃ Channel: ${link}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

*Available Categories:*`,

    premium: (version, owner, link) => `
●━━━━━━━━━━━━━━━━━━━━━━━━━━━━●
  ✨ ZHUSE MD - PREMIUM COMMANDS ✨
●━━━━━━━━━━━━━━━━━━━━━━━━━━━━●

┌ Version: ${version}
├ Owner: ${owner}
├ Status: Active
└ Channel: ${link}

*📋 Command Categories:*`
};

// Command categories list
function getCommandsList() {
    return `
[📘] General
  • .help / .menu
  • .ping
  • .alive
  • .tts <text>
  • .owner
  • .joke
  • .quote
  • .fact
  • .weather <city>
  • .news
  • .attp <text>
  • .lyrics <song_title>
  • .8ball <question>
  • .groupinfo
  • .staff / .admins
  • .vv
  • .trt <text> <lang>
  • .ss <link>
  • .jid
  • .url

[🔧] Admin
  • .ban @user
  • .promote @user
  • .demote @user
  • .mute <minutes>
  • .unmute
  • .delete / .del
  • .kick @user
  • .warnings @user
  • .warn @user
  • .antilink
  • .antibadword
  • .clear
  • .tag <message>
  • .tagall
  • .tagnotadmin
  • .hidetag <message>
  • .chatbot on/off
  • .chatbot setkey <key>
  • .chatbot setmodel <model>
  • .chatbot setprompt <prompt>
  • .statussave add
  • .statussave list
  • .statussave remove
  • .statussave clear
  • .resetlink
  • .antitag <on/off>
  • .welcome <on/off>
  • .goodbye <on/off>
  • .setgdesc <desc>
  • .setgname <title>
  • .setgpp

[👑] Owner
  • .mode <public/private>
  • .clearsession
  • .antidelete
  • .cleartmp
  • .update
  • .settings
  • .setpp
  • .autoreact <on/off>
  • .autostatus <on/off>
  • .autostatus react <on/off>
  • .autotyping <on/off>
  • .autoread <on/off>
  • .anticall <on/off>
  • .pmblocker <on/off/status>
  • .pmblocker setmsg <text>
  • .setmention <reply>
  • .mention <on/off>

[🎨] Media
  • .blur
  • .simage
  • .sticker
  • .removebg
  • .remini
  • .crop
  • .tgsticker
  • .meme
  • .take <packname>
  • .emojimix
  • .igs / .ig

[🎮] Games
  • .tictactoe @user
  • .hangman / .guess <letter>
  • .trivia / .answer <answer>
  • .truth
  • .dare

[📺] Stream TV
  • .tv

[⚙️] Control
  • .killbot
  • .risebots
  • .pair <number> (owner only)
  • .pair share (owner only)

[📣] Broadcast
  • .broadcast <message> | <number1,number2,...> (max 30)

[🎮] Game Mode v2
  • .game_mode_v2
  • .game_mode_v2 rps <rock|paper|scissors>
  • .game_mode_v2 guess <1-5>
  • .game_mode_v2 quiz
  • .game_mode_v2 answer <A|B|C|D>

[🤖] AI
  • .chatbot on/off
  • .gpt <question>
  • .gemini <question>
  • .imagine <prompt>
  • .flux <prompt>
  • .sora <prompt>

[🧩] Textmaker
  • .metallic <text>
  • .ice <text>
  • .snow <text>
  • .impressive <text>
  • .matrix <text>
  • .light <text>
  • .neon <text>
  • .devil <text>
  • .purple <text>
  • .thunder <text>
  • .leaves <text>
  • .arena <text>
  • .hacker <text>
  • .sand <text>
  • .blackpink <text>
  • .glitch <text>
  • .fire <text>

[📥] Downloader
  • .play <song>
  • .song <song>
  • .spotify <query>
  • .instagram <link>
  • .facebook <link>
  • .tiktok <link>
  • .video <name>
  • .ytmp4 <link>

[⚙️] Misc
  • .heart
  • .horny
  • .circle
  • .lgbt
  • .lolice
  • .its-so-stupid
  • .namecard
  • .tweet
  • .ytcomment
  • .comrade
  • .gay
  • .glass
  • .jail
  • .passed
  • .triggered

[🖼️] Anime
  • .nom
  • .poke
  • .cry
  • .kiss
  • .pat
  • .hug
  • .wink
  • .facepalm

[📌] GitHub
  • .git / .github
  • .sc / .script
  • .repo

*Need custom branding?* Use .setgname and .setgdesc to match your style.
*Select menu style:* Use .setstyle <style> (modern, elegant, minimal, gaming, neon, premium)
`;
}

async function helpCommand(sock, chatId, message) {
    // Get saved style preference or use modern as default
    let style = 'modern';
    try {
        const stylesFile = path.join(__dirname, '../data/userStyles.json');
        if (fs.existsSync(stylesFile)) {
            const styles = JSON.parse(fs.readFileSync(stylesFile));
            style = styles[chatId] || 'modern';
        }
    } catch (e) {
        style = 'modern';
    }
    
    const headerGenerator = MENU_STYLES[style] || MENU_STYLES.modern;
    const header = headerGenerator(settings.version || '3.0.0', settings.botOwner || 'ZHUSE', global.channelLink);
    
    const helpMessage = `${header}${getCommandsList()}`;

    try {
        // Try to load image with fallback: jpg → png
        let imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        
        if (!fs.existsSync(imagePath)) {
            imagePath = path.join(__dirname, '../assets/bot_image.png');
        }
        
        if (fs.existsSync(imagePath)) {
            const imageBuffer = fs.readFileSync(imagePath);
            
            await sock.sendMessage(chatId, {
                image: imageBuffer,
                caption: helpMessage,
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
            // No image found, send text-only
            await sock.sendMessage(chatId, { 
                text: helpMessage,
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
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: helpMessage });
    }
}

// Command to set menu style preference
async function setStyleCommand(sock, chatId, style) {
    const validStyles = ['modern', 'elegant', 'minimal', 'gaming', 'neon', 'premium'];
    
    if (!validStyles.includes(style)) {
        await sock.sendMessage(chatId, {
            text: `❌ Invalid style! Available styles: ${validStyles.join(', ')}`
        });
        return;
    }
    
    try {
        const stylesFile = path.join(__dirname, '../data/userStyles.json');
        let styles = {};
        
        if (fs.existsSync(stylesFile)) {
            styles = JSON.parse(fs.readFileSync(stylesFile));
        }
        
        styles[chatId] = style;
        fs.writeFileSync(stylesFile, JSON.stringify(styles, null, 2));
        
        await sock.sendMessage(chatId, {
            text: `✅ Menu style changed to *${style}*!\nUse .help or .menu to see the new design.`
        });
    } catch (error) {
        console.error('Error setting style:', error);
        await sock.sendMessage(chatId, {
            text: '❌ Error setting menu style.'
        });
    }
}

module.exports = helpCommand;
module.exports.setStyleCommand = setStyleCommand;
