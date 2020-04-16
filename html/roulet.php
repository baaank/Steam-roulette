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
	<div class="col-md-3">
	<div class="jumbotron">
			<center>
				<p>
					Chat
				</p>
				<table class="table">
				
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"><span id="message">Players online: </span></td>
				<tbody id="chat-table">
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				<tr id="chatMsg"><td></td><td style="min-height: 42px; width: 280px; display: inline-block; word-break: break-word; font-size:10pt"></td>
				</tbody>
				<tr class="info"><td style="width: 50px"><a class="btn btn-warning" id="chat-send">Send</a></td><td style="padding-top:8px; width: 280px; display: inline-block; word-break: break-word;"><input style="border-radius:5px; height: 30px; width: 230px" id="chat-input" placeholder="Max 40 chars"></td>
				
			</table>
				<span id="disconnect"></span>
				</center>
			</div>
	<div class="jumbotron" style="height: 280px" >
			<center>
				<p>
					Last rolls
				</p>
				<div id="history">
				
				<div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div><div class="col-md-2"><div id="squareGreen">0</div></div>
				</center>
			</div>
			
	</div>
		<div class="col-md-8" id="center">
			<div class="row">
			
			<div class="jumbotron" style="height: 600px">
			<div class="col-md-6" id="leftJumbo">
			<center><p id="round">Round #0</p>
				<div class="glyphicon glyphicon-chevron-down" style="position: relative; z-index: 0;"></div><br>
				<img id="roulet" src="img/roulet.png" style="position: relative; z-index: 0; height:350px; width: 350px;"><br>
						<br>
			</center>
			<div id="progressBar"><div></div></div>
			</div>
			<div class="col-md-6"><div style="float: right; position: relative; top: 75px; right: 0%; width: 400px"><center><strong><span id="bank2">Your coins: 0</span><br><br>
			<input style="text-align: center; width: 90%; height: 30px; border-radius: 5px" id="coinsToBet" value="0"><br><br>
			<input type='range' value='0' min='0' max='50000' id="range"><br>
			<a class="btn btn-primary" id="10" style="width: 23%; height: 30px">10</a>&nbsp;<a class="btn btn-primary" id="100" style="width: 23%; height: 30px">100</a>&nbsp;<a class="btn btn-primary" id="1000" style="width: 23%; height: 30px">1 000</a>&nbsp;<a class="btn btn-primary" id="10000" style="width: 23%; height: 30px">10 000</a><br><br>
			<button class="betRed" href="javascript:void(0);" clicked=0>RED</button>&nbsp;<button class="betGreen" href="#" clicked=0>GREEN</button>&nbsp;<button class="betBlack" href="#" clicked=0>BLACK</button><br><br>
			<a class="btn btn-info" style="width: 90%; height: 50px; font-size: 20pt" id="bet">BET</a>
			</strong></center></div></div>
			
			</div>
			
			</div>
			<center><div id="number"><div id="total" ></div></div></center>
			<div class="row">
			<div class="col-md-4">
			<div class="jumbotron"><center>
			RED<br>COINS: <span id="redPot">0</span></center>
			<br>
			<div id="redBig"></div>
			</div>
			</div>
			<div class="col-md-4">
			<div class="jumbotron"><center>
			GREEN<br>COINS: <span id="greenPot">0</span></center>
			<br>
			<div id="greenBig"></div>
			</div>
			</div>
			<div class="col-md-4">
			<div class="jumbotron"><center>
			BLACK<br>COINS: <span id="blackPot">0</span></center>
			<br>
			<div id="blackBig"></div>
			</div>
			</div>
			</div>
			
			
		</div>
		<div class="col-md-1">
		</div>
	</div>
	</div>
	
	
</div>
    <script src="js/jquery.min.js"></script>
	  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
    <script src="js/bootstrap.min.js"></script>
	<script src="js/socket.io-1.3.5.js"></script>
	<script src="js/counter.js"></script>
    <script src="js/roulet.js"></script>
  </body>
</html>