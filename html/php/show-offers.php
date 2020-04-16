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
$stmt=$db->prepare("SELECT * FROM `withdrawoffers` WHERE `steamid`=:steamid ORDER BY `date` DESC");
	$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
	$stmt->execute();
	$withdraw = $stmt->fetchAll();
$stmt=$db->prepare("SELECT * FROM `depositoffers` WHERE `steamid`=:steamid ORDER BY `date` DESC");
	$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
	$stmt->execute();
	$deposit = $stmt->fetchAll();

$offers = array(
	'withdraw'=>$withdraw,
	'deposit'=>$deposit,
	);
echo jsonSuccess($offers);

?>