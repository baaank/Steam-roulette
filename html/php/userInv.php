<?php
session_start();

include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$stmt = $db->prepare('SELECT * FROM usersinv WHERE steamid=:steamid');
		$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
		$stmt->execute();
		$exists = $stmt->fetch();

$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="mindeposit"');
			$stmt->execute();
			$min = $stmt->fetch()[0];
if($exists)
{
	$invent = json_decode($exists["inventory"]);
	$countt = 0;
	foreach($invent->data as $item)
	{
		$stmt = $db->prepare('SELECT `price` FROM `prices` WHERE `name`=:name');
				$stmt->bindValue(':name', $item->name);
				$stmt->execute();
				$pr = $stmt->fetch();
		if($pr[0]>$min)
		{
			$array = array(
							"name" => $item->name,
							"id" => $item->id,
							"price" => $pr[0],
							"image" => $item->image,
						);
			
			$inven[$countt]=$array;
			$countt++;
		}
	}
	echo jsonSuccess($inven);
	fclose($f);
	return;
}
$counter = 0;
$items = array();
$inventory = json_decode(file_get_contents("https://steamcommunity.com/profiles/".$_SESSION['steam_steamid']."/inventory/json/730/2"), true);

require_once('otphp/lib/otphp.php');
$totp = new \OTPHP\TOTP("");
$price = 0;
foreach ($inventory['rgDescriptions'] as $value) {
	if($value["marketable"]==1 && $value["appid"]==730 && $value["tradable"]==1)
	{
		$price = 0;
		$itemname = $value["market_hash_name"];
		$itemname = str_replace("★","?",$itemname);
		$stmt = $db->prepare('SELECT * FROM prices WHERE `name`=:name');
			$stmt->bindValue(':name', $itemname);
			$stmt->execute();
			$item = $stmt->fetch();
		if($item[0]==null)
		{
			$name = urlencode($value["market_hash_name"]);
			$link = json_decode(@file_get_contents("http://steamcommunity.com/market/priceoverview/?currency=1&appid=730&market_hash_name=".$name));

			if($link == null)
			{
				$prices = json_decode(file_get_contents("https://bitskins.com/api/v1/get_item_price/?api_key=cc6e5c55-1bc0-4720-bca1-de8a9340f0d7&code=".$totp->now()."&names=".$name."&delimiter=!END!"), true);
				$price = $prices["data"]["prices"][0]["price"]*1000;
			}
			else
			{
				if($link->{'success'} == "0")
				{
					$prices = json_decode(file_get_contents("https://bitskins.com/api/v1/get_item_price/?api_key=cc6e5c55-1bc0-4720-bca1-de8a9340f0d7&code=".$totp->now()."&names=".$name."&delimiter=!END!"), true);
					$price = $prices["data"]["prices"][0]["price"]*1000;
				}
				else
				{
					$price=$link->{'lowest_price'};
					$price[strlen($price)] = 0.03;
					$price = str_replace("$","",$price);
					$price = $price*1000;
				}
			}				
			$stmt = $db->prepare('INSERT INTO prices (name, price) VALUES (:name, :price)');
				$stmt->bindValue(':name', $value["market_hash_name"]);
				$stmt->bindValue(':price', $price);
				$stmt->execute();
		}
		if($price == 0)
		{
			if($item["price"] > $min)
			{
				foreach ($inventory['rgInventory'] as $inv) {
					if($inv["classid"] == $value["classid"])
					{
						$array = array(
							"name" => $value["market_hash_name"],
							"id" => $inv["id"],
							"price" => $item["price"],
							"image" => $value["icon_url"],
						);
						$items[$counter]=$array;
						$counter++;
					}
				}
			}
		}
		else 
		{
			if($price > $min)
			{
				foreach ($inventory['rgInventory'] as $inv) {
					
					if($inv["classid"] == $value["classid"])
					{
						$array = array(
							"name" => $value["market_hash_name"],
							"id" => $inv["id"],
							"price" => $price,
							"image" => $value["icon_url"],
						);
						$items[$counter]=$array;
						$counter++;
					}
					
				}
			}
		}
	}
}

$stmt = $db->prepare('INSERT INTO usersinv (steamid, inventory) VALUES (:steamid, :inventory)');
		$stmt->bindValue(":inventory", jsonSuccess($items));
		$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
		$stmt->execute();

echo jsonSuccess($items);

?>