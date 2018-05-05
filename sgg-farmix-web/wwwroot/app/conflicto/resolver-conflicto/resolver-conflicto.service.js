(function () {
    'use strict';

    angular
        .module('app')
        .factory('resolverConflicto', resolverConflicto);

    resolverConflicto.$inject = ['$http'];

    function resolverConflicto($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();