/**
 * Created by Annu on 09-10-2016.
 */
dlink.controller("dlinkcontrol", function($scope,dlinkfactory){
    var promise = dlinkfactory.getDataJson();
    function success(data){
        $scope.redmi = data;
    }
    function error(err){
        $scope.redmi = err;
    }
    promise.then(success,error);
});