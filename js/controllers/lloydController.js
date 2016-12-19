shopping.controller("lloydctrl",function($scope,lloydfactory){
 var promise = lloydfactory.getDataJson();
        //alert("apple Controller called");
        
        function success(data){
         
         $scope.phone = data;
            //alert("server data");
        }
        function error(error){
            $scope.phone = error;
        }
        promise.then(success,error);
});