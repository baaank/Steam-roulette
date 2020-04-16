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
$state = isset($_POST['state']) ? $_POST['state'] : null;

$stmt = $db->prepare('UPDATE users SET chatban=:chatban WHERE steamid=:steamid');
		$stmt->bindValue(":chatban", $state);
		$stmt->bindValue(":steamid", $steamid);
		$stmt->execute();
echo jsonSuccess(1);
?>