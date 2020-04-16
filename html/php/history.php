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
$stmt = $db->prepare('SELECT * FROM games ORDER BY `id` DESC');
			$stmt->execute();
			$games = $stmt->fetchAll();

$result = count($games);
$games[0]["seed"]="in use";
$games[0]["2"]="in use";
$games[0]["hash"]=substr($games[0]["hash"], 0, 48);
$games[0]["hash"] = $games[0]["hash"]."...";
echo jsonSuccess($games);

?>