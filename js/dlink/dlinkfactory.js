/**
 * Created by Annu on 09-10-2016.
 */
dlink.factory("dlinkfactory", function ($http,$q) {
    var object = {
        getDataJson: function () {
            var defered = $q.defer();
            $http.get('json/dlinkoutput.json').success(function (data) {
                redmi = data;
                defered.resolve(data);
                //alert("hit server");
            }).error(function (error) {
                redmi = error;
                defered.reject(error);
            });
            return defered.promise;
        }
    }

    return object;
});