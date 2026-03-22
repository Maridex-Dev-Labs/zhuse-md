# ZHUSE MD - Customization & Feature Guide

## Overview
Your WhatsApp bot has been successfully rebranded to **ZHUSE MD** with powerful new features!

---

## 🎨 Branding Changes Applied

### Global Branding
- `botName`: Changed from "KNIGHT BOT" to **"ZHUSE MD"**
- `botOwner`: Changed to **"ZHUSE"**
- `packname/author`: Updated to **"ZHUSE MD"**
- Bot description: Updated to reflect ZHUSE's vision
- Theme emoji: Changed to `*` instead of `•`

### Updated Files
✅ `settings.js` - Core branding config
✅ `index.js` - Startup identity
✅ `main.js` - Global references
✅ `commands/help.js` - Modern help menu
✅ `commands/alive.js` - Alive command response

---

## 🤖 Advanced Chatbot with Custom AI Integration

### New Chatbot Features

The chatbot now supports **ANY AI provider with API key support** (OpenAI, Claude, Gemini, local endpoints, etc.)

**Available Commands:**
```
.chatbot on          - Enable chatbot in group
.chatbot off         - Disable chatbot
.chatbot setkey <key>        - Set your AI API key
.chatbot setmodel <model>    - Change AI model (e.g., gpt-4, claude-3, etc.)
.chatbot setprompt <text>    - Customize bot behavior/system prompt
.chatbot showconfig          - View current config
.chatbot status              - Check if enabled
```

### How to Setup Custom AI

**For OpenAI (Default):**
```bash
# Set environment variables or edit data/chatbotConfig.json
AI_PROVIDER=openai
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL=gpt-4o-mini
AI_ENDPOINT=https://api.openai.com/v1/chat/completions
```

**For Local/Custom Endpoints:**
```
.chatbot setkey <your_api_key>
.chatbot setmodel <model_name>
.chatbot setprompt "You are a helpful assistant..."
```

**Configuration File:** `data/chatbotConfig.json`
```json
{
  "apiKey": "your-api-key-here",
  "provider": "openai",
  "model": "gpt-4o-mini",
  "systemPrompt": "Customize bot behavior here",
  "endpoint": "https://api.openai.com/v1/chat/completions"
}
```

---

## 💾 Status Saver - Brand New Feature!

A powerful command to save and manage WhatsApp statuses and quotes.

**Available Commands:**
```
.statussave add <text>      - Save a new status
.statussave list            - View all saved statuses
.statussave remove <number> - Delete a status by number
.statussave clear           - Clear all statuses
```

**Usage Examples:**
```
.statussave add Coding is life 🚀
.statussave add Making memories daily
.statussave list
.statussave remove 1
.statussave clear
```

**Properties:**
- Admin/Owner only for adding/removing
- Persistent storage in `data/statusSaver.json`
- Timestamps and attribution tracking
- Perfect for managing motivational quotes!

---

## 🎯 Help Menu Redesign

The help menu has been completely redesigned with:

✨ **Modern Categories:**
- [📘] General
- [🔧] Admin
- [👑] Owner
- [🎨] Media
- [🎮] Games
- [🤖] AI (Chatbot included!)
- [🧩] Textmaker
- [📥] Downloader
- [⚙️] Misc
- [🖼️] Anime
- [📌] GitHub

Clean icon-based design replacing old emoji blocks.

---

## 📝 Configuration Guide

### Key Settings Files

**settings.js** - Main configuration
```javascript
const settings = {
  packname: 'ZHUSE MD',           // Sticker pack name
  botOwner: 'ZHUSE',              // Your name
  ownerNumber: '254700000000',    // Your WhatsApp number
  aiProvider: 'openai',           // AI provider
  aiApiKey: '',                   // Your API key
  aiModel: 'gpt-4o-mini',         // Model name
  aiSystemPrompt: '...',          // Bot behavior
  // ... more settings
};
```

**data/chatbotConfig.json** - AI chatbot settings
- Manages API credentials
- Supports provider switching
- Customizable system prompts

**data/statusSaver.json** - Status storage
- Automatically created/managed
- Stores saved statuses with metadata

---

## 🚀 Quick Setup

### 1. Update Your Information
Edit `settings.js`:
```javascript
ownerNumber: 'YOUR_NUMBER',  // e.g., 254712345678
botOwner: 'YOUR_NAME',
packname: 'YourBrandName'
```

### 2. Setup AI (Optional but Recommended)
```
a) Get API key from OpenAI (chat.openai.com)
   - Or use Claude, Gemini, or local endpoint
b) Run command in bot:
   .chatbot setkey sk-xxxxx
   .chatbot setmodel gpt-4o-mini
```

### 3. Test Everything
```
.alive              - Check bot status
.help               - View all commands
.statussave list    - Test status saver
.chatbot status     - Check AI config
```

---

## 🔄 Environment Variables (Optional)

Set these in your hosting environment for secure credential storage:

```
AI_PROVIDER=openai
AI_API_KEY=sk-xxxxxxxxxxxxxxxx
AI_MODEL=gpt-4o-mini
AI_SYSTEM_PROMPT="You are ZHUSE AI Assistant..."
AI_ENDPOINT=https://api.openai.com/v1/chat/completions
```

---

## 📦 What's Inside

### New/Modified Files
- `commands/statussave.js` - Status saver command (NEW)
- `commands/chatbot.js` - Enhanced with API key support (MODIFIED)
- `commands/help.js` - Modern menu design (MODIFIED)
- `data/chatbotConfig.json` - AI configuration (NEW)
- `data/statusSaver.json` - Status storage (NEW)
- `settings.js` - AI settings added (MODIFIED)

### Branding Changes
- Removed all "ZHUSE MD" references
- Updated to "ZHUSE MD" everywhere
- Changed emoji scheme for modern look
- Updated channel/newsletter names

---

## 💡 Pro Tips

1. **Custom AI Personality**
   ```
   .chatbot setprompt "You are a professional assistant who speaks like a pirate"
   ```

2. **Status Saver for Teams**
   - Save daily motivational quotes
   - Store group guidelines/rules
   - Create statuses for campaigns

3. **Combining Features**
   - Enable chatbot for group conversations
   - Save important statuses
   - Use custom prompts for different groups

4. **Privacy**
   - Keep your API keys secure
   - Don't share .chatbot setkey output
   - Use environment variables when possible

---

## 🐛 Troubleshooting

**Chatbot not responding?**
- Check if enabled: `.chatbot status`
- Verify API key is set: `.chatbot showconfig`
- Check bot is admin in group

**Status not saving?**
- Ensure you have admin privileges
- Check `data/statusSaver.json` exists
- Review disk space

**AI API errors?**
- Verify API key is valid
- Check endpoint URL is correct
- Confirm model name matches provider

---

## 📞 Support

For issues or questions:
1. Check `data/` folder for config files
2. Review error logs in console
3. Test individual features one by one
4. Ensure all required packages are installed

---

## ✨ Next Steps

1. ✅ Complete the setup steps above
2. ✅ Test each new feature
3. ✅ Customize prompts for your use case
4. ✅ Add more statuses and commands as needed
5. ✅ Share with your groups!

---

**Happy automating with ZHUSE MD! 🚀**
