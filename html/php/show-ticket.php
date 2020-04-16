<?php
session_start();
include 'default.php';
include 'SteamAuthentication/steamauth/userInfo.php';
$db = getDB();
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$ticketid = isset($_POST['ticketid']) ? $_POST['ticketid'] : null;
$counter = 0;
$stmt = $db->prepare('SELECT * FROM support WHERE id = :id');
		$stmt->bindValue(':id', $ticketid);
		$stmt->execute();
		$opentickets = $stmt->fetch();
if($opentickets["steamid"] != $_SESSION['steam_steamid'])
{
	return;
}
$array = array(
	"name" => getUserInfo($opentickets["steamid"])["personaname"],
	"date" => $opentickets["date"],
	"text" => $opentickets["text"],
);
$data[$counter]=$array;
$counter++;

$stmt = $db->prepare('SELECT * FROM supportreply WHERE id = :id');
		$stmt->bindValue(':id', $ticketid);
		$stmt->execute();
		$tickets = $stmt->fetchAll();
foreach($tickets as $ticket)
{
	$array = array(
		"name" => getUserInfo($ticket["steamid"])["personaname"],
		"date" => $ticket["date"],
		"text" => $ticket["text"],
	);
	$data[$counter]=$array;
	$counter++;
}
echo jsonSuccess($data);
?>