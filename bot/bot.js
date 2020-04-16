var settings = require('./settings.js');
var util = require('util');
var crypto = require('crypto');
var fs = require('fs');
//MySQL connection
var mysqlInfo;
mysqlInfo = {
  host     : settings.DBhost,
  user     : settings.DBuser,
  password : settings.DBpassword,
  database : settings.DBdatabase,
  charset  : settings.DBcharset
};
var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection(mysqlInfo);
setInterval(function () {
		mysqlConnection.query('SELECT 1');
}, 5000);
////
Array.prototype.exterminate = function (value) {
	this.splice(this.indexOf(value), 2);
}
var log_file = fs.createWriteStream(__dirname + '/debug.log', {flags : 'w'});
var log_stdout = process.stdout;
console.log = function(d) { //
  log_file.write(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' - '  + util.format(d) + '\n');
  log_stdout.write(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' - '  + util.format(d) + '\n');
};

//Steam conection and reconnection
var getSteamAPIKey = require('steam-web-api-key');
var SteamTradeOffers = require('steam-tradeoffers');
var offers = new SteamTradeOffers();
var SteamCommunity = require('steamcommunity');
var community = new SteamCommunity();
var SteamTotp = require('steam-totp');
var Steam = require('steam');
var TradeOfferManager = require('steam-tradeoffer-manager/lib/index.js');
var steamClient = new Steam.SteamClient();
var steamUser = new Steam.SteamUser(steamClient);
var steamFriends = new Steam.SteamFriends(steamClient);
var SteamWebLogOn = require('steam-weblogon');
var steamWebLogOn = new SteamWebLogOn(steamClient, steamUser);
var mySteamID, itemsAmount;
var relogretry = 0, reloggin = 0;;
var processingId = [];
var processingIdOld = [];
steamClient.connect();
steamClient.on('connected', function(){
	console.log('conected!');
	steamUser.logOn({
		account_name: settings.user,
		password: settings.password,
		two_factor_code: SteamTotp.generateAuthCode(settings.sharedSecret)
	});
})

steamClient.on('error', function(error){
	console.log('Error!' + error);
	steamClient.connect();
})

steamClient.on('loggedOff', function(error){
	console.log('disconnected!' + error);
	steamClient.connect();
})
var manager = new TradeOfferManager({
	"steam": steamUser, // Polling every 30 seconds is fine since we get notifications from Steam
	"domain": "Csgoloop.com", // Our domain is example.com
	"language": "en", // We want English item descriptions
	"cancelTime": 180000,
	"pollInterval": 5000,
	"pendingCancelTime": 180000,
	"cancelOfferCount": 1,
	"cancelOfferCountMinAge": 180000,
});
function relog(){
	if(!steamClient.loggedOn)
	{
		setTimeout(function(){relog()}, 5000);
		return;
	}
	steamWebLogOn.webLogOn(function(sessionID, newCookie) {
			community.setCookies(newCookie);
			manager.setCookies(newCookie, function(err) {
			if(err) {
				console.log(err);
				setTimeout(function(){relog()},5000);
				return;
			}
		});
	});
}
steamClient.on('logOnResponse', function(logOnResponse){
	 if (logOnResponse.eresult == Steam.EResult.OK) {
		 mySteamID = logOnResponse.client_supplied_steamid;
		 console.log('Logged to steam!');
		steamWebLogOn.webLogOn(function(sessionID, newCookie) {
		community.setCookies(newCookie);
		community.startConfirmationChecker(10000, settings.identitySecret);
		manager.setCookies(newCookie, function(err) {
			if(err) {
				console.log(err);
				process.exit(1); // Fatal error since we couldn't get our API key
				return;
			}
			console.log("Got API key: " + manager.apiKey);
		});
			console.log('Bot is now ready to work!');
			setTimeout(function(){
				onStart();
			}, 5000)
		});
		setTimeout(function(){
			community.startConfirmationChecker(5000, settings.identitySecret);
			steamFriends.setPersonaState(Steam.EPersonaState.Online);
		},5000)
	 }
	 else
	 {
		 console.log('Couldn`t log to steam. Eresult: '+logOnResponse.eresult);
	 }
})
steamUser.on('error', function(error){
	console.log('Error on steam' + error);
	steamUser.logOn({
		account_name: settings.user,
		password: settings.password,
		two_factor_code: SteamTotp.generateAuthCode(settings.sharedSecret)
	});
})

