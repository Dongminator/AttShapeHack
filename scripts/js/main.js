var directionsDisplay;
var directionsService;
var map;

var points = [];


function initMap() {
	console.log("b");
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	// Create a map object and specify the DOM element for display.
	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -34.397,
			lng : 150.644
		},
		scrollwheel : false,
		zoom : 8
	});
	directionsDisplay.setMap(map);

	// Location search box
	var input = document.getElementById('locationSearch');
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

	// Bias the SearchBox results towards current map's viewport.
	map.addListener('bounds_changed', function() {
		searchBox.setBounds(map.getBounds());
	});

	var markers = [];
	searchBox.addListener('places_changed', function() {
		console.log("z");
		var places = searchBox.getPlaces();

		if (places.length == 0) {
			return;
		}

		console.log(places);

		var bounds = new google.maps.LatLngBounds();
		var place = places[0];
		if (!place.geometry) {
			console.log("Returned place contains no geometry");
			return;
		}
		var icon = {
			url : place.icon,
			size : new google.maps.Size(71, 71),
			origin : new google.maps.Point(0, 0),
			anchor : new google.maps.Point(17, 34),
			scaledSize : new google.maps.Size(25, 25)
		};

		// Create a marker for each place.
		markers.push(new google.maps.Marker({
			map : map,
			icon : icon,
			title : place.name,
			position : place.geometry.location
		}));

		if (place.geometry.viewport) {
			// Only geocodes have viewport.
			bounds.union(place.geometry.viewport);
		} else {
			bounds.extend(place.geometry.location);
		}

		map.fitBounds(bounds);
		
		points.push(place);

	});
}

function searchPlaceListener () {
	
}

function submit() {
	console.log("submit");
	submitService();
	//	$.get( "https://maps.googleapis.com/maps/api/distancematrix/json?origins=75+9th+Ave+New+York,+NY&destinations=Bridgewater+Commons,+Commons+Way,+Bridgewater,+NJ|The+Mall+At+Short+Hills,+Morris+Turnpike,+Short+Hills,+NJ|Monmouth+Mall,+Eatontown,+NJ|Westfield+Garden+State+Plaza,+Garden+State+Plaza+Boulevard,+Paramus,+NJ|Newport+Centre+Mall,+Jersey+City,+NJ&departure_time=1541202457&traffic_model=best_guess&key=AIzaSyCC5H1OyVzoaI0nVdGPpmoDGrjK436Rpzg", function( data ) {
	//		console.log(data);
	//	});

	//	headers: {
	//        'Access-Control-Allow-Origin': '*'
	//    },

}

function submitService() {
	console.log("aa");

	var waypoints = [];
	if (points.length > 2) {
		for (var i = 1; i < points.length - 1; i++) {
			
			
			waypoints.push({ 
				stopover: true, 
				location: { placeId: points[i].place_id } 
			});
		}

	}
	var start = document.getElementById('start').value;
	var end = document.getElementById('end').value;

	var request = {
		origin: {
			placeId: points[0].place_id
		},
		destination : {
			placeId: points[points.length-1].place_id
		},
		waypoints : waypoints,
		travelMode : 'DRIVING',
		drivingOptions : {
			departureTime : new Date()
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
function searchLocation() {

	var locationSearch = document.getElementById('locationSearch').value;

}

function saveLine() {
	console.log("saving data...");

	$.post("line/save", {
		id : -1,
		name : "test",
		points : "{'point':'1'}"
	}, function(data) {
		console.log(data);
	});

}
