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
if($admin != 2)
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/index.php");
	exit();
}	


$image = isset($_POST['image']) ? $_POST['image'] : null;
$name = isset($_POST['name']) ? $_POST['name'] : null;
$value = isset($_POST['value']) ? $_POST['value'] : null;
$totalcoins = isset($_POST['totalcoins']) ? $_POST['totalcoins'] : null;
$endtime = isset($_POST['endtime']) ? $_POST['endtime'] : null;

$stmt = $db->prepare('SELECT * FROM `giveaways` WHERE `status`=1');
		$stmt->execute();
		$active = $stmt->fetchAll();
		
if(count($active) ==4)
{
	return;
}
		
$stmt = $db->prepare('INSERT INTO `giveaways` (`name`, `image`, `value`, `totalCoins`, `timeStart`, `timeEnd`, `status`) VALUES (:name, :image, :value, :totalcoins, UNIX_TIMESTAMP(), :endtime, 1)');
		$stmt->bindValue(":name", $name);
		$stmt->bindValue(":image", $image);
		$stmt->bindValue(":value", $value);
		$stmt->bindValue(":totalcoins", $totalcoins);
		$stmt->bindValue(":endtime", $endtime);
		$stmt->execute();
?>