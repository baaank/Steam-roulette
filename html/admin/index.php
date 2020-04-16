<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Admin panel</title>

    <meta name="description" content="Source code generated using layoutit.com">
    <meta name="author" content="LayoutIt!">

    <link href="css/bootstrap.css" rel="stylesheet">
    <link href="css/jquery.dataTables.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">
    <link href="css/jquery.datetimepicker.css" rel="stylesheet">
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
		if($admin != 2)
		{
			header("Location: http://" . $_SERVER['HTTP_HOST'] ."/index.php");
			exit();
		}	
	?>
  </head>
  <body>

    <div class="container-fluid" style="min-width:1000px;">
	
	<div class="row">
	<div>

	  <!-- Nav tabs -->
	  <ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active"><a href="#gamesettings" aria-controls="home" role="tab" data-toggle="tab" style="color: #444">Game settings</a></li>
		<li role="presentation"><a href="#sitesettings" aria-controls="profile" role="tab" data-toggle="tab" style="color: #444" id="sitesettingstab" >Site settings</a></li>
		<li role="presentation"><a href="#botsettings" aria-controls="messages" role="tab" data-toggle="tab" style="color: #444" id="botsettingstab">Bot settings</a></li>
		<li role="presentation"><a href="#giveaways" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="giveawaysettingstab">Giveaways</a></li>
		<li role="presentation"><a href="#users" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="usersettingstab">Users</a></li>
		<li role="presentation"><a href="#depoffers" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="depofferstab">Deposit offers</a></li>
		<li role="presentation"><a href="#witoffers" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="witofferstab">Withdraw offers</a></li>
		<li role="presentation"><a href="#support" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="supportsettingstab">Support</a></li>
		<li role="presentation"><a href="#siteinfo" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="siteinfotab">Site info</a></li>
		<li role="presentation"><a href="#modlogs" aria-controls="settings" role="tab" data-toggle="tab" style="color: #444" id="modlogstab">Mod logs</a></li>
	  </ul>

	  <!-- Tab panes -->
	  <div class="tab-content">
		<div role="tabpanel" class="tab-pane active" id="gamesettings"><center><br><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Roulet settings</strong><br><table class="table table-bordered" style="width: 50%">
				<thead>
					<tr>
						<th style="width: 30%; text-align: center">
							Setting
						</th>
						<th style="width: 30%; text-align: center">
							Value
						</th>
					</tr>
				</thead>
				<tr>
						<td style="width: 30%; text-align: center">
							Min bet
						</td>
						<td style="width: 30%; text-align: center">
							<input id="rouletminbet">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Max bet
						</td>
						<td style="width: 30%; text-align: center">
							<input id="rouletmaxbet">
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Game length (in microseconds 1000ms=1s)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="rouletgamelength">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Game status (0 - stopped, 1 - started)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="rouletstatus">
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Display alert (0 - no, 1 - yes)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="rouletalert">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Alert message
						</td>
						<td style="width: 30%; text-align: center">
							<textarea id="rouletalertmsg" rows="5" cols="65" maxlength="500" placeholder="Max length: 500 characters" style="width: 100%"></textarea>
						</td>
					</tr>
					
				</tbody>
			</table><br><a id="update-roulet-btn" class="btn btn-success">Update</a></div>
			<div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Coinflip settings</strong><br><table class="table table-bordered" style="width: 50%">
				<thead>
					<tr>
						<th style="width: 30%; text-align: center">
							Setting
						</th>
						<th style="width: 30%; text-align: center">
							Value
						</th>
					</tr>
				</thead>
				<tr>
						<td style="width: 30%; text-align: center">
							Min bet
						</td>
						<td style="width: 30%; text-align: center">
							<input id="coinflipminbet">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Max bet
						</td>
						<td style="width: 30%; text-align: center">
							<input id="coinflipmaxbet">
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Game status (0 - inactive, 1 - active)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="coinflipstatus">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Display alert (0 - no, 1 - yes)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="coinflipalert">
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Alert message
						</td>
						<td style="width: 30%; text-align: center">
							<textarea id="coinflipalertmsg" rows="5" cols="65" maxlength="500" placeholder="Max length: 500 characters" style="width: 100%"></textarea>
						</td>
					</tr>
				</tbody>
			</table><br><a id="update-coinflip-btn" class="btn btn-success">Update</a></div>
			</center></div>
		<div role="tabpanel" class="tab-pane" id="sitesettings"><br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Site settings</strong><br><table class="table table-bordered" style="width: 50%">
				<thead>
					<tr>
						<th style="width: 30%; text-align: center">
							Setting
						</th>
						<th style="width: 30%; text-align: center">
							Value
						</th>
					</tr>
				</thead>
				<tr>
						<td style="width: 30%; text-align: center">
							Min deposit
						</td>
						<td style="width: 30%; text-align: center">
							<input id="mindeposit">
						</td>
					</tr>
				<tr class="active">
						<td style="width: 30%; text-align: center">
							Refferals status (0 - inactive, 1 - active)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="refferalstatus">
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Coins for reffering
						</td>
						<td style="width: 30%; text-align: center">
							<input id="refferalforref">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Coins for using code
						</td>
						<td style="width: 30%; text-align: center">
							<input id="refferalforcode">
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Display alert on all sites (0 - no, 1 - yes)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="sitealert">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Alert message
						</td>
						<td style="width: 30%; text-align: center"><textarea id="sitealertmsg" rows="5" cols="65" maxlength="500" placeholder="Max length: 500 characters" style="width: 100%"></textarea>
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							In maintenance (0 - no, 1 - yes)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="maintenance">
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Chat status (0 - inactive, 1 - active)
						</td>
						<td style="width: 30%; text-align: center">
							<input id="chatstatus">
						</td>
					</tr>
				</tbody>
			</table><br><a id="update-sitesettings-btn" class="btn btn-success">Update</a></div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="botsettings">
		<br><center>
		<div id="bot-container"></div>
		</center>
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
		<div role="tabpanel" class="tab-pane" id="users">
		<br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Users</strong><br>
			 <table id="users-table" class="table table-bordered" style="width: 100%" >
        <thead>
            <tr>
                <th style="text-align: center; width: 10%">Avatar</th>
                <th style="text-align: center; width: 20%">Name</th>
                <th style="text-align: center; width: 10%">Steamid</th>
                <th style="text-align: center; width: 10%">Coins</th>
                <th style="text-align: center; width: 10%">Users reffered</th>
                <th style="text-align: center; width: 10%">Roulet</th>
                <th style="text-align: center; width: 10%">Coinflip</th>
                <th style="text-align: center; width: 10%">Admin</th>
                <th style="text-align: center; width: 10%">Show details</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Steamid</th>
                <th>Coins</th>
                <th>Users reffered</th>
                <th>Roulet</th>
                <th>Coinflip</th>
                <th>Admin</th>
                <th>Show details</th>
            </tr>
        </tfoot>
        <tbody id="users-container">
        </tbody>
    </table>
	</div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="depoffers">
		<br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Deposit Offers</strong><br>
			 <table id="depoffers-table" class="table table-bordered" style="width: 100%" >
        <thead>
            <tr>
                <th style="text-align: center; width: 12%">Offer ID</th>
                <th style="text-align: center; width: 12%">SteamID</th>
                <th style="text-align: center; width: 2%">Bot</th>
                <th style="text-align: center; width: 12%">Coins</th>
                <th style="text-align: center; width: 20%">Items</th>
                <th style="text-align: center; width: 13%">Message</th>
                <th style="text-align: center; width: 2%">Status</th>
                <th style="text-align: center; width: 12%">Date</th>
                <th style="text-align: center; width: 12%">Delete</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Offer ID</th>
                <th>SteamID</th>
                <th>Bot</th>
                <th>Coins</th>
                <th>Items</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Delete</th>
            </tr>
        </tfoot>
        <tbody id="depoffers-container">
        </tbody>
    </table>
	</div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="witoffers">
		<br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Withdraw Offers</strong><br>
			 <table id="witoffers-table" class="table table-bordered" style="width: 100%" >
        <thead>
            <tr>
                <th style="text-align: center; width: 12%">Offer ID</th>
                <th style="text-align: center; width: 12%">SteamID</th>
                <th style="text-align: center; width: 2%">Bot</th>
                <th style="text-align: center; width: 12%">Coins</th>
                <th style="text-align: center; width: 20%">Items</th>
                <th style="text-align: center; width: 13%">Message</th>
                <th style="text-align: center; width: 2%">Status</th>
                <th style="text-align: center; width: 12%">Date</th>
                <th style="text-align: center; width: 12%">Delete</th>
            </tr>
        </thead>
        <tfoot>
            <tr>
                <th>Offer ID</th>
                <th>SteamID</th>
                <th>Bot</th>
                <th>Coins</th>
                <th>Items</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Delete</th>
            </tr>
        </tfoot>
        <tbody id="witoffers-container">
        </tbody>
    </table>
	</div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="support">
		<center><br><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Support</strong><br><br><strong style="font-size:15pt">Active tickets</strong><br><table id="active-support-table" class="table table-bordered" style="width: 100%">
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
				<tbody id="active-support-container">
					
				</tbody>
			</table><br><br><strong style="font-size:15pt">Closed tickets</strong><br><table id="past-support-table" class="table table-bordered" style="width: 100%">
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
							Show
						</th>
					</tr>
				</thead>
				<tbody id="past-support-container">
					
				</tbody>
			</table></div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="siteinfo">
		<br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Site info</strong><br><table class="table table-bordered" style="width: 50%">
				<thead>
					<tr>
						<th style="width: 30%; text-align: center">
							Parameter
						</th>
						<th style="width: 30%; text-align: center">
							Value
						</th>
					</tr>
				</thead>
				<tr>
						<td style="width: 30%; text-align: center">
							Roulet balance
						</td>
						<td style="width: 30%; text-align: center">
							<span id="roulet"></span>
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Coinflip balance
						</td>
						<td style="width: 30%; text-align: center">
							<span id="coinflip"></span>
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Overall site balance
						</td>
						<td style="width: 30%; text-align: center">
							<span id="site"></span>
						</td>
					</tr>
					<tr>
						<td style="width: 30%; text-align: center">
							Deposited coins
						</td>
						<td style="width: 30%; text-align: center">
							<span id="deposited"></span>
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Withdrawed balance
						</td>
						<td style="width: 30%; text-align: center">
							<span id="withdrawed"></span>
						</td>
					</tr>
					<tr class="active">
						<td style="width: 30%; text-align: center">
							Coins in bots inv
						</td>
						<td style="width: 30%; text-align: center">
							<span id="depwitbalance"></span>
						</td>
					</tr>
				</tbody>
			</table></div></center>
		</div>
		<div role="tabpanel" class="tab-pane" id="modlogs">
		<br>
		<center><div class="jumbotron" style="width: 80%"><strong style="font-size:15pt">Mod logs</strong>
		<p style="margin-top: 35px">Select mod</p>
					<select id="modselection" style="width: 200px; color: black">
					</select>
		<table class="table table-bordered" style="width: 60%; margin-top:20px">
				<thead>
					<tr>
						<th style="width: 30%; text-align: center">
							Date
						</th>
						<th style="width: 70%; text-align: center">
							Action
						</th>
					</tr>
				</thead>
				<tbody id="modlogs-table">
				</tbody>
			</table></div></center>
		</div>
	  </div>

	</div>
	</div>
	
<div id="user-detail-modal" class="modal fade bs-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
	 <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="user-title"></h4>
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
				<tbody id="user-body">
				
				</tbody>
			</table>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
			Steamid of account with items:<br><input id="giveawaybotid" type="text" ><br><a id="refreshitems" class="btn btn-success" style="margin-top:10px; margin-bottom:10px">Refresh</a></center>
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