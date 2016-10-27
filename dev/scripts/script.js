var brewNoculars = {};

brewNoculars.mapMarkers = [];
// brewNoculars.mapBounds = new google.maps.LatLngBounds();


//FourSquare API Starts here!
brewNoculars.getBreweries = function(userLocation) {
	$.ajax ({
		url:'https://api.foursquare.com/v2/venues/search?client_id=XC45QHEBXODZWSFXRYRBKJCGDNOXYMLR14155RH1SXZ0CPIC&client_secret=BVUIPRJESP1EX4L0GLBO4VLDV0EEIYABKBS0KJOTUFCWV143&v=20160730',
		method: 'GET',
		dataType:'json',
		data: {
			// near:'Toronto, ON', // userlocation should be here, passed in from GeoLocation app
			ll: userLocation.lat + ',' + userLocation.lon,
			query:'brewery',
			limit:50,
			categoryID:'50327c8591d4c4b30a586d5d'
		}
	}).then (function(brewery){
		// console.log('this is brewery', breweryG);
        var breweryGeneral = brewery.response.venues; 
        console.log('this is breweryGeneral', breweryGeneral);
      

        breweryGeneral.forEach(function(bGData){
        	// console.log("dataaaaa",bGData)
        	  brewNoculars.handlebars(bGData)
            // var $bDescription = bGData.brewery.description;
            // var $bRealName = bGData.name;
            // var $bWebSite = bGData.url;
            // var $bLocation = bGData.location.address;
            // var $bTwitter = bGData.contact.twitter;
            // var $bPhone = bGData.contact.formattedPhone;
            // $bRealName = 'sarah'
            // console.log($bRealName, $bWebSite, $bLocation, $bTwitter, $bPhone);
        });
	})
}

// Brewery DB API starts here!
brewNoculars.getInfo = function (userLocation) {
	$.ajax ({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data:{
			reqUrl: 'http://api.brewerydb.com/v2/search/geo/point',
			params: {
				lat: userLocation.lat,
				lng: userLocation.lon,
				radius:5,
				key: '3dae318cdfd5f407dccf3b5974924616'
			}
		}
	}).then(function(bInfo){
		var brewerySpecifics = bInfo.results;
		console.log(brewerySpecifics);
		brewerySpecifics.forEach(function(bData){
			var $bImages = bData.brewery.images.mediumSquare; //some breweries do not have images, so if erroring to undefined, then we need to code it to the image placeholder path
			var $bName = bData.brewery.name;
			var $bEstablished = bData.brewery.established;
			var $bOrganic = bData.brewery.isOrganic;
			var $bDescription = bData.brewery.description;
		// console.log($bDescription,$bName,$bOrganic,$bImages,$bEstablished);
		});
	})
}

//GeoLocation API starts Here!!--------------------------------------------------------------->

//API key: AIzaSyCW8tHjXmHvzEH5qsjFzSH4NN7PVfumqu0

brewNoculars.handlebars = function(breweryGeneral){
	console.log("passed data", breweryGeneral);
	 var $bRealName = breweryGeneral.name;
	var myTemplate = $('#myTemplate').html();
	var template = Handlebars.compile(myTemplate);
	var renderedTemplate = template(breweryGeneral);
	console.log('this is brewery', template)
	$('footer').append(renderedTemplate);
};

//GeoLocation API starts Here!!--------------------------------------------------------------->
//API key: AIzaSyCW8tHjXmHvzEH5qsjFzSH4NN7PVfumqu0

// user enters site, site calculates users location

brewNoculars.getLocation = function() {

	// Check to see if the browser supports the GeoLocation API.
	if ("geolocation" in navigator) {
		// Get the location
		navigator.geolocation.getCurrentPosition(function(position) {
			console.log("position", position)
			var lat = position.coords.latitude;
			var lon = position.coords.longitude;
			brewNoculars.location = {
				lat: lat,
				lon: lon
			};
			// console.log("lat" + lat);
			// console.log("lon" + lon);

			// // Show the map
			brewNoculars.showMap(lat, lon);
		});

	} else {
		// Print out a message to the user.
		$('.intro').text('Your browser does not support GeoLocation. Use the search below');
	}

}

// Search field Options----------------------------------------------------------------------->

brewNoculars.getSearchResults = function(search) {
  console.log("brewNoculars.mapMarkers", brewNoculars.mapMarkers);
  $.ajax({
    url: 'https://proxy.hackeryou.com',
    method: 'GET',
    dataType: 'json',
    data: {
      reqUrl: 'https://maps.googleapis.com/maps/api/geocode/json',
      params: {
        key: 'AIzaSyCW8tHjXmHvzEH5qsjFzSH4NN7PVfumqu0',
        address: search
      }
    }
  }).then(function(searchRes){

    console.log("search results", searchRes);

    var addressLat = searchRes.results[0].geometry.location.lat;
    var addressLon = searchRes.results[0].geometry.location.lng;
    brewNoculars.location = {
        lat: addressLat,
        lon: addressLon
      };
      for (var i = 0; i < brewNoculars.mapMarkers.length; i++){
        brewNoculars.mapMarkers[i].setMap(null);
      }
      delete brewNoculars.mapBounds;
      brewNoculars.mapBounds = new google.maps.LatLngBounds();




    // Add a Marker to the Map with Search Results
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(addressLat, addressLon),
        map: brewNoculars.map,
        title: "You're Here!",
        icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    });
    brewNoculars.mapMarkers.push(marker);
    brewNoculars.mapBounds.extend(marker.position);
    brewNoculars.map.setCenter(marker.getPosition());


    brewNoculars.getBreweries(brewNoculars.location);
    brewNoculars.getInfo(brewNoculars.location);

  })
}

brewNoculars.getAddress = function() {
  $('form').on('submit', function(e){
    e.preventDefault();
    var searchValue = $('#user-input').val() 
    // var toronto = searchValue + " Toronto, Ontario";
    console.log("searchValue:" + searchValue);

    brewNoculars.getSearchResults(searchValue);
  });
}

	//End of Search Area---------------------------------------------------------------------------->


	// Show the user's position (Geolocation) on a Map.--------------------------------------------->
 brewNoculars.showMap = function(lat, lon) {
			// Create a LatLng object with the GPS coordinates.
		 var myLatLng = new google.maps.LatLng(lat, lon);
		 brewNoculars.mapBounds = new google.maps.LatLngBounds();
		 

			// Create the Map Options
		  var mapOptions = {
		    zoom: 15,
		    center: myLatLng,
		    mapTypeId: google.maps.MapTypeId.ROADMAP
		  };

			// Generate the Map
		  brewNoculars.map = new google.maps.Map(document.getElementById('map'), mapOptions);

			// Add a Marker to the Map
		  var marker = new google.maps.Marker({
		      position: myLatLng,
		      map: brewNoculars.map,
		      title: 'Found you!',
		      animation: google.maps.Animation.DROP,
		      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
		  });

			//Adding all the Location info to the Map
		  brewNoculars.mapMarkers.push(marker);
		  brewNoculars.mapBounds.extend(marker.position);

console.log("myLatLng ", myLatLng);

}

// console.log("MAP " + brewNoculars.mapMarkers);
	//When the Page Loads start the App
	//geolocator
brewNoculars.init = function() {
  brewNoculars.getLocation();
  brewNoculars.getAddress();
};


$(function() {
	//brewNoculars.getBreweries();
  brewNoculars.init();
})

// address search needs have City included, or add in auto complete for user completing City (with Google Places, etc). There is a JS library. Ask user to use City!
// map needs to plot the breweries too