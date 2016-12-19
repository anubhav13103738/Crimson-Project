/**
 * Created by Annu on 09-10-2016.
 */
inspiron3558.controller("inspiron3558control", function($scope,inspiron3558factory){
    var promise = inspiron3558factory.getDataJson();
    function success(data){
        $scope.redmi = data;
    }
    function error(err){
        $scope.redmi = err;
    }
    promise.then(success,error);
});