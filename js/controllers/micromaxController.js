shopping.controller("micromaxctrl",function($scope,micromaxfactory){
 var promise = micromaxfactory.getDataJson();
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