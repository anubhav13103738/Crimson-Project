/**
 * Created by Annu on 09-10-2016.
 */
coscorio.controller("coscoriocontrol", function($scope,coscoriofactory){
    var promise = coscoriofactory.getDataJson();
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
