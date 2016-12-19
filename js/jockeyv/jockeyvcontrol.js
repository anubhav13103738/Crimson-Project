
jockeyv.controller("jockeyvcontrol", function($scope,jockeyvfactory){
    var promise = jockeyvfactory.getDataJson();
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
