(function () {
    'use strict';

    angular
        .module('app')
        .factory('seleccionCampoService', seleccionCampoService);

    seleccionCampoService.$inject = ['$http', 'portalService'];

    function seleccionCampoService($http, portalService) {
        var service = {
            consultar: consultar,
            borrarCampo: borrarCampo
        };

        function consultar(usuario, idRol) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Campo/GetList',
                params: { usuario: usuario, idRol: idRol },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function borrarCampo(codigoCampo) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Campo/BorrarCampo',
                params: { codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();