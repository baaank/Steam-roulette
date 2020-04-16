<div class="navbar-header">

	 <a class="navbar-brand" href="index.php">Roulet</a>
	 <a class="navbar-brand" href="provablyfair.php">Provably fair</a>
	 <a class="navbar-brand" href="coinflip.php">Coinflip</a>
	 <a class="navbar-brand" href="deposit.php">Deposit</a>
	 <a class="navbar-brand" href="withdraw.php">Withdraw</a>
	 <a class="navbar-brand" href="giveaways.php">Giveaways</a>
	 <a class="navbar-brand" href="refferals.php">Refferals</a>
	 <a class="navbar-brand" href="myprofile.php">My stats</a>
	 <a class="navbar-brand" href="support.php">Support</a>
</div>
<?php include 'php/maintenance.php';
?>
<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
	
<ul class="nav navbar-nav navbar-right">

	<li id="login"><div class="navbar-brand"><span style='position: relative; bottom: 15px; display: inline-block;'>
		<a class="navbar-brand" href="https://steamcommunity.com/openid/login?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.mode=checkid_setup&openid.return_to=http%3A%2F%2F178.19.96.186%2Fphp%2Flogin.php&openid.realm=http%3A%2F%2F178.19.96.186&openid.ns.sreg=http%3A%2F%2Fopenid.net%2Fextensions%2Fsreg%2F1.1&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select" style="position: relative;top: -10px;">
		<img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png" class="center-block sign-in" style="position:relative;top:10px;">
		</a></span>
		</div>
		</div>
	</li>
</ul>
<div class="modal fade" id="tradelink-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Trade link</h4>
      </div>
	  <div class="modal-body"><center>
	  <div id="tlink">
        <strong>Please provide your tradelink.</strong></div>
		<br><input type="text" id="tradelink" placeholder="Copy here your tradelink" style="width: 565px; height: 30px;">
		</center>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-success" id="tradelinksave">Save changes</button>
      </div>
    </div>
  </div>
</div>

<div class="modal fade" id="offers-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">Your current offers:</h4>
      </div>
	  <div class="modal-body"><center>
	
        <strong>Deposit offers:</strong><br>
		
		<span id="depositOffers"></span>
		<br>
		
        <strong>Withdraw offers:</strong><br>
		
		<span id="withdrawOffers"></span>
		<br>
		</center>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>
