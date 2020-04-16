var date;
var datechanged = 0;
var gamelength = 25000;
var timeleft = gamelength;
var round_id = 1;
var redPot = 0, greenPot = 0, blackPot = 0;
var total = 0;
var mysqlInfo;
var processingBet = {};
mysqlInfo = {
  host     : 'localhost',
  user     : 'root',
  password : 'test',
  database : 'csgo',
  charset  : 'utf8_general_ci'
};
var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection(mysqlInfo);
var Entities = require('html-entities').XmlEntities;
 
entities = new Entities();
var crypto = require('crypto');
var striptags = require('striptags');
var processing = {};
var processingBets = [];
var offers =[];
var lastRolls = [];
var currentBets = [];
var gameOn = 0;
var seed = '';
var hash = '';
const util = require('util');
var request = require('request');
var xml2js = require('xml2js');
Array.prototype.exterminate = function (value) {
	this.splice(this.indexOf(value), 2);
}
var antiSpam = require('socket-anti-spam');
var io = require('socket.io').listen(2095 || 8304);

io.on('connection', function(socket){
	
});
var g_Peers = [];
var steamids = [];


antiSpam.init({
    banTime: 15,            // Ban time in minutes 
    kickThreshold: 10,       // User gets kicked after this many spam score 
    kickTimesBeforeBan: 3,   // User gets banned after this many kicks 
    banning: true,          // Uses temp IP banning after kickTimesBeforeBan 
    heartBeatStale: 40,     // Removes a heartbeat after this many seconds 
    heartBeatCheck: 4,      // Checks a heartbeat per this many seconds 
    io: io,          // Bind the socket.io variable 
});

io.sockets.on('connection', function (socket){
	antiSpam.addSpam(socket);
	g_Peers.push(socket);
	sendHistory(socket.id);
	if(gameOn==1)
	{
		var ar = [];
		ar.push({
			timeleft: timeleft,
			round: round_id
		})
		io.to(socket.id).emit('timer', ar);
		
	}
	socket.on('disconnect', function(socket){
		g_Peers.exterminate(socket);
		
		for(var i = 0; i < steamids.length; i++)
		{
			if(steamids[i].id == socket.id)
			{
				steamids.splice(i, 1);
			}
		}
	});
	
	
		
	socket.on('bet', function(data){
	antiSpam.addSpam(socket);
		if(data[0].tok.length > 1)
		{
			if(gameOn==1)
			{
				if(	parseInt(data[0].betval) && parseInt(data[0].betval) > 1)
				{
					bet(parseInt(data[0].betval), socket, data[0].tok, data[0].color);
					return;
				}
				else
				{
					var arr = [];
					arr.push({
						error: 1,
						text: 'Enter value bigger than 0'
					})
					io.to(socket.id).emit('bank', arr);
					return;
				}
			}
			return;
		}
		return;
	});
	
	socket.on('chatMsg', function(data){
		antiSpam.addSpam(socket);
		if(processing[socket.id])
			return;
		processing[socket.id] = true;
		sendChat(data, socket);
		setTimeout(function(){
			delete processing[socket.id];
		},3000);
		
	})
	
});

onStart()
function onStart(){
	date = new Date().toISOString().substr(0,10)
	console.log(date);
	mysqlConnection.query('SELECT * FROM `games` WHERE `date`=\''+date+'\'', function(err, rows) {
		if(err)
			return;
		if(rows.length < 1)
		{
			var seed =crypto.randomBytes(64).toString('hex');
			seed= seed.substr(15,47);
			hash = crypto.createHash('sha256').update(seed).digest('hex');
			var post = {date: date, seed: seed, hash: hash};
			mysqlConnection.query('INSERT INTO `games` SET ?', post, function(err2) {
				if(err2)
				{
					return;
				}
			
				draw();
			});
		}
		else
		{
			seed = rows[0].seed;
			round_id = rows[0].rolls+1;
			
		}
		
		
		setTimeout(function(){
			draw();
		},5000);
	});
	
	
}




