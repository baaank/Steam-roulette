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
$gamelength = isset($_POST['gamelength']) ? $_POST['gamelength'] : null;
$gamestatus = isset($_POST['gamestatus']) ? $_POST['gamestatus'] : null;
$alert = isset($_POST['alert']) ? $_POST['alert'] : null;
$alertmsg = isset($_POST['alertmsg']) ? $_POST['alertmsg'] : null;

$stmt = $db->prepare('UPDATE settings SET status=:minbet WHERE name="rouletminbet"');
		$stmt->bindValue(":minbet", $minbet);
		$stmt->execute();
$stmt2 = $db->prepare('UPDATE settings SET status=:maxbet WHERE name="rouletmaxbet"');
		$stmt2->bindValue(":maxbet", $maxbet);
		$stmt2->execute();
$stmt3 = $db->prepare('UPDATE settings SET status=:gamelength WHERE name="rouletgamelength"');
		$stmt3->bindValue(":gamelength", $gamelength);
		$stmt3->execute();
$stmt4 = $db->prepare('UPDATE settings SET status=:gamestatus WHERE name="rouletstatus"');
		$stmt4->bindValue(":gamestatus", $gamestatus);
		$stmt4->execute();
$stmt5 = $db->prepare('UPDATE settings SET status=:alert WHERE name="rouletalert"');
		$stmt5->bindValue(":alert", $alert);
		$stmt5->execute();
$stmt6 = $db->prepare('UPDATE settings SET status=:alertmsg WHERE name="rouletalertmsg"');
		$stmt6->bindValue(":alertmsg", $alertmsg);
		$stmt6->execute();
echo jsonSuccess(1);
?>