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

$giveawayid = isset($_POST['giveawayid']) ? $_POST['giveawayid'] : null;

$stmt = $db->prepare('DELETE FROM giveaways WHERE id = :id');
		$stmt->bindValue(':id', $giveawayid);
		$stmt->execute();
$stmt = $db->prepare('DELETE FROM giveawayentries WHERE id = :id');
		$stmt->bindValue(':id', $giveawayid);
		$stmt->execute();
?>