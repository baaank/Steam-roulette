<?php
session_start();

include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
$itemcount = 0;
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
if(isset($_SESSION['steamid'])==false)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Log in first.'));
	return;
}
$stmt = $db->prepare('SELECT * FROM bots WHERE `status`=1 AND `items` < 900 ORDER BY items ASC LIMIT 1');
		$stmt->execute();
		$bots = $stmt->fetch();
if(!$bots)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'No bot available for deposit. Try again in a while.'));
	return;
}
$stmt = $db->prepare('SELECT * FROM depositoffers WHERE `steamid`=:steamid AND (status=2 OR status=1)');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$depositoffers = $stmt->fetchAll();
$stmt = $db->prepare('SELECT * FROM withdrawoffers WHERE `steamid`=:steamid AND (status=2 OR status=1)');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$withdrawoffers = $stmt->fetchAll();
$stmt = $db->prepare('SELECT * FROM users WHERE `steamid`=:steamid');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$tradelink = $stmt->fetch()["tradelink"];
if(!$tradelink)
{
	echo jsonSuccess('No tradelink');
	return;
}
if((count($depositoffers)+count($withdrawoffers))>=4)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Too much offers already, max is 4 active offers'));
	return;
}
$items = isset($_POST['items']) ? $_POST['items'] : null;
$itemstring ="";

$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="mindeposit"');
			$stmt->execute();
			$min = $stmt->fetch()[0];
$inventory = json_decode(file_get_contents("https://steamcommunity.com/profiles/".$_SESSION['steamid']."/inventory/json/730/2"), true);
foreach ($inventory['rgInventory'] as $inv) {
	foreach ($items as $it) {
		if($it==$inv["id"]) {
			foreach ($inventory['rgDescriptions'] as $value) {
				if($inv["classid"] == $value["classid"]) {
					if($value["marketable"]==1 && $value["appid"]==730 && $value["tradable"]==1)
					{
						$price = 0;
						$itemname = $value["market_hash_name"];
						$itemname = str_replace("★","?",$itemname);
						$stmt = $db->prepare('SELECT * FROM prices WHERE `name`=:name');
							$stmt->bindValue(':name', $itemname);
							$stmt->execute();
							$item = $stmt->fetch();
						if($item[0]!=null && $item["price"] > $min)
						{
							$coinsNeeded += $item["price"];
							$itemstring = $itemstring.$it.';';
							$itemcount++;							
						}
					}
				}
			}
		}
	}
}


if(count($items) < 21 && $itemcount > 0)
{
	$stmt = $db->prepare('INSERT INTO depositoffers (steamid, items, date, status, coins, bot) VALUES (:steamid, :items, :date, 1, :coins, :botid)');
			$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
			$stmt->bindValue(':items', $itemstring);
			$stmt->bindValue(':coins', $coinsNeeded);
			$stmt->bindValue(':botid', $bots["id"]);
			$stmt->bindValue(':date', microtime_int());
			$stmt->execute();
}
else
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Too many items! 20 items at once is max.'));
	return;
}

require_once('otphp/lib/otphp.php');
$totp = new \OTPHP\TOTP("OWFWWLCS7KM5GUTG");
$price = 0;
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="mindeposit"');
			$stmt->execute();
			$min = $stmt->fetch()[0];
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
					$notinclude = 0;
					foreach ($items as $it) {
						if($it == $inv["id"])
						{
							$notinclude = 1;
						}
					}
					if($inv["classid"] == $value["classid"] && $notinclude == 0)
					{
						$array = array(
							"name" => $value["market_hash_name"],
							"id" => $inv["id"],
							"price" => $item["price"],
							"image" => $value["icon_url"],
						);
						$items2[$counter]=$array;
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
					$notinclude = 0;
					foreach ($items as $it) {
						if($it == $inv["id"])
						{
							$notinclude = 1;
						}
					}
					if($inv["classid"] == $value["classid"] && $notinclude == 0)
					{
						$array = array(
							"name" => $value["market_hash_name"],
							"id" => $inv["id"],
							"price" => $price,
							"image" => $value["icon_url"],
						);
						$items2[$counter]=$array;
						$counter++;
					}
					
				}
			}
		}
	}
}
$stmt = $db->prepare('DELETE FROM usersinv WHERE steamid=:steamid');
		$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
		$stmt->execute();
		$exists = $stmt->fetch();
$stmt = $db->prepare('INSERT INTO usersinv (steamid, inventory) VALUES (:steamid, :inventory)');
		$stmt->bindValue(":inventory", jsonSuccess($items2));
		$stmt->bindValue(":steamid", $_SESSION['steam_steamid']);
		$stmt->execute();
echo jsonSuccess($items2);
?>