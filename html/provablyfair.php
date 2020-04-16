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
	<div class="col-md-2"></div>
	<div class="col-md-8">
	<div class="jumbotron">
			<center>
				<p>
					How does it work?
				</p>
				<p style="font-size:13pt">
				To choose number, first we are generating hash and suming it up with round number,<br>then suming ASCII value of each character. At the end we are taking the remainder by 37.<br>
				Seed is hidden in hash, and is revealed at the end of the day.
				<p class="bg-info" style="width: 500px; font-size:10pt">
				var hash =SHA256(seed+roundnumber.toString());<br>
				var num = 0;<br>
				for(var i = 0; i < 32; i++)<br>
				{num += hash.charCodeAt(i);}<br>
				number = num%37
				</p>
				You can test the code here:
				</p>
				<input placeholder="Hash" id="hash-input">&nbsp;<input placeholder="Seed" id="seed-input">&nbsp;<input placeholder="Round number" id="round-input"> <button class="btn btn-success" id="test-button">Test it!</button><br><br>
				<div id="result"></div>
				</center>
			</div>
	<div class="jumbotron">
<center>
				<p>
					History
				</p>
				<table class="table the-table">
				<thead>
					<tr class="info">
						<th style="width: 10%">
							Date
						</th>
						<th style="width: 28%">
							Seed
						</th>
						<th style="width: 40%">
							Hash
						</th>
						<th style="width: 5%">
							Rolls
						</th>
						<th style="width: 8%">
							#
						</th>
					</tr>
				</thead>
				<tbody id="gamesTable">
				</tbody>
			</table>
				</center>
	</div>
	</div>
	<div class="col-md-2"></div>
	
	<div class="modal fade" id="showRoll">
	  <div class="modal-dialog">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel"><center>Rolls from: <span id="date"></span></center></h4>
		  </div>
		  <div class="modal-body"><center>
		  
			
			<div class="row">
			<div id="rolls">
			</div>
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
	<script src="js/socket.io-1.3.5.js"></script>
    <script src="js/provably.js"></script>
  </body>
</html>