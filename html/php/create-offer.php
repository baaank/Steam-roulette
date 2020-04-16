<?php
session_start();

include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
$items = isset($_POST['items']) ? $_POST['items'] : null;
$botid = isset($_POST['botid']) ? $_POST['botid'] : null;
$itemstring ="";
$coinsNeeded = 0;
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
$stmt = $db->prepare('SELECT * FROM depositoffers WHERE `steamid`=:steamid AND (status=2 OR status=1)');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$depositoffers = $stmt->fetchAll();
$stmt = $db->prepare('SELECT * FROM withdrawoffers WHERE `steamid`=:steamid AND (status=2 OR status=1)');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$withdrawoffers = $stmt->fetchAll();
		
if((count($depositoffers)+count($withdrawoffers))>=4)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Too much offers already, max is 4 active offers'));
	return;
}
$stmt = $db->prepare('SELECT * FROM users WHERE `steamid`=:steamid');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$tradelink = $stmt->fetch()["tradelink"];
$stmt = $db->prepare('SELECT * FROM users WHERE `steamid`=:steamid');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->execute();
		$coins = $stmt->fetch()["coins"];
if(!$tradelink)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'No tradelink'));
	return;
}
$stmt = $db->prepare('SELECT * FROM bots WHERE `status`=1');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$bots = $stmt->fetchAll();
$botids = 0;;
foreach($bots as $bot)
{
	if($bot["id"]==$botid)
	{
		$botids=$bot["id"];
	}
}
if($botids == 0)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Bot is offline, try again in few minutes.'));
	return;
}
$stmt = $db->prepare('SELECT * FROM `bot'.$botids.'`');
		$stmt->execute();
		$inventory = $stmt->fetchAll();
foreach ($inventory as $inv)		
{
	foreach ($items as $it) {
		if($it==$inv["assetId"]) {
			if($inv["status"]==2)
			{
				echo jsonSuccess(array('valid' => 0, 'errMsg' => 'One of the items is not available anymore'));
				return;
			}
					
			$price = 0;
			$itemname = $inv["item_name"];
			$itemname = str_replace("★","?",$itemname);
			$stmt = $db->prepare('SELECT * FROM prices WHERE `name`=:name');
				$stmt->bindValue(':name', $itemname);
				$stmt->execute();
				$price = $stmt->fetch();
			if($price[0]!=null)
			{
				$coinsNeeded += $price["price"];
				$itemstring = $itemstring.$it.';';	
				$itemcount++;
			}
		}
	}
}


if($coins < $coinsNeeded)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Not enough coins!'));
	return;	
}
if(count($items) < 21 && $itemcount > 0)
{
	foreach ($items as $it) {
		$stmt = $db->prepare('UPDATE `bot'.$botids.'` SET `status`=2 WHERE `assetId`=:id');
			$stmt->bindValue(':id', $it);
			$stmt->execute();
	}
	$stmt = $db->prepare('INSERT INTO withdrawoffers (steamid, items, date, status, coins, bot) VALUES (:steamid, :items, :date, 1, :coins, :botid)');
			$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
			$stmt->bindValue(':items', $itemstring);
			$stmt->bindValue(':coins', $coinsNeeded);
			$stmt->bindValue(':botid', $botids);
			$stmt->bindValue(':date', microtime_int());
			$stmt->execute();
			
	$stmt = $db->prepare('UPDATE users SET coins = `coins`-:coin WHERE steamid = :id');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->bindValue(':coin', $coinsNeeded);
		$stmt->execute();
	$coin = $coins-$coinsNeeded;
	echo jsonSuccess('Your offer will be ready soon.');
}
else
{
	echo jsonSuccess('Too many items! 20 items at once is max.');
	return;
}
?>