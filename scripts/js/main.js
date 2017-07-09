var directionsDisplay;
var directionsService;
var map;

var points = [];

// initialize map, location search service, location listener.
function initMap() {
	console.log("initializing map...");
	directionsDisplay = new google.maps.DirectionsRenderer();
	directionsService = new google.maps.DirectionsService();
	// Create a map object and specify the DOM element for display.
	map = new google.maps.Map(document.getElementById('map'), {
		center : {
			lat : -34.397,
			lng : 150.644
		},
		zoom : 8
	});
	directionsDisplay.setMap(map);

	// <input> for location search auto-complete
	var input = document.createElement("input");
	input.type = "text";
	input.id = "searchInput";
	input.className = "form-control";
	input.style.width = "50%";
	input.style['margin-top'] = "6px";
	
//	$(input).css({top:'10px'}); // make a little space on top
	
	var searchBox = new google.maps.places.SearchBox(input);
	map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);

	
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

// submit points to Google Map API to get route.
function submitService() {
	var waypoints = [];
	if (points.length > 2) {
		for (var i = 1; i < points.length - 1; i++) {
			waypoints.push({ 
				stopover: true, 
				location: { placeId: points[i].place_id } 
			});
		}
	}

	var request = {
		origin: { placeId: points[0].place_id },
		destination : { placeId: points[points.length-1].place_id },
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

// 
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


function initSortList() {
	// make list sortable
	$("#sortList").sortable({
//		change: function( event, ui ) {
//			console.log("changed");
//		},
		deactivate: function( event, ui ) {
			// refresh google route if there is one.
		}
	});
	
	// add sort listener 
	
}

$( document ).ready(function() {
    console.log( "ready!" );
    initSortList();
});

function loadTrip () {
	var tripId = $("#searchTripIdInput").val();
	$.get("line/" + tripId, function(data) {
		$(".result").html(data);
		alert("Load was performed.");
	});
}