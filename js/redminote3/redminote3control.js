/**
 * Created by Annu on 08-10-2016.
 */
redminote3.controller("redminote3control", function($scope,redminote3factory){
    var promise = redminote3factory.getDataJson();
    function success(data){
        $scope.redmi = data;
    }
    function error(err){
        $scope.redmi = err;
    }
    promise.then(success,error);
});