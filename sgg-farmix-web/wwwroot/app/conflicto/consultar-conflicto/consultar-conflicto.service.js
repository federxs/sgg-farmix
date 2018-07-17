(function () {
    angular.module('app')
        .factory('consultarConflictoService', function ($resource, portalService) {
            return $resource(portalService.getUrlServer() + 'api/Inconsistencia', {}, {
                obtenerConflictos: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Inconsistencia/GetList',
                    headers: portalService.getHeadersServer(),
                    isArray: true
                },
                generarPDF: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Inconsistencia/ExportarPDF',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                },
                generarExcel: {
                    method: 'GET',
                    url: portalService.getUrlServer() + 'api/Inconsistencia/ExportarExcel',
                    headers: portalService.getHeadersServer(),
                    isArray: false
                }
            });
        });
})();