<?php 
		$country = $_POST["country"];
		$continent = $_POST["continent"];

		$file = "../data/regions.json";

		$json = json_decode(file_get_contents($file), true);
		$lastElement = (end($json));
		if($lastElement['id'] == null)
			$newID = 1;
		else
			$newID = $lastElement['id'] + 1;

		$json[$newID] = array(
			"id"  => $newID,
			"cou" => $country,
			"con" => $continent,			
		);

		file_put_contents($file, json_encode($json));
		echo $newID;
?>