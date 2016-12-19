/**
 * Created by Annu on 09-10-2016.
 */
philipst.controller("philipstcontrol", function($scope,philipstfactory){
    var promise = philipstfactory.getDataJson();
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
