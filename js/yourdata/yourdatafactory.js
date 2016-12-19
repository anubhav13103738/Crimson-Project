/**
 * Created by Annu on 12/19/2016.
 */
yourdata.factory('yourdatafac',function ($http,$q) {
   return {
       
       getdata:function () {
           var defer=$q.defer();
           $http.get('yourjson').success(function(data){
               defer.resolve(data);
           }).error(function(err){
               defer.reject(err);
           });
           return defer.promise;
       }
    
   } 
});