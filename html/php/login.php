<?php
# en.php
session_start();
include 'default.php';
include 'steamauth/userInfo.php';
$db = getDB();
require('steamauth/openid.php');

try {
	require('steamauth/settings.php');
	$openid = new LightOpenID($steamauth['domainname']);

	
	if($openid->validate()) { 
		$id = $openid->identity;
		$ptn = "/^http:\/\/steamcommunity\.com\/openid\/id\/(7[0-9]{15,25}+)$/";
		preg_match($ptn, $id, $matches);
			  
		$_SESSION['steamid'] = $matches[1];
		$stmt = $db->prepare('SELECT * FROM users WHERE `steamid`=:steamid');
			$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
			$stmt->execute();
			$user = $stmt->fetch();
		if($user==null)
		{
			$stmt = $db->prepare('INSERT INTO users (steamid) VALUES (:steamid)');
				$stmt->bindValue(':steamid', $_SESSION['steam_steamid']);
				$stmt->execute();
		}
		header('Location: /');
		
		

		//Determine the return to page. We substract "login&"" to remove the login var from the URL.
		//"file.php?login&foo=bar" would become "file.php?foo=bar"
		# $returnTo = str_replace('login&', '', $_GET['openid_return_to']);
		//If it didn't change anything, it means that there's no additionals vars, so remove the login var so that we don't get redirected to Steam over and over.
		# if($returnTo === $_GET['openid_return_to']) $returnTo = str_replace('?login', '', $_GET['openid_return_to']);
		# header('Location: '.$returnTo);
	} else {
		echo "User is not logged in.\n";
	}
} catch(ErrorException $e) {
	echo $e->getMessage();
}
?>