steamUser.on('loggedOff', function(error){
	console.log('Logged out from steam' + error);
	steamUser.logOn({
		account_name: settings.user,
		password: settings.password,
		two_factor_code: SteamTotp.generateAuthCode(settings.sharedSecret)
	});
})
steamFriends.on('message', function(source, message, type, chatter) {
	if(type != Steam.EChatEntryType.ChatMsg) return;
	console.log(message);
});
//Checking if table exists in database, if not - create it
function onStart(){
	mysqlConnection.query("CREATE TABLE IF NOT EXISTS `bot"+settings.botID+"` (  `item_name` text NOT NULL,  `assetId` text NOT NULL, `icon_url` text NOT NULL, `status` int(11) NOT NULL DEFAULT '0') ENGINE=MyISAM  DEFAULT CHARSET=latin1 COMMENT='Table with bot items' AUTO_INCREMENT=2;", function(er){
		if(er){
			console.log('Error when creating bot inventory table: '+er);
			return;
		}
		mysqlConnection.query("TRUNCATE TABLE `bot"+settings.botID+"`", function(err){
			if(err){
				console.log(err)
					return;
				}
			manager.loadInventory(730, 2, true, function(err, items, currencies){
					if(err) {
						console.log('Couldn`t load items from bot inventory, retrying'+err);
						onStart();
						return;
					}
					var botItems=[],num=0;
					itemsAmount = items.length;
					for (var i = 0; i < items.length; i++) {
						if (items[i].tradable) {
							botItems[num] = [items[i].market_hash_name, items[i].id, items[i].icon_url, 1]
							num++;
						}
					}
					if(items.length> 0){
						mysqlConnection.query("INSERT INTO `bot"+settings.botID+"` (item_name, assetID, icon_url, status) VALUES ?", [botItems], function(err2){
							if(err2){
								console.log(err2);
								return;
							}
							
						})
					}
					setTimeout(function(){
								onStart2();
							}, 5000)
				});
		});
	});
}
function onStart2(){
	mysqlConnection.query('SELECT * FROM `bots` WHERE `steamid`='+mySteamID+'', function(err,row){
		if(err)
		{
			console.log(err)
			return;
		}
		if(row.length<1)
		{
			var botInfo = {id: settings.botID, steamid: mySteamID, items: itemsAmount};
			mysqlConnection.query("INSERT INTO `bots` SET ?", botInfo, function(err2){
				if(err2){
					console.log(err2);
					mysqlConnection.query("UPDATE `bots` SET ? WHERE `id`="+settings.botID+"", botInfo, function(err3){
						console.log(err3);
					});
				}
				
			})
		}
		checkoffers();
		checkoldoffers();
	});
}
//Offers handling
function checkoffers(){
	mysqlConnection.query('SELECT * FROM `bots` WHERE `id`='+settings.botID+'', function(e,r){
		if(e)
		{
			console.log('Error'+e)
			setTimeout(function(){checkoffers()}, 2500);
			return;
		}
		if(r[0].status==0 || !steamClient.loggedOn)
		{
			setTimeout(function(){checkoffers()}, 2500);
			return;
		}
		var unixtime = Math.round(new Date().getTime()/1000.0);
		mysqlConnection.query('SELECT * FROM `depositoffers` WHERE `status`=1 AND `bot`='+settings.botID+' LIMIT 1', function(err,row){
			if(err)
			{
				console.log('Error'+err)
				setTimeout(function(){checkoffers()}, 2500);
				return;
			}
			
			if(row.length>0)
			{
				if(processingId.indexOf(row[0].id)<0)
				{
					processingId.push(row[0].id)
					mysqlConnection.query('UPDATE `depositoffers` SET `status`=2, `date`='+unixtime+' WHERE `id`='+row[0].id+'', function(err3){
						if(err3)
						{
							console.log('Error'+err3)
							setTimeout(function(){checkoffers()}, 2500);
							return;
						}
						var items = (row[0].items).split(';');
						var steamid = row[0].steamid;
						var id = row[0].id;
						var coins = row[0].coins;
						handleDepositOffers(id, items, steamid, 5, coins);
						setTimeout(function(){checkoffers()}, 2500);
						return;
					});
				}
				else
				{
					setTimeout(function(){checkoffers()}, 2500);
					return;
				}
			}
			else
			{
				mysqlConnection.query('SELECT * FROM `withdrawoffers` WHERE `status`=1 AND `bot`='+settings.botID+' LIMIT 1', function(err2,row2){
					if(err2)
					{
						console.log('Error'+err2)
						setTimeout(function(){checkoffers()}, 2500);
						return;
					}
					if(row2.length>0)
					{
						if(processingId.indexOf(row2[0].id)<0)
						{
							processingId.push(row2[0].id)
							mysqlConnection.query('UPDATE `withdrawoffers` SET `status`=2, `date`='+unixtime+' WHERE `id`='+row2[0].id+'', function(err4){
								if(err4)
								{
									console.log('Error'+err4)
									setTimeout(function(){checkoffers()}, 2500);
									return;
								}
								var items = (row2[0].items).split(';');
								var steamid = row2[0].steamid;
								var id = row2[0].id;
								var coins = row2[0].coins;
								handleWithdrawOffers(id, items, steamid, 5, coins);
								setTimeout(function(){checkoffers()}, 2500);
								return;
							});
						}
					}
					else
					{
						setTimeout(function(){checkoffers()}, 2500);
						return;
					}
				});
			}
		});
	});
}


						

