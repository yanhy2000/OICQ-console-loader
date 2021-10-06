"use strict"
const { bot } = require("../../index");
var fs = require('fs');
let path = require('path');

function init(){
    let data = "config.json"
    let datapath = "./"
	fs.access(data, fs.constants.F_OK, (err) => {
		if (err) {
			logger("[SuperCode]配置文件准备创建...")
		let jsonData = {
			"token": 123456
		}
		let text = JSON.stringify(jsonData,null,'\t')
		let file = path.join(datapath, 'config.json');
		fs.writeFile(file, text, function (err) {
			if (err) {
				logger("[SuperCode]文件创建失败，请手动检查！");
			} else {
				logger('[SuperCode]配置文件文件创建成功！第一次使用版本插件请手动修改tokn')
			}});
    }})
}

function httppost(str,path,callback)
{
	const data = JSON.stringify(str);
	const options = {
		hostname: ip,
		port: port,
		path: path,
		method: 'POST',
		headers: {
		'Authorization': 'Token 36508956-35a9-4c5f-82b2-162642b7a3a5',
		'Content-typeh': "application/json"
		}
	}
	const req = http.request(options, res => {
		let html = "";
		res.on('data', d => {
			html+=d;
		});
		res.on("end",()=>{
			if(callback){
				callback(html);
			}
		})
	})
	req.on('error', error => {
		callback(error)
	});
	req.write(data);
	req.end();
}


bot.on("message.group", function (e) {
    if(e.raw_message == "test"){
        e.reply("11132测试！");
    }
})
console.log("————SuperCode————插件已加载！by.yanhy2000")