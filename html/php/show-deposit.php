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
$stmt=$db->prepare("SELECT * FROM `depositoffers` WHERE `steamid`=:steamid AND `status`=2 ORDER BY `date` DESC");
	$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
	$stmt->execute();
	$deposit = $stmt->fetchAll();

$counter = 0;
foreach($deposit as $offer){
	if(strlen($offer["msg"])>0)
	{
		$array = array(
		'offerId'=>$offer["offerId"],
		'msg'=>$offer["msg"],
		'coins'=>$offer["coins"],
		);
		$offers[$counter]=$array;
		$counter++;
	}
}
echo jsonSuccess($offers);

?>