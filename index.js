const mineflayer = require('mineflayer');
const config = require('./config.json');

let bot;
let afkInterval;
let lookInterval;

function startBot() {
  bot = mineflayer.createBot({
    host: config.ip,
    username: config.name,
    auth: 'offline',
    version: '1.20.4'
  });

  bot.once('spawn', () => {
    console.log(`Bot "${config.name}" connected.`);
    startAntiAFK();
  });

  bot.on('death', () => {
    console.log('Bot died, respawning...');
    setTimeout(() => bot.emit('respawn'), 1000);
  });

  bot.on('error', err => {
    console.log('Bot error:', err.message);
  });

  bot.on('end', () => {
    console.log('Bot disconnected. Reconnecting...');
    stopAntiAFK();
    setTimeout(startBot, 5000);
  });
}

function startAntiAFK() {
  stopAntiAFK();

  afkInterval = setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 300);
  }, 45000);

  lookInterval = setInterval(() => {
    bot.look(
      Math.random() * Math.PI * 2,
      (Math.random() - 0.5) * Math.PI / 4
    );
  }, 15000);
}

function stopAntiAFK() {
  if (afkInterval) clearInterval(afkInterval);
  if (lookInterval) clearInterval(lookInterval);
}

startBot();