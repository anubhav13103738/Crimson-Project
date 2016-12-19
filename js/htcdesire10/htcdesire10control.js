
htcdesire10.controller("htcdesire10control", function($scope,htcdesire10factory){
    var promise = htcdesire10factory.getDataJson();
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
