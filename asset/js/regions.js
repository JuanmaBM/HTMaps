
function formNewRegion(){
	$("#region").val("");
	$("#continentView").val("");
	$("#newRegionErrorForm").hide();
	$("#region").removeClass("invalid");	
	// $("#Regionlist").empty();
}

function newRegion(){

	if(newRegionValidation()){
		var country = $("#region").val();
		var continent = $("#continentSelect").val();

		$.ajax({
          url: 'server/newRegion.php',
          data: {country, continent},
          type: 'POST',
          dataType: 'json',
        });

        $("#region").val("");
        $("#newUbicationSuccessForm").slideDown().delay(800).fadeOut();

        if($("#continentView").val() == continent)
			changeViewRegion(continent);
	}
}

function deleteRegion(id){
	$.ajax({
      url: 'server/deleteRegion.php',
      data: {id},
      type: 'POST',
      dataType: 'json',
    });	
    $("#viewCountry"+id).slideUp();
}

function changeViewRegion(continent){

	$("#Regionlist").empty();
	$.ajax({
      url: 'server/getInfoRegion.php',
      data: {continent},
      type: 'POST',
      dataType: 'json',
      complete: function(data){
      	var regions = data['responseJSON'];
      	$.each(regions, function(key, value){
      		$("#Regionlist").append('<li id="viewCountry'+value['id']+'" class="list-group-item">'+value['cou']+'<div class="pull-right">'+value['clt']+
      			'<span class="glyphicon glyphicon-user" aria-hidden="true"></span>'+
      			'<a href="#" onclick="deleteRegion('+value['id']+')">eliminar</a></div></li>');
      	});      	
      }
    });
}

$("#continentView").change(function(){

	var continent = $(this).val();
	changeViewRegion(continent);
});