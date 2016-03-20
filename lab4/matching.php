<?php
//graph information code
if(isset($_REQUEST["cmd"])){
	if($_REQUEST["cmd"] == "generate"){
		if(isset($_REQUEST["X"])){
			switch($_REQUEST["X"]){
				case 1:
					$a = array("L"=>array(0, 1), "R"=>array(1, 2), "E"=>array(array(0, 0, 1), array(1, 1, 1), array(0, 1, 1)));
					break;
				case 2:
					$a = array("L"=>array(5, 4), "R"=>array(5, 7), "E"=>array(array(0, 0, 1), array(1, 1, 50), array(1, 2, 10)));
					break;
				case 3:
					$a = array("L"=>array(4, 7), "R"=>array(6, 2), "E"=>array(array(0, 0, 10), array(1, 0, 10), array(1, 1, 10), array(2, 1, 10), array(2, 2, 10)));
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
				default:
			}
			echo json_encode($a); //associative array
		}
	}

	//optimal solution code	
	if($_REQUEST["cmd"] == "solve"){
		if(isset($_REQUEST["X"])){
			switch($_REQUEST["X"]){
				case 1:
					$a = array("num_match"=>2, "match_score"=>2, "match"=>array(array(0, 0), array(1, 1)));
					break;
				case 2:
					$a = array("num_match"=>2, "match_score"=>51, "match"=>array(array(0, 0), array(1, 1)));
					break;
				case 3:
					$a = array("num_match"=>3, "match_score"=>30, "match"=>array(array(0, 0), array(1, 1), array(2, 2)));
					break;
				case 4:
					$a = array("num_match"=>4, "match_score"=>76, "match"=>array(array(0, 0), array(1, 1), array(2, 2), array(3, 3)));
					break;
				case 5:
					$a = array("num_match"=>2, "match_score"=>70, "match"=>array(array(0, 1), array(2, 0)));
					break;
				case 6:
					$a = array("num_match"=>2, "match_score"=>91, "match"=>array(array(1, 0), array(2, 1)));
					break;
				case 7:
					$a = array("num_match"=>7, "match_score"=>7, "match"=>array(array(0, 6), array(1, 0), array(2, 1), array(3, 2), array(4, 3), array(5, 4), array(6, 5)));
					break;
				case 8:
					$a = array("num_match"=>3, "match_score"=>90, "match"=>array(array(1, 1), array(0, 2), array(3, 0)));
					break;
				case 9:
					$a = array("num_match"=>4, "match_score"=>198, "match"=>array(array(0, 2), array(1, 3), array(2, 0), array(3, 1)));
					break;
				default:
			}
			echo json_encode($a);
		}
	}
}
?>