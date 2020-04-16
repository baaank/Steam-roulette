function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  if(hour<10)
  {
	  hour="0"+hour;
  }
  var min = a.getMinutes();
  if(min<10)
  {
	  min="0"+min;
  }
  var sec = a.getSeconds();
   if(sec<10)
  {
	  sec="0"+sec;
  }
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
Date.prototype.getUnixTime = function() { return this.getTime()/1000|0 };
if(!Date.now) Date.now = function() { return new Date(); }
Date.time = function() { return Date.now().getUnixTime(); }
var tabledepoffers;
var tablewitoffers;
var tablegiveaways;
var testvar;
$(document).ready(function () {
	$.getJSON('php/gamesettings.php', function(jsonObj) {
		
		for(var i = 0; i < jsonObj.data.length; i++)
		{
			$('#'+jsonObj.data[i].parameter).val(jsonObj.data[i].status);
		}
		
	});
	$(document).on("click", "#update-roulet-btn", function () {
		$(this).addClass("disabled");
		$(this).html("Updating...");
		$.post('php/updateroulet.php', {minbet: $('#rouletminbet').val(), maxbet: $('#rouletmaxbet').val(), gamelength: $('#rouletgamelength').val(), gamestatus: $('#rouletstatus').val(), alert: $('#rouletalert').val(), alertmsg: $('#rouletalertmsg').val()}, function () {
			setTimeout(function(){
				$("#update-roulet-btn").html("Update");
				$("#update-roulet-btn").removeClass("disabled");
			},300)
		});
	});
	$(document).on("click", "#update-coinflip-btn", function () {
		$(this).addClass("disabled");
		$(this).html("Updating...");
		$.post('php/updatecoinflip.php', {minbet: $('#coinflipminbet').val(), maxbet: $('#coinflipmaxbet').val(), gamestatus: $('#coinflipstatus').val(), alert: $('#coinflipalert').val(), alertmsg: $('#coinflipalertmsg').val()}, function () {
			setTimeout(function(){
				$("#update-coinflip-btn").html("Update");
				$("#update-coinflip-btn").removeClass("disabled");
			},300)
		});
	});
	
	$(document).on("click", "#sitesettingstab", function () {
		$.getJSON('php/sitesettings.php', function(jsonObj) {
			
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				$('#'+jsonObj.data[i].parameter).val(jsonObj.data[i].status);
			}
			
		});
	});
	
	$(document).on("click", "#update-sitesettings-btn", function () {
		$(this).addClass("disabled");
		$(this).html("Updating...");
		$.post('php/updatesitesettings.php', {mindeposit: $('#mindeposit').val(), refferalstatus: $('#refferalstatus').val(), refferalforref: $('#refferalforref').val(), refferalforcode: $('#refferalforcode').val(), sitealert: $('#sitealert').val(), sitealertmsg: $('#sitealertmsg').val(), maintenance: $('#maintenance').val(), chatstatus: $('#chatstatus').val(), }, function () {
			setTimeout(function(){
				$("#update-sitesettings-btn").html("Update");
				$("#update-sitesettings-btn").removeClass("disabled");
			},300)
		});
	});
	
	$(document).on("click", "#botsettingstab", function () {
		updatebotinfo();
		
	});
	function updatebotinfo(){
			$.getJSON('php/botsettings.php', function(jsonObj) {
				$('#bot-container').html('');
				for(var i = 0; i < jsonObj.data.length; i++)
				{
					var btn='<a id="change-bot-status" class="btn btn-warning" botid="'+jsonObj.data[i].id+'">Change status</a>';
					$('#bot-container').append('<div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Bot '+jsonObj.data[i].id+'</strong><br><table class="table table-bordered" style="width: 50%">\
					<thead>\
						<tr>\
							<th style="width: 30%; text-align: center">\
								Parameter\
							</th>\
							<th style="width: 30%; text-align: center">\
								Value\
							</th>\
						</tr>\
					</thead>\
					<tr>\
							<td style="width: 30%; text-align: center">\
								Name\
							</td>\
							<td style="width: 30%; text-align: center">\
								'+jsonObj.data[i].name+'\
							</td>\
						</tr>\
						<tr class="active">\
							<td style="width: 30%; text-align: center">\
								Steam status\
							</td>\
							<td style="width: 30%; text-align: center">\
								'+jsonObj.data[i].state+'\
							</td>\
						</tr>\
					<tr>\
							<td style="width: 30%; text-align: center">\
								Items in bot\
							</td>\
							<td style="width: 30%; text-align: center">\
								'+jsonObj.data[i].items+'\
							</td>\
						</tr>\
						<tr class="active">\
							<td style="width: 30%; text-align: center">\
								Bot status (0 - inactive, 1 - active)\
							</td>\
							<td style="width: 30%; text-align: center">\
								'+jsonObj.data[i].status+'\
							</td>\
						</tr>\
						<tr class="active">\
							<td style="width: 30%; text-align: center">\
								Turn on/off\
							</td>\
							<td style="width: 30%; text-align: center">\
								'+btn+'\
							</td>\
						</tr>\
					</tbody>\
				</table></div>')
				}
				
			});
		}
	$(document).on("click", "#change-bot-status", function () {
		$(this).addClass("disabled");
		$(this).html("Updating...");
		var element = $(this);
		$.post('php/updatebotstatus.php', {botid: $(this).attr("botid")}, function(){
			setTimeout(function(){
				updatebotinfo();
				element.html("Change status");
				element.removeClass("disabled");
			},300)
		})
	})
	$(document).on("click", "#giveawaysettingstab", function () {
		loadgiveaways();
	});
	function loadgiveaways(){
		$.getJSON('php/giveawaysettings.php', function(jsonObj) {
			$("#active-giveaway-container").html('');
			$("#past-giveaway-container").html('');
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				if(jsonObj.data[i].status == 1)
				{
					var date = timeConverter(jsonObj.data[i].timeEnd);
					$("#active-giveaway-container").append('<tr class="active">\
							<td style="text-align: center">\
								'+jsonObj.data[i].name+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].totalCoins+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].coins+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].value+'$\
							</td>\
							<td style="text-align: center">\
								'+date+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].status+' <a id="giveaway-change-status" class="btn btn-primary" giveawayid="'+jsonObj.data[i].id+'">Change</a>\
							</td>\
							<td style="text-align: center">\
								<a id="giveaway-restart" class="btn btn-warning" giveawayid="'+jsonObj.data[i].id+'">Restart</a>\
							</td>\
							<td style="text-align: center">\
								<a id="giveaway-delete" class="btn btn-danger" giveawayid="'+jsonObj.data[i].id+'">Delete</a>\
							</td>\
						</tr>')
				}
				else
				{
					var date = timeConverter(jsonObj.data[i].timeEnd);
					$("#past-giveaway-container").append('<tr class="active">\
							<td style="text-align: center">\
								'+jsonObj.data[i].name+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].totalCoins+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].coins+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].value+'$\
							</td>\
							<td style="text-align: center">\
								'+date+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].winner+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].status+' <a id="giveaway-change-status" class="btn btn-warning" giveawayid="'+jsonObj.data[i].id+'">Change</a>\
							</td>\
							<td style="text-align: center">\
								<a id="giveaway-delete" class="btn btn-danger" giveawayid="'+jsonObj.data[i].id+'">Delete</a>\
							</td>\
						</tr>')
				}
				
			}
				 
					tablegiveaways = $('#pastgiveaways').DataTable();
		});
	}
	$(document).on("click", "#giveaway-restart", function () {
			$(this).addClass("disabled");
			$(this).html("restarting...");
			var element = $(this);
		$.post('php/restartgiveaway.php', {giveawayid: $(this).attr("giveawayid")}, function(){
				loadgiveaways();
		})
	});
	$(document).on("click", "#giveaway-delete", function () {
			$(this).addClass("disabled");
			$(this).html("deleting...");
			var element = $(this);
		$.post('php/deletegiveaway.php', {giveawayid: $(this).attr("giveawayid")}, function(){
				tablegiveaways
					.row( element.parents('tr') )
					.remove()
					.draw();
		})
	});
	$(document).on("click", "#giveaway-change-status", function () {
			$(this).addClass("disabled");
			$(this).html("Updating...");
			var element = $(this);
		$.post('php/updategiveawaystatus.php', {giveawayid: $(this).attr("giveawayid")}, function(){
				loadgiveaways();
		})
	});
	$(document).on("click", "#create-new-giveaway", function () {
		$(this).addClass("disabled");
		$(this).html("Loading...");
		var element = $(this);
		$.getJSON('php/giveawaybotid.php', function(jsonObj) {
			$("#giveawaybotid").val(jsonObj.data)
		});
		reloaditems("#create-new-giveaway")
	});
	function reloaditems(button){
		
		
		$("#create-giveaway-item-body").html('');
		$.getJSON('php/creategiveawaysettings.php', function(jsonObj) {
			if(jsonObj.data != null)
			{
				jsonObj.data.sort(function (a, b) {   
						return b.price - a.price;
					});
				for(var i=0; i < jsonObj.data.length; i++)
				{
					var price = jsonObj.data[i].price/1000;
					$("#create-giveaway-item-body").append('<tr class="active">\
							<td style="text-align: center">\
								<img id="additem" src="http://steamcommunity-a.akamaihd.net/economy/image/'+jsonObj.data[i].image+'" style="height:50px; width:50px" price="'+price+'" itemname="'+jsonObj.data[i].name+'" itemimg="'+jsonObj.data[i].image+'">\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].name+'\
							</td>\
							<td style="text-align: center">\
								'+price+'$\
							</td>\
						</tr>')
				}
			}
			if(button == "#create-new-giveaway")
			{
				$("#create-new-giveaway").removeClass('disabled');
				$("#create-new-giveaway").html('Create new giveaway');
				$("#create-giveaway-modal").modal("show");
				$("#itemstable").DataTable();
			}
			else if(button == "#refreshitems")
			{
				$("#refreshitems").removeClass('disabled');
				$("#refreshitems").html('Refresh');
			}
		});
	}
	$(document).on("click", "#additem", function () {
		console.log('test');
		$("#itemname").val($(this).attr("itemname"));
		$("#itemimage").val($(this).attr("itemimg"));
		$("#itemvalue").val($(this).attr("price"));
		
	});
	$(document).on("click", "#creategiveaway", function () {
		$(this).addClass("disabled");
		$(this).html("Creating...");
		var element = $(this);
		endtime = new Date($("#datetimepicker").val()).getUnixTime();
		$.post('php/creategiveaway.php', {image: $("#itemimage").val(), name: $("#itemname").val(), value: $("#itemvalue").val(), totalcoins: $("#totalcoins").val(), endtime: endtime}, function(){
			element.removeClass("disabled");
			element.html("Create");
			loadgiveaways();
			$("#create-giveaway-modal").modal("hide");
		})
	});
	$(document).on("click", "#refreshitems", function () {
		$(this).addClass("disabled");
		$(this).html("Refreshing...");
		var steamid = $("#giveawaybotid").val();
		$.post('php/giveawaybotid.php', {steamid: steamid}, function(jsonObj) {
			reloaditems("#refreshitems");
		});
	});
	
	jQuery('#datetimepicker').datetimepicker();
	
	
	$(document).on("click", "#usersettingstab", function () {
		$.getJSON('php/usersettings.php', function(jsonObj) {
			
			jsonObj.data.sort(function (a, b) {   
					return a.steamid - b.steamid;
				});
			$("#users-container").html('');
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				
				$("#users-container").append('<tr><td style="text-align: center; width: 10%">\
							<img src="'+jsonObj.data[i].avatar+'" style="width: 30px; height: 30px">\
						</td>\
						<td style="text-align: center; width: 20%">\
							'+jsonObj.data[i].name+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].steamid+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].coins+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].refusers+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].roulet+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].coinflip+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].admin+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							<a id="show-user-details" class="btn btn-warning" steamid="'+jsonObj.data[i].steamid+'">Show details</a>\
						</td>\
						</tr>')
			}
			$('#users-table tfoot th').each( function () {
						var title = $(this).text();
						$(this).html( '<input type="text" placeholder="Search '+title+'" / style="width: 100%">' );
					} );
				 
					var table = $('#users-table').DataTable();
				 
					table.columns().every( function () {
						var that = this;
				 
						$( 'input', this.footer() ).on( 'keyup change', function () {
							if ( that.search() !== this.value ) {
								that
									.search( this.value )
									.draw();
							}
						} );
					} );
			
		});
	});
	
	$(document).on("click", "#usersettingstab", function () {
		$.getJSON('php/usersettings.php', function(jsonObj) {
			
			jsonObj.data.sort(function (a, b) {   
					return a.steamid - b.steamid;
				});
			$("#users-container").html('');
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				
				$("#users-container").append('<tr><td style="text-align: center; width: 10%">\
							<img src="'+jsonObj.data[i].avatar+'" style="width: 30px; height: 30px">\
						</td>\
						<td style="text-align: center; width: 20%">\
							'+jsonObj.data[i].name+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].steamid+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].coins+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].refusers+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].roulet+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].coinflip+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							'+jsonObj.data[i].admin+'\
						</td>\
						<td style="text-align: center; width: 10%">\
							<a id="show-user-details" class="btn btn-warning" steamid="'+jsonObj.data[i].steamid+'">Show details</a>\
						</td>\
						</tr>')
			}
			$('#users-table tfoot th').each( function () {
						var title = $(this).text();
						$(this).html( '<input type="text" placeholder="Search '+title+'" / style="width: 100%">' );
					} );
				 
					var table = $('#users-table').DataTable();
				 
					table.columns().every( function () {
						var that = this;
				 
						$( 'input', this.footer() ).on( 'keyup change', function () {
							if ( that.search() !== this.value ) {
								that
									.search( this.value )
									.draw();
							}
						} );
					} );
			
		});
	});
	var loadeddep = 0;
	$(document).on("click", "#depofferstab", function () {
		if(loadeddep == 1)
		{
			return;
		}
		loadeddep = 1;
		$.getJSON('php/offersdeposit.php', function(jsonObj) {
			
			$("#depoffers-container").html('');
			testvar=jsonObj;
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				jsonObj.data[i].items = jsonObj.data[i].items.replace(/;/g, ' ');
				var date = timeConverter(jsonObj.data[i].date);
				$("#depoffers-container").append('<tr>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].offerId+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].steamid+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].bot+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].coins+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].items+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].msg+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].status+'\
						</td>\
						<td style="text-align: center;">\
							'+date+'\
						</td>\
						<td style="text-align: center;">\
							<a id="delete-depoffer" class="btn btn-warning" offerid="'+jsonObj.data[i].id+'">Delete offer</a>\
						</td>\
						</tr>')
			}
			$('#depoffers-table tfoot th').html('');
			$('#depoffers-table tfoot th').each( function () {
						var title = $(this).text();
						$(this).html( '<input type="text" placeholder="Search '+title+'" / style="width: 100%">' );
					} );
				 
					tabledepoffers = $('#depoffers-table').DataTable();
				 
					tabledepoffers.columns().every( function () {
						var that = this;
				 
						$( 'input', this.footer() ).on( 'keyup change', function () {
							if ( that.search() !== this.value ) {
								that
									.search( this.value )
									.draw();
							}
						} );
					} );
			
		});
	});
	$(document).on("click", "#delete-depoffer", function () {
			$(this).addClass("disabled");
			$(this).html("deleting...");
			var element = $(this);
		$.post('php/deletedepoffer.php', {offerid: $(this).attr("offerid")}, function(){
				tabledepoffers
					.row( element.parents('tr') )
					.remove()
					.draw();
		})
	});
	
	
	var loadedwit = 0;
	$(document).on("click", "#witofferstab", function () {
		if(loadedwit == 1)
		{
			return;
		}
		loadedwit = 1;
		$.getJSON('php/offerswithdraw.php', function(jsonObj) {
			
			$("#witoffers-container").html('');
			testvar=jsonObj;
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				jsonObj.data[i].items = jsonObj.data[i].items.replace(/;/g, ' ');
				var date = timeConverter(jsonObj.data[i].date);
				$("#witoffers-container").append('<tr>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].offerId+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].steamid+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].bot+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].coins+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].items+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].msg+'\
						</td>\
						<td style="text-align: center;">\
							'+jsonObj.data[i].status+'\
						</td>\
						<td style="text-align: center;">\
							'+date+'\
						</td>\
						<td style="text-align: center;">\
							<a id="delete-witoffers" class="btn btn-warning" offerid="'+jsonObj.data[i].id+'">Delete offer</a>\
						</td>\
						</tr>')
			}
			$('#witoffers-table tfoot th').each( function () {
						var title = $(this).text();
						$(this).html( '<input type="text" placeholder="Search '+title+'" / style="width: 100%">' );
					} );
				 
					tablewitoffers = $('#witoffers-table').DataTable();
				 
					tablewitoffers.columns().every( function () {
						var that = this;
				 
						$( 'input', this.footer() ).on( 'keyup change', function () {
							if ( that.search() !== this.value ) {
								that
									.search( this.value )
									.draw();
							}
						} );
					} );
			
		});
	});
	$(document).on("click", "#delete-witoffers", function () {
			$(this).addClass("disabled");
			$(this).html("deleting...");
			var element = $(this);
		$.post('php/deletewitoffer.php', {offerid: $(this).attr("offerid")}, function(){
			tablewitoffers
					.row( element.parents('tr') )
					.remove()
					.draw();
		})
	});
	
	$(document).on("click", "#show-user-details", function () {
		loaduserinfo($(this).attr("steamid"));
	});
    function loaduserinfo(steamid){
		$.post('php/userinfo.php', {steamid: steamid}, function (jsonObj) {					  
                   
		$("#user-detail-modal").modal("show");
				$("#user-title").html('<center><img src="'+jsonObj.data.avatar+'" style="width: 50px; height: 50px"> '+jsonObj.data.name+'</center>');
				$("#user-body").html('');
				$("#user-body").append('<tr>\
						<th style="width: 20%; text-align: center">\
							Steamid\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.steamid+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Profile url\
						</th>\
						<th style="width: 80%; text-align: center">\
							<a href="'+jsonObj.data.profileurl+'" style="color: black">'+jsonObj.data.profileurl+'</a>\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Tradelink\
						</th>\
						<th style="width: 80%; text-align: center">\
							<a href="'+jsonObj.data.tradelink+'" style="color: black">'+jsonObj.data.tradelink+'</a>\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Refferal code\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.refcode+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Users reffered\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.reffered+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Code used\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.refused+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Coins\
						</th>\
						<th style="width: 80%; text-align: center">\
							<input id="usercoins">&nbsp;<a id="updateCoins" class="btn btn-warning" steamid="'+jsonObj.data.steamid+'">Update</a>\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Coins played\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.coinsplayed+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Coins won\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.coinswon+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Coins won on roulet\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.roulet+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Coins won on coinflip\
						</th>\
						<th style="width: 80%; text-align: center">\
							'+jsonObj.data.coinflip+'\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Admin\
						</th>\
						<th style="width: 80%; text-align: center">\
							<input id="adminstate">&nbsp;<a id="updateAdmin" class="btn btn-warning" steamid="'+jsonObj.data.steamid+'">Update</a>\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Chat ban\
						</th>\
						<th style="width: 80%; text-align: center">\
							<input id="chatban">&nbsp;<a id="updatechatban" class="btn btn-warning" steamid="'+jsonObj.data.steamid+'">Update</a>\
						</th>\
					</tr><tr>\
						<th style="width: 20%; text-align: center">\
							Game ban\
						</th>\
						<th style="width: 80%; text-align: center">\
							<input id="gameban">&nbsp;<a id="updategameban" class="btn btn-warning" steamid="'+jsonObj.data.steamid+'">Update</a>\
						</th>\
					</tr>');
					$('#chatban').val(jsonObj.data.chatban);
					$('#gameban').val(jsonObj.data.gameban);
					$('#usercoins').val(jsonObj.data.coins);
					$('#adminstate').val(jsonObj.data.admin);
            }, 'json');
	}
	$(document).on("click", "#updateCoins", function () {
		var steamID = $(this).attr("steamid");
		$.post('php/updatecoins.php', {coins: $('#usercoins').val(), steamid: steamID}, function (jsonObj) {	
			$("#user-detail-modal").modal("hide");
			
		});
	});
	$(document).on("click", "#updateAdmin", function () {
		var steamID = $(this).attr("steamid");
		$.post('php/updateadmin.php', {state: $('#adminstate').val(), steamid: steamID}, function (jsonObj) {	
			$("#user-detail-modal").modal("hide");
			
		});
	});
	$(document).on("click", "#updategameban", function () {
		var steamID = $(this).attr("steamid");
		$.post('php/updategameban.php', {state: $('#gameban').val(), steamid: steamID}, function (jsonObj) {	
			$("#user-detail-modal").modal("hide");
			
		});
	});
	$(document).on("click", "#updatechatban", function () {
		var steamID = $(this).attr("steamid");
		$.post('php/updatechatban.php', {state: $('#chatban').val(), steamid: steamID}, function (jsonObj) {	
			$("#user-detail-modal").modal("hide");
			
		});
	});
	
	$(document).on("click", "#supportsettingstab", function () {
		loadsupporttickets();
		
	});
	function loadsupporttickets(){
		$.getJSON('php/supportsettings.php', function(jsonObj) {
			$("#active-support-container").html('');
			$("#past-support-container").html('');
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				if(jsonObj.data[i].status==1)
				{
					var date = timeConverter(jsonObj.data[i].date);
					$("#active-support-container").append('<tr class="active">\
							<td style="text-align: center">\
								'+jsonObj.data[i].username+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].subject+'\
							</td>\
							<td style="text-align: center">\
								'+date+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].replies+'\
							</td>\
							<td style="text-align: center">\
								<a id="showticket" class="btn btn-warning" subject="'+jsonObj.data[i].subject+'" ticketid="'+jsonObj.data[i].id+'" status="'+jsonObj.data[i].status+'">Reply</a>\
							</td>\
						</tr>')
				}
				else
				{
					var date = timeConverter(jsonObj.data[i].date);
					$("#past-support-container").append('<tr class="active">\
							<td style="text-align: center">\
								'+jsonObj.data[i].username+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].subject+'\
							</td>\
							<td style="text-align: center">\
								'+date+'\
							</td>\
							<td style="text-align: center">\
								'+jsonObj.data[i].replies+'\
							</td>\
							<td style="text-align: center">\
								<a id="showticket" class="btn btn-primary" subject="'+jsonObj.data[i].subject+'" ticketid="'+jsonObj.data[i].id+'" status="'+jsonObj.data[i].status+'">Show</a>\
							</td>\
						</tr>')
				}
			}
			$('#active-support-table').DataTable();
			$('#past-support-table').DataTable();
		});
	};
	$(document).on("click", "#showticket", function () {
		var subject = $(this).attr("subject");
		var ticketid = $(this).attr("ticketid");
		var status = $(this).attr("status");
		$.post('php/showticket.php', {ticketid: ticketid}, function (jsonObj) {
				$("#ticket-subject").html(subject);
				$('#ticket').html('');
				var ticket = jsonObj.data;
				
				for(var i = 0; i < ticket.length; i++)
				{
					var date = timeConverter(ticket[i].date);
					
					$('#ticket').append('<tr><td>'+ticket[i].name+'</td><td>'+ticket[i].text+'</td><td><span style="font-size: 9pt">'+date+'</span></td></tr>')
					
				}
				$('#replyticket').html('');
				if(status == 1)
				{
					$('#replyticket').html('<textarea id="replyticket-input" rows="5" cols="65" maxlength="500" placeholder="Max length: 500 characters" style="width: 100%"></textarea>');
					$('#replyticket').append('<br><br><a id="closeticket-btn" class="btn btn-danger" ticketid="'+ticketid+'" style="width: 20%">Close ticket</a>');
					$('#replyticket').append('<a id="replyticket-btn" class="btn btn-primary" ticketid="'+ticketid+'" style="margin-left: 50px; width: 20%">Reply</a>');
				}
				$("#show-ticket-modal").modal("show");
            }, 'json');
	});
	$(document).on("click", "#replyticket-btn", function () {
		$(this).addClass('disabled');
		$.post('php/replyticket.php', {ticketid: $(this).attr("ticketid"), text: $("#replyticket-input").val()}, function () {
				$("#show-ticket-modal").modal("hide");
				loadsupporttickets();
            }, 'json');
	});
	$(document).on("click", "#closeticket-btn", function () {
		$.post('php/closeticket.php', {ticketid: $(this).attr("ticketid")}, function () {
				$("#show-ticket-modal").modal("hide");
				loadsupporttickets();
            }, 'json');
	});
	$(document).on("click", "#siteinfotab", function () {
		$.getJSON('php/siteinfo.php', function (jsonObj) {
				for(var i = 0; i < jsonObj.data.length; i++)
				{
					$("#"+jsonObj.data[i].name).html(jsonObj.data[i].status);
					if(jsonObj.data[i].status>=0)
					{
						document.getElementById(jsonObj.data[i].name).style.color = "green";
					}
					else
					{
						document.getElementById(jsonObj.data[i].name).style.color = "red";
					}
				}
				var sitebalance = document.getElementById("deposited").innerHTML - document.getElementById("withdrawed").innerHTML;
				$("#depwitbalance").html(sitebalance);
            }, 'json');
	});
	$(document).on("click", "#modlogstab", function () {
		$("#modselection").html('');
		$.getJSON('php/modsettings.php', function (jsonObj) {
				var mods = jsonObj.data;
				mods.sort(function(a,b){ return a.steamid-b.steamid});
				for(var i = 0; i < mods.length; i++) {
				  $("#modselection").append("<option value='"+mods[i].steamid+"'>"+mods[i].name+"</option>");
				}
				loadlogs(mods[0].steamid)
            }, 'json');
	});
	$(document).on("change", "#modselection", function () {
		loadlogs($("#modselection").val());
	});
	function loadlogs(steamid)
	{
		$("#modlogs-table").html('');
		$.post("php/modlogs.php", {steamid: steamid}, function(jsonObj){
			jsonObj = JSON.parse(jsonObj);
			var modlogs = jsonObj.data;
			for(var i =0; i < modlogs.length; i++){
				$("#modlogs-table").append("<tr class='active'><td>"+timeConverter(modlogs[i].date)+"</td><td>"+modlogs[i].action+"</td></tr>")
			}
		})
	}
})

    		
	