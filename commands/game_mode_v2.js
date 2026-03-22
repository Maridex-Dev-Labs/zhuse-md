function getRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

async function gameModeV2Command(sock, chatId, message) {
    try {
        const text = (message.message?.extendedTextMessage?.text || '').trim();
        const args = text.replace(/^\.game_mode_v2\s*/i, '').trim().split(/\s+/).filter(Boolean);

        if (args.length === 0) {
            return await sock.sendMessage(chatId, {
                text: '🎮 *Game Mode v2*\n\nUse: .game_mode_v2 rps <rock|paper|scissors>\nUse: .game_mode_v2 guess <number 1-5>\nUse: .game_mode_v2 quiz'
            }, { quoted: message });
        }

        const command = args[0].toLowerCase();
        if (command === 'rps') {
            const userChoice = (args[1] || '').toLowerCase();
            const valid = ['rock', 'paper', 'scissors'];
            if (!valid.includes(userChoice)) {
                return await sock.sendMessage(chatId, { text: 'Choose rock, paper or scissors: .game_mode_v2 rps <rock|paper|scissors>' }, { quoted: message });
            }
            const botChoice = getRandomItem(valid);
            let result = 'Draw!';
            if ((userChoice === 'rock' && botChoice === 'scissors') ||
                (userChoice === 'paper' && botChoice === 'rock') ||
                (userChoice === 'scissors' && botChoice === 'paper')) {
                result = 'You win!';
            } else if (userChoice !== botChoice) {
                result = 'You lose!';
            }
            await sock.sendMessage(chatId, {
                text: `🗡️ *Rock-Paper-Scissors*\nYou: ${userChoice}\nBot: ${botChoice}\nResult: ${result}`
            }, { quoted: message });
        } else if (command === 'guess') {
            const guess = parseInt(args[1], 10);
            if (isNaN(guess) || guess < 1 || guess > 5) {
                return await sock.sendMessage(chatId, { text: 'Guess a number from 1 to 5: .game_mode_v2 guess <number>' }, { quoted: message });
            }
            const target = Math.floor(Math.random() * 5) + 1;
            const result = guess === target ? 'Correct! 🎉' : `Wrong! I chose ${target}.`;
            await sock.sendMessage(chatId, { text: `🎲 Guess game: ${result}` }, { quoted: message });
        } else if (command === 'quiz') {
            const quiz = {
                question: 'What is the capital of France?',
                choices: ['A. Paris', 'B. Berlin', 'C. Rome', 'D. Madrid'],
                answer: 'A'
            };
            await sock.sendMessage(chatId, {
                text: `❓ *Quiz*\n${quiz.question}\n${quiz.choices.join('\n')}\nReply with .game_mode_v2 answer <A/B/C/D>`
            }, { quoted: message });
        } else if (command === 'answer') {
            const reply = (args[1] || '').toUpperCase();
            const correct = 'A';
            await sock.sendMessage(chatId, {
                text: reply === correct ? '✅ Correct answer!' : '❌ Incorrect, try again.'
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: 'Unknown game command. Use .game_mode_v2 for options.' }, { quoted: message });
        }
    } catch (error) {
        console.error('Error in game_mode_v2 command:', error);
        await sock.sendMessage(chatId, { text: '❌ Game mode failed.' });
    }
}

module.exports = gameModeV2Command;
