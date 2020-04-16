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

$minbet = isset($_POST['minbet']) ? $_POST['minbet'] : null;
$maxbet = isset($_POST['maxbet']) ? $_POST['maxbet'] : null;
$gamestatus = isset($_POST['gamestatus']) ? $_POST['gamestatus'] : null;
$alert = isset($_POST['alert']) ? $_POST['alert'] : null;
$alertmsg = isset($_POST['alertmsg']) ? $_POST['alertmsg'] : null;

$stmt = $db->prepare('UPDATE settings SET status=:minbet WHERE name="coinflipminbet"');
		$stmt->bindValue(":minbet", $minbet);
		$stmt->execute();
$stmt2 = $db->prepare('UPDATE settings SET status=:maxbet WHERE name="coinflipmaxbet"');
		$stmt2->bindValue(":maxbet", $maxbet);
		$stmt2->execute();
$stmt4 = $db->prepare('UPDATE settings SET status=:gamestatus WHERE name="coinflipstatus"');
		$stmt4->bindValue(":gamestatus", $gamestatus);
		$stmt4->execute();
$stmt5 = $db->prepare('UPDATE settings SET status=:alert WHERE name="coinflipalert"');
		$stmt5->bindValue(":alert", $alert);
		$stmt5->execute();
$stmt6 = $db->prepare('UPDATE settings SET status=:alertmsg WHERE name="coinflipalertmsg"');
		$stmt6->bindValue(":alertmsg", $alertmsg);
		$stmt6->execute();
echo jsonSuccess(1);
?>