/**
 * Created by Annu on 09-10-2016.
 */
iphonefs.controller("iphonefscontrol", function($scope,iphonefsfactory){
    var promise = iphonefsfactory.getDataJson();
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
