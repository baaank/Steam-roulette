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

var testvar;
$(document).ready(function () {
	$.getJSON('php/usersettings.php', function(jsonObj) {
		
		jsonObj.data.sort(function (a, b) {   
				return a.steamid - b.steamid;
			});
		$("#users-container").html('');
		for(var i = 0; i < jsonObj.data.length; i++)
		{
			var gameban, chatban;
			if(jsonObj.data[i].gameban == 1)
				gameban = '<a id="updategameban" class="btn btn-warning" steamid="'+jsonObj.data[i].steamid+'" state="0">Unban</a>'
			else
				gameban = '<a id="updategameban" class="btn btn-warning" steamid="'+jsonObj.data[i].steamid+'" state="1">Ban</a>'
			if(jsonObj.data[i].chatban == 1)
				chatban = '<a id="updatechatban" class="btn btn-warning" steamid="'+jsonObj.data[i].steamid+'" state="0">Unban</a>'
			else
				chatban = '<a id="updatechatban" class="btn btn-warning" steamid="'+jsonObj.data[i].steamid+'" state="1">Ban</a>'
			$("#users-container").append('<tr><td style="text-align: center">\
						<img src="'+jsonObj.data[i].avatar+'" style="width: 30px; height: 30px">\
					</td>\
					<td style="text-align: center">\
						'+jsonObj.data[i].name+'\
					</td>\
					<td style="text-align: center">\
						'+jsonObj.data[i].steamid+'\
					</td>\
					<td style="text-align: center">\
						'+chatban+'\
					</td>\
					<td style="text-align: center">\
						'+gameban+'\
					</td>\
					</tr>');
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
	$(document).on("click", "#updategameban", function () {
		var element = $(this);
		element.addClass("disabled");
		var steamID = $(this).attr("steamid");
		$.post('php/updategameban.php', {state: element.attr("state"), steamid: steamID}, function (jsonObj) {	
			element.removeClass("disabled");
			var state = 1-element.attr("state");
			element.attr("state", state);
			if(element.attr("state")==0)
				element.html("Unban");
			else
				element.html("Ban");
		});
	});
	$(document).on("click", "#updatechatban", function () {
		var element = $(this);
		element.addClass("disabled");
		var steamID = $(this).attr("steamid");
		$.post('php/updatechatban.php', {state: element.attr("state"), steamid: steamID}, function (jsonObj) {	
			element.removeClass("disabled");
			var state = 1-element.attr("state");
			element.attr("state", state);
			if(element.attr("state")==0)
				element.html("Unban");
			else
				element.html("Ban");
		});
	});
	
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
				 
					$('#pastgiveaways').DataTable();
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
				loadgiveaways();
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
			$("#giveawaybotid").html(jsonObj.data)
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
	
	
	
	
	$(document).on("click", "#supportsettingstab", function () {
		loadsupporttickets();
		
	});
	function loadsupporttickets(){
		$.getJSON('php/supportsettings.php', function(jsonObj) {
			$("#support-container").html('');
			for(var i = 0; i < jsonObj.data.length; i++)
			{
				var date = timeConverter(jsonObj.data[i].date);
				$("#support-container").append('<tr class="active">\
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
							<a id="showticket" class="btn btn-warning" subject="'+jsonObj.data[i].subject+'" ticketid="'+jsonObj.data[i].id+'"">Reply</a>\
						</td>\
					</tr>')
				
			}
			
		});
	};
	$(document).on("click", "#showticket", function () {
		var subject = $(this).attr("subject");
		var ticketid = $(this).attr("ticketid");
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
				$('#replyticket').html('<textarea id="replyticket-input" rows="5" cols="65" maxlength="500" placeholder="Max length: 500 characters" style="width: 100%"></textarea>');
				$('#replyticket').append('<br><br><a id="closeticket-btn" class="btn btn-danger" ticketid="'+ticketid+'" style="width: 20%">Close ticket</a>');
				$('#replyticket').append('<a id="replyticket-btn" class="btn btn-primary" ticketid="'+ticketid+'" style="margin-left: 50px; width: 20%">Reply</a>');
				
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

})

    		
	