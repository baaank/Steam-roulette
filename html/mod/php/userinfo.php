<?php
include("../../php/default.php");
$db = getDB();
$steamid = isset($_POST['steamid']) ? $_POST['steamid'] : null;
$apikey=getSteamAPIKey();
$usersInfoStr = file_get_contents("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$apikey&steamids=$steamid");
$str = json_decode($usersInfoStr);
$stmt = $db->prepare('SELECT * FROM users WHERE steamid=:steamid');
			$stmt->bindValue(":steamid", $steamid);
			$stmt->execute();
			$userDB = $stmt->fetch();

	
$array = array(
		"avatar" => $str->response->players[0]->avatarfull,
		"name" => $str->response->players[0]->personaname,
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