<?php 

	/*
		This script save a marker in a JSON file 
	*/
	
		$name = $_POST["name"];
		$lat = $_POST["latitude"];
		$lon = $_POST["longitude"];
		$direction = $_POST["address"];
		$phone = $_POST["phone"];
		$web = $_POST["web"];
		$color = $_POST["color"];
		$coments = nl2br($_POST["coment"]);

		$file = "../data/ubication.json";

		$json = json_decode(file_get_contents($file), true);
		$lastElement = (end($json));
		if($lastElement['id'] == null)
			$newID = 1;
		else
			$newID = $lastElement['id'] + 1;

		$json[$newID] = array(
			"id"  => $newID,
			"lat" => $lat,
			"lon" => $lon,
			"dir" => $direction,
			"pho" => $phone,
			"web" => $web,
			"col" => $color,
			"nam" => $name,
			"com" => $coments
		);

		file_put_contents($file, json_encode($json));
		echo $newID;
?>