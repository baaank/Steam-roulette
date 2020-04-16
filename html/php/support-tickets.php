<?php
session_start();
include 'default.php';
include 'SteamAuthentication/steamauth/userInfo.php';
$db = getDB();
$counter = 0;
$data;
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$stmt = $db->prepare('SELECT * FROM support WHERE steamid = :id ORDER BY status ASC, date DESC');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$tickets = $stmt->fetchAll();
foreach($tickets as $ticket)
{
	$stmt = $db->prepare('SELECT * FROM supportreply WHERE id = :id ORDER BY date DESC');
			$stmt->bindValue(':id', $ticket["id"]);
			$stmt->execute();
			$replies = $stmt->fetchAll();
	if($replies[0]["date"]==null)
	{
		$array = array(
			"status" => $ticket["status"],
			"subject" => $ticket["subject"],
			"replies" => count($replies),
			"date" => $ticket["date"],
			"id" => $ticket["id"],
		);
	}
	else
	{
		$array = array(
				"status" => $ticket["status"],
				"subject" => $ticket["subject"],
				"replies" => count($replies),
				"date" => $replies[0]["date"],
				"id" => $ticket["id"],
			);
	}
	$data[$counter]=$array;
	$counter++;
}		
echo jsonSuccess($data);
?>