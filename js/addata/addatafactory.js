/**
 * Created by Annu on 12/18/2016.
 */
addata.factory('addatafac',function($http,$q){
    return{
        getDataJson:function () {
            var defer=$q.defer();
            $http.get('dbjson').success(function(data){
                defer.resolve(data);
            }).error(function(err){
                defer.reject(err);
            });
            return defer.promise;
        }
    }
});