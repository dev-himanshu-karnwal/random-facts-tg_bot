const { Telegraf } = require("telegraf");
const axios = require("axios");
const server = require("http").createServer();
require("dotenv").config();

// function sending random fact fetched from api via bot to user.
const sendRandomFact = async (ctx) => {
  try {
    const result = await axios.get(
      "https://uselessfacts.jsph.pl/api/v2/facts/random"
    );
    const fact = result.data.text;

    ctx.telegram.sendMessage(ctx.chat.id, fact, {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Get another random fact", callback_data: "fact" }],
        ],
      },
    });
  } catch (error) {
    ctx.reply("Failed getting a fact..🥺");
  }
};

// create bot using token
const bot = new Telegraf(process.env.TOKEN);

// listen and replies to -> "/start"
bot.start((ctx) => {
  ctx.reply(
    "This Bot provides you with some random facts.\nTo access some assistance on how to use, type /help."
  );
});

// listen and replies to -> "/help"
bot.help((ctx) => {
  ctx.reply(
    `This bot can perform commands :\n/start - Start bot\n/help - Get help/Assistance\n/fact - Get a Random Fact`
  );
});

// gives a fortune on -> "/fact"
bot.command("fact", sendRandomFact);

// callback used when user asks for more fact
bot.action("fact", (ctx) => {
  ctx.deleteMessage();
  sendRandomFact(ctx);
});

// Replies to words like ["hello", "hi", "hii", "hey"]
["hello", "hi", "hii", "hey"].forEach((msg) => {
  bot.hears(msg, (ctx) => {
    ctx.reply(
      `${msg[0].toUpperCase()}${msg.slice(1)}, Let's get started../start`
    );
  });
});

// listen and replies to any message
bot.on("message", (ctx) => {
  ctx.reply(
    "Can't understand your message. Please take a look at /help for assistance."
  );
});

// launches bot
bot.launch();

server.listen();
