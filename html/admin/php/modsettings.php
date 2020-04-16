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
$stmt = $db->prepare('SELECT * FROM users WHERE admin=1');
			$stmt->execute();
			$settingsDB = $stmt->fetchAll();
$userstr;
foreach($settingsDB as $user){	
	$userstr = $userstr.$user["steamid"].";";		
	
}
$apikey=getSteamAPIKey();
$usersInfoStr = file_get_contents("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$apikey&steamids=$userstr");
$str = json_decode($usersInfoStr);
foreach($str->response->players as $user)
{
	$user->personaname = renam($user->personaname);
	$steamid = $user->steamid;
	$stmt = $db->prepare('SELECT * FROM users WHERE `steamid`=:steamid');
			$stmt->bindValue(':steamid', $steamid);
			$stmt->execute();
			$usersDB = $stmt->fetch();
	$array = array(
		"name" => $user->personaname,
		"steamid" => $user->steamid,
	);
	$users[$counter]=$array;
	$counter++;
}

echo jsonSuccess($users);
?>