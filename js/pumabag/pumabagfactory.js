pumabag.factory("pumabagfactory", function ($http,$q) {
    var object = {
        getDataJson: function () {
            var defered = $q.defer();
            $http.get('json/pumabagoutput.json').success(function (data) {
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
});/**
 * Created by RIZWAN on 10-10-2016.
 */
