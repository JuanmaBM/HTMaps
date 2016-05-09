function newRegionValidation(){

	var validate = true;
	if($("#region").val().length < 1){
		$("#region").addClass("invalid"); 
		$("#newRegionErrorForm").fadeIn('slow');
		validate = false;
	}else{
		$("#region").removeClass("invalid");
		$("#newRegionErrorForm").fadeOut('slow');
	}

	return validate;
}

function newUbicationValidation(){

	var validate = true;
	var error = 0;
	var errorInput = {
		"name" : false,
		"latitude" : false,
		"longitude" :false,
		"address" : false,	
		"color"	: false,
	};

	$("#newUbicationErrorForm").empty();
	$("#newUbicationErrorForm").hide();

	// Required field validation
	if(empty($("#name"))){
		errorInput["name"] = true;
		error++;	
	}
	if(empty($("#latitude"))){
		errorInput["latitude"] = true;   	
		error++;		
	}
	if(empty($("#longitude"))){
		errorInput["longitude"] = true;    	
		error++;		
	}
	if(empty($("#address"))){
		errorInput["address"] = true;      	
		error++;		
	}
	if(!$("#color").val()){
		errorInput["color"] = true;      	
		error++;		
	}

	// Specific validation
	if(error == 0){		

		// Numeric fields
		if(!$.isNumeric($("#latitude").val())){
			errorInput["latitude"] = true; 
			error++;  
			$("#newUbicationErrorForm").append("<li>El campo latitud debe ser numérico</li>");
		}
		if(!$.isNumeric($("#longitude").val())){
			errorInput["longitude"] = true; 
			error++;
			$("#newUbicationErrorForm").append("<li>El campo longitud debe ser numérico</li>");
		}
	}else{
			$("#newUbicationErrorForm").append("<li>Hay campos obligatorios sin completar</li>");			
	}

	if(error > 0){
		var focus = $("#myModalLabel").position().top;
		$('#myModal').animate({scrollTop: focus}, 600);
		validate = false;
		$("#newUbicationErrorForm").fadeIn('slow');
	}

	markErrors(errorInput);
	return validate;
}

function markErrors(aErrors){
	$.each(aErrors, function(key, value){
		if(value == true){
			$("#"+key).addClass("invalid"); 
		}else{
			$("#"+key).removeClass("invalid"); 
		}
	});
}

function clearForm(){

	$('#name').val("");
  	$('#latitude').val("");
	$('#longitude').val("");
  	$('#address').val("");
  	$('#web').val("");
  	$('#phone').val("");
 	$('#color').val("");
  	$('#coment').val("");
  	$('#mapSearchError').hide();
  	$("#newUbicationErrorForm").hide();

	var errorInput = {
		"name" : false,
		"latitude" : false,
		"longitude" :false,
		"address" : false,		
	};
	markErrors(errorInput);	
}

function empty(item){
	if(item.val().length < 1){
		return true;
	}else{
		return false;
	}
}