'use strict';


app.factory('AdminFactory', function( $http ) {
	
	var service =  {
		getAllUsers : getAllUsers,
		getAllOrders: getAllOrders
	};

	
	//////////////////////////////

	return service;

	function getAllUsers () {
		return $http.get('/api/users/')
			.then(function(users){
				return users.data;
			});
	};

	function getAllOrders () {
		return $http.get('/api/order/')
			.then(function(order){
				return order.data;
			})
	};


});