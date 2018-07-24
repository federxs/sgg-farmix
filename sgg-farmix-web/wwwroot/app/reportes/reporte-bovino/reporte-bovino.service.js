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
                    params: {
                        campo: '@campo',
                        codigoCampo: '@codigoCampo',
                        periodo: '@periodo',
                        usuario: '@usuario'
                    },
                    isArray: false
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Reportes/BovinosExportarExcel',
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