<?php

header("Content-type=text/json;charset=UTF-8");

$servername = 'localhost';
$username = 'root';
$password = '';
$dbname = 'tma2';

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname) or die("Failed");


?>