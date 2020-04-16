<?php
session_start();

include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
$counter = 0;
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$stmt = $db->prepare('SELECT `id`, `image`, `name`, `value`, `totalCoins`, `coins`, `timeStart`, `timeEnd` FROM giveaways WHERE `status`=1 ORDER BY `timeEnd` DESC');
			$stmt->execute();
			$giveawaysActive = $stmt->fetchAll();
$stmt = $db->prepare('SELECT * FROM giveaways WHERE `status`=2 ORDER BY `timeEnd` DESC LIMIT 3');
			$stmt->execute();
			$giveawaysPast = $stmt->fetchAll();
foreach($giveawaysActive as $active)
{
	$stmt = $db->prepare('SELECT SUM(coins) FROM giveawayentries WHERE `steamid`=:steamid AND `id`=:id');
			$stmt->bindValue(":steamid", $_SESSION['steamid']);
			$stmt->bindValue(":id", $active["id"]);
			$stmt->execute();
			$coins = $stmt->fetch();
	$arr = array(
		"id"=>$active["id"],
		"image"=>$active["image"],
		"name"=>$active["name"],
		"value"=>$active["value"],
		"totalCoins"=>$active["totalCoins"],
		"coins"=>$active["coins"],
		"timeStart"=>$active["timeStart"],
		"timeEnd"=>$active["timeEnd"],
		"userTickets"=>$coins[0]
	);
	$giveawaysAct[$counter]=$arr;
	$counter++;
}
$counter = 0;
$apikey=getSteamAPIKey();
foreach($giveawaysPast as $past)
{
	$userstr = $past["winner"];
	$usersInfoStr = file_get_contents("http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=$apikey&steamids=$userstr");
	$str = json_decode($usersInfoStr);
	$name = $str->response->players[0]->personaname;
	$name = renam($name);
	$arr = array(
		"id"=>$past["id"],
		"image"=>$past["image"],
		"name"=>$past["name"],
		"value"=>$past["value"],
		"totalCoins"=>$past["totalCoins"],
		"coins"=>$past["coins"],
		"timeStart"=>$past["timeStart"],
		"timeEnd"=>$past["timeEnd"],
		"winnerimg"=>$str->response->players[0]->avatarfull,
		"winnername"=>$name,
	);
	$giveawaysPas[$counter]=$arr;
	$counter++;
}
$giveaways=array(
	"active" => $giveawaysAct, 
	"past" =>  $giveawaysPas
	);
echo jsonSuccess($giveaways);

?>