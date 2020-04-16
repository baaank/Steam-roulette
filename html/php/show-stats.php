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
$stmt=$db->prepare("SELECT * FROM `users` WHERE `steamid`=:steamid");
	$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
	$stmt->execute();
	$stat = $stmt->fetch();
$stats = array(
	'coinsplayed'=>$stat["coinsplayed"],
	'coinswon'=>$stat["coinswon"],
	'roulet'=>$stat["roulet"],
	'coinflip'=>$stat["coinflip"],
	'reffering'=>$stat["reffering"],
	);
echo jsonSuccess($stats);

?>