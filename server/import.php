<?php 

	// // Insert the import file
	// if ( 0 < $_FILES['file']['error'] ) {
 //        echo 'Error: ' . $_FILES['file']['error'] . '<br>';
 //    }
 //    else {
 //        move_uploaded_file($_FILES['file']['tmp_name'], $_FILES['file']['name']);
 //    }

	// Get the last id in BD	
	$file = "../data/ubication.json";

	$json = json_decode(file_get_contents($file), true);
	$lastElement = (end($json));
	if($lastElement['id'] == null)
		$newID = 1;
	else
		$newID = $lastElement['id'] + 1;


	// Extract and convert the xml file to insert in BD
	$url = "../import.kml";
	$contents = file_get_contents($url);
	$xml      = new SimpleXMLElement($contents);
	$value = (array) $xml->Document;
	$response   = array();

	foreach($value['Placemark'] as $coord) { 		
		$coord = (array)$coord;		
		$coordinates = (array)$coord['Point'];		
		$coordinates = explode(",", $coordinates['coordinates']);		
	    $response[$newID] = array(
			"id"  => $newID,
			"lat" => $coordinates[1],
			"lon" => $coordinates[0],
			"dir" => $coord['name'],
			"pho" => '',
			"web" => '',
			"col" => 'red',
			"nam" => $coord['name'],
			"com" => '',
			"cnt" => ''
		);
		$newID++;
	}

	file_put_contents($file, json_encode($response));
	//echo json_encode($response);	
	header("Location: http://" . $_SERVER['SERVER_NAME'] . ":8080/HTMaps#setCountry");
	die();
?>