//Deposit offers handling
function handleDepositOffers(id, items, steamid, retries, coins)
{
	if(!steamClient.loggedOn)
	{
		setTimeout(function(){handleDepositOffers(id, items, steamid, retries, coins)}, 5000);
		return;
	}
	var item = [];
	for(var i = 0; i < items.length - 1; i++)
	{
		item[i] = {
				appid: 730,
				contextid: 2,
				amount: 1,
				assetid: items[i]
			}
	}
	mysqlConnection.query('SELECT `tradelink` FROM `users` WHERE `steamid`='+steamid+'', function(er,row){
		if(er)
		{
			console.log('Error on selecting tradelink from db '+er);
			processingId.exterminate(id);
			return;
		}
		if(row.length<1)
		{
			processingId.exterminate(id);
			return;
		}
		var token = row[0].tradelink;
		token = token.substr(token.indexOf('&token')+7);	
		var code = crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
		code = code.substr(1,5);
		manager.getEscrowDuration(steamid, token, function(err, my, their){
				if(err || their == undefined){
				 setTimeout(function(){
						retries --;
						if(retries > 0)
						{
							handleDepositOffers(id, items, steamid, retries, coins);	
						}
						else
						{
							processingId.exterminate(id);
						}
						
					},15000);
					return;
				}
				if(their > 0)
				{
					mysqlConnection.query('UPDATE `depositoffers` SET `msg`="Mobile auth is not enabled", `status`=4 WHERE `id`='+id+'', function(err){
						if(err)
						{
							console.log('Error on updating offer msg in database '+err);
						}
					});
					processingId.exterminate(id);
					return;
				}
				var newoffer = manager.createOffer(steamid);
				newoffer.addTheirItems(item);
				newoffer.send('Security code: '+code, token, function(err, status){
					if(err)
					{
						console.log('Send offer error: '+err);
						setTimeout(function(){
							retries --;
							if(retries > 0){
								handleDepositOffers(id, items, steamid, retries, coins);
							}
							else
							{
								processingId.exterminate(id);
								mysqlConnection.query('UPDATE `depositoffers` SET `msg`="Error on sending the offer", `status`=4 WHERE `id`='+id+'', function(err){
									if(err)
									{
										console.log('Error on updating offer msg in database '+err);
									}
								});
							}
						},15000)
					}
					else
					{
						mysqlConnection.query('UPDATE `depositoffers` SET `msg`="Security code: '+code+'", `offerId`="'+newoffer.id+'" WHERE `id`='+id+'', function(err){
							if(err)
							{
								console.log('Error on updating security code for trade in database '+err);
							}
						});
					}
						
				})
		})
	})
}
//Withdraw offers handling
function handleWithdrawOffers(id, items, steamid, retries, coins)
{
	if(!steamClient.loggedOn)
	{
		setTimeout(function(){handleWithdrawOffers(id, items, steamid, retries, coins)}, 5000);
		return;
	}
	var item = [];
	for(var i = 0; i < items.length - 1; i++)
	{
		item[i] = {
				appid: 730,
				contextid: 2,
				amount: 1,
				assetid: items[i]
			}
	}
	mysqlConnection.query('SELECT `tradelink` FROM `users` WHERE `steamid`='+steamid+'', function(er,row){
		if(er)
		{
			processingId.exterminate(id);
			console.log('Error on selecting tradelink from db '+er);
			return;
		}
		if(row.length<1)
		{
			processingId.exterminate(id);
			return;
		}
		var token = row[0].tradelink;
		token = token.substr(token.indexOf('&token')+7);	
		var code = crypto.createHash('sha256').update(Math.random().toString()).digest('hex');
		code = code.substr(1,5);
		manager.getEscrowDuration(steamid, token, function(err, my, their){
				if(err || their == undefined){
				 setTimeout(function(){
						retries --;
						if(retries > 0)
						{
							handleWithdrawOffers(id, items, steamid, retries, coins);	
						}
						else
						{
							returnCoins(coins, steamid);
							processingId.exterminate(id);
						}
						
					},15000);
					return;
				}
				if(their > 0)
				{
					mysqlConnection.query('UPDATE `withdrawoffers` SET `msg`="Mobile auth is not enabled", `status`=4 WHERE `id`='+id+'', function(err){
						if(err)
						{
							console.log('Error on updating offer msg in database '+err);
						}
					});
					returnCoins(coins, steamid);
					processingId.exterminate(id);
					return;
				}
				var newoffer = manager.createOffer(steamid);
				newoffer.addMyItems(item);
				newoffer.send('Security code: '+code, token, function(err, status){
					if(err)
					{
						setTimeout(function(){
							retries --;
							if(retries > 0){
								handleWithdrawOffers(id, items, steamid, retries, coins);
							}
							else
							{
								returnCoins(coins, steamid);
								processingId.exterminate(id);
								console.log('Send offer error: '+err);
								mysqlConnection.query('UPDATE `withdrawoffers` SET `msg`="Error on sending the offer", `status`=4 WHERE `id`='+id+'', function(err){
									if(err)
									{
										console.log('Error on updating offer msg in database '+err);
									}
								});
							}
						},15000)
					}
					else
					{
						mysqlConnection.query('UPDATE `withdrawoffers` SET `msg`="Security code: '+code+'", `offerId`="'+newoffer.id+'" WHERE `id`='+id+'', function(err){
							if(err)
							{
								console.log('Error on updating security code for trade in database '+err);
							}
						});
					}
						
				})
		})
	})
}
//Tracking the offers
manager.on('sentOfferChanged', function(offer, oldState) {
	if(offer.state == TradeOfferManager.ETradeOfferState.Canceled || offer.state == TradeOfferManager.ETradeOfferState.Accepted || offer.state == TradeOfferManager.ETradeOfferState.Invalid || offer.state == TradeOfferManager.ETradeOfferState.Expired || offer.state == TradeOfferManager.ETradeOfferState.Declined || offer.state == TradeOfferManager.ETradeOfferState.InvalidItems || offer.state == TradeOfferManager.ETradeOfferState.CanceledBySecondFactor || offer.state == TradeOfferManager.ETradeOfferState.Countered)
	{
		mysqlConnection.query('SELECT * FROM `depositoffers` WHERE `offerId`='+offer.id+' AND `status`=2', function(err,row){
			if(err)
			{
				console.log('Error'+err)
				return;
			}
			mysqlConnection.query('SELECT * FROM `withdrawoffers` WHERE `offerId`='+offer.id+' AND `status`=2', function(err2,row2){
				if(err2)
				{
					console.log('Error'+err2)
					return;
				}
				if(row.length>0){
					processingId.exterminate(row[0].id);
					//deposit offer
					mysqlConnection.query('UPDATE `depositoffers` SET `msg`="'+TradeOfferManager.getStateName(offer.state)+'", `status`=3 WHERE `offerId`='+offer.id+'', function(err){
						if(err)
						{
							console.log('Error on updating offer msg in database '+err);
						}
						else
						{
							if(offer.state == TradeOfferManager.ETradeOfferState.Accepted)
							{
								updateBotInvDeposit(offer);
								mysqlConnection.query('UPDATE `users` SET `coins`=`coins`+'+row[0].coins+' WHERE `steamid`='+row[0].steamid+'', function(err){
									if(err)
									{
										console.log('Error on adding coins to user after deposit offer '+err);
									}
								});
							}
						}
					});
				}
				else if(row2.length>0){
					processingId.exterminate(row2[0].id);
					//withdraw offer
					var items = (row2[0].items).split(';');
					
					mysqlConnection.query('UPDATE `withdrawoffers` SET `msg`="'+TradeOfferManager.getStateName(offer.state)+'", `status`=3 WHERE `offerId`='+offer.id+'', function(err){
						if(err)
						{
							console.log('Error on updating offer msg in database '+err);
						}
						else
						{
							if(offer.state == TradeOfferManager.ETradeOfferState.Canceled || offer.state == TradeOfferManager.ETradeOfferState.Invalid || offer.state == TradeOfferManager.ETradeOfferState.Expired || offer.state == TradeOfferManager.ETradeOfferState.Declined || offer.state == TradeOfferManager.ETradeOfferState.InvalidItems || offer.state == TradeOfferManager.ETradeOfferState.CanceledBySecondFactor || offer.state == TradeOfferManager.ETradeOfferState.Countered)
							{
								returnCoins(row2[0].coins, row2[0].steamid);
								updateBotInvWithdraw(items);
							}
							else
							{
								removeItems(items, items.length-2);
							}
						}
					});
				}
			})
		});
	};
});

