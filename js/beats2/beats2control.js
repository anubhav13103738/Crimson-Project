/**
 * Created by Annu on 09-10-2016.
 */
beats2.controller("beats2control", function($scope,beats2factory){
    var promise = beats2factory.getDataJson();
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
