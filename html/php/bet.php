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
if(isset($_SESSION['steamid'])==false)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Log in first.'));
	return;
}

$betVal = isset($_POST['coins']) ? $_POST['coins'] : null;
$betCol = isset($_POST['color']) ? $_POST['color'] : null;


$betVal = intval($betval);
if($betVal<0)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Bet value must be bigger than 0!'));
	return;
}
$stmt = $db->prepare('SELECT coins FROM users WHERE steamid = :id');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$coins = $stmt->fetch();
		
if($coins[0]<$betVal)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You don`t have enough coins.'));
	return;
}



?>