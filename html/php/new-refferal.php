<?php

function generateRandomString($length = 6) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$code = generateRandomString();

session_start();
include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
if(!isset($_SESSION['steamid']))
{
	header("Location: http://" . $_SERVER['HTTP_HOST'] ."/login.php");
	exit();
}
$steamUserId = intval($steamprofile['steamid']);


$stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE refcode = :code');
$stmt->bindValue(':code', $code);
$stmt->execute();
$exists = $stmt->fetch()[0];
if($exists == 1) {
	while($exists < 1) {
		$code = generateRandomString();
		$stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE refcode = :code');
		$stmt->bindValue(':code', $code);
		$stmt->execute();
		$exists = $stmt->fetch()[0];
	} 
} 

$stmt = $db->prepare('UPDATE users SET refcode = :code WHERE steamid = :id64');
$stmt->bindValue(':id64', $steamUserId);
$stmt->bindValue(':code', $code);
$stmt->execute();
echo jsonSuccess($code);
?>
