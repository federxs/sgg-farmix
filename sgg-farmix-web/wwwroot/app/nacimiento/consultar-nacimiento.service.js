(function () {
    angular.module('app')
        .factory('consultarNacimientosService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inconsistencia', {}, {
                obtenerNacimientos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Campo/GetNacimientos',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                generarPDF: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Campo/NacimientosExportarPDF',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Campo/NacimientosExportarExcel',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();