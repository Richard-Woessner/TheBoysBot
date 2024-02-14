"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
var config_1 = require("../config");
(0, dotenv_1.configDotenv)();
var Discord = require('discord.js'); //imports discord.js
var client = new Discord.Client(); //creates new client
client.on('ready', function () {
    console.log("Logged in as ".concat(client.user.tag, "!"));
});
client.on('message', function (msg) {
    if (msg.content === 'ping') {
        msg.reply('Pong!');
    }
});
//this line must be at the very end
client.login(config_1.config.DISCORD_TOKEN); //signs the bot in with token
