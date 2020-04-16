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
if($steamid == null)
{
	$stmt = $db->prepare('SELECT `status` FROM settings WHERE `name`="giveawaybotid"');
				$stmt->execute();
				$settingsDB = $stmt->fetch()["status"];
	echo jsonSuccess($settingsDB);
}
else
{
	$stmt = $db->prepare('UPDATE `settings` SET `status`=:botid WHERE `name`="giveawaybotid"');
				$stmt->bindValue(":botid", $steamid);
				$stmt->execute();
}
?>