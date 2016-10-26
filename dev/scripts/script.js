var brewNoculars = {};
var breweriesNearBy = {};

breweriesNearBy.mapMarkers = [];



//FourSquare API Starts here!
breweriesNearBy.getBreweries = function(userLocation) {
	$.ajax ({
		url:'https://api.foursquare.com/v2/venues/search?client_id=XC45QHEBXODZWSFXRYRBKJCGDNOXYMLR14155RH1SXZ0CPIC&client_secret=BVUIPRJESP1EX4L0GLBO4VLDV0EEIYABKBS0KJOTUFCWV143&v=20160730',
		method: 'GET',
		dataType:'json',
		data: {
			near:'Toronto, ON', // userlocation should be here, passed in from GeoLocation app
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
        	  breweriesNearBy.handlebars(bGData)
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
breweriesNearBy.getInfo = function (latitude, longitude) {
	$.ajax ({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data:{
			reqUrl: 'http://api.brewerydb.com/v2/search/geo/point',
			params: {
				lat:'43.6532',
				lng:'-79.3832',
				radius:5,
				key: '3dae318cdfd5f407dccf3b5974924616'
			}
		}
	}).then(function(bInfo){
		var brewerySpecifics = bInfo.data;
		console.log(brewerySpecifics);
		brewerySpecifics.forEach(function(bData){

			var $bImages = bData.brewery.images.medium; //some breweries do not have images, so if erroring to undefined, then we need to code it to the image placeholder path
			var $bName = bData.brewery.name;
			var $bEstablished = bData.brewery.established;
			var $bOrganic = bData.brewery.isOrganic;
			var $bDescription = bData.brewery.description;
		// console.log($bDescription,$bName,$bOrganic,$bImages,$bEstablished);
		});
	})
}

breweriesNearBy.handlebars = function(breweryGeneral){
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
			// brewNoculars.getPlace();
			console.log("lat" + lat);
			console.log("lon" + lon);

			// // Show the map
			brewNoculars.showMap(lat, lon);
		});
	} else {
		// Print out a message to the user.
		document.write('Your browser does not support GeoLocation :(');
	}

}

// Search field Options----------------------------------------------------------------------->

brewNoculars.getSearchResults = function(search) {
  console.log("breweriesNearBy.mapMarkers", brewNoculars.mapMarkers);
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

    console.log("search results", search);

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


    brewNoculars.getPlace();


  })
}

brewNoculars.getAddress = function() {
  $('form').on('submit', function(e){
    e.preventDefault();
    var searchValue = $('#user-input').val() 
    // var toronto = searchValue + " Toronto, Ontario";
    console.log("searchValue:" + searchValue);

    brewNoculars.getSearchResults(toronto);
  });
}

	//End of Search Area---------------------------------------------------------------------------->


	// Show the user's position (Geolocation) on a Map.--------------------------------------------->
 brewNoculars.showMap = function(lat, lon) {
			// Create a LatLng object with the GPS coordinates.
		 var myLatLng = new google.maps.LatLng(lat, lon);
		 

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
	breweriesNearBy.getBreweries();
  // brewNoculars.init();
})

