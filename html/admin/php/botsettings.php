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
$settings;
$counter = 0;
$stmt = $db->prepare('SELECT * FROM bots');
			$stmt->execute();
			$settingsDB = $stmt->fetchAll();
foreach($settingsDB as $bot)
{
	$string = "http://steamcommunity.com/profiles/".$bot["steamid"]."/?xml=1";
	$xml=simplexml_load_file($string) or die("Error: Cannot create object");
	$state = (string) $xml->onlineState[0];
	$name = (string) $xml->steamID[0];
	$settingsDB[$counter]["state"] = $state;
	$settingsDB[$counter]["name"] = $name;
	$counter++;
}
echo jsonSuccess($settingsDB);
?>