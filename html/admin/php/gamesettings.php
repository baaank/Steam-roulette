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
$stmt = $db->prepare('SELECT * FROM settings');
			$stmt->execute();
			$settingsDB = $stmt->fetchAll();
			
for ($i = 0; $i < 11; $i++) {
    $array = array(
		"parameter" => $settingsDB[$i]["name"],
		"status" => $settingsDB[$i]["status"],
	);
	$settings[$i]=$array;
}
echo jsonSuccess($settings);
?>