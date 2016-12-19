/**
 * Created by Annu on 09-10-2016.
 */
nikefp.controller("nikefpcontrol", function($scope,nikefpfactory){
    var promise = nikefpfactory.getDataJson();
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
