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
$botid = isset($_POST['botid']) ? $_POST['botid'] : null;
$stmt = $db->prepare('SELECT * FROM bots WHERE id=:botid');
		$stmt->bindValue(":botid", $botid);
		$stmt->execute();
		$botstatus = $stmt->fetch();
$status = 0;
if($botstatus["status"] == 0)
{
	$status = 1;
}
else
{
	$status = 0;
}
$stmt = $db->prepare('UPDATE bots SET status=:status WHERE id=:botid');
		$stmt->bindValue(":status", $status);
		$stmt->bindValue(":botid", $botid);
		$stmt->execute();
echo jsonSuccess(1);
?>