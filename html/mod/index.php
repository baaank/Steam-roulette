<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Mod panel</title>
	<?php 
		session_start();
		include '../php/default.php';
		include '../php/SteamAuthentication/steamauth/userInfo.php';
		$db = getDB();	
		if(!isset($_SESSION['steamid']))
		{
			header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
			exit();
		}		
		$stmt = $db->prepare('SELECT * FROM `users` WHERE `steamid`=:steamid');
				$stmt->bindValue(':steamid', $_SESSION['steamid']);
				$stmt->execute();
				$admin = $stmt->fetch()["admin"];
		if($admin != 1 && $admin != 2)
		{
			header("Location: http://" . $_SERVER['HTTP_HOST'] ."/index.php");
			exit();
		}	
	?>
    <meta name="description" content="Source code generated using layoutit.com">
    <meta name="author" content="LayoutIt!">

    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/jquery.dataTables.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link href="css/jquery.datetimepicker.css" rel="stylesheet">

  </head>
  <body>

    <div class="container-fluid" style="min-width:1000px;">
	
	<div class="row">
	<div>

	  <!-- Nav tabs -->
	  <ul class="nav nav-tabs" role="tablist">
		<li role="presentation"><a href="#users" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="usersettingstab">Users</a></li>
		<li role="presentation"><a href="#giveaways" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="giveawaysettingstab">Giveaways</a></li>
		<li role="presentation"><a href="#support" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="supportsettingstab">Support</a></li>
	  </ul>

	  <!-- Tab panes -->
	  <div class="tab-content">
		<div role="tabpanel"  class="tab-pane active" id="users">
		<br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Users</strong><br>
			 <table id="users-table" class="table table-bordered" style="width: 100%" >
        <thead>
            <tr>
                <th style="text-align: center; width: 20%">Avatar</th>
                <th style="text-align: center; width: 20%">Name</th>
                <th style="text-align: center; width: 20%">Steamid</th>
                <th style="text-align: center; width: 20%">Chat ban</th>
                <th style="text-align: center; width: 20%">Game ban</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Steamid</th>
                <th>Chat ban</th>
                <th>Game ban</th>
            </tr>
        </tfoot>
        <tbody id="users-container">
        </tbody>
    </table>
	</div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="giveaways">
		<center><br><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Giveaways</strong><br><a id="create-new-giveaway" class="btn btn-primary">Create new giveaway</a><br><br><strong style="font-size:15pt">Active giveaways</strong><br><table class="table table-bordered" style="width: 100%">
				<thead>
					<tr>
						<th style="width: 28%; text-align: center">
							Giveaway item
						</th>
						<th style="width: 8%; text-align: center">
							Total coins
						</th>
						<th style="width: 8%; text-align: center">
							Coins now
						</th>
						<th style="width: 6%; text-align: center">
							Value
						</th>
						<th style="width: 15%; text-align: center">
							Ending
						</th>
						<th style="width: 15%; text-align: center">
							Status (1 - active, 2 - ended)
						</th>
						<th style="width: 10%; text-align: center">
							Restart
						</th>
						<th style="width: 10%; text-align: center">
							Delete
						</th>
					</tr>
				</thead>
				<tbody id="active-giveaway-container">
				</tbody>
			</table><br><strong style="font-size:15pt">Past giveaways</strong><br><table id="pastgiveaways" class="table table-bordered" style="width: 100%">
				<thead>
					<tr>
						<th style="width: 30%; text-align: center">
							Giveaway item
						</th>
						<th style="width: 10%; text-align: center">
							Total coins
						</th>
						<th style="width: 8%; text-align: center">
							Coins now
						</th>
						<th style="width: 7%; text-align: center">
							Value
						</th>
						<th style="width: 15%; text-align: center">
							Ended
						</th>
						<th style="width: 10%; text-align: center">
							Winner
						</th>
						<th style="width: 20%; text-align: center">
							Status (1 - active, 2 - ended)
						</th>
						<th style="width: 10%; text-align: center">
							Delete
						</th>
					</tr>
				</thead>
				<tbody id="past-giveaway-container">
				</tbody>
			</table></div></center>
		</div>
		
		<div role="tabpanel" class="tab-pane" id="support">
		<center><br><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Support</strong><br><br><strong style="font-size:15pt">Active tickets</strong><br><table class="table table-bordered" style="width: 80%">
				<thead>
					<tr>
						<th style="width: 15%; text-align: center">
							User name
						</th>
						<th style="width: 55%; text-align: center">
							Subject
						</th>
						<th style="width: 15%; text-align: center">
							Date
						</th>
						<th style="width: 5%; text-align: center">
							Replies
						</th>
						<th style="width: 10%; text-align: center">
							Reply
						</th>
					</tr>
				</thead>
				<tbody id="support-container">
					
				</tbody>
			</table>
			</div></center>
		</div>
	  </div>
	</div>
	</div>
	

