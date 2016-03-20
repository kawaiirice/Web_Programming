<?php session_start(); 
require_once '../connect.php';

//graph information code
if(isset($_REQUEST["cmd"])) {
	if($_REQUEST["cmd"] == "generate") {
		if(isset($_REQUEST["graph_id"])) {
			$a = getArray($_REQUEST["graph_id"]);
			$_SESSION['starttime'] = time();
			echo json_encode($a); //associative array
		}
	}

	//optimal solution code	
	if($_REQUEST["cmd"] == "solve") {
		if(isset($_REQUEST["graph_id"])) {
			global $db;
			$graph_id = $db->escape_string($_REQUEST["graph_id"]);
			$best_time = time()-$_SESSION['starttime'];

			if(isset($_REQUEST["solution"])) {
				
				$sol = json_decode($_REQUEST["solution"]);
				$valid = isValid($graph_id, $sol);

				if(!$valid) {
					http_response_code(400); //Bad Request
					exit("Invalid Inputs");
				}

				$num_match = count($sol);
				$match_score = getScore($graph_id, $sol);
				
				$a = checkDatabase($graph_id, $num_match, $match_score, $best_time);
			}
			else {
				$a = getOptimalSol($graph_id);
			}

			echo json_encode($a);
		}
	}
}

function checkDatabase ($graph_id, $num_match, $match_score, $best_time) {
		global $db;
		$query = "SELECT * FROM SCOREBOARD WHERE graph_id = '" . $graph_id . "'";
		$res = $db->query($query);
		$r = mysqli_fetch_row($res);
		$highest_match = $r[1];
		$highest_score = $r[2];
		$fastest_time = $r[3];

		if($highest_match == $num_match && $highest_score == $match_score && $fastest_time == $best_time){
			$a = array("new_best"=>1, "num_match"=>$num_match, "match_score"=>$match_score, "best_time"=>$best_time);
		}
		else if($highest_match < $num_match || ($highest_match == $num_match && $highest_score < $match_score) || ($highest_match == $num_match && $highest_score == $match_score && $fastest_time > $best_time)) {
			updateDatabase($graph_id, $num_match, $match_score, $best_time);
			$a = array("new_best"=>1, "num_match"=>$num_match, "match_score"=>$match_score, "best_time"=>$best_time); 
		}
		else {
			$a = array("new_best"=>0, "num_match"=>$highest_match, "match_score"=>$highest_score, "best_time"=>$fastest_time); 
		}

		return $a;
}

function updateDatabase ($graph_id, $num_match, $match_score, $best_time) {
	global $db;
	$query = "UPDATE SCOREBOARD SET num_match='" . $num_match . "' WHERE graph_id = '" . $graph_id . "'";
	$res = $db->query($query);
	if(!$res) exit("MySQL reports" + $db->error);
	
	$query = "UPDATE SCOREBOARD SET match_score='" . $match_score . "' WHERE graph_id = '" . $graph_id . "'";
	$res = $db->query($query);
	if(!$res) exit("MySQL reports" + $db->error);

	$query = "UPDATE SCOREBOARD SET best_time='" . $best_time . "' WHERE graph_id = '" . $graph_id . "'";
	$res = $db->query($query);
	if(!$res) exit("MySQL reports" + $db->error);
}

function isValid($graph_id, $sol) {
	$a = getArray($graph_id);
	$edge = $a["E"];
	$valid = false;

	for($i = 0; $i < count($sol); $i++) {
		if($sol[$i][0] >= count($a["L"]) || $sol[$i][1] >= count($a["R"]))
			return false;
		
		for($j = 0; $j < count($edge); $j++) {
			if($sol[$i][0] == $edge[$j][0] && $sol[$i][1] == $edge[$j][1])
				$valid = true;
		}

		if(!$valid)
			return false;

		$valid = false;
	}

	return true;
}

