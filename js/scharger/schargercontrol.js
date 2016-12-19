/**
 * Created by Annu on 09-10-2016.
 */
scharger.controller("schargercontrol", function($scope,schargerfactory){
    var promise = schargerfactory.getDataJson();
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
