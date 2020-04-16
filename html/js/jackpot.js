
$(document).ready(function () {
	var socketIO = io(':2095' || ':8304',{'max reconnection attempts':Infinity});	
		socketIO.once('connect', function(){
	});	
	var logged = 0;
	var coins = 0;
	var tradelink = "";
	$.getJSON('/php/login-status.php', function(jsonObj) {
		logged = jsonObj.data.loginStatus;
		if(logged == 1)
		{
			coins = jsonObj.data.coins;
			tradelink = jsonObj.data.tradelink;
			$("#login").html("<span style='position: relative; top: 5px; right: 10px; display: inline-block;'>Coins: "+coins+"&nbsp;&nbsp;<li class='dropdown' style='display: inline-block;'>\
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
			socketIO.emit('steamid', {steamid: jsonObj.data.steamid, id: socketIO.id});
			
		}
		
	});
	var offer =[];
	var coinsNeeded = 0;
	$('#jsonobj').fadeIn();
	
	    $('#circle').circleProgress({
        value: 0.5,
        size: 200,
        fill: {
            gradient: ["red", "orange"]
        }
    });
	setTimeout(function(){
		 $('#circle').circleProgress({
			animationStartValue: 0.5,
			value: 1,
			size: 200,
			fill: {
				gradient: ["red", "orange"]
			}
		});
	},2000);
	
	$.getJSON('/php/botInv.php', function(jsonObj) {
		
		var items = jsonObj.data;
		var inRow = 0;
		items.sort(function(a,b){return b.price - a.price});
		for(var i = 0; i < items.length; i++)
		{
			
			if(inRow==6)
			{
				$('#items-list').append('<div class="col-md-3" ></div></div><div class="row">');	
				inRow = 0;
			}
			if(inRow==0)
			{
				$('#items-list').append('<br><div class="col-md-3" >');	
			}
			
				var div = "<div class='col-md-1' ><div class='btn btn-primary' style='width: 135px; height: 200px; word-wrap: break-word; font-size: 8.5pt' name='"+items[i].id+"' coins='"+items[i].price+"' clicked=0>"+items[i].price/1000+" $<img src='http://steamcommunity-a.akamaihd.net/economy/image/"+items[i].image+"/100fx100f' alt='...' class='img-check'><p>"+items[i].name+"</p></div></div>";
				
				$('#items-list').append(div);					
				inRow++;
		}
			
		$('#loading').fadeOut(500);
		
	});
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
						$('#coins-needed').html(coinsNeeded);
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
					$('#coins-needed').html(coinsNeeded);
					$('.'+$(this).attr("name")).remove();
					$(this).attr("clicked", 0);
				}
	});
	$(document).on("click", "#loading", function () {
		$(this).fadeOut(300);
	});
	$(document).on("click", ".btn-warning", function () {
		if(offer.length>0)
			 $.post('php/create-offer.php', {items: offer}, function (jsonObj) {					  
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
	$(document).on("click", "#settings", function () {
		$('#tradelink-modal').modal('show');
	});
	
})

    		
	