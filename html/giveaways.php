<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Bootstrap 3, from LayoutIt!</title>

    <meta name="description" content="Source code generated using layoutit.com">
    <meta name="author" content="LayoutIt!">

    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link href="css/style.css" rel="stylesheet">

  </head>
  <body>
<nav class="navbar navbar-default" role="navigation">
				<?php include 'header.php' ?>
				
			</nav>
    <div class="container-fluid" style="min-width:1000px;">
	
	<div class="row">
	<div class="col-md-2" ></div>
		<div class="col-md-8" style="padding-left: 35px; ">
			
			<div class="jumbotron">
			<div style="padding-right: 17px;">
			<center>
				<p>
					GIVEAWAYS
				</p>
				</center>
				</div>
				</div>
				<div id="giveaways"></div>
				
		</div>
		<div class="col-md-2" ></div>
	</div>
	
	<div class="modal fade" id="enterModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	  <div class="modal-dialog" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel">Enter giveaway id <span id="giveawayID"></span></h4>
		  </div>
		  <div class="modal-body"><center>
			<h4 id="itemName"></h4>
			<h4>Coins limit: <span id="totalcoins"></span></h4>
			<input id="coinsToEnter" placeholder="Coins here..." style="width: 30%; height: 30px; font-size: 15pt; border-radius: 5px"><br>
			<a id="depositBtn" type="button" class="btn btn-primary">Deposit</a>
			<br><br>
			<span id="infoAlert"></span>
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
    <script src="js/bootstrap.min.js"></script>
    <script src="js/giveaways.js"></script>
  </body>
</html>