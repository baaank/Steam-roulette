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
$apikey=getSteamAPIKey();
$usersInfoStr = file_get_contents("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$apikey&steamids=$steamid");
$str = json_decode($usersInfoStr);
$stmt = $db->prepare('SELECT * FROM users WHERE steamid=:steamid');
			$stmt->bindValue(":steamid", $steamid);
			$stmt->execute();
			$userDB = $stmt->fetch();

$name = $str->response->players[0]->personaname ;
$name = renam($name);
$array = array(
		"avatar" => $str->response->players[0]->avatarfull,
		"name" => $name,
		"steamid" => $str->response->players[0]->steamid,
		"profileurl" => $str->response->players[0]->profileurl,
		"tradelink" => $userDB["tradelink"],
		"refcode" => $userDB["refcode"],
		"reffered" => $userDB["usersref"],
		"refused" => $userDB["codeused"],
		"coins" => $userDB["coins"],
		"coinsplayed" => $userDB["coinsplayed"],
		"coinswon" => $userDB["coinswon"],
		"roulet" => $userDB["roulet"],
		"coinflip" => $userDB["coinflip"],
		"admin" => $userDB["admin"],
		"gameban" => $userDB["gameban"],
		"chatban" => $userDB["chatban"],
);
echo jsonSuccess($array);
?>