/**
 * Created by Annu on 10-10-2016.
 */
whowillcry.controller("whowillcrycontrol", function($scope,whowillcryfactory){
    var promise = whowillcryfactory.getDataJson();
    function success(data){
        $scope.redmi = data;
    }
    function error(err){
        $scope.redmi = err;
    }
    promise.then(success,error);
});