function sendHistory(id)
{
	io.to(id).emit('history', lastRolls);
	mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletstatus"', function(e, r) {
		if(e){
			return;
		}
		mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="chatstatus"', function(e2, r2) {
			if(e2){
				return;
			}
			var arr = [];
			if(r[0].status == 0 && r2[0].status == 0){
				arr.push({
					image: "img/server.png",
					name: "<span style='color:red'>Server</span>",
					msg: "Roulette and chat are turned off"
				})
				io.to(id).emit('chat', arr);
			}
			else if(r2[0].status == 0){
				arr.push({
					image: "img/server.png",
					name: "<span style='color:red'>Server</span>",
					msg: "Chat is turned off"
				})
				io.to(id).emit('chat', arr);
			}
			else if(r[0].status == 0){
				arr.push({
					image: "img/server.png",
					name: "<span style='color:red'>Server</span>",
					msg: "Roulette is turned off"
				})
				io.to(id).emit('chat', arr);
			}
		});
	})
	mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletminbet"', function(e, r) {
		if(e){
			return;
		}
		mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletmaxbet"', function(e2, r2) {
			if(e2){
				return;
			}
			var arr = [];
			arr.push({
					image: "img/server.png",
					name: "<span style='color:red'>Server</span>",
					msg: "Min: "+r[0].status+" coins, max: "+r2[0].status+" coins",
				})
				io.to(id).emit('chat', arr);
		});
	})
}
function bet(betval, socket, token, color)
	{
		var session = { phpsession: socket.handshake.headers.cookie.substr(socket.handshake.headers.cookie.indexOf('PHPSESSID')+10)}
		mysqlConnection.query('SELECT * FROM `users` WHERE ?', session, function(err, rowuser) {
			if(err){
				return;
			}
			if(rowuser.length < 1){
				return;
			}
			mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletstatus"', function(e, r) {
				if(e){
					return;
				}
				if(r[0].status==0){
					return;
				}
				mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletminbet"', function(e2, r2) {
					if(e2){
						return;
					}
					mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletmaxbet"', function(e3, r3) {
						if(e3){
							return;
						}
						processingBets.push(rowuser[0].steamid);
						if(rowuser[0].steamid.length>20)
						{
							processingBets.exterminate(rowuser[0].steamid);
							return;
						}
								if (r2[0].status > betval)
								{
									var arr = [];
									arr.push({
										image: "img/server.png",
										name: "<span style='color:red'>Server</span>",
										msg: "Min bet value is "+r2[0].status+" coins"
									})
									io.to(socket.id).emit('chat', arr);
									io.to(socket.id).emit('unlock');
									processingBets.exterminate(rowuser[0].steamid);
									return;
								}
								if (r3[0].status < betval)
								{
									var arr = [];
									arr.push({
										image: "img/server.png",
										name: "<span style='color:red'>Server</span>",
										msg: "Max bet value is "+r3[0].status+" coins"
									})
									io.to(socket.id).emit('chat', arr);
									io.to(socket.id).emit('unlock');
									processingBets.exterminate(rowuser[0].steamid);
									return;
								}
								if (rowuser[0].gameban == 1)
								{
									var arr = [];
									arr.push({
										image: "img/server.png",
										name: "<span style='color:red'>Server</span>",
										msg: "You are banned from games!"
									})
									io.to(socket.id).emit('chat', arr);
									io.to(socket.id).emit('unlock');
									processingBets.exterminate(rowuser[0].steamid);
									return;
								}
								if (rowuser[0].coins < betval)
								{
									var arr = [];
									arr.push({
										image: "img/server.png",
										name: "<span style='color:red'>Server</span>",
										msg: "Not enough coins"
									})
									io.to(socket.id).emit('chat', arr);
									io.to(socket.id).emit('unlock');
									processingBets.exterminate(rowuser[0].steamid);
									return;
								}
								if (rowuser[0].token != token)
								{
									var arr = [];
									arr.push({
										image: "img/server.png",
										name: "<span style='color:red'>Server</span>",
										msg: "Please refresh the site. Your bet was not accepted."
									})
									io.to(socket.id).emit('chat', arr);
									io.to(socket.id).emit('unlock');
									processingBets.exterminate(rowuser[0].steamid);
									return;
								}
								else
								{
									if(processingBet[rowuser[0].steamid])
										processingBet[rowuser[0].steamid] += 1;
									else
										processingBet[rowuser[0].steamid] = 1;
									if(processingBet[rowuser[0].steamid] > 3)
									{
										var arr = [];
										arr.push({
											image: "img/server.png",
											name: "<span style='color:red'>Server</span>",
											msg: "You can bet only 3 times per game"
										})
										io.to(socket.id).emit('chat', arr);
										io.to(socket.id).emit('unlock');
										processingBets.exterminate(rowuser[0].steamid);
										return;
									}
										

									var post = {steamid: rowuser[0].steamid};
									mysqlConnection.query('UPDATE `users` SET `coins`=`coins`-'+betval+', `coinsplayed`=`coinsplayed`+'+betval+', `roulet`=`roulet`-'+betval+' WHERE ?', post, function(err2) {
										if(err2)
										{
											processingBets.exterminate(rowuser[0].steamid);
											return;
										}
										var arr = [];
										arr.push({
											error: 0,
											text: rowuser[0].coins-betval
										})
										io.to(socket.id).emit('bank', arr);
										currentBets.push({
											steamid: rowuser[0].steamid,
											betval: betval,
											id: socket.id,
											token: token,
											color: color
										});
										if(color=="red")
											redPot += betval;
										else if(color == "green")
											greenPot += betval;
										else
											blackPot += betval;
										if(betval > 500)
										{
											request("http://steamcommunity.com/profiles/"+rowuser[0].steamid+"/?xml=1", function(err, response, body){
												xml2js.parseString(body, function(err, result) {
													if(err) {
														return;
													}
													var arr2 = [];
													var name = result.profile.steamID[0];
													name = entities.decode(name);
													name = striptags(name);
													var avatar = result.profile.avatarFull[0];
													arr2.push({
														name: name,
														img: avatar,
														bet: betval,
														color: color
													})
													io.emit('bigBet', arr2);
												})
											})
										}
										processingBets.exterminate(rowuser[0].steamid);
										total += betval;
									});
							}
					})
				})
		})
	})
}
setInterval(function(){
	for(var j = 0; j < steamids.length; j++)
	{
		for(var i = 0; i < offers.length; i++)
		{
			if(steamids[j].steamid==offers[i].steamid && offers[i].informed != steamids[j].id)
			{
				io.to(steamids[j].id).emit('offer', offers[i]);
				offers[i].informed = steamids[j].id;
			}
		}
	}
},3000)


