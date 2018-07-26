(function () {
    angular.module('app')
        .factory('reporteBovinoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Reportes/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Bovinos',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: true
                },
                generarPDF: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/BovinosExportarPDF',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                obtenerReportesFiltro: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/BovinosFiltro',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/BovinosExportarExcel',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();