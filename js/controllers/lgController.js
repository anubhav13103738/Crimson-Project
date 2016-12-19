shopping.controller("lgctrl",function($scope,lgfactory){
 var promise = lgfactory.getDataJson();
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