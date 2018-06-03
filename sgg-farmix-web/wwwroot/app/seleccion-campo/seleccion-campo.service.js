(function () {
    'use strict';

    angular
        .module('app')
        .factory('seleccionCampoService', seleccionCampoService);

    seleccionCampoService.$inject = ['$http', 'portalService'];

    function seleccionCampoService($http, portalService) {
        var service = {
            consultar: consultar
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

        return service;
    }
})();