
$(document).ready(function () {
	
	var logged = 0;
	var coins = 0;
	var tradelink = "";
	var steamid;
	$.getJSON('/php/login-status.php', function(jsonObj) {
		logged = jsonObj.data.loginStatus;
		if(logged == 1)
		{
			coins = jsonObj.data.coins;
			tradelink = jsonObj.data.tradelink;
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
	var socketIO = io(':2095' || ':8304',{'max reconnection attempts':Infinity});
	socketIO.on('connect', function(){
		sendSteamID();
		function sendSteamID(){
			if (steamid == undefined)
			{
				setTimeout(sendSteamID,1000)
			}
			else
			{
				socketIO.emit('steamid', {steamid: steamid, id: socketIO.id});
			}
		};
		
	})
	
	function withtimer(withdrawtime){
		setTimeout(function(){
			withdrawtime--;
			$("#withdrawtime").html(withdrawtime);
			if(withdrawtime<0)
			{
				if($('#deposittime').length<1)
				{
					$("#offers").html('');
					$('#offers-modal').modal('hide');
				}
				$("#withdrawOffers").html('');
			}
			else
			{
				withtimer(withdrawtime)
			}
		},1000)
	}
	function deptimer(deposittime){
		
			deposittime--;
			$("#deposittime").html(deposittime);
			
		if(deposittime<0)
			{
				if($('#withdrawtime').length<1)
				{
					$("#offers").html('');
					$('#offers-modal').modal('hide');
				}
				$("#depositOffers").html('');
			}
			else
			{
				setTimeout(function(){
					deptimer(deposittime);
				},1000)
			}
	}
	
	socketIO.on('offer', function(data){
		var withdrawtime = 0;
		var deposittime = 0;
		$("#offers").html('<a class="btn btn-info btn-large" id="showOffers"><strong>New offer waiting</strong></a>');
		if(data.withdraw >0)
			$("#withdrawOffers").html('<a class="btn btn-success" href="https://steamcommunity.com/tradeoffer/" offerid="'+data.withdraw+'" target="_blank"><strong>Withdraw offer id: '+data.withdraw+'</strong></a><br> Offer is valid for: <span id="withdrawtime"></span>>');
		if(data.withdrawtime>0)
		{
			withdrawtime = data.withdrawtime;
			withtimer(withdrawtime);
			
		}
		if(data.deposit >0)
			$("#depositOffers").html('<a class="btn btn-success" href="https://steamcommunity.com/tradeoffer/" offerid="'+data.deposit+'" target="_blank"><strong>Deposit offer id: '+data.deposit+'</strong></a><br> Offer is valid for: <span id="deposittime"></span><br><br');
		if(data.deposittime>0)
		{
			deposittime = data.deposittime;
			deptimer(deposittime);
			
		}
		
	})
	$(document).on("click", "#showOffers", function () {
		$('#offers-modal').modal('show');
		
	});
	
	var offer =[];
	var coinsNeeded = 0;
	$('#jsonobj').fadeIn();
	loadItems();
	function loadItems()
	{
		$.getJSON('/php/userInv.php', function(jsonObj) {
			
			var items = jsonObj.data;
			var inRow = 0;
			items.sort(function(a,b){return b.price - a.price});
			for(var i = 0; i < items.length; i++)
			{
				
				if(inRow==8)
				{
					$('#items-list').append('<div class="col-md-2" ></div></div><div class="row">');	
					inRow = 0;
				}
				if(inRow==0)
				{
					$('#items-list').append('<br><div class="col-md-2" >');	
				}
				
					var div = "<div class='col-md-1' ><div class='btn btn-primary' style='width: 150px; height: 200px; word-wrap: break-word; font-size: 9.5pt' name='"+items[i].id+"' coins='"+items[i].price+"' clicked=0>Coins: "+items[i].price+"<img src='http://steamcommunity-a.akamaihd.net/economy/image/"+items[i].image+"/100fx100f' alt='...' class='img-check'><p>"+items[i].name+"</p></div></div>";
					
					$('#items-list').append(div);					
					inRow++;
			}
				
			$('#loading').fadeOut(500);
			
			$('#refresh').fadeOut(500);
			setTimeout(function(){
			$('#loading').html('');
			
			$('#refresh').fadeIn(500);
			$('#refresh').html('<a class="btn btn-info btn-large" id="updateinv" href="#">Refresh inventory</a>');
			},450);
			
		});
	}
	$(document).on("click", ".btn-primary", function () {
		
				
				if($(this).attr("clicked")==0)
				{
					if(offer.length<20)
					{
						offer.push(
							name= $(this).attr("name")
						)
						$(this).toggleClass("check");
						var value = $(this).attr("coins");
						coinsNeeded += parseInt(value);
						$('#coins').html(coinsNeeded);
						$(this).attr("clicked", 1);
					}
					else
					{
						$('#loading').fadeIn(500);
						$('#loading').html('<div class="alert alert-danger" style="width: 300px"><center><strong>Only 20 items per one withdraw.</strong></center></div>');
					}
				}
				else
				{
					var index = offer.indexOf($(this).attr("name"));
					if (index > -1) {
						offer.splice(index, 1);
					}
					$(this).toggleClass("check");
					$('#loading').html('<div class="alert alert-success" style="width: 300px"><center><strong>Items loaded properly.</strong></center></div>');
					var value = $(this).attr("coins");
					coinsNeeded -= value;
					$('#coins').html(coinsNeeded);
					$('.'+$(this).attr("name")).remove();
					$(this).attr("clicked", 0);
				}
	});
	$(document).on("click", ".btn-warning", function () {
		if(offer.length>0)
			 $.post('php/create-deposit.php', {items: offer}, function (jsonObj) {					  
                    if (jsonObj.data['valid'] == 0) {
						$('#loading').fadeIn(500);
                        $('#loading').html('<div class="alert alert-danger" style="width: 300px"><center><strong>'+jsonObj.data['errMsg']+'</strong></center></div>');
                        return false;
                    } else {
						$('#loading').fadeIn(500);
                        $('#loading').html('<div class="alert alert-info" style="width: 500px"><center><strong>Your offer will be ready in a second. <br>Go to steam to accept it.<br> It will be valid for 5 minutes.</strong></center></div>');
                    }
            }, 'json');
			 
	});
	$(document).on("click", "#refresh", function () {
		$("#items-list").html("<center>Loading... <br><img src='/img/loading.gif'></center>");
		$.post('php/userInv-update.php', {}, function (jsonObj) {		
				$("#items-list").html('')		;
				offer = [];
				coinsNeeded = 0;
				$('#coins').html(coinsNeeded);
				loadItems();
            }, 'json');
		
	});
})

    		
	