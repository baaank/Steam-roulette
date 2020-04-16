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

$mindeposit = isset($_POST['mindeposit']) ? $_POST['mindeposit'] : null;
$refferalstatus = isset($_POST['refferalstatus']) ? $_POST['refferalstatus'] : null;
$refferalforref = isset($_POST['refferalforref']) ? $_POST['refferalforref'] : null;
$refferalforcode = isset($_POST['refferalforcode']) ? $_POST['refferalforcode'] : null;
$sitealert = isset($_POST['sitealert']) ? $_POST['sitealert'] : null;
$sitealertmsg = isset($_POST['sitealertmsg']) ? $_POST['sitealertmsg'] : null;
$maintenance = isset($_POST['maintenance']) ? $_POST['maintenance'] : null;
$chatstatus = isset($_POST['chatstatus']) ? $_POST['chatstatus'] : null;

$stmt = $db->prepare('UPDATE settings SET status=:mindeposit WHERE name="mindeposit"');
		$stmt->bindValue(":mindeposit", $mindeposit);
		$stmt->execute();
$stmt2 = $db->prepare('UPDATE settings SET status=:refferalstatus WHERE name="refferalstatus"');
		$stmt2->bindValue(":refferalstatus", $refferalstatus);
		$stmt2->execute();
$stmt3 = $db->prepare('UPDATE settings SET status=:refferalforref WHERE name="refferalforref"');
		$stmt3->bindValue(":refferalforref", $refferalforref);
		$stmt3->execute();
$stmt4 = $db->prepare('UPDATE settings SET status=:refferalforcode WHERE name="refferalforcode"');
		$stmt4->bindValue(":refferalforcode", $refferalforcode);
		$stmt4->execute();
$stmt5 = $db->prepare('UPDATE settings SET status=:sitealert WHERE name="sitealert"');
		$stmt5->bindValue(":sitealert", $sitealert);
		$stmt5->execute();
$stmt6 = $db->prepare('UPDATE settings SET status=:sitealertmsg WHERE name="sitealertmsg"');
		$stmt6->bindValue(":sitealertmsg", $sitealertmsg);
		$stmt6->execute();
$stmt7 = $db->prepare('UPDATE settings SET status=:maintenance WHERE name="maintenance"');
		$stmt7->bindValue(":maintenance", $maintenance);
		$stmt7->execute();
$stmt8 = $db->prepare('UPDATE settings SET status=:chatstatus WHERE name="chatstatus"');
		$stmt8->bindValue(":chatstatus", $chatstatus);
		$stmt8->execute();
echo jsonSuccess(1);
?>