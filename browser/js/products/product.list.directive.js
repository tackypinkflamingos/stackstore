/**
 * Created by uzer-y on 10/24/15.
 */
app.directive('productList', function (CartFactory) {
    return {
        restrict: 'E',
        scope: {
            product: '='
        },
        link: function(scope, element, attr) {
          scope.add = CartFactory.addOne;
        },
        templateUrl: '/js/products/product.list.directive.html'
    };
});
