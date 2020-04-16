var date;
var datechanged = 0;
var gamelength = 25000;
var timeleft = gamelength;
var round_id = 1;
var redPot = 0, greenPot = 0, blackPot = 0;
var total = 0;
var mysqlInfo;

mysqlInfo = {
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'csgo',
  charset  : 'utf8_general_ci'
};
var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection(mysqlInfo);
var crypto = require('crypto');
var processing = {};
var offers =[];
var lastRolls = [];
var currentBets = [];
var gameOn = 0;
var seed = '';
var hash = '';
const util = require('util');
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
		console.log('Sending timeleft');
		io.to(socket.id).emit('timer', ar);
		
	}
	socket.on('disconnect', function(socket){
		g_Peers.exterminate(socket);
		io.emit('playersonline', g_Peers.length);
		for(var i = 0; i < steamids.length; i++)
		{
			if(steamids[i].id == socket.id)
			{
				steamids.splice(i, 1);
			}
		}
	});
	
	socket.on('steamid', function(data){
		for(var i = 0; i < steamids.length; i++)
		{
			if(steamids[i].steamid == data.steamid)
			{
				steamids.splice(i, 1);
			}
		}
		steamids.push(data);
		
	});
	
		
	socket.on('bet', function(data){
		if(data[0].tok.length > 1)
		{
			
			if(gameOn==1)
			{
			if(	data.betval < 0)
			{
				var arr = [];
				arr.push({
					error: 1,
					text: 'Bet value below 0!'
				})
				io.to(id).emit('bank', arr);
			}
			bet(data[0].steamid, data[0].betval, data[0].id, data[0].tok, data[0].color, data[0].image);
			}
		}
	});
	
	socket.on('chatMsg', function(data){
		antiSpam.addSpam(socket);
		if(processing[socket.id])
			return;
		processing[socket.id] = true;
		sendChat(data);
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
			var secretnum = 1-Math.random()*2;
			seed = crypto.createHash('sha256').update(secretnum.toString()).digest('hex');
			seed= seed.substr(0,32)
			console.log(seed);
			hash = crypto.createHash('sha256').update(seed).digest('hex');
			console.log(hash)
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
}
function bet(steamid, betval, id, token, color, image)
		{
			
			processing[token] = true;
			if(steamid.length>20)
				return;
			mysqlConnection.query('SELECT * FROM `users` WHERE `steamid`=\''+steamid+'\'', function(err, rows) {
					if(err)
					{
						delete processing[token];
						return;
					}
					if(typeof rows === undefined)
						return;
					if(rows.length < 1)
					{
						return;
					}
					if (rows[0].coins < betval)
					{
						var arr = [];
						arr.push({
							error: 1,
							text: 'Not enough coins!'
						})
						io.to(id).emit('bank', arr);
					}
					if (rows[0].token != token)
					{
						var arr = [];
						arr.push({
							error: 1,
							text: 'Something went wrong, please refresh the page.'
						})
						io.to(id).emit('bank', arr);
					}
					else
					{
						mysqlConnection.query('UPDATE `users` SET `coins`=`coins`-'+betval+', `coinsplayed`=`coinsplayed`+'+betval+' WHERE `steamid`=\''+steamid+'\'', function(err2) {
							if(err2)
							{
								delete processing[token];
								return;
							}
							
							var arr = [];
							arr.push({
								error: 0,
								text: rows[0].coins-betval
							})
							io.to(id).emit('bank', arr);
							currentBets.push({
								steamid: steamid,
								betval: betval,
								id: id,
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
								var arr2 = [];
								arr2.push({
									img: image,
									bet: betval,
									color: color
								})
								io.emit('bigBet', arr2);
							}
							total += betval;
						});
					}
				});
				delete processing[token];
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


function draw() {
	if (processing.length == 0 || processing.length ===  undefined)
	{
		gameOn = 0;
		var hash = crypto.createHash('sha256').update(seed+round_id.toString()).digest('hex');
		round_id += 1;
		var roll = Number.parseInt(hash.substr(1,1),10);
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
		console.log('Game ended. '+currentBets.length+' bets');
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
				var secretnum = 1-Math.random()*2;
				seed = crypto.createHash('sha256').update(secretnum.toString()).digest('hex');
				console.log(seed);
				hash = crypto.createHash('sha256').update(seed).digest('hex');
				console.log(hash)
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
			redPot = 0;
			greenPot = 0;
			blackPot = 0;
			gameOn=1;
			var arr = [];
			arr.push({
				timer: gamelength,
				round: round_id
			})
			io.emit('start', arr);
			
		},4000)
	}
	else
	{
		gameOn = 0;
		console.log ('Still processing...'+processing.length);
		
		io.emit('preend', number);
		setTimeout(function(){
			draw();
		}, 1000)
		return;
	}
	setTimeout(function(){
		draw()
	},gamelength)
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
		mysqlConnection.query('UPDATE `users` SET `coins`=`coins`+'+bets[i].betval+', `coinswon`=`coinswon`+'+bets[i].betval+' WHERE `steamid`=\''+bets[i].steamid+'\'', function(err) {
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
					io.emit('total', total);
					total = 0;
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
			io.emit('total', total);
			total = 0;
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

function sendChat(data)
{
	if(data[0].msg.length < 40)
	{
		if(data[0].steamid.length>20)
				return;
		if(data[0].msg.length < 2)
				return;
			mysqlConnection.query('SELECT * FROM `users` WHERE `steamid`=\''+data[0].steamid+'\'', function(err, rows) {
				if(err)
				{
					return;
				}
				
				if(typeof rows === undefined)
					return;
				if(rows.length < 1)
				{
					return;
				}
				
				if(rows[0].chatban == 1)
					return;
				
				if(rows[0].token != data[0].tok)
					return;
				data[0].msg = data[0].msg.replace('scam','');
				data[0].msg = data[0].msg.replace('fuck','');
				data[0].msg = data[0].msg.replace('fucked','');
				data[0].msg = data[0].msg.replace('shit','');
				data[0].msg = data[0].msg.replace('rigged','');
				data[0].msg = data[0].msg.replace('csgo','');
				data[0].msg = data[0].msg.replace('jackpot','');
				data[0].msg = data[0].msg.replace('.de','');
				data[0].msg = data[0].msg.replace('.pl','');
				data[0].msg = data[0].msg.replace('.com','');
				data[0].msg = data[0].msg.replace('[','');
				data[0].msg = data[0].msg.replace('<','');
				data[0].msg = data[0].msg.replace('>','');
				data[0].msg = data[0].msg.replace(']','');
				data[0].msg = data[0].msg.replace('.','');
				data[0].msg = data[0].msg.replace(':','');
				if(data[0].name.length > 10)
				{
					data[0].name = data[0].name.substr(0, 10)+'...';
				}
				if(data[0].msg.length < 2)
					return;
				var arr = [];
				arr.push({
					image: data[0].img,
					name: data[0].name,
					msg: data[0].msg
				})
				
				io.emit('chat', arr);
					
			});
	}
}

setInterval(function () {
		mysqlConnection.query('SELECT 1');
}, 5000);
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
		io.emit('players', steamids.length)
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
