/**
 * Created by uzer-y on 10/24/15.
 */

app.directive('reviewList', function () {
    return {
        restrict: 'E',
        scope: {
            review: '=',
            readonly: '='
        },
        templateUrl: '/js/reviews/reviews.directive.html',
        link: function(scope, element, attributes){
            function updateStars() {
                scope.stars = [];
                scope.max = 5;
                for (var i = 0; i < scope.max; i++) {
                    scope.stars.push(
                        {
                            filled: i < scope.review.stars
                        });
                }
            }
            //scope.toggle = function(index) {
            //    if (scope.readonly == undefined || scope.readonly === false){
            //        scope.product.ratings = index + 1;
            //        scope.onRatingsSelect({
            //            rating: index+1
            //        });
            //    }
            //};
            scope.$watch('review.stars', function(oldValue, newValue){
                if (newValue) {
                    console.log("yo");
                    updateStars()
                }
            });
        }
    };
});
