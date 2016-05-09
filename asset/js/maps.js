if ( window.location.href.indexOf('setCountry') >= 0 ){
   var region = null;
   $.ajax({
      url: 'server/getUbication.php',
      data: {region},
      type: 'POST',
      dataType: 'json',
      complete: function(data){
        ubication = data['responseJSON'];
        $.each(ubication, function(key, val){
          console.log(val);
         getCountry(val['lat'], val['lon'], val['id']);
        });
      }
    });            
   // window.location.replace(window.location.protocol + "//" + window.location.host + "/");
}


// Array to save the markers 
var markers = [];
var continent = [];
var countries = [];
var routes = [];

// Load main map (Coordinates to spain)
var map = new GMaps({
  el: '#map',
  zoom: 2,
  lat: 40.46366, 
  lng: -3.74922,
  mapType: 'roadmap',
  disableDefaultUI: true,
  rightclick: function(event){
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();

    console.log("lat: "+latitude);
    console.log("lon: "+longitude);
    route(latitude, longitude);
  }
});

function activateCountry(continent){  
 
  deleteAll();

  $.ajax({
    url: 'server/getInfoRegion.php',
    data: {continent},
    type: 'POST',
    dataType: 'json',
    complete: function(data){
      var regions = data['responseJSON'];
      $.each(regions, function(key, value){
          GMaps.geocode({
          address: value['cou'],
          callback: function(results, status) {
            if (status == 'OK') {
              var latlng = results[0].geometry.location;
              map.setCenter(latlng.lat(), latlng.lng());
              marker = map.addMarker({
                lat: latlng.lat(),
                lng: latlng.lng(),
                click: function(){
                  loadUbication(value['cou']);
                }
              });
              var country = map.drawOverlay({
              lat:  latlng.lat(),
              lng: latlng.lng(),
              content: '<div style="border-radius:10%;border:1px solid; background-color:black;">'+
              '<a href="#"  id="'+value['cou']+'"><h1>'+value['cou']+'</h1></a></div>'
            });
              countries.push(country);
              markers.push(marker);
            }
          }
        });  
      });     
    }
  });
}

// Move to selected hot point position 
$('.continent').click(function(){

	switch($(this).attr("id")) {
	    case 'europa':
	        map.panTo( new google.maps.LatLng( 54.5259614, 15.255118700000025 ) );
          map.setZoom(4);
          activateCountry('europa');
	        break;
	    case 'americas':
	        map.panTo( new google.maps.LatLng( -8.783195, -55.49147700000003 ) );
          map.setZoom(4);
          activateCountry('americas');
	        break;   
      case 'american':
          map.panTo( new google.maps.LatLng( 54.5259614, -105.25511870000003 ) );
          map.setZoom(4);
          activateCountry('american');
          break;   
      case 'africa':
          map.panTo( new google.maps.LatLng( -8.783195, 34.50852299999997 ) );
          map.setZoom(4);
          activateCountry('africa');
          break;   
      case 'asia':
          map.panTo( new google.maps.LatLng( 34.047863, 100.61965529999998 ) );
          map.setZoom(4);
          activateCountry('asia');
          break;   
      case 'australia':
          map.panTo( new google.maps.LatLng( -25.274398, 133.77513599999997 ) );
          map.setZoom(4);
          activateCountry('australia');
          break;  
      case 'all':
          activateCountry(null);
          map.panTo( new google.maps.LatLng( -14.5994134, -28.67314650000003 ) );
          map.setZoom(2);          
          break;   
      case 'regionAll':
          loadUbication(null);
          map.panTo( new google.maps.LatLng( -14.5994134, -28.67314650000003 ) );
          map.setZoom(2);
          break;   
	}
});

// Search the position in the map from the value of address field 
$('#searchAddress').click(function(){     

   GMaps.geocode({
    address: $('#address').val(),
    callback: function(results, status) {
      if (status == 'OK') {
        // If all are OK, we show a map with the position and fill the latitude and longitude fields
        $('#mapSearchError').hide();
        $('#mapSearch').fadeIn();
        var mapSearch = new GMaps({
          el: '#mapSearch',
          zoom:8,
          lat: 41.9, 
          lng: 1.95007,
        });   

        var latlng = results[0].geometry.location;
        $('#latitude').val(latlng.lat());
        $('#longitude').val(latlng.lng());
        mapSearch.setCenter(latlng.lat(), latlng.lng());
        mapSearch.addMarker({
          lat: latlng.lat(),
          lng: latlng.lng()
        });
        mapSearch.setZoom(12);
      }else{
        // If there're some error, we show a error message
        $('#mapSearchError').slideDown('slow');
      }
    }
  });
});

