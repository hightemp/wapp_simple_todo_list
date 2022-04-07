<?php 

include_once("./database.php");
include_once("./lib.php");

$aRequest = $_REQUEST; // json_decode(file_get_contents("php://input"), true);
$sMethod = $_REQUEST['method'];

include_once("./models/tags.php");

include_once("./controllers/categories.php");
include_once("./controllers/tasks.php");
include_once("./controllers/tags.php");
