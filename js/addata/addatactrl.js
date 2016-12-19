/**
 * Created by Annu on 12/18/2016.
 */
var addata = angular.module('addata',[]);

addata.controller('addatactrl',function ($scope,addatafac) {
   var promise = addatafac.getDataJson();
    promise.then(function (data) {
        $scope.data=data;
    },function(err){
        $scope.error = err;
    });
});