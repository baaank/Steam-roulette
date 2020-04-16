
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
	
	$.getJSON("php/show-offers.php", function(jsonObj){
		$("#withdrawoffers").html("");
		$("#depositoffers").html("");
		var withdraw = jsonObj.data.withdraw;
		for(var i = 0; i < withdraw.length; i++)
		{
			var status;
			if(withdraw[i].status ==2)
			{
				status="Active";
				$("#withdrawoffers").append("<tr class='success'><td>"+withdraw[i].offerId+"</td><td>"+withdraw[i].msg+"</td><td>"+status+"</td><td>"+withdraw[i].coins+"</td></tr>")
			}
			else
			{
				status="Ended";
				$("#withdrawoffers").append("<tr><td>"+withdraw[i].offerId+"</td><td>"+withdraw[i].msg+"</td><td>"+status+"</td><td>"+withdraw[i].coins+"</td></tr>")
			}
		}
		var deposit = jsonObj.data.deposit;
		for(var i = 0; i < deposit.length; i++)
		{
			var status;
			if(deposit[i].status ==2)
			{
				status="Active";
				$("#depositoffers").append("<tr class='success'><td>"+deposit[i].offerId+"</td><td>"+deposit[i].msg+"</td><td>"+status+"</td><td>"+deposit[i].coins+"</td></tr>")
			}
			else
			{
				status="Ended";
				$("#depositoffers").append("<tr><td>"+deposit[i].offerId+"</td><td>"+deposit[i].msg+"</td><td>"+status+"</td><td>"+deposit[i].coins+"</td></tr>")
			}
		}
	})
})

    		
	