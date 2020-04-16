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
$coins = isset($_POST['coins']) ? $_POST['coins'] : null;
$id = isset($_POST['id']) ? $_POST['id'] : null;


$stmt = $db->prepare('SELECT coins FROM users WHERE steamid = :id');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$balance = $stmt->fetch();
		
if($balance[0] < $coins){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You don`t have enough coins!'));
	return;
};
if($coins < 1){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Enter value bigger than 0!'));
	return;
}

$stmt = $db->prepare('SELECT status, coins, totalCoins FROM giveaways WHERE id = :id');
		$stmt->bindValue(':id', $id);
		$stmt->execute();
		$giveaway = $stmt->fetch();
		
if($giveaway[0] == null){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'No such giveaway!'));
	return;
};

if($giveaway["status"] == 2){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Giveaway already ended!'));
	return;
};

$limit = $giveaway["totalCoins"]/20;
if($coins > $limit){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Limit is '.$limit.' coins!' ));
	return;
}
$stmt = $db->prepare('SELECT SUM(coins) FROM giveawayentries WHERE `steamid`=:steamid AND `id`=:id');
			$stmt->bindValue(":steamid", $_SESSION['steamid']);
			$stmt->bindValue(":id", $id);
			$stmt->execute();
			$coinsin = $stmt->fetch()[0];
if($coinsin+$coins > $limit){
	$coinstodeposit = $limit-$coinsin;
	if($coinstodeposit == 0)
	{
		echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Limit is '.$limit.' coins in one giveaway. You already deposited '.$coinsin.' coins.' ));
	}
	else
	{
		echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Limit is '.$limit.' coins in one giveaway. You already deposited '.$coinsin.' coins. You can deposit '.$coinstodeposit.' coins.' ));
	}
	return;
}
$totalCoins = $giveaway["totalCoins"];
$currentCoins = $giveaway["coins"];

if($currentCoins+$coins>$totalCoins)
{
	$coins = $totalCoins-$currentCoins;
}



$stmt = $db->prepare('UPDATE users SET coins = `coins`-:coins WHERE steamid = :steamid');
$stmt->bindValue(':steamid', $_SESSION['steamid']);
$stmt->bindValue(':coins', $coins);
$stmt->execute();

$stmt = $db->prepare('UPDATE giveaways SET coins = `coins`+:coins WHERE id = :id');
	$stmt->bindValue(':id', $id);
	$stmt->bindValue(':coins', $coins);
	$stmt->execute();

	
$stmt = $db->prepare('INSERT INTO `giveawayentries` (`id`, `steamid`, `coins`, `from`, `to`) VALUES (:givid, :steamid, :coins, :from, :to)');
	$stmt->execute(array(
                ":givid"  => $id,
                ":steamid"       =>  $_SESSION['steamid'],
				":coins"  => $coins,
                ":from"       =>  $currentCoins+1,
				":to"  => $currentCoins+$coins,
            ));

if($currentCoins+$coins>=$totalCoins)
{
	$winningticket = mt_rand(1,$totalCoins);
	$stmt = $db->prepare('SELECT `steamid` FROM `giveawayentries` WHERE `from` <= :winningticket AND `to` >= :winningticket AND `id`=:id');
		$stmt->bindValue(':id', $id);
		$stmt->bindValue(':winningticket', $winningticket);
		$stmt->execute();
		$winner = $stmt->fetch();
	
	$stmt = $db->prepare('UPDATE giveaways SET `winner` = :steamid, `status` = 2, `winningticket` = :winning, `timeEnd`= UNIX_TIMESTAMP() WHERE id = :id');
		$stmt->bindValue(':winning', $winningticket);
		$stmt->bindValue(':id', $id);
		$stmt->bindValue(':steamid', $winner["steamid"]);
		$stmt->execute();
}

echo jsonSuccess($balance[0] - $coins);
?>
