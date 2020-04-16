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
$settings;
$counter = 0;
$stmt = $db->prepare('SELECT * FROM support WHERE status=1');
			$stmt->execute();
			$settingsDB = $stmt->fetchAll();
foreach($settingsDB as $ticket)
{
	$stmt = $db->prepare('SELECT * FROM supportreply WHERE id = :id ORDER BY date DESC');
			$stmt->bindValue(':id', $ticket["id"]);
			$stmt->execute();
			$replies = $stmt->fetchAll();
	$name = getUserInfo($ticket["steamid"])["personaname"];
	$name = renam(getUserInfo($ticket["steamid"])["personaname"]);
	if($replies[0]["date"]==null)
	{
		$array = array(
			"id" => $ticket["id"],
			"status" => $ticket["status"],
			"username" =>  $name,
			"subject" => $ticket["subject"],
			"replies" => count($replies),
			"date" => $ticket["date"],
		);
	}
	else
	{
		$array = array(
				"id" => $ticket["id"],
				"status" => $ticket["status"],
				"username" =>  $name,
				"subject" => $ticket["subject"],
				"replies" => count($replies),
				"date" => $replies[0]["date"],
			);
	}
	$data[$counter]=$array;
	$counter++;
}	
echo jsonSuccess($data);
?>