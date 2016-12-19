/**
 * Created by Annu on 09-10-2016.
 */
vibexx.controller("vibexxcontrol", function($scope,vibexxfactory){
    var promise = vibexxfactory.getDataJson();
    function success(data){
        $scope.redmi = data;
    }
    function error(err){
        $scope.redmi = err;
    }
    promise.then(success,error);
});/**
 * Created by RIZWAN on 10-10-2016.
 */
