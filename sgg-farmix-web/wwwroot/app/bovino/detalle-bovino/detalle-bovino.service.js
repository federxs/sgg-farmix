(function () {
    'use strict';

    angular
        .module('app')
        .factory('detalleBovinoService', detalleBovinoService);

    detalleBovinoService.$inject = ['$http', 'portalService'];

    function detalleBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar
        };

        function inicializar(idBovino) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initDetalle',
                params: { idBovino: idBovino },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();