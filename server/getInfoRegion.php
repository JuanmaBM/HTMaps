<?php 

	$continent = $_POST["continent"];
	$response = null;
	$cont = 0;
	$clients = 0;

	$fileRegion = "../data/regions.json";
	$fileUbication = "../data/ubication.json";
	$country = json_decode(file_get_contents($fileRegion), true);
	$ubications = json_decode(file_get_contents($fileUbication), true);

	if($continent == null){
		foreach ($country as $key => $value) {
				$response[$cont]['cou'] = $value['cou'];
				$response[$cont]['id'] = $value['id'];							
				$response[$cont]['clt'] = 0;
				$cont++;
		}
	}else{
		foreach ($country as $key => $value) {
			if($value['con'] == $continent){
				$response[$cont]['cou'] = $value['cou'];
				$response[$cont]['id'] = $value['id'];			
				$clients = 0;
				foreach ($ubications as $keyUbi => $valueUbi) {
					// if(strnatcasecmp($valueUbi['cnt'], $value['cou']) == 0){
					// 	$clients++;
					// }
					if(preg_match("/".$value['cou']."/i", $valueUbi['cnt'])){
						$clients++;
					}
				}
				$response[$cont]['clt'] = $clients;
				$cont++;
			}
		}
	}	

	echo json_encode($response);
?>