var endcurrent = 0;
function draw() {
	mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletstatus"', function(e, r) {
		if(e){
			setTimeout(function(){draw();},10000)
			return;
		}
		if(r[0].status==0 && endcurrent == 1){
			setTimeout(function(){draw();},10000)
			return;
		}
		else if(r[0].status==0 && endcurrent == 0)
		{
			endcurrent = 1;
			setTimeout(function(){
				var arr = [];
				if(r[0].status == 0){
					arr.push({
						image: "img/server.png",
						name: "<span style='color:red'>Server</span>",
						msg: "Roulette is turned off"
					})
					io.emit('chat', arr);
				}
			}, gamelength);
		}
		else
		{
			endcurrent = 0;
		}
		if (processingBets.length == 0)
		{
			gameOn = 0;
			var hash = crypto.createHash('sha256').update(seed+round_id.toString()).digest('hex');
			round_id += 1;
			var num = 0;
			for(var i = 0; i < 32; i++)
			{
				num += hash.charCodeAt(i);
			}
			
			var number = parseInt(num%37);
			if(lastRolls.length>18){
				lastRolls.splice(0,1);
			}
			lastRolls.push(number);
			io.emit('end', number);
			if(currentBets.length>0)
			{
				closeGame(number, currentBets, currentBets.length-1);
				currentBets = [];
			}
			mysqlConnection.query('UPDATE `games` SET `rolls`=`rolls`+1 WHERE `seed`=\''+seed+'\'', function(err) {
				if(err)
				{
					return;
				}
			});
			timeleft = gamelength;
			setTimeout(function(){
				if(datechanged == 1)
				{
					var seed =crypto.randomBytes(64).toString('hex');
					seed= seed.substr(15,47);
					hash = crypto.createHash('sha256').update(seed).digest('hex');
					var post = {date: date, seed: seed, hash: hash};
					mysqlConnection.query('INSERT INTO `games` SET ?', post, function(err) {
						if(err)
						{
							return;
						}
					});
					round_id = 1;
					datechanged = 0;
				}
				var color;
				if(number == 32 || number == 19 || number == 21 || number == 25 || number == 34 || number == 27 || number == 36 || number == 30 || number == 23 || number == 5 || number == 16 || number == 1 || number == 9 || number == 18 || number == 7 || number == 12 || number == 3)
					color = "red"
				else if(number == 0 || number == 14 || number == 13)
					color = "green"
				else
					color ="black";
				
				var totalRed = 0, totalGreen = 0, totalBlack = 0;
				if(color == "red"){
					totalRed = -redPot;
					totalGreen = greenPot;
					totalBlack = blackPot;
				}
				if(color == "green"){
					totalRed = redPot;
					totalGreen = -11*greenPot;
					totalBlack = blackPot;
				}
				if(color == "black"){
					totalRed = redPot;
					totalGreen = greenPot;
					totalBlack = -blackPot;
				}
				var arr = [];
				arr.push({
					timer: gamelength,
					round: round_id,
					totalRed: totalRed,
					totalGreen: totalGreen,
					totalBlack: totalBlack
				})
				redPot = 0;
				greenPot = 0;
				blackPot = 0;
				gameOn=1;
				total = 0;
				processingBet = {};
				io.emit('start', arr);
				
			},4000)
		}
		else
		{
			gameOn = 0;
			
			io.emit('preend', processingBets.length);
			setTimeout(function(){
				draw();
			}, 1000)
			return;
		}
		setTimeout(function(){
			draw()
		},gamelength)
	});
}

