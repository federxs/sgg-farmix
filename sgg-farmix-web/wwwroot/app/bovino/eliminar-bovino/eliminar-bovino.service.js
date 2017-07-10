(function () {
    'use strict';

    angular
        .module('app')
        .factory('eliminarBovinoService', eliminarBovinoService);

    eliminarBovinoService.$inject = ['$http'];

    function eliminarBovinoService($http) {
        var service = {
            getData: getData
        };

        return service;

        function getData() { }
    }
})();