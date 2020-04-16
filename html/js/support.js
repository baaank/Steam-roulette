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
	tickets();
	function tickets(){
		
		$.getJSON('/php/support-tickets.php', function(jsonObj) {
			$('#tickets').html('');
			var tickets = jsonObj.data;
			tickets.sort(function (a, b) {   
					return a.status - b.status || b.date - a.date;
				});
			for(var i = 0; i < tickets.length; i++)
			{
				var date;
				if(tickets[i].date != null)
				{
					date = timeConverter(tickets[i].date);
				}
				else
				{
					date = "-";
				}
				if(tickets[i].status == 1)
				{
					$('#tickets').append('<tr><td>Open</td><td>'+tickets[i].subject+'</td><td>'+tickets[i].replies+'</td><td>'+date+'</td><td><a id="show-btn" class="btn btn-primary" style="width: 100%" subject="'+tickets[i].subject+'" status="'+tickets[i].status+'" ticketid="'+tickets[i].id+'">Show</a></td></tr>');
				}
				else
				{
					$('#tickets').append('<tr class="active"><td>Closed</td><td>'+tickets[i].subject+'</td><td>'+tickets[i].replies+'</td><td>'+date+'</td><td><a id="show-btn" subject="'+tickets[i].subject+'" class="btn btn-primary" style="width: 100%" status="'+tickets[i].status+'" ticketid="'+tickets[i].id+'">Show</a></td></tr>');	
				}
			}
		});
	}
	
	$(document).on("click", "#show-btn", function () {
		var subject = $(this).attr("subject");
		var ticketid = $(this).attr("ticketid");
		var status = $(this).attr("status");
		$.post('php/show-ticket.php', {ticketid: $(this).attr("ticketid")}, function (jsonObj) {
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
				$("#showticket").modal("show");
            }, 'json');
	});
	$(document).on("click", "#replyticket-btn", function () {
		$(this).addClass('disabled');
		$.post('php/reply-ticket.php', {ticketid: $(this).attr("ticketid"), text: $("#replyticket-input").val()}, function (jsonObj) {
				$("#showticket").modal("hide");
				tickets();
            }, 'json');
	});
	$(document).on("click", "#closeticket-btn", function () {
		$.post('php/close-ticket.php', {ticketid: $(this).attr("ticketid")}, function (jsonObj) {
				$("#showticket").modal("hide");
				tickets();
            }, 'json');
	});
	$("#subject-input").val('');
	$("#text-input").val('');
	$(document).on("click", "#openticket", function () {
		$("#openticket-modal").modal("show");
	});
	$(document).on("click", "#submit-btn", function () {
		$.post('php/open-ticket.php', {subject: $("#subject-input").val(), text: $("#text-input").val()}, function (jsonObj) {
				$("#openticket").modal("hide");
				tickets();
            }, 'json');
	});
	
	
})

    		
	