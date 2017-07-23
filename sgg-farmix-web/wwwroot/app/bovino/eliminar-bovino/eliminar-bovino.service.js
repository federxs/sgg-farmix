(function () {
    'use strict';

    angular
        .module('app')
        .factory('eliminarBovinoService', eliminarBovinoService);

    eliminarBovinoService.$inject = ['$http'];

    function eliminarBovinoService($http) {
        var service = {
            inicializar: inicializar,
            eliminar: eliminar
        };

        return service;

        function inicializar() { }

        function eliminar() { }
    }
})();