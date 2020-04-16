<?php
session_start();

include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$stmt = $db->prepare('SELECT * FROM coinflipgames WHERE `steamid`=:id ORDER BY `date` DESC LIMIT 10');
			$stmt->bindValue(":id", $_SESSION['steamid']);
			$stmt->execute();
			$games = $stmt->fetchAll();
			
echo jsonSuccess($games);

?>