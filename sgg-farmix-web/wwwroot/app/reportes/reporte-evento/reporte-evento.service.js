﻿(function () {
    angular.module('app')
        .factory('reporteEventoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Reportes/', {}, {
                consultarEventos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Eventos',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                generarPDF: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/EventosExportarPDF',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/EventosExportarExcel',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();