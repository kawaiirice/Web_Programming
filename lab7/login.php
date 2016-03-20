<?php session_start();
require_once '../connect.php';

// For testing
/*
if (isset($_POST["user_id"]))
	echo $_POST["user_id"] . "<br>";
if (isset($_POST["password"]))
	echo $_POST["password"] . "<br>";
*/

// Do some table checking here for existing users and hashed passwords

// Username and password in database --> redirect	
if (isset($_POST["user_id"]) && isset($_POST["password"])){
	global $db;
	$user_id = $db->escape_string($_POST["user_id"]);
	$password = $db->escape_string($_POST["password"]);

	$query = "SELECT * FROM USER WHERE user_id = '" . $user_id . "'";
	$res = $db->query($query);
	if(!$res) exit("MySQL reports" + $db->error);

	$r = mysqli_fetch_row($res);

	if($r) {
		$hashed_password = $r[1];
		$role = $r[2];	
		if($hashed_password == crypt($password, $hashed_password) && $role == 0) { // if the user has admin rights
			$_SESSION['user_id'] = $user_id;
			$_POST["user_id"] = null;
			$_POST["password"] = null;
			header("Location: admin.php");
		}
		else if ($hashed_password == crypt($password, $hashed_password)) { // if the password is correct
			$_SESSION['user_id'] = $user_id;
			$_SESSION['hashed_password'] = $hashed_password;
			$_POST["user_id"] = null;
			$_POST["password"] = null;
			header("Location: index.html");
		}
		else { //incorrect password
			echo "<script> alert('Username or password is incorrect. Please try logging in again.'); </script>";
			$_POST["user_id"] = null;
			$_POST["password"] = null;
		}
	}
	else { //incorrect password
		echo "<script> alert('Username or password is incorrect. Please try logging in again.'); </script>";
		$_POST["user_id"] = null;
		$_POST["password"] = null;
	}
}	
?>

<!DOCTYPE html>

<html lang="en">

<head>
<title>Login</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
<link rel="icon" href="favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="css/style.css">
</head>

<body>
<div class="container">
	<div class="well .col-xs-12 .col-sm-6 .col-sm-offset-4 .col-md-4 .col-md-offset-4 .col-lg-4 .col-lg-offset-4" >
		<div class="text-center">
			<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
				<p>Please enter your username and password. <br></p>
				Username: <br>
				<input name="user_id" type="text"> <br>
				Password: <br>
				<input name="password" type="password"> <br> <br>
				<button type="submit" class="btn btn-default">Login</button> 
			</form>
		</div>	
	</div>
	<form class = "pull-right" action="index.html">
		<button type="submit" class="btn btn-default">Return to game</button> 
	</form>
</div>

</body>
</html>