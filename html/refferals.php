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
	  <div class="jumbotron"><center>
				<h2>
					Your refferal code is:
				</h2>
				<p id="refferalCode">
				</p>
				<p>
					<a class="btn btn-primary btn-large" id="generateCode">Generate code</a> &nbsp <a class="btn btn-primary btn-large" id="useCode">Use code</a> <div id='tester'></div>
				</p>
				<br>
				<div class="alert alert-info" style="width: 300px"><center><strong>Users reffered: <span id="usersReffered"></span></strong><br>
				<strong>Coins earned: <span id="coinsEarned"></span></strong></center></div>
				
						
				</center>
				
			</div>
			
			</div>
	<div class="col-md-2"></div>
	
	
	<div class="modal fade" id="use-code" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	  <div class="modal-dialog" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel">Enter code to earn free coins</h4>
		  </div>
		  <div class="modal-body">
		   <div class="input-group">
			  <span class="input-group-addon" id="sizing-addon2">Code:</span>
			  <input type="text" id="refCode" class="form-control" placeholder="Refferal code here" aria-describedby="sizing-addon2">
			</div><br>
			  <center><a class="btn btn-success" id="submitCode">SUBMIT</a></center><br>
			  <p id="code-status"></p>
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
    <script src="js/refferals.js"></script>
  </body>
</html>