var directionsDisplay;
var directionsService;
var map;


function initMap() {
	console.log("b");
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      scrollwheel: false,
      zoom: 8
    });
    directionsDisplay.setMap(map);    
}


function submit () {
	console.log("submit");
	submitService();
//	$.get( "https://maps.googleapis.com/maps/api/distancematrix/json?origins=75+9th+Ave+New+York,+NY&destinations=Bridgewater+Commons,+Commons+Way,+Bridgewater,+NJ|The+Mall+At+Short+Hills,+Morris+Turnpike,+Short+Hills,+NJ|Monmouth+Mall,+Eatontown,+NJ|Westfield+Garden+State+Plaza,+Garden+State+Plaza+Boulevard,+Paramus,+NJ|Newport+Centre+Mall,+Jersey+City,+NJ&departure_time=1541202457&traffic_model=best_guess&key=AIzaSyCC5H1OyVzoaI0nVdGPpmoDGrjK436Rpzg", function( data ) {
//		console.log(data);
//	});

	
//	headers: {
//        'Access-Control-Allow-Origin': '*'
//    },
    
}

function submitService () {
	console.log("aa");
	
	
	var start = document.getElementById('start').value;
	var end = document.getElementById('end').value;
	
	var request = {
		origin: start,
		destination: end,
		travelMode: 'DRIVING',
		drivingOptions: {
		    departureTime: new Date()
		  }
	};
	
	directionsService.route(request, function(result, status) {
		console.log(status);
		console.log(result);
		
		if (status == 'OK') {
			directionsDisplay.setDirections(result);
		}
	});
}

// search location and place a marker on the map
function searchLocation () {

	var locationSearch = document.getElementById('locationSearch').value;
	
	
}



function saveLine () {
	console.log("saving data...");
	
	$.post( "line/save", 
			{ 
				id: -1,
				name: "test",
				points: "{'point':'1'}" 
			}, 
			function( data ) {
				console.log( data );	
			});
	
}



