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
$settings;
$counter = 0;
$stmt = $db->prepare('SELECT * FROM support');
			$stmt->execute();
			$settingsDB = $stmt->fetchAll();
foreach($settingsDB as $ticket)
{
	$stmt = $db->prepare('SELECT * FROM supportreply WHERE id = :id ORDER BY date DESC');
			$stmt->bindValue(':id', $ticket["id"]);
			$stmt->execute();
			$replies = $stmt->fetchAll();
	if($replies[0]["date"]==null)
	{
		$name = getUserInfo($ticket["steamid"])["personaname"];
		$name = renam($name);
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
		$name = getUserInfo($ticket["steamid"])["personaname"];
		$name = renam($name);
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