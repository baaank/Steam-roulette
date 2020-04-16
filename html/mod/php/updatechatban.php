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
$steamid = isset($_POST['steamid']) ? $_POST['steamid'] : null;
$state = isset($_POST['state']) ? $_POST['state'] : null;
if($state == 1)
{
	$action = "Mod is banning from chat user ".$steamid;
}
else
{
	$action = "Mod is unbanning from chat user ".$steamid;
}

$stmt = $db->prepare('INSERT INTO `adminlogs` (`steamid`, `action`, `date`) VALUES (:steamid, :action, UNIX_TIMESTAMP())');
		$stmt->bindValue(":steamid", $_SESSION['steamid']);
		$stmt->bindValue(":action", $action);
		$stmt->execute();
$stmt = $db->prepare('SELECT * FROM users WHERE steamid=:steamid');
		$stmt->bindValue(":steamid", $steamid);
		$stmt->execute();
		$user = $stmt->fetch();
if($user["admin"]==1 || $user["admin"]==2)
{
	return;
}
$stmt = $db->prepare('UPDATE users SET chatban=:chatban WHERE steamid=:steamid');
		$stmt->bindValue(":chatban", $state);
		$stmt->bindValue(":steamid", $steamid);
		$stmt->execute();
echo jsonSuccess(1);
?>