function closeGame(number, bets, i)
{
	var color;
	if(number == 32 || number == 19 || number == 21 || number == 25 || number == 34 || number == 27 || number == 36 || number == 30 || number == 23 || number == 5 || number == 16 || number == 1 || number == 9 || number == 18 || number == 7 || number == 12 || number == 3)
		color = "red"
	else if(number == 0 || number == 14 || number == 13)
		color = "green"
	else
		color ="black";
	if(bets[i].color == color)
	{
		bets[i].betval = 2*bets[i].betval;
		if(color=="green")
			bets[i].betval = 6*bets[i].betval;
		
		total -= bets[i].betval;
		mysqlConnection.query('UPDATE `users` SET `coins`=`coins`+'+bets[i].betval+', `coinswon`=`coinswon`+'+bets[i].betval+', `roulet`=`roulet`+'+bets[i].betval+' WHERE `steamid`=\''+bets[i].steamid+'\'', function(err) {
			if(err)
			{
				return;
			}
			mysqlConnection.query('SELECT `coins` FROM `users` WHERE `steamid`=\''+bets[i].steamid+'\'', function(err2, rows) {
				if(err2)
				{
					return;
				}
				var arr = [];
				arr.push({
					error: 0,
					text: rows[0].coins
				})
				emitWin(arr, bets[i].id)
				
				i--;
				if(i<0)
				{
					return;
				}
				closeGame(number,bets,i);
			});
		});
	}
	else
	{
		i--;
		if(i<0)
		{
			return;
		}
		closeGame(number,bets,i);
	}
	
}
function emitWin(arr, id){
	setTimeout(function(){
		io.to(id).emit('bank', arr);
	},4000)
}

