# 🎯 ZHUSE MD - QUICK REFERENCE CARD

## 🚀 Fast Setup (5 Minutes)

### 1️⃣ Update Settings
```javascript
// Edit: settings.js
const settings = {
  botOwner: 'YOUR_NAME',           // Change this
  ownerNumber: '254712345678',     // Change this
  aiApiKey: 'sk-xxxxx',            // Optional: Add AI key
  aiModel: 'gpt-4o-mini',          // Optional: Choose model
}
```

### 2️⃣ Verify Branding
```
Type in WhatsApp: .alive
Expected: "🛡 ZHUSE MD is Active!"
```

### 3️⃣ Check New Menu
```
Type: .help
Expected: Modern icon-based menu with [📘] [🔧] [👑] etc.
```

---

## 🤖 AI Chatbot - 3 Commands You Need

| Command | Purpose | Example |
|---------|---------|---------|
| `.chatbot setkey <KEY>` | Set API key | `.chatbot setkey sk-proj-abc123` |
| `.chatbot setmodel <MODEL>` | Change model | `.chatbot setmodel gpt-4` |
| `.chatbot setprompt <PROMPT>` | Custom behavior | `.chatbot setprompt "Be a pirate"` |

**Supported Models:**
- OpenAI: `gpt-4`, `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`
- Claude: `claude-3-opus`, `claude-3-sonnet`, `claude-3-haiku`
- Gemini: `gemini-pro`, etc.
- Local: Any OpenAI-compatible endpoint

---

## 💾 Status Saver - Quick Commands

| Command | Does What |
|---------|-----------|
| `.statussave add <text>` | Save a status |
| `.statussave list` | View all saved |
| `.statussave remove <#>` | Delete specific |
| `.statussave clear` | Delete all |

**Example:**
```
.statussave add Keep coding 🚀
.statussave list
.statussave remove 1
```

---

## 📁 Important Files

| File | Purpose | When to Edit |
|------|---------|--------------|
| `settings.js` | Core config | Setup & customization |
| `data/chatbotConfig.json` | AI settings | After .chatbot commands |
| `data/statusSaver.json` | Saved statuses | Auto-managed |
| `commands/help.js` | Help menu | Custom help text |

---

## 🔑 Environment Variables (Advanced)

```bash
AI_PROVIDER=openai
AI_API_KEY=sk-xxxxx
AI_MODEL=gpt-4o-mini
AI_SYSTEM_PROMPT="You are ZHUSE..."
AI_ENDPOINT=https://api.openai.com/v1/chat/completions
```

---

## ✨ New Features Summary

### Before
- Generic ZHUSE MD
- Basic chatbot
- No status saving
- Old menu style

### After ✨
- **ZHUSE MD** branding
- **Custom AI** with API keys
- **Status Saver** command
- **Modern help** menu
- **Multi-provider** AI support

---

## 🎓 Common Tasks

### Task: Change AI Provider
```
1. Get API key from your provider
2. Run: .chatbot setkey YOUR_KEY
3. Run: .chatbot setmodel YOUR_MODEL
4. Done!
```

### Task: Save Important Quotes
```
1. Run: .statussave add "Your quote"
2. Run: .statussave list to verify
3. Share with group
```

### Task: Customize Bot Personality
```
1. Run: .chatbot setprompt "Your instructions here"
2. Test with a message to bot
3. Adjust as needed
```

### Task: View Bot Config
```
1. Run: .chatbot showconfig
2. See all current settings
3. Modify with setkey/setmodel/setprompt
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Bot not responding | Check: `.chatbot status` or run `.alive` |
| AI saying "error" | Verify API key: `.chatbot showconfig` |
| Statuses not saving | Check directory: `data/statusSaver.json` |
| Old bot name shows | Restart bot after settings.js edit |

---

## 📊 Command Categories

```
[📘] General      - Hello, ping, weather, jokes, etc.
[🔧] Admin        - Ban, kick, mute, tags, etc.
[👑] Owner        - Mode, settings, updates, etc.
[🎨] Media        - Stickers, blur, crop, etc.
[🎮] Games        - TTT, hangman, trivia, etc.
[🤖] AI           - Chatbot control & prompts
[🧩] Textmaker    - Metallic, fire, neon, etc.
[📥] Downloader   - YouTube, TikTok, Spotify, etc.
[⚙️] Misc         - Heart, tweets, memes, etc.
[🖼️] Anime        - Nom, poke, kiss, hug, etc.
[📌] GitHub       - Repository info, scripts, etc.
```

---

## 🔐 Security Best Practices

✅ **DO:**
- Store API keys in environment variables
- Use `.chatbot setkey` for setup
- Backup your `data/statusSaver.json`
- Review `.chatbot showconfig` regularly

❌ **DON'T:**
- Commit API keys to git
- Share API keys in chat
- Hardcode credentials
- Leave keys in chat history

---

## 💬 Chat with Bot (Example Flow)

```
User (mentions bot):  @ZhuseBot what's 2+2?
Bot (processes):      [•] Processing...
Bot (responds):       2 + 2 = 4 ✨
User:                 Nice!
Bot (learns):         Remembers conversation
```

---

## 📞 Getting Help

| Need Help With | Check |
|---|---|
| Full setup | `ZHUSE_CUSTOMIZATION_GUIDE.md` |
| What changed | `TRANSFORMATION_SUMMARY.md` |
| Implementation | `MODIFICATION_CHECKLIST.md` |
| Project status | `PROJECT_STATUS.txt` |
| This reference | `QUICK_REFERENCE.md` |

---

## 🎯 Next Steps

1. ✅ Update `settings.js` with your info
2. ✅ Run `.alive` to test
3. ✅ Get AI API key (optional)
4. ✅ Setup with `.chatbot setkey`
5. ✅ Customize with `.chatbot setprompt`
6. ✅ Save statuses with `.statussave`
7. ✅ Enjoy your custom ZHUSE MD bot!

---

## 💬 Example Prompts

**Business Bot:**
```
.chatbot setprompt "You are a professional business assistant. 
Be concise, formal, and solution-focused."
```

**Fun Bot:**
```
.chatbot setprompt "You are a fun, joking assistant who makes 
people laugh while being helpful."
```

**Tech Bot:**
```
.chatbot setprompt "You are an expert programmer. Provide 
code examples and technical explanations."
```

**Custom Brand:**
```
.chatbot setprompt "You represent ZHUSE. Be friendly, 
professional, and aligned with our values."
```

---

## 🌟 Pro Tips

1. **Multiple Prompts**: Use different groups with different bot personalities
2. **Backup Statuses**: Export `data/statusSaver.json` regularly
3. **Monitor Usage**: Check bot logs for issues
4. **Customize Help**: Edit `commands/help.js` for custom commands
5. **Add More Tools**: Framework supports 100+ commands already

---

## 📈 What You Get

- ✅ 100+ built-in commands
- ✅ Custom AI chatbot
- ✅ Status saver
- ✅ Admin tools
- ✅ Games & entertainment
- ✅ Media tools
- ✅ Text effects
- ✅ Downloaders

---

## 🎁 Bonus Features

- ⚡ Fast response times
- 🎨 Beautiful formatting
- 🔄 Auto-restart on error
- 💾 Persistent data
- 🛡️ Built-in safety features
- 📱 Multi-device support

---

**Version:** 3.0.7 - ZHUSE MD Edition
**Last Updated:** March 22, 2026
**Status:** Production Ready ✅

---

**Ready to launch? Your bot is fully customized and ready to serve!** 🚀
