<?php 

	$country = $_POST["country"];
	$id = $_POST["id"];

	$file = "../data/ubication.json";

	$json = json_decode(file_get_contents($file), true);

	$json[$id]['id'] = $id;
	$json[$id]['cnt'] = $country;

	file_put_contents($file, json_encode($json));
	echo json_encode($json);
?>