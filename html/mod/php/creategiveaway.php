<?php
session_start();
include '../../php/default.php';
include '../../php/SteamAuthentication/steamauth/userInfo.php';
$db = getDB();	
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}		
$stmt = $db->prepare('SELECT * FROM `users` WHERE `steamid`=:steamid');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$admin = $stmt->fetch()["admin"];
if($admin != 2 && $admin != 1)
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/index.php");
	exit();
}	


$image = isset($_POST['image']) ? $_POST['image'] : null;
$name = isset($_POST['name']) ? $_POST['name'] : null;
$value = isset($_POST['value']) ? $_POST['value'] : null;
$totalcoins = isset($_POST['totalcoins']) ? $_POST['totalcoins'] : null;
$endtime = isset($_POST['endtime']) ? $_POST['endtime'] : null;
$name = strip_tags($name);
$image = strip_tags($image);
$value = strip_tags($value);
$totalcoins = strip_tags($totalcoins);
$endtime = strip_tags($endtime);
$action = "Mod is creating giveaway. Item name: ".$name.", item value: ".$value.", total coins: ".$totalcoins." end time(in unixtimestamp): ".$endtime;
$stmt = $db->prepare('INSERT INTO `adminlogs` (`steamid`, `action`, `date`) VALUES (:steamid, :action, UNIX_TIMESTAMP())');
		$stmt->bindValue(":steamid", $_SESSION['steamid']);
		$stmt->bindValue(":action", $action);
		$stmt->execute();

$stmt = $db->prepare('INSERT INTO `giveaways` (`name`, `image`, `value`, `totalCoins`, `timeStart`, `timeEnd`, `status`) VALUES (:name, :image, :value, :totalcoins, UNIX_TIMESTAMP(), :endtime, 1)');
		$stmt->bindValue(":name", $name);
		$stmt->bindValue(":image", $image);
		$stmt->bindValue(":value", $value);
		$stmt->bindValue(":totalcoins", $totalcoins);
		$stmt->bindValue(":endtime", $endtime);
		$stmt->execute();
?>