$('#btnClearRoutes').click(function(){
  map.cleanRoute();
  $("#btnClearRoutes").slideUp();
});

$('#saveUbication').click(function(){
  storeUbication('create');
});

$("#updateUbication").click(function(){
  storeUbication('update');
});

$("#btnNewUbication").click(function(){

  // Prepare a new form to fill it
  clearForm();
  $('#myModalLabel').empty();
  $('#myModalLabel').append("Nueva ubicación");
  $('#saveUbication').show();
  $('#updateUbication').hide();
});

$("#ubicationToSearch").keypress(function( event ) {
  if ( event.which == 13 ) {
     searchPoint();
   }
});

function deleteUbication(id){
  
  var answer = confirm('¿Está seguro que quiere eliminar esta ubicación?');
  if (answer)
  {
    markers[id].setMap(null);
    markers[id] = null;

    $.ajax({
      url: 'server/deleteUbication.php',
      data: {id},
      type: 'POST',
      dataType: 'json',
    });
  }
}

function updateUbication(id){

  var marker;
  $.ajax({
    url: 'server/searchUbicationById.php',
    data: {id},
    type: 'POST',
    dataType: 'json',
    complete: function(data){
      
      marker = data['responseJSON'];
      
      $('#name').val(marker['nam']);
      $('#latitude').val(marker['lat']);
      $('#longitude').val(marker['lon']);
      $('#address').val(marker['dir']);
      $('#web').val(marker['web']);
      $('#phone').val(marker['pho']);
      $('#color').val(marker['col']);
      $('#coment').val(marker['com'].replace("<br />", "", "g"));
      $('#id').val(id);
    },
  });  
  clearForm();
  $('#myModalLabel').empty();
  $('#myModalLabel').append("Editar ubicación");
  $('#saveUbication').hide();
  $('#updateUbication').show();
  $('#myModal').modal('show');
}

function storeUbication (mode){

  if(newUbicationValidation()){

    var name = $('#name').val();
    var latitude = $('#latitude').val();
    var longitude = $('#longitude').val();
    var address = $('#address').val();
    var web = $('#web').val();
    var phone = $('#phone').val();
    var color = $('#color').val();
    var coment = $('#coment').val();
    var id;

    $('#name').val("");
    $('#latitude').val("");
    $('#longitude').val("");
    $('#address').val("");
    $('#web').val("");
    $('#phone').val("");
    $('#color').val("");
    $('#coment').val("");
    $('#mapSearchError').hide();
    $('#mapSearch').hide();

    if(mode === "update"){
      url = "server/updateUbication.php";
      id = $('#id').val();
      markers[id].setMap(null);
      markers[id] = null;
    }else{
      url = 'server/newUbication.php';
    }

    $.ajax({
      url: url,
      data: {name, latitude, longitude, address, web, phone, color, coment, id},
      type: 'POST',
      dataType: 'json',
      complete: function(data) {
        id = data['responseText'];
        var marker = map.addMarker({        
        lat: latitude, 
        lng: longitude,
        title: name,
        animation: google.maps.Animation.DROP,
        icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/'+ color +'/blank.png',
        // When you push a mark in the map appear this html content 
        infoWindow: {
           content: '<h1>' + name + '</h1><br><br>' + 
             'Información: <div style="background-color:#DEDEDE">' +
             address +
             '<br><a href="https://'+ web+'">'+ web +'</a><br>' +
             phone +'</div><br>' + 
             'Comentarios:<br>'+
             '<div style="background-color:#DEDEDE">'+
             coment.replace("\n", "<br />", "g") + 
             '<br></div><br><a onclick="deleteUbication('+id+')" href="#"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>'+
             '<a onclick="updateUbication('+id+')" href="#" style="margin-left:10%;"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>'+
             '<a onclick="route('+latitude+','+longitude+')" href="#" style="margin-left:10%;"><span class="glyphicon glyphicon-road" aria-hidden="true"></span></a>'
          }
        });
        markers[id] = marker; 
        getCountry(latitude, longitude, id);  
      },
    });     
    if(mode !== "update"){       
      map.panTo( new google.maps.LatLng( latitude, longitude ) );
      map.setZoom(11);
    }
    $('#myModal').modal('hide');
  }
}

