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

$steamid = isset($_POST['steamid']) ? $_POST['steamid'] : null;
$coins = isset($_POST['coins']) ? $_POST['coins'] : null;

$stmt = $db->prepare('UPDATE users SET coins=:coins WHERE steamid=:steamid');
		$stmt->bindValue(":coins", $coins);
		$stmt->bindValue(":steamid", $steamid);
		$stmt->execute();
echo jsonSuccess(1);
?>