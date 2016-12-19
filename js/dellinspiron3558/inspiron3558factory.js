/**
 * Created by Annu on 09-10-2016.
 */
inspiron3558.factory("inspiron3558factory", function ($http,$q) {
    var object = {
        getDataJson: function () {
            var defered = $q.defer();
            $http.get('json/Dell Inspiron 3558 Notebook (5th Gen Intel Core i3- 4GB RAM- 1TB HDD- 39.62 cm(15.6)- Ubuntu) (Black)output.json').success(function (data) {
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