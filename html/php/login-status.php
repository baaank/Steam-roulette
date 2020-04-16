<?php
# en.php

session_start();

include 'default.php';
include 'steamauth/userInfo.php';

$db = getDB();

$steamID = isset($_SESSION['steamid']) ? $_SESSION['steamid'] : null;

$loginStatus = !is_null($steamID) && isset($steamID) ? 1 : 0;
$alert = 0;
$alertMsg = 0;
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="sitealert"');
			$stmt->execute();
			$alert = $stmt->fetch();
if($alert[0]==1)
{
	$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="sitealertmsg"');
			$stmt->execute();
			$alertMsg = $stmt->fetch();
}
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="rouletalert"');
			$stmt->execute();
			$rouletalert = $stmt->fetch();
if($rouletalert[0]==1)
{
	$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="rouletalertmsg"');
			$stmt->execute();
			$rouletalertmsg = $stmt->fetch();
}
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="coinflipalert"');
			$stmt->execute();
			$coinflipalert = $stmt->fetch();
if($coinflipalert[0]==1)
{
	$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="coinflipalertmsg"');
			$stmt->execute();
			$coinflipalertmsg = $stmt->fetch();
}
if ($loginStatus === 1) {
	$stmt = $db->prepare('SELECT * FROM users WHERE `steamid`=:steamid');
			$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
			$stmt->execute();
			$user = $stmt->fetch();
	if($user==null)
		{
			$stmt = $db->prepare('INSERT INTO users (steamid) VALUES (:steamid)');
				$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
				$stmt->execute();
		}
		$name = $_SESSION['steam_personaname'];
		$name = renam($name);
	$data = array(
		'loginStatus' => $loginStatus,
		'steamid' => $_SESSION['steamid'],
		'coins' => $user["coins"],
		'tradelink' => $user["tradelink"],
		'image' => $_SESSION['steam_avatarfull'],
		'name' => $name,
		'alert' => $alert,
		'alertMsg' => $alertMsg,
		'refCode' => $user['refcode'],
		'usersRef' => $user["usersref"],
		'coinsEarned' => $user["reffering"],
		'coinflipalert' => $coinflipalert,
		'coinflipalertmsg' => $coinflipalertmsg,
		'rouletalert' => $rouletalert,
		'rouletalertmsg' => $rouletalertmsg,
	);
	echo jsonSuccess($data);
} else {
	$data = array(
		'loginStatus' => $loginStatus,
		'alert' => $alert,
		'alertMsg' => $alertMsg,
	);
	echo jsonSuccess($data);
}


?>
