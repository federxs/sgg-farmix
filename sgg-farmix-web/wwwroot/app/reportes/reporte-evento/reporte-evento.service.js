(function () {
    angular.module('app')
        .factory('reporteEventoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Reportes/', {}, {
                inicializar: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/Eventos',
                    headers: portalService.getHeadersServer(),
                    params: {
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: true
                },
                generarPDF: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/EventosExportarPDF',
                    headers: portalService.getHeadersServer(),
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/EventosExportarExcel',
                    headers: portalService.getHeadersServer(),
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo'
                    },
                    isArray: false
                }
            });
        });
})();