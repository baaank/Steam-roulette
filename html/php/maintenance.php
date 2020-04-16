<?php
session_start();

include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="maintenance"');
		$stmt->execute();
		$maintenance = $stmt->fetch()[0];
if($maintenance == 1)
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/maintenance.php");
	exit();
}
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
?>