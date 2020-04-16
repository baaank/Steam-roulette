<?php
# en.php

require_once("phpfastcache/phpfastcache.php");
phpFastCache::setup("storage","files");

function getSteamAPIKey() {
		$key = '';
		return $key;
}

function getUserInfo($steamId) {
	return getSteamProfileInfoForSteamID(getUserStr($steamId), $steamId);
}

function getUserStr($steamId) {
	$cache = phpFastCache('files');
	$chatAPIKey = getSteamAPIKey();
	$url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$chatAPIKey&steamids=$steamId";
	$usersInfoStr = $cache->get($steamId);
	if($usersInfoStr == null) {
		$usersInfoStr = file_get_contents($url);
		$cache->set($steamId, $usersInfoStr, 10);
	}
	return $usersInfoStr;
}

function getItemPrice($itemname) {
	$cache = phpFastCache('files');
	$url = "http://ipayforpixels.eu/hdf.php?item=" . $itemname;
	$itemInfo = $cache->get($itemname);
	if($itemInfo == null) {
		$itemInfo = file_get_contents($url);
		$cache->set($itemname, $itemInfo, 86400);
	}
	return $itemInfo;
}

function getDB() {
	$dbHost = "127.0.0.1";
	$db     = "";
	$dbUser = "";
	$dbPass = "";

	$db = new PDO("mysql:host=$dbHost;dbname=$db;charset=utf8", $dbUser, $dbPass);
	return $db;
}

function getSteamProfileInfoForSteamID($allUsersInfoStr, $steamIDToFind) {
	$allUsersInfo = json_decode($allUsersInfoStr, true);
	$players = $allUsersInfo['response']['players'];

	foreach ($players as $player) {
		$steamID = $player['steamid'];
		$player['personaname'] = strip_tags($player['personaname']);

		if ($steamIDToFind === $steamID) {
			return $player;
		}
	}

	# If the user is not found, then return false
	return false;
}
function renam($name){
	$name = strip_tags($name);
    $name = str_replace(".com","",$name);
    $name = str_replace(".Com","",$name);
    $name = str_replace(".COM","",$name);
    $name = str_replace(".org","",$name);
    $name = str_replace(".Org","",$name);
    $name = str_replace(".ORG","",$name);
    $name = str_replace(".net","",$name);
    $name = str_replace(".Net","",$name);
    $name = str_replace(".NET","",$name);
	return $name;}
function getChatSteamProfileInfoForSteamID($allUsersInfoStr, $steamIDToFind) {
	$allUsersInfo = json_decode($allUsersInfoStr, true);
	$players = $allUsersInfo['response']['players'];

	foreach ($players as $player) {
		$steamID = $player['steamid'];
		$player['personaname'] = htmlentities($player['personaname']);

		if ($steamIDToFind === $steamID) {
			$p1 = array();
			$p1["personaname"] = $player["personaname"];
			$p1["avatarfull"] = $player["avatarfull"];
			$p1["profileurl"] = $player["profileurl"];
			$p1["steamid"] = $player["steamid"];
			return $p1;
		}
	}

	# If the user is not found, then return false
	return false;
}

function jsonSuccess($data) {
	return json_encode(array('success' => 1, 'data' => $data));
}

function jsonErr($errMsg) {
	return json_encode(array('success' => 0, 'errMsg' => $errMsg));
}

function postVar($varName) {
	$var = isset($_POST[$varName]) ? $_POST[$varName] : null;

	if (is_null($var) || strlen($var) === 0) {
		return null;
	} else {
		return $var;
	}
}

function getVar($varName) {
	$var = isset($_GET[$varName]) ? $_GET[$varName] : null;

	if (is_null($var) || strlen($var) === 0) {
		return null;
	} else {
		return $var;
	}
}

function microtime_int()
{
    list($usec, $sec) = explode(" ", microtime());
    return ((int)$usec + (int)$sec);
}
?>
