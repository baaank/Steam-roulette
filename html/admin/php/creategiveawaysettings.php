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
$stmt = $db->prepare('SELECT * FROM settings WHERE name="giveawaybotid"');
			$stmt->execute();
			$botid = $stmt->fetch()["status"];
			
$inventory = json_decode(file_get_contents("https://steamcommunity.com/profiles/$botid/inventory/json/730/2"), true);

require_once('../../php/otphp/lib/otphp.php');
$totp = new \OTPHP\TOTP("OWFWWLCS7KM5GUTG");
$price = 0;
$counter = 0;
foreach ($inventory['rgDescriptions'] as $value) {
	if($value["marketable"]==1 && $value["appid"]==730 && $value["tradable"]==1)
	{
		$price = 0;
		$stmt = $db->prepare('SELECT * FROM prices WHERE `name`=:name');
			$stmt->bindValue(':name', $value["market_hash_name"]);
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
		if($item["lastUpdated"]+86400 < microtime_int())
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
			$stmt = $db->prepare('UPDATE prices SET price = :price, lastUpdated = :time WHERE name = :name');
				$stmt->bindValue(':name', $value["market_hash_name"]);
				$stmt->bindValue(':time', microtime_int());
				$stmt->bindValue(':price', $price);
				$stmt->execute();
		}
		if($price == 0)
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
		else
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
echo jsonSuccess($items);
?>