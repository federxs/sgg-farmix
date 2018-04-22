(function () {
    'use strict';

    angular
        .module('app')
        .factory('eliminarBovinoService', eliminarBovinoService);

    eliminarBovinoService.$inject = ['$http', 'portalService'];

    function eliminarBovinoService($http, portalService) {
        var service = {
            inicializar: inicializar,
            bajaMuerte: bajaMuerte,
            bajaVenta : bajaVenta
        };

        return service;

        function inicializar(idBovino, codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Bovino/initBaja',
                params: { idBovino: idBovino, codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function bajaMuerte(idBovino, fechaMuerte) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Bovino/darBajaMuerte',
                params: { idBovino: idBovino, fechaMuerte: fechaMuerte },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function bajaVenta(venta) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Bovino/darBajaVenta',
                params: { venta: venta },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
    }
})();