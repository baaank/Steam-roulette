function handleJsonResponse (jsonObj, callback) {
    if (jsonObj['success'] === 1) {
        var data = jsonObj['data'];
        callback(data);
    } else {
        var msg = jsonObj['errMsg'];
        errMsg(msg);
    }
}
var testvar;
$(document).ready(function () {
	var logged = 0;
	var coins = 0;
	var tradelink = "";
	$.getJSON('/php/login-status.php', function(jsonObj) {
		logged = jsonObj.data.loginStatus;
		if(logged == 1)
		{
			coins = jsonObj.data.coins;
			tradelink = jsonObj.data.tradelink;
			$("#login").html("<span style='position: relative; top: 5px; right: 10px; display: inline-block;'>Coins: <span id='bank'>"+coins+"</span>&nbsp;&nbsp;<li class='dropdown' style='display: inline-block;'>\
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
			$('#coinsEarned').text(jsonObj.data.coinsEarned);
			$('#usersReffered').text(jsonObj.data.usersRef);
			$('#refferalCode').text(jsonObj.data.refCode);
			
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
	
	var offer =[];
	var coinsNeeded = 0;
	$('#jsonobj').fadeIn();
	
	$(document).on("click", "#generateCode", function () {
		$('#refferalCode').text('Generating the code...');
		$.getJSON('/php/new-refferal.php', function(jsonObj) {
			var refferal = jsonObj.data;
				$('#refferalCode').text(refferal);
		});
	});
	$(document).on("click", "#useCode", function () {
		$('#use-code').modal('show');
	});
	$(document).on("click", "#submitCode", function () {
		var refCode = document.getElementById("refCode").value;
		$.post('php/use-refferal.php', {refcode: refCode}, function (jsonObj) {
                handleJsonResponse(jsonObj, function (data) {
                    if (data['valid'] === 0) {
						$("#code-status").html('<div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<strong>'+data['errMsg']+'</strong>\
			  </div>')
                        return false;
                    } else {
						testvar = data;
                        $("#code-status").html('<div class="alert alert-success">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<strong>You just earned '+data+' coins</strong>\
			  </div>')
                    }
                });
            }, 'json');
	});
})

    		
	