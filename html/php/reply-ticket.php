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
$text = isset($_POST['text']) ? $_POST['text'] : null;
if(strlen($text)>500)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Limit is 500 characters'));
	return;
}
$stmt = $db->prepare('SELECT * FROM support WHERE id=:ticketid');
		$stmt->bindValue(':ticketid', $ticketid);
		$stmt->execute();
		$ticket = $stmt->fetch();
if($ticket["steamid"] != $_SESSION['steamid'])
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'It`s not your ticket'));
	return;
}
$text = strip_tags($text);
$stmt = $db->prepare('SELECT * FROM supportreply WHERE id=:ticketid ORDER BY date DESC');
		$stmt->bindValue(':ticketid', $ticketid);
		$stmt->execute();
		$lastticket = $stmt->fetch();
if($_SESSION['steamid']==$lastticket["steamid"])
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You can`t reply to yourself'));
	return;
}
$stmt = $db->prepare('INSERT INTO supportreply (id, steamid, text, date) VALUES (:id, :steamid, :text, :date)');
		$stmt->bindValue(':id', $ticketid);
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->bindValue(':text', $text);
		$stmt->bindValue(':date', microtime_int());
		$stmt->execute();
echo jsonSuccess(1);
?>