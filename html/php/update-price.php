<?php
include 'default.php';
$db = getDB();

require_once('otphp/lib/otphp.php');
$totp = new \OTPHP\TOTP("");

$price = 0;

$prices = json_decode(file_get_contents("https://bitskins.com/api/v1/get_all_item_prices/?api_key=cc6e5c55-1bc0-4720-bca1-de8a9340f0d7&code=".$totp->now()."&names=".$name."&delimiter=!END!"), true);
$price = $prices["prices"];
foreach($price as $item)
{
	$value = $item["price"]*1000;
	$stmt = $db->prepare('INSERT INTO `prices` (`name`, `price`, `lastUpdated`) VALUES (:name,:price,:time)
			  ON DUPLICATE KEY UPDATE name=:name;
			UPDATE `prices` SET `price`=:price, `lastUpdated`=:time WHERE `price`=:price;');
		$stmt->bindValue(':name', $item["market_hash_name"]);
		$stmt->bindValue(':price', $value);
		$stmt->bindValue(':time', microtime_int());
		$stmt->execute();
}
echo 'Success';
?>