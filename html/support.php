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
	<h4>If you have any problems or suggestions, <br>please open a support ticket.</h4>
	<br><a id="openticket" class="btn btn-primary">Open ticket</a>
	</center>
	</div>
	<div class="jumbotron">
	<center>
	<h4>Your tickets</h4>
	<table class="table the-table table-bordered">
				<thead>
					<tr class="info">
						<th style="width: 10%">
							Status
						</th>
						<th style="width: 55%">
							Subject
						</th>
						<th style="width: 10%">
							Replies
						</th>
						<th style="width: 15%">
							Date of last reply
						</th>
						<th style="width: 10%">
							#
						</th>
					</tr>
				</thead>
				<tbody id="tickets">
				</tbody>
			</table>
			</center>
	</div>
	</div>
	<div class="col-xs-0 col-md-2"></div>
	</div>
	<div class="modal fade" id="showticket" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	  <div class="modal-dialog" role="document">
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
	<div class="modal fade" id="openticket-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
	  <div class="modal-dialog" role="document">
		<div class="modal-content">
		  <div class="modal-header">
			<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
			<h4 class="modal-title" id="myModalLabel">Open a ticket</h4>
		  </div>
		  <div class="modal-body"><center>
		
			<strong>Subject:</strong><br>
			<textarea id="subject-input" rows="2" cols="65" maxlength="100" placeholder="Max length: 100 characters" style="width: 100%"></textarea>
			<br>
			<strong>Text:</strong><br>
			<textarea id="text-input" rows="5" cols="65" maxlength="500" placeholder="Max length: 500 characters" style="width: 100%"></textarea>
			<br><br>
			<button id="submit-btn" type="button" class="btn btn-primary" data-dismiss="modal">Submit</button>
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
    <script src="js/support.js"></script>
  </body>
</html>