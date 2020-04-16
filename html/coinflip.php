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
	<div class="col-xs-0 col-md-2"></div>
	<div class="col-xs-12 col-md-8">
	<div class="jumbotron">
	<center>
	<div id="infoAlert"></div>
	<div id="coin-flip-cont">
	<div id="coin" style="border-left-color: green;">
	<div class="front"></div>
	<div class="back"></div>
	
	</div>
	</div><br>
	<b>Coins to bet:</b><br> <input type="text" id="coins-amount"><br>
	<div class="front"></div><div class="back"></div>
	<br><b>Pick one:</b><br><br>
	<div id="frontsubmit"></div>&nbsp; <div id="backsubmit"></div>
	
	</center>
	</div>
	<div class="jumbotron">
	<center>
	<table class="table the-table table-bordered">
				<thead>
					<tr class="info">
						<th style="width: 25%; text-align: center">
							Bet value
						</th>
						<th style="width: 25%; text-align: center">
							Your pick
						</th>
						<th style="width: 25%; text-align: center">
							AI pick
						</th>
						<th style="width: 25%; text-align: center">
							Date
						</th>
					</tr>
				</thead>
				<tbody id="gamesTable">
				</tbody>
			</table>
			</center>
	</div>
	</div>
	<div class="col-xs-0 col-md-2"></div>
	</div>
	
</div>
    <script src="js/jquery.min.js"></script>
	<script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/coinflip.js"></script>
  </body>
</html>