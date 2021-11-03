"use strict"
const { bot } = require("../../index");
bot.on("message.group", function (e) {
    // console.log(e)
    if(e.raw_message == "test"){
        e.reply("11132测试！");
    } 
    
})
console.log("测试插件加载成功！")