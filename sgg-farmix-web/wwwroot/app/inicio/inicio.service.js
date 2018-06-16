(function () {
    'use strict';

    angular
        .module('app')
        .factory('inicioService', inicioService);

    inicioService.$inject = ['$http', 'portalService'];

    function inicioService($http, portalService) {
        var service = {
            inicializar: inicializar,
            obtenerInconsistencias: obtenerInconsistencias,
            prueba: prueba
        };

        function inicializar(id) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Dashboard/Get',
                params: { id: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function obtenerInconsistencias(codigoCampo) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Campo/GetInconsistencias',
                params: { codigoCampo: codigoCampo },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            })
        };

        function prueba(inseminacion, vacas, toros) {
            return $http({
                method: 'POST',
                url: portalService.getUrlServer() + 'api/Inseminacion/Insert',
                params: { inseminacion: inseminacion, listaVacas: vacas, listaToros: toros }
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        return service;
    }
    
})();