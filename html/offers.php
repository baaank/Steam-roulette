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
	<div class="col-md-2 col-xs-0" ></div>
		<div class="col-md-8 col-xs-12">
			
			<div class="jumbotron" >
				<div class="row">
					<div class = " col-md-6">
						<center>Withdraw offers
							<table class="table table-bordered" style="width: 100%; margin-top: 20px">
								<thead>
									<tr>
										<th style="width: 15%; text-align: center">
											Offer ID
										</th>
										<th style="width: 55%; text-align: center">
											Message
										</th>
										<th style="width: 15%; text-align: center">
											Status
										</th>
										<th style="width: 15%; text-align: center">
											Value
										</th>
									</tr>
								</thead>
								<tbody id="withdrawoffers">
								</tbody>
							</table>
						</center>
					</div>
				<div class="col-md-6">
					<center>Deposit offers
							<table class="table table-bordered" style="width: 100%; margin-top: 20px">
								<thead>
									<tr>
										<th style="width: 15%; text-align: center">
											Offer ID
										</th>
										<th style="width: 55%; text-align: center">
											Message
										</th>
										<th style="width: 15%; text-align: center">
											Status
										</th>
										<th style="width: 15%; text-align: center">
											Value
										</th>
									</tr>
								</thead>
								<tbody id="depositoffers">
								
								</tbody>
							</table>
					</center>
				</div>
				</div>
			</div>
		</div>
		<div class="col-md-2 col-xs-0" ></div>
	</div>
	
	
</div>
<br><br>
    <script src="js/jquery.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
	<script src="js/socket.io-1.3.5.js"></script>
    <script src="js/offers.js"></script>

  </body>
</html>