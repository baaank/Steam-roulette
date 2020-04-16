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

$giveawayid = isset($_POST['giveawayid']) ? $_POST['giveawayid'] : null;

$action = "Mod is restarting giveaway. Giveaway id: ".$giveawayid;
$stmt = $db->prepare('INSERT INTO `adminlogs` (`steamid`, `action`, `date`) VALUES (:steamid, :action, UNIX_TIMESTAMP())');
		$stmt->bindValue(":steamid", $_SESSION['steamid']);
		$stmt->bindValue(":action", $action);
		$stmt->execute();

$stmt = $db->prepare('UPDATE giveaways SET coins=0 WHERE id = :id');
		$stmt->bindValue(':id', $giveawayid);
		$stmt->execute();
$stmt = $db->prepare('DELETE FROM giveawayentries WHERE id = :id');
		$stmt->bindValue(':id', $giveawayid);
		$stmt->execute();
?>