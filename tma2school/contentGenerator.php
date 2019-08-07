<?php
	ini_set('display_errors', 'On');
	error_reporting(E_ALL | E_STRICT);

	include("../connection.php");

	if(isset($_GET['getUnits'])) {
		$query = "SELECT * FROM Units";
		$result = mysqli_query($conn, $query);

		$units = array();
		while($unit = mysqli_fetch_array($result))
			$units[] = $unit;
		echo json_encode($units);
		exit();
	}

	if(isset($_GET['getUnitById'])) {
		$id = $_GET['getUnitById'];
		$query = "SELECT * FROM Units WHERE ID = '$id'";
		$result = mysqli_query($conn, $query);
		
		$units = array();
		while($unit = mysqli_fetch_array($result))
			$units[] = $unit;
		if(count($units) <= 0)
			die("Unable to get Unit with ID = "+ $id);

		echo json_encode($units[0]);
	}

	if(isset($_GET['getQuizByUnitId'])) {
		$id = $_GET['getQuizByUnitId'];
		$query = "SELECT * FROM Quizzes WHERE ID = '$id'";
		$result = mysqli_query($conn, $query);
		
		$quizzes = array();
		while($quiz = mysqli_fetch_array($result))
			$quizzes[] = $quiz;
		if(count($quizzes) <= 0)
			die("Unable to get Quiz with Unit ID = "+ $id);

		echo json_encode($quizzes[0]);
	}

	if(isset($_GET['getQuizQuesByQuizId'])) {
		$quizId = $_GET['getQuizQuesByQuizId'];
		$query = "SELECT * FROM QuizQuestions WHERE QuizID = '$quizId'";
		$result = mysqli_query($conn, $query);

		$questions = array();
		while($ques = mysqli_fetch_array($result))
			$questions[] = $ques;
		echo json_encode($questions);
	}

	if(isset($_GET['getQuizAnsByQuesId'])) {
		$quesId = $_GET['getQuizAnsByQuesId'];
		$query = "SELECT * FROM QuizAnswers WHERE QuestionID = '$quesId'";
		$result = mysqli_query($conn, $query);

		$answers = array();
		while($ans = mysqli_fetch_array($result))
			$answers[] = $ans;
		echo json_encode($answers);
	}

	if(isset($_GET['getLessonsByUnitId'])) {
		$unitId = $_GET['getLessonsByUnitId'];
		$query = "SELECT * FROM Lessons WHERE UnitID = '$unitId'";
		$result = mysqli_query($conn, $query);

		$lessons = array();
		while($lesson = mysqli_fetch_array($result))
			$lessons[] = $lesson;
		echo json_encode($lessons);
	}
	
	if(isset($_GET['verifyFilePath'])) {
		clearstatcache();
		$path = $_GET['verifyFilePath'];
		print(file_exists($path) && FileIsXml($path));
	}

	if(isset($_POST['uploadFile'])) {
		$file = $_POST['uploadFile'];
		$xml = simplexml_load_file($file) or die("Error: Cannot create object");

		foreach ($xml->unit as $unit) {
			echo "Adding a a unit!";
			UploadUnit($conn, $unit);
		}	

		return FALSE;
	}

	function GetAllChildrenAsStr($conn, SimpleXMLElement $node) {
		$children = "";
		foreach ($node->children() as $c) 
			$children = "{$children}{$c->asXML()}";

		return $conn->real_escape_string($children);
	}

	function UploadUnit($conn, $unit) {
		$title = $unit['title'];
		//$ov = GetAllChildrenAsStr($conn, $unit->overview);
		$unitId = Insert($conn, "INSERT INTO Units (Title) VALUES ('$title')");

		foreach ($unit->lesson as $les) {
			UploadLesson($conn, $les, $unitId);
			}

		UploadQuiz($conn, $unit->quiz, $unitId);
	}


	function UploadQuiz($conn, $quiz, $unitId) {	
		$title = $quiz['title'];
		$quizId = Insert($conn, "INSERT INTO Quizzes (Title, UnitID) VALUES ('$title', '$unitId')");

		foreach ($quiz->question as $ques) 
			UploadQuestion($conn, $ques, $quizId);
	}

	function UploadQuestion($conn, $ques, $quizId) {	
		$txt = $ques['txt'];
		$quesId = Insert($conn, "INSERT INTO QuizQuestions (Question, QuizID) VALUES ('$txt', '$quizId')");

		foreach ($ques->ans as $ans) 
			UploadAnswer($conn, $ans, $quesId);
	}

	function UploadAnswer($conn, $ans, $quesId) {	
		$txt = $ans;
		$bit = $ans['correct'] == '0' ? 0 : 1;
		Insert($conn, "INSERT INTO QuizAnswers (Answer, Correct, QuestionID) VALUES ('$txt', '$bit', '$quesId')");
	}

	function UploadLesson($conn, $les, $unitId) {
		echo "Unit ID: {$unitId}\r\n";
		$title = $les['title'];
		$content = GetAllChildrenAsStr($conn, $les);
		Insert($conn, "INSERT INTO Lessons (Title, Content, UnitID) VALUES ('$title','$content', '$unitId')");
	}

	function Insert($conn, $query) {
		$query = trim(preg_replace('/\s+/', ' ', $query));
		echo "{$query}\r\n\r\n";

		$result = mysqli_query($conn, $query); // false failed
		if(!$result)
			die("Insert failed:\r\n{$query}\r\n\r\n");
		
		return mysqli_insert_id($conn);
	}

	function FileIsXml($path) {
		$extLen = 4;
		$len = strlen($path);
		return $len > $extLen && substr($path, $len - $extLen, $len - 1) == ".xml";
	}

?>