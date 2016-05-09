<?php 
	$name = $_POST["name"];
	$lat = $_POST["latitude"];
	$lon = $_POST["longitude"];
	$direction = $_POST["address"];
	$phone = $_POST["phone"];
	$web = $_POST["web"];
	$color = $_POST["color"];
	$coments = nl2br($_POST["coment"]);
	$id = $_POST["id"];

	$file = "../data/ubication.json";

	$json = json_decode(file_get_contents($file), true);

	$json[$id]['id'] = $id;
	$json[$id]['lat'] = $lat;
	$json[$id]['lon'] = $lon;
	$json[$id]['dir'] = $direction;
	$json[$id]['pho'] = $phone;
	$json[$id]['web'] = $web;
	$json[$id]['col'] = $color;
	$json[$id]['nam'] = $name;
	$json[$id]['com'] = $coments;	

	file_put_contents($file, json_encode($json));
	echo $id;
?>