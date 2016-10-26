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
// breweriesNearBy.getInfo = function () {
// 	$.ajax ({
// 		url: 'http://proxy.hackeryou.com',
// 		method: 'GET',
// 		dataType: 'json',
// 		data:{
// 			reqUrl: 'http://api.brewerydb.com/v2/search/geo/point',
// 			params: {
// 				lat:'43.6532',
// 				lng:'-79.3832',
// 				key: '3dae318cdfd5f407dccf3b5974924616'
// 			}
// 		}

// 	}).then (function(bInfo){
// 		console.log(bInfo);
// 	})
// }

// breweriesNearBy.getInfo = function () {
// 	$.ajax ({
// 		url: 'http://proxy.hackeryou.com',
// 		method: 'GET',
// 		dataType: 'json',
// 		data:{
// 			reqUrl: 'http://api.brewerydb.com/v2/search/',
// 			params: {
// 				q:'brewery',
// 				key: '3dae318cdfd5f407dccf3b5974924616'
// 			}
// 		}

// 	}).then (function(bInfo){
// 		console.log(bInfo);
// 	})
// }

breweriesNearBy.getInfo = function () {
	$.ajax ({
		url: 'http://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data:{
			reqUrl: 'http://api.brewerydb.com/v2/breweries/',
			params: {
				name:'bellwoods brewery',
				key: '3dae318cdfd5f407dccf3b5974924616'
			}
		}

	}).then (function(bInfo){
		console.log(bInfo);
	})
}

// Idea = the drop down menu is a call to the brewery DB app == AJAX request to search the name and loads the specific brewery -- description,est,image available
