(function () {
    'use strict';

    angular
        .module('app')
        .factory('eliminarBovinoService', eliminarBovinoService);

    eliminarBovinoService.$inject = ['$http', 'portalService'];

    function eliminarBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            eliminar: eliminar
        };

        return service;

        function inicializar(idBovino) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initDetalle',
                params: { idBovino: idBovino }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function eliminar() { }
    }
})();