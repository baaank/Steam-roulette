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
$users;
$counter = 0;

$steamid = isset($_POST['steamid']) ? $_POST['steamid'] : null;
$stmt = $db->prepare('SELECT * FROM `adminlogs` WHERE steamid=:steamid ORDER BY date DESC');
			$stmt->bindValue(":steamid", $steamid);
			$stmt->execute();
			$settingsDB = $stmt->fetchAll();
			
echo jsonSuccess($settingsDB);
?>