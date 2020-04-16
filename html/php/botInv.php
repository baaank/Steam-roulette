<?php
session_start();
include 'default.php';
include 'SteamAuthentication/steamauth/userInfo.php';
$db = getDB();
$counter = 0;
$counterbot = 0;
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$stmt = $db->prepare('SELECT * FROM bots WHERE `status`=1');
			$stmt->execute();
			$bots = $stmt->fetchAll();
$inventories= array();
foreach ($bots as $bot)
{
	$stmt = $db->prepare('SELECT * FROM `bot'.$bot["id"].'` WHERE `status`=1');
			$stmt->execute();
			$items = $stmt->fetchAll();
			
	$inventory = array();
		foreach ($items as $item)
		{
			$itemname = $item["item_name"];
			$itemname = str_replace("★","?",$itemname);
			$stmt = $db->prepare('SELECT `price` FROM `prices` WHERE `name`=:name');
			$stmt->bindValue(':name', $itemname);
			$stmt->execute();
			$prices = $stmt->fetch();
			$array = array(
					"name" => $item["item_name"],
					"id" => $item["assetId"],
					"price" => $prices["price"],
					"image" => $item["icon_url"],
				);
			$inventory[$counter]=$array;
			$counter++;
		}
		$counter = 0;
		$arr = array(
					"botid" => $bot["id"],
					"inventory" => $inventory,
				);
		$inventories[$bot["id"]] = $arr;
		$counterbot++;
}

echo jsonSuccess($inventories);
?>