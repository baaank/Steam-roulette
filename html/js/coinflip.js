function handleJsonResponse (jsonObj, callback) {
    if (jsonObj['success'] === 1) {
        var data = jsonObj['data'];
        callback(data);
    } else {
        var msg = jsonObj['errMsg'];
        errMsg(msg);
    }
}
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
			
		}
		if(jsonObj.data.alert[0]==1)
		{
			$(".container-fluid").prepend('  <div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<center><strong>'+jsonObj.data.alertMsg[0]+'</strong></center>\
			  </div>');
		}
		
		if(jsonObj.data.coinflipalert[0]==1)
		{
			$(".container-fluid").prepend('  <div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<center><strong>'+jsonObj.data.coinflipalertmsg[0]+'</strong></center>\
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
	games();
	function games(){
		
		$.getJSON('/php/coinflipgames.php', function(jsonObj) {
			$('#gamesTable').html('');
			var games = jsonObj.data;
			for(var i = 0; i < games.length; i++)
			{
				var date = timeConverter(games[i].date);
				var pick, userpick;
				if(games[i].pick == 1)
				{
					pick = "<img src='/img/ct.png' style='height: 30px; width: 30px'>";
				}
				else
				{
					pick = "<img src='/img/t.png' style='height: 30px; width: 30px'>";
				}
				if(games[i].userpick == 1)
				{
					userpick = "<img src='/img/ct.png' style='height: 30px; width: 30px'>";
				}
				else
				{
					userpick = "<img src='/img/t.png' style='height: 30px; width: 30px'>";
				}
				if(games[i].userpick==games[i].pick)
				{
					$('#gamesTable').append('<tr class="success" style=""><td style="text-align: center">'+games[i].coins+'</td><td style="text-align: center">'+userpick+'</td><td style="text-align: center">'+pick+'</td><td style="text-align: center">'+date+'</td></tr>');	
				}
				else
				{
					$('#gamesTable').append('<tr class="danger"><td style="text-align: center">'+games[i].coins+'</td><td style="text-align: center">'+userpick+'</td><td style="text-align: center">'+pick+'</td><td style="text-align: center">'+date+'</td></tr>');	
				}
				
			}
		});
	}
	var spinArray1 = ['animation900','animation1260','animation1620','animation1980'];
	var spinArray2 = ['animation1080','animation1440','animation1800','animation2160'];
	
	function getSpin1() {
		var spin = spinArray1[Math.floor(Math.random()*spinArray1.length)];
		return spin;
	}
	function getSpin2() {
		var spin = spinArray2[Math.floor(Math.random()*spinArray2.length)];
		return spin;
	}
	var inProgress = 0;
	$('#frontsubmit').on('click', function(){
		if(inProgress == 0)
		{
			$('#frontsubmit').addClass('frontcheck');
			inProgress = 1;
			$.post('php/coin-flip.php', {coins: document.getElementById("coins-amount").value, choice: 1}, function (jsonObj) {
				handleJsonResponse(jsonObj, function (data) {
					if (data['valid'] === 0) {
						$('#frontsubmit').removeClass('frontcheck');
						$("#infoAlert").html('<div class="alert alert-danger">\
							<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
							<center><strong>'+data['errMsg']+'</strong></center>\
						  </div>');
						$("#infoAlert").animate({width: ["toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle" }, 0, "linear");
						  $("#infoAlert").animate({	width: ["100%", "swing" ],	height: [ "toggle", "swing" ],	opacity: "toggle"  }, 500, "linear");
						inProgress = 0;
						return false;
					} else {
						$('#coin').removeClass();
						if(data["pick"]==1)
						{
							setTimeout(function(){
								$('#coin').addClass(getSpin2());
							}, 100);
						}
						else
						{
							setTimeout(function(){
								$('#coin').addClass(getSpin1());
							}, 100);
						}
						setTimeout(function(){
							$('#alertText').html(data['errMsg']);
							$('#frontsubmit').removeClass('frontcheck');
							$("#bank").text(data.bank);
							inProgress = 0;
							games();
						}, 3300);
					}
				});
			}, 'json');
		
		}
	});
	
	$('#backsubmit').on('click', function(){
		if(inProgress == 0)
		{
			$('#backsubmit').addClass('backcheck');
			inProgress = 1;
		$.post('php/coin-flip.php', {coins: document.getElementById("coins-amount").value, choice: 2}, function (jsonObj) {
			handleJsonResponse(jsonObj, function (data) {
				if (data['valid'] === 0) {
					$("#infoAlert").html('<div class="alert alert-danger">\
							<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
							<center><strong>'+data['errMsg']+'</strong></center>\
						  </div>');
						$("#infoAlert").animate({width: ["toggle", "swing" ], height: [ "toggle", "swing" ], opacity: "toggle" }, 0, "linear");
						  $("#infoAlert").animate({	width: ["100%", "swing" ],	height: [ "toggle", "swing" ],	opacity: "toggle"  }, 500, "linear");
					$('#backsubmit').removeClass('backcheck');
					inProgress = 0;
					return false;
				} else {
					$('#coin').removeClass();
					if(data["pick"]==1)
					{
						setTimeout(function(){
							$('#coin').addClass(getSpin2());
						}, 100);
					}
					else
					{
						setTimeout(function(){
							$('#coin').addClass(getSpin1());
						}, 100);
					}
					setTimeout(function(){
						$('#alertText').html(data['errMsg']);
						$('#backsubmit').removeClass('backcheck');
						$("#bank").text(data.bank);
						inProgress = 0;
						games();
					}, 3300);
				}
			});
		}, 'json');
			}
	});
	
})

    		
	