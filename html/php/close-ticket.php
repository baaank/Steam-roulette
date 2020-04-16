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

$stmt = $db->prepare('SELECT * FROM support WHERE id=:ticketid');
		$stmt->bindValue(':ticketid', $ticketid);
		$stmt->execute();
		$ticket = $stmt->fetch();
if($ticket["steamid"] != $_SESSION['steamid'])
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'It`s not your ticket'));
	return;
}

$stmt = $db->prepare('UPDATE support SET status=2 WHERE id=:ticketid');
		$stmt->bindValue(':ticketid', $ticketid);
		$stmt->execute();
echo jsonSuccess(1);
?>