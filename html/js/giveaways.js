function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
$(document).ready(function () {
	var logged = 0;
	var coins = 0;
	var tradelink = "";
	var steamid;
	var image = "";
	var name = "";
	$.getJSON('/php/login-status.php', function(jsonObj) {
		logged = jsonObj.data.loginStatus;
		testvar = jsonObj.data;
		if(logged == 1)
		{
			coins = jsonObj.data.coins;
			tradelink = jsonObj.data.tradelink;
			image = jsonObj.data.image;
			$("#login").html("<span style='position: relative; top: 5px; right: 10px; display: inline-block;'><span id='offers'></span>&nbsp;&nbsp;&nbsp;&nbsp;Coins: <span id='bank'>"+coins+"</span>&nbsp;&nbsp;<li class='dropdown' style='display: inline-block;'>\
							 <a href='#' class='dropdown-toggle' data-toggle='dropdown'><img src='"+jsonObj.data.image+"' style='height:50px; width:50px; display: inline-block;' ></a>\
							<ul class='dropdown-menu'>\
								<li>\
									<a id='settings' href='#'>Settings</a>\
								</li>\
								<li>\
									<a href='/php/steamauth/logout.php'>Log out</a>\
								</li>\
							</ul>\
						</li></span>");
			$("#bank2").html('Your coins: <span id="betCoins">'+coins+'</span><span id="won" style="color:green"></span>');
			if(tradelink.length < 1)
			{
				$('#tradelink-modal').modal('show');
			}
			else
			{
				$('#tlink').html('<strong>Your tradelink:</strong>');
				document.getElementById("tradelink").value = tradelink;
			}
			steamid = jsonObj.data.steamid;
			name = jsonObj.data.name;
		}
		if(jsonObj.data.alert[0]==1)
		{
			$(".container-fluid").prepend('  <div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<center><strong>'+jsonObj.data.alertMsg[0]+'</strong></center>\
			  </div>');
		}
	});
	$(document).on("click", "#settings", function () {
		$('#tradelink-modal').modal('show');
		
	});
	$(document).on("click", "#tradelinksave", function () {
		var tradelink = document.getElementById("tradelink").value;
		tradelink = tradelink.trim();	
		$.post('php/savetradelink.php', {tlink: tradelink}, function (jsonObj) {					  
                    if (jsonObj.data['valid'] == 0) {
						$('#tlink').html('<div class="alert alert-danger" style="width: 300px"><center><strong>'+jsonObj.data['errMsg']+'</strong></center></div>');
                        return false;
                    } else {
                        $('#tlink').html('<div class="alert alert-info" style="width: 500px"><center><strong>Your tradelink has been saved!</strong></center></div>');
                    }
            }, 'json');
	});
	load();
	
	function load(){
		$('#giveaways').html('');
		$.getJSON('/php/giveaways.php', function(jsonObj) {
			var giveawaysActive = jsonObj.data.active;
			if(giveawaysActive!= null)
			{
				giveawaysActive.forEach(function(obj) {
					name = obj.name;
					itemImage = obj.image;
					value = obj.value;
					totalCoins = obj.totalCoins,
					coins= obj.coins;
					start= obj.timeStart;
					end= obj.timeEnd;
					userCoins = obj.userTickets;
					if(userCoins == null)
					{
						userCoins = 0;
					}
					if(coins == null)
					{
						coins = 0;
					}
					id = obj.id;
					perc = coins/totalCoins;
					perc = 100*perc.toFixed(2);
				
					$('#giveaways').append('<div class="jumbotron">\
						<div class="row"><center><h3>'+name+'</h3></center></div><div class="row"><div class="col-md-1"></div><div class="col-md-3" style="text-align: right;">\
						<b>Value: </b>'+value+'$<br><b>Total coins: </b>'+totalCoins+'<br><b>Coins now: </b>'+coins+'<br><b>Your coins: </b>'+userCoins+'<br>\
						</div><div class="col-md-4"><center><img width="250" height="200" src="http://steamcommunity-a.akamaihd.net/economy/image/'+itemImage+'/360fx360f"></center></div><div class="col-md-3"><b>Started: </b>'+timeConverter(start)+'<br><b>Ends: </b>'+timeConverter(end)+'<br><a id="dep-btn" itemname="'+name+'" userCoins="'+userCoins+'" coins="'+coins+'" totalCoins="'+totalCoins+'" giveawayID="'+id+'" class="btn btn-warning btn-large" style="width: 150px; height:35px">Deposit coins</a></div><div class="col-md-1"></div><div class="row"></div><center><div class="progress" style="width:70%"><div style="width: '+perc+'%;" aria-valuemax="100" aria-valuemin="0" aria-valuenow="'+perc+'" role="progressbar" class="progress-bar"><h4 style="font-size: 18pt">'+perc+'%</h4></div></div><div class="col-xs-2"></center></div></div>\
					</div>')
				})
			}
			var giveawaysPast = jsonObj.data.past;
			if(giveawaysPast!= null)
			{
				giveawaysPast.forEach(function(obj) {
					name = obj.name;
					itemImage = obj.image;
					value = obj.value;
					totalCoins = obj.totalCoins,
					coins= obj.coins;
					start= obj.timeStart;
					end= obj.timeEnd;
					userCoins = obj.userTickets;
					winnerimg = obj.winnerimg;
					winnername = obj.winnername;
					if(userCoins == null)
					{
						userCoins = 0;
					}
					if(coins == null)
					{
						coins = 0;
					}
					id = obj.id;
					perc = coins/totalCoins;
					perc = 100*perc.toFixed(2);
					
					$('#giveaways').append('<div class="jumbotron">\
						<div class="row"><center><h3>'+name+' - ENDED</h3></center></div><div class="row"><div class="col-md-2"><center>Winner<br><span style="color: orange; font-size: 13pt">'+winnername+'</span><br><img src="'+winnerimg+'" style="width:100px; height: 100px;"><br></center></div><div class="col-md-3" style="text-align: right;">\
						<b>Value: </b>'+value+'$<br><b>Total coins: </b>'+totalCoins+'<br><b>Coins deposited: </b>'+coins+'<br><b>Your coins: </b>'+userCoins+'<br>\
						</div><div class="col-md-4"><center><img width="250" height="200" src="http://steamcommunity-a.akamaihd.net/economy/image/'+itemImage+'/360fx360f"></center></div><div class="col-md-3"><b>Started: </b>'+timeConverter(start)+'<br><b>Ended: </b>'+timeConverter(end)+'<br></div><div class="row"></div></div>\
					</div>')
				})
			}
		});
	}
	$(document).on("click", "#dep-btn", function () {
		$("#giveawayID").text($(this).attr("giveawayID"));
		$("#itemName").text($(this).attr("itemname"));
		$("#totalcoins").text($(this).attr("totalCoins")/20);
		
		$("#depositBtn").attr("givid", $(this).attr("giveawayID"));
		
		$("#coinsToEnter").val('');
		
		$('#enterModal').modal('show');
	});
	
	$(document).on("click", "#depositBtn", function () {
		if($("#coinsToEnter").val() > 0)
		{
			var depCoins = $("#coinsToEnter").val();
			$.post('php/enter-giveaway.php', {coins: depCoins, id: $(this).attr("givid")}, function (jsonObj) {					  
                    if (jsonObj.data['valid'] == 0) {
						$("#infoAlert").html('<div class="alert alert-danger">\
							<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
							<center><strong>'+jsonObj.data['errMsg']+'</strong></center>\
						  </div>');
						$("#infoAlert").animate({width: ["toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle" }, 0, "linear");
						  $("#infoAlert").animate({	width: ["100%", "swing" ],	height: [ "toggle", "swing" ],	opacity: "toggle"  }, 500, "linear");
                    } else {
						load();
						$("#bank").html(jsonObj.data);
                        $("#infoAlert").html('<div class="alert alert-success">\
							<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
							<center><strong>You entered the giveaway!</strong></center>\
						  </div>');
						$("#infoAlert").animate({
							width: ["toggle", "swing" ],
							height: [ "toggle", "swing" ],
							opacity: "toggle"
						  }, 0, "linear", function() {
						  });
						  $("#infoAlert").animate({
							width: ["100%", "swing" ],
							height: [ "toggle", "swing" ],
							opacity: "toggle"
						  }, 500, "linear", function() {
						  });
                    }
            }, 'json');
		}
		else
		{
			$("#infoAlert").html('<div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<center><strong>Enter value bigger than 0</strong></center>\
			  </div>');
			$("#infoAlert").animate({
    width: ["toggle", "swing" ],
    height: [ "toggle", "swing" ],
    opacity: "toggle"
  }, 0, "linear", function() {
  });
  $("#infoAlert").animate({
    width: ["100%", "swing" ],
    height: [ "toggle", "swing" ],
    opacity: "toggle"
  }, 500, "linear", function() {
  });
			
			
			
		}
	});
})