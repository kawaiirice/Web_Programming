<?php session_start();
require_once '../connect.php';

function DisplayScoreboard($table_name) {  
  global $db; 
  $query = "SELECT * FROM " . $table_name;
  $res = $db->query($query); 
  if (!$res) exit("There is a MySQL error, exiting this script");
  echo "<p>Table " . $table_name . "<br></p>"; // dynamic HTML table
  echo "<table class='text-center table resize' border=\"1px\" style=\"border-collapse: collapse\">";
  echo "<tr><th>graph</th><th>matches</th><th>score</th><th>best_time</th><th>user</th></tr>";
  while ($r = mysqli_fetch_row($res)) { // important command
    echo "<tr><td>" . $r[0] . "</td>"; // echo first column
    for ($i = 1; $i < count($r); $i++) echo "<td>" . $r[$i] . "</td>";
    echo "</tr>";
  }
  echo "</table>";
}

function DisplayUser($table_name) {  
  global $db; 
  $query = "SELECT * FROM " . $table_name;
  $res = $db->query($query); 
  if (!$res) exit("There is a MySQL error, exiting this script");
  echo "<p>Table " . $table_name . "<br></p>"; // dynamic HTML table
  echo "<table class='text-center table' border=\"1px\" style=\"border-collapse: collapse\">";
  echo "<tr><th>user_id</th><th>role</th></tr>";
  while ($r = mysqli_fetch_row($res)) { // important command
    echo "<tr><td>" . $r[0] . "</td>"; // echo first column
    echo "<td>" . $r[2] . "</td>";
    echo "</tr>";
  }
  echo "</table>";
}

global $db;

if (isset($_POST["reset"])) {
  $query = "UPDATE SCOREBOARD SET num_match = 0"; 
  $res = $db->query($query);

  $query = "UPDATE SCOREBOARD SET match_score = 0";
  $res = $db->query($query);
  
  $query = "UPDATE SCOREBOARD SET best_time = 100";
  $res = $db->query($query);

  $query = "UPDATE SCOREBOARD SET user_id = null";
  $res = $db->query($query);

  if(!$res) exit("MySQL reports" + $db->error);
  header("Location: admin.php");
}

$query = "SELECT role FROM USER WHERE user_id = '" . $_SESSION["user_id"] . "'";
$res = $db->query($query);
$r = mysqli_fetch_row($res);

if(!$r || $r[0] != 0) {
  header("Location: login.php");
  echo "<p> User not authorized. Redirecting back to login. <br> </p>";
}

else{
  echo "<body> <div class='container'> <div class ='well'>";
  DisplayUser("USER"); 
  DisplayScoreboard("SCOREBOARD");
  echo "</div> </div> </body>";
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
<title>Admin</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="css/style.css">
</head>

<!-- logout -->
<div class = "container">
   <form class = "pull-right" action="logout.php">
      <button type="submit" class="btn btn-default">Logout</button> 
   </form>
   <form method="post" class = "pull-right" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
      <button type="submit" name="reset" class="btn btn-default">Reset High Scores</button> 
  </form>

<!--   <form method="POST" action=''>
<input type="submit" name="button1"  value="My Button">
</form> -->
</div>

</html>