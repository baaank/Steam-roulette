<?php
session_start();
include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$refcode = isset($_POST['refcode']) ? $_POST['refcode'] : null;
$refcode = strip_tags($refcode);
$ownCSGO = 0;
$string = $_SESSION['steam_profileurl']."games/?xml=1";
$xml=simplexml_load_file($string) or die("Error: Cannot create object");
foreach($xml->games->game as $game)
{
	if($game->appID == 730)
	{
		$ownCSGO = 1;
	}
}

if($ownCSGO == 0)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You don`t have CS:GO in your library'));
	return;
}
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="refferalforcode"');
			$stmt->execute();
			$coins = $stmt->fetch()[0];
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="refferalforref"');
			$stmt->execute();
			$coinsfor = $stmt->fetch()[0];
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="refferalstatus"');
			$stmt->execute();
			$status = $stmt->fetch()[0];
if($status == 0){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Refferals are turned off'));
	return;
}
$stmt = $db->prepare('SELECT steamid FROM users WHERE `refcode` = :refcode');
		$stmt->bindValue(':refcode', $refcode);
		$stmt->execute();
		$steamid = $stmt->fetch();
		
		if($steamid[0] == null)
		{
			echo jsonSuccess(array('valid' => 0, 'errMsg' => 'The provided code was not valid.'));
			return;
		};
		
		if($steamid[0] == $_SESSION['steamid'])
		{
			echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You can`t use your own code!'));
			return;
		};

$stmt = $db->prepare('SELECT codeused FROM users WHERE steamid = :steamid');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$used = $stmt->fetch();
		
		if($used[0] > 0)
		{
			echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Code already has been used on this account.'));
			return;
		};
		
		
$stmt = $db->prepare('UPDATE users SET coins = `coins`+:coins, codeused = `codeused`+1 WHERE steamid = :steamid');
$stmt->bindValue(':steamid', $_SESSION['steamid']);
$stmt->bindValue(':coins', $coins);
$stmt->execute();

$stmt = $db->prepare('UPDATE users SET coins = `coins`+:coins, usersref = `usersref`+1, reffering = `reffering`+:coins WHERE steamid = :steamid');
$stmt->bindValue(':steamid', $steamid[0]);
$stmt->bindValue(':coins', $coinsfor);
$stmt->execute();
		
echo jsonSuccess($coins);
?>
