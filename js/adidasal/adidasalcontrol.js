
adidasal.controller("adidasalcontrol", function($scope,adidasalfactory){
    var promise = adidasalfactory.getDataJson();
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
