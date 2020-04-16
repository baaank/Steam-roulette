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
    <div class="container-fluid">
	<div class="row">
	<div class="col-md-2 col-sm-0" ></div>
		<div class="col-md-8 col-sm-12">
			
			<div class="jumbotron">
			<center>
				<p>
					Select items to deposit by clicking on them.
				</p>
				<p>Coins: <span id="coins">0</span></p>
				
				<p>
					<a class="btn btn-warning btn-large" href="#">Deposit</a>
					
				</p>
				<div id="dep-offers"></div>
				</center>
			</div>
		<center>
			<div style="margin-top:-10px; margin-bottom: 20px">
	<span id="refresh"></span>
	<span id="loading"><img src='/img/loading.gif'></span>
	</div></center>
		</div>
	
		<div class="col-md-2 col-sm-0" ></div>
	</div>
	
	<div class="row">
	<div class="col-md-2" ></div>
	<div class="col-md-8">
	<div id="items-list" class="jumbotron" style="height:100%"></div>
	</div>
	<div class="col-md-2" ></div>
	</div>
	
</div>
<br><br>
    <script src="js/jquery.min.js"></script>
	<script type="text/javascript" src="js/noty/packaged/jquery.noty.packaged.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/deposit.js"></script>

  </body>
</html>