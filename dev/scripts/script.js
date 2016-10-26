var brewNoculars = {};

var breweriesNearBy = {};


breweriesNearBy.mapMarkers = [];



//FourSquare API Starts here!
breweriesNearBy.getBreweries = function (userLocation) {
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
		console.log(brewery);
        var breweryGeneral = brewery.response.venues; 
        console.log(breweryGeneral);
        breweryGeneral.forEach(function(bGData){
        //     var $bDescription = bData.brewery.description;
            var $bRealName = bGData.name;
            var $webSite = bGData.url;
            var $location = bGData.location.address;
            var $twitter = bGData.contact.twitter;
            var $phone = bGData.contact.formattedPhone;
            console.log($bRealName, $webSite, $location, $twitter,$phone);
        });

	})
}

// Brewery DB API starts here!
breweriesNearBy.getInfo = function () {
	$.ajax ({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data:{
			reqUrl: 'http://api.brewerydb.com/v2/search/geo/point',
			params: {
				lat:'43.6532',
				lng:'-79.3832',
				key: '3dae318cdfd5f407dccf3b5974924616'
			}
		}

	}).then (function(bInfo){
		console.log(bInfo);
	})
}




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
  brewNoculars.init();
})

// Idea = the drop down menu is a call to the brewery DB app == AJAX request to search the name and loads the specific brewery -- description,est,image available
=======
jellp  -  pathspec 'origin' did not match any file(s) known to git.
error: pathspec 'master' did not match any file(s) known to git.
>>>>>>> 6cfb6e2fb164f3d58fe26c950c59dfc8d9b7880f