function getScore($graph_id, $sol) {
	$a = getArray($graph_id);
	$edge = $a["E"];
	$score = 0;

	for($i = 0; $i < count($sol); $i++) {
		for($j = 0; $j < count($edge); $j++) {
			if($sol[$i][0] == $edge[$j][0] && $sol[$i][1] == $edge[$j][1])
				$score += $edge[$j][2];
		}
	}

	return $score;
}

function getArray($graph_id) {
	switch($graph_id) {
	case 1:
		$a = array("L"=>array(0, 1), "R"=>array(1, 2), "E"=>array(array(0, 0, 1), array(1, 1, 1), array(0, 1, 1)));
		break;
	case 2:
		$a = array("L"=>array(5, 4), "R"=>array(5, 7), "E"=>array(array(0, 0, 1), array(1, 1, 50), array(1, 2, 10)));
		break;
	case 3:
		$a = array("L"=>array(4, 7, 3), "R"=>array(6, 2, 5), "E"=>array(array(0, 0, 10), array(1, 0, 10), array(1, 1, 10), array(2, 1, 10), array(2, 2, 10)));
		break;
	case 4:
		$a = array("L"=>array(9, 8, 7, 6), "R"=>array(7, 6, 5, 4), "E"=>array(array(0, 0, 3), array(1, 1, 1), array(0, 2, 50), array(2, 2, 2), array(3, 1, 100), array(3, 3, 70)));
		break;
	case 5:
		$a = array("L"=>array(2, 4, 6), "R"=>array(0, 7), "E"=>array(array(0, 1, 30), array(1, 1, 20), array(2, 1, 10), array(2, 0, 40)));
		break;
	case 6:
		$a = array("L"=>array(3, 5, 7), "R"=>array(1, 6), "E"=>array(array(0, 0, 1), array(1, 0, 89), array(2, 0, 90), array(2, 1, 2)));
		break;
	case 7:
		$a = array("L"=>array(1, 2, 3, 4, 5, 6, 7), "R"=>array(6, 5, 4, 3, 2, 1, 0), "E"=>array(array(0, 1, 1), array(1, 2, 1), array(1, 0, 1), array(2, 1, 1), array(2, 3, 1), array(3, 2, 1), array(3, 4, 1), array(4, 3, 1), array(4, 5, 1), array(5, 4, 1), array(5, 6, 1), array(6, 5, 1), array(0, 6, 1)));
		break;
	case 8:
		$a = array("L"=>array(6, 3, 9, 0), "R"=>array(6, 1, 3, 5), "E"=>array(array(2, 0, 40), array(3, 0, 40), array(1, 1, 30), array(2, 1, 30), array(3, 1, 30), array(0, 2, 20), array(2, 2, 20)));
		break;
	case 9:
		$a = array("L"=>array(8, 6, 4, 2), "R"=>array(7, 5, 3, 1), "E"=>array(array(0, 2, 21), array(0, 3, 99), array(1, 3, 90), array(2, 0, 35), array(3, 0, 74), array(3, 1, 52)));
		break;
	default:
		$a = array("L"=>array(0, 1), "R"=>array(1, 2), "E"=>array(array(0, 0, 1), array(1, 1, 1), array(0, 1, 1))); 
		break;
	}
	return $a;
}

function getOptimalSol($graph_id) {
	switch($graph_id) {
		case 1:
			$a = array("num_match"=>2, "match_score"=>2);
			break;
		case 2:
			$a = array("num_match"=>2, "match_score"=>51);
			break;
		case 3:
			$a = array("num_match"=>3, "match_score"=>30);
			break;
		case 4:
			$a = array("num_match"=>4, "match_score"=>76);
			break;
		case 5:
			$a = array("num_match"=>2, "match_score"=>70);
			break;
		case 6:
			$a = array("num_match"=>2, "match_score"=>91);
			break;
		case 7:
			$a = array("num_match"=>7, "match_score"=>7);
			break;
		case 8:
			$a = array("num_match"=>3, "match_score"=>90);
			break;
		case 9:
			$a = array("num_match"=>4, "match_score"=>198);
			break;
		default:
			$a = array("num_match"=>2, "match_score"=>2);
			break;
	}
	return $a;
}
?>