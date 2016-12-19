/**
 * Created by Annu on 10-10-2016.
 */
whowillcry.factory("whowillcryfactory", function ($http,$q) {
    var object = {
        getDataJson: function () {
            var defered = $q.defer();
            $http.get('json/whowillcryoutput.json').success(function (data) {
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