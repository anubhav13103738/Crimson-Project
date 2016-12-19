shopping.controller("xiaomiCtrl",function($scope,xiaomifactory){
 var promise = xiaomifactory.getDataJson();
        //alert("xiaomi Controller called");
        
        function success(data){
         
         $scope.phone = data;
            //alert("server data");
        }
        function error(error){
            $scope.phone = error;
        }
        promise.then(success,error);
});