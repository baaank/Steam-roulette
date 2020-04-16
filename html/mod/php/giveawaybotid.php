<?php
include("../../php/default.php");
$db = getDB();

$steamid = isset($_POST['steamid']) ? $_POST['steamid'] : null;
if($steamid == null)
{
	$stmt = $db->prepare('SELECT `status` FROM settings WHERE `name`="giveawaybotid"');
				$stmt->execute();
				$settingsDB = $stmt->fetch()["status"];
	echo jsonSuccess($settingsDB);
}
else
{
	$stmt = $db->prepare('UPDATE `settings` SET `status`=:botid WHERE `name`="giveawaybotid"');
				$stmt->bindValue(":botid", $steamid);
				$stmt->execute();
}
?>