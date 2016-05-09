<?php 
	
	$file = "../data/ubication.json";
	$json = json_decode(file_get_contents($file), true);
	echo json_encode($json[$_POST["id"]]);
?>