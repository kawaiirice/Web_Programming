<?php session_start(); // must still use this first
session_destroy();
header("Location: login.php");
?>