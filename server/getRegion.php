<?php 
	$continent = $_POST["continent"];
	$response = null;
	$cont = 0;

	$fileRegion = "../data/regions.json";
	$fileUbication = "../data/ubication.json";
	$country = json_decode(file_get_contents($fileRegion), true);
	$ubications = json_decode(file_get_contents($fileUbication), true);

	foreach ($country as $key => $value) {
		if($value['con'] == $continent){
			$response[$cont]['cou'] = $value['cou'];			
			$clients = 0;
			foreach ($ubications as $keyUbi => $valueUbi) {
				if(strnatcasecmp($valueUbi['cnt'], $value['cou']) == 0){
					$clients++;
				}
			}
			$response[$cont]['clt'] = $clients;
			$cont++;
		}
	}

	echo json_encode($response);
?>