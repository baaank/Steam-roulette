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
$choice = isset($_POST['choice']) ? $_POST['choice'] : null;
$bank = 0;
$stmt = $db->prepare('SELECT * FROM users WHERE steamid = :id');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$balance = $stmt->fetch();
		
if($balance["coins"] < $coins){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You don`t have enough coins!'));
	return;
};
if($balance["gameban"]==1)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You are banned from games!'));
	return;
}
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="coinflipminbet"');
			$stmt->execute();
			$min = $stmt->fetch()[0];
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="coinflipmaxbet"');
			$stmt->execute();
			$max = $stmt->fetch()[0];
$stmt = $db->prepare('SELECT `status` FROM `settings` WHERE `name`="coinflipstatus"');
			$stmt->execute();
			$status = $stmt->fetch()[0];
if($status == 0)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Coinflip game is turned off'));
	return;
}
if($coins < $min){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Min bet is '.$min.' coins'));
	return;
}
if($coins > $max){
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Max bet is '.$max.' coins'));
	return;
}
$winningchoice = mt_rand(1,2);	
if($choice == $winningchoice)
{
	$bank = $balance["coins"] + $coins;
	$stmt = $db->prepare('UPDATE users SET coins = `coins`+:coins, coinflip = `coinflip`+:coins WHERE steamid = :id');
	$stmt->bindValue(':id', $_SESSION['steamid']);
	$stmt->bindValue(':coins', $coins);
	$stmt->execute();
}
else
{
	$bank = $balance["coins"] - $coins;
	$stmt = $db->prepare('UPDATE users SET coins = `coins`-:coins, coinflip = `coinflip`-:coins WHERE steamid = :id');
	$stmt->bindValue(':id', $_SESSION['steamid']);
	$stmt->bindValue(':coins', $coins);
	$stmt->execute();
}
$stmt = $db->prepare('INSERT INTO coinflipgames (steamid, coins, userpick, pick, date) VALUES (:steamid, :coins, :userpick, :pick, :date)');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->bindValue(':coins', $coins);
		$stmt->bindValue(':userpick', $choice);
		$stmt->bindValue(':pick', $winningchoice);
		$stmt->bindValue(':date', microtime_int());
		$stmt->execute();
$data = array(
    "pick"   => $winningchoice,
    "bank" => $bank
  );
echo jsonSuccess($data);
?>