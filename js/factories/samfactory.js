shopping.factory("samfactory",function($http,$q){
 var object={
  getDataJson:function(){
   var defered = $q.defer();
   $http.get("server/server.json").success(function(data){
    phone = data;
    defered.resolve(data);
   }).error(function(err){
    phone = err;
    defered.reject(err);
   });
   return defered.promise;
  }
 }
 return object;
});