function getCountry (lat, lng, id){
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'latLng': latlng }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                var fullAddress = results[1].formatted_address;
                var fullAddress = fullAddress.split(',');
                var country = fullAddress[fullAddress.length-1];

                $.ajax({
                  url: 'server/setCountry.php',
                  data: {id, country},
                  type: 'POST',
                  dataType: 'json',
                });
            }
        }
    });
 }

function loadUbication(region){  

    deleteAll();

    GMaps.geocode({
      address: region,
      callback: function(results, status) {
        if (status == 'OK') {

          var latlng = results[0].geometry.location;
          map.setCenter(latlng.lat(), latlng.lng());
          map.setZoom(7);
        }
      }
    });


    $.ajax({
      url: 'server/getUbication.php',
      data: {region},
      type: 'POST',
      dataType: 'json',
      complete: function(data){
        data = data['responseJSON'];
        $.each(data , function(i, v) {
        // Add a marker for each client BD file
         var marker = map.addMarker({        
          lat: v['lat'], 
          lng: v['lon'],
          title: v['nam'],
          animation: google.maps.Animation.DROP,
          icon: 'http://gmaps-samples.googlecode.com/svn/trunk/markers/'+ v['col'] +'/blank.png',
          // icon: 'images/circle.png',
          // When you push a mark in the map appear this html content 
          infoWindow: {
           content: '<h1>' + v['nam'] + '</h1><br><br>' + 
             'Información: <div style="background-color:#DEDEDE">' +
             v['dir'] +
             '<br><a href="https://'+ v['web']+'">'+ v['web'] +'</a><br>' +
             v['pho'] +'</div><br>' + 
             'Comentarios:<br>'+
             '<div style="background-color:#DEDEDE">'+
             v['com']+
             '<br></div><br><a onclick="deleteUbication('+v['id']+')" href="#"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></a>'+
             '<a onclick="updateUbication('+v['id']+')" href="#" style="margin-left:10%;"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span></a>'+
             '<a onclick="route('+v['lat']+','+v['lon']+')" href="#" style="margin-left:10%;"><span class="glyphicon glyphicon-road" aria-hidden="true"></span></a>'
          }
        });
         markers[v['id']] = marker;       
       });
      }
    });
}

function deleteAll(){
  $.each(countries, function(key, value){
      value.setMap(null);      
  });
  countries = [];
  $.each(markers, function(key, value){
    if(typeof value !== "undefined" && value != null)
      value.setMap(null);    
  });
  markers = [];
}

function route(latitude, longitude){

  var ubication = Array(latitude, longitude);
  routes.push(ubication);
  if(routes.length == 2){
    map.drawRoute({
      origin: routes[0],
      destination: routes[1],
      travelMode: 'driving',
      strokeColor: $("#colorRoute").val(),
      strokeOpacity: $("#opacity").val()/10,
      strokeWeight: $("#size").val()
    });
    routes = [];
    $("#btnClearRoutes").slideDown();
  }else{
    // var mapRoutesOption = new GMaps({
    //     div: '#mapRoutesOption',
    //     zoom: 6,
    //     lat: 40.4167754, 
    //     lng: -3.7037901999999576,
    //     width: '400px',
    //     height: '200px',
    //     zoom: 12,
    //     zoomControl: true,
    //     zoomControlOpt: {
    //         style: 'SMALL',
    //         position: 'TOP_LEFT'
    //     },
    //     panControl: false
    //   });       
console.log("despues: "+routes.length);
    $("#modalRoute").modal('show');          
  }
}

function searchPoint(){

  GMaps.geocode({
    address: $('#ubicationToSearch').val(),
    callback: function(results, status) {
      if (status == 'OK') {       
        var latlng = results[0].geometry.location;
        map.setCenter(latlng.lat(), latlng.lng());        
        map.setZoom(12);
      }else{
        alert("No se puede encontrar la ubicación que ha introducido");
      }
    }
  });
  $('#ubicationToSearch').val("")
}

function importBD(){

  var file = $('#importFile').prop('files')[0];  
  var form_data = new FormData();                  
  form_data.append('file', $('#importFile').prop('files')[0]);
  console.log(form_data);

  if(typeof file !== "undefined"){
    $.ajax({
        url: 'server/import.php',
        data: {form_data},
        cache: false,
                contentType: false,
                processData: false,
        type: 'GET',
        dataType: 'json',
        complete: function(data){
          var responseJSON = data['responseJSON'];
          $.each(responseJSON, function(key, val){
           getCountry(val['lat'], val['lon'], val['id']);
          });
        }
    });
  }else{
    alert("No ha seleccionado ningun archivo");
  }
}