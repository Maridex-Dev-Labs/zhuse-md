const settings = {
  packname: 'ZHUSE MD',
  author: 'ZHUSE',
  botName: "ZHUSE MD",
  botOwner: 'ZHUSE', 
  ownerNumber: '254700000000', // Just replace the zeros with your actual number
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: "public",
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "Automated Certified Powerful Assistant for Whatsapp by ZHUSE.",
  version: "3.0.7",
  updateZipUrl: "https://github.com/mruniquehacker/ZHUSE-MD/archive/refs/heads/main.zip",
  aiProvider: process.env.AI_PROVIDER || 'openai',
  aiApiKey: process.env.AI_API_KEY || '',
  aiModel: process.env.AI_MODEL || 'gpt-4o-mini',
  aiSystemPrompt: process.env.AI_SYSTEM_PROMPT || "You are ZHUSE AI Assistant. Be helpful, concise, and respectful.",
  aiEndpoint: process.env.AI_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
};

module.exports = settings;
