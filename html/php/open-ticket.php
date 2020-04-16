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
$subject = isset($_POST['subject']) ? $_POST['subject'] : null;
$text = isset($_POST['text']) ? $_POST['text'] : null;

$text = strip_tags($text);
$subject = strip_tags($subject);

$stmt = $db->prepare('SELECT * FROM support WHERE steamid = :id AND status = 1');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$opentickets = $stmt->fetchAll();
if(count($opentickets)>= 2)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'You can have only 2 tickets open at one time'));
	return;
}
$stmt = $db->prepare('SELECT * FROM support WHERE steamid = :id');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->execute();
		$tickets = $stmt->fetchAll();
if(count($tickets)>= 200)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Too many tickets. You can`t open new one. Write a message to admin to remove that limitation'));
	return;
}
$stmt = $db->prepare('INSERT INTO support (steamid, status, subject, text, date) VALUES (:steamid, 1, :subject, :text, :date)');
		$stmt->bindValue(':steamid', $_SESSION['steamid']);
		$stmt->bindValue(':subject', $subject);
		$stmt->bindValue(':text', $text);
		$stmt->bindValue(':date', microtime_int());
		$stmt->execute();
echo jsonSuccess(1);
?>