<div id="create-giveaway-modal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
	 <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title">Create new giveaway</h4>
      </div>
      <div class="modal-body">
        <table class="table table-bordered" style="width: 100%">
				<thead>
					<tr>
						<th style="width: 20%; text-align: center">
							Parameter
						</th>
						<th style="width: 80%; text-align: center">
							Value
						</th>
					</tr>
				</thead>
				<tbody id="create-giveaway-body">
				<tr class="active">
						<td style="width: 30%; text-align: center">
							Item image
						</td>
						<td style="width: 30%; text-align: center">
							<input id="itemimage" style="width: 100%; text-align: center">
						</td>
					</tr>
				<tr class="active">
						<td style="width: 30%; text-align: center">
							Item name
						</td>
						<td style="width: 30%; text-align: center">
							<input id="itemname" style="width: 100%; text-align: center">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Item value
						</td>
						<td style="width: 30%; text-align: center">
							<input id="itemvalue" style="width: 100%; text-align: center">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Total coins to end giveaway
						</td>
						<td style="width: 30%; text-align: center">
							<input id="totalcoins" style="width: 100%; text-align: center">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Ending time
						</td>
						<td style="width: 30%; text-align: center">
							<input id="datetimepicker" type="text" style="width: 100%; text-align: center">
						</td>
					</tr>
				</tbody>
			</table>
			<center>
			<button id="creategiveaway" type="button" class="btn btn-primary" style="margin-top:10px; margin-bottom:10px">Create</button><br>
			Steamid of account with items:<br><span id="giveawaybotid"></span><br><a id="refreshitems" class="btn btn-success" style="margin-top:10px; margin-bottom:10px">Refresh</a></center>
			 <table id="itemstable" class="table table-bordered" style="width: 100%">
				<thead>
					<tr>
						<th style="width: 20%; text-align: center">
							Image
						</th>
						<th style="width: 60%; text-align: center">
							Item name
						</th>
						<th style="width: 20%; text-align: center">
							Value
						</th>
					</tr>
				</thead>
				<tbody id="create-giveaway-item-body">
				</tbody>
			</table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
	

<div id="show-ticket-modal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
   <div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel">Subject: <span id="ticket-subject"></span></h4>
		  </div>
		  <div class="modal-body"><center>
			<table class="table the-table table-bordered">
				<thead>
					<tr>
						<th style="width: 20%">
							User
						</th>
						<th style="width: 60%">
							Message
						</th>
						<th style="width: 20%">
							Date
						</th>
					</tr>
				</thead>
				<tbody id="ticket">
				</tbody>
			</table>
			<div id="replyticket"></div>
			</center>
		  </div>
		  <div class="modal-footer">
			<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
		  </div>
		</div>
	  </div>
</div>
	
</div>
    <script src="js/jquery.min.js"></script>
	  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="js/bootstrap.js"></script>
    <script src="js/jquery.dataTables.min.js"></script>
    <script src="js/jquery.datetimepicker.full.min.js"></script>
    <script src="js/date.js"></script>
    <script src="js/script.js"></script>
  </body>
</html>