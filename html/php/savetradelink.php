<?php

session_start();

include 'default.php';
include 'steamauth/userInfo.php';
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$db = getDB();

$tlink = isset($_POST['tlink']) ? $_POST['tlink'] : null;
$pos = strrpos($tlink, "&token");
if($pos == false)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Provide valid tradelink'));
	return;
}
$tlink = strip_tags($tlink);
if(strlen($tlink)-$pos>20)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'There is something wrong with your tradelink'));
	return;
}
$stmt = $db->prepare('UPDATE users SET tradelink = :tlink WHERE steamid = :steamid');
				$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
				$stmt->bindValue(':tlink', $tlink);
				$stmt->execute();
				
echo jsonSuccess(123);

?>