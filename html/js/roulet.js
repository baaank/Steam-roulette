var betted = 0;
var totRed = 0;
var totGreen = 0;
var totBlack = 0;
var testvar = 0;
var testvar;

var socketIO = io(':2095' || ':8304',{'max reconnection attempts':Infinity});

var timer = timer = new Worker('js/worker.js');
var count = 40000;
var counter;
function displayCount(count) {
    var res = count / 100;
    document.getElementById("timer").innerHTML = res.toPrecision(count.toString().length);
}

timer.addEventListener('message', function(){
    if (count <= 0) {
		timer.postMessage('stop');
        return;
    }
    count--;
	if(count==0)
	{
		displayCount("0.0");
	}
	else
	{
		displayCount(count);
	}
	
});

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
			$("#range").attr("max", coins);
		}
		if(jsonObj.data.alert[0]==1)
		{
			$(".container-fluid").prepend('  <div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<center><strong>'+jsonObj.data.alertMsg[0]+'</strong></center>\
			  </div>');
		}
		
		if(jsonObj.data.rouletalert[0]==1)
		{
			$(".container-fluid").prepend('  <div class="alert alert-danger">\
				<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>\
				<center><strong>'+jsonObj.data.rouletalertmsg[0]+'</strong></center>\
			  </div>');
		}
	});
	var ended =0;
	$.getJSON('/php/generate-token.php', function(jsonObj) {
		if(jsonObj.data.valid == 0)
		{
			
		}
		else
		{
			token = jsonObj.data;
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
	socketIO.on('connect', function(){
		$("#chat-table").append('Connected!<br>')
	})
	
	
	function progress(percent, $element, timeleft) {
		testvar = timeleft;
        var progressBarWidth = percent * $element.width() / 100;
		$element.find('div').animate({ width: $element.width() }, 0, "linear");
        $element.find('div').animate({ width: progressBarWidth }, timeleft, "linear");
		setTimeout(function(){
			$("#barColor").removeClass('progressBarBlue');
			$("#barColor").addClass('progressBarOrange');
		},timeleft/1.4)
		setTimeout(function(){
			$("#barColor").removeClass('progressBarOrange');
			$("#barColor").addClass('progressBarRed');
		},timeleft/1.1)
		setTimeout(function(){
			$("#barColor").removeClass('progressBarRed');
			$("#barColor").addClass('progressBarBlue');
		},timeleft)
    }
	socketIO.on('preend', function(data){
		$(".betRed").addClass("redcheck");
		 $(".betGreen").addClass("greencheck");
		 $(".betBlack").addClass("blackcheck");
		betCooldown = 1;
		ended = 1;
		$("#bets").html('Accepting bets, to accept: '+data);
	});
	socketIO.on('end', function(data){
		$(".betRed").addClass("redcheck");
		 $(".betGreen").addClass("greencheck");
		 $(".betBlack").addClass("blackcheck");
		betCooldown = 1;
		$("#bets").html('');
		ended = 1;
		spin(data);
		setTimeout(function(){
			addToHistory(data);
		},4000);
		});
	socketIO.on('start', function(data){
		$(".betRed").removeClass("redcheck");
		 $(".betGreen").removeClass("greencheck");
		 $(".betBlack").removeClass("blackcheck");
		betCooldown = 0;
		betted = 0;
		$("#redBig").html('');
		$("#greenBig").html('');
		$("#blackBig").html('');
		progress(0, $('#progressBar'), data[0].timer-4000);
		count = data[0].timer/10-400;
		timer.postMessage('stop');
		timer.postMessage('start');
		$("#round").html('Round #'+data[0].round);
		ended = 0;
		
		$("#total-red").removeClass('moreWon');
		$("#total-red").removeClass('moreLost');
		$("#total-green").removeClass('moreWon');
		$("#total-green").removeClass('moreLost');
		$("#total-black").removeClass('moreWon');
		$("#total-black").removeClass('moreLost');
		totRed = -data[0].totalRed;
		totGreen = -data[0].totalGreen;
		totBlack = -data[0].totalBlack;
			$("#number-red").slideToggle( "slow");
			$("#number-green").slideToggle( "slow");
			$("#number-black").slideToggle( "slow");
			if(totRed>0)
			{
				$("#total-red").addClass('moreWon')
			}
			else
			{
				$("#total-red").addClass('moreLost')
			}
			if(totGreen>0)
			{
				$("#total-green").addClass('moreWon')
			}
			else
			{
				$("#total-green").addClass('moreLost')
			}
			if(totBlack>0)
			{
				$("#total-black").addClass('moreWon')
			}
			else
			{
				$("#total-black").addClass('moreLost')
			}
			total_red.counter(totRed.toString());
			total_red.counter("start");
			total_green.counter(totGreen.toString());
			total_green.counter("start");
			total_black.counter(totBlack.toString());
			total_black.counter("start");
		setTimeout(function(){
			$("#number-red").slideToggle( "slow");
			$("#number-green").slideToggle( "slow");
			$("#number-black").slideToggle( "slow");
			totRed = 0;
			totGreen = 0;
			totBlack = 0;
			total_red.counter(totRed.toString());
			total_red.counter("start");
			total_green.counter(totGreen.toString());
			total_green.counter("start");
			total_black.counter(totBlack.toString());
			total_black.counter("start");
		},4000)
	});
	socketIO.on('timer', function(data){
		count = data[0].timeleft/10;
		timer.postMessage('stop');
		timer.postMessage('start');
		progress(0, $('#progressBar'), data[0].timeleft);
		$("#round").html('Round #'+data[0].round);
	});
	var redP = 0;
	var greenP = 0;
	var blackP = 0;
	socketIO.on('pots', function(data){
		if(redP != data[0].red)
		{
			
			redPot.counter(data[0].red.toString());
			redP = data[0].red;
			redPot.counter("start");
		}
		if(greenP != data[0].green)
		{
			greenP = data[0].green;
			greenPot.counter(data[0].green.toString());
			greenPot.counter("start");
		}
		if(blackP != data[0].black)
		{
			blackP = data[0].black
			blackPot.counter(data[0].black.toString());
			blackPot.counter("start");
		}
	});
	
	socketIO.on('bigBet', function(data){
		var stringspan= data[0].img.substr(data[0].img.length-15,10)+data[0].color;
		if ($('#'+stringspan).length > 0) {
		  $('#'+stringspan).html(parseInt($('#'+stringspan).attr("betVal"))+data[0].bet);
		  $('#'+stringspan).attr("betVal", parseInt($('#'+stringspan).attr("betVal"))+data[0].bet);
		}
			else
			{
			if(data[0].color == "red")
			{
				$("#redBig").prepend('<div class="row slideClassRed"><img src="'+data[0].img+'" style="width: 30px; height: 30px; float: left; border-radius:5px">&nbsp;'+data[0].name+'<span id="'+stringspan+'"  betVal="'+data[0].bet+'" style="float: right">'+data[0].bet+'</span></div><br>');
				$(".slideClassRed").first().effect( "slide" )
			}
			if(data[0].color == "green")
			{
				$("#greenBig").prepend('<div class="row slideClassGreen"><img src="'+data[0].img+'" style="width: 30px; height: 30px; float: left; border-radius:5px">&nbsp;'+data[0].name+'<span id="'+stringspan+'" betVal="'+data[0].bet+'" style="float: right">'+data[0].bet+'</span></div><br>');
				$(".slideClassGreen").first().effect( "slide" )
			}
			if(data[0].color == "black")
			{
				$("#blackBig").prepend('<div class="row slideClassBlack"><img src="'+data[0].img+'" style="width: 30px; height: 30px; float: left; border-radius:5px">&nbsp;'+data[0].name+'<span id="'+stringspan+'" betVal="'+data[0].bet+'" style="float: right">'+data[0].bet+'</span></div><br>');
				$(".slideClassBlack").first().effect( "slide" )
			}
		}
	});
	setTimeout(function(){
			$("#number-red").addClass('padding');
		},3000)
	$("#number-red").slideToggle( "slow");
	setTimeout(function(){
			$("#number-green").addClass('padding');
		},3000)
	$("#number-green").slideToggle( "slow");
	setTimeout(function(){
			$("#number-black").addClass('padding');
		},3000)
	$("#number-black").slideToggle( "slow");
	
	var total_red = $("#total-red");
	var total_green = $("#total-green");
	var total_black = $("#total-black");
	var redPot = $("#redPot");
	var greenPot = $("#greenPot");
	var blackPot = $("#blackPot");
	redPot.counter({
		autoStart: false,
		duration: 800,
		countTo: 0,
		easing: "swing",
	  });
	  greenPot.counter({
		autoStart: false,
		duration: 800,
		countTo: 0,
		easing: "swing",
	  });
	  blackPot.counter({
		autoStart: false,
		duration: 800,
		countTo: 0,
		easing: "swing",
	  });
	  total_red.counter({
		autoStart: false,
		duration: 1500,
		countTo: 0,
		easing: "swing",
	  });
	  total_green.counter({
		autoStart: false,
		duration: 1500,
		countTo: 0,
		easing: "swing",
	  });
	  total_black.counter({
		autoStart: false,
		duration: 1500,
		countTo: 0,
		easing: "swing",
	  });
	var angle3 = 0;
	var random = 0;
	rotate=9.73;
	var order = [26,3,35,12,28,7,29,18,22,9,31,14,20,1,33,16,24,5,10,23,8,30,11,36,13,27,6,34,17,25,2,21,4,19,15,32,0];
	
	function spin(number) {
		var place = order.indexOf(number)+1;
		random = place*rotate+1080;
		
		 $("#roulet").animateRotate(random, 4000, "swing", function(){});
		  
	}
	
	$.fn.animateRotate = function(angle, duration, easing, complete) {
		  var args = $.speed(duration, easing, complete);
		  var step = args.step;
		  return this.each(function(i, e) {
			args.complete = $.proxy(args.complete, e);
			args.step = function(now) {
			  $.style(e, 'transform', 'rotate(' + now + 'deg)');
			  if (step) return step.apply(e, arguments);
			};

		$({deg: angle3}).animate({deg: angle}, args);
		angle3=angle-1080;
	  });
	};

$(document).on("click", "#10", function () {
	 var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value)+10)
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent);
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)+10;
	}
});
$(document).on("click", "#100", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value)+100)
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent);
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)+100;
	}
});
$(document).on("click", "#1000", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value)+1000)
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent);
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)+1000;
	}
});
$(document).on("click", "#10000", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value)+10000)
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent);
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)+10000;
	}
});
$(document).on("click", "#-10", function () {
	 var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value))
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent)-10;
	}
	else if(parseInt(document.getElementById("coinsToBet").value)-10 < 0)
	{
		document.getElementById("coinsToBet").value = 0;
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)-10;
	}
});
$(document).on("click", "#-100", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value))
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent)-100;
	}
	else if(parseInt(document.getElementById("coinsToBet").value)-100 < 0)
	{
		document.getElementById("coinsToBet").value = 0;
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)-100;
	}
});
$(document).on("click", "#-1000", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value))
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent)-1000;
	}
	else if(parseInt(document.getElementById("coinsToBet").value)-1000 < 0)
	{
		document.getElementById("coinsToBet").value = 0;
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)-1000;
	}
});
$(document).on("click", "#-10000", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value))
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent)-10000;
	}
	else if(parseInt(document.getElementById("coinsToBet").value)-10000 < 0)
	{
		document.getElementById("coinsToBet").value = 0;
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)-10000;
	}
});
$(document).on("click", "#x2", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value)*2)
	{
		document.getElementById("coinsToBet").value = parseInt(coins.textContent);
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(document.getElementById("coinsToBet").value)*2;
	}
});
$(document).on("click", "#half", function () {
	var coins = document.getElementById( 'bank' );
	if(parseInt(coins.textContent)<parseInt(document.getElementById("coinsToBet").value)/2)
	{
		document.getElementById("coinsToBet").value = parseInt(parseInt(coins.textContent)/2);
	}
	else
	{
		document.getElementById("coinsToBet").value = parseInt(parseInt(document.getElementById("coinsToBet").value)/2);
	}
});
$(document).on("click", "#0", function () {
	document.getElementById("coinsToBet").value = 0;
	
});
$(document).on("click", "#MAX", function () {
	var coins = document.getElementById( 'bank' );
	document.getElementById("coinsToBet").value = parseInt(coins.textContent);
	
});
$(document).on("input", "#coinsToBet", function () {
	if(parseInt(document.getElementById("coinsToBet").value)<0){
		document.getElementById("coinsToBet").value=0;
	}
});

	$(".betRed").click(function () {
		 bet("red");
		 $(".betRed").addClass("redcheck");
		 $(".betGreen").addClass("greencheck");
		 $(".betBlack").addClass("blackcheck");
	});
	$(".betGreen").click(function () {
		bet("green");
		 $(".betRed").addClass("redcheck");
		 $(".betGreen").addClass("greencheck");
		 $(".betBlack").addClass("blackcheck");
	});
	$(".betBlack").click(function () {
		bet("black");
		 $(".betRed").addClass("redcheck");
		 $(".betGreen").addClass("greencheck");
		 $(".betBlack").addClass("blackcheck");
	});
	var betCooldown = 0;
	function bet(color){
		if(ended == 0 && betCooldown == 0 && betted < 3)
		{
			betCooldown = 1;
			betted++;
			var data = [];
			betVal = parseInt(document.getElementById("coinsToBet").value);
			data.push({
				betval: betVal,
				color: color,
				tok: token,
				steamid: steamid,
			})
			
			socketIO.emit('bet', data);
		}
		else if( betted >=3)
		{
			$("#chat-table").append('You can bet only 3 times per game<br>');
			var objDiv = document.getElementById("chat-table");
			objDiv.scrollTop = objDiv.scrollHeight;
		}
	}
	$("#won").fadeOut();
	socketIO.on('bank', function(data){
		if(data[0].error == 1)
		{
			$("#chat-table").append(data[0].text+"<br>");
			var objDiv = document.getElementById("chat-table");
			objDiv.scrollTop = objDiv.scrollHeight;
			 $(".betRed").removeClass("redcheck");
			 $(".betGreen").removeClass("greencheck");
			 $(".betBlack").removeClass("blackcheck");
			 return;
		}
		 $(".betRed").removeClass("redcheck");
		 $(".betGreen").removeClass("greencheck");
		 $(".betBlack").removeClass("blackcheck");
		betCooldown = 0;
		var bank = $("#betCoins");
		 bank.counter({
			autoStart: false,
			duration: 1500,
			countTo: coins,
			easing: "swing",
		  });
		if(data[0].text>coins)
		{
			var balance = data[0].text-coins;
			$("#won").html('&nbsp; + '+balance);
			$("#won").fadeIn();
		}
		coins = data[0].text;
		setTimeout(function(){
			$("#won").fadeOut();
		},3000)
		bank.counter(coins.toString());
		bank.counter("start");
	})
	socketIO.on('history',function(data){
		for(var i = 0; i < data.length; i++)
		{
			addToHistory(data[i]);
		}
	})
	socketIO.on('disconnect',function(){
		$("#chat-table").append('Disconnected');
		var objDiv = document.getElementById("chat-table");
		objDiv.scrollTop = objDiv.scrollHeight;
	})
	function addToHistory(number){
		
		$('#history .roll-block').last().remove();
		
		if(number == 32 || number == 19 || number == 21 || number == 25 || number == 34 || number == 27 || number == 36 || number == 30 || number == 23 || number == 5 || number == 16 || number == 1 || number == 9 || number == 18 || number == 7 || number == 12 || number == 3)
		{
			$('#history').prepend('<span class="roll-block"><div class="red-block">'+number+'</div></span>');
			$('#history .roll-block').first().effect( "slide" )
		}
		else if(number == 0 || number == 14 || number == 13)
		{
			$('#history').prepend('<span class="roll-block"><div class="green-block">'+number+'</div></span>');
			$('#history .roll-block').first().effect( "slide" )
		}
		else
		{
			$('#history').prepend('<span class="roll-block"><div class="black-block">'+number+'</div></span>');
			$('#history .roll-block').first().effect( "slide" )
		}
	}
	
	//Chat part
	var cooldown = 0;
	$("#chat-box").keyup(function (e) {
		if (e.keyCode == 13) {
			if(logged == 1)
			{
				if(cooldown == 0){
					var arr =[];
					var text = document.getElementById("chat-box").value;
					if(text.length > 40)
					{
						$("#chat-table").append('40 characters per message is max<br>');
						var objDiv = document.getElementById("chat-table");
						objDiv.scrollTop = objDiv.scrollHeight;
						document.getElementById("chat-box").value = '';
						return;
					}
					arr.push({
						msg: text,
						steamid: steamid,
						tok: token,
					})
					socketIO.emit('chatMsg', arr);
					document.getElementById("chat-box").value = '';
					cooldown = 1;
					setTimeout(function(){cooldown = 0}, 3000);
				}
			}
			else
			{
				document.getElementById("chat-input").value = 'You must be logged in to use chat';
			}
		}
	});
	$(document).on("click", "#chat-send", function () {
		
			if(logged == 1)
			{
				if(cooldown==0)
				{
					var arr =[];
					var text = document.getElementById("chat-input").value;
					if(text.length > 40)
					{
						document.getElementById("chat-input").value = 'It was more than 40 chars';
						return;
					}
					arr.push({
						msg: text,
						steamid: steamid,
						tok: token,
					})
					socketIO.emit('chatMsg', arr);
					document.getElementById("chat-input").value = '';
					cooldown = 1;
					setTimeout(function(){cooldown = 0}, 3000);
				}
			}
			else
			{
				document.getElementById("chat-input").value = 'You must be logged in to use chat';
			}
		
	});
	
	var chat = [];
	$("#chat-table").append('Connecting...<br>')
	socketIO.on('chat',function(data){
		$("#chat-table").append('<p style="margin-bottom: 5px; font-size:10pt;"><img src="'+data[0].image+'" style="width:25px; height: 25px; border-radius:3px"><span style="color: orange">'+data[0].name+':</span> '+data[0].msg+'</p>')
		var objDiv = document.getElementById("chat-table");
		objDiv.scrollTop = objDiv.scrollHeight;
		
	})
	socketIO.on('unlock',function(){
		$(".betRed").removeClass("redcheck");
		 $(".betGreen").removeClass("greencheck");
		 $(".betBlack").removeClass("blackcheck");
		betCooldown = 0;
	});
	
	socketIO.on('players', function(data){
		$("#message").html('Players online: '+data);
	})
	
})