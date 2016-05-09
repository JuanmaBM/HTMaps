<?php 

	/*
		This script delete a region in a JSON file 
	*/

	$index = $_POST["id"];
	$file = "../data/regions.json";
	$json = json_decode(file_get_contents($file), true);
	unset($json[$_POST["id"]]);	
	file_put_contents($file, json_encode($json));
?>