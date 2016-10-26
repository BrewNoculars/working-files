var brewNoculars = {};

var breweriesNearBy = {};


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
			console.log(bData);
			var $bImages = bData.brewery.images.medium; //some breweries do not have images, so if erroring to undefined, then we need to code it to the image placeholder path
			var $bName = bData.brewery.name;
			var $bEstablished = bData.brewery.established;
			var $bOrganic = bData.brewery.isOrganic;
			var $bDescription = bData.brewery.description;
		// console.log($bDescription,$bName,$bOrganic,$bImages,$bEstablished);
		});
	})
}
