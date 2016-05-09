<?php 

	$region = $_POST["region"];
	$response = null;
	$cont = 0;

	$fileUbication = "../data/ubication.json";
	$ubications = json_decode(file_get_contents($fileUbication), true);

	if($region != null)
		foreach ($ubications as $key => $value) {
			// if(preg_match("/".$region."/", $value['cnt']))
				$response[] = $value;			
		}
	else
		foreach ($ubications as $key => $value) {
				$response[] = $value;
		}

	echo json_encode($response);
?>