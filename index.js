"use strict"
var fs = require('fs');
let path = require('path');
let readline = require('readline')
let data = "./data/config.json"
let datapath = "./data"
let plugpath = "./plugins"

function logger(e)
{
	console.log("[OCL]"+e)
}

function init(){
	if(!fs.existsSync(datapath))
    {
        fs.mkdirSync(datapath)
    }
	if(!fs.existsSync(plugpath))
    {
        fs.mkdirSync(plugpath)
    }
	try{
		if(fs.openSync(data,'r'))//配置文件创建
		{
			logger("[INFO]检测配置文件存在，准备启动BOT...") 
		}}catch(err){
			logger("[INFO]配置文件不存在！准备自动创建...")
			let jsonData = {
				"qq": 123456,
				"login_qrcode":true,
				"password":123456
			}
			let text = JSON.stringify(jsonData,null,'\t');
			let file = path.join(datapath, 'config.json');
			var fd = fs.openSync(data,'w');
			fs.writeSync(fd, text);
			setTimeout(()=>logger('[INFO]文件创建成功！文件名：' + file+"\n[WARN]第一次文件创建完成请手动修改配置文件后使用！3s后准备强制退出..."),100);
			fs.closeSync(fd);
			setTimeout(function(){process.exit(0)},3000)//强制退出，延时3s
		}
}

function load(){
		setTimeout(()=>{let file_len = (JSON.parse(JSON.stringify(fs.readdirSync("plugins")))).length;
		let lists = "";
		let fail_num=0;
		for(let i=0;i<file_len;i++){
		if(/^#.*/.test((JSON.parse(JSON.stringify(fs.readdirSync("plugins"))))[i])){
		lists += " "+/^#.*/.exec((JSON.parse(JSON.stringify(fs.readdirSync("plugins"))))[i])}}
		let plugins = lists.split(" ");
		for(let i=1;i<plugins.length;i++){
			try{
				require("./plugins/"+plugins[i]+"/main.js");
			}catch(err){
				logger("插件"+plugins[i]+"加载失败！信息："+err);
				fail_num++;
			}
			}
		
		logger("共加载了"+((plugins.length)-1-fail_num)+"个插件")},100)
}

init();
console.log("   ███████     ██████  ██                               ██               \n  ██░░░░░██   ██░░░░██░██                              ░██               \n ██     ░░██ ██    ░░ ░██        ██████   ██████       ░██  █████  ██████\n░██      ░██░██       ░██       ██░░░░██ ░░░░░░██   ██████ ██░░░██░░██░░█\n░██      ░██░██       ░██      ░██   ░██  ███████  ██░░░██░███████ ░██ ░ \n░░██     ██ ░░██    ██░██      ░██   ░██ ██░░░░██ ░██  ░██░██░░░░  ░██   \n ░░███████   ░░██████ ░████████░░██████ ░░████████░░██████░░██████░███   \n  ░░░░░░░     ░░░░░░  ░░░░░░░░  ░░░░░░   ░░░░░░░░  ░░░░░░  ░░░░░░ ░░░    \n");
let config = JSON.parse(fs.readFileSync(data));
const loginway = config.login_qrcode;//登陆方式，默认为为true；（true：扫码登陆，false：密码登陆）
const account = config.qq;//机器人qq号
const password = config.password;

const conf = {//机器人内部配置
		platform: 2,//2：使用安卓pad协议
		kickoff: false,
		ignore_self: true,
		resend: true,
		brief: true//被风控时分片发送
}
const bot = require("oicq").createClient(account,conf)
setTimeout(()=>{//登陆部分
//默认扫码登陆
if(loginway)
{
	bot.on("system.login.qrcode", function (e) {
		this.logger.mark("扫码后按Enter完成登录") 
		process.stdin.once("data", () => {
			this.login()
		})
	})
	.on("system.login.error", function (e) {
		if (e.code < 0)
			this.login()
	})
	.login()
}
//密码登陆
else{
	logger("第一次使用推荐使用扫码登陆，不会容易受到风控与冻结...")
	bot.login(password)
}
},3000)

setTimeout(()=>{
	try{
	exports.bot = bot;//主程序;
	exports.logger = logger;
	load()
}catch(err){
	console.log("插件加载异常！info:",err);
}
},3100);

//控制台指令控制
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
rl.on('line', (str) => {
    if (str === 'stop') {
		logger("Bot即将退出...")
		setTimeout(function(){process.exit(0)},1000)
    }
})
// rl.on('line', (str) => {
//     if (str === 'reload') {
// 		logger("插件正在重载...")
// 		setTimeout(function(){load()},1000)
//     }
// })
