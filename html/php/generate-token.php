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
if(isset($_SESSION['steamid'])==false)
{
	echo jsonSuccess(array('valid' => 0, 'errMsg' => 'Not logged'));
	return;
}

function generateRandomString($length) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$token = generateRandomString(64);
$stmt = $db->prepare('UPDATE users SET token=:token, phpsession=:session WHERE steamid = :id');
		$stmt->bindValue(':id', $_SESSION['steamid']);
		$stmt->bindValue(':session', session_id());
		$stmt->bindValue(':token', $token);
		$stmt->execute();

echo jsonSuccess($token);

?>