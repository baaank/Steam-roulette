<?php
session_start();
include 'default.php';
$db = getDB();
$stmt = $db->prepare('SELECT * FROM giveaways WHERE `status` = 1');
		$stmt->execute();
		$giveaways = $stmt->fetchAll();

foreach($giveaways as $giveaway)
{
	if($giveaway["timeEnd"]< time())
	{
		$totalCoins = $giveaway["coins"];
	print_r($giveaway["id"]);
		$winningticket = mt_rand(1,$totalCoins);
		$stmt = $db->prepare('SELECT `steamid` FROM `giveawayentries` WHERE `from` <= :winningticket AND `to` >= :winningticket AND `id`=:id');
			$stmt->bindValue(':id', $giveaway["id"]);
			$stmt->bindValue(':winningticket', $winningticket);
			$stmt->execute();
			$winner = $stmt->fetch();
		
		$stmt = $db->prepare('UPDATE giveaways SET `winner` = :steamid, `status` = 2, `winningticket` = :winning, `timeEnd`= UNIX_TIMESTAMP() WHERE id = :id');
			$stmt->bindValue(':winning', $winningticket);
			$stmt->bindValue(':id', $giveaway["id"]);
			$stmt->bindValue(':steamid', $winner["steamid"]);
			$stmt->execute();
	}
}
?>