manager.on('newOffer', function(offer) {
	offer.decline(function(err){
		if(err)
		{
			console.log(err);
		}
	})
});

function removeItems(items, counter){
	 mysqlConnection.query('DELETE FROM `bot'+settings.botID+'` WHERE `assetId`='+items[counter]+'', function(err){
		if(err)
		{
			console.log(err);
		}
		else
		{
			counter--;
			if(counter > -1)
			{
				removeItems(items, counter);
			}
			else
			{
				return;
			}
		}
	});
}
function returnCoins(coins, steamid){
	if(coins>0)
	{
		 mysqlConnection.query('UPDATE `users` SET `coins`=`coins`+'+coins+' WHERE `steamid`='+steamid+'', function(err){
			if(err)
			{
				console.log(err);
			}
		});
	}
}
function updateBotInvWithdraw(items){
	for(var i = 0; i < items.length-1; i++)
	{
		 mysqlConnection.query('UPDATE `bot'+settings.botID+'` SET `status`=1 WHERE `assetId`='+items[i]+'', function(err){
			if(err)
			{
				console.log(err);
			}
		});
	}
}
function updateBotInvDeposit(offer)
{
	offer.getReceivedItems(function(err, items) {
		if(err) {
			console.log("Couldn't get received items: " + err);
			setTimeout(function(){
				getitems(offer);
			},2000)
		}
		else
		{
			for(var i =0; i < items.length; i++)
			{
				var post = {item_name: items[i].market_hash_name, assetId: items[i].assetid, icon_url: items[i].icon_url, status: '1'}
				mysqlConnection.query('INSERT INTO `bot'+settings.botID+'` SET ?',post, function(err){
					if(err)
					{
						console.log('Error on adding items to bot inv '+err);
					}
				});
			}
		}
	});
}
setInterval(function(){
	relog();
}, 3600000);

