/**
 * Created by Annu on 09-10-2016.
 */
samsungon5.controller("samsungon5control", function($scope,samsungon5factory){
    var promise = samsungon5factory.getDataJson();
    function success(data){
        $scope.redmi = data;
    }
    function error(err){
        $scope.redmi = err;
    }
    promise.then(success,error);
});