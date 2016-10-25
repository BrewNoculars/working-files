var brewNoculars = {};

var breweriesNearBy = {};

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