setInterval(function(){
	mysqlConnection.query('SELECT * FROM `bot'+settings.botID+'` WHERE 1', function(err, row){
			if(err)
			{
				console.log(err);
				return;
			}
			mysqlConnection.query('UPDATE `bots` SET `items`='+row.length+' WHERE `id`='+settings.botID+'', function(err2){
				if(err2)
				{
					console.log(err2);
					return;
				}
			});
		});
}, 5000);

setInterval(function(){
	mysqlConnection.query('SELECT * FROM `bots` WHERE `id`='+settings.botID+'', function(err, row){
		if(err)
		{
			console.log(err);
			return;
		}
		if(row[0].status==1)
		{
			mysqlConnection.query('UPDATE `bots` SET `status`=2 WHERE `id`='+settings.botID+'', function(){});
			setTimeout(function(){
				updateBot();
				function updateBot(){
					if (!steamClient.loggedOn) {
						setTimeout(function(){updateBot()}, 5000)
					}
					else
					{
						manager.loadInventory(730, 2, true, function(err, items, currencies){
							if(err) {
								console.log('Couldn`t load items from bot inventory, retrying'+err);
								mysqlConnection.query('UPDATE `bots` SET `status`=1 WHERE `id`='+settings.botID+'', function(){});
								return;
							}
							var botItems=[],num=0;
							itemsAmount = items.length;
							for (var i = 0; i < items.length; i++) {
								if (items[i].tradable) {
									botItems[num] = [items[i].market_hash_name, items[i].id, items[i].icon_url, 1]
									num++;
								}
							}
							if(items.length> 0){
								mysqlConnection.query("TRUNCATE TABLE `bot"+settings.botID+"`", function(err){
								if(err){
									console.log(err)
									mysqlConnection.query('UPDATE `bots` SET `status`=1 WHERE `id`='+settings.botID+'', function(){});
										return;
									}
									mysqlConnection.query("INSERT INTO `bot"+settings.botID+"` (item_name, assetID, icon_url, status) VALUES ?", [botItems], function(err2){
										if(err2){
											console.log(err2);
											return;
										}
										
									})
								});
							}
							mysqlConnection.query('UPDATE `bots` SET `status`=1 WHERE `id`='+settings.botID+'', function(){});
						});
					}
				}
			}, 240000)
		}
		
	})
}, 7200000)


