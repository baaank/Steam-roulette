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

$ticketid = isset($_POST['ticketid']) ? $_POST['ticketid'] : null;

$action = "Mod is closing support ticked. Ticketid: ".$ticketid;
$stmt = $db->prepare('INSERT INTO `adminlogs` (`steamid`, `action`, `date`) VALUES (:steamid, :action, UNIX_TIMESTAMP())');
		$stmt->bindValue(":steamid", $_SESSION['steamid']);
		$stmt->bindValue(":action", $action);
		$stmt->execute();
$stmt = $db->prepare('UPDATE support SET status=2 WHERE id=:ticketid');
		$stmt->bindValue(':ticketid', $ticketid);
		$stmt->execute();
echo jsonSuccess(1);
?>