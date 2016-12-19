shopping.controller("samsungCtrl",function($scope,samfactory){
 var promise = samfactory.getDataJson();
        //alert("sam Controller called");
        
        function success(data){
         
         $scope.phone = data;
            //alert("server data");
        }
        function error(error){
            $scope.phone = error;
        }
        promise.then(success,error);
});