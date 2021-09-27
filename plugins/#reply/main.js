"use strict"
const { bot } = require("../../index");

bot.on("message.group", function (e) {
    if(e.raw_message == "test"){
        e.reply("hhhhhh");
    }
})
