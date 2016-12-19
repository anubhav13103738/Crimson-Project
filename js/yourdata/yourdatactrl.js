/**
 * Created by Annu on 12/19/2016.
 */
var yourdata = angular.module('yourdata',[]);
yourdata.controller('yourdatactrl',function ($scope,yourdatafac) {
   var promise = yourdatafac.getdata();
    promise.then(function (data) {
        $scope.data=data;
    },function(err){
        $scope.error = err;
    });
});