function sendChat(data, socket)
{
	var session = { phpsession: socket.handshake.headers.cookie.substr(socket.handshake.headers.cookie.indexOf('PHPSESSID')+10)}
	mysqlConnection.query('SELECT * FROM `users` WHERE ?', session, function(err, rowuser) {
		if(err){
			return;
		}
		if(rowuser.length < 1){
			return;
		}
		mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="chatstatus"', function(e, r) {
			if(e){
				return;
			}
			if(r[0].status==0){
				return;
			}
			if(data[0].msg.length < 40)
			{
				if(data[0].msg.length < 2)
						return;
						
				if(rowuser[0].chatban == 1)
				{
					var arr = [];
					arr.push({
						image: "img/server.png",
						name: "<span style='color:red'>Server</span>",
						msg: "You are banned from chat"
					})
					io.to(socket.id).emit('chat', arr);
					return;
				}
				if(rowuser[0].token != data[0].tok)
					return;
				request("http://steamcommunity.com/profiles/"+rowuser[0].steamid+"/?xml=1", function(err, response, body){
					xml2js.parseString(body, function(err, result) {
						if(err) {
							return;
						}
						var name = result.profile.steamID[0];
						var avatar = result.profile.avatarFull[0];
						name = entities.decode(name);
						name = striptags(name);
						
						data[0].msg = entities.decode(data[0].msg);
						data[0].msg = striptags(data[0].msg);
						data[0].msg = data[0].msg.split('scam').join('');
						data[0].msg = data[0].msg.split('fuck').join('');
						data[0].msg = data[0].msg.split('fucked').join('');
						data[0].msg = data[0].msg.split('shit').join('');
						data[0].msg = data[0].msg.split('rigged').join('');
						data[0].msg = data[0].msg.split('csgo').join('');
						data[0].msg = data[0].msg.split('jackpot').join('');
						data[0].msg = data[0].msg.split('.de').join('');
						data[0].msg = data[0].msg.split('.net').join('');
						data[0].msg = data[0].msg.split('.org').join('');
						data[0].msg = data[0].msg.split('.com').join('');
						name = name.split('csgo').join('');
						name = name.split('jackpot').join('');
						name = name.split('.de').join('');
						name = name.split('.net').join('');
						name = name.split('.org').join('');
						name = name.split('.com').join('');
						
						if(name.length > 15)
						{
							name = name.substr(0, 15)+'...';
						}
						if(data[0].msg.length < 2)
							return;
						if(rowuser[0].admin==1)
						{
							name = '<span style="color: green; font-size: 12pt"><strong>'+name+'</strong></span>';
						}
						else if (rowuser[0].admin == 2)
						{
							name = '<span style="color: red; font-size: 12pt"><strong>'+name+'</strong></span>';
						}
						var arr = [];
						arr.push({
							image: avatar,
							name: name,
							msg: data[0].msg
						})
						
						io.emit('chat', arr);
					});
				});
					
			};
		});
	});
}

setInterval(function () {
	var arr =[];
	arr.push({
		red: redPot,
		green: greenPot,
		black: blackPot
	})
	io.emit('pots', arr)
}, 1000);

setInterval(function () {
		timeleft -= 1000;
		io.emit('players', g_Peers.length);
}, 1000);

function random(seed) {
	var x = Math.sin(seed++) * 10000;
	return x - Math.floor(x);
}
setInterval(function () {
	if( date != new Date().toISOString().substr(0,10))
		datechanged = 1;
	date = new Date().toISOString().substr(0,10);
}, 30000);
setInterval(function(){
	request("http://localhost/php/update-price.php");
}, 43200000 )
setInterval(function(){
	request("http://localhost/php/end-giveaway.php");
}, 10000 )
setInterval(function(){
	mysqlConnection.query('SELECT `status` FROM `settings` WHERE `name`="rouletgamelength"', function(e2, r2) {
		if(!e2)
		{
			gamelength = r2[0].status;
		}
	});
},5000)
