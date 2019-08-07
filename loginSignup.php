<?php
	include("connection.php");
	
	if(isset($_GET['loginUser'])) {
		$user = $_GET['loginUser'];
		$pw = $_GET['loginPw'];

		$query = "SELECT * FROM Users WHERE UserName = '$user' AND Password = '$pw'";
		$result = mysqli_query($conn, $query);
		echo mysqli_num_rows($result);
	}
	if(isset($_POST['signupUser'])) {
		$user = $_POST['signupUser'];
		$pw = $_POST['signupPw'];

		$query = "INSERT INTO Users (UserName, Password) VALUES ('$user', '$pw')";
		$result = mysqli_query($conn, $query); 
		echo $result == false ? 0 : 1;
	}
?>