function checkoldoffers(){
		mysqlConnection.query('SELECT * FROM `bots` WHERE `id`='+settings.botID+'', function(e,r){
		if(e)
		{
			console.log('Error'+e)
			setTimeout(function(){checkoldoffers()}, 5000);
			return;
		}
		if(r[0].status==0 || !steamClient.loggedOn)
		{
			setTimeout(function(){checkoldoffers()}, 5000);
			return;
		}
		var unixtime = Math.round(new Date().getTime()/1000.0);
		mysqlConnection.query('SELECT * FROM `depositoffers` WHERE `status`=2 AND `bot`='+settings.botID+' AND `date` < UNIX_TIMESTAMP( )-300 LIMIT 1', function(err,row){
			if(err)
			{
				console.log('Error'+err)
				setTimeout(function(){checkoldoffers()}, 5000);
				return;
			}
			
			if(row.length>0)
			{
				if(processingIdOld.indexOf(row[0].id)<0)
				{
					processingIdOld.push(row[0].id)
					var offerId = row[0].offerId;
					var id = row[0].id;
					handleOldOffer(id, offerId, 3, 0, 0, 0, 0);
					setTimeout(function(){checkoldoffers()}, 5000);
					return;
				}
				else
				{
					setTimeout(function(){checkoldoffers()}, 5000);
					return;
				}
			}
			else
			{
				mysqlConnection.query('SELECT * FROM `withdrawoffers` WHERE `status`=2 AND `bot`='+settings.botID+' AND `date` < UNIX_TIMESTAMP( )-300 LIMIT 1', function(err2,row2){
					if(err2)
					{
						console.log('Error'+err2)
						setTimeout(function(){checkoldoffers()}, 5000);
						return;
					}
					if(row2.length>0)
					{
						if(processingIdOld.indexOf(row2[0].id)<0)
						{
							processingIdOld.push(row2[0].id)
							var offerId = row2[0].offerId;
							var id = row2[0].id;
							var items = row2[0].items;
							var coins = row2[0].coins;
							var steamid = row2[0].steamid;
							handleOldOffer(id, offerId, 3, 1, items, coins, steamid);
							setTimeout(function(){checkoldoffers()}, 5000);
							return;
						}
					}
					else
					{
						setTimeout(function(){checkoldoffers()}, 5000);
						return;
					}
				});
			}
		});
	});
}

