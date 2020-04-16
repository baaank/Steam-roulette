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

$ticketid = isset($_POST['ticketid']) ? $_POST['ticketid'] : null;
$counter = 0;
$stmt = $db->prepare('SELECT * FROM support WHERE id = :id');
		$stmt->bindValue(':id', $ticketid);
		$stmt->execute();
		$opentickets = $stmt->fetch();
$name = getUserInfo($opentickets["steamid"])["personaname"];
$name = renam($name);
$array = array(
	"name" => $name,
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
	$name2 = getUserInfo($ticket["steamid"])["personaname"];
	$name2 = renam($name2);
	$array = array(
		"name" => $name2,
		"date" => $ticket["date"],
		"text" => $ticket["text"],
	);
	$data[$counter]=$array;
	$counter++;
}
echo jsonSuccess($data);
?>