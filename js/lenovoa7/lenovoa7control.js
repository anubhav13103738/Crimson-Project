/**
 * Created by Annu on 09-10-2016.
 */
lenova7.controller("lenova7control", function($scope,lenova7factory){
    var promise = lenova7factory.getDataJson();
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
