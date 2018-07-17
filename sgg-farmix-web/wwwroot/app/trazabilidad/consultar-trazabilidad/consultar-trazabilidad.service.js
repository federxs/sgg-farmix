(function () {
    'use strict';

    angular
        .module('app')
        .factory('consultarTrazabilidadService', consultarTrazabilidadService);

    consultarTrazabilidadService.$inject = ['$http', 'portalService'];

    function consultarTrazabilidadService($http, portalService) {
        var service = {
            getListaEventos: getListaEventos,
            eliminarEvento: eliminarEvento,
            generarPDF: generarPDF,
            generarExcel: generarExcel
        };

        function getListaEventos(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/GetListaEventos',
                params: { filtro: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function eliminarEvento(id) {
            return $http({
                method: 'PUT',
                url: portalService.getUrlServer() + 'api/Evento/DeleteEvento',
                params: { idEvento: id },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarPDF(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/ExportarEventosPDF',
                params: { filtro: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }

        function generarExcel(filtro) {
            return $http({
                method: 'GET',
                url: portalService.getUrlServer() + 'api/Evento/ExportarEventosExcel',
                params: { filtro: filtro },
                headers: portalService.getHeadersServer()
            }).then(
            function (data) {
                return data.data || [];
            });
        }
        return service;
    }
})();