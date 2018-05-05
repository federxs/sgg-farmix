(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarConflicto', consultarConflicto);

    consultarConflicto.$inject = ['$http'];

    function consultarConflicto($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();