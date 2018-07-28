(function () {
    'use strict';

    angular
        .module('app')
        .factory('estadisticaComparadorService', estadisticaComparadorService);

    estadisticaComparadorService.$inject = ['$http', 'portalService'];

    function estadisticaComparadorService($http, portalService) {
        var service = {
            inicializarCampos: inicializarCampos,
            inicializarPeriodos: inicializarPeriodos
        };
        function inicializarCampos(usuario, idRol) {
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
        function inicializarPeriodos() {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Estadistica/cargarPeriodos',
                params: {},
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
})();