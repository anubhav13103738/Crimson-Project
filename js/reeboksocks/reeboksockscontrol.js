/**
 * Created by Annu on 09-10-2016.
 */
reeboksocks.controller("reeboksockscontrol", function($scope,reeboksocksfactory){
    var promise = reeboksocksfactory.getDataJson();
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
