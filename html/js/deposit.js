
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
	
	$(document).on("click", "#showOffers", function () {
		$('#offers-modal').modal('show');
		
	});
	
	var offer =[];
	var coinsNeeded = 0;
	$('#jsonobj').fadeIn();
	loadItems();
	function loadItems()
	{
		$('#items-list').html('');
		$.getJSON('/php/userInv.php', function(jsonObj) {
			
			var items = jsonObj.data;
			if(jsonObj.data)
			{
				var inRow = 0;
				items.sort(function(a,b){return b.price - a.price});
				for(var i = 0; i < items.length; i++)
				{
						var div = "<div class='col-md-2' ><div class='btn btn-primary' style='width: 100%; height: 200px; word-wrap: break-word; font-size: 9.5pt; margin-bottom:20px; padding-top: 15px' name='"+items[i].id+"' coins='"+items[i].price+"' clicked=0>Coins: "+items[i].price+"<br><img src='http://steamcommunity-a.akamaihd.net/economy/image/"+items[i].image+"/100fx100f' alt='...' class='img-check'><br><span>"+items[i].name+"</span]></div></div>";
						
						$('#items-list').append(div);					
						inRow++;
				}
				var rows = parseInt(inRow/6)+1;
				$('#items-list').height(rows*220-20);
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
						noty({
							text: 'Limit is 20 items per one offer',
							type        : 'error',
							dismissQueue: true,
							layout      : 'topRight',
							timeout :5000,
						});
					}
				}
				else
				{
					var index = offer.indexOf($(this).attr("name"));
					if (index > -1) {
						offer.splice(index, 1);
					}
					$('#loading').fadeOut(500);
					$(this).toggleClass("check");
					setTimeout(function(){$('#loading').html('');},500)
					var value = $(this).attr("coins");
					coinsNeeded -= value;
					$('#coins').html(coinsNeeded);
					$('.'+$(this).attr("name")).remove();
					$(this).attr("clicked", 0);
				}
	});
	$(document).on("click", ".btn-warning", function () {
		
		if(offer.length>0)
			$(this).addClass("disabled");
			$(this).html("Creating offer...");
			var element = $(this);
			$.ajax({
			  type: 'POST',
			  url: 'php/create-deposit.php',
			  data: {items: offer},
			  success: function(jsonObj){ element.removeClass("disabled");
						element.html("Deposit");
						loadItems();
						offer = [];
						jsonObj = JSON.parse(jsonObj);
						coinsNeeded = 0;
						$('#coins').html(0);
						if (jsonObj.data['valid'] == 0) {
							noty({
								text: jsonObj.data['errMsg'],
								type        : 'error',
								dismissQueue: true,
								layout      : 'topRight',
								timeout :5000,
							});
						} else {
							noty({
								text: 'Your offer will be ready soon. It will be active for 180 seconds.',
								type        : 'information',
								dismissQueue: true,
								layout      : 'topRight',
								timeout :5000,
							});
						}
						},
			  'timeout' : 5000
			});
			
			 
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
	$.getJSON("php/show-deposit.php", function(jsonObj){
			if(jsonObj.data != null)
			{
				$("#dep-offers").html("You have active deposit offers!");
				$("#dep-offers").append('<table class="table table-bordered" style="width: 100%; margin-top: 20px">\
									<thead>\
										<tr>\
											<th style="width: 20%; text-align: center">\
												Offer ID\
											</th>\
											<th style="width: 60%; text-align: center">\
												Message\
											</th>\
											<th style="width: 20%; text-align: center">\
												Value\
											</th>\
										</tr>\
									</thead>\
									<tbody id="dep-table"></tbody></table>')
				for(var i = 0; i < jsonObj.data.length; i++)
				{
					$("#dep-table").append('<tr><td>'+jsonObj.data[i].offerId+'</td><td>'+jsonObj.data[i].msg+'</td><td>'+jsonObj.data[i].coins+'</td></tr>');
				}
			}
		})
	setInterval(function(){
		$.getJSON("php/show-deposit.php", function(jsonObj){
			if(jsonObj.data != null)
			{
				$("#dep-offers").html("You have active deposit offers!");
				$("#dep-offers").append('<table class="table table-bordered" style="width: 100%; margin-top: 20px">\
									<thead>\
										<tr>\
											<th style="width: 20%; text-align: center">\
												Offer ID\
											</th>\
											<th style="width: 60%; text-align: center">\
												Message\
											</th>\
											<th style="width: 20%; text-align: center">\
												Value\
											</th>\
										</tr>\
									</thead>\
									<tbody id="dep-table"></tbody></table>')
				for(var i = 0; i < jsonObj.data.length; i++)
				{
					$("#dep-table").append('<tr><td>'+jsonObj.data[i].offerId+'</td><td>'+jsonObj.data[i].msg+'</td><td>'+jsonObj.data[i].coins+'</td></tr>');
				}
			}
			else
			{
				$("#dep-offers").html('');
			}

		})
	},5000)
})

    		
	