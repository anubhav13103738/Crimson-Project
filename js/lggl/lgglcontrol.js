
lggl.controller("lgglcontrol", function($scope,lgglfactory){
    var promise = lgglfactory.getDataJson();
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
