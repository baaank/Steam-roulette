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
  <div class="bg-image"></div>
<nav class="navbar navbar-default" role="navigation">
				<?php include 'header.php' ?>
				
			</nav>
    <div class="container-fluid" style="min-width:1000px;">
	
	<div class="row">
	<div class="col-md-3">
	<div class="jumbotron" style="opacity: 0.8">
			<center>
				<p>
					Chat
				</p>
				</center>
				<div id="chat-table" class="chat-area"></div>
				<input id="chat-box" class="chat-box" placeholder="Max 40 chars"></input>
			</div>
	<div class="jumbotron" style="height: 180px; opacity: 0.8">
			<center style="margin-top: -30px">
				<p>
					Last rolls
				</p>
				<div id="history" style="display: inline-block; margin-top:20px">
				<div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div><div class="roll-block"><div class="green-block">0</div></div>
				</center>
			</div>
				
			
	</div>
		<div class="col-md-8" id="center"
				 style='-moz-user-select: none; -webkit-user-select: none; -ms-user-select:none; user-select:none;-o-user-select:none;" 
				 unselectable="on"
				 onselectstart="return false;" 
				 onmousedown="return false;'>
			<div class="row">
			
			<div class="jumbotron" style="height: 599px; opacity: 0.9">
			<div class="col-md-6" id="leftJumbo">
			<center><p id="round">Round #0</p><p id="bets"></p>
				<div class="glyphicon glyphicon-chevron-down" style="position: relative; z-index: 0;"></div><br>
				<img id="roulet" src="img/roulet.png" style="position: relative; z-index: 0; height:350px; width: 350px;"><br>
						<br>
			</center>
			<div id="progressBar" style="margin-top:12px"><div class="progressBarBlue" id="barColor"></div></div><span id="timer" style="position: relative; left:47%; top: -75px">00.00</span>
			</div>
			<div class="col-md-6"><div style="float: right; position: relative; top: 75px; right: 0%; width: 400px"><center><strong><span id="bank2">Your coins: 0</span><br><br>
			<input style="text-align: center; width: 65%; height: 30px; border-radius: 5px" id="coinsToBet" value="0" type="number"><br><br>
			<div id="10" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #009999; display: inline-block; cursor: pointer;">10</div>
			&nbsp;&nbsp;<div id="100" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #009999; display: inline-block; cursor: pointer;">100</div>
			&nbsp;&nbsp;<div id="1000" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #009999; display: inline-block; cursor: pointer;">1000</div>&nbsp;&nbsp;
			<div id="10000" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #009999; display: inline-block; cursor: pointer;">10000</div>
			<br>
			<div id="-10" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #FF4040; display: inline-block; cursor: pointer; margin-top:10px">-10</div>&nbsp;&nbsp;<div id="-100" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #FF4040; display: inline-block; cursor: pointer;">-100</div>&nbsp;&nbsp;<div id="-1000" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #FF4040; display: inline-block; cursor: pointer;">-1000</div>&nbsp;&nbsp;<div id="-10000" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #FF4040; display: inline-block; cursor: pointer;">-10000</div>
			<br>
			<div id="x2" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #7109AA; display: inline-block; cursor: pointer; margin-top:10px">x2</div>&nbsp;&nbsp;<div id="half" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #AD66D5; display: inline-block; cursor: pointer;">1/2</div>&nbsp;&nbsp;<div id="0" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #FF9140; display: inline-block; cursor: pointer;">0</div>&nbsp;&nbsp;<div id="MAX" style="width: 60px; height: 60px; border-radius: 30px; padding-top:19px; background-color: #FF4C00; display: inline-block; cursor: pointer;">MAX</div>
			</strong></center></div></div>
			
			</div>
			<div class="row">
			<div class="col-md-4">
			<div id="redd" class="betRed" href="javascript:void(0);" clicked=0 style="width:100%">RED</div>
			<div class="jumbotron" style="margin-top: -30px">
			<center><div id="number-red"><div id="total-red" ></div></div>
			RED<br>COINS: <span id="redPot">0</span></center>
			<br>
			<div id="redBig" style="padding-left:30px; padding-right:30px;"></div>
			</div></div>
			<div class="col-md-4">
			<div class="betGreen" href="#" clicked=0 style="width:100%">GREEN</div>
			<div class="jumbotron" style="margin-top: -30px">
			<center><div id="number-green"><div id="total-green" ></div></div>
			GREEN<br>COINS: <span id="greenPot">0</span></center>
			<br>
			<div id="greenBig" style="padding-left:30px; padding-right:30px;"></div>
			</div></div>
			<div class="col-md-4">
			<div class="betBlack" href="#" clicked=0 style="width:100%; z-index: 1;">BLACK</div>
			<div class="jumbotron" style="margin-top: -30px;">
			<center><div id="number-black"><div id="total-black" ></div></div>
			BLACK<br>COINS: <span id="blackPot">0</span></center>
			<br>
			<div id="blackBig" style="padding-left:30px; padding-right:30px;"></div>
			</div>
			</div>
			</div>
			</div>
			
			
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