function handleOldOffer(id, offerid, retries, type, items, coins, steamid){
	if(!steamClient.loggedOn)
	{
		setTimeout(function(){handleOldOffer(id, offerid, retries, type, items, coins, steamid)}, 5000);
		return;
	}
	manager.getOffer(offerid, function(error, offer){
		if(error)
		{
			retries--;
			if(retries < 0)
			{
				console.log(error);
				if(type == 0)
				{
					mysqlConnection.query('UPDATE `depositoffers` SET `status`=3, `msg`="There was an error while processing your offer." WHERE `id`='+id+'', function(err){
						if(err)
						{
							console.log('Error on updating deposit offer '+err);
						}
					});
				}
				else
				{
					mysqlConnection.query('UPDATE `withdrawoffers` SET `status`=3, `msg`="There was an error while processing your offer." WHERE `id`='+id+'', function(err){
						if(err)
						{
							console.log('Error on updating withdraw offer '+err);
						}
					});
					items = items.split(';');
					returnCoins(coins, steamid);
					updateBotInvWithdraw(items);
				}
				processingIdOld.exterminate(id);
			}
			else
			{
				setTimeout(function(){
					handleOldOffer(id, offerid, retries, type, items, coins, steamid);
					}, 10000)
			}
			return;
		}
		if(offer.state == TradeOfferManager.ETradeOfferState.Canceled || offer.state == TradeOfferManager.ETradeOfferState.Accepted || offer.state == TradeOfferManager.ETradeOfferState.Invalid || offer.state == TradeOfferManager.ETradeOfferState.Expired || offer.state == TradeOfferManager.ETradeOfferState.Declined || offer.state == TradeOfferManager.ETradeOfferState.InvalidItems || offer.state == TradeOfferManager.ETradeOfferState.CanceledBySecondFactor || offer.state == TradeOfferManager.ETradeOfferState.Countered)
		{
			mysqlConnection.query('SELECT * FROM `depositoffers` WHERE `offerId`='+offer.id+'', function(err,row){
				if(err)
				{
					console.log('Error'+err)
					return;
				}
				mysqlConnection.query('SELECT * FROM `withdrawoffers` WHERE `offerId`='+offer.id+'', function(err2,row2){
					if(err2)
					{
						console.log('Error'+err2)
						return;
					}
					if(row.length>0){
						processingIdOld.exterminate(id);
						//deposit offer
						
						mysqlConnection.query('UPDATE `depositoffers` SET `msg`="'+TradeOfferManager.getStateName(offer.state)+'", `status`=3 WHERE `offerId`='+offer.id+'', function(err){
							if(err)
							{
								console.log('Error on updating offer msg in database '+err);
							}
							else
							{
								if(offer.state == TradeOfferManager.ETradeOfferState.Accepted)
								{
									updateBotInvDeposit(offer);
									mysqlConnection.query('UPDATE `users` SET `coins`=`coins`+'+row[0].coins+' WHERE `steamid`='+row[0].steamid+'', function(err){
										if(err)
										{
											console.log('Error on adding coins to user after deposit offer '+err);
										}
									});
								}
							}
						});
					}
					else if(row2.length>0){
						processingIdOld.exterminate(id);
						//withdraw offer
						var items = (row2[0].items).split(';');
						
						mysqlConnection.query('UPDATE `withdrawoffers` SET `msg`="'+TradeOfferManager.getStateName(offer.state)+'", `status`=3 WHERE `offerId`='+offer.id+'', function(err){
							if(err)
							{
								console.log('Error on updating offer msg in database '+err);
							}
							else
							{
								if(offer.state == TradeOfferManager.ETradeOfferState.Canceled || offer.state == TradeOfferManager.ETradeOfferState.Invalid || offer.state == TradeOfferManager.ETradeOfferState.Expired || offer.state == TradeOfferManager.ETradeOfferState.Declined || offer.state == TradeOfferManager.ETradeOfferState.InvalidItems || offer.state == TradeOfferManager.ETradeOfferState.CanceledBySecondFactor || offer.state == TradeOfferManager.ETradeOfferState.Countered)
								{
									returnCoins(row2[0].coins, row2[0].steamid);
									updateBotInvWithdraw(items);
								}
								else
								{
									removeItems(items, items.length-2);
								}
							}
						});
					}
				})
			});
		};
	});
}