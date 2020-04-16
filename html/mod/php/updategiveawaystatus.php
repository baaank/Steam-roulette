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
if($admin != 2 && $admin != 1)
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/index.php");
	exit();
}	

$giveawayid = isset($_POST['giveawayid']) ? $_POST['giveawayid'] : null;
$stmt = $db->prepare('SELECT * FROM giveaways WHERE id=:giveawayid');
		$stmt->bindValue(":giveawayid", $giveawayid);
		$stmt->execute();
		$giveaway = $stmt->fetch();

if($giveaway["status"] == 2)
{
	$action = "Mod started already finished giveaway";
	$stmt = $db->prepare('UPDATE giveaways SET `winner` = "", `status` = 1, `winningticket` = "" WHERE id = :id');
			$stmt->bindValue(':id', $giveawayid);
			$stmt->execute();
}
else
{
		$action = "Mod ended giveaway. Giveaway id: ".$giveawayid;
		$winningticket = mt_rand(1,$giveaway["coins"]);
		$stmt = $db->prepare('SELECT `steamid` FROM `giveawayentries` WHERE `from` <= :winningticket AND `to` >= :winningticket AND `id`=:id');
			$stmt->bindValue(':id', $giveawayid);
			$stmt->bindValue(':winningticket', $winningticket);
			$stmt->execute();
			$winner = $stmt->fetch();
		
		$stmt = $db->prepare('UPDATE giveaways SET `winner` = :steamid, `status` = 2, `winningticket` = :winning, `timeEnd`= UNIX_TIMESTAMP() WHERE id = :id');
			$stmt->bindValue(':winning', $winningticket);
			$stmt->bindValue(':id', $giveawayid);
			$stmt->bindValue(':steamid', $winner["steamid"]);
			$stmt->execute();
}

$stmt = $db->prepare('INSERT INTO `adminlogs` (`steamid`, `action`, `date`) VALUES (:steamid, :action, UNIX_TIMESTAMP())');
		$stmt->bindValue(":steamid", $_SESSION['steamid']);
		$stmt->bindValue(":action", $action)
		$stmt->execute();
?>