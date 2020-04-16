<?php
require_once('otphp/lib/otphp.php');
$totp = new \OTPHP\TOTP("OWFWWLCS7KM5GUTG");
echo "Current OTP: ". $totp->now();

?>